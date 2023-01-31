import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import dateFormat from "dateformat";
import style from "styles/ReportsOptions.module.scss";
import "rsuite/dist/rsuite.min.css";
import { DateRangePicker, DatePicker } from "rsuite";
import { useTranslation } from "next-i18next";
import UseDarkmode from "hooks/UseDarkmode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { CustomInput } from "../CustomInput";
import { encryptName } from "helpers/encryptions";
import MenuTreeReports from "components/tree/MenuTreeReports";
import usePredefinedBottomRanges from "components/history/usePredefinedBottomRanges";
import { useSelector } from "react-redux";

const { afterToday } = DateRangePicker;

const ReportsOptions = (props) => {
  const { t } = useTranslation("reports");
  const [treeFilter, setTreeFilter] = useState("");
  const vehicleIds = useSelector((state) => state?.vehicleIds);
  let { vehData } =
    JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") ?? [];
  const [treeData, setTreeData] = useState(vehData);

  const handleDateOneInput = (e) => {
    const dateformat = e.toString()?.split("GMT");
    const endFormat = [dateFormat(dateformat[0], "isoDateTime")?.split("+")[0]];

    props.setFullSelectedReportData((prev) => ({
      ...prev,
      startDate: "",
      endDate: endFormat,
    }));
  };

  const handleDateTwoInput = (e) => {
    const dateformat = e?.map((x) => x.toString()?.split(" GMT")[0]);
    const updateFormat = dateformat?.map((x) => dateFormat(x, "isoDateTime"));
    const endFormat = updateFormat?.map((x) => x?.split("+")[0]);

    props.setFullSelectedReportData((prev) => ({
      ...prev,
      startDate: endFormat[0],
      endDate: endFormat[1],
    }));
  };

  const handleAdvancedOptions = (e) => {
    props.setFullSelectedReportData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilter = (e) => {
    setTreeFilter(e.target.value.toLocaleLowerCase());
    e.target.value.toLocaleLowerCase()
      ? setTreeData(
          vehData.filter((item) => {
            const filterDisplayName = item.DisplayName.includes(
              e.target.value.toLocaleLowerCase()
            );
            const filterSerialNumber = item.SerialNumber.includes(
              e.target.value.toLocaleLowerCase()
            );
            return filterDisplayName || filterSerialNumber;
          })
        )
      : setTreeData(vehData);
  };

  const predefinedBottomRanges = usePredefinedBottomRanges();

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          borderBottomColor: UseDarkmode("#151824", "#DDD"),
        }}
      >
        <div
          className={`d-flex justify-content-center align-items-center ${style.bxTitleIcon}`}
        >
          <span>
            <FontAwesomeIcon
              icon={faFileAlt}
              className={`${style.icon} text-${UseDarkmode(
                "light",
                "primary"
              )}`}
            />
          </span>
          <span className="text-center fs-6 w-50">
            {t(props.reportsTitleSelected)}
          </span>
        </div>
      </Modal.Header>

      <Modal.Body
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          overflow: "hidden",
        }}
      >
        <Row>
          {/* =====| select date |===== */}
          <Col md="12">
            {props.dateStatus === "two" ? (
              <>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>{t("Select_Date_Range_key")}</Form.Label>
                  <DateRangePicker
                    className="w-100 bg-transparent"
                    onOk={(e) => handleDateTwoInput(e)}
                    onChange={(e) => handleDateTwoInput(e)}
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder={t("Select_Date_Range_key")}
                    disabledDate={afterToday()}
                    ranges={predefinedBottomRanges}
                    defaultValue={[
                      new Date(
                        new Date(
                          new Date(new Date().setSeconds("00")).setMinutes("00")
                        ).setHours("00")
                      ),
                      new Date(),
                    ]}
                    locale={{
                      sunday: t("Su"),
                      monday: t("Mo"),
                      tuesday: t("Tu"),
                      wednesday: t("We"),
                      thursday: t("Th"),
                      friday: t("Fr"),
                      saturday: t("Sa"),
                      ok: t("OK"),
                      today: t("Today"),
                      yesterday: t("Yesterday"),
                      hours: t("Hours"),
                      minutes: t("Minutes"),
                      seconds: t("Seconds"),
                      last7Days: t("last7Days"),
                      January: t("January"),
                      February: t("February"),
                      March: t("March"),
                      April: t("April"),
                      May: t("May"),
                      June: t("June"),
                      July: t("July"),
                      August: t("August"),
                      September: t("September"),
                      October: t("October"),
                      november: t("nov"),
                      december: t("De"),
                    }}
                  />
                </Form.Group>
              </>
            ) : props.dateStatus === "one" ? (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>{t("Select_Date_key")}</Form.Label>
                <DatePicker
                  className="w-100 bg-transparent"
                  onOk={(e) => handleDateOneInput(e)}
                  onChange={(e) => handleDateOneInput(e)}
                  placeholder={t("Select_Date_key")}
                  disabledDate={afterToday()}
                  showMeridian
                  defaultValue={
                    new Date(
                      new Date(
                        new Date(new Date().setSeconds("00")).setMinutes("00")
                      ).setHours("00")
                    )
                  }
                  locale={{
                    sunday: t("Su"),
                    monday: t("Mo"),
                    tuesday: t("Tu"),
                    wednesday: t("We"),
                    thursday: t("Th"),
                    friday: t("Fr"),
                    saturday: t("Sa"),
                    ok: t("OK"),
                    today: t("Today"),
                    yesterday: t("Yesterday"),
                    hours: t("Hours"),
                    minutes: t("Minutes"),
                    seconds: t("Seconds"),
                    last7Days: t("last7Days"),
                    January: t("January"),
                    February: t("February"),
                    March: t("March"),
                    April: t("April"),
                    May: t("May"),
                    June: t("June"),
                    July: t("July"),
                    August: t("August"),
                    September: t("September"),
                    October: t("October"),
                    november: t("nov"),
                    december: t("De"),
                  }}
                />
              </Form.Group>
            ) : null}
          </Col>

          {/* =====| select date |===== */}
          {t(props.reportsTitleSelected) === t("Fuel_Summary_Report_key") && (
            <CustomInput
              ClassN="col-6"
              Type="number"
              Placeholder={t("Fuel_Price_RS_key")}
              handleChange={handleAdvancedOptions}
              Name="fuelData"
            />
          )}

          {/* =====| select date |===== */}

          {t(props.reportsTitleSelected) === t("Over_Speed_Report_key") && (
            <CustomInput
              ClassN="col-6"
              Type="number"
              Placeholder={t("Minimum_Speed_KMH_key")}
              handleChange={handleAdvancedOptions}
              Name="overSpeed"
            />
          )}

          {t(props.reportsTitleSelected) ===
            t("Speed_Over_Duration_Report_key") && (
            <>
              <CustomInput
                ClassN="col-6"
                Type="number"
                Placeholder={t("Minimum_Speed_KMH_key")}
                handleChange={handleAdvancedOptions}
                Name="minimumSpeed"
              />
              <CustomInput
                ClassN="col-6"
                Type="number"
                Placeholder={t("Duration_Seconds_key")}
                handleChange={handleAdvancedOptions}
                Name="speedDurationOver"
              />
            </>
          )}

          {props.dateStatus === "two" && (
            <CustomInput
              ClassN="col"
              Type="text"
              Placeholder={t("displayName_or_serialNumber_key")}
              handleChange={handleFilter}
            />
          )}
          {props.dateStatus === "one" && (
            <CustomInput
              ClassN="col"
              Type="text"
              Placeholder={t("displayName_or_serialNumber_key")}
              handleChange={handleFilter}
            />
          )}

          {/* {t(props.reportsTitleSelected) === t("Trip_Report_key") && (
            <CustomInput
              ClassN="col-6"
              Type="text"
              Placeholder={t("Duration_Seconds_key")}
              handleChange={handleAdvancedOptions}
              Name="tripDuration"
            />
          )} */}

          {props.dateStatus !== "two" && props.dateStatus !== "one" ? (
            <>
              <CustomInput
                ClassN="col"
                Type="text"
                // Label={t("Select_Vehicles_key")}
                Placeholder={t("displayName_or_serialNumber_key")}
                handleChange={handleFilter}
              />
            </>
          ) : (
            <span className={`text-secondary d-block mt-4 mb-4`}>
              {/* {t("Select_Vichales")} */}
              Select Vehicles
            </span>
          )}
          {props.vehiclesError && (
            <span className="text-danger fs-6">{props.vehiclesError}</span>
          )}
          <MenuTreeReports
            setVehiclesError={props.setVehiclesError}
            treeFilter={treeFilter}
            vehData={treeData}
            vehicleIds={vehicleIds}
            vehChecked={props.vehChecked}
            setVehChecked={props.setVehChecked}
          />
        </Row>
      </Modal.Body>
      <Modal.Footer
        style={{
          background: UseDarkmode("#222738", "#FFFFFF"),
          borderTopColor: UseDarkmode("#151824", "#DDD"),
        }}
      >
        <Button
          className="my-0 mx-auto  py-2 px-5"
          onClick={() =>
            props.onHide(
              "Show",
              props.reportsTitleSelected,
              props.fullSelectedReportData
            )
          }
          disabled={props.loadingShowReport}
        >
          {props.loadingShowReport ? t("Loading_key") : t("Show_Reports_key")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportsOptions;
