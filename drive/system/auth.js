/**
 * auth.js
 * Multi-account Session & Authentication Controller
 */
const STORAGE_KEY = 'active_user';
const SAVED_ACCOUNTS_KEY = 'saved_accounts';

export function getActiveUser(redirectIfMissing = true) {
    const urlParams = new URLSearchParams(window.location.search);
    const uParam = urlParams.has('u') ? urlParams.get('u') : urlParams.get('user');

    let savedAccounts = [];
    try {
        savedAccounts = JSON.parse(localStorage.getItem(SAVED_ACCOUNTS_KEY) || '[]');
    } catch(e) {
        savedAccounts = [];
    }

    // 1. If ?u=index is present in URL
    if (uParam !== null) {
        const uIdx = parseInt(uParam, 10);
        if (!isNaN(uIdx) && uIdx >= 0 && uIdx < savedAccounts.length) {
            const user = savedAccounts[uIdx];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return user;
        } else if (redirectIfMissing) {
            window.location.href = "https://knox-app.github.io/netflix/lgn/3?app=drive";
            return null;
        }
    }

    // 2. Fallback to active_user in localStorage
    let activeUser = null;
    try {
        activeUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch(e) {}

    if (activeUser && activeUser.Email) {
        return activeUser;
    }

    // 3. Fallback to first saved account
    if (savedAccounts.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAccounts[0]));
        return savedAccounts[0];
    }

    if (redirectIfMissing) {
        window.location.href = "https://knox-app.github.io/netflix/lgn/3?app=drive";
    }
    return null;
}

export function getCurrentUserIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    const uParam = urlParams.has('u') ? urlParams.get('u') : urlParams.get('user');
    if (uParam !== null) return parseInt(uParam, 10);

    let activeUser = null;
    try { activeUser = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e){}
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(SAVED_ACCOUNTS_KEY) || '[]'); } catch(e){}

    if (!activeUser || !activeUser.Email) return 0;
    const idx = saved.findIndex(a => (a.Email || a.email) === (activeUser.Email || activeUser.email));
    return idx >= 0 ? idx : 0;
}

export function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "https://knox-app.github.io/netflix/lgn/3?app=drive";
}
