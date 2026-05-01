import { User } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint: string, options: RequestInit={}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include' // Include cookies for authentication
        };

        const response = await fetch(url, config);
        
        // Handle non-OK responses
        if (response.status === 401) {
            // Handle unauthorized access
            return null; // or you can choose to throw an error or redirect to login
            // throw new Error('Unauthorized access');
        }        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
            throw new Error(errorData.message || 'API request failed');
        }
        return await response.json();
    }

    // Auth Methods
    async register(userData: {email: string, password: string, firstName: string, lastName: string}) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(email: string, password: string) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me', {
            method: 'GET'
        });
    }

    // User Methods
    async getAllUsers() {
        return this.request('/users', {
            method: 'GET'
        });
    }

    // Admin Methods
    async updateUserRole(userId: string, role: string) {
        return this.request(`/user/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ role })
        });
    }

    async deleteUser(userId: string) {
        return this.request(`/user/${userId}`, {
            method: 'DELETE'
        });
    }
}

export const apiClient = new ApiClient();