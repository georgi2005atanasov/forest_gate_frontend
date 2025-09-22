import { API_BASE_URL } from "../../utils/appConstants";
import { getStableFingerprint, type StableFingerprintData } from "../../utils/common";

export interface PreparationReq {
    appVersion: string;
    fingerprint: string;
    extraData: StableFingerprintData; // from your types
}

export interface PreparationResp {
    ok: boolean;
    visitorId: string;
}

/**
 * Calls POST /onboarding/preparation
 * Sends cookies and handles 429.
 */
export async function prepareOnboarding(
    appVersion: string,
    opts?: { signal?: AbortSignal }
): Promise<PreparationResp> {
    if (!appVersion) {
        throw new Error('appVersion is required.');
    }

    // Build fingerprint data (you already have this function)
    const { fingerprint, data } = await getStableFingerprint();

    const body: PreparationReq = {
        appVersion,
        fingerprint,
        extraData: data,
    };

    const res = await fetch(`${API_BASE_URL}/onboarding/preparation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include', // needed for visitor cookie
        body: JSON.stringify(body),
        signal: opts?.signal,
    });

    if (res.status === 429) {
        throw new Error('Too many requests (429). Please try again soon.');
    }

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Request failed: ${res.status} ${text || ''}`.trim());
    }

    const json = (await res.json()) as PreparationResp;

    // Light sanity check
    if (typeof json.ok !== 'boolean' || typeof json.visitorId !== 'string') {
        throw new Error('Invalid response shape from server.');
    }

    return json;
}
