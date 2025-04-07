"use client";

import * as React from "react";
import { type FC, type ReactNode, useState } from "react";
import {
    Polillo,
    Babuyan,
    Bohol,
    Pescador,
    Panay,
    Malalison,
    Palawan,
    Leyte,
    Lubang,
} from "./explode";
import { motion } from "framer-motion";
import {
    Axe,
    Flashlight,
    Paintbrush,
    Pickaxe,
    ScanEye,
    XIcon,
} from "lucide-react";
import { cn, getUniqueAttributes } from "../utils";
import { Button } from "./button";
import ShineBorder from "./shine-border";
import browser from "webextension-polyfill";

const ToolIcon = {
    torch: Flashlight,
    eye: ScanEye,
    axe: Pickaxe,
    brush: Paintbrush,
};

const CONTAINER_SIZE = 200;

interface FamilyButtonProps {
    children?: React.ReactNode;
}

const animElems = {
    notFound: (
        <Pescador
            size={200}
            delay={0}
            repeatDelay={0}
            repeat={0}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    loadtorch: (
        <Bohol
            size={150}
            delay={0}
            repeatDelay={0}
            repeat={3}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    loadaxe: (
        <Panay
            size={150}
            delay={0}
            repeatDelay={0}
            repeat={3}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    loadbrush: (
        <Malalison
            size={150}
            delay={0}
            repeatDelay={0}
            repeat={3}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    loadeye: (
        <Palawan
            size={150}
            delay={0}
            repeatDelay={0}
            repeat={3}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    successtorch: (
        <Leyte
            size={200}
            delay={0}
            repeatDelay={0}
            repeat={1}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    successeye: (
        <Polillo
            size={200}
            delay={0}
            repeatDelay={0}
            repeat={1}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    successaxe: (
        <Babuyan
            size={200}
            delay={0}
            repeatDelay={0}
            repeat={1}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
    successbrush: (
        <Lubang
            size={200}
            delay={0}
            repeatDelay={0}
            repeat={1}
            style={undefined}
            onComplete={undefined}
            onStart={undefined}
            onRepeat={undefined}
            className={undefined}
        />
    ),
};

export const MagicButton: React.FC<FamilyButtonProps> = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        if (!isExpanded && toolSelected) {
            setToolSelected("");
        }
        setIsExpanded(!isExpanded);
    };
    const [toolSelected, setToolSelected] = useState("");
    const [showAnimElem, setShowAnimElem] = useState("");
    const divRef = React.useRef(document.body);
    const infoRef = React.useRef<HTMLDivElement>(null);

    const update = React.useCallback(({ x, y }: { x: number; y: number }) => {
        const offsetX = (infoRef.current?.offsetWidth || 0) / 2;
        const offsetY = (infoRef.current?.offsetHeight || 0) / 2;

        const overlay = document.getElementById("mytery-cursor-overlay");
        if (overlay) {
            overlay.style.setProperty("--x", `${x}px`);
            overlay.style.setProperty("--y", `${y}px`);
        }

        infoRef.current?.style.setProperty("--x", `${x - offsetX}px`);
        infoRef.current?.style.setProperty("--y", `${y - offsetY}px`);
    }, []);

    React.useEffect(() => {
        setShowAnimElem("");
        if (toolSelected) {
            initTracker();
            setupOverlay();
        }

        return () => {
            removeTracking();
        };
    }, [toolSelected]);

    const handleMouseMove = React.useCallback((event: MouseEvent) => {
        const { pageX, pageY } = event;

        // Adjust for scroll offsets
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const adjustedX = pageX - scrollX; // Add the horizontal scroll offset
        const adjustedY = pageY - scrollY; // Add the vertical scroll offset

        // Update the tracker position
        update({ x: adjustedX, y: adjustedY });
    }, []);

    const removeMouseCapture = () => {
        const nodeRef = document.body;
        nodeRef.style.removeProperty("cursor");
        nodeRef?.removeEventListener("mousemove", handleMouseMove);
    };

    const removeOverlay = () => {
        const mysteryOverlay = document.getElementById("mytery-cursor-overlay");
        if (mysteryOverlay) document.body.removeChild(mysteryOverlay);
    };

    const removeTracking = React.useCallback(() => {
        removeOverlay();
        removeMouseCapture();
    }, []);

    const checkMystery = async (elem: Element): Promise<Response> => {
        const url = window.location.href;
        const payload = {
            url,
            content: elem.textContent,
            attributes: JSON.stringify(getUniqueAttributes(elem)),
            tool: toolSelected,
        };

        const token = (await browser.storage.local.get("mystery-token"))[
            "mystery-token"
        ];

        const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        try {
            const responsePromise = fetch(
                "http://localhost:3000/api/mystery-finder",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                },
            );

            // Ensure the function takes at least 3 seconds
            const response = await Promise.all([
                responsePromise,
                delay(3000),
            ]).then(([response]) => response);

            return response;
        } catch (error) {
            console.log("Something Not Right", error);
            await delay(3000);
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "failure",
                }),
                {
                    status: 400,
                },
            );
        }
    };

    const setupOverlay = () => {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = `
            radial-gradient(circle 80px at var(--x, 50%) var(--y, 50%), transparent 0%, rgba(0, 0, 0, 0.9) 82%)
        `;
        overlay.style.zIndex = "9999";
        overlay.style.pointerEvents = "all";
        overlay.style.cursor = "none";
        overlay.id = "mytery-cursor-overlay";
        overlay.onclick = async (e) => {
            removeMouseCapture();
            const mysteryOverlay = document.getElementById(
                "mytery-cursor-overlay",
            );
            mysteryOverlay.style.removeProperty("cursor");

            e.preventDefault();
            e.stopPropagation();

            const { clientX, clientY } = e;

            overlay.style.display = "none";
            const clickedElement = document.elementFromPoint(clientX, clientY);
            overlay.style.display = "block";

            if (clickedElement) {
                setShowAnimElem(`load${toolSelected}`);
                const response = await checkMystery(clickedElement);
                const responseJson = await response.json();
                const html = responseJson.html;
                if (html) {
                    setShowAnimElem(`success${toolSelected}`);
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = html;
                    const element = tempDiv.firstElementChild as HTMLElement;
                    // Temporarily append to the body to calculate dimensions
                    element.style.position = "absolute"; // Ensure it's not fixed yet
                    element.style.visibility = "hidden"; // Make it invisible during measurement
                    // document.body.appendChild(element);
                    document
                        .getElementById("mysteryverse-overlay")
                        .appendChild(element);

                    // Get element dimensions
                    const elementWidth = element.offsetWidth;
                    const elementHeight = element.offsetHeight;

                    // Calculate adjusted positions
                    let adjustedLeft = clientX;
                    let adjustedTop = clientY;

                    // Check for horizontal overflow
                    if (clientX + elementWidth / 2 > window.innerWidth) {
                        adjustedLeft = window.innerWidth - elementWidth / 2;
                    } else if (clientX - elementWidth / 2 < 0) {
                        adjustedLeft = elementWidth / 2;
                    }

                    // Check for vertical overflow
                    if (clientY + elementHeight / 2 > window.innerHeight) {
                        adjustedTop = window.innerHeight - elementHeight / 2;
                    } else if (clientY - elementHeight / 2 < 0) {
                        adjustedTop = elementHeight / 2;
                    }

                    // Set final styles
                    element.style.zIndex = "2147483647";
                    element.style.left = `${adjustedLeft}px`;
                    element.style.top = `${adjustedTop}px`;
                    element.style.transform = "translate(-50%, -50%)"; // Center the element
                    element.style.pointerEvents = "none"; // Make it non-interactive

                    // Append to body
                    setTimeout(() => {
                        element.style.visibility = "";
                        element.style.position = "fixed";
                    }, 2000);
                } else {
                    setShowAnimElem("notFound");
                }
            } else {
                console.log("No mystery found at the clicked point.");
                setShowAnimElem("notFound");
            }
            setTimeout(() => {
                setToolSelected("");
            }, 2500);
        };
        document.body.appendChild(overlay);
    };

    const initTracker = React.useCallback(() => {
        if (!divRef.current) return;
        divRef.current.style.cursor = "none";
        divRef.current.addEventListener("mousemove", handleMouseMove);
    }, []);

    const Icon = toolSelected ? ToolIcon[toolSelected] : null;

    return (
        <div className="fixed bottom-[8px] right-[8px] z-[2147483647] md:bottom-[12px] md:right-[12px]">
            {toolSelected ? (
                <ShineBorder
                    duration={showAnimElem ? 1 : 10}
                    ref={infoRef}
                    style={{
                        transform: "translate(var(--x), var(--y))",
                        pointerEvents: "none",
                        touchAction: "none",
                        cursor: "none",
                        backgroundColor: "transparent",
                    }}
                    className="flex items-center justify-center pointer-events-none fixed left-0 top-0 z-50 rounded-full p-[16px] font-bold text-white duration-0 w-[120px] h-[120px]"
                >
                    <Icon className="absolute dark:drop-shadow-[-0.02em_-0.03em_#000000] drop-shadow-[-0.02em_-0.03em_#ffffff] text-black dark:text-white h-[24px] w-[24px]" />
                    {showAnimElem ? animElems[showAnimElem] : null}
                </ShineBorder>
            ) : null}
            <div
                className={cn(
                    "rounded-[24px] border border-black/10 shadow-sm dark:border-yellow-400/20",
                    "bg-white dark:bg-black",
                    isExpanded ? "w-[80px]" : "",
                    showAnimElem ? "pointer-events-none" : "",
                )}
            >
                <div className="rounded-[23px] border border-black/10 dark:border-white/50">
                    <div className="rounded-[22px] border border-white/50 dark:border-stone-800">
                        <div className="flex items-center justify-center rounded-[21px] border border-neutral-950/20">
                            <FamilyButtonContainer
                                isExpanded={isExpanded}
                                toggleExpand={toggleExpand}
                            >
                                {isExpanded ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: {
                                                delay: 0.3,
                                                duration: 0.4,
                                                ease: "easeOut",
                                            },
                                        }}
                                        className="relative flex flex-col size-full items-center pt-[10px] pb-[4px] gap-[10px]"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full bg-slate-300 dark:bg-slate-700 p-[20px] font-bold hover:bg-slate-400 dark:hover:bg-slate-800"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setToolSelected("torch");
                                                toggleExpand();
                                            }}
                                        >
                                            <Flashlight className="h-[24px] w-[24px] text-black dark:text-white" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full bg-slate-300 dark:bg-slate-700 p-[20px] font-bold hover:bg-slate-400 dark:hover:bg-slate-800"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setToolSelected("brush");
                                                toggleExpand();
                                            }}
                                        >
                                            <Paintbrush className="h-[24px] w-[24px] text-black dark:text-white" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full bg-slate-300 dark:bg-slate-700 p-[20px] font-bold hover:bg-slate-400 dark:hover:bg-slate-800"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setToolSelected("eye");
                                                toggleExpand();
                                            }}
                                        >
                                            <ScanEye className="h-[24px] w-[24px] text-black dark:text-white" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full bg-slate-300 dark:bg-slate-700 p-[20px] font-bold hover:bg-slate-400 dark:hover:bg-slate-800"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setToolSelected("axe");
                                                toggleExpand();
                                            }}
                                        >
                                            <Pickaxe className="h-[24px] w-[24px] text-black dark:text-white" />
                                        </Button>
                                    </motion.div>
                                ) : null}
                            </FamilyButtonContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// A container that wraps content and handles animations
