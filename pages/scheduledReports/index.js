import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCog, faHistory } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import DeleteModal from "components/Modals/DeleteModal";
import { toast } from "react-toastify";
import AgGridDT from "components/AgGridDT";
import { useRouter } from "next/router";
import Model from "components/UI/Model";
import { fetchAllScheduledReports } from "services/scheduledReports";

const ScheduledReports = () => {
  const router = useRouter();
  const { t } = useTranslation(["scheduledReports", "common", "main"]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowsSelected, setrowsSelected] = useState([]);
  const [DataTable, setDataTable] = useState(null);

  // fetch All scheduled Reports
  const onGridReady = useCallback(async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const response = await fetchAllScheduledReports();
    setDataTable(response.report);
  }, []);

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
    };
  }, []);

  // columns
  const columns = useMemo(
    () => [
      {
        headerName: "",
        field: "Select",
        maxWidth: 50,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: "Reports Type",
        field: "ReportsType",
        minWidth: 160,
        maxWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Frequency Type",
        field: "FrequencyType",
        minWidth: 160,
        maxWidth: 170,
      },
      {
        headerName: "Number of Vehicles",
        field: "numberofVehicles",
        minWidth: 160,
        maxWidth: 170,
      },
      {
        headerName: "Number of Users",
        field: "NumberOfUsers",
        minWidth: 160,
        maxWidth: 170,
      },
      {
        headerName: "Additional Emails",
        field: "AdditionalEmails",
        minWidth: 160,
        maxWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Additional Phone Numbers",
        field: "AdditionalNumbers",
        minWidth: 160,
        maxWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Description",
        field: "Description",
        minWidth: 160,
        maxWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Actions",
        field: "Actions",
        minWidth: 160,
        maxWidth: 170,
      },
    ],
    [t]
  );

  return (
    <div className="container-fluid">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
                <div className="d-flex justify-content-center flex-wrap mb-4">
                  <Link href="/scheduledReports/add">
                    <a>
                      <Button
                        variant="primary p-1 d-flex align-items-center"
                        className="m-1"
                        style={{ fontSize: "13px" }}
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faCog}
                          size="sm"
                        />
                        {t("Add_Scheduled_Report")}
                      </Button>
                    </a>
                  </Link>

                  <Button
                    disabled={!rowsSelected.length}
                    variant="primary p-1 d-flex align-items-center"
                    className="m-1"
                    style={{ fontSize: "13px" }}
                    //   onClick={onDeleteSelected}
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faTrash}
                      size="sm"
                    />
                    {t("Delete Selected")}
                  </Button>
                </div>
              </div>

              <AgGridDT
                rowHeight={65}
                columnDefs={columns}
                rowSelection={"multiple"}
                rowMultiSelectWithClick={"true"}
                onSelectionChanged={(e) =>
                  setrowsSelected([...e.api.getSelectedRows()])
                }
                onCellMouseOver={(e) => (e.event.target.test = "showActions")}
                // onCellMouseOut={HideActions}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
                rowData={DataTable}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <DeleteModal
      show={showModalDelete}
      loading={loadingDelete}
      title={t("delete_maintenance_plan_key")}
      description={
        deleteSelectedDate.length === 1
        ? t("are_you_sure_you_want_to_delete_this_maintenance_plan?")
        : t("are_you_sure_you_want_to_delete_the_maintenance_plans?")
      }
      confirmText={t("Yes,delete!")}
      cancelText={t("No,cancel")}
      onConfirm={onDelete}
      onCancel={() => {
        setshowModalDelete(false);
      }}
    /> */}
      {/* Edit Model */}
      {/* <Model
      header={t("update_maintenance_plan_key")}
      show={editModalShow}
      onHide={() => setEditModalShow(false)}
      updateButton={"Update"}
      footer={false}
    >
      <Edit
        handleModel={() => {
          setEditModalShow(false);
        }}
        icon={faExternalLinkAlt}
        model={true}
        id={editID}
        modelButtonMsg={t("open_in_new_tab_key")}
        className={`p-0 m-0`}
        onModelButtonClicked={() => {
          router.push(`/preventiveMaintenance/edit/formikEdit?id=${editID}`);
        }}
        updateTable={onGridReady}
      />
    </Model> */}
      {/* Reset Model */}
      {/* <Model
      header={t("reset_notification's_value_key")}
      show={resetModalShow}
      onHide={() => setResetModalShow(false)}
      updateButton={t("submit_key")}
      footer={false}
    >
      <Reset
        data={resetPreventive}
        handleModel={() => {
          setResetModalShow(false);
        }}
      />
    </Model> */}
    </div>
  );
};

export default ScheduledReports;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "scheduledReports",
        "common",
        "main",
      ])),
    },
  };
}
// translation ##################################
