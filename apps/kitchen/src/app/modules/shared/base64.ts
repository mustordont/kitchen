import {fromByteArray, toByteArray} from 'base64-js';

export function base64Encode(str: string) {
    const bytes = new TextEncoder().encode(str);
    return fromByteArray(bytes);
}

export function base64Decode(str: string) {
    const bytes = toByteArray(str);
    return new TextDecoder().decode(bytes);
}
