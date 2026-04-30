"use client";
import { apiClient } from "@/lib/apiClient";
import { AuthContextType, User, UserRole } from "@/types";
import { createContext, useActionState, useContext, useEffect, useState } from "react";

type LoginState = {
    success?: boolean;
    error: string;
    user?: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // React 19 useActionState for better handling of async actions
    // useActionState(callback, initialState)
    const [loginState, loginAction, isLoginPending] = useActionState(
        async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            try {
                const data = await apiClient.login(email, password) as unknown as { user: User };
                setUser(data.user);

                return {
                    success: true,
                    error: "",
                    user: data.user
                };
            } catch (error) {
                console.error("Error:", error);

                return {
                    success: false,
                    error: "Invalid email or password",
                    user: null
                };
            }
        },
        {
            success: undefined,
            error: "",
            user: null
        } as LoginState
    );

    const logout = async () => {
        try {
            await apiClient.logout();
            setUser(null);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const hasPermission = (requiredRole: UserRole): boolean => {
        if (!user) return false;
        const roleHierarchy = {
            [UserRole.GUEST]: 0,
            [UserRole.CUSTOMER]: 1,
            [UserRole.MANAGER]: 2,
            [UserRole.ADMIN]: 3,
        };
        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    }

    // Load user on mount

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.getCurrentUser();
                setUser(userData || null);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login:loginAction, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};