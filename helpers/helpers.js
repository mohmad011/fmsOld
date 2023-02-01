import axios from "axios";
import moment, { utc } from "moment";
import XLSX from "xlsx-js-style";
import * as _ from "lodash";

export const locDataModel = {
  Duration: 0,
  WeightReading: "-",
  Address: null,
  RecordDateTime: "2020-01-01T00:00:01", //"2020-01-01T00:00:01", //L.Saferoad.Vehicle.Helpers.Date2KSA(new Date(2020,01,01)),
  Latitude: 0,
  Longitude: 0,
  Direction: 0,
  Speed: 0,
  EngineStatus: -1,
  IgnitionStatus: -1,
  VehicleStatus: -1,
  Mileage: 0,
  Temp: 0,
  HUM: 0,
  DoorStatus: "-",
  IsValidRecord: "-",
  RemainingFuel: "-",
  StoppedTime: "-",
  StreetSpeed: "-",
  WeightVolt: -1,
  EngineTotalRunTime: -1,
  RPM: -1,
  AccelPedalPosition: -1,
  MileageMeter: -1,
  TotalMileage: -1,
  FuelLevelPer: -1,
  InstantFuelConsum: -1,
  TotalFuelConsum: -1,
  CoolantTemp: -1,
};

export const locConfigModel = {
  AccountID: null,
  VehicleID: null,
  SerialNumber: null,
  Serial: null,
  WorkingHours: -1,
  HeadWeight: 0,
  TailWeight: 0,
  TotalWeight: 0,
  MinVolt: 0,
  MaxVolt: 0,
  HasSensor: 0,
  Duration: 0,
  WeightReading: -1,
  Address: null,
  RecordDateTime: "2020-01-01T00:00:01",
  Latitude: 0,
  Longitude: 0,
  Direction: 0,
  Speed: 0,
  EngineStatus: -1,
  IgnitionStatus: -1,
  VehicleStatus: 5,
  Mileage: 0,
  DoorStatus: "-",
  IsValidRecord: "-",
  RemainingFuel: "-",
  StoppedTime: "-",
  StreetSpeed: "-",
  WeightVolt: -1,
  EngineTotalRunTime: -1,
  RPM: -1,
  AccelPedalPosition: -1,
  MileageMeter: -1,
  TotalMileage: -1,
  FuelLevelPer: -1,
  InstantFuelConsum: -1,
  TotalFuelConsum: -1,
  CoolantTemp: -1,
  Battery1: -1,
  Battery2: -1,
  Battery3: -1,
  Battery4: -1,
  Hum1: -1,
  Hum2: -1,
  Hum3: -1,
  Hum4: -1,
  Temp1: 3000,
  Temp2: 3000,
  Temp3: 3000,
  Temp4: 3000,
};

export const Date2KSA = (_date) => moment(_date).utc().local();

export const Date2UTC = (_date) =>
  new Date(
    _date.indexOf("Date") < 0
      ? _date + "+0000"
      : utc(_date ?? new Date(0)).format("YYYY-MM-DDTHH:mm:ss") + "-0300"
  );

export const isDateExpired = (_locInfo) => {
  // console.log(_locInfo?.RecordDateTime);
  const locDate =
    _locInfo?.RecordDateTime ??
    Date2KSA(new Date(new Date().getFullYear(), 0, 1));
  const ksaNow = Date2KSA(utc(new Date()).format("YYYY-MM-DDTHH:mm:ss"));
  let age = (new Date(ksaNow) - new Date(locDate)) / 36e5;
  return (_locInfo?.EngineStatus !== 0 && age > 0.5) || age > 4;
};

export const GetStatusString = (vehicleStatus) => {
  switch (vehicleStatus) {
    case 600:
    case 5:
      return "Offline.";
    case 101:
      return "Vehicle is Over Speeding.";
    case 100:
      return "Vehicle is running over street speed.";
    case 0:
      return "Vehicle is Stopped.";
    case 1:
      return "Vehicle is running normally.";
    case 2:
      return "Vehicle in Idle State.";
    default:
      return "Invalid Status";
  }
};

