import Header from "../components/header";
import CodeView from "../components/CodeView";
import Participants from "../components/Participants";
import { useEffect, useState } from "react";
import { useSocket } from "../utils/SocketContext";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Interface = () => {
  const socketRef = useSocket();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  const myusername = useSelector((store) => store.room.userName);

  useEffect(() => {
    const init = async () => {
      if (!socketRef.current) return;

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("socket err", err);
        toast.error("Socket connection failed");
        navigate("/");
      };

      socketRef.current.emit("join", {
        roomId,
        myusername,
      });

      //listening for joined event
      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== myusername) {
          toast.success(`User ${username} joined the room`);
        }
        setClients(clients);
      });

      //listening for disconnected
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`User ${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex h-full ">
        <div className="w-3/4 ">
          <CodeView />
        </div>
        <div className="w-1/4 bg-gray-900">
          <h1 className="text-center text-lg text-orange-400 font-semibold">
            Participants
          </h1>
            <Participants clients={clients} />
        </div>
      </div>
    </div>
  );
};

export default Interface;
