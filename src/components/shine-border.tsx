"use client";

import * as React from "react";
import { cn } from "../utils";

type TColorProp = string | string[];

interface ShineBorderProps {
    borderRadius?: number;
    borderWidth?: number;
    duration?: number;
    color?: TColorProp;
    className?: string;
    borderClassName?: string;
    style?: Record<string, unknown>;
    children: React.ReactNode;
}

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
 * @param children contains react node elements.
 */
const ShineBorder = React.forwardRef(
    (
        {
            borderRadius = 100,
            borderWidth = 2.2,
            duration = 10,
            color = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
            className,
            borderClassName,
            children,
            style,
        }: ShineBorderProps,
        ref,
    ) => {
        return (
            <div
                ref={ref as React.RefObject<HTMLDivElement>}
                style={
                    {
                        "--border-radius": `${borderRadius}px`,
                        ...style,
                    } as React.CSSProperties
                }
                className={cn(
                    "relative grid place-items-center rounded-[--border-radius] bg-white p-[4px] text-black dark:bg-black dark:text-white",
                    className,
                )}
            >
                <div
                    style={
                        {
                            "--border-width": `${borderWidth}px`,
                            "--border-radius": `${borderRadius}px`,
                            "--duration": `${duration}s`,
                            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${
                                color instanceof Array ? color.join(",") : color
                            },transparent,transparent)`,
                        } as React.CSSProperties
                    }
                    className={cn(
                        `before:bg-shine-size pointer-events-none before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:![mask-composite:exclude] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine`,
                        borderClassName,
                    )}
                ></div>
                {children}
            </div>
        );
    },
);

ShineBorder.displayName = "ShineBorder";

export default ShineBorder;
