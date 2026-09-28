function Icon({ name, size = 22 }) {

    const commonProps = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    if (name === "book") {
        return (
            <svg {...commonProps}>
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
                <path d="M4 5.5v16" />
                <path d="M8 7h8" />
                <path d="M8 11h7" />
            </svg>
        );
    }

    if (name === "user") {
        return (
            <svg {...commonProps}>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
        );
    }

    if (name === "email") {
        return (
            <svg {...commonProps}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
            </svg>
        );
    }

    if (name === "lock") {
        return (
            <svg {...commonProps}>
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
        );
    }

    if (name === "users") {
        return (
            <svg {...commonProps}>
                <circle cx="9" cy="8" r="3" />
                <path d="M3 20a6 6 0 0 1 12 0" />
                <path d="M16 5.5a3 3 0 0 1 0 5.8" />
                <path d="M18 14a5 5 0 0 1 3 4.5" />
            </svg>
        );
    }

    if (name === "arrow") {
        return (
            <svg {...commonProps}>
                <path d="M5 12h13" />
                <path d="m13 6 6 6-6 6" />
            </svg>
        );
    }

    return null;
}

export default Icon;