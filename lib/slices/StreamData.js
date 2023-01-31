import { createSlice } from "@reduxjs/toolkit";

import UseStreamHelper from "helpers/streamHelper";

export const StreamData = createSlice({
  name: "StreamData",
  initialState: {
    VehFullData: [],
    VehTotal: {},
    VehMap: [],
    VehMapFiltered: [],
    status: {},
    running: false,
  },
  reducers: {
    addFullVehData: (state, { payload }) => {
      const { CalcVstatus } = UseStreamHelper();

      const FullVehData = payload?.map((l) => {
        return { ...l, VehicleStatus: CalcVstatus(l) };
      });
      state.VehFullData = [...FullVehData];
    },
    addVehMapFiltered: (state, { payload }) => {
      state.VehMapFiltered = [...payload];
    },
    UpdateVehMapFiltered: (state, { payload }) => {
      if (payload?.isPatched) {
        state.VehMapFiltered = state.VehMapFiltered?.map((old) => {
          let updatedObj = payload.patch.find(
            (ele) => ele.SerialNumber === old.SerialNumber
          );

          return { ...old, ...updatedObj };
        });
      } else {
        state.VehMapFiltered[
          state.VehMapFiltered.findIndex(
            (x) => x?.SerialNumber == payload?.patch?.SerialNumber
          )
        ] = payload.patch;
      }
    },
    countVehTotal: (state) => {
      const { groupBykey } = UseStreamHelper();
      const statusGroups = groupBykey(state.VehFullData, "VehicleStatus");
      const totalDrivers =
        state.VehFullData.filter((v) => v["DriverID"])?.length ?? 0;
      state.VehTotal = {
        totalVehs: state.VehFullData.length,
        activeVehs:
          state.VehFullData.length -
          (statusGroups[5]?.length || 0 + statusGroups[600]?.length || 0),
        offlineVehs:
          (statusGroups[5]?.length || 0) + (statusGroups[600]?.length || 0), //
        idlingVehs: statusGroups[2]?.length ?? 0, //
        RunningVehs: statusGroups[1]?.length ?? 0, //
        stoppedVehs: statusGroups[0]?.length ?? 0, //
        ospeedVehs: statusGroups[101]?.length ?? 0, //
        osspeedVehs: statusGroups[100]?.length ?? 0, //
        invalidVehs: statusGroups[203]?.length ?? 0, //
        totalDrivers: totalDrivers,
        activeDrivers:
          totalDrivers -
          (statusGroups[5]?.filter((v) => v["DriverID"])?.length ?? 0),
      };
    },
    UpdateVehicle: (state, { payload }) => {
      if (payload?.isPatched) {
        state.VehFullData = state.VehFullData?.map((old) => {
          let updatedObj = payload.patch.find(
            (ele) => ele.SerialNumber === old.SerialNumber
          );

          return { ...old, ...updatedObj };
        });
      } else {
        state.VehFullData[
          state.VehFullData.findIndex(
            (x) => x?.SerialNumber == payload?.patch?.SerialNumber
          )
        ] = payload.patch;
      }
    },
    updateStRunning: (state, { payload = true }) => {
      state.running = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addFullVehData,
  countVehTotal,
  updateFbLocInfo,
  filterVehFullData,
  addVehMapFiltered,
  UpdateVehMapFiltered,
  UpdateVehicle,
  updateStRunning,
} = StreamData.actions;

export default StreamData.reducer;
