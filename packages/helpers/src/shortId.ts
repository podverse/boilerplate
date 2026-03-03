import { customAlphabet } from 'nanoid';

/** Length of generated short ids (URL-safe, used for bucket short_id, user short_id, etc.). */
export const SHORT_ID_LENGTH = 10;

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** Generates a URL-safe short id of SHORT_ID_LENGTH characters. */
export const generateShortId = customAlphabet(ALPHABET, SHORT_ID_LENGTH);
