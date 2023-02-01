import { async } from "@firebase/util";
import axios from "axios";

// fetch All scheduled Reports
export const fetchAllScheduledReports = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/reports/userReport`,
  });
  return response.data;
};

// getting Reports types
export const fetchAllReportsTypes = async () => {
  const response = await axios({
    method: "get",
    url: `/dashboard/reports`,
  });

  return response.data;
};

// getting uservehicle
export const fetchAllUserVehicles = async () => {
  const response = await axios({
    method: "get",
    url: `/dashboard/reports/userVehicles`,
  });

  return response.data;
};


// getting users
export const fetchAllUsers = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/reports/allusers`,
  });

  return response.data;
};

// delete report
// export const deleteReport = async (item) => {
//   const response = await axios({
//     method: "delete",
//     url: `/dashboard/reports`,
//   });

//   return response.data;
// };

//
