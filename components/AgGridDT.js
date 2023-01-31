import { useState } from "react";
//Ag grid
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
// import PDFExportPanel from "./pdfExport/PDFExportPanel";
import { Button, Modal, Dropdown } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import  axios  from "axios";
import Spinner from "components/UI/Spinner";

const PDFExportPanel = dynamic(() => import("./pdfExport/PDFExportPanel"), {
  ssr: false,
});

const AgGridDT = ({
  columnDefs,
  rowData,
  onFirstDataRendered,
  rowHeight,
  onSelectionChanged,
  paginationPageSize,
  paginationNumberFormatter,
  defaultColDef,
  onGridReady,
  suppressMenuHide,
  onCellMouseOver,
  onCellMouseOut,
  overlayNoRowsTemplate,
  suppressExcelExport,
  getRowStyle,
  autoSize,
  suppressSizeToFit,
  gridApi,
  getWholeReportApi,
  gridColumnApi,
  Height,
  rowSelection,
  footer = true,
  onCellEditRequest,
  readOnlyEdit,
  animateRows,
  onCellValueChanged,
  onPaginationChanged,
  enableCellChangeFlash,
  loadingOverlayComponent,
  overlayLoadingTemplate,
  suppressPaginationPanel,
}) => {
  const router = useRouter();
  const { darkMode } = useSelector((state) => state.config);
  const { t } = useTranslation("main");
  const [openBtnsExportsModel, setOpenBtnsExportsModel] = useState(false);
  const { locale } = router;
  const onBtnExport = () => {
    gridApi.exportDataAsCsv();
    setOpenBtnsExportsModel(false);
  };
  const handleOpenBtnsExportsModel = () => setOpenBtnsExportsModel(true);

  return (
    <div
      className={`ag-theme-alpine${darkMode ? "-dark" : ""} ag-grid-style`}
      style={{ height: Height || "" }}
    >
      <AgGridReact
        rowHeight={rowHeight || 65}
        enableRtl={locale == "ar" ? true : false}
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection={rowSelection || "multiple"}
        onSelectionChanged={onSelectionChanged || null}
        onCellMouseOver={onCellMouseOver || null}
        onCellMouseOut={onCellMouseOut || null}
        pagination={true}
        autoSize={autoSize || false}
        domLayout={"autoHeight"}
        suppressExcelExport={suppressExcelExport || true}
        cacheBlockSize={paginationPageSize || 10}
        paginationPageSize={paginationPageSize || 10}
        paginationNumberFormatter={paginationNumberFormatter || null}
        onFirstDataRendered={onFirstDataRendered || null}
        defaultColDef={defaultColDef || null}
        onGridReady={onGridReady || null}
        overlayNoRowsTemplate={
          overlayNoRowsTemplate || t("no_rows_to_show_key")
        }
        overlayLoadingTemplate={overlayLoadingTemplate || ""}
        suppressMenuHide={suppressMenuHide || true}
        getRowStyle={getRowStyle || null}
        readOnlyEdit={readOnlyEdit || null}
        onCellEditRequest={onCellEditRequest || null}
        onCellValueChanged={onCellValueChanged || null}
        onPaginationChanged={onPaginationChanged || null}
        animateRows={animateRows || null}
        enableCellChangeFlash={enableCellChangeFlash || null}
        suppressSizeToFit={suppressSizeToFit || false}
        loadingOverlayComponent={loadingOverlayComponent || Spinner}
        suppressPaginationPanel={suppressPaginationPanel || false}
      />
      {!router.pathname.includes("/track") && footer && (
        <div className="d-flex mt-3 gap-2">
          {window.location.pathname === "/reports" ? 
                  <Dropdown >
                  <Dropdown.Toggle variant="primary" id="dropdown-basic" className="p-2">
                    Export
                  </Dropdown.Toggle>
      
                  <Dropdown.Menu className="border border-primary">
                    <Dropdown.Item onClick={onBtnExport}>Export Visible</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{getWholeReportApi()}}>Export All</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                :  
                <Button
                variant="primary "
                className="p-2"
                onClick={onBtnExport}
                style={{ color: darkMode ? "#fff" : "" }}
              >
                <FontAwesomeIcon className="me-2" icon={faFileExcel} size="sm" />
                {t("Export_To_Excel")}
              </Button>
        }


          <Button
            variant="primary"
            className="p-2"
            onClick={handleOpenBtnsExportsModel}
            style={{ color: darkMode ? "#fff" : "" }}
          >
            <FontAwesomeIcon className="me-2" icon={faFilePdf} size="sm" />
            {t("Export_as_PDF_File")}
          </Button>
        </div>
      )}
      <Modal
        show={openBtnsExportsModel}
        onHide={() => setOpenBtnsExportsModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>PDF Export Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PDFExportPanel
            gridApi={gridApi}
            columnApi={gridColumnApi}
            setOpenBtnsExportsModel={setOpenBtnsExportsModel}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default AgGridDT;
