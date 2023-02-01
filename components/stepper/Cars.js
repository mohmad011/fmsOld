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
import { fetchAllScheduledReports , fetchAllUserVehicles } from "services/scheduledReports";

const Cars = () => {
  const router = useRouter();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowsSelected, setrowsSelected] = useState([]);
  const [DataTable, setDataTable] = useState(null);

  // fetch All user vehicles
  const onGridReady = useCallback(async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const response = await fetchAllUserVehicles();
    setDataTable(response.vehicles);
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
        headerName: "Plate Number",
        field: "PlateNumber",
        minWidth: 190,
        maxWidth: 190,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Vehicle Number",
        field: "VehicleNumber",
        minWidth: 200,
        maxWidth: 200,
      },
      {
        headerName: "Manufacturing Company",
        field: "ManufacturingCompany",
        minWidth: 200,
        maxWidth: 200,
      },
      {
        headerName: "Vehicle Type",
        field: "VehicleType",
        minWidth: 200,
        maxWidth: 200,
      },
      {
        headerName: "Chassis Number",
        field: "ChassisNumber",
        minWidth: 200,
        maxWidth: 200,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: "Device Serial Number",
        field: "SequenceNumber",
        minWidth: 200,
        maxWidth: 200,
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

export default Cars;
