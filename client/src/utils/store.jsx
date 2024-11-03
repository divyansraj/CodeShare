import {configureStore} from '@reduxjs/toolkit';
import RoomSlice from "./RoomSlice";

const store = configureStore({
  reducer: {
    room: RoomSlice,
  },
});

export default store;
