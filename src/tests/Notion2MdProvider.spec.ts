import {describe, expect, beforeEach, it} from '@jest/globals';
import { Notion2MdProvider } from '../Notion2MdProvider';

describe('Notion2MdProvider', () => {
  let provider: Notion2MdProvider;

  beforeEach(() => {
    provider = new Notion2MdProvider();
  });

  describe('toMd method', () => {
    it('should convert blocks to markdown correctly', async () => {
      const result = await provider.toMd(blocks as any);
      
      expect(result).toMatchSnapshot();
    });
  });

});

const blocks = [
  {
    "object": "block",
    "paragraph": {
      "rich_text": [
        {
          "annotations": {
            "bold": false,
            "code": false,
            "color": "default",
            "italic": false,
            "strikethrough": false,
            "underline": false,
          },
          "text": {
            "content": "hello ",
            "link": undefined,
          },
          "plain_text": "hello ",
          "type": "text",
        },
        {
          "annotations": {
            "bold": false,
            "code": false,
            "color": "default",
            "italic": true,
            "strikethrough": false,
            "underline": false,
          },
          "text": {
            "content": "world",
            "link": undefined,
          },
          "plain_text": "world",
          "type": "text",
        },
      ],
    },
    "type": "paragraph",
  },
  {
    "heading_2": {
      "rich_text": [
        {
          "annotations": {
            "bold": false,
            "code": false,
            "color": "default",
            "italic": false,
            "strikethrough": false,
            "underline": false,
          },
          "plain_text": "heading2",
          "text": {
            "content": "heading2",
            "link": undefined,
          },
          "type": "text",
        },
      ],
    },
    "object": "block",
    "type": "heading_2",
  },
  {
    "object": "block",
    "to_do": {
      "checked": true,
      "children": undefined,
      "rich_text": [
        {
          "annotations": {
            "bold": false,
            "code": false,
            "color": "default",
            "italic": false,
            "strikethrough": false,
            "underline": false,
          },
          "text": {
            "content": "todo",
            "link": undefined,
          },
          "plain_text": "todo",
          "type": "text",
        },
      ],
    },
    "type": "to_do",
  },
];