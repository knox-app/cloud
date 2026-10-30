/**
 * auth.js
 * Multi-Account & Session Management Module
 */

const STORAGE_SAVED = "saved_accounts";
const STORAGE_ACTIVE = "active_user";

/**
 * Resolves the active account from URL parameter (?u= or ?user=),
 * fallback to active_user, or fallback to saved_accounts[0].
 */
export function resolveCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const uParam = urlParams.has("u") ? urlParams.get("u") : urlParams.get("user");
    const theme = urlParams.get("theme") ? urlParams.get("theme").toLowerCase() : null;

    let savedAccounts = [];
    try {
        savedAccounts = JSON.parse(localStorage.getItem(STORAGE_SAVED) || "[]");
    } catch (e) {
        savedAccounts = [];
    }

    let activeUser = null;
    try {
        activeUser = JSON.parse(localStorage.getItem(STORAGE_ACTIVE) || "null");
    } catch (e) {}

    let userAccount = null;
    let userIndex = 0;

    if (uParam !== null) {
        const uIndex = parseInt(uParam, 10);
        if (!isNaN(uIndex) && uIndex >= 0 && uIndex < savedAccounts.length) {
            userAccount = savedAccounts[uIndex];
            userIndex = uIndex;
        } else {
            // Invalid index -> Switch account screen
            goToSwitchAccount(theme);
            return null;
        }
    } else if (activeUser) {
        userAccount = activeUser;
        const foundIdx = savedAccounts.findIndex(acc => 
            (acc.Email || acc.email) === (activeUser.Email || activeUser.email)
        );
        userIndex = foundIdx >= 0 ? foundIdx : 0;
    } else if (savedAccounts.length > 0) {
        userAccount = savedAccounts[0];
        userIndex = 0;
    } else {
        // No user found -> Redirect to login
        const dest = theme ? `1.html?theme=${encodeURIComponent(theme)}` : "1.html";
        window.location.href = dest;
        return null;
    }

    return {
        account: userAccount,
        index: userIndex,
        email: userAccount.Email || userAccount.email,
        lotus: userAccount.Lotus || userAccount.lotus || null,
        firstName: userAccount["First Name"] || "",
        lastName: userAccount["Last Name"] || "",
        fullName: `${userAccount["First Name"] || ""} ${userAccount["Last Name"] || ""}`.trim() || userAccount.Email || "User",
        profilePicture: userAccount["Profile_Picture"] || userAccount["Profile Picture"] || ""
    };
}

/**
 * Redirects to the multi-user switcher
 */
export function goToSwitchAccount(theme = null) {
    const url = new URL("https://knox-app.github.io/netflix/lgn/3");
    url.searchParams.set("app", "drive");
    if (theme) url.searchParams.set("theme", theme);
    window.location.href = url.toString();
}

/**
 * Redirects to the account manager
 */
export function goToManageAccount(userIndex = 0, theme = null) {
    const url = new URL("https://knox-app.github.io/netflix/lgn/4");
    url.searchParams.set("u", userIndex);
    if (theme) url.searchParams.set("theme", theme);
    window.location.href = url.toString();
}

/**
 * Redirects to Settings
 */
export function goToSettings(userIndex = 0, theme = null) {
    let dest = `settings.html?u=${userIndex}`;
    if (theme) dest += `&theme=${encodeURIComponent(theme)}`;
    window.location.href = dest;
}

/**
 * Clears local state and redirects to login / switcher
 */
export function signOut(theme = null) {
    localStorage.removeItem(STORAGE_ACTIVE);
    goToSwitchAccount(theme);
}
