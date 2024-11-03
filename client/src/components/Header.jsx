import { setRoomId,setUserName } from "../utils/RoomSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import image from "../assets/download.png";

const Header = () => {
  const {roomId} = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const myRoomId = useSelector((store) => store.room.roomId)
  //const myUserName = useSelector((store) => store.room.userName)
  const handleCopy = () => {
    
    navigator.clipboard.writeText(roomId);
    toast.success("Copied to clipboard")
  }
  const handleEnd =(e) => {
    e.preventDefault();
    dispatch(setRoomId(""));
    dispatch(setUserName(""));
    toast.success("Room ended")
    navigate('/');
  }
  return (
    <div className="flex items-center justify-between bg-green-500 p-2 shadow-md">
      <div className="flex items-center">
        <div className="w-10 h-10 mr-2">
          <img src={image} alt="Logo" className="object-cover rounded-full" />
        </div>
        <h1 className="text-xl font-semibold text-white">Sharing Live</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        onClick={handleCopy}
        >
          Copy
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
        onClick={handleEnd}>
          End
        </button>
      </div>
      <div className="flex flex-col items-end text-white">
        <span className="text-sm">Timer elapsed: 00:00</span>
        <span className="text-sm">Total Joined: 0</span>
      </div>
    </div>
  );
};

export default Header;
