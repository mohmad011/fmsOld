import { configureStore } from "@reduxjs/toolkit";
import ToggleMenuSlice from "./slices/toggleSidebar";
import ConfigSlice from "./slices/config";
import fetchUserSlice from "./slices/auth";
import ToggleHeaderSlice from "./slices/toggle-header";
import FirebaseSlice from "./slices/vehicleProcessStatus";
import VehicleInfo from "./slices/vehicleInfo";
import VehicleIds from "./slices/vehicleIds";
import SimCard from "./slices/simCard";
import AramcoTestService from "./slices/aramcoTestService";
import AddDevicesInfo from "./slices/addDevicesInfo";
import UserInfo from "./slices/userInfo";
import AccountInfo from "./slices/accountInfo";
import DataTree from "./slices/dataTree";
import ParentAccountData from "./slices/ParentAccountData";
import StreamData from "./slices/StreamData";
import MainMap from "./slices/mainMap";
import apiLoginAction from "./slices/apiLoginAction";
import addNewVehicleReducer from "./slices/addNewVehicle";
import addNewDeviceReducer from "./slices/addNewDevice";
import addFormDatas from "./slices/addForm";
import PaymentSlice from "./slices/PaymentData";




export default configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    toggleMenu: ToggleMenuSlice,
    config: ConfigSlice,
    auth: fetchUserSlice,
    loginAction: apiLoginAction,
    ToggleHeader: ToggleHeaderSlice,
    firebase: FirebaseSlice,
    vehicleInfo: VehicleInfo,
    vehicleIds: VehicleIds,
    simCard: SimCard,
    aramcoTestService: AramcoTestService,
    addDevicesInfo: AddDevicesInfo,
    userInfo: UserInfo,
    mainMap: MainMap,
    accountInfo: AccountInfo,
    dataTree: DataTree,
    parentAccountData: ParentAccountData,
    streamData: StreamData,
    addNewVehicle: addNewVehicleReducer,
    addNewDevice: addNewDeviceReducer,
    addFormDatas: addFormDatas,
    PaymentSlice: PaymentSlice

  }
});
