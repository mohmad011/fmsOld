import React, { useEffect, useState } from "react";
import axios from "axios";

// Bootstrap
import { Form, Modal } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import config from "../../../config/config";
import { UpdateVehicle } from "../../../lib/slices/vehicleProcessStatus";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

export default function EditInfo({ show, setShow }) {
  const dispatch = useDispatch();
  const {
    auth: { user },
    config: { darkMode },
    firebase: { Vehicles },
  } = useSelector((state) => state);

  const [loading, setloading] = useState(false);
  const [Mileage, setMileage] = useState("");
  const { t } = useTranslation("common");

  const Dark = darkMode ? "bg-dark" : "";

  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("CalibrateMileageBtn")
      .getAttribute("data-id");

    const Index = Vehicles.findIndex((x) => x.VehicleID == id);
    const the_vehicle = Vehicles.find((ele) => ele.VehicleID == id);

    const updated_data = { ...the_vehicle, Mileage };

    axios
      .put(`${config.apiGateway.URL}dashboard/vehicles/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.new_token}`,
        },
        data: JSON.stringify({ ...updated_data }),
      })
      .then(() => {
        dispatch(
          UpdateVehicle([
            ...Vehicles.slice(0, Index),
            { ...updated_data },
            ...Vehicles.slice(Index + 1),
          ])
        );
      })
      .catch((er) => {
        console.log(er);
        toast.error(er.message);
      })
      .finally(() => {
        setloading(false);
        handleClose();
      });
  };

  // Add old data to the input
  useEffect(() => {
    const id = document
      .getElementById("CalibrateMileageBtn")
      .getAttribute("data-id");
    if (show) {
      const Ele = Vehicles?.find((ele) => ele?.VehicleID == id);
      setMileage(Ele?.Mileage);
    }
  }, [show]);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={`${Dark}`}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h3>{t('calibrate_mileage_key')}</h3>
          <p className="lead">
            {t("the_new_value_could_take_upto_an_hour_to_be_reflected_on_the_system_key")}
          </p>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRq}>
        <Modal.Body className={`p-3 mb-3 ${Dark}`}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="Mileage">{t("mileage_key")}</Form.Label>
            <Form.Control
              name="Mileage"
              type="text"
              id="Mileage"
              placeholder={t("mileage_key")}
              value={Mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={`${Dark}`}>
          <div className="d-flex justify-content-around">
            <button
              disabled={loading}
              className="btn btn-primary px-3 py-2 ms-3"
              type="submit"
            >
              {!loading ? (
                <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
              ) : (
                <FontAwesomeIcon
                  className="mx-2 fa-spin"
                  icon={faSpinner}
                  size="sm"
                />
              )}
              {t("calibrate_key")}
            </button>
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              {t("cancel_key")}
            </button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
