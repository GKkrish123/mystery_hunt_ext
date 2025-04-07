import React, {
    useState,
    useEffect,
    useCallback,
    createRef,
    useRef,
    useMemo,
    RefObject,
} from "react";
import gsap, { Power4, Power1, Power2, Circ, Expo } from "gsap";
import Star from "../icons/star";
import Pentagon from "../icons/pentagon";
import Square from "../icons/square";
import Triangle from "../icons/triangle";
import Circle from "../icons/circle";
import Wave from "../icons/wave";
import ZigZag from "../icons/zigzag";
import Cross from "../icons/cross";
import CurveLine from "../icons/curve-line";

const RADIUS = 50;
//   const LINE_RADIUS = 35;
const STROKE_WIDTH = 1;
const STAR_SIZE = 90;
const PENTAGON_SIZE = 95;
const LINES = 5;
//   const DURATIONS = [0.6, 1];

let TIME_LINE = null;

export function Babuyan({
    size,
    delay,
    repeatDelay,
    repeat,
    style,
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const starRef = useRef();
    const starPolygonRef = useRef();
    const polygonRef = useRef();
    const linesRefs = useRef([...Array(5)].map(() => createRef()));

    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const center = useMemo(() => prevSize / 2, [prevSize]);

    const animatePentagon = useCallback(() => {
        const timeline = gsap.timeline();

        timeline.set(polygonRef.current, {
            attr: {
                "stroke-dasharray": "0 0 0 360",
                "stroke-dashoffset": "180",
            },
        });
        timeline.to(polygonRef.current, 1, {
            keyframes: [
                {
                    attr: {
                        "stroke-dasharray": "100 0 100 160",
                        "stroke-dashoffset": "270",
                    },
                },
                {
                    attr: {
                        "stroke-dasharray": "50 260 50 0",
                        "stroke-dashoffset": "360",
                    },
                },
                {
                    attr: {
                        "stroke-dasharray": "0 360 0 0",
                        "stroke-dashoffset": "360",
                    },
                },
            ],
            ease: Power4.easeInOut,
        });

        return timeline;
    }, []);

    const animateStar = useCallback(() => {
        const timeline = gsap.timeline();

        timeline.fromTo(
            starRef.current,
            0.4,
            { scale: 0, transformOrigin: "center" },
            { scale: 1, ease: Power1.easeIn },
        );
        timeline.fromTo(
            starPolygonRef.current,
            0.4,
            { attr: { "stroke-dasharray": "177 2", "stroke-dashoffset": 88 } },
            {
                attr: { "stroke-dasharray": "0 179", "stroke-dashoffset": 0 },
                ease: Power1.easeOut,
            },
            "-=0.1",
        );

        return timeline;
    }, []);

    const animateLines = useCallback(() => {
        const timelines = [];
        const angle = (2 * Math.PI) / 5;
        const prefixAngle = Math.PI / 10;
        const radius = (prevSize * RADIUS) / 100;

        linesRefs.current.forEach((ref, i) => {
            const timeline = gsap.timeline();

            const x = center + radius * Math.cos(prefixAngle + i * angle);
            const y = center + radius * Math.sin(prefixAngle + i * angle);
            const start = { x2: x, y2: y };
            const end = { x1: x, y1: y };

            timeline
                .fromTo(
                    ref.current as RefObject<HTMLDivElement>,
                    0.5,
                    { attr: start },
                    { attr: { x2: center, y2: center, ease: Power4.easeIn } },
                )
                .fromTo(
                    ref.current as RefObject<HTMLDivElement>,
                    0.5,
                    { attr: end },
                    { attr: { x1: center, y1: center, ease: Power4.easeIn } },
                    "-=0.3",
                );

            timelines.push(timeline);
        });

        return timelines;
    }, [center, prevSize]);

    const explode = useCallback(() => {
        const pentagonTimeline = animatePentagon();
        const starTimeline = animateStar();
        const linesTimelines = animateLines();

        TIME_LINE = gsap.timeline({
            repeat: prevRepeat,
            delay: prevDelay,
            repeatDelay: prevRepeatDelay,
            onStart,
            onComplete,
            onRepeat,
        });

        TIME_LINE.add(starTimeline, 0.1);
        TIME_LINE.add(linesTimelines, 0.1);
        TIME_LINE.add(pentagonTimeline, 0);
    }, [
        onRepeat,
        onStart,
        onComplete,
        prevRepeat,
        prevDelay,
        prevRepeatDelay,
        animatePentagon,
        animateStar,
        animateLines,
    ]);

    useEffect(() => {
        if (TIME_LINE) TIME_LINE.kill();
        explode();
    }, [explode]);

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                position: "relative",
                ...style,
            }}
        >
            <Star
                strokeWidth={2}
                ref={starRef}
                starPolygonRef={starPolygonRef}
                strokeDasharray="177 2"
                strokeDashoffset={88}
                color="#2ab7ca"
                style={{
                    position: "absolute",
                    top: "1%",
                    left: "5%",
                    width: `${STAR_SIZE}%`,
                    height: `${STAR_SIZE}%`,
                    transform: "scale(0)",
                    transformOrigin: "center",
                }}
            />
            <Pentagon
                strokeWidth={2}
                polygonRef={polygonRef}
                strokeDashoffset={180}
                strokeDasharray="0 0 0 360"
                color="#fe4a49"
                style={{
                    position: "absolute",
                    top: "54%",
                    left: "50%",
                    width: `${PENTAGON_SIZE}%`,
                    height: `${PENTAGON_SIZE}%`,
                    transform: "translate(-50%, -50%)",
                }}
            />
            <svg width={prevSize} height={prevSize}>
                {[...Array(LINES)].map((_, i) => (
                    <line
                        x1={center}
                        y1={center}
                        x2={center}
                        y2={center}
                        ref={linesRefs.current[i] as RefObject<SVGLineElement>}
                        key={i}
                        strokeWidth={2}
                        stroke="#fed766"
                    />
                ))}
            </svg>
        </div>
    );
}

const POINTS = "0,0 60,30 0,60 0,30";
const DURATIONS = [0.6, 1.3];
const INIT_RADIUS = 10;
const SQUARE_SIZE = 20;
const TRIANGLE_SIZE = 15;

let TIMELINE = null;

const ease = Power4.easeOut;

