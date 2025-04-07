import { MagicButton } from "@src/components/magic-button";
import React from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

const containerId = "mysteryverse-overlay";
let container = document.getElementById(containerId);

// Store the root instance for cleanup
let root;

const injectComponent = () => {
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
    }

    // Create the root if it doesn't already exist
    if (!root) {
        root = createRoot(container);
    }

    root.render(<MagicButton />);
};

const removeComponent = () => {
    if (root) {
        root.unmount(); // Clean up React component
        root = null; // Clear the reference
    }
    if (container) {
        container.remove(); // Remove the container from the DOM
        container = null; // Clear the reference
    }
};

async function tabListener(message: any, sender, sendResponse) {
    if (message.type === "TOGGLE_MYSTERY_CONTENT") {
        if (message.enabled) {
            injectComponent();
        } else {
            removeComponent();
        }
    }
}

if (!window._tabListenerRegistered) {
    console.log("Registering tabListener");
    window._tabListenerRegistered = true;
    browser.runtime.onMessage.addListener(tabListener);
}
