import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { jwtManager } from '@/utils/jwt';

interface JWTData {
    token?: string;
    refreshed?: boolean;
}

export const useJWT = () => {
    const { props } = usePage();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const jwtData = (props as any).jwt as JWTData;
        
        if (jwtData?.token) {
            jwtManager.setToken(jwtData.token);
            setToken(jwtData.token);
        }

        // Listen for token changes
        const currentToken = jwtManager.getToken();
        setToken(currentToken);
    }, [props]);

    const logout = async () => {
        await jwtManager.logout();
        setToken(null);
    };

    const refreshToken = async () => {
        try {
            // This will be handled automatically by the JWT manager
            const currentToken = jwtManager.getToken();
            setToken(currentToken);
        } catch (error) {
            console.error('Token refresh failed:', error);
            setToken(null);
        }
    };

    return {
        token,
        isAuthenticated: !!token,
        logout,
        refreshToken,
    };
};
