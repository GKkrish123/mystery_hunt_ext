import React, {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import AppLoader from "./app-loader";
import { LoginForm } from "./login-form";
import { Label } from "./label";
import browser from "webextension-polyfill";

type AuthContextType = {
    user: any | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await browser.runtime.sendMessage({
                    type: "GET_USER",
                });
                console.log("userData", userData);

                setUser(userData ?? null);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        // Fetch initial user state
        void fetchUser();

        // Listen for user updates
        const handleUserUpdate = async (message: any) => {
            if (message.type === "USER_UPDATED") {
                setUser(message.payload ?? null);
            }
        };
        browser.runtime.onMessage.addListener(handleUserUpdate);

        return () => {
            browser.runtime.onMessage.removeListener(handleUserUpdate);
        };
    }, []);

    if (loading) {
        return <AppLoader />;
    }

    if (!user) {
        return <LoginForm />;
    }

    if (!user.emailVerified || !user.displayName) {
        return <Label>Verify your email to continue</Label>;
    }

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => React.useContext(AuthContext);
