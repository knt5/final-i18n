import type { T, Translations } from './types';
export declare function useTranslation(translations: Translations): {
    t: T;
    locale: string | undefined;
};
/** Not recommended. Use useTranslation() instead. */
export declare function getT(translations: Translations): {
    t: T;
    locale: string | undefined;
};
