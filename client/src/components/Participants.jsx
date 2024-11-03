import { useEffect, useState } from "react";
import UserAvatar from "react-user-avatar";
//import { setTotalJoined } from "../utils/RoomSlice";
import { useDispatch } from "react-redux";
const Participants = ({ clients = [] }) => {
  //const dispatch = useDispatch();
  const [length,setLength] = useState(0);
  const getCount =()=>{
    let userCount =0;
    clients.forEach((client) => {
      if(client.username){
        userCount+=1;
      }
    });
    return userCount;
  }
  useEffect(()=>{
    getCount(setLength());
    console.log(length);
  },[clients])

  return (
     <div className="flex flex-row flex-wrap gap-5 p-4 text-white font-semibold">
      {clients.map((client, index) => (
        <div key={index} className="flex flex-col justify-center items-center">
          <UserAvatar size="50" name={client.username} />
          <h1>{client.username}</h1>
        </div>
      ))}
    </div>
  );
};

export default Participants;
