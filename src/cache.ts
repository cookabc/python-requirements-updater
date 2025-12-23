/**
 * Cache Manager for PyPI version data
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */

export interface PackageVersions {
    packageName: string;
    versions: string[];
    fetchedAt: number;
}

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

export class CacheManager {
    private cache: Map<string, CacheEntry<PackageVersions>> = new Map();
    
    /**
     * Get cached data for a package
     * Returns null if not found or expired
     */
    get(key: string, ttlMinutes: number = 60): PackageVersions | null {
        const entry = this.cache.get(key.toLowerCase());
        
        if (!entry) {
            return null;
        }
        
        if (this.isExpired(entry, ttlMinutes)) {
            this.cache.delete(key.toLowerCase());
            return null;
        }
        
        return entry.data;
    }
    
    /**
     * Store package version data in cache
     */
    set(key: string, data: PackageVersions): void {
        this.cache.set(key.toLowerCase(), {
            data,
            timestamp: Date.now()
        });
    }
    
    /**
     * Check if a cache entry has expired
     */
    isExpired(entry: CacheEntry<PackageVersions>, ttlMinutes: number): boolean {
        const ttlMs = ttlMinutes * 60 * 1000;
        return Date.now() - entry.timestamp > ttlMs;
    }
    
    /**
     * Clear all cached data
     */
    clear(): void {
        this.cache.clear();
    }
    
    /**
     * Get the number of cached entries
     */
    size(): number {
        return this.cache.size;
    }
}

// Singleton instance
export const cacheManager = new CacheManager();
