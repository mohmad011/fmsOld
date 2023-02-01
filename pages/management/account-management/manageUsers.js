import { Row, Col, Card, Form } from "react-bootstrap";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as lodash from "lodash";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faEdit,
  faTrash,
  faUserSlash,
  faCar,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useSelector } from "react-redux";
import AgGridDT from "../../../components/AgGridDT";
import axios from "axios";
import { useRouter } from "next/router";

import { fetchAllAssignUsers } from '../../../services/management/ManagneVehicles'

const ManageUsers = () => {
  const { t } = useTranslation("Management");
  const userInfos = useSelector((state) => state?.userInfo);

  const [allDataGrid, setAllDataGrid] = useState([]);
  const [unassignedDevices, setUnassignedDevices] = useState([]);

  const Routerss = useRouter()
  // all data of Completed Users
  const [userAssign, setUserAssign] = useState([])
  // all data unCompleted Users
  const [userUnAssign, setUserUnAssign] = useState([])
  // check Search unAssign
  const [searchUnAssign, setSearchUnAssign] = useState([])
  // check Search Assign
  const [searchAssign, setSearchAssign] = useState([])
  const rowHeight = 65;

  const [gridApi, setGridApi] = useState(null);
  const [DataTable, setDataTable] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);


  useEffect(() => {
    setAllDataGrid([...userInfos.AllData]);
    setUnassignedDevices([...userInfos.AllData]);
  }, [userInfos.AllData]);


  //  to get all users
  const GetAssignUsers = async () => {
    const response = await fetchAllAssignUsers()
    setUserAssign(response.users)
    setSearchAssign(response.users)


  }
  //get all unAssign Users
  const GetUnAssignUsers = async () => {
    const response = await axios({
      method: "get",
      url: `dashboard/management/users/incomplete`,
    });
    setUserUnAssign(response.data.users)
    setSearchUnAssign(response.data.users)
  }
  // useEffect  Assign and UnAssign
  useEffect(() => {
    GetAssignUsers()
    GetUnAssignUsers()

  }, [])


  // handle unAssignsearch
  const HandleSearchUnAssign = (e) => {


    const filters = userUnAssign.filter((item) =>
      item.FirstName.toLowerCase().includes(e.target.value.toLowerCase())
      ||
      item.LastName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    const data = e.target.value;
    !data ? setUserUnAssign(searchUnAssign) : setUserUnAssign(filters)


    // setUserUnAssign(filtered)


  }

  // handle Assignsearch
  const HandleSearchAssign = (e) => {


    const filters = userAssign.filter((item) =>
      item.FirstName.toLowerCase().includes(e.target.value.toLowerCase())
      ||
      item.LastName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    const data = e.target.value;
    !data ? setUserAssign(searchAssign) : setUserAssign(filters)



    // setUserUnAssign(filtered)


  }


  const handleFullName = (params) => {
    return `${params.data.FirstName} ${params.data.LastName}`;
  };


  // handle updates
  const HandleRoutes = (params) => {
    console.log(params.data)
    Routerss.push(`/management/account-management/Users/${params.data.ProfileID}`)
  }

  const columnsAssigned = useMemo(
    () => [
      {
        headerName: `${t("Full Name")}`,
        field: "FirstName",
        valueGetter: handleFullName,
        // cellRenderer: (params) => (
        //   <Link href={`Driver`}>
        //     <a className="text-decoration-underline">{params.value}</a>
        //   </Link>
        // ),
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("User Name")}`,
        field: "UserName",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("E-Mail")}`,
        field: "Email",
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("Status")}`,
        field: "LockoutEnabled",
        minWidth: 150,
        unSortIcon: true,
        valueFormatter: "value? 'Active' : 'Locked'"
      },
      {
        headerName: "Actions",
        field: "ID",
        minWidth: 380,
        cellRenderer: (params) => (
          <div>
            {!lodash.isEmpty(userInfos) && (
              <>
                <button className="btn btn-outline-primary m-1">
                  <FontAwesomeIcon className="pe-2" icon={faEdit} size="lg" />
                  edit
                </button>
                <button className="btn btn-outline-primary m-1">
                  <FontAwesomeIcon className="pe-2" icon={faTrash} size="lg" />
                  delete
                </button>
                <button className="btn btn-outline-primary m-1">
                  <FontAwesomeIcon
                    className="pe-2"
                    icon={faUserSlash}
                    size="lg"
                  />
                  Deactivate
                </button>
                <button onClick={() => HandleRoutes(params)} className="btn btn-outline-primary m-1">
                  <FontAwesomeIcon className="pe-2" icon={faCar} size="lg" />
                  Show Vehicles
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [t, userInfos]
  );

  const columnsUnAssigned = useMemo(
    () => [
      {
        headerName: `${t("Full Name")}`,
        field: "FirstName",
        valueGetter: handleFullName,
        cellRenderer: (params) => (
          <Link href={`Driver`}>
            <a className="text-decoration-underline">{params.value}</a>
          </Link>
        ),
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("User Name")}`,
        field: "UserName",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("E-Mail")}`,
        field: "Email",
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("Status")}`,
        field: `{LockoutEnabled? "Active" : "Locked"}`,
        minWidth: 150,
        unSortIcon: true,
      }
      ,
      {
        headerName: "Actions",
        field: "ID",
        minWidth: 100,
        cellRenderer: () => (
          <div>
            {!lodash.isEmpty(userInfos) && (
              <>
                <button className="btn btn-outline-primary m-1">
                  <FontAwesomeIcon
                    className="pe-2"
                    icon={faUserEdit}
                    size="lg"
                  />
                  {t("Complete_User_Creation")}
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [t, userInfos]
  );

  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(0);
  };

  const onGridReady = useCallback(async (params) => {
    try {
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
    }
  }, []);
  const onExportClick = () => {
    gridApi.exportDataAsCsv();
  }

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  return (
    <div className="container-fluid">
      <Row>
        <Row className="g-3">
          <Col sm="12">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between">
                <div className="d-flex flex-column w-100">
                  <div className="w-100 header-title d-flex justify-content-between align-items-center p-3">
                    <div>
                      <Link
                        href="/management/account-management/AddUser1"
                        passHref
                      >
                        <button
                          type="button"
                          className="btn btn-primary  px-3 py-2 me-3 "
                        >
                          <FontAwesomeIcon
                            className="me-2"
                            icon={faUserPlus}
                            size="sm"
                          />

                          {t("Add User")}
                        </button>
                      </Link>
                    </div>
                    <Form.Floating className=" custom-form-floating-sm form-group m-0">
                      <Form.Control
                        type="text"
                        onChange={HandleSearchAssign}
                        className=""
                        id="floatingInput6"
                        placeholder="Place Holder"
                      />
                      <label htmlFor="floatingInput">{t("main:search")}</label>
                    </Form.Floating>
                  </div>
                  <div className="ms-3">
                    <h3>{t("Manage_Users")}</h3>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <AgGridDT
                  rowHeight={rowHeight}
                  columnDefs={columnsAssigned}
                  rowData={userAssign}
                  paginationNumberFormatter={function (params) {
                    return params.value.toLocaleString();
                  }}
                  onGridReady={onGridReady}
                  gridApi={gridApi}
                  onFirstDataRendered={onFirstDataRendered}
                  defaultColDef={defaultColDef}

                />

              </Card.Body>
            </Card>
          </Col>

          {/* ================== second table  ===================== */}
          <Col sm="12">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between">
                <div className="w-100 header-title d-flex justify-content-between align-items-center p-3">
                  <div>
                    <h3>{t("Manage_Incompleted_Users")}</h3>
                  </div>
                  <Form.Floating className=" custom-form-floating-sm form-group m-0">
                    <Form.Control
                      type="text"
                      className=""
                      onChange={HandleSearchUnAssign}
                      id="floatingInput6"
                      placeholder="Place Holder"
                    />
                    <label htmlFor="floatingInput">{t("main:search")}</label>
                  </Form.Floating>
                </div>
              </Card.Header>
              <Card.Body>

                <AgGridDT
                  rowHeight={rowHeight}
                  columnDefs={columnsUnAssigned}
                  rowData={userUnAssign}
                  paginationNumberFormatter={function (params) {
                    return params.value.toLocaleString();
                  }}
                  onGridReady={onGridReady}
                  gridApi={gridApi}
                  onFirstDataRendered={onFirstDataRendered}
                  defaultColDef={defaultColDef}
                />

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Row>
    </div>
  );
};




export default ManageUsers;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main"])),
    },
  };
}

// translation ##################################
