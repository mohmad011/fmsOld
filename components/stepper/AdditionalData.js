import { useState, useMemo, useCallback, useEffect } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCog, faHistory } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import DeleteModal from "components/Modals/DeleteModal";
import { toast } from "react-toastify";
import AgGridDT from "components/AgGridDT";
import { useRouter } from "next/router";
import Model from "components/UI/Model";
import { fetchAllUsers } from "services/scheduledReports";

const AdditionalData = () => {
  const router = useRouter();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowsSelected, setrowsSelected] = useState([]);
  const [DataTable, setDataTable] = useState(null);

  // fetch All scheduled Reports
  const onGridReady = useCallback(async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const response = await fetchAllUsers();
    setDataTable(response.users);

    console.log(response)
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
        maxWidth: 100,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: "Full Name",
        field: "FullName",
        minWidth: 300,
        maxWidth: 300,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "User Name",
        field: "UserName",
        minWidth: 300,
        maxWidth: 300,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "E-Mail",
        field: "Email",
        minWidth: 300,
        maxWidth: 300,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Number of Assigned Vehicles",
        field: "vehicle_count",
        minWidth: 400,
        maxWidth: 500,
        sortable: true,
        unSortIcon: true,
      },
    ],
    []
  );

  return (
    <div className="container-fluid">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
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
    </div>
  );
};

export default AdditionalData;