export function Pescador({
    size = 400,
    delay,
    repeatDelay,
    repeat,
    style,
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const squareRef = useRef();
    const triangleRefs = useRef([...Array(3)].map(() => createRef()));
    const polygonRefs = useRef([...Array(3)].map(() => createRef()));
    const lineRefs = useRef([...Array(3)].map(() => createRef()));

    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const center = prevSize / 2;
    const angle = (2 * Math.PI) / 3;
    const prefixAngle = Math.PI / 6;
    const radius = (prevSize * RADIUS) / 100;
    const initRadius = (prevSize * INIT_RADIUS) / 100;
    const square = (SQUARE_SIZE * prevSize) / 100;
    const strokeWidth = (prevSize * STROKE_WIDTH) / 100;

    const dasharray = useCallback(
        (array) =>
            array
                .map((item) => (square * 2 * item) / 100)
                .reduce((sum, item) => `${sum} ${item}`, ""),
        [square],
    );

    const animateSquare = useCallback(() => {
        const timeline = gsap.timeline();

        const startDasharray = dasharray([25, 75]);
        const endDashArray = dasharray([0, 100]);

        timeline.set(squareRef.current, {
            strokeDashoffset: 0,
            strokeDasharray: startDasharray,
        });

        timeline.to(squareRef.current, {
            keyframes: [
                { strokeDashoffset: square * 4, duration: 1.2 },
                { strokeDasharray: endDashArray, duration: 0.2 },
            ],
            ease: Power4.easeOut,
        });

        return timeline;
    }, [dasharray, square]);

    const animateTriangles = useCallback(() => {
        const timelines = [];

        triangleRefs.current.forEach((ref, i) => {
            const timeline = gsap.timeline({ ease });
            const x = Math.cos(-prefixAngle + i * angle);
            const y = Math.sin(-prefixAngle + i * angle);
            const size = ((TRIANGLE_SIZE / 2) * prevSize) / 100;

            timeline.set(ref.current as HTMLDivElement, {
                rotate: ((angle * i - prefixAngle) * 180) / Math.PI,
            });
            timeline.fromTo(
                ref.current as HTMLDivElement,
                1,
                { scale: 0 },
                { scale: 1, transformOrigin: "center", ease: Power4.easeInOut },
            );
            timeline.fromTo(
                ref.current as HTMLDivElement,
                1,
                { x: -size, y: -size },
                {
                    x: radius * x - size,
                    y: radius * y - size,
                    ease: Power4.easeInOut,
                },
                "-=1",
            );
            timeline.to(
                ref.current as HTMLDivElement,
                1,
                { scale: 0, ease: Power4.easeOut },
                "-=0.4",
            );

            timelines.push(timeline);
        });

        return timelines;
    }, [angle, prefixAngle, prevSize, radius]);

    const animateLines = useCallback(() => {
        const timelines = [];

        lineRefs.current.forEach((ref, i) => {
            const timeline = gsap.timeline();
            const cos = Math.cos(prefixAngle + i * angle);
            const sin = Math.sin(prefixAngle + i * angle);

            timeline
                .fromTo(
                    ref.current as HTMLDivElement,
                    DURATIONS[0],
                    {
                        attr: {
                            x1: center + initRadius * cos,
                            y1: center + initRadius * sin,
                        },
                    },
                    {
                        attr: {
                            x1: center + radius * cos,
                            y1: center + radius * sin,
                        },
                        ease,
                    },
                )
                .fromTo(
                    ref.current as HTMLDivElement,
                    DURATIONS[1],
                    {
                        attr: {
                            x2: center + initRadius * cos,
                            y2: center + initRadius * sin,
                        },
                    },
                    {
                        attr: {
                            x2: center + radius * cos,
                            y2: center + radius * sin,
                        },
                        ease,
                    },
                    `-=${DURATIONS[0]}`,
                );

            timelines.push(timeline);
        });

        return timelines;
    }, [angle, center, initRadius, prefixAngle, radius]);

    const animatePolygonShape = useCallback(() => {
        const timelines = [];

        polygonRefs.current.forEach((ref) => {
            const timeline = gsap.timeline();

            timeline.fromTo(
                ref.current as HTMLDivElement,
                1,
                { attr: { points: POINTS } },
                { attr: { points: "0,0 60,30 0,60 30,30" }, ease },
            );

            timelines.push(timeline);
        });

        return timelines;
    }, []);

    const explode = useCallback(() => {
        const squareTimeline = animateSquare();
        const triangleTimelines = animateTriangles();
        const polygonTimelines = animatePolygonShape();
        const lineTimelines = animateLines();

        TIMELINE = gsap.timeline({
            repeat: prevRepeat,
            delay: prevDelay,
            repeatDelay: prevRepeatDelay,
            onStart,
            onComplete,
            onRepeat,
        });

        TIMELINE.add(squareTimeline, 0);
        TIMELINE.add(triangleTimelines, "-=0.8");
        TIMELINE.add(polygonTimelines, "-=1");
        TIMELINE.add(lineTimelines, "<");
    }, [
        prevRepeat,
        prevRepeatDelay,
        prevDelay,
        onStart,
        onComplete,
        onRepeat,
        animateSquare,
        animateTriangles,
        animatePolygonShape,
        animateLines,
    ]);

    useEffect(() => {
        if (TIMELINE) TIMELINE.kill();
        explode();
    }, [explode]);

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    return (
        <div
            className={className}
            style={{
                width: prevSize,
                height: prevSize,
                position: "relative",
                ...style,
            }}
        >
            <Square
                shapeRef={squareRef}
                width={`${SQUARE_SIZE}%`}
                height={`${SQUARE_SIZE}%`}
                strokeWidth={strokeWidth}
                strokeDasharray="30 90"
                strokeDashoffset={0}
                color="#fed766"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(45deg)",
                }}
            />
            <>
                {Array.from(Array(3)).map((_, idx) => (
                    <Triangle
                        key={idx}
                        points={POINTS}
                        ref={triangleRefs.current[idx]}
                        shapeRef={polygonRefs.current[idx]}
                        color="#FF4D4D"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: `${TRIANGLE_SIZE}%`,
                            height: `${TRIANGLE_SIZE}%`,
                            transform: `
                  translate(-50%, -50%)
                  rotate(${((angle * 180) / Math.PI) * idx - 30}deg)
                  scale(0)
                `,
                        }}
                    />
                ))}
            </>
            <svg width={prevSize} height={prevSize}>
                {Array.from(Array(3)).map((_, idx) => (
                    <line
                        key={idx}
                        x1={center}
                        x2={center}
                        y1={center}
                        y2={center}
                        ref={lineRefs.current[idx] as RefObject<SVGLineElement>}
                        stroke="#fff"
                        strokeWidth={strokeWidth}
                    />
                ))}
            </svg>
        </div>
    );
}

