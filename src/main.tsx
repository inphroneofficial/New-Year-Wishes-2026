import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);

/* 🔥 REMOVE HTML BOOT LOADER AFTER REACT IS READY */
const bootLoader = document.getElementById("boot-loader");
if (bootLoader) {
  bootLoader.remove();
}
