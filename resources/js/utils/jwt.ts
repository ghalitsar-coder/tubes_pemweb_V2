import axios from 'axios';

// JWT Token Management
class JWTManager {
    private static instance: JWTManager;
    private token: string | null = null;
    private refreshTimer: NodeJS.Timeout | null = null;

    private constructor() {
        this.initializeToken();
        this.setupAxiosInterceptors();
    }

    public static getInstance(): JWTManager {
        if (!JWTManager.instance) {
            JWTManager.instance = new JWTManager();
        }
        return JWTManager.instance;
    }

    private initializeToken(): void {
        // Try to get token from meta tag or localStorage as fallback
        const metaToken = document.querySelector('meta[name="jwt-token"]')?.getAttribute('content');
        if (metaToken) {
            this.setToken(metaToken);
        }
    }

    public setToken(token: string): void {
        this.token = token;
        this.scheduleTokenRefresh();
    }

    public getToken(): string | null {
        return this.token;
    }

    public clearToken(): void {
        this.token = null;
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    private scheduleTokenRefresh(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        // Refresh token 5 minutes before expiry (JWT default is 60 minutes)
        const refreshTime = (60 - 5) * 60 * 1000; // 55 minutes in milliseconds
        
        this.refreshTimer = setTimeout(() => {
            this.refreshToken();
        }, refreshTime);
    }

    private async refreshToken(): Promise<void> {
        try {
            const response = await axios.post('/api/refresh', {}, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json',
                }
            });

            if (response.data.authorization?.token) {
                this.setToken(response.data.authorization.token);
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearToken();
            // Optionally redirect to login or show notification
            window.location.href = '/login';
        }
    }

    private setupAxiosInterceptors(): void {
        // Request interceptor to add JWT token to headers
        axios.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers['X-Auth-Token'] = this.token;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle token expiry
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const original = error.config;

                if (error.response?.status === 401 && !original._retry) {
                    original._retry = true;

                    try {
                        await this.refreshToken();
                        if (this.token) {
                            original.headers['X-Auth-Token'] = this.token;
                            return axios(original);
                        }
                    } catch (refreshError) {
                        this.clearToken();
                        window.location.href = '/login';
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    public async logout(): Promise<void> {
        try {
            if (this.token) {
                await axios.post('/api/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/json',
                    }
                });
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            this.clearToken();
        }
    }
}

// Export singleton instance
export const jwtManager = JWTManager.getInstance();

// Helper functions for common operations
export const setJWTToken = (token: string): void => {
    jwtManager.setToken(token);
};

export const getJWTToken = (): string | null => {
    return jwtManager.getToken();
};

export const clearJWTToken = (): void => {
    jwtManager.clearToken();
};

export const logoutWithJWT = async (): Promise<void> => {
    await jwtManager.logout();
};
