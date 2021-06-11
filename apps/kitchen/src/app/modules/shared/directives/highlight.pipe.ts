import {Pipe, PipeTransform} from '@angular/core';

/**
 * Экранирует специальные символы
 * @param {string} str
 * @return {string}
 */
function escapeRegExp(str: string): string {
    return str.replace(/[-[]\/{}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * Фильтр для выделения текста
 * @example
 * `<span [innerHTML]="'Text to highlight' | highlightText: 'highlight': 'markClassName': true"></span>`
 */
@Pipe({
    name: 'yHighlight'
})
export class HighlightPipe implements PipeTransform {
    public transform(input: string, markStr: string, markClass: string = 'y-highlight', withSpaces: boolean = false): string {
        if (input && markStr) {
            // TODO refactor withSpaces case
            const safeString: string = withSpaces ? markStr.split('').map((i: string) => `${escapeRegExp(i)}\\s*`).join('') : escapeRegExp(markStr);
            const regex: RegExp = new RegExp(safeString, 'gi');
            return input.replace(regex, `<span class="${markClass}">$&</span>`);
        }

        return input;
    }
}
