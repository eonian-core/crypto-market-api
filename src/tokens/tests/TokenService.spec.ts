import { describe, it, expect } from '@jest/globals';
import { parseTwitterLink } from '../TokensService';

describe('parseTwitterLink', () => {
    it('should return undefined if no url is provided', () => {
        expect(parseTwitterLink()).toBeUndefined();
    });

    it('should return the correct handle and url when a valid twitter url is provided', () => {
        const url = 'https://twitter.com/example?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor';
        const expectedOutput = {
            url: 'https://twitter.com/example?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
            handle: 'example'
        };
        expect(parseTwitterLink(url)).toEqual(expectedOutput);
    });

    it('should return the correct handle and url when a twitter url without query parameters is provided', () => {
        const url = 'https://twitter.com/example';
        const expectedOutput = {
            url: 'https://twitter.com/example',
            handle: 'example'
        };
        expect(parseTwitterLink(url)).toEqual(expectedOutput);
    });
});