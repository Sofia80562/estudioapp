type CacheItem<T> = {
    data: T;
    expiry: number;
};

class SimpleCache {
    private cache = new Map<string, CacheItem<any>>();

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null; // Expiró (TTL)
        }
        return item.data as T;
    }

    set<T>(key: string, data: T, ttlSeconds: number): void {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data, expiry });
    }

    invalidate(key: string): void {
        this.cache.delete(key); // Invalidación explícita
    }
}

export const memoryCache = new SimpleCache();