export type StableFingerprintData = {
    // Browser + OS
    userAgent: string; // legacy UA (still useful for entropy)
    userAgentData?: {
        brands?: Array<{ brand: string; version: string }>;
        mobile?: boolean;
        platform?: string;
        architecture?: string;
        bitness?: string;
        model?: string;
        platformVersion?: string;
        uaFullVersion?: string;
    };

    // Locale / time
    primaryLanguage?: string;
    languages: string[];
    timeZone?: string;              // e.g. "Europe/Sofia"
    timeZoneOffsetMinutes: number;  // e.g. -120

    // Screen (keep only the most stable bits)
    screen: {
        width: number;      // physical screen width in CSS px (not viewport)
        height: number;     // physical screen height in CSS px
        colorDepth: number; // usually 24
    };

    // Hardware hints (fairly stable)
    hardware: {
        deviceMemoryGB?: number;       // Chromium only
        hardwareConcurrency?: number;  // logical cores
        maxTouchPoints?: number;
    };

    // Rendering stack (stable on a device)
    webgl?: {
        vendor?: string;
        renderer?: string;
    };

    // Canvas “stable-ish” hash (kept short)
    canvasHash?: string;

    // Persistent per-install ID (very stable in the same browser profile)
    installId: string;
};

export type StableFingerprint = {
    fingerprint: string;        // SHA-256 hex of the JSON below
    data: StableFingerprintData; // raw payload for debugging
};

export const getStableFingerprint = async (): Promise<StableFingerprint> => {
    const data: StableFingerprintData = {
        userAgent: navigator.userAgent,
        languages: getLanguages(),
        primaryLanguage: getLanguages()[0],
        timeZone: getTimeZone(),
        timeZoneOffsetMinutes: new Date().getTimezoneOffset(),
        screen: getScreenStable(),
        hardware: getHardwareStable(),
        userAgentData: await getUADataStable(),
        webgl: getWebGLVendorRenderer(),
        canvasHash: await getCanvasHash(),
        installId: ensureInstallId(), // stored in localStorage + cookie
    };

    const fingerprint = await hashObjectStable(data);
    return { fingerprint, data };
}

const getLanguages = (): string[] => {
    const langs =
        (navigator.languages && navigator.languages.length > 0)
            ? navigator.languages
            : (navigator.language ? [navigator.language] : []);
    return Array.from(new Set(langs));
}

const getTimeZone = (): string | undefined => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return undefined;
    }
}

const getScreenStable = () => {
    return {
        width: window.screen?.width ?? 0,
        height: window.screen?.height ?? 0,
        colorDepth: window.screen?.colorDepth ?? 0,
    };
}

const getHardwareStable = () => {
    const nav = navigator as any;
    return {
        deviceMemoryGB: typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined,
        hardwareConcurrency:
            typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : undefined,
        maxTouchPoints:
            typeof (navigator as any).maxTouchPoints === "number" ? (navigator as any).maxTouchPoints : undefined,
    };
}

const getUADataStable = async () => {
    const nav: any = navigator;
    if (!nav.userAgentData || typeof nav.userAgentData.getHighEntropyValues !== "function") {
        // Some browsers (Firefox/Safari) won’t have this.
        return undefined;
    }
    try {
        const base = {
            brands: nav.userAgentData.brands,
            mobile: nav.userAgentData.mobile,
            platform: nav.userAgentData.platform,
        };
        const high = await nav.userAgentData.getHighEntropyValues?.([
            "architecture",
            "bitness",
            "model",
            "platformVersion",
            "uaFullVersion",
        ]);
        return { ...base, ...high };
    } catch {
        return undefined;
    }
}

const getWebGLVendorRenderer = () => {
    try {
        const canvas = document.createElement("canvas");
        const gl =
            (canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        if (!gl) return undefined;

        const dbg = gl.getExtension("WEBGL_debug_renderer_info") as any;
        const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : undefined;
        const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : undefined;

        return {
            vendor: vendor ?? undefined,
            renderer: renderer ?? undefined,
        };
    } catch {
        return undefined;
    }
}

const getCanvasHash = async (): Promise<string | undefined> => {
    try {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (!ctx) return undefined;

        // Draw deterministic shapes/text
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#111";
        ctx.font = "16px Arial";
        ctx.fillText("stable-canvas-v1", 10, 24);

        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.arc(120, 64, 40, 0.1, Math.PI * 1.7);
        ctx.stroke();

        // Turn image to data URL and hash it
        const dataUrl = canvas.toDataURL("image/png");
        // Keep it short by hashing
        return await hashString(dataUrl);
    } catch {
        return undefined;
    }
}

const INSTALL_ID_KEY = "install_id";

const ensureInstallId = (): string => {
    // Try localStorage
    let id = "";
    try {
        id = localStorage.getItem(INSTALL_ID_KEY) || "";
    } catch {
        // ignore (Safari private / blocked)
    }

    if (!id) {
        id = generateUUIDv4();
        // Save to localStorage
        try {
            localStorage.setItem(INSTALL_ID_KEY, id);
        } catch { /* ignore */ }

        // Mirror to a non-HttpOnly cookie (helps across tabs/subpaths)
        try {
            // 400 days max on modern browsers
            document.cookie = `${INSTALL_ID_KEY}=${id}; Max-Age=${60 * 60 * 24 * 400}; Path=/; SameSite=Lax`;
        } catch { /* ignore */ }
    }

    // If localStorage missing but cookie exists, use cookie
    if (!id) {
        const fromCookie = readCookie(INSTALL_ID_KEY);
        if (fromCookie) id = fromCookie;
    }

    return id;
}

const readCookie = (name: string): string | null => {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
}

const generateUUIDv4 = (): string => {
    // RFC 4122 v4
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return (
        toHex(buf[0]) + toHex(buf[1]) + toHex(buf[2]) + toHex(buf[3]) + "-" +
        toHex(buf[4]) + toHex(buf[5]) + "-" +
        toHex(buf[6]) + toHex(buf[7]) + "-" +
        toHex(buf[8]) + toHex(buf[9]) + "-" +
        toHex(buf[10]) + toHex(buf[11]) + toHex(buf[12]) + toHex(buf[13]) + toHex(buf[14]) + toHex(buf[15])
    );
}

const hashObjectStable = async (obj: unknown): Promise<string> => {
    const json = stableStringify(obj);
    return await hashString(json);
}

const hashString = async (input: string): Promise<string> => {
    const enc = new TextEncoder();
    const bytes = enc.encode(input);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return bufferToHex(digest);
}

const bufferToHex = (buf: ArrayBuffer): string => {
    const v = new DataView(buf);
    let hex = "";
    for (let i = 0; i < v.byteLength; i++) {
        hex += v.getUint8(i).toString(16).padStart(2, "0");
    }
    return hex;
}

// Sort keys to keep a stable JSON → stable hash
const stableStringify = (value: any): string => {
    const seen = new WeakSet();
    const walk = (val: any): any => {
        if (val && typeof val === "object") {
            if (seen.has(val)) return "__cycle__";
            seen.add(val);
            if (Array.isArray(val)) return val.map(walk);
            const out: Record<string, any> = {};
            Object.keys(val)
                .sort()
                .forEach((k) => (out[k] = walk(val[k])));
            return out;
        }
        if (typeof val === "function") return undefined;
        if (typeof val === "undefined") return null;
        return val;
    };
    return JSON.stringify(walk(value));
}
