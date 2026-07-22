/**
 * Manual test script for ClientCache
 * Run with: node src/utils/clientCache.manual-test.js
 */

// Mock localStorage for Node.js environment
global.localStorage = {
    _data: {},
    getItem(key) {
        return this._data[key] || null;
    },
    setItem(key, value) {
        this._data[key] = value;
    },
    removeItem(key) {
        delete this._data[key];
    },
    clear() {
        this._data = {};
    },
    get length() {
        return Object.keys(this._data).length;
    }
};

// Import the ClientCache class
import ClientCache from './clientCache.js';

console.log('🧪 Testing ClientCache utility...\n');

const cache = new ClientCache();
let passedTests = 0;
let failedTests = 0;

function test(description, testFn) {
    try {
        testFn();
        console.log(`✅ PASS: ${description}`);
        passedTests++;
    } catch (error) {
        console.log(`❌ FAIL: ${description}`);
        console.log(`   Error: ${error.message}`);
        failedTests++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// Test 1: Store and retrieve value
test('should store and retrieve a value', () => {
    cache.set('testKey', 'testValue', 60000);
    const retrieved = cache.get('testKey');
    assert(retrieved === 'testValue', `Expected 'testValue', got '${retrieved}'`);
});

// Test 2: Store complex objects
test('should store and retrieve complex objects', () => {
    const complexData = {
        id: 1,
        name: 'Test Product',
        nested: { price: 100, currency: 'USD' }
    };
    cache.set('product', complexData, 60000);
    const retrieved = cache.get('product');
    assert(JSON.stringify(retrieved) === JSON.stringify(complexData), 'Object mismatch');
});

// Test 3: Return null for expired entries
test('should return null for expired entries', () => {
    cache.set('expiredKey', 'expiredValue', -1000);
    const retrieved = cache.get('expiredKey');
    assert(retrieved === null, `Expected null, got '${retrieved}'`);
});

// Test 4: isExpired returns true for expired entries
test('should return true for expired entries', () => {
    cache.set('willExpire', 'value', -1000);
    const expired = cache.isExpired('willExpire');
    assert(expired === true, 'Expected true for expired entry');
});

// Test 5: isExpired returns false for valid entries
test('should return false for valid entries', () => {
    cache.set('validKey', 'validValue', 60000);
    const expired = cache.isExpired('validKey');
    assert(expired === false, 'Expected false for valid entry');
});

// Test 6: Remove specific entry
test('should remove a specific cache entry', () => {
    cache.set('key1', 'value1', 60000);
    cache.set('key2', 'value2', 60000);
    cache.remove('key1');
    assert(cache.get('key1') === null, 'Key1 should be removed');
    assert(cache.get('key2') === 'value2', 'Key2 should still exist');
});

// Test 7: Clear all entries
test('should clear all cache entries', () => {
    cache.set('clearKey1', 'value1', 60000);
    cache.set('clearKey2', 'value2', 60000);
    cache.clear();
    assert(cache.get('clearKey1') === null, 'All entries should be cleared');
    assert(cache.get('clearKey2') === null, 'All entries should be cleared');
});

// Test 8: Return null for non-existent keys
test('should return null for non-existent keys', () => {
    const retrieved = cache.get('nonExistentKey');
    assert(retrieved === null, `Expected null, got '${retrieved}'`);
});

// Test 9: isExpired returns true for non-existent keys
test('should return true for non-existent keys in isExpired', () => {
    const expired = cache.isExpired('nonExistentKey');
    assert(expired === true, 'Expected true for non-existent key');
});

// Test 10: Default TTL of 15 minutes
test('should use default TTL of 15 minutes (900000ms)', () => {
    const beforeTime = Date.now() + 900000;
    cache.set('defaultTTL', 'value');
    const afterTime = Date.now() + 900000;

    const stored = JSON.parse(localStorage.getItem('defaultTTL'));
    assert(stored.expiry >= beforeTime && stored.expiry <= afterTime, 'TTL should be ~15 minutes');
});

console.log(`\n📊 Test Results:`);
console.log(`   Passed: ${passedTests}`);
console.log(`   Failed: ${failedTests}`);
console.log(`   Total:  ${passedTests + failedTests}`);

if (failedTests === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
} else {
    console.log('\n💥 Some tests failed');
    process.exit(1);
}
