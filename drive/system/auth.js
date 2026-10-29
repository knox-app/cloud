/**
 * auth.js
 * Centralized Session & Authentication Controller
 */

const STORAGE_KEY = 'active_user';
const LOGIN_PAGE = '1.html';

/**
 * Retrieves the currently logged-in user from localStorage.
 * If redirectIfMissing is true and no valid session exists, redirects to login.
 */
export function getActiveUser(redirectIfMissing = true) {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
        user = null;
    }

    if (!user || !user.Email) {
        if (redirectIfMissing) {
            window.location.href = LOGIN_PAGE;
        }
        return null;
    }

    return user;
}

/**
 * Saves a user session to localStorage.
 */
export function setActiveUser(userData) {
    if (!userData || !userData.Email) {
        console.error("Invalid user data provided to setActiveUser");
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

/**
 * Clears the session and redirects to the login screen.
 */
export function signOut(redirectUrl = LOGIN_PAGE) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = redirectUrl;
}

/**
 * Checks if a session exists without triggering an automatic redirect.
 */
export function isAuthenticated() {
    return Boolean(getActiveUser(false));
}
