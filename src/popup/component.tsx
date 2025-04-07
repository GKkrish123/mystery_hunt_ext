import React from "react";
import ShineBorder from "@src/components/shine-border";
import { AuthProvider } from "@src/components/auth-provider";
import { ControlForm } from "@src/components/control-form";

export function Popup() {
    return (
        <ShineBorder
            borderRadius={0}
            className="mystery-container flex items-center justify-center min-w-[160px] min-h-[160px] p-[8px]"
        >
            <AuthProvider>
                <ControlForm />
            </AuthProvider>
        </ShineBorder>
    );
}
