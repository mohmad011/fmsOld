import { useTranslation } from "next-i18next";
import React from "react";
import { Card, Col } from "react-bootstrap";
import DProgress from "./dProgress";

export default function Index({ VehTotal, loading }) {
  const { t } = useTranslation("Dashboard");
  const totalVehs = VehTotal?.totalVehs || 0;
  const ActiveVehs = VehTotal?.activeVehs || 0;
  const PercentageActiveVehcles =
    ((ActiveVehs * 100) / totalVehs).toFixed(1) || 0;

  const OfflineVehs = VehTotal?.offlineVehs || 0;
  const PercentageOfflineVehs =
    ((OfflineVehs * 100) / totalVehs).toFixed(1) || 0;

  const AllDrivers = VehTotal?.totalDrivers || 0;
  const ActiveDrivers = VehTotal?.activeDrivers || 0;
  const PercentageActiveDrivers =
    ((ActiveDrivers * 100) / AllDrivers).toFixed(1) || 0;

  return (
    <>
      <Col sm="12">
        <Card>
          <Card.Body>
            <DProgress
              loading={loading}
              duration={1.5}
              name={["Active_Vehicles", "Total_Vehicles"]}
              countStart={[0, 0]}
              countEnd={[ActiveVehs, totalVehs]}
              dateType={t("Monthly")}
              progresCount={PercentageActiveVehcles}
              color={"primary"}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col sm="12">
        <Card>
          <Card.Body>
            <DProgress
              loading={loading}
              duration={1.5}
              name={["Offline_Vehicles"]}
              countStart={[0]}
              countEnd={[OfflineVehs]}
              dateType={t("Annual")}
              progresCount={PercentageOfflineVehs}
              color={"warning"}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col sm="12">
        <Card>
          <Card.Body>
            <DProgress
              loading={loading}
              duration={1.5}
              name={["Active_Drivers", "Total_Drivers"]}
              countStart={[0, 0]}
              countEnd={[ActiveDrivers, AllDrivers]}
              dateType={t("Today")}
              progresCount={PercentageActiveDrivers}
              color={"danger"}
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
