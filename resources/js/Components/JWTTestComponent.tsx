import React, { useState } from "react";
import { useJWT } from "@/hooks/useJWT";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface User {
    id: number;
    name: string;
    email: string;
}

export const JWTTestComponent: React.FC = () => {
    const { token, isAuthenticated, logout } = useJWT();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const testAPICall = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/me", {
                headers: {
                    Authorization: `Bearer ${token || ""}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                console.error("API call failed:", response.status);
            }
        } catch (error) {
            console.error("API call error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>JWT Integration Test</CardTitle>
                <CardDescription>
                    Test JWT authentication with API calls
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium">Token Status:</p>
                    <p
                        className={`text-sm ${
                            isAuthenticated ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {isAuthenticated
                            ? "Authenticated"
                            : "Not Authenticated"}
                    </p>
                </div>

                {token && (
                    <div>
                        <p className="text-sm font-medium">
                            Token (truncated):
                        </p>
                        <p className="text-xs font-mono break-all">
                            {token.substring(0, 50)}...
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <Button
                        onClick={testAPICall}
                        disabled={!isAuthenticated || loading}
                        className="w-full"
                    >
                        {loading ? "Testing..." : "Test API Call (/api/me)"}
                    </Button>

                    {isAuthenticated && (
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full"
                        >
                            Logout (Clear JWT)
                        </Button>
                    )}
                </div>

                {user && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium">API Response:</p>
                        <div className="text-sm">
                            <p>ID: {user.id}</p>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
