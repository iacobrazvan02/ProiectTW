/**
 * @fileoverview Serviciu API pentru comunicarea cu backend-ul
 * @module services/api
 */

const API_BASE = 'https://proiecttw-d1fe.onrender.com';

/**
 * Funcție helper pentru request-uri fetch
 */
const fetchAPI = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });
    return response;
};

// ==================== AUTENTIFICARE ====================

export const authAPI = {
    login: async (nume, parola) => {
        const res = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ nume, parola }),
        });
        return res.json();
    },

    register: async (nume, parola, email) => {
        const res = await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ nume, parola, email }),
        });
        return res.json();
    },
};

// ==================== ALIMENTE ====================

export const alimenteAPI = {
    getAll: async () => {
        const res = await fetchAPI('/alimente');
        return res.json();
    },

    add: async (data) => {
        const res = await fetchAPI('/adauga', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return res.json();
    },

    delete: async (id) => {
        const res = await fetchAPI(`/alimente/${id}`, { method: 'DELETE' });
        return res.json();
    },

    toggleOfera: async (id, disponibil, descriere) => {
        const res = await fetchAPI(`/ofera/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ disponibil, descriere }),
        });
        return res.json();
    },

    claim: async (id, utilizatorId, amount) => {
        const res = await fetchAPI(`/claim/${id}`, {
            method: 'POST',
            body: JSON.stringify({ utilizator_id: utilizatorId, amount }),
        });
        return res.json();
    },

    undoClaim: async (id, amount) => {
        const res = await fetchAPI(`/undo-claim/${id}`, {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
        return res.json();
    },

    getAlerts: async (zile = 7) => {
        const res = await fetchAPI(`/alerts?zile=${zile}`);
        return res.json();
    },
};

// ==================== GRUPURI ====================

export const grupuriAPI = {
    getAll: async () => {
        const res = await fetchAPI('/grupuri');
        return res.json();
    },

    create: async (nume) => {
        const res = await fetchAPI('/grupuri', {
            method: 'POST',
            body: JSON.stringify({ nume }),
        });
        return res.json();
    },

    getMembri: async (grupId) => {
        const res = await fetchAPI(`/grupuri/${grupId}/membri`);
        return res.json();
    },

    addMembru: async (grupId, nume, etichete) => {
        const res = await fetchAPI(`/grupuri/${grupId}/membri`, {
            method: 'POST',
            body: JSON.stringify({ nume, etichete }),
        });
        return res.json();
    },

    deleteMembru: async (grupId, utilizatorId) => {
        const res = await fetchAPI(`/grupuri/${grupId}/membri/${utilizatorId}`, {
            method: 'DELETE',
        });
        return res.json();
    },

    createInvite: async (grupId, email) => {
        const res = await fetchAPI(`/grupuri/${grupId}/invite`, {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        return res.json();
    },

    shareAliment: async (alimentId, grupId) => {
        const res = await fetchAPI(`/alimente/${alimentId}/share`, {
            method: 'POST',
            body: JSON.stringify({ grup_id: grupId }),
        });
        return res.json();
    },

    shareCategorie: async (categorie, grupId) => {
        const res = await fetchAPI('/alimente/share-categorie', {
            method: 'POST',
            body: JSON.stringify({ categorie, grup_id: grupId }),
        });
        return res.json();
    },
};

// ==================== SOCIAL ====================

export const socialAPI = {
    share: async (platform, aliment) => {
        await fetchAPI('/share', {
            method: 'POST',
            body: JSON.stringify({ platform, aliment }),
        });
    },
};

const api = {
    auth: authAPI,
    alimente: alimenteAPI,
    grupuri: grupuriAPI,
    social: socialAPI,
};

export default api;
