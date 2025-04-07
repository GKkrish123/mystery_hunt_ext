import * as React from "react";
// import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { Popup } from "./component";
import "../css/app.css";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
    createRoot(document.getElementById("mysteryverse-popup")).render(<Popup />);
    // ReactDOM.render(<Popup />, document.getElementById("mysteryverse-popup"));
});
