const API_URL = import.meta.env.VITE_API_URL + '/api';

export const api = {
    auth: {
        login: async (credentials: any) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        },
        register: async (data: any) => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        }
    },
    triage: {
        save: async (data: any) => {
            const res = await fetch(`${API_URL}/triage/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to save triage');
            return res.json();
        },
        getHistory: async (userId: string) => {
            const res = await fetch(`${API_URL}/triage/history/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch history');
            return res.json();
        }
    },
    orders: {
        create: async (data: any) => {
            const res = await fetch(`${API_URL}/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to create order');
            return res.json();
        },
        getAll: async (userId: string) => {
            const res = await fetch(`${API_URL}/orders/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch orders');
            return res.json();
        }
    },
    feedback: {
        save: async (data: any) => {
            const res = await fetch(`${API_URL}/feedback/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to save feedback');
            return res.json();
        }
    }
};
