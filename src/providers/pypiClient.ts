/**
 * PyPI API Client
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

import * as https from 'https';
import { URL } from 'url';
import type { PackageVersions, PyPIClientResult } from '../types';

interface PyPIResponse {
    info?: { summary?: string };
    releases: Record<string, unknown[]>;
}

// Concurrency limiter removed
const TIMEOUT_MS = 10000;

const DEFAULT_REGISTRY = 'https://pypi.org';

function makeRequest(url: string): Promise<PyPIResponse> {
    return new Promise((resolve, reject) => {
        console.log(`[PyPI-HTTPS] Requesting ${url}`);
        const parsedUrl = new URL(url);

        const options: https.RequestOptions = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'VSCode-Python-Dependencies-Updater'
            },
            timeout: TIMEOUT_MS
        };

        const req = https.request(options, (res) => {
            const { statusCode } = res;
            console.log(`[PyPI-HTTPS] Response status for ${url}: ${statusCode}`);

            if (statusCode === 404) {
                res.resume();
                reject(new Error('404'));
                return;
            }

            if (statusCode !== 200) {
                res.resume();
                reject(new Error(`Request failed with status ${statusCode}`));
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';

            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => {
                try {
                    console.log(`[PyPI-HTTPS] Data received for ${url}, length: ${rawData.length}`);
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);
                } catch (e) {
                    console.error(`[PyPI-HTTPS] JSON parse error for ${url}:`, e);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`[PyPI-HTTPS] Network error for ${url}:`, e);
            reject(e);
        });

        req.on('timeout', () => {
            console.error(`[PyPI-HTTPS] Timeout for ${url}`);
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

/**
 * Fetch version data from PyPI for a package
 */
export async function fetchVersions(packageName: string, registryUrl?: string): Promise<PyPIClientResult> {
    console.log(`[PyPI] fetchVersions called for ${packageName}`);

    try {
        const baseUrl = (registryUrl || DEFAULT_REGISTRY).replace(/\/+$/, '');
        const url = `${baseUrl}/pypi/${encodeURIComponent(packageName)}/json`;

        const data = await makeRequest(url);

        if (!data.releases || typeof data.releases !== 'object') {
            console.error(`[PyPI] Invalid data structure for ${packageName}`);
            return { success: false, error: 'parse-error' };
        }

        const versions = Object.keys(data.releases);
        console.log(`[PyPI] Success ${packageName}: ${versions.length} versions found`);

        return {
            success: true,
            data: {
                packageName,
                versions,
                summary: data.info?.summary || undefined,
                fetchedAt: Date.now()
            }
        };
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg === '404') {
            return { success: false, error: 'not-found' };
        }
        if (msg === 'Timeout' || (error instanceof Error && (error as any).code === 'ETIMEDOUT')) {
            return { success: false, error: 'network-error' };
        }
        console.error(`[PyPI] Final catch error for ${packageName}:`, error);
        return { success: false, error: 'network-error' };
    }
}
