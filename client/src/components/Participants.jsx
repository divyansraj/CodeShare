//import UserAvatar from "react-user-avatar";
import Avatar from "@mui/material/Avatar";
const Participants = ({ clients = [] }) => {


  return (
    <div className="flex flex-row flex-wrap gap-5 p-4 text-white font-semibold">
      {clients.map((client, index) => (
        <div key={index} className="flex flex-col justify-center items-center">
          <Avatar
          alt={client.username}
          size="50"
            name={client.username}
          />
          <h1>{client.username}</h1>
        </div>
      ))}
    </div>
  );
};

export default Participants;
