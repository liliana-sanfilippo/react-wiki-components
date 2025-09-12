export function scrollUpWithOffset() {
    if (typeof window !== 'undefined') {
        const offset = window.innerHeight;
        const targetScrollPosition = Math.max(0,  offset);

        window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
    }
}