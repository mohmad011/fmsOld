import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import Styles from "styles/WidgetMenu.module.scss";
import ChartCpm from "components/history/chart";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const StepperComp = dynamic(() => import("components/history/stepper"), {
  ssr: false,
});
const MapWithNoSSR = dynamic(() => import("components/history/map"), {
  ssr: false,
});
const History = () => {
  const map = useRef();

  const { config } = useSelector((state) => state);
  const [toggleMinuTrack, setToggleMinuTrack] = useState(true);
  const [chartModal, setchartModal] = useState(false);

  const [SelectedLocations, setSelectedLocations] = useState([]);

  const handleToggleMinuTrack = () => setToggleMinuTrack((prev) => !prev);

  const htmlTag = document.getElementsByTagName("html")[0];

  return (
    <div id="map" className="mt-5 position-relative">
      <ChartCpm
        chartModal={chartModal}
        setchartModal={setchartModal}
        SelectedLocations={SelectedLocations}
      />
      <MapWithNoSSR map={map} />
      <aside className={`${config.darkMode && Styles.dark}`}>
        <nav
          className={`${Styles.nav} ${
            htmlTag.getAttribute("dir") === "ltr" && Styles.history_nav
          }  ${
            toggleMinuTrack && Styles.active
          } position-absolute rounded shadow-lg pt-5 `}
          // overflow-hidden
          id="widget_menu"
          style={{ opacity: 1 }}
        >
          <StepperComp
            map={map}
            chartModal={chartModal}
            setchartModal={setchartModal}
            SelectedLocations={SelectedLocations}
            setSelectedLocations={setSelectedLocations}
          />
        </nav>
        <div
          onClick={handleToggleMinuTrack}
          className={`${Styles.hamburger} ${
            htmlTag.getAttribute("dir") === "ltr" && Styles.history_hamburger
          } ${toggleMinuTrack && Styles.active}`}
        >
          <span className={Styles.hamburger__patty} />
          <span className={Styles.hamburger__patty} />
          <span className={Styles.hamburger__patty} />
        </div>
      </aside>
    </div>
  );
};

export default History;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "main",
        "common",
        "Dashboard",
        "Table",
        "history",
      ])),
    },
  };
}
