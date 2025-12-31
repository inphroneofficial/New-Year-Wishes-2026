import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/* 🔥 CONFIG: loader minimum time (ms) */
const MIN_LOADER_TIME = 2500; // ← increase to 3000 if you want slower

/* 🔥 Track when page started */
const loaderStart = Date.now();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

/* 🔥 Render React */
createRoot(rootElement).render(<App />);

/* 🔥 Safe loader removal */
function removeBootLoader() {
  const bootLoader = document.getElementById("boot-loader");
  if (!bootLoader) return;

  const elapsed = Date.now() - loaderStart;
  const remaining = Math.max(0, MIN_LOADER_TIME - elapsed);

  setTimeout(() => {
    bootLoader.style.opacity = "0";

    setTimeout(() => {
      bootLoader.remove();
    }, 500); // fade duration
  }, remaining);
}

/* 🔥 WAIT until browser is fully ready */
if (document.readyState === "complete") {
  requestAnimationFrame(removeBootLoader);
} else {
  window.addEventListener("load", () => {
    requestAnimationFrame(removeBootLoader);
  });
}
