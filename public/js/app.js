import { db, collection, getDocs } from "./db";

const prophecyList = document.getElementById('prophecyList'); // container for prophecies


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker registered ✅", reg.scope))
      .catch((err) => console.log("Service Worker registration failed ❌", err));
  });
}



