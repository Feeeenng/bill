import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme as antdTheme } from "antd";
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: "#36f6f0",
          colorBgBase: "#030206",
          borderRadius: 12,
          fontSize: 14
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
