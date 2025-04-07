import browser from "webextension-polyfill";
import { auth } from "./firebase-user";

const updateToggleState = async (enabled: boolean, tabId: number) => {
    const { mysteryScriptTabs } =
        await browser.storage.local.get("mysteryScriptTabs");
    let newTabsArray = [
        ...(JSON.parse((mysteryScriptTabs as any) || "[]") as Array<number>),
        tabId,
    ];
    if (!enabled) {
        newTabsArray = newTabsArray.filter((t) => t !== tabId);
    }
    await browser.storage.local.set({
        mysteryScriptTabs: JSON.stringify(newTabsArray),
    });
};

const getToggleState = async (tabId: number) => {
    const { mysteryScriptTabs } =
        await browser.storage.local.get("mysteryScriptTabs");
    return (
        JSON.parse((mysteryScriptTabs as any) || "[]") as Array<number>
    ).includes(tabId);
};

const toggleContentScript = async (enabled: boolean) => {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    if (tabs.length > 0 && tabs[0].id) {
        const tabId = tabs[0].id;
        await updateToggleState(enabled, tabId); // Save toggle state
        await injectContentScript(tabId, enabled); // Inject or remove content script
    }
};

// Listener for tab updates (optional: for cases like reload)
browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.status === "complete") {
        const toggleState = await getToggleState(tabId);
        await injectContentScript(tabId, toggleState); // Inject or remove content script based on state
    }
});

const injectContentScript = async (tabId: number, enabled: boolean) => {
    try {
        if (enabled) {
            // Inject content script and styles dynamically
            await browser.scripting.insertCSS({
                target: { tabId },
                files: ["css/popup.css"],
            });
            await browser.scripting.executeScript({
                target: { tabId },
                files: ["js/content.js"],
            });
        } else {
            await browser.scripting.removeCSS({
                target: { tabId },
                files: ["css/popup.css"],
            });
        }
        await browser.tabs.sendMessage(tabId, {
            type: "TOGGLE_MYSTERY_CONTENT",
            enabled,
        });
    } catch (error) {
        console.error("Error injecting/unregistering content script:", error);
    }
};

let currentUser: any = null;
let logoutTimeout: ReturnType<typeof setTimeout> | null = null;

const clearLogoutTimeout = () => {
    if (logoutTimeout) {
        clearTimeout(logoutTimeout);
        logoutTimeout = null;
    }
};

const scheduleLogout = (timeUntilExpiryMs: number) => {
    clearLogoutTimeout();
    logoutTimeout = setTimeout(async () => {
        console.log("Token expired, logging out.");
        await browser.runtime.sendMessage({
            type: "REMOVE_ALL_MYSTERY_OVERLAY",
        });
        await auth.signOut(); // Sign out the user
        currentUser = null; // Clear user state
        await notifyAuthProvider(); // Notify popup about logged-out status
    }, timeUntilExpiryMs);
};

// Helper: Notify popup about the user's state
const notifyAuthProvider = async () => {
    browser.runtime.sendMessage({
        type: "USER_UPDATED",
        payload: currentUser,
    });
};

// Token Management
const handleTokenRefresh = async (user: any) => {
    clearLogoutTimeout();
    if (user) {
        const tokenResult = await user.getIdTokenResult();
        const expirationTime = new Date(tokenResult.expirationTime).getTime();
        await browser.storage.local.set({
            "mystery-token": tokenResult.token,
            "mystery-token-boom": expirationTime,
        });

        const timeUntilExpiryMs = expirationTime - Date.now() - 60 * 1000; // Schedule 1 minute before expiry
        if (timeUntilExpiryMs > 0) {
            scheduleLogout(timeUntilExpiryMs);
        } else {
            // Token is already expired
            console.log("Token already expired, logging out.");
            await browser.runtime.sendMessage({
                type: "REMOVE_ALL_MYSTERY_OVERLAY",
            });
            await auth.signOut();
            currentUser = null;
            await notifyAuthProvider();
        }
    } else {
        console.log("No user found, logging out.");
        await removeAllInstances();
        await browser.storage.local.remove([
            "mystery-token",
            "mystery-token-boom",
        ]);
        currentUser = null;
        await notifyAuthProvider();
    }
};

// Handle user state changes
auth.onAuthStateChanged(async (user) => {
    currentUser = user || null;
    await notifyAuthProvider();

    if (user) {
        await handleTokenRefresh(user); // Refresh token and schedule logout
    } else {
        clearLogoutTimeout();
        await browser.runtime.sendMessage({
            type: "REMOVE_ALL_MYSTERY_OVERLAY",
        });
        await browser.storage.local.remove([
            "mystery-token",
            "mystery-token-boom",
        ]);
    }
});

// Listen for token changes and refresh token
auth.onIdTokenChanged(async (user) => {
    await handleTokenRefresh(user);
});

const removeAllInstances = async () => {
    try {
        const { mysteryScriptTabs } =
            await browser.storage.local.get("mysteryScriptTabs");

        const tabs = JSON.parse((mysteryScriptTabs as any) || "" || "[]");
        await browser.storage.local.remove(["mysteryScriptTabs"]);

        const removeOverlayPromises = tabs.map(async (tab: number) => {
            try {
                await browser.tabs.sendMessage(tab, {
                    type: "TOGGLE_MYSTERY_CONTENT",
                    enabled: false,
                });
            } catch (error) {
                console.error(
                    `Couldn't remove overlay from tab ${tab}:`,
                    error,
                );
            }
        });

        await Promise.all(removeOverlayPromises);
    } catch (error) {
        console.error("Error removing overlay from all tabs:", error);
    }
};

browser.runtime.onMessage.addListener(
    async (message: any, sender, sendResponse) => {
        if (message.type === "REMOVE_ALL_MYSTERY_OVERLAY") {
            await removeAllInstances();
        } else if (message.type === "TOGGLE_MYSTERY_CONTENT") {
            await toggleContentScript(!!message.enabled);
        } else if (message.type === "GET_USER") {
            return currentUser;
        } else if (message.type === "GET_MYSTERY_CONTENT_STATE") {
            const tabs = await browser.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (tabs.length > 0 && tabs[0].id) {
                return getToggleState(tabs[0].id);
            } else {
                return false;
            }
        }
        return true; // Indicates asynchronous response
    },
);

// Cleanup on unload
browser.runtime.onSuspend.addListener(async () => {
    clearLogoutTimeout();
    await browser.runtime.sendMessage({
        type: "REMOVE_ALL_MYSTERY_OVERLAY",
    });
    console.log("Background script unloaded, cleared timeout.");
});