const LINES2 = [];
const DISTS = [47.4, 50, 42.5];
const DIFF = 4;
const COUNT = 10;

let TIMELINE2 = null;

export function Bohol({
    size = 400,
    delay,
    repeatDelay,
    repeat,
    style,
    color = "white",
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const center = prevSize / 2;

    const explode = useCallback(() => {
        const dists = DISTS.map((dist) => (prevSize * dist) / 100);
        const diff = (prevSize * DIFF) / 100;

        const tlgroup1 = [];

        const angle = Math.PI / 5;
        const ease = Power4.easeOut;

        const offsetX = Math.cos(Math.PI / 10);
        const offsetY = Math.sin(Math.PI / 10);

        for (let i = 0; i < LINES2.length; i++) {
            const timeline = gsap.timeline({
                delay: Math.floor(i / COUNT) * 0.2,
            });
            const line = LINES2[i];

            const x = Math.cos(i * angle);
            const y = Math.sin(i * angle);

            const space = (Math.floor(i / COUNT) + 1) * diff;

            const linex = center + offsetX + (dists[0] - space) * x;
            const liney = center + offsetY + (dists[0] - space) * y;

            const start = { x2: linex, y2: liney };
            const end = { x1: linex, y1: liney };

            timeline.fromTo(
                line,
                0.7,
                { attr: { x2: center, y2: center } },
                { attr: start, ease },
            );
            timeline.fromTo(
                line,
                1.3,
                { attr: { x1: center, y1: center } },
                { attr: end, ease },
                "-=0.7",
            );
            timeline.fromTo(
                line,
                0.3,
                {
                    strokeWidth: Math.ceil(
                        (prevSize * (STROKE_WIDTH * 2)) / 100,
                    ),
                },
                { strokeWidth: 0 },
                `-=${[0.7, 0.6, 0.5][Math.floor(i / COUNT)]}`,
            );

            tlgroup1.push(timeline);
        }

        TIMELINE2 = gsap.timeline({
            repeat: prevRepeat,
            repeatDelay: prevRepeatDelay,
            delay: prevDelay,
            onStart,
            onComplete,
            onRepeat,
        });

        TIMELINE2.add(tlgroup1, 0);
    }, [
        center,
        prevDelay,
        prevRepeatDelay,
        onStart,
        onComplete,
        onRepeat,
        prevSize,
        prevRepeat,
    ]);

    useEffect(() => {
        if (TIMELINE) TIMELINE.kill();
    });

    useEffect(() => {
        explode();
    }, [explode]);

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    return (
        <svg
            width={prevSize}
            height={prevSize}
            className={className}
            style={{ ...style, position: "absolute" }}
        >
            <>
                {[...Array(COUNT * 3)].map((_, i) => {
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={center}
                            y2={center}
                            ref={(el) => (LINES2[i] = el)}
                            strokeLinecap="round"
                            strokeWidth={Math.ceil(
                                (prevSize * (STROKE_WIDTH * 2)) / 100,
                            )}
                            stroke={color}
                        />
                    );
                })}
            </>
        </svg>
    );
}

const COUNT2 = 8;
const PATHS = [];
const WAVE_WIDTH = 50;
const WAVE_HEIGHT = 3.75;

let TIMELINE3 = null;

