import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkeletonLoader from './SkeletonLoader';

describe('SkeletonLoader Component', () => {
    it('renders the default count of 8 skeleton cards', () => {
        const { container } = render(<SkeletonLoader />);
        const skeletonCards = container.querySelectorAll('.skeleton-card');
        expect(skeletonCards).toHaveLength(8);
    });

    it('renders custom count of skeleton cards', () => {
        const { container } = render(<SkeletonLoader count={4} />);
        const skeletonCards = container.querySelectorAll('.skeleton-card');
        expect(skeletonCards).toHaveLength(4);
    });

    it('applies responsive grid layout', () => {
        const { container } = render(<SkeletonLoader />);
        const gridContainer = container.querySelector('div');
        expect(gridContainer.className).toContain('grid');
        expect(gridContainer.className).toContain('grid-cols-2');
        expect(gridContainer.className).toContain('md:grid-cols-3');
        expect(gridContainer.className).toContain('lg:grid-cols-4');
    });

    it('renders skeleton elements with correct structure', () => {
        const { container } = render(<SkeletonLoader count={1} />);

        // Check for image placeholder
        const imageDiv = container.querySelector('.skeleton-image');
        expect(imageDiv).toBeTruthy();
        expect(imageDiv.className).toContain('aspect-square');
        expect(imageDiv.className).toContain('rounded-xl');

        // Check for shimmer effect
        const shimmerElements = container.querySelectorAll('.skeleton-shimmer');
        expect(shimmerElements.length).toBeGreaterThan(0);
    });

    it('mimics ProductCard layout structure', () => {
        const { container } = render(<SkeletonLoader count={1} />);

        // Should have image, name, and price placeholders
        const card = container.querySelector('.skeleton-card');
        const children = card.querySelectorAll('div');

        // Image container + name container + price container
        expect(children.length).toBeGreaterThanOrEqual(3);
    });
});
