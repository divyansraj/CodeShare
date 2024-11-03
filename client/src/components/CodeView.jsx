import { useEffect, useState } from "react";
import { useSocket, useSocketReady } from "../utils/SocketContext";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar";
import Axios from "axios";
import spinner from "./spinner.svg";
import { useParams } from "react-router-dom";

const CodeView = () => {
  const socketRef = useSocket();
  const socketReady = useSocketReady();
  const { roomId } = useParams();

  const [userCode, setUserCode] = useState(``);
  const [userLang, setUserLang] = useState("python");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(20);
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const options = { fontSize };

  const compile = async () => {
    setLoading(true);
    if (userCode === ``) return;

    try {
      const res = await Axios.post(`http://localhost:8000/api/compile`, {
        code: userCode,
        language: userLang,
        input: userInput,
      });
      const output = res.data.stdout || res.data.stderr;
      setUserOutput(output);
      socketRef.current.emit("output", { roomId, output }); // Emit with roomId
    } catch (err) {
      const errOutput =
        "Error: " + (err.response ? err.response.data.error : err.message);
      setUserOutput(errOutput);
      socketRef.current.emit("output", { roomId, errOutput }); // Emit with roomId
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socketReady && socketRef.current) {
      // Initial synchronization
      socketRef.current.on(
        "syncInitialState",
        ({ userRoomId, code, input, output, lang, theme, font }) => {
          if (userRoomId === roomId) {
            setUserCode(code);
            setUserInput(input);
            setUserOutput(output);
            setUserLang(lang);
            setUserTheme(theme);
            setFontSize(font);
          }
        }
      );

      socketRef.current.on(
        "updateContent",
        ({ roomId: updatedRoomId, updatedContent }) => {
          if (updatedRoomId === roomId) {
            setUserCode(updatedContent);
          }
        }
      );

      socketRef.current.on(
        "updatedInput",
        ({ roomId: updatedRoomId, updatedInput }) => {
          if (updatedRoomId === roomId) {
            setUserInput(updatedInput);
          }
        }
      );

      socketRef.current.on(
        "updatedOutput",
        ({ roomId: updatedRoomId, updatedOutput }) => {
          if (updatedRoomId === roomId) {
            setUserOutput(updatedOutput);
          }
        }
      );
    }

    return () => {
      socketRef.current.off("updateContent");
      socketRef.current.off("updatedInput");
      socketRef.current.off("updatedOutput");
    };
  }, [socketReady, socketRef, roomId]);

  const clearOutput = () => setUserOutput("");
  const handleEdit = (value) => {
    const updatedContent = value;
    setUserCode(updatedContent);
    socketRef.current.emit("edit", {
      roomId: roomId,
      content: updatedContent,
    });
  };

  const handleInput = (e) => {
    setUserInput(e.target.value);
    socketRef.current.emit("input", { roomId, input: e.target.value }); // Emit with roomId
  };

  return (
    <div className="flex flex-col h-[92vh] bg-gray-800 text-white">
      <Navbar
        userLang={userLang}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <div className="flex h-full">
        {/* Editor Container */}
        <div className="w-3/5 p-4 relative bg-gray-900">
          <Editor
            options={options}
            value={userCode}
            height="100%"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="python"
            onChange={handleEdit}
          />
          <button
            onClick={compile}
            className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-gray-900 font-semibold rounded-md hover:bg-green-400 transition"
          >
            Run
          </button>
        </div>

        {/* Input and Output Container */}
        <div className="w-2/5 bg-gray-900 border-l-4 border-green-500 p-4 space-y-4">
          {/* Input Section */}
          <div className="flex flex-col h-1/2">
            <h4 className="text-lg font-semibold text-green-400">Input:</h4>
            <textarea
              value={userInput}
              onChange={handleInput}
              className="h-full w-full bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            ></textarea>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-1/2">
            <h4 className="text-lg font-semibold text-green-400">Output:</h4>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <img src={spinner} alt="Loading..." className="w-16 h-16" />
              </div>
            ) : (
              <div className="relative h-full bg-gray-800 text-gray-200 p-2 rounded-md overflow-y-auto">
                <pre>{userOutput}</pre>
                <button
                  onClick={clearOutput}
                  className="absolute bottom-4 right-4 px-3 py-1 bg-red-500 text-gray-900 font-semibold rounded-md hover:bg-red-400 transition"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeView;
