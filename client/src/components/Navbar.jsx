import React, { useEffect } from "react";
import Select from "react-select";
import { useSocket, useSocketReady } from "../utils/SocketContext";
import { useParams } from "react-router-dom";

const Navbar = ({
  userLang,
  setUserLang,
  userTheme,
  setUserTheme,
  fontSize,
  setFontSize,
}) => {
  const socketRef = useSocket();
  const socketReady = useSocketReady();
  const { roomId } = useParams();

  const languages = [
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "JavaScript" },
  ];

  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];

  useEffect(() => {
    if (socketReady && socketRef.current) {
      socketRef.current.on(
        "updateUserLang",
        ({ roomId: updatedRoomId, updateUserLang }) => {
          if (updatedRoomId === roomId) {
            setUserLang(updateUserLang);
          }
        }
      );
      socketRef.current.on(
        "updateUserTheme",
        ({ roomId: updatedRoomId, updateUserTheme }) => {
          if (updatedRoomId === roomId) {
            setUserTheme(updateUserTheme);
          }
        }
      );
      socketRef.current.on(
        "updateFontSize",
        ({ roomId: updatedRoomId, updateFontSize }) => {
          if (updatedRoomId === roomId) {
            setFontSize(updateFontSize);
          }
        }
      );
    }
    return () => {
      socketRef.current.off("updateUserLang");
      socketRef.current.off("updateUserTheme");
      socketRef.current.off("updateFontSize");
    };
  }, [socketReady, socketRef, setUserLang, setUserTheme, setFontSize, roomId]);

  const handleLangChange = (e) => {
    setUserLang(e.value);
    socketRef.current.emit("lang", { roomId, lang: e.value }); // Emit with roomId
  };

  const handleThemeChange = (e) => {
    setUserTheme(e.value);
    socketRef.current.emit("theme", { roomId, theme: e.value }); // Emit with roomId
  };

  const handleFontChange = (e) => {
    setFontSize(Number(e.target.value));
    socketRef.current.emit("fontsize", { roomId, fontSize: e.target.value }); // Emit with roomId
  };

  return (
    <div className="navbar flex items-center justify-between bg-gray-800 text-white p-4 shadow-lg">
      <h1 className="text-2xl font-semibold text-green-400">Code Compiler</h1>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <Select
          className="text-gray-500 w-28"
          options={languages}
          value={languages.find((lang) => lang.value === userLang)}
          onChange={handleLangChange}
          placeholder="Language"
          styles={{
            control: (base) => ({ ...base, backgroundColor: "#2d3748" }),
            menu: (base) => ({ ...base, backgroundColor: "#1a202c" }),
            singleValue: (base) => ({ ...base, color: "#cbd5e0" }),
          }}
        />

        {/* Theme Selector */}
        <Select
          className="text-gray-500 w-28"
          options={themes}
          value={themes.find((theme) => theme.value === userTheme)}
          onChange={handleThemeChange}
          placeholder="Theme"
          styles={{
            control: (base) => ({ ...base, backgroundColor: "#2d3748" }),
            menu: (base) => ({ ...base, backgroundColor: "#1a202c" }),
            singleValue: (base) => ({ ...base, color: "#cbd5e0" }),
          }}
        />

        {/* Font Size Slider */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Font Size</label>
          <input
            type="range"
            min="18"
            max="30"
            value={fontSize}
            step="2"
            onChange={handleFontChange}
            className="w-24 bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
          />
          <span className="text-sm">{fontSize}px</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
