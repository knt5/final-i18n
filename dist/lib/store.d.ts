import type { Locale } from './types';
export declare function init({ locale }: {
    locale: Locale;
}): void;
export declare function getLocale(): Locale | undefined;
export declare function setLocale(locale: Locale): void;
export declare function isInitialized(): boolean;