export const isValidAddress = (_address) =>
  !(
    _address == null ||
    _address == "Address not found" ||
    _address.includes("(")
  );

export const WeightVoltToKG = (_locInfo, _settings) => {
  if (_locInfo.WeightVolt < 0) return _settings.WeightReading;
  if (
    _locInfo.WeightVolt < _settings.MinVolt ||
    _settings.MinVolt == _settings.MaxVolt
  )
    return "Not Available";

  let weight =
    _settings.MaxVolt == _settings.MinVolt
      ? 0
      : ((_locInfo.WeightVolt - _settings.MinVolt) * _settings.TotalWeight) /
        (_settings.MaxVolt - _settings.MinVolt);
  weight += _settings.HeadWeight;
  weight = weight.toFixed(1);
  return weight;
};

export const iconUrl = (config, iconUrlLocal, VehicleStatus) => {
  let iconUrlPass;
  const iconsWithNames = {
    sedan1: "/assets/images/cars/car0/",
    minivan: "/assets/images/cars/car1/",
    sedan2: "/assets/images/cars/car2/",
    pickup: "/assets/images/cars/car3/",
    truck_head: "/assets/images/cars/car4/",
    reefer_truck: "/assets/images/cars/car5/",
    jeep: "/assets/images/cars/car6/",
    bus: "/assets/images/cars/car7/",
    truck: "/assets/images/cars/car8/",
  };

  if (config == null || config == "null" || config == undefined) {
    if (iconUrlLocal != undefined) {
      iconUrlPass = iconUrlLocal;
    } else {
      iconUrlPass = iconsWithNames["sedan1"];
    }
  } else {
    iconUrlPass =
      iconsWithNames[
        typeof config == "string" && config.includes("icon")
          ? JSON.parse(config).icon
          : config.icon
      ] ??
      iconUrlLocal ??
      iconsWithNames["sedan1"];
  }

  switch (VehicleStatus) {
    case 0:
    case 1:
    case 2:
    case 5:
    case 100:
    case 101:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 600:
      iconUrlPass += "5.png";
      break;
    default:
      iconUrlPass += "201.png";
  }
  return iconUrlPass;
};
export const VehicleOptions = (t) => {
  return [
    {
      label: t ? `${t("sedan_key")} 1` : "",
      name: "sedan1",
      value: "/assets/images/cars/car0/",
      img: "/assets/images/cars/car0/1.png",
    },
    {
      label: t ? `${t("minivan_key")}` : "",
      name: "minivan",
      value: "/assets/images/cars/car1/",
      img: "/assets/images/cars/car1/1.png",
    },
    {
      label: t ? `${t("sedan_key")} 2` : "",
      name: "sedan2",
      value: "/assets/images/cars/car2/",
      img: "/assets/images/cars/car2/1.png",
    },
    {
      label: t ? `${t("pickup_key")}` : "",
      name: "pickup",
      value: "/assets/images/cars/car3/",
      img: "/assets/images/cars/car3/1.png",
    },
    {
      label: t ? `${t("truck_head_key")}` : "",
      name: "truck_head",
      value: "/assets/images/cars/car4/",
      img: "/assets/images/cars/car4/1.png",
    },
    {
      label: t ? `${t("reefer_truck_key")}` : "",
      name: "reefer_truck",
      value: "/assets/images/cars/car5/",
      img: "/assets/images/cars/car5/1.png",
    },
    {
      label: t ? `${t("jeep_key")}` : "",
      name: "jeep",
      value: "/assets/images/cars/car6/",
      img: "/assets/images/cars/car6/1.png",
    },
    {
      label: t ? `${t("bus_key")}` : "",
      name: "bus",
      value: "/assets/images/cars/car7/",
      img: "/assets/images/cars/car6/1.png",
    },
    {
      label: t ? `${t("truck_key")}` : "",
      name: "truck",
      value: "/assets/images/cars/car8/",
      img: "/assets/images/cars/car6/1.png",
    },
  ];
};

