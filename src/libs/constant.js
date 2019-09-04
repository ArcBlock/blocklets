// @link https://coolors.co/ef476f-ffd166-06d6a0-118ab2-073b4c
import zhTheme from '@arcblock/www/locales/zh';
import enTheme from '@arcblock/www/locales/en';
import zhApp from '../locales/zh';
import enApp from '../locales/en';

export const translations = {
  en: Object.assign(enTheme, enApp),
  zh: Object.assign(zhTheme, zhApp),
};

export const COOKIE_LANGUAGE = 'aba_lang';

export const consoleURL = 'https://console.arcblock.io';
export const loginURL = 'https://console.arcblock.io/auth/login';
export const signupURL = 'https://console.arcblock.io/auth/signup';
export const playgroundURL = 'https://ocap.arcblock.io';
export const docsURL = 'http://ocap-docs.arcblock.io';
export const supportURL = 'mailto:support@arcblock.io';
