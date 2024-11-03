import { useState } from "react";
import image from "../assets/home.jpeg";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setRoomId, setUserName } from "../utils/RoomSlice";
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const createRoomID = (e) => {
    e.preventDefault();
    const newroomid = uuid();
    setRoom(newroomid);
    dispatch(setRoomId(newroomid));
  };
  const handleSubmit = () => {
    if (!name || !room) {
      toast.error("Please enter both room ID and your name");
      return;
    }
    dispatch(setUserName(name));
    navigate(`/collab/${room}`);
    toast.success("Room created successfully");
  };
  const handleEnter = (e) => {
    if (e.code === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 rounded-lg p-8 w-[900px] shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          <div className="w-80">
            <img src={image} alt="homeimg" className="rounded-md shadow-md" />
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyUp={handleEnter}
            />
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyUp={handleEnter}
              className="px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md mt-4"
              onClick={handleSubmit}
            >
              Join Room
            </button>
            <div>
              <span className="text-white">Do not have a room? </span>
              <span
                className="text-indigo-500 cursor-pointer"
                onClick={createRoomID}
              >
                Create a Room
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
