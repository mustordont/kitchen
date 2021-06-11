import {join} from 'path';

export function serverPath(filename: string, folder: string = ''): string {
    return join(process.cwd(), folder, filename);
}
