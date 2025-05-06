import type { ReactNode } from 'react';
export type Locale = string;
export type Translation = {
    [key: string]: string | Translation;
};
export type Translations = Record<Locale, Translation>;
export type FlattenTranslation = Record<string, string>;
export type Params = Record<string, ReactNode>;
export type PrimitiveParams = Record<string, string | number | bigint | boolean | null | undefined>;
export type T = {
    (key: string, params?: PrimitiveParams): string;
    (key: string, params?: Params): ReactNode;
};
export type Store = {
    initialized: false;
    locale?: undefined;
} | {
    initialized: true;
    locale: Locale;
};