export const getKey = (state) => {
  // 1 : Running
  // 0 : Stopped
  // 2 : Idling
  // 5 : Offline
  // 101 : Over Speed
  // 100 : Over Street Speed
  // 203 : Invalid location
  switch (state) {
    case 0:
      return "stopped";
    case 1:
      return "running";
    case 2:
      return "idling";
    case 5:
    case 600:
      return "offline";
    case 100:
      return "over_street_speed";
    case 101:
      return "over_speed";
    case 203:
    default:
      return "invalid_location";
  }
};

export const syncMapWithTree = (myMap, treeData, VehFullData, vehChecked) => {
  const visibleNodes = [...treeData];
  const hiddenNodes = VehFullData?.filter(
    (full) =>
      !visibleNodes.find((visible) => visible.VehicleID == full.VehicleID)
  );

  visibleNodes.forEach((visVeh) => {
    const isChecked = vehChecked.find(
      (chckVeh) => chckVeh.VehicleID == visVeh.VehicleID
    );
    const pinned = myMap && myMap.isExist(visVeh?.VehicleID);
    if (!!isChecked && !pinned) {
      myMap && myMap.pin(visVeh);
    } else if (!isChecked && pinned) myMap && myMap.unpin(visVeh?.VehicleID);
  });

  hiddenNodes?.forEach((hiddenVeh) => {
    myMap.unpin(hiddenVeh?.VehicleID);
  });
};

export const filterByNames = (t, data, inputValue) => {
  // Create a dynamic regex expression object with ignore case sensitivity
  const re = new RegExp(_.escapeRegExp(inputValue), "i");
  // clone the original data deeply
  // as we need to modify the array while iterating it
  const clonedData = _.cloneDeep(data);
  const results = clonedData.filter((object) => {
    // use filter instead of some
    // to make sure all items are checked
    // first check object.list and then check object.name
    // to avoid skipping list iteration when name matches
    return (
      object.subTitle.filter((item) => {
        if (re.test(t(item.name))) {
          item["highlight"] = true;
          return t(item.name);
        } else {
          return false;
        }
      }).length > 0 || re.test(t(object.name))
    );
  });
  // console.log("results in helpers", results);
  return results;
};

export const filterBySerialNumber = (data, inputValue) => {
  const re = new RegExp(_.escapeRegExp(inputValue), "i");
  const clonedData1 = _.cloneDeep(data);
  const clonedDataAlt1 = clonedData1[0].children;

  const results = clonedDataAlt1?.filter((object) => {
    return (
      object?.children?.filter((item) => {
        if (
          re.test(item.SerialNumber) &&
          item.SerialNumber.startsWith(inputValue)
        ) {
          // const matches = match(item.SerialNumber, inputValue);
          // item["subTitle"] = parse(item.SerialNumber, matches);
          // if (item.SerialNumber.startsWith(inputValue)) {
          // }

          item["highlight"] = true;
          // console.log("item in filterBySerialNumber", item, re.test(item));
          return item.SerialNumber;
        } else {
          return;
        }
      }).length > 0 || re.test(object.SerialNumber)
    );
  });
  // clonedData1.children = results;
  // const results1 = clonedData?.map((itemUp) => itemUp.children)
  // console.log("clonedData1 in helpers", clonedData1);
  return results;
};

