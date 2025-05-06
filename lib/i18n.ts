import {
	cloneElement,
	isValidElement,
	type ReactNode,
	useCallback,
	useMemo,
} from 'react';
import { getLocale } from './store';
import type {
	FlattenTranslation,
	Params,
	PrimitiveParams,
	T,
	Translation,
	Translations,
} from './types';

const PATTERN = /(\{\{.+?\}\})/;

export function useTranslation(translations: Translations) {
	const locale = getLocale();

	const flattenTranslation: FlattenTranslation = useMemo(
		() => flat({ translation: locale ? translations[locale] : undefined }),
		[locale, translations]
	);

	const t = useCallback(createT(flattenTranslation), [flattenTranslation]);

	return { t, locale };
}

/** Not recommended. Use useTranslation() instead. */
export function getT(translations: Translations) {
	const locale = getLocale();

	const flattenTranslation: FlattenTranslation = flat({
		translation: locale ? translations[locale] : undefined,
	});

	const t = createT(flattenTranslation);

	return { t, locale };
}

function createT(flattenTranslation: FlattenTranslation): T {
	function t(key: string, params?: PrimitiveParams): string;
	function t(key: string, params?: Params): ReactNode;
	function t(key: string, params?: PrimitiveParams | Params) {
		const value = flattenTranslation[key];

		if (!value) {
			return key;
		}

		if (!params) {
			return value;
		}

		return render({ key, value, params });
	}

	return t;
}

function flat({
	translation,
	prefix = '',
}: {
	translation?: Translation;
	prefix?: string;
}): FlattenTranslation {
	const flatten: FlattenTranslation = {};

	if (!translation) {
		return flatten;
	}

	Object.entries(translation).forEach(([key, value]) => {
		const flattenKey = `${prefix}${key}`;
		if (typeof value === 'string') {
			flatten[flattenKey] = value;
		} else {
			Object.entries(
				flat({ translation: value, prefix: `${flattenKey}.` })
			).forEach(([key, value]) => {
				flatten[key] = value;
			});
		}
	});

	return flatten;
}

function render({
	key,
	value,
	params,
}: {
	key: string;
	value: string;
	params: Params;
}): ReactNode | string {
	let stringOnly = true;
	const nodeList = value.split(PATTERN).filter(node => node);
	const elementList = nodeList.map(node => {
		if (!node.startsWith('{{') || !node.endsWith('}}')) {
			return node;
		}

		const paramKey = node.replace('{{', '').replace('}}', '').trim();
		const paramValue = params[paramKey];
		if (!paramValue) {
			return node;
		}

		if (typeof paramValue !== 'string') {
			stringOnly = false;
		}

		return isValidElement(paramValue)
			? cloneElement(paramValue, { key: `${key}\t${node}` })
			: paramValue;
	});

	return stringOnly ? elementList.join('') : elementList;
}
