const express = require("express");
const cors = require("cors");
const ACTIONS = require("./Actions");
const app = express();
const cookieParser = require("cookie-parser");


const PORT = process.env.PORT || 8000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://code-share-ten.vercel.app",
      "https://code-share-backend-one.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const userSocketMap = {};
const roomData = {}; // Object to hold data for each room

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join", ({ roomId, myusername }) => {
    userSocketMap[socket.id] = myusername;
    console.log(myusername, roomId);
    socket.join(roomId);

    // Initialize room data if it doesn't exist
    if (!roomData[roomId]) {
      roomData[roomId] = {
        code: "",
        input: "",
        output: "",
        lang: "",
        theme: "",
        font: "",
      };
    }

    // Sync initial state for the new user
    socket.emit("syncInitialState", {
      ...roomData[roomId], // Spread the room data
      userRoomId: roomId,
    });

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username: myusername,
        socketId: socket.id,
      });
    });
  });

  // Handle code editing
socket.on("edit", ({ roomId, content }) => {
  socket.to(roomId).emit("updateContent", { roomId, updatedContent: content });
});

socket.on("input", ({ roomId, input }) => {
  socket.to(roomId).emit("updatedInput", { roomId, updatedInput: input });
});

socket.on("output", ({ roomId, output }) => {
  socket.to(roomId).emit("updatedOutput", { roomId, updatedOutput: output });
});

// Language change event
socket.on("lang", ({ roomId, lang }) => {
  socket.to(roomId).emit("updateUserLang", { roomId, updateUserLang: lang });
});

// Theme change event
socket.on("theme", ({ roomId, theme }) => {
  socket.to(roomId).emit("updateUserTheme", { roomId, updateUserTheme: theme });
});

// Font size change event
socket.on("fontsize", ({ roomId, fontSize }) => {
  socket
    .to(roomId)
    .emit("updateFontSize", { roomId, updateFontSize: fontSize });
});


  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://code-share-ten.vercel.app",
      "https://code-share-backend-one.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Hello Server");
});

const compile = require("./routes/compile");
app.use("/api", compile);


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
