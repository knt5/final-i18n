import type { Locale, Store } from './types';

const store: Store = { initialized: false };

export function init({ locale }: { locale: Locale }): void {
	store.initialized = true;
	setLocale(locale);
}

export function getLocale(): Locale | undefined {
	return store.locale;
}

export function setLocale(locale: Locale): void {
	store.locale = locale;
}

export function isInitialized(): boolean {
	return store.initialized;
}
