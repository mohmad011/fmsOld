import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import configUrls from "config/config";

import { Date2KSA, locConfigModel } from "helpers/helpers";
import StreamHelper from "helpers/streamHelper";

import {
  addFullVehData,
  countVehTotal,
  UpdateVehicle,
  UpdateVehMapFiltered,
} from "lib/slices/StreamData";
import { encryptName } from "helpers/encryptions";
import { useSession } from "next-auth/client";
import { toast } from "react-toastify";

function useStreamDataState() {
  // useDispatch to update the global state
  const dispatch = useDispatch();
  const [session] = useSession();

  const userData = JSON.parse(
    localStorage.getItem(encryptName("userData")) ?? "{}"
  );

  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };

  let fbSubscribers = [];
  const { myMap } = useSelector((state) => state.mainMap);
  // const VehMapFiltered = useSelector((state) => state.streamData);
  // console.log("VehMapFiltered", VehMapFiltered.VehMapFiltered);

  let updatePatchSet = null;

  const UpdateAction = (locInfo, patchTimeSec) => {
    const userData = JSON.parse(
      localStorage.getItem(encryptName("userData")) ?? "{}"
    );

    updatePatchSet = updatePatchSet ?? { StartAt: new Date(), Data: {} };
    updatePatchSet.Data[locInfo?.SerialNumber] = locInfo;

    const updatePatchSetData = Object.values(updatePatchSet.Data).map(
      (item) => {
        const targetVeh = userData?.vehData?.find(
          (x) => x?.SerialNumber == item?.SerialNumber
        );
        if (targetVeh?.SerialNumber == item?.SerialNumber) {
          item.configJson = targetVeh?.configJson;
          return item;
        } else {
          return item;
        }
      }
    );
    const patchObj = {
      patch: updatePatchSetData,
      isPatched: true,
    };

    const now = new Date();
    const getLayers = myMap?.activeGroup().getLayers();
    let counter = 0;
    // console.log("getLayers", getLayers);
    const patchSinceSec = (now.getTime() - updatePatchSet.StartAt) / 1000;
    if (patchSinceSec >= patchTimeSec) {
      // || patchObj?.patch?.length > 100
      dispatch(UpdateVehicle(patchObj));
      // dispatch(UpdateVehMapFiltered(patchObj));
      dispatch(countVehTotal());

      getLayers.forEach((v) => {
        const updateVehicle = patchObj.patch?.find(
          (vf) => vf.SerialNumber == v?.options?.locInfo?.SerialNumber
        );

        if (updateVehicle != undefined) myMap?.UpdateMarker(updateVehicle);
      });

      // setInterval(() => {
      //   const updateVehicle = patchObj.patch?.find(
      //     (vf) =>
      //       vf.SerialNumber ==
      //       getLayers[counter]?.options?.locInfo?.SerialNumber
      //   );

      //   if (updateVehicle != undefined) myMap?.UpdateMarker(updateVehicle);

      //   counter++;

      //   if (counter === patchObj?.patch?.length - 1) {
      //     counter = 0;
      //   }
      // }, 30);

      updatePatchSet = null;
    }
  };

  const FbSubscribe = async (VehFullData, vehicles, onlyOnce = false) => {
    let typeConnnection = "fireBase";
    if (typeConnnection === "fireBase") {
      const { fbtolocInfo, tolocInfo } = StreamHelper();

      // const patchTimeSec =
      //   vehicles?.length > 1000
      //     ? Math.floor(vehicles?.length / 1000) * 60
      //     : vehicles?.length > 500 && vehicles?.length < 1000
      //     ? 30
      //     : vehicles?.length > 100 && vehicles?.length < 500
      //     ? 20
      //     : 10;

      const patchTimeSec = 5;

      const subid = fbSubscribers.push({ cancel: false }) - 1;

      let SerialNumbers = vehicles?.map((i) => i?.SerialNumber);
      const updatedDataObj = {};

      const App = initializeApp(firebaseConfig, "updatefb");
      const db = getDatabase(App);

      await SerialNumbers.forEach((SerialNumber) => {
        onValue(
          ref(db, SerialNumber),
          (snapshot) => {
            if (!snapshot.hasChildren()) return;
            if (fbSubscribers[subid].cancel) return;
            const locinfo = tolocInfo(snapshot);
            updatedDataObj[locinfo?.SerialNumber] = locinfo;

            snapshot.exists();
          },
          (error) => {
            console.error("error : ", error);
            toast.error(`Error: ${Object.stringify(error)}`);
          },
          { onlyOnce: onlyOnce }
        );
      });

      let counter = 0;

      setInterval(() => {
        // console.log("VehMapFiltered in FbSubscribe", VehMapFiltered);
        const updatedData = Object.values(updatedDataObj);

        const { locInfo, updated } = fbtolocInfo(
          updatedData[counter],
          vehicles
        );
        if (updated) {
          UpdateAction(locInfo, patchTimeSec);
        }
        counter++;

        if (counter === vehicles.length - 1) {
          counter = 0;
        }
      }, 10);
    }
  };

  const apiGetVehicles = async (localExpireMin = 30) => {
    let vehStorage = {};
    let updatedResult = [];
    let updated = false;

    vehStorage = userData["userId"] == session?.user?.user?.id ? userData : {};

    if (!localStorage.getItem(encryptName("updatedStorage"))) {
      localStorage.clear();
      vehStorage = {};
    }

    const isStorageExpired =
      (new Date(vehStorage?.updateTime) ?? new Date(0)) <
      new Date(new Date().setMinutes(new Date().getMinutes() - localExpireMin));
    if (!vehStorage?.vehData?.length || isStorageExpired) {
      let pageNo = 0;
      let pageSize = 500;
      const apiData = [];
      do {
        apiData = await apiLoadVehSettings(++pageNo, pageSize, true); //load full data
        updatedResult = updatedResult.concat(apiData);
        dispatch(addFullVehData([...updatedResult]));
        dispatch(countVehTotal());
      } while (apiData.length >= pageSize);

      updated = true;
    }

    if (!updatedResult.length) {
      updatedResult = vehStorage.vehData;
      updatedResult && dispatch(addFullVehData([...updatedResult]));
      // dispatch(countVehTotal());
    }

    if (updated) {
      localStorage.setItem(
        encryptName("userData"),
        JSON.stringify({
          userId: session?.user?.user?.id,
          updateTime: new Date(),
          vehData: updatedResult,
        })
      );
      localStorage.setItem(encryptName("updatedStorage"), true);
    }

    return {
      updatedResult,
    };
  };

  const setLocalStorage = (newStorageData) => {
    const oldStorage = JSON.parse(
      localStorage.getItem(encryptName("userData")) ?? "{}"
    );
    localStorage.setItem(
      encryptName("userData"),
      JSON.stringify({ ...oldStorage, ...newStorageData })
    );
  };

  const apiLoadVehSettings = async (
    pageNumber = 1,
    pageSize = 500,
    withLoc = true
  ) => {
    const data = await axios
      .get(
        `vehicles/settings?withloc=${
          withLoc ? 1 : 0
        }&pageNumber=${pageNumber}&pageSize=${pageSize}`
      )
      .then((res) => {
        let result =
          res.data?.map((x) => {
            return {
              ...locConfigModel,
              ...x,
              SpeedLimit: (x?.SpeedLimit ?? 0) > 0 ? x?.SpeedLimit : 120,
              MinVolt: x?.MinVolt ?? 0,
              MaxVolt: x?.MaxVolt ?? 0,
              RecordDateTime: Date2KSA(
                x.RecordDateTime || locConfigModel.RecordDateTime
              ),
              SerialNumber: x?.SerialNumber
                ? x?.SerialNumber
                : `NoSerial_${Math.floor(Math.random() * 100000)}`,
            };
          }) || [];
        return result;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        return [];
      });
    return data;
  };

  const trackStreamLoader = async (VehFullData) => {
    const updatedResult = (await apiGetVehicles(30)).updatedResult;

    await FbSubscribe(VehFullData, updatedResult);
    dispatch(countVehTotal());

    setInterval(() => {
      const { checkNewOfflines } = StreamHelper();
      const newOfflines = checkNewOfflines(VehFullData);
      if (newOfflines?.length) {
        newOfflines.forEach((x) => UpdateAction(x));
      }
    }, 6 * 1000);
  };

  return {
    trackStreamLoader,
    FbSubscribe,
    setLocalStorage,
  };
}

export default useStreamDataState;
