import {
    derived,
    type Loadable,
    type Readable,
    type Stores,
    type Writable
} from '@square/svelte-store';

export function debounced<T>(store: Readable<T>, delay: number = 100): Loadable<T> {
    let initialised = false;
    return derived(store, ($value, set) => {
        if (!initialised) {
            set($value);
            initialised = true;
            return;
        }
        const timeout = setTimeout(() => {
            set($value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    });
}
