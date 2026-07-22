/**
 * Unit tests for ImageOptimizer utility
 * 
 * Tests cover:
 * - srcset generation
 * - URL optimization for different formats
 * - WebP support detection
 * - Picture element configuration
 * - Cloudinary-specific transformations
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import imageOptimizer from './imageOptimizer';

describe('ImageOptimizer', () => {
    describe('generateSrcSet', () => {
        test('generates srcset string with default sizes', () => {
            const srcSet = imageOptimizer.generateSrcSet('https://example.com/image.jpg');

            expect(srcSet).toContain('320w');
            expect(srcSet).toContain('640w');
            expect(srcSet).toContain('1024w');
            expect(srcSet).toContain('1920w');
        });

        test('generates srcset string with custom sizes', () => {
            const srcSet = imageOptimizer.generateSrcSet(
                'https://example.com/image.jpg',
                [320, 640, 1024]
            );

            expect(srcSet).toContain('320w');
            expect(srcSet).toContain('640w');
            expect(srcSet).toContain('1024w');
            expect(srcSet).not.toContain('1920w');
        });

        test('returns empty string for null baseUrl', () => {
            const srcSet = imageOptimizer.generateSrcSet(null);
            expect(srcSet).toBe('');
        });

        test('returns empty string for empty baseUrl', () => {
            const srcSet = imageOptimizer.generateSrcSet('');
            expect(srcSet).toBe('');
        });

        test('includes all sizes in correct format', () => {
            const sizes = [320, 640, 1024];
            const srcSet = imageOptimizer.generateSrcSet('https://example.com/image.jpg', sizes);

            // Should have format: "url 320w, url 640w, url 1024w"
            const parts = srcSet.split(', ');
            expect(parts).toHaveLength(3);

            parts.forEach((part, index) => {
                expect(part).toMatch(new RegExp(`${sizes[index]}w$`));
            });
        });
    });

    describe('getOptimizedUrl', () => {
        test('returns optimized URL for Cloudinary images', () => {
            const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';
            const url = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 640, 'webp');

            expect(url).toContain('w_640');
            expect(url).toContain('f_webp');
            expect(url).toContain('q_auto');
            expect(url).toContain('c_scale');
        });

        test('returns original URL for non-Cloudinary images', () => {
            const regularUrl = 'https://example.com/image.jpg';
            const url = imageOptimizer.getOptimizedUrl(regularUrl, 640, 'webp');

            expect(url).toBe(regularUrl);
        });

        test('handles different image formats', () => {
            const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';

            const webpUrl = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 640, 'webp');
            expect(webpUrl).toContain('f_webp');

            const jpegUrl = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 640, 'jpeg');
            expect(jpegUrl).toContain('f_jpeg');

            const pngUrl = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 640, 'png');
            expect(pngUrl).toContain('f_png');
        });

        test('returns empty string for null baseUrl', () => {
            const url = imageOptimizer.getOptimizedUrl(null, 640, 'webp');
            expect(url).toBe('');
        });

        test('returns empty string for empty baseUrl', () => {
            const url = imageOptimizer.getOptimizedUrl('', 640, 'webp');
            expect(url).toBe('');
        });

        test('uses webp format by default', () => {
            const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';
            const url = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 640);

            expect(url).toContain('f_webp');
        });
    });

    describe('getCloudinaryOptimizedUrl', () => {
        test('injects transformations after /upload/', () => {
            const baseUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';
            const optimized = imageOptimizer.getCloudinaryOptimizedUrl(baseUrl, 640, 'webp');

            const uploadIndex = optimized.indexOf('/upload/');
            const transformationStart = uploadIndex + 8; // Length of '/upload/'
            const afterUpload = optimized.substring(transformationStart);

            expect(afterUpload).toMatch(/^w_\d+,f_\w+,q_auto,c_scale\//);
        });

        test('returns original URL if /upload/ not found', () => {
            const invalidUrl = 'https://example.com/image.jpg';
            const result = imageOptimizer.getCloudinaryOptimizedUrl(invalidUrl, 640, 'webp');

            expect(result).toBe(invalidUrl);
        });

        test('preserves path after transformation injection', () => {
            const baseUrl = 'https://res.cloudinary.com/demo/image/upload/folder/subfolder/sample.jpg';
            const optimized = imageOptimizer.getCloudinaryOptimizedUrl(baseUrl, 640, 'webp');

            expect(optimized).toContain('folder/subfolder/sample.jpg');
        });
    });

    describe('createPictureElement', () => {
        test('creates picture element configuration with WebP and fallback', () => {
            const config = imageOptimizer.createPictureElement(
                'https://example.com/image.jpg',
                'Test image',
                [320, 640]
            );

            expect(config).toHaveProperty('sources');
            expect(config).toHaveProperty('img');
            expect(config.sources).toBeInstanceOf(Array);
            expect(config.img.alt).toBe('Test image');
            expect(config.img.loading).toBe('lazy');
        });

        test('includes WebP source when supported', () => {
            const config = imageOptimizer.createPictureElement(
                'https://example.com/image.jpg',
                'Test image'
            );

            if (imageOptimizer.webPSupported) {
                const webpSource = config.sources.find(s => s.type === 'image/webp');
                expect(webpSource).toBeDefined();
                expect(webpSource.srcSet).toBeTruthy();
            }
        });

        test('includes fallback source', () => {
            const config = imageOptimizer.createPictureElement(
                'https://example.com/image.jpg',
                'Test image'
            );

            // Should have at least one non-WebP source as fallback
            const fallbackSource = config.sources.find(s => s.type !== 'image/webp');
            expect(fallbackSource).toBeDefined();
        });

        test('returns empty config for null baseUrl', () => {
            const config = imageOptimizer.createPictureElement(null, 'Test image');

            expect(config.sources).toEqual([]);
            expect(config.img.src).toBe('');
            expect(config.img.alt).toBe('Test image');
        });

        test('uses empty string for missing alt text', () => {
            const config = imageOptimizer.createPictureElement('https://example.com/image.jpg');

            expect(config.img.alt).toBe('');
        });

        test('uses provided custom sizes', () => {
            const customSizes = [480, 960];
            const config = imageOptimizer.createPictureElement(
                'https://example.com/image.jpg',
                'Test image',
                customSizes
            );

            config.sources.forEach(source => {
                expect(source.srcSet).toContain('480w');
                expect(source.srcSet).toContain('960w');
            });
        });
    });

    describe('detectOriginalFormat', () => {
        test('detects PNG format', () => {
            const format = imageOptimizer.detectOriginalFormat('https://example.com/image.png');
            expect(format).toBe('png');
        });

        test('detects JPEG format from .jpg extension', () => {
            const format = imageOptimizer.detectOriginalFormat('https://example.com/image.jpg');
            expect(format).toBe('jpeg');
        });

        test('detects JPEG format from .jpeg extension', () => {
            const format = imageOptimizer.detectOriginalFormat('https://example.com/image.jpeg');
            expect(format).toBe('jpeg');
        });

        test('detects WebP format', () => {
            const format = imageOptimizer.detectOriginalFormat('https://example.com/image.webp');
            expect(format).toBe('webp');
        });

        test('defaults to JPEG for unknown formats', () => {
            const format = imageOptimizer.detectOriginalFormat('https://example.com/image');
            expect(format).toBe('jpeg');
        });

        test('defaults to JPEG for null URL', () => {
            const format = imageOptimizer.detectOriginalFormat(null);
            expect(format).toBe('jpeg');
        });

        test('is case-insensitive', () => {
            const format1 = imageOptimizer.detectOriginalFormat('https://example.com/image.PNG');
            const format2 = imageOptimizer.detectOriginalFormat('https://example.com/image.JPG');

            expect(format1).toBe('png');
            expect(format2).toBe('jpeg');
        });
    });

    describe('detectWebPSupport', () => {
        test('returns a boolean value', () => {
            const result = imageOptimizer.detectWebPSupport();
            expect(typeof result).toBe('boolean');
        });

        test('webPSupported property is set during initialization', () => {
            expect(typeof imageOptimizer.webPSupported).toBe('boolean');
        });
    });

    describe('generateSrcSetForFormat', () => {
        test('generates srcset for specific format', () => {
            const srcSet = imageOptimizer.generateSrcSetForFormat(
                'https://example.com/image.jpg',
                [320, 640],
                'webp'
            );

            expect(srcSet).toContain('320w');
            expect(srcSet).toContain('640w');
        });

        test('uses specified format in URLs', () => {
            const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';
            const srcSet = imageOptimizer.generateSrcSetForFormat(
                cloudinaryUrl,
                [320, 640],
                'png'
            );

            expect(srcSet).toContain('f_png');
        });
    });

    describe('Edge cases', () => {
        test('handles very small image widths', () => {
            const url = imageOptimizer.getOptimizedUrl(
                'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
                1,
                'webp'
            );

            expect(url).toContain('w_1');
        });

        test('handles very large image widths', () => {
            const url = imageOptimizer.getOptimizedUrl(
                'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
                9999,
                'webp'
            );

            expect(url).toContain('w_9999');
        });

        test('handles URLs with query parameters', () => {
            const urlWithParams = 'https://example.com/image.jpg?version=123';
            const srcSet = imageOptimizer.generateSrcSet(urlWithParams, [320, 640]);

            expect(srcSet).toBeTruthy();
            expect(srcSet).toContain('320w');
        });

        test('handles Cloudinary URLs with nested folders', () => {
            const nestedUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/folder1/folder2/folder3/sample.jpg';
            const optimized = imageOptimizer.getOptimizedUrl(nestedUrl, 640, 'webp');

            expect(optimized).toContain('w_640');
            expect(optimized).toContain('folder1/folder2/folder3/sample.jpg');
        });
    });
});