export function Panay({
    size,
    delay,
    repeatDelay,
    repeat,
    style,
    color = "white",
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const center = prevSize / 2;

    const explode = useCallback(() => {
        const timelines = [];

        for (let i = 0; i < COUNT2; i++) {
            const target = PATHS[i];

            const timeline = gsap.timeline();

            timeline.set(target, { attr: { "stroke-dashoffset": 279 } });
            timeline.fromTo(
                target,
                1,
                { attr: { "stroke-dasharray": "279 279" } },
                {
                    attr: { "stroke-dasharray": "0 279" },
                    ease: Power2.easeInOut,
                },
            );

            timelines.push(timeline);
        }

        TIMELINE3 = gsap.timeline({
            repeat: prevRepeat,
            delay: prevDelay,
            repeatDelay: prevRepeatDelay,
            onComplete,
            onStart,
            onRepeat,
        });

        TIMELINE3.add(timelines);
    }, [onRepeat, onStart, onComplete, prevRepeat, prevDelay, prevRepeatDelay]);

    useEffect(() => {
        if (TIMELINE3) TIMELINE3.kill();
    });

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    useEffect(() => {
        explode();
    }, [explode]);

    useEffect(() => {
        explode();
    });

    return (
        <div
            className={className}
            style={{
                width: prevSize,
                height: prevSize,
                position: "absolute",
                ...style,
            }}
        >
            {Array.from(Array(COUNT2)).map((_, i) => {
                return (
                    <Wave
                        key={i}
                        innerRef={(el) => (PATHS[i] = el)}
                        color={color}
                        width={`${WAVE_WIDTH}%`}
                        height={`${WAVE_HEIGHT}%`}
                        style={{
                            position: "absolute",
                            left: center,
                            top: center,
                            transform: `translateY(-50%) rotate(${45 * i}deg)`,
                            transformOrigin: "left center",
                            strokeWidth: 2,
                        }}
                    />
                );
            })}
        </div>
    );
}

const PATHS4 = [];
const DEGREE = (90 * Math.PI) / 180;
const INIT_EXPLOSION = 4;
const GAP = 7;
const STROKE_WIDTH4 = 0.5;

let TIMELINE4 = null;

export function Malalison({
    size,
    delay,
    repeatDelay,
    repeat,
    style,
    color = "white",
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const [prevSize, setPrevSize] = useState(200);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const center = prevSize / 2;

    const explode = useCallback(() => {
        const center = prevSize / 2;
        const ease = Circ.easeInOut;
        const offset = INIT_EXPLOSION * 2;

        const timelines = [];

        for (let i = 0; i < PATHS4.length; i++) {
            const path = PATHS4[i];
            const j = Math.floor((i - offset) / INIT_EXPLOSION + 1);
            const length = center - (i >= offset ? center * (j / 15) : 0);
            const degree = (i < INIT_EXPLOSION ? 0 : DEGREE / 2) + DEGREE * i;
            const xPercent = Math.cos(degree);
            const yPercent = Math.sin(degree);
            const xOffset =
                (i < INIT_EXPLOSION ? GAP : 0) * Math.cos(DEGREE * i);
            const yOffset =
                (i < INIT_EXPLOSION ? GAP : 0) * Math.sin(DEGREE * i);
            const X = center + length * xPercent;
            const Y = center + length * yPercent;
            const timeline = gsap.timeline({
                delay: i < INIT_EXPLOSION ? 0 : 0.2,
            });

            timeline.fromTo(
                path,
                0.7,
                { attr: { x2: center, y2: center }, ease },
                { attr: { x2: X, y2: Y }, ease },
            );
            timeline.fromTo(
                path,
                0.7,
                { attr: { x1: center + xOffset, y1: center + yOffset }, ease },
                { attr: { x1: X, y1: Y }, ease },
                "-=0.5",
            );

            if (i >= offset) {
                const transformOrigin = `${xPercent >= 0 ? 0 : 100}% ${
                    yPercent >= 0 ? 0 : 100
                }%`;

                timeline.fromTo(
                    path,
                    0.5,
                    { rotation: 0 },
                    { rotation: 90 * (j / 10), transformOrigin, ease },
                    "-=0.7",
                );
            }

            timelines.push(timeline);
        }

        TIMELINE4 = gsap.timeline({
            delay: prevDelay,
            repeat: prevRepeat,
            repeatDelay: prevRepeatDelay,
            onStart,
            onComplete,
            onRepeat,
        });

        TIMELINE4.add(timelines);
    }, [
        prevSize,
        prevDelay,
        prevRepeat,
        prevRepeatDelay,
        onStart,
        onComplete,
        onRepeat,
    ]);

    useEffect(() => {
        if (TIMELINE4) TIMELINE4.kill();
    });

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    useEffect(() => {
        explode();
    }, [explode]);

    return (
        <svg
            width={prevSize}
            height={prevSize}
            style={{ ...style, position: "absolute" }}
            className={className}
        >
            {[...Array(64)].map((_, i) => (
                <line
                    key={i}
                    x1={
                        center +
                        (i < INIT_EXPLOSION ? GAP : 0) * Math.cos(DEGREE * i)
                    }
                    y1={
                        center +
                        (i < INIT_EXPLOSION ? GAP : 0) * Math.sin(DEGREE * i)
                    }
                    x2={center}
                    y2={center}
                    stroke={color}
                    strokeWidth={Math.ceil((prevSize * STROKE_WIDTH4) / 100)}
                    ref={(el) => (PATHS4[i] = el)}
                />
            ))}
        </svg>
    );
}

const SQUARE = [];
const STROKE_WIDTH3 = 2.5;

let TIME_LINE3 = null;

export function Palawan({
    size,
    delay,
    repeatDelay,
    repeat,
    style,
    color = "white",
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const center = size / 2;
    const sizes = [size * 0.58, size * 0.3, size * 0.3, size * 0.1, size * 0.1];
    const halfs = [sizes[0] / 2, sizes[1] / 2, sizes[3] / 2];
    const front = center - halfs[0];
    const back = center + halfs[0];
    const positions = [
        { x: center, y: center },
        { x: center, y: back },
        { x: center, y: front },
        { x: front, y: front },
        { x: back, y: back },
    ];

    const strokeWidth = Math.ceil((prevSize * STROKE_WIDTH3) / 100);
    const explode = useCallback(() => {
        const ease = Power4.easeOut;
        const center = prevSize / 2;
        const sizes = [
            prevSize * 0.58,
            prevSize * 0.3,
            prevSize * 0.3,
            prevSize * 0.1,
            prevSize * 0.1,
        ];
        const halfs = [sizes[0] / 2, sizes[1] / 2, sizes[3] / 2];
        const front = center - halfs[0];
        const back = center + halfs[0];
        const positions = {
            start: [
                { x: center, y: center },
                { x: center, y: back },
                { x: center, y: front },
                { x: front, y: front },
                { x: back, y: back },
            ],
            end: [
                { x: front, y: front },
                { x: center - halfs[1], y: back - halfs[1] },
                { x: center - halfs[1], y: front - halfs[1] },
                { x: front - halfs[2], y: front - halfs[2] },
                { x: back - halfs[2], y: back - halfs[2] },
            ],
        };
        const timelines = [];

        const delays = [0, 0.3, 0.3, 0.5, 0.5];

        for (let i = 0; i < SQUARE.length; i++) {
            const square = SQUARE[i];
            const size = sizes[i];
            const start = positions.start[i];
            const end = positions.end[i];
            const delay = delays[i];
            const timeline = gsap.timeline({
                delay,
                onStart: i === 0 && onStart,
                onComplete: i === 0 && onComplete,
                onRepeat: i === 0 && onRepeat,
            });

            timeline
                .fromTo(
                    square,
                    1,
                    {
                        attr: { x: start.x, y: start.y, width: 0, height: 0 },
                        ease,
                    },
                    {
                        attr: { x: end.x, y: end.y, width: size, height: size },
                        ease,
                    },
                )
                .fromTo(
                    square,
                    1,
                    { attr: { "stroke-width": strokeWidth }, ease },
                    { attr: { "stroke-width": 0 }, ease },
                    "-=0.9",
                );

            timelines.push(timeline);
        }

        TIME_LINE3 = gsap.timeline({
            delay: prevDelay,
            repeat: prevRepeat,
            repeatDelay: prevRepeatDelay,
        });

        TIME_LINE3.add(timelines);
    }, [
        prevSize,
        prevRepeat,
        prevDelay,
        prevRepeatDelay,
        onComplete,
        onStart,
        onRepeat,
        strokeWidth,
    ]);

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    useEffect(() => {
        explode();
    }, [explode]);

    useEffect(() => {
        TIME_LINE3.kill();
        explode();
    });

    return (
        <svg
            width={prevSize}
            height={prevSize}
            className={className}
            style={{ ...style, position: "absolute" }}
        >
            {[...Array(5)].map((_, i) => {
                const { x, y } = positions[i];

                return (
                    <rect
                        key={i}
                        x={x}
                        y={y}
                        width={0}
                        height={0}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        ref={(el) => (SQUARE[i] = el)}
                        style={{
                            transform: "rotate(-50deg)",
                            transformOrigin: `${center}px ${center}px`,
                        }}
                    />
                );
            })}
        </svg>
    );
}

const LINES_RADIUS = 30;
const SHAPES_RADIUS = 45;
const CIRCLE_STROKE_WIDTH = 0.4;
const SHAPE_SIZE = 6;
const CIRCLES_LENGTH = 7;

let TIME_LINE5 = null;

function TriangleIcon({ innerRef, pos, style }) {
    return (
        <Triangle
            style={{ ...style, top: `${pos.t * 100}%` }}
            ref={innerRef}
            shapeRef={innerRef}
            border={true}
            strokeWidth={3}
            color="#fed766"
        />
    );
}

function SquareIcon({ innerRef, pos, style }) {
    return (
        <Square
            style={{ ...style, top: `${pos.s * 100}%` }}
            ref={innerRef}
            shapeRef={innerRef}
            strokeWidth={3}
            color="#fed766"
        />
    );
}

function CircleIcon({ innerRef, pos, style }) {
    return (
        <Circle
            style={{ ...style, top: `${pos.c * 100}%` }}
            ref={innerRef}
            shapeRef={innerRef}
            radius={20}
            strokeWidth={3}
            color="#fed766"
            strokeDasharray={undefined}
            strokeLinecap={undefined}
        />
    );
}

const groups = [
    [SquareIcon, TriangleIcon, CircleIcon],
    [SquareIcon, CircleIcon, TriangleIcon],
];

export function Leyte({
    size,
    delay,
    repeatDelay,
    repeat,
    style,
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const circleRefs = useRef([...Array(7)].map(() => createRef()));
    const lineRefs = useRef([...Array(9)].map(() => createRef()));
    const shapesRefs = useRef([...Array(6)].map(() => createRef()));

    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const center = prevSize / 2;
    const strokeWidth = useMemo(
        () => (prevSize * CIRCLE_STROKE_WIDTH) / 100,
        [prevSize],
    );

    const animateCircles = useCallback(() => {
        const timelines = [];

        circleRefs.current.forEach((ref, i) => {
            if (i > 1) {
                const timeline = gsap.timeline({ delay: (5 - i) * 0.07 });
                const radius = 5 + 2 * i;
                const circumference = radius * 2 * Math.PI;

                timeline.set(ref.current as HTMLDivElement, {
                    attr: { "stroke-dashoffset": circumference },
                });
                timeline.fromTo(
                    ref.current as HTMLDivElement,
                    0.8,
                    {
                        attr: {
                            "stroke-dashoffset": circumference,
                            "stroke-dasharray": `${circumference} ${circumference}`,
                        },
                        ease: Power1.easeIn,
                    },
                    {
                        attr: { "stroke-dasharray": `0 ${circumference}` },
                        ease: Power1.easeOut,
                    },
                );
                timeline.fromTo(
                    ref.current as HTMLDivElement,
                    0.3,
                    { attr: { "stroke-width": 2 - 0.1 * (7 - i) } },
                    { attr: { "stroke-width": 0 } },
                    "-=0.2",
                );
                timelines.push(timeline);
            } else if (i === 1) {
                const timeline = gsap.timeline();

                timeline.set(ref.current as HTMLDivElement, {
                    scale: 0,
                    opacity: 1,
                    attr: { "stroke-width": 15 },
                });
                timeline.fromTo(
                    ref.current as HTMLDivElement,
                    0.6,
                    {
                        scale: 0,
                        transformOrigin: "center",
                        attr: { "stroke-width": 15 },
                    },
                    {
                        scale: 1,
                        attr: { "stroke-width": 2 - 0.1 * (7 - i) },
                        ease: Power4.easeOut,
                    },
                );
                timeline.to(ref.current as HTMLDivElement, 0.6, {
                    scale: 0.7,
                    transformOrigin: "center",
                    attr: { "stroke-width": 0 },
                    opacity: 0,
                    ease: Power4.easeOut,
                });

                timelines.push(timeline);
            } else {
                const timeline = gsap.timeline({ delay: 0.8 });

                timeline.set(ref.current as HTMLDivElement, {
                    scale: 0,
                    opacity: 1,
                    attr: { "stroke-width": 15 },
                });
                timeline.fromTo(
                    ref.current as HTMLDivElement,
                    0.5,
                    {
                        scale: 0,
                        transformOrigin: "center",
                        attr: { "stroke-width": 15 },
                    },
                    {
                        scale: 1,
                        attr: { "stroke-width": 0.3 },
                        ease: Power4.easeOut,
                    },
                );
                timeline.to(
                    ref.current as HTMLDivElement,
                    0.3,
                    {
                        attr: { "stroke-width": 0 },
                        opacity: 0,
                    },
                    "-=0.2",
                );

                timelines.push(timeline);
            }
        });

        return timelines;
    }, []);

    const animateLines = useCallback(() => {
        const timelines = [];

        lineRefs.current.forEach((ref, i) => {
            const radius = (prevSize * LINES_RADIUS) / 100;
            const angle = (2 * Math.PI) / 9;
            const x = center + radius * Math.cos(i * angle);
            const y = center + radius * Math.sin(i * angle);
            const start = { x2: x, y2: y };
            const end = { x1: x, y1: y };

            const timeline = gsap.timeline({ delay: 0.8 });

            timeline
                .fromTo(
                    ref.current as HTMLDivElement,
                    0.7,
                    { attr: { x2: center, y2: center } },
                    { attr: start, ease: Power4.easeOut },
                )
                .fromTo(
                    ref.current as HTMLDivElement,
                    0.6,
                    { attr: { x1: center, y1: center } },
                    { attr: end, ease: Power4.easeOut },
                    "-=0.6",
                );

            timelines.push(timeline);
        });

        return timelines;
    }, [center, prevSize]);

    const animateshapes = useCallback(() => {
        const timelines = [];
        const shapesSize = ((SHAPE_SIZE / 2) * prevSize) / 100;

        shapesRefs.current.forEach((ref, i) => {
            const timeline = gsap.timeline({ delay: (i % 3) * 0.1 });
            const radius = (prevSize * SHAPES_RADIUS) / 100;

            timeline.fromTo(
                ref.current as HTMLDivElement,
                0.4,
                { x: -shapesSize, opacity: 0 },
                {
                    x: -shapesSize + radius * (i > 2 ? 1 : -1),
                    opacity: 1,
                    ease: Power2.easeOut,
                },
            );
            timeline.to(ref.current as HTMLDivElement, 0.4, {
                x: -shapesSize,
                opacity: 0,
                ease: Power2.easeIn,
            });

            timeline.fromTo(
                ref.current as HTMLDivElement,
                0.8,
                { rotate: 0 },
                { rotate: 250, ease: Power1.easeInOut },
                "-=0.7",
            );

            timelines.push(timeline);
        });

        return timelines;
    }, [prevSize]);

    const explode = useCallback(() => {
        const circlesTimelines = animateCircles();
        const linesTimelines = animateLines();
        const shapesTimelines = animateshapes();

        TIME_LINE5 = gsap.timeline({
            repeat: prevRepeat,
            delay: prevDelay,
            repeatDelay: prevRepeatDelay,
            onStart,
            onComplete,
            onRepeat,
        });

        TIME_LINE5.add(shapesTimelines, 0);
        TIME_LINE5.add(circlesTimelines, 0.1);
        TIME_LINE5.add(linesTimelines, 0.1);
    }, [
        prevRepeat,
        prevDelay,
        prevRepeatDelay,
        onComplete,
        onStart,
        onRepeat,
        animateCircles,
        animateLines,
        animateshapes,
    ]);

    useEffect(() => {
        if (TIME_LINE5) TIME_LINE5.kill();
        explode();
    }, [explode]);

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    const positions = [
        { s: 0.3, t: 0.5, c: 0.7 },
        { s: 0.7, t: 0.3, c: 0.5 },
    ];

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                position: "relative",
                ...style,
            }}
        >
            {Array.from(Array(CIRCLES_LENGTH)).map((_, i) => (
                <Circle
                    key={i}
                    shapeRef={circleRefs.current[i]}
                    radius={5 + 2 * (i === 0 ? i + 1 : i)}
                    color={i > 0 ? " #2ab7ca" : "#fe4a49"}
                    strokeWidth={2 - 0 * (CIRCLES_LENGTH - i)}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transform: `
                rotate(${90 * (i % 2 ? 1 : -1)}deg)
                rotateX(${i % 2 ? 180 : 0}deg)
              `,
                    }}
                    strokeLinecap="round"
                    strokeDasharray={undefined}
                />
            ))}
            <svg width={prevSize} height={prevSize}>
                {Array.from(Array(9)).map((_, i) => (
                    <line
                        x1={center}
                        y1={center}
                        x2={center}
                        y2={center}
                        ref={lineRefs.current[i] as RefObject<SVGLineElement>}
                        key={i}
                        strokeWidth={2}
                        stroke="#fe4a49"
                    />
                ))}
            </svg>
            {Array.from(Array(2)).map((_, i) =>
                groups[i].map((Shape, j) => (
                    <Shape
                        key={j + 3 * i}
                        innerRef={shapesRefs.current[j + 3 * i]}
                        pos={positions[i]}
                        style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: `${SHAPE_SIZE}%`,
                            height: `${SHAPE_SIZE}%`,
                            opacity: 0,
                        }}
                    />
                )),
            )}
        </div>
    );
}

