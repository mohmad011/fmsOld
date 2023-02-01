import {
  locConfigModel,
  locDataModel,
  Date2KSA,
  WeightVoltToKG,
  isDateExpired,
} from "../helpers/helpers";
import dynamic from "next/dynamic";
const { Mapjs } = dynamic(() => import("../components/maps/leafletchild"), {
  ssr: false,
});

const StreamHelper = () => {
  const { latLng } = require("leaflet");

  const groupBykey = (list, key) => {
    return list.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const holdStatus = [600, 5, 0, 2];
  const CalcMileage = (Mileage) => ((Mileage ?? 0) / 1000).toFixed(1);
  const CalcDuration = (newInfo, oldInfo) => {
    if (oldInfo?.lastTrip) {
      // let RecordDateTimeNew = new Date(Date2KSA(newInfo.RecordDateTime)).getTime()
      let RecordDateTimeNew = new Date(Date2KSA(new Date())).getTime()
      let RecordDateTimeOld = new Date(oldInfo.lastTrip[1]).getTime()
      return Math.abs(
        RecordDateTimeNew - RecordDateTimeOld
      ); //in ms
    } else {
      return Math.abs(
        new Date(Date2KSA(new Date().getTime())) -
          new Date(oldInfo.RecordDateTime ?? newInfo.RecordDateTime)
      ); //in ms
    }
  };

  const CalcDistance = (newInfo, oldInfo) =>
    parseFloat(
      CalcMileage(
        latLng(newInfo.Latitude ?? 0, newInfo.Longitude ?? 0).distanceTo(
          latLng(oldInfo.Latitude ?? 0, oldInfo.Longitude ?? 0)
        )
      )
    );
  const aggregate = (VehFullData, newInfo, oldInfo) => {
    // [newInfo.SpeedLimit] = [oldInfo.SpeedLimit];
    newInfo.SpeedLimit = oldInfo.SpeedLimit;
    switch (newInfo.DeviceTypeID) {
      case 1:
        newInfo.Mileage = parseFloat(oldInfo.Mileage ?? 0);
        newInfo.Mileage += !holdStatus.includes(newInfo.VehicleStatus)
          ? CalcDistance(newInfo, oldInfo)
          : 0;
        newInfo.Mileage = newInfo.Mileage.toFixed(1);
        break;
      default:
        break;
    }
    newInfo.VehicleStatus = CalcVstatus(newInfo);
    
    newInfo.Duration = CalcDuration(newInfo, oldInfo);
    newInfo.Duration +=
      newInfo.VehicleStatus == oldInfo.VehicleStatus &&
      Number.isInteger(oldInfo.Duration)
        ? oldInfo.Duration
        : 0;
    /*
      1- get data from local storage
      2- filter data by VehicleID and asign it to (selectedVehicle)
      3- check if selectedVehicle have those keys (EndEvent , EndDate)
      4- if not make a request to get the updated selected Vehicle
      5- do updateing on local storage by the updated selected Vehicle
      6- check if EngineStatus in _locInfo is not equal to EngineStatus in the updated selected Vehicle
      7- if not do updateing on local storage by the updated selected Vehicle on (EndEvent , EndDate)
      8- if yes do updateing on local storage by the updated selected Vehicle on (EndDate)
    */

    newInfo.WeightReading = WeightVoltToKG(newInfo, oldInfo);

    if (oldInfo != null) {
      if (oldInfo.SyncAdd == undefined)
        oldInfo.SyncAdd = Object.assign(
          {},
          {
            Address: oldInfo.Address,
            RecordDateTime: oldInfo.RecordDateTime,
            Longitude: oldInfo.Longitude,
            Latitude: oldInfo.Latitude,
          }
        );
      var SyncAdd = oldInfo.SyncAdd;

      if (
        !Mapjs?.helpers?.isValidAddress(newInfo.Address) &&
        Mapjs?.helpers?.isValidAddress(SyncAdd.Address)
      )
        newInfo.Address = SyncAdd.Address;
    }
  };

  const CalcVstatus = (newInfo) => {
    var Status = 5;
    if (isDateExpired(newInfo)) {
      newInfo.VehicleStatus = 5;
      Status = 5;
    } else if (newInfo.IsFuelCutOff == true || newInfo.IsFuelCutOff == 1) {
      Status = 203;
    } else if (newInfo.IsPowerCutOff) {
      Status = 201;
    } else if (newInfo.EngineStatus == 1 && newInfo.Speed <= 5) {
      Status = 2;
    } else if (
      newInfo.EngineStatus == 1 &&
      newInfo.Speed > newInfo.SpeedLimit
    ) {
      Status = 101;
    } else if (
      newInfo.EngineStatus == 1 &&
      newInfo.Speed < 120 &&
      newInfo.Speed > 5
    ) {
      Status = 1;
    } else if (newInfo.EngineStatus == 0 && newInfo.Speed > 0) {
      Status = 300;
    } else if (newInfo.EngineStatus == 0) {
      Status = 0;
    }
    return Status;
  };

  const tolocInfo = function (_message, config = false) {
    var data = _message.val();
    var _locInfo = Object.assign({}, config ? locConfigModel : locDataModel);

    return Object.assign(_locInfo, data);
  };

  const fbtolocInfo = (_message, VehFullData, _initial = false) => {
    var data = _message?.val ? _message.val() : _message;
    if (data == null) return { locInfo: null, updated: false };

    var _newInfo = { ...locDataModel };
    _newInfo = { ..._newInfo, ...data };

    _newInfo.SerialNumber = _newInfo.SerialNumber ?? _newInfo.Serial;
    _newInfo.RecordDateTime = Date2KSA(_newInfo.RecordDateTime + ".000Z");

    _newInfo.Mileage = CalcMileage(_newInfo.Mileage);
    if (isDateExpired(_newInfo)) _newInfo.VehicleStatus = 5;
    delete _newInfo.Serial;

    let _oldInfo = {
      ...VehFullData.find((x) => x.SerialNumber == _newInfo.SerialNumber),
    };
    if (JSON.stringify(_oldInfo) == "{}") {
      return { locInfo: null, updated: false };
    }

    if (
      _oldInfo.Latitude > 0 &&
      _newInfo.RecordDateTime != null &&
      new Date(_newInfo.RecordDateTime) < new Date(_oldInfo.RecordDateTime)
    )
      return { locInfo: _oldInfo, updated: false };
    if (_initial) setTimeout(() => {}, Math.floor(Math.random() * 5 * 6e4) + 1);
    // let _oldInfoCopy = JSON.parse(JSON.stringify(_oldInfo));
    aggregate(VehFullData, _newInfo, _oldInfo, _initial);
    if (_oldInfo?.lastTrip != null) {
      // do update by setLocalStorage
      let lastTrip = [...JSON.parse(JSON.stringify(_oldInfo))?.lastTrip]
      if (
        (_newInfo?.EngineStatus && _oldInfo?.lastTrip[0]) ||
        (!_newInfo?.EngineStatus && !_oldInfo?.lastTrip[0])
      ) {
        // _oldInfoCopy.lastTrip[1] = new Date(_newInfo.RecordDateTime);
      } else {
        // console.log("lastTrip" , lastTrip)
        lastTrip[0] = _newInfo.EngineStatus;
        lastTrip[1] = new Date(_newInfo.RecordDateTime);
      }
      _oldInfo?.lastTrip = lastTrip
      // _oldInfo = { ..._oldInfoCopy };
    }
    
    
    
    Object.assign(_oldInfo, _newInfo); //_oldInfo = { ..._oldInfo, ...locInfo };//join fix and updated data
    // console.log(_oldInfo?.lastTrip);
    return { locInfo: _oldInfo, updated: true };
  };
  const checkNewOfflines = (VehFullData) => {
    var newOfflines = VehFullData?.filter(
      (x) => x?.VehicleStatus != 5 || x?.VehicleStatus != 600
    ).filter((x) => isDateExpired(x));
    newOfflines = newOfflines?.map((x) => {
      return { ...x, VehicleStatus: 5 };
    });
    return newOfflines;
  };

  return {
    groupBykey,
    holdStatus,
    CalcMileage,
    CalcDuration,
    CalcDistance,
    aggregate,
    CalcVstatus,
    tolocInfo,
    fbtolocInfo,
    checkNewOfflines,
  };
};

export default StreamHelper;
