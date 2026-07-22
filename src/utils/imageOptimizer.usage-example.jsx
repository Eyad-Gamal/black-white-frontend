/**
 * ImageOptimizer Usage Examples
 * 
 * This file demonstrates how to use the ImageOptimizer utility in React components.
 * These examples follow the design specification and show integration with product images.
 */

import React from 'react';
import imageOptimizer from './imageOptimizer';

// Example 1: Product Card with Responsive Images
export function ProductCardExample({ product }) {
    const srcSet = imageOptimizer.generateSrcSet(product.image[0], [320, 640, 1024]);

    return (
        <div className="product-card">
            <img
                src={product.image[0]}
                srcSet={srcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                alt={product.name}
                className="product-image"
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
        </div>
    );
}

// Example 2: Hero Section with Picture Element
export function HeroImageExample({ heroImageUrl, alt }) {
    const pictureConfig = imageOptimizer.createPictureElement(
        heroImageUrl,
        alt,
        [640, 1024, 1920]
    );

    return (
        <picture>
            {pictureConfig.sources.map((source, index) => (
                <source
                    key={index}
                    type={source.type}
                    srcSet={source.srcSet}
                />
            ))}
            <img
                src={pictureConfig.img.src}
                alt={pictureConfig.img.alt}
                loading={pictureConfig.img.loading}
                className="hero-image"
            />
        </picture>
    );
}

// Example 3: Product Gallery with Multiple Images
export function ProductGalleryExample({ product }) {
    const [selectedImage, setSelectedImage] = React.useState(0);

    return (
        <div className="product-gallery">
            {/* Main Image */}
            <div className="main-image">
                <img
                    src={product.image[selectedImage]}
                    srcSet={imageOptimizer.generateSrcSet(
                        product.image[selectedImage],
                        [640, 1024, 1920]
                    )}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="eager"
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                />
            </div>

            {/* Thumbnail Strip */}
            <div className="thumbnails">
                {product.image.map((imageUrl, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={selectedImage === index ? 'active' : ''}
                    >
                        <img
                            src={imageOptimizer.getOptimizedUrl(imageUrl, 160, 'webp')}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

// Example 4: Format-Specific URL Generation
export function OptimizedImageExample({ imageUrl }) {
    // Get WebP version for modern browsers
    const webpUrl = imageOptimizer.getOptimizedUrl(imageUrl, 640, 'webp');

    // Get JPEG fallback for older browsers
    const jpegUrl = imageOptimizer.getOptimizedUrl(imageUrl, 640, 'jpeg');

    return (
        <picture>
            <source type="image/webp" srcSet={webpUrl} />
            <source type="image/jpeg" srcSet={jpegUrl} />
            <img src={imageUrl} alt="Optimized image" loading="lazy" />
        </picture>
    );
}

// Example 5: Checking WebP Support
export function WebPSupportIndicator() {
    return (
        <div className="debug-info">
            <p>
                WebP Support: {imageOptimizer.webPSupported ? '✓ Enabled' : '✗ Disabled'}
            </p>
            <p>
                Using format: {imageOptimizer.webPSupported ? 'WebP' : 'JPEG/PNG'}
            </p>
        </div>
    );
}

// Example 6: Custom Sizes for Different Breakpoints
export function ResponsiveProductImage({ product }) {
    // Define custom sizes for specific use cases
    const mobileSizes = [320, 640];
    const desktopSizes = [640, 1024, 1920];

    // Use mobile sizes for small screens, desktop sizes for larger screens
    const sizes = window.innerWidth < 768 ? mobileSizes : desktopSizes;

    const srcSet = imageOptimizer.generateSrcSet(product.image[0], sizes);

    return (
        <img
            src={product.image[0]}
            srcSet={srcSet}
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            alt={product.name}
        />
    );
}

// Example 7: Cloudinary URL Optimization
export function CloudinaryExample() {
    const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';

    // Generate optimized URLs for different sizes
    const thumbnailUrl = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 320, 'webp');
    const mediumUrl = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 640, 'webp');
    const largeUrl = imageOptimizer.getOptimizedUrl(cloudinaryUrl, 1024, 'webp');

    return (
        <div className="image-sizes-demo">
            <h3>Cloudinary Optimization Demo</h3>
            <div>
                <h4>Thumbnail (320px)</h4>
                <img src={thumbnailUrl} alt="Thumbnail" />
                <code>{thumbnailUrl}</code>
            </div>
            <div>
                <h4>Medium (640px)</h4>
                <img src={mediumUrl} alt="Medium" />
                <code>{mediumUrl}</code>
            </div>
            <div>
                <h4>Large (1024px)</h4>
                <img src={largeUrl} alt="Large" />
                <code>{largeUrl}</code>
            </div>
        </div>
    );
}

/**
 * Requirements Coverage:
 * 
 * 13.1 ✓ Image optimizer utility module exists
 * 13.2 ✓ Generate srcset for responsive images (generateSrcSet)
 * 13.3 ✓ Provide WebP format when supported (automatic detection)
 * 13.4 ✓ Provide fallback JPEG/PNG formats (createPictureElement)
 * 13.5 ✓ Generate URLs for multiple sizes (default: [320, 640, 1024, 1920])
 * 13.6 ✓ Used for product images (ProductCardExample, ProductGalleryExample)
 * 13.7 ✓ Used for hero images (HeroImageExample)
 */
