import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Google = dynamic(() => import("components/dashboard/google"), {
  ssr: false,
});

import Progress from "components/dashboard/Progress/index";

// Chart Components
import AverageUtilizationChart from "components/dashboard/Charts/AverageUtilizationChart";

import VehiclesStatusChart from "components/dashboard/Charts/VehiclesStatusChart";
import AverageSpeedAndDistanceChart from "components/dashboard/Charts/AverageSpeedAndDistanceChart";
import OverallPreventiveMaintenance from "components/dashboard/Charts/ OverallPreventiveMaintenance";

// import NextrepairplansTable
import NextrepairplansTable from "components/dashboard/NextrepairplansTable";

// import CardsForRates
import CardsForRates from "components/dashboard/CardsForRates";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useStreamDataState from "hooks/useStreamDataState";
import dynamic from "next/dynamic";
import { updateStRunning } from "lib/slices/StreamData";
import { useSession } from "next-auth/client";

import TagManager from 'react-gtm-module'


const Home = () => {
  const [session] = useSession();
  const gtmDataLayer = {
    userId: session?.user?.user?.id ?? 'Guest',
    userProject: 'FMS',
    page: 'index'
  };
  const gtmArgs = {
      dataLayer: gtmDataLayer,
      dataLayerName: 'PageDataLayer'
  };

  TagManager.dataLayer(gtmArgs)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [DashboardData, setDashboardData] = useState(null);
  const [speedChartData, setSpeedChartData] = useState([]);
  const [speedChartDataLoading, setSpeedChartDataLoading] = useState(false);
  const [preventiveChartData, setPreventiveChartData] = useState([]);
  const [preventiveChartDataLoading, setPreventiveChartDataLoading] =
    useState(false);
  const [averageUtilizationChart, setAverageUtilizationChart] = useState([]);
  const [averageUtilizationChartLoading, setAverageUtilizationChartLoading] =
    useState(false);

  const { VehFullData, VehTotal, running } = useSelector(
    (state) => state.streamData
  );
  const { myMap } = useSelector((state) => state.mainMap);
  const { darkMode } = useSelector((state) => state.config);
  const { trackStreamLoader } = useStreamDataState();

  // progress count up wait till loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(VehTotal).length > 0) {
        setLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [VehTotal]);

  useEffect(() => {
    if (myMap && !running) {
      myMap?.deselectAll();
      trackStreamLoader(VehFullData);
      dispatch(updateStRunning());
    }
  }, [myMap]);

  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html")[0];
    darkMode
      ? htmlTag.setAttribute("darkMode", true)
      : htmlTag.setAttribute("darkMode", false);
  }, [darkMode]);

  useEffect(() => {
    // fetch Overall Preventive Maintenance chart data
    const fetchPreventiveData = async () => {
      if (localStorage.getItem("preventiveData")) {
        const preventiveData = JSON.parse(
          localStorage.getItem("preventiveData")
        );
        setPreventiveChartData(preventiveData || {});
        setPreventiveChartDataLoading(false);
      } else {
        setPreventiveChartDataLoading(true);
        try {
          const respond = await axios.get(`dashboard/mainDashboard/home`);
          if (respond.status === 200) {
            setPreventiveChartData(respond?.data || {});
            localStorage.setItem(
              "preventiveData",
              JSON.stringify(respond?.data || {})
            );
            setPreventiveChartDataLoading(false);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message);
          setPreventiveChartDataLoading(false);
        }
      }
      return true;
    };
    fetchPreventiveData();

    // top and low rated drivers
    const fetchTopLowData = async () => {
      if (localStorage.getItem("DashboardData")) {
        const TopWorstData = JSON.parse(localStorage.getItem("DashboardData"));
        setDashboardData(TopWorstData);
      }
      await axios
        .get(`dashboard/mainDashboard/topWorst`)
        .then(({ data }) => {
          setDashboardData(data);
          localStorage.setItem("DashboardData", JSON.stringify(data));
        })
        .catch((error) => {
          toast.error(error?.message);
        });
      return true;
    };
    fetchTopLowData();

    // fetch Average Utilization chart data
    const fetchAverageUtilizationData = async () => {
      if (localStorage.getItem("averageUtilizationChart")) {
        const UtilizationChart = JSON.parse(
          localStorage.getItem("averageUtilizationChart")
        );
        setAverageUtilizationChart(UtilizationChart);
        setAverageUtilizationChartLoading(false);
      } else {
        setAverageUtilizationChartLoading(true);
        try {
          const respond = await axios.get(
            `dashboard/mainDashboard/avgUtlization`
          );
          setAverageUtilizationChart(respond.data.avgUtlizations);
          localStorage.setItem(
            "averageUtilizationChart",
            JSON.stringify(respond.data.avgUtlizations)
          );
          setAverageUtilizationChartLoading(false);
        } catch (error) {
          toast.error(error?.response?.data?.message);
          setAverageUtilizationChartLoading(false);
        }
      }
      return true;
    };
    fetchAverageUtilizationData();

    // fetch Overall average speed chart data
    const fetchAverageSpeedData = async () => {
      if (localStorage.getItem("speedChart")) {
        const speedChart = JSON.parse(localStorage.getItem("speedChart"));
        setSpeedChartData(speedChart);
        setSpeedChartDataLoading(false);
      } else {
        setSpeedChartDataLoading(true);
        try {
          const respond = await axios.get(`dashboard/mainDashboard/fuel`);
          setSpeedChartData(respond.data.fuelConsumptions);
          localStorage.setItem(
            "speedChart",
            JSON.stringify(respond.data.fuelConsumptions)
          );
          setSpeedChartDataLoading(false);
        } catch (error) {
          toast.error(error?.response?.data?.message);
          setSpeedChartDataLoading(false);
        }
      }
      return true;
    };
    fetchAverageSpeedData();
  }, []);

  return (
    <div className="p-3">
      <Row>
        {/* ############################  progress bars + Map  ############################################## */}
        <Col lg="6">
          <Row>
            <Progress loading={loading} VehTotal={VehTotal} />
          </Row>
        </Col>
        {/* map */}
        <Col lg="6">
          <Card style={{ height: "calc(100% - 2rem)", overflow: "hidden" }}>
            <Card.Body className="p-0 position-relative">
              <Google />
              {/* <Google myMap={myMap} /> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* ############################  Charts  ############################################## */}
      <Row>
        {/* charts part one */}
        <VehiclesStatusChart VehTotal={VehTotal} />

        {/* charts part two */}
        <AverageUtilizationChart
          data={averageUtilizationChart}
          loading={averageUtilizationChartLoading}
        />
      </Row>
      <Row>
        {/* chart part three */}
        <AverageSpeedAndDistanceChart
          data={speedChartData}
          loading={speedChartDataLoading}
        />

        {/* chart part four */}
        <OverallPreventiveMaintenance
          data={preventiveChartData?.allMaintenance || []}
          loading={preventiveChartDataLoading}
        />
      </Row>

      {/* ############################ cards for rates  ############################################## */}
      <Row>
        <CardsForRates data={DashboardData} />
      </Row>
      {/* ############################ table  ############################################## */}
      <Row>
        <NextrepairplansTable
          data={preventiveChartData?.Upcoming_Maintenance_Plans || []}
        />
      </Row>
    </div>
  );
};

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ["Dashboard", "main"])),
    },
  };
}
export default Home;

// translation ##################################
