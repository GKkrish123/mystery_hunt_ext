"use client";

import { Button } from "./button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./card";
import { Input } from "./input";
import { signInWithEmailAndPassword } from "firebase/auth/web-extension";
import React, { useEffect, useState, useTransition } from "react";
import { auth } from "../firebase-user";
import Loader from "./app-loader";
import { Eye, EyeClosed } from "lucide-react";
import { Label } from "./label";
import { FirebaseError } from "firebase/app";
import browser from "webextension-polyfill";
import { RecaptchaVerifier } from "firebase/auth";
import LetterPullup from "./letter-pullup";

export function LoginForm() {
    const [recaptchaVerifier, setRecaptchaVerifier] =
        useState<RecaptchaVerifier | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const newRecaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible",
            },
        );

        setRecaptchaVerifier(newRecaptchaVerifier);

        return () => {
            recaptchaVerifier?.clear();
        };
    }, [auth]);

    const loginHandle = async (values) => {
        try {
            setIsLoading(true);
            await browser.storage.local.set({
                "mystery-token": "some-token",
                "mystery-token-boom": Date.now() + 60 * 1000,
            });
            const user = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password,
            );
            const token = await user.user.getIdTokenResult();
            await browser.storage.local.set({
                "mystery-token": token.token,
                "mystery-token-boom": new Date(token.expirationTime).getTime(),
            });
        } catch (error) {
            setIsLoading(false);
            if (error instanceof FirebaseError) {
                // Handle Firebase-specific errors
                switch (error.code) {
                    case "auth/invalid-credential":
                        console.error(
                            "Entry refused. Credentials don’t match",
                            {
                                description:
                                    "Please check your credentials to enter.",
                            },
                        );
                        break;
                    case "auth/invalid-email":
                        console.error("Email is not formatted for this world", {
                            description: "Please check your email address.",
                        });
                        break;
                    case "auth/invalid-password":
                        console.error(
                            "Password doesn’t align with the cryptic forces.",
                            {
                                description: "Please check your password.",
                            },
                        );
                        break;
                    case "auth/too-many-requests":
                        console.error("Doors have been tried too many times", {
                            description:
                                "Too many attempts. Take a breath and try again later.",
                        });
                        break;
                    default:
                        console.error(
                            "Authentication error during logging in user",
                            error,
                        );
                        break;
                }
            } else {
                // Fallback for generic errors
                console.error("Something went wrong while checking you!", {
                    description: "Please try again later.",
                });
            }
        }
    };

    async function onSubmit(values) {
        await loginHandle(values);
    }

    return (
        <>
            <Card className="z-10 mx-auto max-w-sm w-[300px] h-[320px]">
                <LetterPullup
                    wrapperClassName="left-1/2 right-1/2 w-[calc(100%-5.5rem)] w-full justify-center"
                    className="pointer-events-none mt-2 z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ed2323] to-[#8c1eff] bg-clip-text text-xl font-bold text-transparent dark:text-transparent md:text-xl"
                    words="Mysteryverse"
                    forHeader={true}
                />
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your code to access mystery tools
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-[16px]">
                        <div>
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <div className="relative">
                                <Input
                                    type={!hidePassword ? "text" : "password"}
                                    value={password}
                                    name="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute right-[8px] top-[4px] h-[28px] w-[28px] p-0"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setHidePassword(!hidePassword);
                                    }}
                                >
                                    {hidePassword ? (
                                        <EyeClosed className="h-[28px] w-[28px] opacity-40" />
                                    ) : (
                                        <Eye className="h-[28px] w-[28px]" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button
                            disabled={isLoading || !email || !password}
                            type="submit"
                            onClick={() =>
                                onSubmit({
                                    email,
                                    password,
                                })
                            }
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="text-white" /> Checking
                                    you...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>
                </CardContent>
                <div id="recaptcha-container"></div>
            </Card>
        </>
    );
}
