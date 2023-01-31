import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import UseTableColumns from "hooks/UseTableColumns";
import AgGridDT from "../AgGridDT";
import axios from "axios";

import { useSelector } from "react-redux";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import CurrentActiveReportOptions from "./CurrentActiveReportOptions";
import { exportToCsv } from "/helpers/helpers.js";

const TableTaps = ({
  fullSelectedReportData,
  handleTap,
  config,
  handleCloseTab,
  style,
  reportsTitleSelectedId,
  reportsDataSelected,
  Data_table,
  setData_table,
  reportsTitleSelected,
  mainApi,
  //////////////
  show,
  setShow,
  ShowReports,
  loadingShowCurrentReport,
  dateStatus,
  setVehiclesError,
  vehiclesError,
  setFullSelectedReportData,
  vehChecked,
  setVehChecked,
}) => {
  const { t } = useTranslation(["reports", "main", "Table"]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [listDCurr, setListDCurr] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDisabledBtnPrevious, setIsDisabledBtnPrevious] = useState(true);
  const [isDisabledBtnNext, setIsDisabledBtnNext] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [allData, setAllData] = useState({
    id: "Math.random().toString(32).substring(3)",
    data: [],
    currentPage: 1,
  });

  const { darkMode } = useSelector((state) => state.config);
  const {
    Working_Hours_and_Mileage_Daily_BasisColumn,
    Working_Hours_and_Mileage_PeriodColumn,
    Custom_Running_TimeColumn,
    Trip_ReportColumn,
    Fuel_Summary_ReportColumn,
    Driver_LoggingColumn,
    Driving_Statistics_Per_PeriodColumn,
    Zone_ActivityColumn,
    Geofences_LogColumn,
    Zones_Summary_ActivitiesColumn,
    Zones_Summary_Activities_DailyColumn,
    In_Zone_DetailsColumn,
    In_Zone_SummaryColumn,
    Weight_Statistics_ReportColumn,
    Weight_Detailed_ReportColumn,
    Temperature_Summary_ReportColumn,
    Temperature_Detailed_ReportColumn,
    Speed_Over_Duration_ReportColumn,
    Over_Speed_ReportColumn,
    Offline_Vehicles_ReportColumn,
    User_VehiclesColumn,
    Vehicle_Idling_and_Parking_ReportsColumn,
  } = UseTableColumns();

  const wholeReportApi = reportsDataSelected?.api
    ?.split("&")
    .filter((query) => query.startsWith("page") == false)
    .join("&");

  async function getWholeReportApi() {
    await axios
      .get(wholeReportApi)
      .then((res) => exportToCsv(t(reportsDataSelected.name), res.data.result));
  }

  // this to set settings for the currnet report
  useEffect(() => {
    if (reportsTitleSelectedId && allData?.data.length) {
      setListDCurr([]);
      switch (t(reportsTitleSelected)) {
        case t("Working_Hours_and_Mileage_Daily_Basis_key"):
          setListDCurr(Working_Hours_and_Mileage_Daily_BasisColumn);
          break;
        case t("Working_Hours_and_Mileage_Period_key"):
          setListDCurr(Working_Hours_and_Mileage_PeriodColumn);
          break;
        case t("Custom_Running_Time_key"):
          setListDCurr(Custom_Running_TimeColumn);
          break;
        case t("Trip_Report_key"):
          setListDCurr(Trip_ReportColumn);
          break;
        case t("Fuel_Summary_Report_key"):
          setListDCurr(Fuel_Summary_ReportColumn);
          break;
        case t("Driver_Logging_key"):
          setListDCurr(Driver_LoggingColumn);
          break;
        case t("Driving_Statistics_Per_Period_key"):
          setListDCurr(Driving_Statistics_Per_PeriodColumn);
          break;
        case t("Zone_Activity_key"):
          setListDCurr(Zone_ActivityColumn);
          break;
        case t("Geofences_Log_key"):
          // here
          setListDCurr(Geofences_LogColumn);
          break;
        case t("Zones_Summary_Activities_key"):
          setListDCurr(Zones_Summary_ActivitiesColumn);
          break;
        case t("Zones_Summary_Activities_Daily_key"):
          setListDCurr(Zones_Summary_Activities_DailyColumn);
          break;
        case t("In_Zone_Details_key"):
          setListDCurr(In_Zone_DetailsColumn);
          break;
        case t("In_Zone_Summary_key"):
          setListDCurr(In_Zone_SummaryColumn);
          break;
        case t("Weight_Statistics_Report_key"):
          setListDCurr(Weight_Statistics_ReportColumn);
          break;
        case t("Weight_Detailed_Report_key"):
          setListDCurr(Weight_Detailed_ReportColumn);
          break;
        case t("Temperature_Summary_Report_key"):
          setListDCurr(Temperature_Summary_ReportColumn);
          break;
        case t("Temperature_Detailed_Report_key"):
          setListDCurr(Temperature_Detailed_ReportColumn);
          break;
        case t("Speed_Over_Duration_Report_key"):
          setListDCurr(Speed_Over_Duration_ReportColumn);
          break;
        case t("Over_Speed_Report_key"):
          setListDCurr(Over_Speed_ReportColumn);
          break;
        case t("Offline_Vehicles_Report_key"):
          setListDCurr(Offline_Vehicles_ReportColumn);
          break;
        case t("User_Vehicles_key"):
          setListDCurr(User_VehiclesColumn);
          break;
        case t("Vehicle_Idling_and_Parking_Reports_key"):
          setListDCurr(Vehicle_Idling_and_Parking_ReportsColumn);
          break;
        default:
          console.log("no data");
      }
    }
  }, [reportsTitleSelectedId, allData?.data]);

  const rowHeight = "auto";

  // this to set data for the currnet report and currnet report page number
  useEffect(() => {
    if (Object.keys(reportsDataSelected ?? {}).length) {
      setAllData(reportsDataSelected);
      setCurrentPage(reportsDataSelected?.currentPage);
    }
  }, [reportsDataSelected]);

  // this to cache common columns settings
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }, []);

  // Start AG grid Settings
  const columns = useMemo(() => listDCurr, [listDCurr]);

  //set the Api of the AG grid table
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  //first page to render in the AG grid table
  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(0);
  };

  const handleSelectTabs = (id) =>
    reportsTitleSelectedId === id ? "active" : "";

  const handleSelectContentTabs = (id) =>
    reportsTitleSelectedId === id ? "show active" : "";

  const onBtFirst = () => {
    gridApi.paginationGoToFirstPage();
    setCurrentPage((prev) => {
      prev = 1;
      prev === 1
        ? setIsDisabledBtnPrevious(true)
        : setIsDisabledBtnPrevious(false);

      return prev;
    });
    setIsDisabledBtnNext(gridApi.paginationGetTotalPages() == 1);
  };

  const onBtLast = () => {
    gridApi.paginationGoToLastPage();
    setCurrentPage((prev) => {
      prev = gridApi.paginationGetTotalPages();
      if (prev === 1) {
        setIsDisabledBtnPrevious(true);
        setIsDisabledBtnNext(false);
      } else {
        setIsDisabledBtnPrevious(false);
      }
      return prev;
    });
  };

  const onBtNext = async () => {
    let afterCurrentPage = currentPage + 1;

    let nextPage = gridApi.paginationGetTotalPages() + 1;
    if (gridApi.paginationGetTotalPages() - currentPage == 2) {
      let selectedMainApi = mainApi.find(
        (item) => item.id === reportsTitleSelectedId
      );

      // gridApi.showLoadingOverlay();
      await axios
        .get(
          `${
            selectedMainApi?.mainApi
          }&pageSize=${perPage}&pageNumber=${nextPage}&pagesCount=${4}`
        )
        .then((res) => {
          if (!Object.hasOwn(res.data, "message")) {
            const selectedReport = Data_table.find(
              (item) => item.id === reportsTitleSelectedId
            );

            let updatedSelectedReport = [
              ...selectedReport?.data,
              ...res.data.result,
            ];

            setData_table((prev) => {
              prev.find((item) => item.id === reportsTitleSelectedId).data =
                updatedSelectedReport;

              prev.find(
                (item) => item.id === reportsTitleSelectedId
              ).currentPage = nextPage;
              return prev;
            });

            setAllData((prev) => {
              prev.data = updatedSelectedReport;
              prev.currentPage = nextPage;
              return prev;
            });

            setCurrentPage((prev) => {
              prev = nextPage;
              if (prev === 1) {
                setIsDisabledBtnPrevious(true);
                setIsDisabledBtnNext(false);
              } else {
                setIsDisabledBtnPrevious(false);
              }
              return prev;
            });

            gridApi.paginationGoToPage(afterCurrentPage);
          } else {
            setIsDisabledBtnNext(true);
            setData_table((prev) => {
              prev.find(
                (item) => item.id === reportsTitleSelectedId
              ).currentPage = gridApi.paginationGetTotalPages();
              return prev;
            });
            setAllData((prev) => {
              prev.currentPage = gridApi.paginationGetTotalPages();
              return prev;
            });

            setCurrentPage((prev) => {
              prev = gridApi.paginationGetTotalPages();
              if (prev === 1) {
                setIsDisabledBtnPrevious(true);
                setIsDisabledBtnNext(false);
              } else {
                setIsDisabledBtnPrevious(false);
              }
              return prev;
            });
            gridApi.paginationGoToPage(gridApi.paginationGetTotalPages());
          }
        })
        .catch(() => {})
        .finally(() => {
          // gridApi.hideOverlay();
        });
    } else {
      gridApi.paginationGoToPage(afterCurrentPage);

      setData_table((prev) => {
        prev.find((item) => item.id === reportsTitleSelectedId).currentPage =
          afterCurrentPage;
        return prev;
      });
      setAllData((prev) => {
        prev.currentPage = afterCurrentPage;
        return prev;
      });

      setCurrentPage((prev) => {
        prev = afterCurrentPage;

        if (prev === 1) {
          setIsDisabledBtnPrevious(true);
          setIsDisabledBtnNext(false);
        } else {
          if (
            gridApi.paginationGetTotalPages() ===
            gridApi.paginationGetCurrentPage() + 1
          ) {
            setIsDisabledBtnNext(true);
          } else {
            setIsDisabledBtnNext(false);
          }

          setIsDisabledBtnPrevious(false);
        }
        return prev;
      });
    }
  };

  const onBtPrevious = () => {
    gridApi.paginationGoToPreviousPage();
    let prevPage = currentPage - 1;
    setIsDisabledBtnNext(gridApi.paginationGetTotalPages() == prevPage);
    setCurrentPage((prev) => {
      prev = prev > 1 ? prev - 1 : prev;
      prev === 1
        ? setIsDisabledBtnPrevious(true)
        : setIsDisabledBtnPrevious(false);

      return prev;
    });
  };

  return (
    <Row>
      <Col sm="12">
        <Card>
          <Card.Body>
            <ul
              className="nav nav-tabs bg-transparent"
              id="myTab"
              role="tablist"
            >
              <div
                className="d-flex horizontal-scrollable w-100"
                style={{
                  overflowX: "auto",
                  whiteSpace:
                    fullSelectedReportData?.data?.length > 0
                      ? "nowrap"
                      : "normal",
                }}
              >
                {fullSelectedReportData?.data?.length
                  ? fullSelectedReportData?.data?.map((item, key) => (
                      <li
                        className={`nav-item btn-light report_tab p-2 ${handleSelectTabs(
                          item?.id
                        )} `}
                        role="presentation"
                        key={key}
                      >
                        <button
                          className="nav-link bg-transparent text-primary btnLink  rounded-0 position-relative p-0 ps-2 pe-4"
                          id={`data-${item?.id}`}
                          data-bs-toggle="tab"
                          data-bs-target={`#data-${item?.id}`}
                          type="button"
                          role="tab"
                          onClick={() => handleTap(item?.name, item?.id)}
                        >
                          <span
                            dir={config.language === "ar" ? "rtl" : "ltr"}
                            className="report_name"
                          >
                            {t(item?.name)}
                          </span>
                          <div
                            onClick={(e) => handleCloseTab(e, item?.id)}
                            className={`${style.closeTab} ${style.active}`}
                          >
                            <span
                              className={`${style.closeTab__patty} bg-primary`}
                            />
                            <span
                              className={`${style.closeTab__patty} bg-primary`}
                            />
                            <span
                              className={`${style.closeTab__patty} bg-primary`}
                            />
                          </div>
                        </button>
                      </li>
                    ))
                  : ""}
              </div>
            </ul>
            {Object.keys(reportsDataSelected ?? {}).length ? (
              <CurrentActiveReportOptions
                show={show}
                setShow={setShow}
                onHide={ShowReports}
                loadingShowCurrentReport={loadingShowCurrentReport}
                dateStatus={dateStatus}
                setVehiclesError={setVehiclesError}
                vehiclesError={vehiclesError}
                setFullSelectedReportData={setFullSelectedReportData}
                reportsDataSelected={reportsDataSelected}
                reportsTitleSelectedId={reportsTitleSelectedId}
                fullSelectedReportData={fullSelectedReportData}
                vehChecked={vehChecked}
                setVehChecked={setVehChecked}
              />
            ) : (
              ""
            )}
            <div className="tab-content" id="myTabContent">
              {fullSelectedReportData?.data?.length
                ? fullSelectedReportData?.data?.map((item, key) => (
                    <>
                      {item?.id === reportsTitleSelectedId && (
                        <div
                          key={key}
                          className={`tab-pane fade ${handleSelectContentTabs(
                            item?.id
                          )}`}
                          id={`data-${item?.id}`}
                          role="tabpanel"
                        >
                          <AgGridDT
                            getWholeReportApi={getWholeReportApi}
                            rowHeight={rowHeight}
                            columnDefs={columns}
                            rowData={allData?.data}
                            pagination={false}
                            paginationNumberFormatter={function (params) {
                              return params.value.toLocaleString();
                            }}
                            onFirstDataRendered={onFirstDataRendered}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            overlayLoadingTemplate={
                              '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                            }
                            suppressMenuHide={false}
                            gridApi={gridApi}
                            gridColumnApi={gridColumnApi}
                            customPaganition={false}
                          />
                          {allData?.pagination ? (
                            <div
                              className={style.paginationBox}
                              style={{
                                backgroundColor: darkMode ? "#222738" : "#fff",
                              }}
                            >
                              <div
                                className={`${style.prevBox} report-pag-box`}
                                style={{
                                  cursor: isDisabledBtnPrevious
                                    ? "not-allowed"
                                    : "auto",
                                }}
                              >
                                <Button
                                  disabled={isDisabledBtnPrevious}
                                  className={`py-1 border-0 w-100 ${style.buttonPagination}`}
                                  id="first"
                                  onClick={() => onBtFirst()}
                                >
                                  {/* first */}
                                  <BiArrowToLeft
                                    style={{
                                      color: darkMode ? "#fff" : "#000",
                                    }}
                                  />
                                </Button>

                                <Button
                                  disabled={isDisabledBtnPrevious}
                                  className={`py-1 border-0 w-100 ${style.buttonPagination}`}
                                  id="prev"
                                  onClick={() => onBtPrevious()}
                                >
                                  {/* prev */}
                                  <MdKeyboardArrowLeft
                                    style={{
                                      color: darkMode ? "#fff" : "#000",
                                    }}
                                  />
                                </Button>
                              </div>
                              <div
                                className="boxInfo"
                                style={{ color: darkMode ? "#fff" : "#000" }}
                              >
                                page {currentPage}
                              </div>
                              <div className={style.nextBox}>
                                <Button
                                  disabled={isDisabledBtnNext}
                                  className={`py-1 border-0 w-100 ${style.buttonPagination}`}
                                  id="next"
                                  onClick={onBtNext}
                                >
                                  {/* ===========next ==============*/}
                                  <MdKeyboardArrowRight
                                    style={{
                                      color: darkMode ? "#fff" : "#000",
                                    }}
                                  />
                                </Button>

                                <Button
                                  disabled={false}
                                  className={`py-1 border-0 w-100 ${style.buttonPagination}`}
                                  id="last"
                                  onClick={() => onBtLast()}
                                >
                                  {/*  ==============last =======================*/}
                                  <BiArrowToRight
                                    style={{
                                      color: darkMode ? "#fff" : "#000",
                                    }}
                                  />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </>
                  ))
                : ""}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TableTaps;
