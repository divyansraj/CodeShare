import { createSlice } from '@reduxjs/toolkit'

const RoomSlice = createSlice({
  name: "room",
  initialState: {
    roomId: "",
    userName: "",
    totaljoined:"",
  },
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setTotalJoined:(state, action) => {
      state.totaljoined = action.payload;
    },
  },
});

export const { setRoomId, setUserName, setTotalJoined } = RoomSlice.actions;
export default RoomSlice.reducer;