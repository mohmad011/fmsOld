import axios from "axios";
// import moment from "moment";
import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  goOffline,
  goOnline,
  onValue,
  ref,
} from "firebase/database";
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


function Test(props) {
  console.log("props" , props)
  return (
    <div className="card m-3 p-3">
      <h2>Server side pagination in the React AG Grid - </h2>
      <div
        className="ag-theme-alpine ag-style"
        style={{ height: "600px" }}
      ></div>
    </div>
  );
}

export default Test;

export async function getServerSideProps(){
  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };

  let fbSubscribers = [];
  let updatedDataObj = {}

 await axios
  .get(
    `vehicles/settings?withloc=1&pageNumber=1&pageSize=500`
  )
  .then((res) => {
    return res.data;
  }).then(async(vehicles) => {
    const App = initializeApp(firebaseConfig, "updatefb");
    const db = getDatabase(App);
    let SerialNumbers = vehicles?.map((i) => i?.SerialNumber);
    
    await SerialNumbers.forEach((SerialNumber) => {
      onValue(
        ref(db, SerialNumber),
        (snapshot) => {
          if (!snapshot.hasChildren()) return;
          updatedDataObj[snapshot.val()?.SerialNumber] = snapshot.val();
  
          snapshot.exists();
        },
        (error) => {
          console.error("error : ", error);
          toast.error(`Error: ${Object.stringify(error)}`);
        },
        { onlyOnce: onlyOnce }
      );
    });
  })
  .catch((error) => {
    toast.error(error?.response?.data?.message);
    return [];
  });

  return{
    props:{
      data:updatedDataObj
    }
  }
}