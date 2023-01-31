import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useStreamDataState from "hooks/useStreamDataState";
import { useDispatch, useSelector } from "react-redux";
import Actions from "components/track/Actions";
import ConfigPopup from "components/track/ConfigPopup";
import { Button } from "react-bootstrap";
import { updateStRunning } from "lib/slices/StreamData";
import { exportToCsv } from "../helpers/helpers";

import MenuBottom from "components/maps/menu-bottom/index";

const WidgetMenu = dynamic(() => import("components/maps/WidgetMenu"), {
  loading: () => <header />,
  // ssr: false,
});
const MapWithNoSSR = dynamic(() => import("components/maps/vector"), {
  ssr: false,
});

const Map = () => {
  const dispatch = useDispatch();
  const { myMap } = useSelector((state) => state.mainMap);
  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const { VehFullData, VehMapFiltered, running } = useSelector(
    (state) => state.streamData
  );
  const { trackStreamLoader } = useStreamDataState(VehMapFiltered);

  const [mainFilter, setmainFilter] = useState(null);
  const [carsIconsFilter, setcarsIconsFilter] = useState(null);
  const [serialNumberFilter, setserialNumberFilter] = useState("");
  const [addressFilter, setaddressFilter] = useState("");
  const [speedFromFilter, setspeedFromFilter] = useState("");
  const [speedToFilter, setspeedToFilter] = useState("");

  const [displayNameFilter, setDisplayNameFilter] = useState("");
  const [plateNumberFilter, setPlateNumberFilter] = useState("");

  const [allTreeData, setAllTreeData] = useState([]);
  const [vehChecked, setVehChecked] = useState([]);
  const [destroyed, setDestroyed] = useState(false);
  const [toggleMinuTrack, setToggleMinuTrack] = useState(false);

  const {
    config: { darkMode },
  } = useSelector((state) => state);

  useEffect(() => {
    // myMap && myMap?.deselectAll();
    // myMap && trackStreamLoader(VehFullData);
    if (myMap && !running) {
      myMap?.deselectAll();
      trackStreamLoader(VehFullData, VehMapFiltered);

      dispatch(updateStRunning());
    }
  }, [myMap]);

  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html")[0];
    darkMode
      ? htmlTag.setAttribute("darkMode", true)
      : htmlTag.setAttribute("darkMode", false);
  }, [darkMode]);

  const handleDownLoadDataVehs = () => {
    const ids = document
      ?.getElementById("downLoadDataVehs")
      ?.getAttribute("data-id")
      .split(",")
      .map((item) => +item);

    const allData = VehFullData.filter((item) => ids.includes(+item.VehicleID));
    exportToCsv("selectedVehicles.csv", allData);
  };

  return (
    <div id="map" className="mt-5 position-relative">
      <MapWithNoSSR myMap={myMap} />

      <Suspense fallback={"loading"}>
        <WidgetMenu
          setVehChecked={setVehChecked}
          vehChecked={vehChecked}
          setDestroyed={setDestroyed}
          allTreeData={allTreeData}
          setAllTreeData={setAllTreeData}
          toggleMinuTrack={toggleMinuTrack}
          setToggleMinuTrack={setToggleMinuTrack}
          //////////
          setmainFilter={setmainFilter}
          setcarsIconsFilter={setcarsIconsFilter}
          setserialNumberFilter={setserialNumberFilter}
          setaddressFilter={setaddressFilter}
          setspeedFromFilter={setspeedFromFilter}
          setspeedToFilter={setspeedToFilter}
          setDisplayNameFilter={setDisplayNameFilter}
          setPlateNumberFilter={setPlateNumberFilter}
          mainFilter={mainFilter}
          carsIconsFilter={carsIconsFilter}
          serialNumberFilter={serialNumberFilter}
          addressFilter={addressFilter}
          speedFromFilter={speedFromFilter}
          speedToFilter={speedToFilter}
          displayNameFilter={displayNameFilter}
          plateNumberFilter={plateNumberFilter}
        />
      </Suspense>
      <MenuBottom
        setDestroyed={setDestroyed}
        destroyed={destroyed}
        setVehChecked={setVehChecked}
        //////
        setmainFilter={setmainFilter}
        setcarsIconsFilter={setcarsIconsFilter}
        setserialNumberFilter={setserialNumberFilter}
        setaddressFilter={setaddressFilter}
        setspeedFromFilter={setspeedFromFilter}
        setspeedToFilter={setspeedToFilter}
        setDisplayNameFilter={setDisplayNameFilter}
        setPlateNumberFilter={setPlateNumberFilter}
      />
      {/* leafletchild actions */}
      <Actions
        vehChecked={vehChecked}
        allTreeData={allTreeData}
        setAllTreeData={setAllTreeData}
        setVehChecked={setVehChecked}
      />

      <Suspense fallback={"loading"}>
        <Button
          id="ConfigPopup"
          className="d-none"
          onClick={() => setShowConfigPopup(true)}
        ></Button>
        {showConfigPopup ? (
          <ConfigPopup
            vehChecked={vehChecked}
            show={showConfigPopup}
            setShow={setShowConfigPopup}
          />
        ) : null}
      </Suspense>
      {/* downLoadDataVehs */}
      <Suspense fallback={"loading"}>
        <Button
          id="downLoadDataVehs"
          className="d-none"
          onClick={() => handleDownLoadDataVehs()}
        ></Button>
      </Suspense>
    </div>
  );
};
export default Map;
// translation ##################################
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "main",
        "common",
        "Dashboard",
        "Table",
      ])),
    },
  };
}