const RADIUSES = [47, 30];
const CROSS_SIZE = 17;
const ZIGZAG_WIDTH = 10;
const ZIGZAG_HEIGHT = 20;
const STROKE_WIDTH6 = 0.1;

let TIME_LINE6 = null;

export function Polillo({
    size = 400,
    delay,
    repeatDelay,
    repeat,
    style,
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const zigzagRefs = useRef([...Array(9)].map(() => createRef()));
    const crossRefs = useRef([...Array(9)].map(() => createRef()));
    const circleRefs = useRef([...Array(2)].map(() => createRef()));

    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    const strokeWidth = (prevSize * STROKE_WIDTH6) / 100;
    const radiuses = useMemo(
        () => RADIUSES.map((radius) => (prevSize * radius) / 100),
        [prevSize],
    );
    const crossSize = useMemo(
        () => ((CROSS_SIZE / 2) * prevSize) / 100,
        [prevSize],
    );
    const angle = 2 * (Math.PI / 9);

    const animateZigzags = useCallback(() => {
        const timelines = [];

        zigzagRefs.current.forEach((ref, i) => {
            const timeline = gsap.timeline();
            const cos = Math.cos(2 * (Math.PI / 9) * i);
            const sin = Math.sin(2 * (Math.PI / 9) * i);
            const x = ((ZIGZAG_WIDTH / 2) * prevSize) / 100;
            const y = ((ZIGZAG_HEIGHT / 2) * prevSize) / 100;

            timeline.fromTo(
                ref.current as HTMLDivElement,
                1,
                { x: -x, y: -y },
                {
                    x: `${-x + radiuses[0] * cos}`,
                    y: `${-y + radiuses[0] * sin}`,
                    ease: Power4.easeOut,
                },
            );
            timeline.fromTo(
                ref.current as HTMLDivElement,
                2,
                { rotation: 0, scale: 1 },
                {
                    rotation: 360,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: Power4.easeOut,
                },
                0,
            );

            timelines.push(timeline);
        }, []);

        return timelines;
    }, [prevSize, radiuses]);

    const animateCrosses = useCallback(() => {
        const timelines = [];

        crossRefs.current.forEach((ref, i) => {
            const timeline = gsap.timeline();
            const cos = Math.cos(angle * i);
            const sin = Math.sin(angle * i);

            timeline.fromTo(
                ref.current as HTMLDivElement,
                1,
                { x: -crossSize, y: -crossSize },
                {
                    x: -crossSize + radiuses[1] * cos,
                    y: -crossSize + radiuses[1] * sin,
                    ease: Power4.easeOut,
                },
                "<",
            );

            timeline.fromTo(
                ref.current as HTMLDivElement,
                2,
                { rotation: 0, scale: 1 },
                {
                    rotation: 360,
                    scale: 0,
                    transformOrigin: "50% 50%",
                    ease: Power4.easeOut,
                },
                "<",
            );

            timelines.push(timeline);
        });

        return timelines;
    }, [radiuses, crossSize, angle]);

    const animateCircles = useCallback(() => {
        const timelines = [];

        circleRefs.current.forEach((ref, i) => {
            const timeline = gsap.timeline({ delay: 0.3 * i });

            timeline.set(ref.current as HTMLDivElement, {
                attr: { "stroke-width": 1 },
            });
            timeline.fromTo(
                ref.current as HTMLDivElement,
                1,
                { scale: 0, transformOrigin: "center" },
                { scale: 1, ease: Power4.easeOut },
            );
            timeline.fromTo(
                ref.current as HTMLDivElement,
                0.3,
                { attr: { "stroke-width": 1 }, transformOrigin: "center" },
                { attr: { "stroke-width": 0 }, ease: Power4.easeOut },
                "-=0.6",
            );
            timeline.fromTo(
                ref.current as HTMLDivElement,
                1,
                { opacity: 1 },
                { opacity: 0, ease: Power4.easeOut },
                "-=0.3",
            );

            timelines.push(timeline);
        });

        return timelines;
    }, []);

    const explode = useCallback(() => {
        const zigzagsTimelines = animateZigzags();
        const crossesTimelines = animateCrosses();
        const circlesTimelines = animateCircles();

        TIME_LINE6 = gsap.timeline({
            repeat: prevRepeat,
            delay: prevDelay,
            repeatDelay: prevRepeatDelay,
            onStart,
            onComplete,
            onRepeat,
        });

        TIME_LINE6.add(zigzagsTimelines, 0);
        TIME_LINE6.add(crossesTimelines, 0);
        TIME_LINE6.add(circlesTimelines, 0.1);
    }, [
        onComplete,
        onStart,
        onRepeat,
        prevDelay,
        prevRepeat,
        prevRepeatDelay,
        animateZigzags,
        animateCrosses,
        animateCircles,
    ]);

    useEffect(() => {
        if (TIME_LINE6) TIME_LINE6.kill();
        explode();
    }, [explode]);

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    return (
        <div
            className={className}
            style={{
                width: prevSize,
                height: prevSize,
                position: "relative",
                ...style,
            }}
        >
            {zigzagRefs.current.map((ref, i) => (
                <ZigZag
                    key={i}
                    color="#fe4a49"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: `100%`,
                        height: `100%`,
                    }}
                    ref={ref}
                />
            ))}
            {crossRefs.current.map((ref, i) => (
                <Cross
                    key={i}
                    ref={ref}
                    color="#2ab7ca"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: `100%`,
                        height: `100%`,
                    }}
                />
            ))}
            {circleRefs.current.map((ref, i) => (
                <Circle
                    key={i}
                    color="#fed766"
                    strokeWidth={strokeWidth}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                    }}
                    shapeRef={ref}
                    strokeDasharray={undefined}
                    strokeLinecap={undefined}
                />
            ))}
        </div>
    );
}

