/**
 * Usage examples for ClientCache utility
 * Shows how to integrate clientCache in React components
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8
 */

import ClientCache from './clientCache.js';

// Initialize cache instance
const cache = new ClientCache();

// Example 1: Basic product caching workflow
// -----------------------------------------
export async function fetchProductsWithCache(backendUrl) {
    // Check cache first (Requirement 14.4)
    const cachedProducts = cache.get('products');

    // If cached data exists and is not expired, use it (Requirement 14.5)
    if (cachedProducts !== null) {
        console.log('Using cached products');
        return cachedProducts;
    }

    // If cache is expired/missing, fetch from API (Requirement 14.6)
    console.log('Fetching fresh products from API');
    const response = await fetch(`${backendUrl}/api/product/list`);
    const data = await response.json();

    // Update cache with fresh data (Requirement 14.7)
    // Using default 15-minute TTL (Requirement 14.3)
    cache.set('products', data.products);

    return data.products;
}

// Example 2: Caching individual product with custom TTL
// -----------------------------------------------------
export async function fetchProductWithCache(backendUrl, productId) {
    const cacheKey = `product_${productId}`;

    // Check cache first
    const cachedProduct = cache.get(cacheKey);
    if (cachedProduct) {
        return cachedProduct;
    }

    // Fetch from API
    const response = await fetch(`${backendUrl}/api/product/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
    });
    const data = await response.json();

    // Cache with 30-minute TTL for individual products
    cache.set(cacheKey, data.product, 1800000);

    return data.product;
}

// Example 3: React Component Integration
// ---------------------------------------
/*
import { useEffect, useState } from 'react';
import ClientCache from '../utils/clientCache.js';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const cache = new ClientCache();
    
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            
            // Check cache first
            const cached = cache.get('products');
            if (cached) {
                setProducts(cached);
                setLoading(false);
                return;
            }
            
            // Fetch from API if cache miss
            try {
                const response = await fetch('/api/product/list');
                const data = await response.json();
                
                // Update cache
                cache.set('products', data.products);
                setProducts(data.products);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadProducts();
    }, []);
    
    return (
        <div>
            {loading ? <p>Loading...</p> : (
                <ul>
                    {products.map(product => (
                        <li key={product._id}>{product.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
*/

// Example 4: Manual cache management (Requirement 14.8)
// -----------------------------------------------------
export function clearProductCache() {
    cache.remove('products');
    console.log('Product cache cleared');
}

export function clearAllCache() {
    // Clear all cached data (Requirement 14.8)
    cache.clear();
    console.log('All cache cleared');
}

// Example 5: Check if data needs refresh
// ---------------------------------------
export function shouldRefreshProducts() {
    return cache.isExpired('products');
}

// Example 6: Conditional caching based on data freshness
// -------------------------------------------------------
export async function getProductsWithForceRefresh(backendUrl, forceRefresh = false) {
    if (!forceRefresh) {
        const cached = cache.get('products');
        if (cached) return cached;
    }

    // Force refresh or cache miss
    const response = await fetch(`${backendUrl}/api/product/list`);
    const data = await response.json();

    cache.set('products', data.products);
    return data.products;
}

// Example 7: Caching with error handling
// ---------------------------------------
export async function fetchWithCacheSafe(backendUrl) {
    try {
        // Try cache first
        const cached = cache.get('products');
        if (cached) return { success: true, data: cached, source: 'cache' };

        // Fetch from API
        const response = await fetch(`${backendUrl}/api/product/list`);
        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        cache.set('products', data.products);

        return { success: true, data: data.products, source: 'api' };
    } catch (error) {
        // On error, try to return stale cache data as fallback
        const staleCache = cache.get('products');
        if (staleCache) {
            return { success: true, data: staleCache, source: 'stale-cache', warning: 'Using stale data' };
        }

        return { success: false, error: error.message };
    }
}

export default cache;