export const filterByAnyWordsTrak = (data, inputValue, nameKey) => {
  // const re = new RegExp(_.escapeRegExp(inputValue), "i");
  const clonedData1 = _.cloneDeep(data);
  const clonedDataAlt1 = clonedData1[0].children;

  // console.log("clonedDataAlt1", clonedDataAlt1);

  // nameKey
  // SerialNumber

  // let EnteredNameKey = nameKey || "SerialNumber";

  console.log("inputValue , nameKey", inputValue, nameKey);

  const results = clonedDataAlt1?.filter((object) => {
    return (
      object?.children?.filter((item) => {
        if (nameKey === "Address") {
          let itemStr = String(item[nameKey]);
          console.log(
            "is equal Address",
            item,
            itemStr,
            item[nameKey]
            //   typeof item[nameKey],
            //   treeFilterFrom,
            //   treeFilterTo,
            //   inputValue
          );
          if (itemStr.toLocaleLowerCase().includes(inputValue)) {
            item["highlight"] = true;

            return itemStr;
          } else {
            return;
          }
        } else if (nameKey === "Speed") {
          const { treeFilterFrom, treeFilterTo } = inputValue;
          // console.log("inputValue is Speed", inputValue);
          if (
            (treeFilterFrom === 0 && treeFilterTo >= 0) ||
            (!isNaN(treeFilterFrom) && !isNaN(treeFilterTo))
          ) {
            // console.log(
            //   "is equal Speed",
            //   item,
            //   item[nameKey],
            //   typeof item[nameKey],
            //   treeFilterFrom,
            //   treeFilterTo,
            //   inputValue
            // );
            if (
              item[nameKey] > treeFilterFrom &&
              item[nameKey] <= treeFilterTo
            ) {
              item["highlight"] = true;

              return item[nameKey];
            } else {
              return;
            }
          }
        } else {
          let itemStr = String(item[nameKey]);
          // console.log("is Not equal", item);
          if (itemStr.toLocaleLowerCase().startsWith(inputValue)) {
            item["highlight"] = true;
            console.log(
              item
              //   item[nameKey],
              //   typeof item[nameKey],
              //   treeFilterFrom,
              //   treeFilterTo,
              //   inputValue
            );
            return itemStr;
          } else {
            return;
          }
        }
      }).length > 0
    );
  });

  // || re.test(object[nameKey])

  // clonedData1.children = results;
  // const results1 = clonedData?.map((itemUp) => itemUp.children)
  console.log("results in helpers", results);
  return results;
};

export function convertJsonToExcel(
  data = {},
  fileName = "",
  colorHeader = "246C66",
  colorRow = "babfc7"
) {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();

  const bucket = JSON.parse(
    JSON.stringify(new Array(Object?.keys(data[0]??{}).length).fill([]))
  );

  for (let i in data) {
    for (let j in bucket) {
      bucket[j].push(Object.values(data[i])[j]);
    }
  }
  // let maxLengthes = bucket.map(arr => ({"wch" : Math.max(...arr?.map(el => el?.toString().length))}))

  workSheet["!cols"] = [];
  workSheet["!rows"] = [];
  for (var i in workSheet) {
    if (typeof workSheet[i] != "object") continue;
    let cell = XLSX.utils.decode_cell(i);
    workSheet["!cols"].push({ wch: 30 });
    workSheet["!rows"].push({ hpx: 30 });
    workSheet[i].s = {
      // styling for all cells
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: false, // any truthy value here
      },
    };
    if (cell.r == 0) {
      // first row
      workSheet[i].s.fill = {
        // background color
        patternType: "solid",
        fgColor: { rgb: colorHeader },
        bgColor: { rgb: colorHeader },
      };
      workSheet[i].s.font = {
        color: { rgb: "ffffff" },
        sz: "12",
        bold: true,
      };
    }

    // check cell is an even number
    if (cell.r != 0 && cell.r % 2 == 0) {
      // first row
      workSheet[i].s.fill = {
        // background color
        patternType: "solid",
        fgColor: { rgb: colorRow },
        bgColor: { rgb: colorRow },
      };
      workSheet[i].s.font = {
        color: { rgb: "ffffff" },
        sz: "12",
        bold: true,
      };
    }
    // const result = (cell.r % 2  == 0) ? "even" : "odd";
  }
  // workSheet["!cols"]?.push(...maxLengthes)

  XLSX.utils.book_append_sheet(workBook, workSheet, fileName);
  // Generate buffer
  XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
  // Binary string
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  const theFile = XLSX.writeFile(workBook, `${fileName}.xlsx`);
  return theFile;
}