let TIME_LINE7 = null;
const RADIUSES7 = [9, 10, 11, 12];
const CIRCLE_SIZE = 10;
const SHAPE_SIZE7 = 5;
const STROKE_WIDTH7 = 0.5;

const shapes = [Square, Triangle, Circle, Triangle];

export function Lubang({
    size,
    delay,
    repeatDelay,
    repeat,
    style,
    onComplete,
    onStart,
    onRepeat,
    className,
}) {
    const curveLiveRef = useRef();
    const circleRef = useRef();
    const shapesRefs = useRef(
        [...Array(4)].map(() => ({ outer: createRef(), inner: createRef() })),
    );
    const squareRefs = useRef(
        [...Array(3)].map(() => ({ inner: createRef(), outer: createRef() })),
    );

    const [prevSize, setPrevSize] = useState(size);
    const [prevDelay, setPrevDelay] = useState(0);
    const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
    const [prevRepeat, setPrevRepeat] = useState(0);

    // animate curve line:
    const animateCurveLine = useCallback(() => {
        const timeline = gsap.timeline();

        timeline.set(curveLiveRef.current, {
            attr: {
                "stroke-dasharray": "0 228",
                "stroke-dashoffset": 0,
                "stroke-width": 0,
            },
        });

        timeline.to(curveLiveRef.current, 0.3, {
            attr: { "stroke-width": 1 },
        });

        timeline.to(
            curveLiveRef.current,
            {
                keyframes: [
                    {
                        attr: {
                            "stroke-dasharray": "60 168",
                            "stroke-dashoffset": -40,
                        },
                        duration: 1,
                    },
                    {
                        attr: {
                            "stroke-dasharray": "0 227",
                            "stroke-dashoffset": -227,
                        },
                        duration: 0.5,
                    },
                ],
                ease: Power4.easeInOut,
            },
            "-=0.3",
        );

        timeline.to(
            curveLiveRef.current,
            0.6,
            {
                attr: { "stroke-width": 0 },
                ease: Power4.easeInOut,
            },
            "-=0.5",
        );

        return timeline;
    }, []);

    // animate shapes:
    const animateShapes = useCallback(() => {
        const timelines = [];

        shapesRefs.current.forEach(({ outer, inner }, i) => {
            const timeline = gsap.timeline({ delay: i * 0.08 });
            const cos = Math.cos((Math.PI / 2) * i);
            const sin = Math.sin((Math.PI / 2) * i);
            const size = ((SHAPE_SIZE7 / 2) * prevSize) / 100;
            const radiuses = RADIUSES7.map(
                (radius) => (prevSize * radius) / 100,
            );

            timeline.fromTo(
                outer.current as HTMLDivElement,
                0.7,
                { x: -size, y: -size, scale: 0 },
                {
                    x: `${-size + radiuses[i] * cos}`,
                    y: `${-size + radiuses[i] * sin}`,
                    scale: 1,
                    ease: Power4.easeOut,
                },
            );
            timeline.fromTo(
                outer.current as HTMLDivElement,
                0.7,
                { rotation: 0 },
                {
                    rotation: 200 * (i % 2 ? 1 : -1),
                    transformOrigin: "50% 50%",
                    ease: Expo.easeOut,
                },
                "-=0.6",
            );
            timeline.fromTo(
                inner.current as HTMLDivElement,
                0.5,
                { attr: { "stroke-width": 4 } },
                { attr: { "stroke-width": 0 }, ease: Power4.easeOut },
                "-=0.5",
            );
            timeline.fromTo(
                inner.current as HTMLDivElement,
                0.3,
                { opacity: 1 },
                { opacity: 0, ease: Power4.easeOut },
                "-=0.1",
            );

            timelines.push(timeline);
        });

        return timelines;
    }, [prevSize]);

    // animate sqaures
    const animateSquares = useCallback(() => {
        const timelines = [];

        squareRefs.current.forEach(({ inner, outer }, i) => {
            const timeline = gsap.timeline({ delay: i * 0.05 });
            const cos = Math.cos(((2 * Math.PI) / 3) * i);
            const sin = Math.sin(((2 * Math.PI) / 3) * i);
            const size = ((SHAPE_SIZE7 / 2) * prevSize) / 100;
            const radiuses = RADIUSES7.map(
                (radius) => (prevSize * radius) / 100,
            );

            timeline.fromTo(
                outer.current as HTMLDivElement,
                0.7,
                { x: -size, y: -size, scale: 0 },
                {
                    x: `${-size + radiuses[i] * cos}`,
                    y: `${-size + radiuses[i] * sin}`,
                    scale: 1,
                    ease: Power4.easeOut,
                },
            );
            timeline.fromTo(
                outer.current as HTMLDivElement,
                0.5,
                { rotation: 0 },
                {
                    rotation: 200 * (i % 2 ? 1 : -1),
                    transformOrigin: "50% 50%",
                    ease: Power4.easeOut,
                },
                "-=0.6",
            );
            timeline.fromTo(
                inner.current as HTMLDivElement,
                0.5,
                { attr: { "stroke-width": 4 } },
                { attr: { "stroke-width": 0 }, ease: Power4.easeOut },
                "-=0.4",
            );
            timeline.fromTo(
                outer.current as HTMLDivElement,
                0.3,
                { opacity: 1 },
                { opacity: 0, ease: Power4.easeOut },
                "-=0.4",
            );

            timelines.push(timeline);
        });

        return timelines;
    }, [prevSize]);

    // animate circle
    const animateCircle = useCallback(() => {
        const timeline = gsap.timeline();
        const strokeWidth = (prevSize * STROKE_WIDTH7) / 100;

        timeline.set(circleRef.current, {
            attr: { "stroke-width": 15, opacity: 1 },
        });
        timeline.fromTo(
            circleRef.current,
            0.5,
            { attr: { r: 0, "stroke-width": 15 } },
            {
                attr: { r: "45%", "stroke-width": strokeWidth },
                ease: Power4.easeOut,
            },
        );
        timeline.to(
            circleRef.current,
            0.5,
            {
                attr: { "stroke-width": 0 },
                ease: Power4.easeOut,
            },
            "-=0.5",
        );
        timeline.fromTo(
            circleRef.current,
            0.5,
            { opacity: 1 },
            { opacity: 0 },
            "-=0.4",
        );

        return timeline;
    }, [prevSize]);

    const explode = useCallback(() => {
        const curveLineTL = animateCurveLine();
        const shapesTimlines = animateShapes();
        const squaresTimlines = animateSquares();
        const circleTimeline = animateCircle();

        TIME_LINE7 = gsap.timeline({
            repeat: prevRepeat,
            delay: prevDelay,
            repeatDelay: prevRepeatDelay,
            onStart,
            onComplete,
            onRepeat,
        });

        TIME_LINE7.add(curveLineTL);
        TIME_LINE7.add(shapesTimlines, 0.6);
        TIME_LINE7.add(squaresTimlines, 0.9);
        TIME_LINE7.add(circleTimeline, 1.2);
    }, [
        prevRepeat,
        prevDelay,
        prevRepeatDelay,
        onComplete,
        onStart,
        onRepeat,
        animateShapes,
        animateCurveLine,
        animateCircle,
        animateSquares,
    ]);

    useEffect(() => {
        if (TIME_LINE7) TIME_LINE7.kill();
        explode();
    }, [explode]);

    useEffect(() => {
        setPrevSize(size);
        setPrevDelay(delay);
        setPrevRepeatDelay(repeatDelay);
        setPrevRepeat(repeat);
    }, [size, delay, repeatDelay, repeat]);

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                position: "relative",
                ...style,
            }}
        >
            <CurveLine
                width={prevSize}
                height={prevSize}
                ref={curveLiveRef}
                strokeDasharray="0 228"
                strokeWidth={1}
                color="#fed766"
            />
            {shapes.map((Shape, i) => (
                <Shape
                    key={i}
                    ref={shapesRefs.current[i].outer}
                    shapeRef={shapesRefs.current[i].inner}
                    width={`${SHAPE_SIZE7 - SHAPE_SIZE7 * i * 0.1}%` as never}
                    height={`${SHAPE_SIZE7 - SHAPE_SIZE7 * i * 0.1}%` as never}
                    strokeWidth={4}
                    style={{
                        position: "absolute",
                        left: "25%",
                        top: "40%",
                        transform: "translate(-50%, -50%)",
                    }}
                    color={["#88d8b0", "#ffeead", "#ff6f69", "#ffcc5c"][i]}
                    border
                    strokeDasharray={undefined}
                    strokeLinecap={undefined}
                />
            ))}
            {squareRefs.current.map(({ inner, outer }, i) => (
                <Square
                    key={i}
                    ref={outer}
                    shapeRef={inner}
                    width={`${SHAPE_SIZE7 - SHAPE_SIZE7 * i * 0.1}%`}
                    height={`${SHAPE_SIZE7 - SHAPE_SIZE7 * i * 0.1}%`}
                    strokeWidth={4}
                    color={["#88d8b0", "#ffeead", "#ff6f69"][i]}
                    style={{
                        position: "absolute",
                        left: "74%",
                        top: "36%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            ))}
            <Circle
                shapeRef={circleRef}
                width={CIRCLE_SIZE}
                height={CIRCLE_SIZE}
                radius={0}
                strokeWidth={2.5}
                color="#2ab7ca"
                style={{
                    position: "absolute",
                    left: "99%",
                    top: "24.5%",
                    transform: "translate(-50%, -50%)",
                }}
                strokeDasharray={undefined}
                strokeLinecap={undefined}
            />
        </div>
    );
}
