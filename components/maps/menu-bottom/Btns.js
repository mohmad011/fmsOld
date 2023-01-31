import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Btn from "./Btn";
import { useTranslation } from "next-i18next";
import { MdOutlineContentCopy } from "react-icons/md";
import { useSelector } from "react-redux";
import { exportToCsv } from "helpers/helpers";
import { convertJsonToExcel } from "helpers/helpers";
import Styles from "styles/MenuBottom.module.scss";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
const Btns = ({
  // GeofenceInfo
  setGeofencesViewToggle,
  setData_tableFenc,
  setShowViewFencModal,
  geofencesViewToggle,
  Data_tableFenc,
  // LandMarksInfo
  setViewLandMarkstoggle,
  setData_tableMarks,
  setAddLandMarks,
  setShowViewMarkModal,
  viewLandMarkstoggle,
  Data_tableMarks,
  addLandMarks,
  showViewMarkModal,
  // Warnings
  showViewWarningModal,
  setShowViewWarningModal,
  //// cluster
  clusterToggle,
  setclusterToggle,
  //// locate
  locateToggle,
  setLocateToggle,
  /// CalculateDistance
  setCalculateDistanceToggle,
  CalculateDistanceToggle,
  //// others
  show,
  setVehChecked,
  setcarsIconsFilter,
  setserialNumberFilter,
  setaddressFilter,
  setspeedFromFilter,
  setspeedToFilter,
  setDisplayNameFilter,
  setPlateNumberFilter,
  // L,
  showViewFencModal,
}) => {
  const L = require("leaflet");
  const { t } = useTranslation("common");
  const [latlng, setLatlng] = useState({});
  const { myMap } = useSelector((state) => state.mainMap);
  const VehFullData = useSelector((state) => state.streamData.VehFullData);
  const [exportButtonAvalability, setExportButtonAvalability] = useState(false);
  const [exportData, setExportData] = useState([]);

  // listens if at least one firebase packet is recieved
  useEffect(() => {
    if (VehFullData[0]?.hasOwnProperty("IsSOSHighJack")) {
      setExportData(
        VehFullData?.map((entry) => {
          return {
            VehicleStatus: entry.VehicleStatus,
            DisplayName: entry.DisplayName,
            PlateNumber: entry.PlateNumber,
            Mileage: entry.Mileage,
            Latitude: entry.Latitude,
            Longitude: entry.Longitude,
            PhoneNumber: entry.SimSerialNumber,
            Address: entry.Address,
            DeviceTypeID: entry.DeviceTypeID,
            EngineStatus: entry.EngineStatus,
            IsPowerCutOff: entry.IsPowerCutOff,
            IsLowPower: entry.IsLowPower,
            DeviceSerialNumber: entry.SerialNumber,
          };
        })
      );

      setExportButtonAvalability(true);
    }
  }, [VehFullData]);
  const DrawShape = useCallback(
    (item) => {
      switch (item.GeoFenceType) {
        case 1: // Polygon
          L.polygon(item.GeofencePath, { color: "red" }).addTo(
            myMap.groups.drawGroup
          );
          break;

        case 2: // Circle
          L.circle(item.GeofencePath, {
            color: "red",
            radius: +item.GeofenceRadius,
          }).addTo(myMap.groups.drawGroup);
          break;

        case 3: // Rectangle
          L.rectangle(item.GeofencePath, { color: "red" }).addTo(
            myMap.groups.drawGroup
          );
          break;
      }
    },
    [L, myMap?.groups?.drawGroup]
  );

  const handleViewGeofences = async () => {
    setGeofencesViewToggle(!geofencesViewToggle);
    if (!geofencesViewToggle) {
      if (Data_tableFenc.length) {
        await Data_tableFenc?.map((item) => DrawShape(item));
      } else {
        try {
          toast.warning("please wait...");
          const response = await axios.get(`geofences/dev`);
          let dataLength = response.data?.allGeoFences?.length;
          if (dataLength) {
            let handledData = response.data?.allGeoFences?.map(
              (item) => item.handledData
            );
            await handledData?.map((item) => {
              // check if a circle
              if (item.GeoFenceType === 2) {
                let GeofencePath = [];
                item.GeofencePath?.map((item) => {
                  item?.map((item) => GeofencePath.push(+item));
                });
                item.GeofencePath = GeofencePath;
              } else {
                item.GeofencePath = item.GeofencePath?.map((item) =>
                  item?.map((item) => +item)
                );
              }
            });
            await handledData?.map((item) => DrawShape(item));
            setData_tableFenc(handledData);
          }
          !dataLength && toast.warning(t("There_is_no_GeoFences_Right_Now!"));
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      }
    } else {
      myMap.groups.drawGroup.clearLayers();
    }
  };

  const handleViewLandMarks = async () => {
    setViewLandMarkstoggle(!viewLandMarkstoggle);
    if (!viewLandMarkstoggle) {
      if (Data_tableMarks.length) {
        await Data_tableMarks?.forEach((landmark) => {
          L?.marker(L.latLng(landmark.Latitude, landmark.Longitude), {
            icon: L.icon({
              shadowUrl: null,
              iconAnchor: new L.Point(12, 12),
              iconSize: new L.Point(24, 24),
              iconUrl: `/assets/images/landmarks/${landmark.Icon}`,
            }),
            MarksID: landmark.ID,
          }).addTo(myMap?.groups?.markerGroup);
        });
      } else {
        try {
          toast.warning("please wait...");
          const response = await axios.get(`landmarks`);
          if (response.status === 200) {
            const results = response?.data?.marks;

            results?.forEach((landmark) => {
              L?.marker(L.latLng(landmark.Latitude, landmark.Longitude), {
                icon: L.icon({
                  shadowUrl: null,
                  iconAnchor: new L.Point(12, 12),
                  iconSize: new L.Point(24, 24),
                  iconUrl: `/assets/images/landmarks/${landmark.Icon}`,
                }),
                MarksID: landmark.ID,
              }).addTo(myMap?.groups?.markerGroup);
            });
            setData_tableMarks(results);
          } else {
            toast?.error(response?.response?.data?.message);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      myMap?.groups?.markerGroup.clearLayers();
    }
  };

  const handleAddLandMarks = async () => {
    setAddLandMarks((prev) => !prev);
  };

  const handleCluster = () => {
    myMap.setCluster(clusterToggle);
    setclusterToggle(!clusterToggle);
  };

  const handleShowGeofences = () => setShowViewFencModal((prev) => !prev);
  const handleShowWarnings = () => setShowViewWarningModal((prev) => !prev);

  const handleShowMarks = () => setShowViewMarkModal((prev) => !prev);

  const handleLocate = () => {
    setLocateToggle(!locateToggle);
    let isClicked = false;

    function onMoveEnd(e) {
      var lat, lng;
      lat = e?.latlng?.lat;
      lng = e?.latlng?.lng;
      setLatlng(e?.latlng);
    }

    function removeEventsOnMap() {
      if (!isClicked) {
        myMap?.off("mousemove");
        isClicked = true;
      } else {
        myMap.on("mousemove", onMoveEnd);
        isClicked = false;
      }
    }

    myMap.on("click", removeEventsOnMap);
    if (!locateToggle) {
      myMap.on("mousemove", onMoveEnd);
    } else {
      myMap?.off("click");
      myMap?.off("mousemove");
    }
  };

  const handleEraserition = () => {
    myMap?.deselectAll();
    myMap?.groups?.markerGroup.clearLayers();
    myMap.groups.drawGroup.clearLayers();
    myMap.setCluster(true);
    setcarsIconsFilter(null);
    setserialNumberFilter("");
    setaddressFilter("");
    setspeedFromFilter("");
    setspeedToFilter("");
    setDisplayNameFilter("");
    setPlateNumberFilter("");
    setLocateToggle(false);
    setclusterToggle(false);
    setViewLandMarkstoggle(false);
    setGeofencesViewToggle(false);
    setCalculateDistanceToggle(false);
    setVehChecked([]);
  };

  const handleCalculateDistance = () =>
    setCalculateDistanceToggle((prev) => !prev);

  return (
    <>
      {locateToggle ? (
        <div
          className={`${Styles.locate} d-flex justify-content-between align-items-center gap-3`}
          onClick={(e) => {
            navigator.clipboard.writeText(
              `LatLng(${latlng?.lat}, ${latlng?.lng})`
            );
            toast.success(
              `${t("copied_to_clipboard_successfully_key")}, ${t(
                "latlng_key"
              )}(${latlng?.lat}, ${latlng?.lng})`
            );
          }}
        >
          <span>
            {t("point_key")}:{t("latlng_key")}({latlng?.lat}, {latlng?.lng})
          </span>
          <MdOutlineContentCopy style={{ cursor: "pointer" }} />
        </div>
      ) : (
        ""
      )}
      <div className={`${Styles.list} ${show && Styles.active}`}>
        <Btn
          text={t("locate_key")}
          btnToggle={locateToggle}
          handleClick={handleLocate}
          Styles={Styles}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1"
            viewBox="0 0 512 512"
          >
            <path d="M235 21.9v21.9l-8.7 1.2c-60.6 8.4-114 42.5-148.9 95-16.3 24.4-28.2 56.3-32.4 86.2l-1.2 8.8H0v42h43.8l1.2 8.7c8.4 60.6 42.5 114 95 148.9 24.4 16.3 56.3 28.2 86.3 32.4l8.7 1.2V512h42v-43.8l8.8-1.2c60.5-8.4 113.9-42.5 148.8-95 16.3-24.4 28.2-56.3 32.4-86.3l1.2-8.7H512v-42h-43.8l-1.2-8.8c-8.4-60.5-42.5-113.9-95-148.8-24.4-16.3-56.3-28.2-86.2-32.4l-8.8-1.2V0h-42v21.9zm0 85.6V128h42v-20.5c0-11.3.3-20.5.8-20.5 2.7 0 18.2 3.3 25.7 5.5 56 16.3 99.7 60 116 116 2.2 7.5 5.5 23 5.5 25.7 0 .5-9.2.8-20.5.8H384v42h20.5c11.3 0 20.5.3 20.5.7 0 2.8-3.3 18.3-5.5 25.8-16.3 56-60 99.7-116 116-7.5 2.2-23 5.5-25.7 5.5-.5 0-.8-9.2-.8-20.5V384h-42v20.5c0 11.3-.3 20.5-.7 20.5-2.8 0-18.3-3.3-25.8-5.5-56-16.3-99.7-60-116-116-2.2-7.5-5.5-23-5.5-25.8 0-.4 9.2-.7 20.5-.7H128v-42h-20.5c-11.3 0-20.5-.3-20.5-.8 0-2.7 3.3-18.2 5.5-25.7 16.3-56 59.9-99.6 116-116 8.4-2.5 20.7-5.1 24.8-5.4 1.6-.1 1.7 1.5 1.7 20.4z"></path>
            <path d="M245.5 150c-36.4 3.6-68.4 25.7-84.7 58.5-7.7 15.5-11 29.6-11 47.5 0 28.2 9.7 52.9 28.7 72.9 20.9 22 47.1 33.3 77.5 33.3 51.5 0 93.8-34.7 104.5-85.7 2.2-10.6 2.2-30.4 0-41-11.4-54.4-60.5-90.8-115-85.5zm23.9 43.5c23.9 5 44.1 25.2 49.1 49.1 9.6 45.1-30.8 85.5-75.9 75.9-18.3-3.9-35.2-17-43.4-33.6-9.5-19.3-9.5-38.5 0-57.8 12.6-25.6 42-39.6 70.2-33.6z"></path>
            <path d="M247.2 236.6c-8.4 4.3-12.6 11.6-12 20.8.4 7.1 3.4 12.3 9.5 16.4 3.3 2.3 4.8 2.7 11.3 2.7s8-.4 11.3-2.7c2.2-1.4 5.1-4.3 6.5-6.5 2.3-3.3 2.7-4.8 2.7-11.3s-.4-8-2.7-11.3c-4.3-6.3-9.2-9.1-16.8-9.5-4.6-.2-7.5.2-9.8 1.4z"></path>
          </svg>
        </Btn>
        <Btn
          text={t("clear_search_key")}
          handleClick={handleEraserition}
          Styles={Styles}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1"
            viewBox="0 0 1000 1000"
          >
            <path
              d="M5672 8170c-40-10-97-32-125-47-71-37-3262-3221-3338-3331-243-349-248-807-13-1169 23-35 228-249 528-550l490-492-615-3-614-3-47-28c-50-29-91-86-103-145-17-81 40-187 119-223 40-18 144-19 3036-19 2096 0 3007 3 3034 11 55 15 120 84 135 143 23 92-16 186-97 233l-47 28-1578 5-1577 5 1521 1520c867 866 1536 1542 1555 1572 102 156 113 376 28 552-24 47-163 192-918 949-490 491-913 907-939 924-124 80-294 107-435 68zm-774-3113l922-922-712-711c-447-446-730-721-759-737-25-14-82-38-125-53-67-23-96-27-189-28-97 0-120 4-195 30-47 17-110 47-140 67s-303 285-606 589c-602 605-594 595-634 754-26 99-26 209 0 308 41 162 17 134 794 914 391 391 713 712 716 712s420-415 928-923zM188 2343c-19-5-34-45-23-62 11-18 22-12 21 12-1 32 34 34 64 2 32-34 40-32 40 15 0 44-20 56-21 13 0-16-3-22-6-15-7 17-54 39-75 35zM236 2243c-4-5-19-8-33-8-32 0-52-28-37-52 12-20 92-27 111-11 18 14 16 43-3 62-17 18-27 20-38 9zm-28-40c-4-22-22-20-26 1-2 10 3 16 13 16s15-7 13-17zm60 0c-2-10-10-18-18-18s-16 8-18 18c-2 12 3 17 18 17s20-5 18-17zM235 2130c-4-6-16-8-26-5-35 11-69-42-39-60 20-12 93-15 107-4 18 15 16 44-3 63-18 19-30 20-39 6zm-27-37c-4-22-22-20-26 1-2 10 3 16 13 16s15-7 13-17zm60 0c-2-10-10-18-18-18s-16 8-18 18c-2 12 3 17 18 17s20-5 18-17zM160 2012c0-5 7-17 15-28 13-17 14-17 15-1 0 14 9 17 50 17 28 0 50 5 50 10 0 6-28 10-65 10-36 0-65-4-65-8zM235 1950c-3-5-19-7-35-4-25 6-30 3-36-21-4-15-2-31 5-38 15-15 92-18 108-5 18 14 16 43-3 62-18 18-30 20-39 6zm-27-37c-4-22-22-20-26 1-2 10 3 16 13 16s15-7 13-17zm60 0c-2-10-10-18-18-18s-16 8-18 18c-2 12 3 17 18 17s20-5 18-17zM188 1843c-19-5-34-45-23-62 11-18 22-12 21 12-1 32 34 34 64 2 32-34 40-32 40 15 0 44-20 56-21 13 0-16-3-22-6-15-7 17-54 39-75 35zM188 1743c-19-5-34-45-23-62 11-18 22-12 21 12-1 32 34 34 64 2 32-34 40-32 40 15 0 44-20 56-21 13 0-16-3-22-6-15-7 17-54 39-75 35zM188 1643c-19-5-34-45-23-62 11-18 22-12 21 12-1 32 34 34 64 2 32-34 40-32 40 15 0 44-20 56-21 13 0-16-3-22-6-15-7 17-54 39-75 35zM226 1543c-4-4-19-7-34-8-23 0-27-4-27-29 0-16 5-31 11-33 7-2 10 6 7 22-4 18-1 25 11 25 9 0 16-7 16-15 0-22 17-18 23 6 8 29 32 18 32-14-1-30 12-36 22-11 14 37-35 83-61 57zM190 1449c0-5-4-7-10-4-5 3-10 2-10-4 0-5 6-12 13-15 9-5 9-7 0-12-10-4-9-9 2-20 8-9 20-12 26-8 6 3 14 1 18-5 5-8 15-9 31-3 19 7 21 10 7 15-23 9-22 28 1 20 12-4 11 0-7 17-18 18-25 20-32 9-6-11-9-10-15 4-7 19-24 23-24 6zm40-39c0-5-4-10-10-10-5 0-10 5-10 10 0 6 5 10 10 10 6 0 10-4 10-10zM140 1280c0-6 38-10 95-10s95 4 95 10-38 10-95 10-95-4-95-10zM261 1189c-22-18-25-19-42-3-11 10-22 14-27 10-4-4 4-16 17-27l23-19h-46c-34 0-46-4-46-15 0-12 15-15 75-15s75 3 75 15c0 9-9 15-22 15h-23l24 19c13 10 22 23 20 29s-14 3-28-9zM190 1084c0-32 20-54 50-54s50 22 50 54c0 25-17 18-24-10-9-33-49-31-54 4-4 25-22 31-22 6zM206 994c-19-18-20-28-6-55 12-22 59-26 78-7 26 26 1 78-38 78-10 0-26-7-34-16zm59-29c0-22-31-33-47-17-17 17-1 44 24 40 15-2 23-10 23-23zM190 900c0-5-7-10-15-10s-15-4-15-10c0-5 6-10 14-10s17-6 20-12c5-10 7-10 12 0 3 6 21 12 40 12 34 0 56 22 39 38-4 4-10 1-12-5-5-15-63-18-63-3 0 6-4 10-10 10-5 0-10-4-10-10zM212 810c-19-34-35-34-40-2-4 29-22 28-22-1 0-52 52-63 78-17 20 35 37 34 37-4-1-31 19-29 23 3 8 53-49 69-76 21zM202 678c-29-29-5-68 40-68 33 0 56 37 43 67-7 16-9 15-13-7-6-40-22-48-22-12 0 24-4 32-18 32-10 0-23-5-30-12zm28-29c0-11-4-17-10-14-5 3-10 13-10 21s5 14 10 14c6 0 10-9 10-21zM202 578c-7-7-12-20-12-30 0-13-8-18-25-18-16 0-25-6-25-15 0-13 13-15 73-13 67 3 72 5 75 26 7 46-55 81-86 50zm56-20c19-19 14-28-18-28-18 0-30 5-30 13 0 28 27 36 48 15zM199 459c-18-34 3-69 40-69 45 0 66 44 35 74-22 23-61 20-75-5zm66-24c0-22-31-33-47-17-17 17-1 44 24 40 15-2 23-10 23-23zM145 361c-12-11-3-21 19-21 17 0 26-7 30-25 4-15 16-27 31-31 47-12 73 13 61 59-5 21-11 23-71 23-36 0-68-2-70-5zm123-38c-2-12-12-18-28-18s-26 6-28 18c-3 13 3 17 28 17s31-4 28-17zM220 246c-36-13-66-29-68-37-1-9 20-21 68-35 38-12 70-17 70-12 0 6-9 12-20 15-13 4-20 14-20 30s7 27 20 30c11 3 20 12 20 19 0 8-1 14-2 13-2 0-32-11-68-23zm8-44c-1-5-14-5-28-1l-25 6 25 10c24 10 36 3 28-15z"
              transform="matrix(.1 0 0 -.1 0 1000)"
            ></path>
          </svg>
        </Btn>

        <Btn
          text={t("calculate_distance_key")}
          btnToggle={CalculateDistanceToggle}
          handleClick={handleCalculateDistance}
          Styles={Styles}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M480 288H224V32c0-17.67-14.33-32-32-32H32C14.33 0 0 14.33 0 32v448c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32V320c0-17.67-14.33-32-32-32zM48 48h128v48h-72c-4.42 0-8 3.58-8 8v16c0 4.42 3.58 8 8 8h72v48h-72c-4.42 0-8 3.58-8 8v16c0 4.42 3.58 8 8 8h72v48h-72c-4.42 0-8 3.58-8 8v16c0 4.42 3.58 8 8 8h72v25.38l-128 128V48zm416 416H70.62l128-128H224v72c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-72h48v72c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-72h48v72c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-72h48v128z"></path>
          </svg>
        </Btn>

        <Btn
          text={t("view_geofences_key")}
          btnToggle={geofencesViewToggle}
          handleClick={handleViewGeofences}
          Styles={Styles}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1"
            viewBox="0 0 256 256"
          >
            <path
              d="M1113 2545c-324-59-602-284-722-586-52-131-65-200-65-354 0-114 4-156 23-225 79-296 276-635 576-995 87-104 346-385 355-385s268 281 355 385c300 360 497 699 576 995 30 110 33 327 6 434-93 374-379 650-752 727-104 22-246 23-352 4zm282-480c172-45 305-179 350-352 65-249-94-511-350-578-251-65-513 94-580 350-89 343 237 669 580 580z"
              transform="matrix(.1 0 0 -.1 0 256)"
            ></path>
          </svg>
        </Btn>

        <Btn
          text={t("warning_key")}
          btnToggle={showViewWarningModal}
          handleClick={handleShowWarnings}
          Styles={Styles}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            version="1.1"
            viewBox="0 0 92 92"
            xmlSpace="preserve"
          >
            <path d="M88 87H4c-1.4 0-2.7-.8-3.5-2-.7-1.2-.7-2.7 0-4l42-74c.7-1.3 2-2 3.5-2s2.8.8 3.5 2l42 74c.7 1.2.7 2.8 0 4-.8 1.2-2.1 2-3.5 2zm-77.1-8h70.3L46 17.1 10.9 79zM50 55.1V36.5c0-2.2-1.8-4-4-4s-4 1.8-4 4v18.6c0 2.2 1.8 4 4 4s4-1.8 4-4zm-.5 16.6c.9-.9 1.5-2.2 1.5-3.5 0-1.3-.5-2.6-1.5-3.5-.9-.9-2.2-1.5-3.5-1.5-1.3 0-2.6.5-3.5 1.5-.9.9-1.5 2.2-1.5 3.5 0 1.3.5 2.6 1.5 3.5.9.9 2.2 1.5 3.5 1.5 1.3 0 2.6-.6 3.5-1.5z"></path>
          </svg>
        </Btn>

        <Btn
          text={t("geofences_key")}
          btnToggle={showViewFencModal}
          handleClick={handleShowGeofences}
          Styles={Styles}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1"
            viewBox="0 0 64 64"
          >
            <path
              d="M82 537c-16-17-22-36-22-70 0-26-4-47-10-47-5 0-10-9-10-20s5-20 10-20c6 0 10-33 10-80s-4-80-10-80c-5 0-10-9-10-20s5-20 10-20c6 0 10-20 10-45V90h100v45c0 38 3 45 20 45s20-7 20-45V90h100v45c0 38 3 45 20 45s20-7 20-45V90h100v45c0 38 3 45 20 45s20-7 20-45V90h100v45c0 25 5 45 10 45 6 0 10 9 10 20s-4 20-10 20-10 33-10 80 4 80 10 80 10 9 10 20-4 20-10 20c-5 0-10 22-10 48 0 39-5 53-25 72l-25 23-25-23c-20-19-25-33-25-72 0-41-3-48-20-48s-20 7-20 48c0 39-5 53-25 72l-25 23-25-23c-20-19-25-33-25-72 0-41-3-48-20-48s-20 7-20 48c0 39-5 53-25 72l-25 23-25-23c-20-19-25-33-25-72 0-41-3-48-20-48s-20 7-20 48c0 38-5 53-23 70-29 27-29 27-55-1zm118-237c0-73-2-80-20-80s-20 7-20 80 2 80 20 80 20-7 20-80zm140 0c0-73-2-80-20-80s-20 7-20 80 2 80 20 80 20-7 20-80zm140 0c0-73-2-80-20-80s-20 7-20 80 2 80 20 80 20-7 20-80z"
              transform="matrix(.1 0 0 -.1 0 64)"
            ></path>
          </svg>
        </Btn>

        <Btn
          text={t("landmarks_key")}
          btnToggle={showViewMarkModal}
          handleClick={handleShowMarks}
          Styles={Styles}
        >
          <svg
            width="26px"
            height="26px"
            viewBox="0 -32 576 576"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs
              style={{
                fill: addLandMarks
                  ? "#fbfbfb !important"
                  : "#246c66 !important",
              }}
            ></defs>
            <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z" />
          </svg>
        </Btn>
        <Btn
          text={t("show_landmarks_key")}
          btnToggle={viewLandMarkstoggle}
          handleClick={handleViewLandMarks}
          Styles={Styles}
        >
          <svg
            style={{
              fill: viewLandMarkstoggle
                ? "#fbfbfb !important"
                : "#246c66 !important",
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path d="M30 6l4.59 4.59-5.76 5.75 2.83 2.83 5.75-5.76L42 18V6zM6 18l4.59-4.59 5.75 5.76 2.83-2.83-5.76-5.75L18 6H6zm12 24l-4.59-4.59 5.76-5.75-2.83-2.83-5.75 5.76L6 30v12zm24-12l-4.59 4.59-5.75-5.76-2.83 2.83 5.76 5.75L30 42h12z"></path>
          </svg>
        </Btn>
        <Btn
          text={t("enable_disable_clusters_key")}
          btnToggle={clusterToggle}
          handleClick={handleCluster}
          Styles={Styles}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 546.9 571.02">
            <defs
              style={{
                fill: clusterToggle
                  ? "#fbfbfb !important"
                  : "#246c66 !important",
              }}
            ></defs>
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <path
                  className="cls-1"
                  d="m221.07 389.56-52.39 90.73 52.39 90.73h104.76l52.39-90.73-52.39-90.73H221.07zM389.75 292.17l-52.38 90.73 52.38 90.73h104.77l52.38-90.73-52.38-90.73H389.75zM389.75 278.85h104.77l52.38-90.73-52.38-90.73H389.75l-52.38 90.73 52.38 90.73zM325.83 181.46l52.39-90.73L325.83 0H221.07l-52.39 90.73 52.39 90.73h104.76zM157.15 278.85l52.39-90.73-52.39-90.73H52.38L0 188.12l52.38 90.73h104.77zM157.15 292.17H52.38L0 382.9l52.38 90.73h104.77l52.39-90.73-52.39-90.73zM221.07 194.78l-52.39 90.73 52.39 90.73h104.76l52.39-90.73-52.39-90.73H221.07z"
                />
              </g>
            </g>
          </svg>
        </Btn>
        <Btn
          text={t("export_key")}
          Styles={Styles}
          // handleClick = {() => {exportButtonAvalability && exportToCsv("TreeExportedData.csv", exportData)}}
          handleClick={() => {
            exportButtonAvalability &&
              convertJsonToExcel(exportData, "TreeExportedData.csv");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            version="1.1"
            viewBox="0 0 92 92"
            xmlSpace="preserve"
            fillOpacity={exportButtonAvalability ? 1 : 0.5}
          >
            <path d="M73 76.5v5c0 2.2-1.9 3.5-4.1 3.5H3.6C1.4 85 0 83.8 0 81.5V32.1c0-2.2 1.4-4.2 3.6-4.2h11.7c2.2 0 4 1.8 4 4s-1.8 4-4 4H8V77h57v-.5c0-2.2 1.8-4 4-4s4 1.8 4 4zm17.8-37.3L66 64.5c-1.2 1.2-2.9 1.5-4.4.9-1.6-.7-2.6-2.1-2.6-3.8V50.7c-8-.2-27.2.6-34.2 12.9-.7 1.3-2.1 2.1-3.5 2.1-.3 0-.7 0-1-.1-1.8-.5-3-2.1-3-3.9 0-.6 0-16.1 11.6-27.6C36.2 26.6 46 22.6 59 21.9V11c0-1.6 1-3.1 2.5-3.7 1.6-.6 3.3-.3 4.5.9l24.9 25.3c1.5 1.6 1.5 4.1-.1 5.7zm-8.6-2.9L67 20.9v4.9c0 2.2-1.7 4-4 4-12.4 0-21.9 3.3-28.4 9.9-3 3-5 6.3-6.3 9.5 9.4-5.6 21.3-6.6 28.6-6.6 3.8 0 6.3.3 6.6.3 2 .2 3.5 2 3.5 4v4.9l15.2-15.5z"></path>
          </svg>
        </Btn>
      </div>
    </>
  );
};

export default Btns;
