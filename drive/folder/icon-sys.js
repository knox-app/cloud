/**
 * folder-icons.js
 * Centralized SVG icon set and color palettes for folders
 */

export const FOLDER_COLORS = [
    { name: "Gray", hex: "#8A8D93" },
    { name: "Crimson Red", hex: "#E94335" },
    { name: "Coral Orange", hex: "#FB765B" },
    { name: "Bright Yellow", hex: "#FBBC04" },
    { name: "Emerald Green", hex: "#0F9D58" },
    { name: "Royal Blue", hex: "#4285F4" },
    { name: "Lavender Purple", hex: "#9B72CF" },
    { name: "Candy Pink", hex: "#F06292" },
    { name: "Cyan Teal", hex: "#26A69A" },
    { name: "Sky Blue", hex: "#29B6F6" },
    { name: "Deep Amber", hex: "#FFA000" },
    { name: "Indigo", hex: "#5C6BC0" },
    { name: "Warm Brown", hex: "#8D6E63" }
];

export const FOLDER_BADGE_ICONS = {
    folder: `<svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    dollar: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"></circle><line x1="12" y1="6" x2="12" y2="18"></line><path d="M15 9.5a2.5 2.5 0 0 0-5 0c0 1.5 1 2 2.5 2.5s2.5 1 2.5 2.5a2.5 2.5 0 0 1-5 0"></path></svg>`,
    book: `<svg viewBox="0 0 24 24"><rect x="4.5" y="3" width="15" height="18" rx="2.5"></rect><line x1="8.5" y1="3" x2="8.5" y2="21"></line></svg>`,
    cap: `<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 3 6 3 6 3s6 0 6-3v-5"></path></svg>`,
    pencil: `<svg viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
    nib: `<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><circle cx="11" cy="11" r="1.5"></circle></svg>`,
    code: `<svg viewBox="0 0 24 24"><path d="M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2"></path><path d="M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2"></path></svg>`,
    terminal: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"></rect><polyline points="7 9 10.5 12 7 15"></polyline><line x1="13" y1="15" x2="17" y2="15"></line></svg>`,
    music: `<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    cupcake: `<svg viewBox="0 0 24 24"><path d="M4.5 11h15l-2 10h-11l-2-10z"></path><path d="M4.5 11c0-2.2 1.8-4 4-4 .6 0 1.2.1 1.7.4C11 5.5 12.5 4 14.5 4c2.2 0 4 1.8 4 4 0 .3 0 .7-.1 1"></path></svg>`,
    brush: `<svg viewBox="0 0 24 24"><path d="M18 2l4 4-10 10H8v-4L18 2z"></path><path d="M4 22c0-3 2-5 4-5"></path></svg>`,
    palette: `<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".8"></circle><circle cx="17.5" cy="10.5" r=".8"></circle><circle cx="8.5" cy="7.5" r=".8"></circle><circle cx="6.5" cy="12.5" r=".8"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`,
    stethoscope: `<svg viewBox="0 0 24 24"><path d="M4.5 3v5a6 6 0 0 0 12 0V3"></path><line x1="3" y1="3" x2="6" y2="3"></line><line x1="15" y1="3" x2="18" y2="3"></line><path d="M10.5 14v4a3 3 0 0 0 6 0v-2"></path><circle cx="16.5" cy="16" r="2.5"></circle></svg>`,
    flower: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 8 0 4 4 0 0 0-4-4z"></path><path d="M22 12a4 4 0 0 0-4-4 4 4 0 0 0 0 8 4 4 0 0 0 4-4z"></path><path d="M12 22a4 4 0 0 0 4-4 4 4 0 0 0-8 0 4 4 0 0 0 4 4z"></path><path d="M2 12a4 4 0 0 0 4 4 4 4 0 0 0 0-8 4 4 0 0 0-4 4z"></path></svg>`,
    lotus: `<svg viewBox="0 0 24 24"><path d="M12 3c-2 4-5 8-10 11 4 1 8 0 10-4 2 4 6 5 10 4-5-3-8-7-10-11z"></path><path d="M12 10c-1.5 3-4 6-7 7 3 1 6 .5 7-3 1 3.5 4 4 7 3-3-1-5.5-4-7-7z"></path></svg>`,
    briefcase: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="3"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    chart: `<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    kettlebell: `<svg viewBox="0 0 24 24"><path d="M9 7V4a3 3 0 0 1 6 0v3"></path><circle cx="12" cy="14" r="7"></circle></svg>`,
    dumbbell: `<svg viewBox="0 0 24 24"><path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12"></path></svg>`,
    notebook: `<svg viewBox="0 0 24 24"><rect x="5" y="3" width="15" height="18" rx="2"></rect><line x1="9" y1="7" x2="15" y2="7"></line><line x1="9" y1="11" x2="15" y2="11"></line><line x1="9" y1="15" x2="12" y2="15"></line><path d="M3 6h2M3 10h2M3 14h2M3 18h2"></path></svg>`,
    scales: `<svg viewBox="0 0 24 24"><line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 21h14"></path><path d="M3 7h18"></path><path d="M3 7l3 7h-6l3-7zM21 7l3 7h-6l3-7z"></path></svg>`,
    globeStand: `<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="7"></circle><path d="M12 17v4M8 21h8M19 10a7 7 0 0 1-14 0"></path></svg>`,
    plane: `<svg viewBox="0 0 24 24"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>`,
    globe: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    wrench: `<svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    paw: `<svg viewBox="0 0 24 24"><circle cx="12" cy="14" r="4"></circle><circle cx="6.5" cy="9.5" r="2"></circle><circle cx="17.5" cy="9.5" r="2"></circle><circle cx="9" cy="5.5" r="1.8"></circle><circle cx="15" cy="5.5" r="1.8"></circle></svg>`,
    flask: `<svg viewBox="0 0 24 24"><path d="M10 2v7.31L4.15 19.89A2 2 0 0 0 5.86 23h12.28a2 2 0 0 0 1.71-3.11L14 9.31V2z"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line><line x1="14" y1="14" x2="10" y2="14"></line></svg>`,
    brain: `<svg viewBox="0 0 24 24"><path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .3.04.59.11.87A3.5 3.5 0 0 0 4 11.5c0 1.4.82 2.61 2 3.16V16a3.5 3.5 0 0 0 3.5 3.5h.5"></path><path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5c0 .3-.04.59-.11.87A3.5 3.5 0 0 1 20 11.5c0 1.4-.82 2.61-2 3.16V16a3.5 3.5 0 0 1-3.5 3.5h-.5"></path><path d="M12 4v16"></path></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    plant: `<svg viewBox="0 0 24 24"><path d="M7 21h10l-1-7H8l-1 7z"></path><path d="M12 14V7"></path><path d="M12 7c-2-3-5-3-5 0s3 3 5 0z"></path><path d="M12 9c2-3 5-3 5 0s-3 3-5 0z"></path></svg>`
};
