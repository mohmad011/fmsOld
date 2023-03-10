import React from "react";
import { useTranslation } from "next-i18next";
import "rc-tree/assets/index.css";
import { Button, Col, Image, Row } from "react-bootstrap";
import Styles from "../../../styles/Filter_tree.module.scss";

const FilterTree = ({
  active,
  config,
  carsIconsFilter,
  setcarsIconsFilter,
  handleMainFilter,
  vehicleIcon,
}) => {
  const { t } = useTranslation("Dashboard");

  const FilterCars = (id) => {
    handleMainFilter("null", false);
    setcarsIconsFilter((prev) => (prev === id ? null : id));
  };

  const cars = [
    {
      id: 1,
      title: t("Running"),
      img: `${vehicleIcon}1.png`,
    },
    {
      id: 0,
      title: t("Stopped"),
      img: `${vehicleIcon}0.png`,
    },
    {
      id: 2,
      title: t("Idling"),
      img: `${vehicleIcon}2.png`,
    },
    {
      id: 5,
      title: t("Offline"),
      img: `${vehicleIcon}5.png`,
    },
    {
      id: 101,
      title: t("Over_Speed"),
      img: `${vehicleIcon}101.png`,
    },
    {
      id: 100,
      title: t("Over_Street_Speed"),
      img: `${vehicleIcon}100.png`,
    },
    {
      id: 201,
      title: t("Invalid_Locations"),
      img: `${vehicleIcon}201.png`,
    },
  ];
  return (
    <div className="mt-3">
      <Row className={`text-center rounded ${Styles.cars}`}>
        {cars?.map((car) => (
          <Col
            data-toggle="tooltip"
            data-placement="bottom"
            data-original-title={car.title}
            title={car.title}
            key={`car_icon_${car?.id}`}
            onClick={() => FilterCars(car?.id)}
            className={` 
            m-1 ${Styles.cars__car} ${active && Styles.active}
            ${
              carsIconsFilter === car?.id
                ? config.language == "ar"
                  ? Styles.btnActiveAr
                  : Styles.btnActive
                : ""
            }
            `}
            xs={1}
          >
            <Button
              type="buttun"
              className={`${
                carsIconsFilter === car?.id ? "" : "bg-transparent opacity-2"
              }  border-0 p-1`}
            >
              <Image
                width={14}
                src={car?.img}
                alt={car?.title}
                title={car?.title}
              />
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default FilterTree;