export function exportToCsv(filename, rows) {
  console.log("invoked", rows);
  if (!rows || !rows.length) {
    return;
  }
  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvData =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell =
              cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");
  console.log(csvData);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    // const link = document.querySelector("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      // link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export const fetchAllDrivers = async (token, setLoading, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/drivers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          const result = response.data;
          setData_table(result?.drivers);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const fetchAllMaintenance = async (token, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/management/maintenance`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then(({ data }) => {
      setData_table(data?.result);
    })
    .catch((err) => console.log(err));
};

export const fetchAllGeofence = async (token, setData_table) => {
  await axios
    .get(`geofences/dev`)
    .then(({ data }) => {
      setData_table(data?.allGeoFences?.map((item) => item.handledData));
    })
    .catch((err) => console.log(err));
};

export const handleGroups = (groups) => {
  if (groups["null"]) {
    groups["Un Grouped"] = [...groups["null"]];
  }
  if (groups["default"]) {
    groups["Default"] = [...groups["Default"], ...groups["default"]];
  }
  delete groups["null"];
  delete groups["default"];
  if (groups["Ungrouped"]?.length) {
    const UnGrouped = groups["Ungrouped"];
    delete groups["Ungrouped"];
    groups = { "Un Grouped": UnGrouped, ...groups };
  }

  const result = [
    {
      title: "All",
      children: [groups],
    },
  ];
  for (let key in result[0]?.children[0]) {
    if (Object.hasOwn(result[0]?.children[0], key))
      result[0]?.children?.push({
        title: key,
        children: result[0]?.children[0][key],
      });
  }
  result[0]?.children?.splice(0, 1);
  return result;
};

export const handleCheckKey = (keys, key) =>
  Object.keys(keys).some((element) => element == key);

export const handleFilterVehs = (statusVeh, streamData) => {
  let flterData;

  if (statusVeh.active === 2) {
    flterData = streamData.VehFullData.filter(
      (item) => item.VehicleStatus !== 5
    );
  } else if (statusVeh.stopped === 1) {
    flterData = streamData.VehFullData.filter(
      (item) => item.VehicleStatus === 5
    );
  } else {
    flterData = streamData.VehFullData;
  }

  return flterData;
};

export const fetchLoginAction = async () => {
  try {
    const res = await axios.get(
      "http://dashcam.saferoad.net:9966/vss/user/apiLogin.action?username=admin&password=21232f297a57a5a743894a0e4a801fc3"
    );
    console.log("res", res);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log("Failed to fetch loginAction", error);
  }
};

export const fetchData = async (token, setLoading, setData_table, api) => {
  let myToken = token.toString();
  setLoading(true);
  await axios
    .get(api, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        // console.log("response.status", response.status);
        const result = response.data;
        setData_table(result?.result);
      }
    })
    .finally(() => {
      setLoading(false);
    })
    .catch((err) => console.log(err));
};

export const postData = async (
  token,
  data,
  toast,
  setLoading,
  // path,
  api
) => {
  let myToken = token.toString();
  setLoading(true);
  await axios
    .post(api, data, {
      // method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((res) => {
      console.log("res.status , data", res.status, data);
      if (res.status === 201) {
        toast.success("Driver Add Successfully.");
        console.log("res.status , data", res.status, data);
        return "add";
      }
    })
    .catch((error) => {
      toast.error(`Error: ${error?.message}`);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const fetchAllSimCards = async (token, setLoading, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/management/sim?provider=4`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          // console.log("response.status", response.status);
          const result = response.data;
          setData_table(result?.result);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const fetchAllUnassignedSimCards = async (
  token,
  setLoading,
  setData_table
) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/management/sim/unassigned`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          // console.log("response.status", response.status);
          const result = response.data;
          setData_table(result?.result);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const updateDriver = (setOpenUpdate, setDriverID, id) => {
  setOpenUpdate(true);
  setDriverID(id);
};
