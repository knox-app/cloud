/**
 * auth.js
 * Multi-account resolver & session manager
 */

const STORAGE_SAVED_ACCOUNTS = 'saved_accounts';
const STORAGE_ACTIVE_USER = 'active_user';

/**
 * Resolves active user based on URL parameter ?u= or ?user=
 * Falls back to active_user in localStorage, then index 0 of saved_accounts
 */
export function resolveActiveUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const uParam = urlParams.has('u') ? urlParams.get('u') : urlParams.get('user');

    let savedAccounts = [];
    try {
        savedAccounts = JSON.parse(localStorage.getItem(STORAGE_SAVED_ACCOUNTS) || '[]');
    } catch (e) {
        savedAccounts = [];
    }

    let activeUser = null;

    if (uParam !== null) {
        const uIndex = parseInt(uParam, 10);
        if (!isNaN(uIndex) && uIndex >= 0 && uIndex < savedAccounts.length) {
            activeUser = savedAccounts[uIndex];
        } else {
            // Invalid index -> redirect to account selector
            window.location.href = "https://knox-app.github.io/netflix/lgn/3?app=drive";
            return null;
        }
    } else {
        try {
            activeUser = JSON.parse(localStorage.getItem(STORAGE_ACTIVE_USER) || 'null');
        } catch (e) {}

        if (!activeUser && savedAccounts.length > 0) {
            activeUser = savedAccounts[0];
        }
    }

    if (!activeUser || (!activeUser.Email && !activeUser.email)) {
        window.location.href = "https://knox-app.github.io/netflix/lgn/3?app=drive";
        return null;
    }

    // Keep active_user synchronized
    localStorage.setItem(STORAGE_ACTIVE_USER, JSON.stringify(activeUser));
    return activeUser;
}

export function getCurrentUserIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('u')) return urlParams.get('u');
    return '0';
}

export function getAccountRedirectUrl(action) {
    const uIndex = getCurrentUserIndex();
    if (action === 'switch') {
        return "https://knox-app.github.io/netflix/lgn/3?app=drive";
    }
    if (action === 'manage') {
        return `https://knox-app.github.io/netflix/lgn/4?u=${uIndex}`;
    }
    if (action === 'settings') {
        return `settings.html?u=${uIndex}`;
    }
    return "#";
}

export function signOut() {
    localStorage.removeItem(STORAGE_ACTIVE_USER);
    window.location.href = "https://knox-app.github.io/netflix/lgn/3?app=drive";
}
