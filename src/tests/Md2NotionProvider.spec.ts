import {describe, expect, beforeEach, it} from '@jest/globals';
import { Md2NotionProvider } from '../Md2NotionProvider';

const markdown = `
hello _world_ 
*** 
## heading2
* [x] todo
`;

describe('Md2NotionProvider', () => {
  let provider: Md2NotionProvider;

  beforeEach(() => {
    provider = new Md2NotionProvider();
  });

  describe('toBlocks method', () => {
    it('should convert markdown to blocks correctly', async () => {
      const result = await provider.toBlocks(markdown);
      
      expect(result).toMatchSnapshot();
    });
  });

  describe('toRichText method', () => {
    it('should convert markdown to rich text correctly', async () => {
      const text = '**Hello _world_**';

      const result = await provider.toRichText(text);
      
      expect(result).toMatchSnapshot();
    });
  });
});