interface FamilyButtonContainerProps {
    isExpanded: boolean;
    toggleExpand: () => void;
    children: ReactNode;
}

const FamilyButtonContainer: FC<FamilyButtonContainerProps> = ({
    isExpanded,
    toggleExpand,
    children,
}) => {
    return (
        <motion.div
            className={cn(
                "relative z-10 flex pb-[4px] flex-col items-center justify-center space-y-1 border border-white/10 dark:border-white bg-transparent text-white shadow-lg",
                !isExpanded ? "" : "",
            )}
            layoutRoot
            layout
            initial={{ borderRadius: 21, width: "36px", height: "36px" }}
            animate={
                isExpanded
                    ? {
                          borderRadius: 20,
                          width: CONTAINER_SIZE,
                          height: CONTAINER_SIZE + 50,

                          transition: {
                              type: "spring",
                              damping: 25,
                              stiffness: 400,
                              when: "beforeChildren",
                          },
                      }
                    : {
                          borderRadius: 21,
                          width: "36px",
                          height: "36px",
                      }
            }
        >
            {children}
            <motion.div
                onClick={toggleExpand}
                animate={{
                    transition: {
                        type: "tween",
                        ease: "easeOut",
                        duration: 0.2,
                    },
                }}
                className="cursor-pointer"
                style={{
                    left: isExpanded ? "" : "50%",
                    bottom: 0.5,
                }}
            >
                {isExpanded ? (
                    <motion.div
                        className="group rounded-full border bg-neutral-800/50 p-[8px] text-orange-50 shadow-2xl transition-colors duration-300 hover:border-neutral-200 dark:bg-black/50"
                        layoutId="expand-toggle"
                        initial={false}
                        animate={{
                            rotate: -360,
                            transition: {
                                duration: 0.4,
                            },
                        }}
                    >
                        <XIcon className="h-[20px] w-[20px] text-black transition-colors duration-200 group-hover:text-neutral-500 dark:text-white" />
                    </motion.div>
                ) : (
                    <motion.div
                        className={cn(
                            "flex items-center justify-center rounded-full p-[10px]",
                        )}
                        style={{ borderRadius: 24 }}
                        layoutId="expand-toggle"
                        initial={{ rotate: 0 }}
                        animate={{
                            rotate: 360,
                            transition: {
                                duration: 0.4,
                            },
                        }}
                    >
                        <Axe className="h-[24px] w-[24px] text-black dark:text-white" />
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};
