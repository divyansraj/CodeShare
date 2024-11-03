import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./utils/store.jsx";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./utils/SocketContext.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </SocketProvider>
);
