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

const CurrentActiveReportOptions = (props) => {
  const { t } = useTranslation("reports");
  const [treeFilter, setTreeFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);

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

  const handleDateTwoInput = () => {
    const dateformat = dateRange?.map((x) => x.toString()?.split(" GMT")[0]);
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

  const handleSelectedVecs = () => props.setShow((prev) => !prev);

  const predefinedBottomRanges = usePredefinedBottomRanges();

  const handleDatePickerValue = (date) => getFullDate(date);

  const getFullDate = (date) => {
    let getYear = date?.split("T")[0]?.split("-")[0];
    let getMonth = +date?.split("T")[0]?.split("-")[1];
    let getDay = date?.split("T")[0]?.split("-")[2];
    let getHour = date?.split("T")[1]?.split(":")[0];
    let getMinute = date?.split("T")[1]?.split(":")[1];
    let getSecond = date?.split("T")[1]?.split(":")[2];

    let dateNow = new Date();
    dateNow.setFullYear(getYear);
    dateNow.setMonth(getMonth - 1);
    dateNow.setDate(getDay);

    dateNow.setHours(getHour);
    dateNow.setMinutes(getMinute);
    dateNow.setSeconds(getSecond);

    return dateNow;
  };
  const handleDateRangePickerValue = (strDate, endDate) => [
    getFullDate(strDate),
    getFullDate(endDate),
  ];

  return (
    <>
      <Row>
        {/* =====| select date |===== */}
        <Col md="3">
          {props.dateStatus === "two" ? (
            <>
              <Form.Group
                className="mb-3 d-flex flex-column"
                controlId="exampleForm.ControlInput1"
              >
                <DateRangePicker
                  className="order-2 w-100 bg-transparent"
                  onChange={setDateRange}
                  onExiting={handleDateTwoInput}
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder={t("Select_Date_Range_key")}
                  disabledDate={afterToday()}
                  ranges={predefinedBottomRanges}
                  defaultValue={
                    props.fullSelectedReportData.startDate &&
                    props.fullSelectedReportData.endDate
                      ? handleDateRangePickerValue(
                          props.fullSelectedReportData.startDate,
                          props.fullSelectedReportData.endDate
                        )
                      : [
                          new Date(
                            new Date(
                              new Date(new Date().setSeconds("00")).setMinutes(
                                "00"
                              )
                            ).setHours("00")
                          ),
                          new Date(),
                        ]
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
                <Form.Label className="order-1">
                  {t("Select_Date_Range_key")}
                </Form.Label>
              </Form.Group>
            </>
          ) : props.dateStatus === "one" ? (
            <Form.Group
              className="mb-3 d-flex flex-column"
              controlId="exampleForm.ControlInput1"
            >
              <DatePicker
                className="order-2 w-100 bg-transparent"
                onOk={(e) => handleDateOneInput(e)}
                onChange={(e) => handleDateOneInput(e)}
                placeholder={t("Select_Date_key")}
                disabledDate={afterToday()}
                defaultValue={
                  Array.isArray(props?.fullSelectedReportData?.endDate)
                    ? handleDatePickerValue(
                        props.fullSelectedReportData.endDate[0]
                      )
                    : new Date(
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
              <Form.Label className="order-1">
                {t("Select_Date_key")}
              </Form.Label>
            </Form.Group>
          ) : null}
        </Col>

        {/* =====| select date |===== */}
        {t(props.reportsDataSelected.name) === t("Fuel_Summary_Report_key") && (
          <CustomInput
            ClassN="col-md-3"
            Type="number"
            Label={t("Fuel_Price_(RS)_key")}
            Placeholder={t("Fuel_Price_(RS)_key")}
            handleChange={handleAdvancedOptions}
            Name="fuelData"
          />
        )}

        {/* =====| select date |===== */}

        {t(props.reportsDataSelected.name) === t("Over_Speed_Report_key") && (
          <CustomInput
            ClassN="col-md-3"
            Type="number"
            Label={t("Minimum_Speed_KMH_key")}
            Placeholder={t("Minimum_Speed_KMH_key")}
            handleChange={handleAdvancedOptions}
            Name="overSpeed"
          />
        )}

        {t(props.reportsDataSelected.name) ===
          t("Speed_Over_Duration_Report_key") && (
          <>
            <CustomInput
              ClassN="col-md-3"
              Type="number"
              Label={t("Minimum_Speed_KMH_key")}
              Placeholder={t("Minimum_Speed_KMH_key")}
              handleChange={handleAdvancedOptions}
              Name="minimumSpeed"
            />
            <CustomInput
              ClassN="col-md-3"
              Type="number"
              Label={t("Duration_Seconds_key")}
              Placeholder={t("Duration_Seconds_key")}
              handleChange={handleAdvancedOptions}
              Name="speedDurationOver"
            />
          </>
        )}

        {props.dateStatus === "one" && (
          <CustomInput
            ClassN="col-md-3"
            Type="text"
            Label={t("displayName_or_serialNumber_key")}
            Placeholder={t("displayName_or_serialNumber_key")}
            handleChange={handleFilter}
          />
        )}

        {/* {t(props.reportsDataSelected.name) === t("Trip_Report_key") && (
          <CustomInput
            ClassN="col-md-3"
            Type="text"
            Label={t("Duration_Seconds_key")}
            Placeholder={t("Duration_Seconds_key")}
            handleChange={handleAdvancedOptions}
            Name="tripDuration"
          />
        )} */}

        {props.dateStatus !== "two" && props.dateStatus !== "one" ? (
          <>
            <CustomInput
              ClassN="col-md-3"
              Type="text"
              Label={t("Select_Vehicles_key")}
              Placeholder={t("displayName_or_serialNumber_key")}
              handleChange={handleFilter}
            />
          </>
        ) : (
          ""
        )}
        <Col md={3} className="d-flex align-items-end gap-2 mb-3">
          <Button
            variant="primary"
            className=" px-4 py-2 my-1 rounded"
            onClick={handleSelectedVecs}
          >
            Select Vehicles
          </Button>{" "}
          <Button
            onClick={() =>
              props.onHide(
                "updateCurrentActiveReportOptions",
                props.reportsDataSelected.name,
                props.fullSelectedReportData
              )
            }
            variant="primary"
            className=" px-4 py-2 my-1 rounded"
            disabled={props.loadingShowCurrentReport}
          >
            {props.loadingShowCurrentReport
              ? t("Loading_key")
              : t("Show_Reports_key")}
          </Button>
        </Col>
      </Row>
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
              {t(props.reportsDataSelected.name)}
            </span>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            background: UseDarkmode("#222738", "#FFFFFF"),
            overflow: "hidden",
          }}
        >
          <CustomInput
            ClassN="col-12"
            Type="number"
            Label={t("displayName_or_serialNumber_key")}
            Placeholder={t("displayName_or_serialNumber_key")}
            handleChange={handleFilter}
          />
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
        </Modal.Body>
        <Modal.Footer
          style={{
            background: UseDarkmode("#222738", "#FFFFFF"),
            borderTopColor: UseDarkmode("#151824", "#DDD"),
          }}
        >
          <Button
            className="my-0 mx-auto  py-2 px-5"
            onClick={() => props.setShow(false)}
          >
            {t("Save_key")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CurrentActiveReportOptions;
