/**
 * Unit tests for ClientCache utility
 * Tests Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import ClientCache from './clientCache.js';

describe('ClientCache', () => {
    let cache;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        cache = new ClientCache();
    });

    describe('set method', () => {
        it('should store a value in localStorage', () => {
            cache.set('testKey', 'testValue');

            const stored = localStorage.getItem('testKey');
            expect(stored).not.toBeNull();

            const parsed = JSON.parse(stored);
            expect(parsed.value).toBe('testValue');
            expect(parsed.expiry).toBeGreaterThan(Date.now());
        });

        it('should store complex objects', () => {
            const complexData = {
                id: 1,
                name: 'Test Product',
                nested: { price: 100, currency: 'USD' }
            };

            cache.set('product', complexData);
            const retrieved = cache.get('product');

            expect(retrieved).toEqual(complexData);
        });

        it('should use default TTL of 15 minutes (900000ms)', () => {
            const beforeTime = Date.now() + 900000;
            cache.set('testKey', 'testValue');
            const afterTime = Date.now() + 900000;

            const stored = JSON.parse(localStorage.getItem('testKey'));

            expect(stored.expiry).toBeGreaterThanOrEqual(beforeTime);
            expect(stored.expiry).toBeLessThanOrEqual(afterTime);
        });

        it('should accept custom TTL', () => {
            const customTTL = 60000; // 1 minute
            const beforeTime = Date.now() + customTTL;

            cache.set('testKey', 'testValue', customTTL);
            const afterTime = Date.now() + customTTL;

            const stored = JSON.parse(localStorage.getItem('testKey'));

            expect(stored.expiry).toBeGreaterThanOrEqual(beforeTime);
            expect(stored.expiry).toBeLessThanOrEqual(afterTime);
        });

        it('should handle localStorage errors gracefully', () => {
            // Mock localStorage to throw an error
            const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation(() => {
                throw new Error('QuotaExceededError');
            });

            // Should not throw
            expect(() => cache.set('testKey', 'testValue')).not.toThrow();

            setItemSpy.mockRestore();
        });
    });

    describe('get method', () => {
        it('should retrieve a stored value', () => {
            cache.set('testKey', 'testValue');
            const retrieved = cache.get('testKey');

            expect(retrieved).toBe('testValue');
        });

        it('should return null for non-existent keys', () => {
            const retrieved = cache.get('nonExistentKey');

            expect(retrieved).toBeNull();
        });

        it('should return null and remove expired entries', () => {
            // Set with negative TTL (already expired)
            cache.set('expiredKey', 'expiredValue', -1000);

            const retrieved = cache.get('expiredKey');

            expect(retrieved).toBeNull();
            expect(localStorage.getItem('expiredKey')).toBeNull();
        });

        it('should return value if not expired', () => {
            cache.set('validKey', 'validValue', 60000); // 1 minute
            const retrieved = cache.get('validKey');

            expect(retrieved).toBe('validValue');
        });

        it('should handle corrupted cache entries gracefully', () => {
            // Manually insert invalid JSON
            localStorage.setItem('corruptedKey', 'not valid json {');

            const retrieved = cache.get('corruptedKey');

            expect(retrieved).toBeNull();
        });

        it('should handle localStorage errors gracefully', () => {
            const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(() => {
                throw new Error('Storage access error');
            });

            const retrieved = cache.get('testKey');

            expect(retrieved).toBeNull();

            getItemSpy.mockRestore();
        });
    });

    describe('remove method', () => {
        it('should remove a specific cache entry', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');

            cache.remove('key1');

            expect(cache.get('key1')).toBeNull();
            expect(cache.get('key2')).toBe('value2');
        });

        it('should handle removing non-existent keys gracefully', () => {
            expect(() => cache.remove('nonExistentKey')).not.toThrow();
        });

        it('should handle localStorage errors gracefully', () => {
            const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
            removeItemSpy.mockImplementation(() => {
                throw new Error('Storage access error');
            });

            expect(() => cache.remove('testKey')).not.toThrow();

            removeItemSpy.mockRestore();
        });
    });

    describe('clear method', () => {
        it('should clear all cache entries', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            cache.clear();

            expect(cache.get('key1')).toBeNull();
            expect(cache.get('key2')).toBeNull();
            expect(cache.get('key3')).toBeNull();
            expect(localStorage.length).toBe(0);
        });

        it('should handle localStorage errors gracefully', () => {
            const clearSpy = vi.spyOn(Storage.prototype, 'clear');
            clearSpy.mockImplementation(() => {
                throw new Error('Storage access error');
            });

            expect(() => cache.clear()).not.toThrow();

            clearSpy.mockRestore();
        });
    });

    describe('isExpired method', () => {
        it('should return false for non-expired entries', () => {
            cache.set('validKey', 'validValue', 60000); // 1 minute

            expect(cache.isExpired('validKey')).toBe(false);
        });

        it('should return true for expired entries', () => {
            cache.set('expiredKey', 'expiredValue', -1000); // Already expired

            expect(cache.isExpired('expiredKey')).toBe(true);
        });

        it('should return true for non-existent keys', () => {
            expect(cache.isExpired('nonExistentKey')).toBe(true);
        });

        it('should return true for corrupted entries', () => {
            localStorage.setItem('corruptedKey', 'invalid json');

            expect(cache.isExpired('corruptedKey')).toBe(true);
        });

        it('should handle localStorage errors gracefully', () => {
            const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(() => {
                throw new Error('Storage access error');
            });

            const result = cache.isExpired('testKey');

            expect(result).toBe(true);

            getItemSpy.mockRestore();
        });
    });

    describe('TTL expiration behavior', () => {
        it('should correctly handle expiration at exact TTL boundary', () => {
            const ttl = 1000; // 1 second
            cache.set('boundaryKey', 'boundaryValue', ttl);

            // Immediately after setting, should not be expired
            expect(cache.isExpired('boundaryKey')).toBe(false);
            expect(cache.get('boundaryKey')).toBe('boundaryValue');
        });

        it('should handle zero TTL as immediately expired', () => {
            cache.set('zeroTTL', 'value', 0);

            // Should be immediately expired
            expect(cache.isExpired('zeroTTL')).toBe(true);
            expect(cache.get('zeroTTL')).toBeNull();
        });
    });

    describe('integration scenarios', () => {
        it('should support typical product caching workflow', () => {
            const products = [
                { id: 1, name: 'Product 1', price: 100 },
                { id: 2, name: 'Product 2', price: 200 }
            ];

            // Cache products with 15-minute TTL (default)
            cache.set('products', products);

            // Retrieve cached products
            const cachedProducts = cache.get('products');
            expect(cachedProducts).toEqual(products);

            // Manually clear cache
            cache.clear();

            // Should return null after clear
            expect(cache.get('products')).toBeNull();
        });

        it('should handle multiple concurrent cache entries', () => {
            cache.set('user', { id: 1, name: 'John' }, 300000);
            cache.set('products', ['p1', 'p2'], 600000);
            cache.set('cart', { items: [] }, 900000);

            expect(cache.get('user')).toEqual({ id: 1, name: 'John' });
            expect(cache.get('products')).toEqual(['p1', 'p2']);
            expect(cache.get('cart')).toEqual({ items: [] });

            // Remove one entry
            cache.remove('products');

            // Others should still exist
            expect(cache.get('user')).toEqual({ id: 1, name: 'John' });
            expect(cache.get('products')).toBeNull();
            expect(cache.get('cart')).toEqual({ items: [] });
        });
    });
});
