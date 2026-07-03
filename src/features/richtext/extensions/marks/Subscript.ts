import { Subscript as Original } from '@tiptap/extension-subscript';

export const Subscript = Original.extend({
  excludes: 'superscript',
});
