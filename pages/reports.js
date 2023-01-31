import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Card } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "styles/Reports.module.scss";
import ReportsOptions from "../components/Reports/ReportsOptions";

import { toast } from "react-toastify";
import SideBarReports from "components/Reports/sideBar";
import TableTaps from "components/Reports/TableTaps";
import UseDarkmode from "hooks/UseDarkmode";
import fs from "fs";
import path from "path";

const Reports = ({ dataSideBar }) => {
  const { config } = useSelector((state) => state);

  const [Data_table, setData_table] = useState([]);
  const [reportApi, setReportApi] = useState("");
  const [vehChecked, setVehChecked] = useState([]);

  const [reportsOptionsShow, setReportsOptionsShow] = useState(false);
  const [showCurrentActiveReportOptions, setShowCurrentActiveReportOptions] =
    useState(false);
  const [reportTitle, setReportTitle] = useState("");

  const [fullSelectedReportData, setFullSelectedReportData] = useState({
    name: "",
    api: "",
    pagination: "",
    startDate: "",
    endDate: "",
    minimumSpeed: 0,
    speedDurationOver: 0,
    fuelData: 0,
    overSpeed: 0,
    tripDuration: false,
    data: [],
  });

  const [reportsTitleSelectedId, setReportsTitleSelectedId] = useState(0);
  const [reportsDataSelected, setReportsDataSelected] = useState([]);
  const [reportsTitleSelected, setReportsTitleSelected] = useState("");

  const [dateStatus, setDateStatus] = useState("");

  const [loadingShowReport, setLoadingShowReport] = useState(false);
  const [loadingShowCurrentReport, setLoadingShowCurrentReport] =
    useState(false);
  const [closeAndOpenReportsList, setCloseAndOpenReportsList] = useState(true);

  const [vehiclesError, setVehiclesError] = useState("");

  const [mainApi, setMainApi] = useState([]);

  useEffect(() => {
    if (reportsOptionsShow || showCurrentActiveReportOptions) {
      document.querySelector(".btn-close").onclick = () => {
        setReportsOptionsShow(false);
        setShowCurrentActiveReportOptions(false);
      };
    }
  }, [reportsOptionsShow, showCurrentActiveReportOptions]);

  // fetch report data
  const fetchReports = async (
    id,
    api,
    name,
    vehChecked,
    fullSelectedReportData
  ) => {
    try {
      const response = await axios.get(`${api}`);

      if (response.status === 200) {
        if (
          Object.hasOwn(response.data, "result") &&
          Array.isArray(response.data?.result)
        ) {
          let newData = [
            ...Data_table,
            {
              ...fullSelectedReportData,
              id,
              total: 0,
              api,
              name,
              vehChecked,
              dateStatus,
              currentPage: 1,
              data: response.data?.result,
            },
          ];
          setFullSelectedReportData((prev) => ({
            ...prev,
            api,
          }));

          fullSelectedReportData.pagination &&
            setMainApi((prev) => [...prev, { id, mainApi: api }]);

          setData_table([...newData]);

          return { res: newData };
        } else {
          let newData = [
            ...Data_table,
            {
              ...fullSelectedReportData,
              id,
              total: 0,
              api,
              name,
              vehChecked,
              dateStatus,
              currentPage: 1,
              data: [],
            },
          ];

          setFullSelectedReportData((prev) => ({
            ...prev,
            api,
          }));
          fullSelectedReportData.pagination &&
            setMainApi((prev) => [...prev, { id, mainApi: api }]);

          setData_table([...newData]);

          return { res: newData };
        }
      } else {
        toast.error(`Error:  ${response.data?.message}`);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error: " + error.response.data?.message);
    }
  };

  const handleApi = (fullSelectedReportData, dateStatus) => {
    const HandleDate = () => {
      let day = new Date().getDate();
      let month = new Date().getMonth() + 1;
      let year = new Date().getFullYear();
      return {
        year,
        Month: month > 9 ? month : `0${month}`,
        Day: day > 9 ? day : `0${day}`,
      };
    };

    // get last and first date for first report
    let hisF = `${
      fullSelectedReportData.endDate.length &&
      fullSelectedReportData.endDate[0].split("T")[0]
    }T00:00:00`; // e.g 2022-07-14
    let dateF = new Date(hisF);
    dateF.setDate(dateF.getDate() + 1);
    let dayL = dateF.getDate() > 9 ? dateF.getDate() : `0${dateF.getDate()}`;
    let hisL = `${dateF.getFullYear()}-${
      dateF.getMonth() + 1 > 9
        ? dateF.getMonth() + 1
        : `0${dateF.getMonth() + 1}`
    }-${dayL}`;

    // get first date for most reports
    let yearF = HandleDate().year;

    let MonthF = HandleDate().Month;

    let DayF = HandleDate().Day;

    let FDate = `${yearF}-${MonthF}-${DayF}T00:00:00`;

    let [yearL, MonthL, DayL] = [yearF, MonthF, DayF];

    let LDate = `${yearL}-${MonthL}-${DayL}T23:59:00`;

    let strDate = fullSelectedReportData.startDate
      ? fullSelectedReportData.startDate
      : FDate;
    let endDate = fullSelectedReportData.endDate
      ? fullSelectedReportData.endDate
      : LDate;
    const recordDate1 = dateStatus === "one" ? hisF : strDate;
    const recordDate2 = dateStatus === "one" ? hisL : endDate;

    // console.log(
    //   "strDate , endDate , recordDate1 , recordDate2",
    //   strDate,
    //   endDate,
    //   recordDate1,
    //   recordDate2
    // );
    const pS = 10;
    const fuelPrice = fullSelectedReportData?.fuelData;

    const duration = fullSelectedReportData?.tripDuration
      ? fullSelectedReportData?.tripDuration
      : fullSelectedReportData?.speedDurationOver;

    const speed = fullSelectedReportData?.overSpeed
      ? fullSelectedReportData?.overSpeed
      : fullSelectedReportData?.minimumSpeed;

    const apiFirstSlice = `${reportApi}?recordDate1=${recordDate1}&recordDate2=${recordDate2}`;
    const apiMidSlice = `strDate=${strDate}&EndDate=${endDate}&vehIDs=${vehChecked?.map(
      (v) => v.VehicleID
    )}&fuelPrice=${fuelPrice}`;
    const apiEndSlice = `speed=${speed}&duration=${duration}&pageNumber=1&pageSize=${pS}&pagesCount=5`;
    return `${apiFirstSlice}&${apiMidSlice}&${apiEndSlice}`;
  };

  const ShowReports = async (Show, name, fullSelectedReportData) => {
    if (Show === "Show") {
      // check if user clicked on the show button
      if (vehChecked.length) {
        // check if there is a vehChecked
        setVehiclesError(""); // reset setVehiclesError
        setLoadingShowReport(true); // asign loadingShowReport state to true
        const id = Math.random().toString(32).substring(3);
        const api = handleApi(fullSelectedReportData, dateStatus);
        try {
          const { res } = await fetchReports(
            id,
            api,
            name,
            vehChecked,
            fullSelectedReportData
          );

          const lastItem = res.find((tab) => tab.id === id);

          setFullSelectedReportData((prev) => ({
            ...prev,
            id,
            name,
            data: [...prev.data, { id, name }],
          }));

          setReportsTitleSelected(reportTitle);
          setReportsTitleSelectedId(id);

          setReportsDataSelected(lastItem);
        } catch (err) {
          console.log("error", err);
        } finally {
          setReportsOptionsShow(false);
          setLoadingShowReport(false);
        }
      } else {
        setVehiclesError("Please Select At Least one Vehicle");
      }
    } else if (Show === "updateCurrentActiveReportOptions") {
      // check if user clicked on the show button
      if (reportsDataSelected.vehChecked.length) {
        // check if there is a vehChecked
        setVehiclesError(""); // reset setVehiclesError
        setLoadingShowCurrentReport(true); // asign loadingShowReport state to true
        const api = handleApi(fullSelectedReportData, dateStatus);
        try {
          const response = await axios.get(`${api}`);
          setReportsDataSelected([]);
          setReportsTitleSelected("");
          setReportsTitleSelectedId(0);
          if (response.status === 200) {
            if (
              Object.hasOwn(response.data, "result") &&
              Array.isArray(response.data?.result)
            ) {
              setData_table((prev) => {
                let selectedReport = prev.find(
                  (item) => item.id === fullSelectedReportData.id
                );
                selectedReport.data = response.data?.result;
                selectedReport.api = api;
                selectedReport.startDate = fullSelectedReportData.startDate;
                selectedReport.endDate = fullSelectedReportData.endDate;
                selectedReport.vehChecked = vehChecked?.map((v) => v.VehicleID);

                fullSelectedReportData.pagination &&
                  setMainApi((prev) => {
                    let selectedApi = prev?.find(
                      (item) => item.id === fullSelectedReportData.id
                    );
                    selectedApi.mainApi = api;
                    return prev;
                  });
                setReportsTitleSelected(selectedReport.name);
                setReportsTitleSelectedId(selectedReport.id);

                setReportsDataSelected(selectedReport);
                return prev;
              });
            } else {
              setData_table((prev) => {
                let selectedReport = prev.find(
                  (item) => item.id === fullSelectedReportData.id
                );
                selectedReport.data = [];
                selectedReport.api = "";
                selectedReport.startDate = fullSelectedReportData.startDate;
                selectedReport.endDate = fullSelectedReportData.endDate;
                selectedReport.vehChecked = vehChecked?.map((v) => v.VehicleID);

                fullSelectedReportData.pagination &&
                  setMainApi((prev) => {
                    let selectedApi = prev.find(
                      (item) => item.id === fullSelectedReportData.id
                    );
                    selectedApi.mainApi = api;
                    return prev;
                  });
                setReportsTitleSelected(selectedReport.name);
                setReportsTitleSelectedId(selectedReport.id);

                setReportsDataSelected(selectedReport);
                return prev;
              });
            }
          } else {
            toast.error(`Error:  ${response.data?.message}`);
          }
        } catch (error) {
          console.log(error.message);
          toast.error("Error: " + error.response.data?.message);
        } finally {
          setLoadingShowCurrentReport(false);
        }
      } else {
        setVehiclesError("Please Select At Least one Vehicle");
      }
    } else {
      setVehiclesError("");
    }
  };

  // switching between taps
  const handleTap = (name, id) => {
    // filter Data_table by id
    let listFiltered = Data_table.find((item) => item.id === id);

    // reset reportsTitleSelectedId to 0
    setReportsTitleSelectedId(0);

    // reset loadingShowReport to false
    setLoadingShowReport(false);

    // add new selected reports's data to setReportsDataSelected
    setReportsDataSelected(listFiltered);

    // add selected report title to setReportsTitleSelected
    setReportsTitleSelected(name);

    // add selected report id to setReportsTitleSelectedId then return it
    setReportsTitleSelectedId(id);

    // add set vehicles to tree
    setVehChecked(listFiltered?.vehChecked);
  };

  // handle icon to open Reports List
  const handleCloseAndOpenReportsList = (status) =>
    setCloseAndOpenReportsList(status);

  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    e.persist();

    // filter tabs not match the id
    // let reportTabsFiltered = reportTabs.filter((item) => item[0] !== id);
    let reportTabsFiltered = fullSelectedReportData?.data?.filter(
      (item) => item?.id !== id
    );
    // re set tabs filtered
    setFullSelectedReportData((prev) => ({
      ...prev,
      data: reportTabsFiltered,
    }));

    // filter Data_table with the last reportTabsFiltered tab
    let listFiltered = Data_table.filter((item) => item.id !== id);
    let lastListFiltered = listFiltered[listFiltered.length - 1];
    setData_table(listFiltered);

    // check if listFiltered have elements if yes re set reportsDataSelected state
    // with new value of allData_tableOther filtered
    listFiltered.length
      ? setReportsDataSelected(lastListFiltered)
      : setReportsDataSelected([]);

    if (!listFiltered.length) {
      setReportsTitleSelected("");
      return setReportsTitleSelectedId(0);
    }
    // re set target title with new last reportTabsFiltered
    if (reportTabsFiltered[reportTabsFiltered.length - 1]) {
      setReportsTitleSelected(
        reportTabsFiltered[reportTabsFiltered.length - 1]?.name
      );
      setReportsTitleSelectedId(
        reportTabsFiltered[reportTabsFiltered.length - 1]?.id
      );
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <div className={`position-relative h-100`}>
            <div
              className={`position-absolute ${style.DropdownChild} shadow-sm`}
              style={{
                opacity: closeAndOpenReportsList ? 1 : 0,
                zIndex: closeAndOpenReportsList ? 900 : -1,
                transition: "all 0.5s",
                backgroundColor: UseDarkmode("#151824", "rgb(235 235 235)"),
              }}
            >
              <SideBarReports
                handleCloseAndOpenReportsList={handleCloseAndOpenReportsList}
                reportsTitleSelected={reportsTitleSelected}
                setReportsTitleSelected={setReportsTitleSelected}
                setReportsOptionsShow={setReportsOptionsShow}
                setReportTitle={setReportTitle}
                setReportApi={setReportApi}
                setDateStatus={setDateStatus}
                setFullSelectedReportData={setFullSelectedReportData}
                setData_table={setData_table}
                setVehChecked={setVehChecked}
                dataSideBar={dataSideBar}
              />
              {reportsOptionsShow ? (
                <div className="position-relative">
                  <ReportsOptions
                    show={reportsOptionsShow}
                    onHide={ShowReports}
                    reportsTitleSelected={reportsTitleSelected}
                    loadingShowReport={loadingShowReport}
                    dateStatus={dateStatus}
                    setVehiclesError={setVehiclesError}
                    vehiclesError={vehiclesError}
                    setFullSelectedReportData={setFullSelectedReportData}
                    fullSelectedReportData={fullSelectedReportData}
                    vehChecked={vehChecked}
                    setVehChecked={setVehChecked}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <TableTaps
            fullSelectedReportData={fullSelectedReportData}
            reportsTitleSelectedId={reportsTitleSelectedId}
            handleTap={handleTap}
            config={config}
            handleCloseTab={handleCloseTab}
            style={style}
            Data_table={Data_table}
            setData_table={setData_table}
            reportsDataSelected={reportsDataSelected}
            reportsTitleSelected={reportsTitleSelected}
            mainApi={mainApi}
            ///////////
            show={showCurrentActiveReportOptions}
            setShow={setShowCurrentActiveReportOptions}
            ShowReports={ShowReports}
            loadingShowCurrentReport={loadingShowCurrentReport}
            dateStatus={dateStatus}
            setVehiclesError={setVehiclesError}
            vehiclesError={vehiclesError}
            setFullSelectedReportData={setFullSelectedReportData}
            vehChecked={vehChecked}
            setVehChecked={setVehChecked}
          />
        </Card.Body>
      </Card>
      <button
        onClick={() => handleCloseAndOpenReportsList(true)}
        className={`${style.hamburger}`}
        style={{
          opacity: closeAndOpenReportsList ? 0 : 1,
          zIndex: closeAndOpenReportsList ? -1 : 888,
          transition: "all 0.2s",
        }}
      >
        <span
          className={`${style.hamburger__patty}`}
          style={{ background: UseDarkmode("#dedee2", "#151824") }}
        />
        <span
          className={`${style.hamburger__patty}`}
          style={{ background: UseDarkmode("#dedee2", "#151824") }}
        />
        <span
          className={`${style.hamburger__patty}`}
          style={{ background: UseDarkmode("#dedee2", "#151824") }}
        />
      </button>
    </>
  );
};

export default Reports;

// translation ##################################
export async function getStaticProps({ locale }) {
  const filePath = path.join(process.cwd(), "data", "static.json");
  const jsonData = fs.readFileSync(filePath);
  const dataSideBar = JSON.parse(jsonData);

  return {
    props: {
      dataSideBar,
      ...(await serverSideTranslations(locale, [
        "reports",
        "preventiveMaintenance",
        "Table",
        "main",
      ])),
    },
  };
}
// translation ##################################
