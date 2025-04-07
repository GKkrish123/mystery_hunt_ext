import React, { useEffect, useState } from "react";
import { Switch } from "./switch";
import { Button } from "./button";
import Loader from "./app-loader";
import { auth } from "@src/firebase-user";
import browser from "webextension-polyfill";
import { Label } from "./label";
import LetterPullup from "./letter-pullup";

export function ControlForm() {
    const [loggingOut, setLoggingOut] = useState(false);
    const [toggleState, setToggleState] = useState(false);

    const setToggleRootState = async () => {
        const state = await browser.runtime.sendMessage({
            type: "GET_MYSTERY_CONTENT_STATE",
        });
        setToggleState(!!state);
    };

    useEffect(() => {
        setToggleRootState();
    }, []);

    return (
        <div className="flex flex-col gap-[12px] items-center justify-center p-[8px]">
            <LetterPullup
                wrapperClassName="left-1/2 right-1/2 w-[calc(100%-5.5rem)] w-full justify-center"
                className="pointer-events-none mt-2 z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text text-xl font-bold text-transparent dark:text-transparent md:text-xl"
                words="Mysteryverse"
                forHeader={true}
            />
            <div className="flex items-center space-x-2">
                <Label htmlFor="mysteryverse-tools">Tools</Label>
                <Switch
                    className="border-black dark:border-white"
                    checked={toggleState}
                    onCheckedChange={async (enabled) => {
                        await browser.runtime.sendMessage({
                            type: "TOGGLE_MYSTERY_CONTENT",
                            enabled,
                        });
                        setToggleState(enabled);
                    }}
                />
            </div>
            <Button
                disabled={loggingOut}
                onClick={() => {
                    setLoggingOut(true);
                    auth.signOut();
                }}
                className="w-full dark:bg-white dark:border-black dark:text-black dark:hover:bg-white/80"
            >
                {loggingOut ? (
                    <>
                        <Loader className="text-white dark:text-black" />
                        Logging you out...
                    </>
                ) : (
                    "Logout"
                )}
            </Button>
        </div>
    );
}
