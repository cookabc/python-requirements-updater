/**
 * Version Service - coordinates cache, PyPI client, and version resolver
 * Validates: Requirements 4.1, 4.2, 6.2, 6.3
 */

import { cacheManager } from './cache';
import { fetchVersions } from './pypiClient';
import { resolve } from './versionResolver';

export interface VersionInfo {
    packageName: string;
    latestCompatible: string | null;
    error?: 'not-found' | 'no-compatible-version' | 'fetch-error';
}

/**
 * Get the latest compatible version for a package
 */
export async function getLatestCompatible(
    packageName: string,
    specifier: string,
    includePrerelease: boolean = false,
    cacheTTLMinutes: number = 60
): Promise<VersionInfo> {
    // Check cache first
    let packageVersions = cacheManager.get(packageName, cacheTTLMinutes);
    
    // Fetch from PyPI if not cached
    if (!packageVersions) {
        const result = await fetchVersions(packageName);
        
        if (!result.success) {
            if (result.error === 'not-found') {
                return { packageName, latestCompatible: null, error: 'not-found' };
            }
            return { packageName, latestCompatible: null, error: 'fetch-error' };
        }
        
        packageVersions = result.data!;
        cacheManager.set(packageName, packageVersions);
    }
    
    // Resolve the latest compatible version
    const resolved = resolve(packageVersions.versions, specifier, includePrerelease);
    
    if (!resolved.found) {
        return { packageName, latestCompatible: null, error: 'no-compatible-version' };
    }
    
    return {
        packageName,
        latestCompatible: resolved.version!
    };
}
