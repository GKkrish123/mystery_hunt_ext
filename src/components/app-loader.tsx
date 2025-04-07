import React from "react";
import { cn } from "../utils";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: { className?: string }) => {
    return (
        <Loader2
            className={cn(
                "my-[100px] h-[64px] w-[64px] animate-spin text-primary/60",
                className,
            )}
        />
    );
};

export default Loader;
