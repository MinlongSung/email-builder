import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";

const COMMON_FONTS = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Palatino Linotype",
];

const LETTER_SPACING_PRESETS = [
  { label: "Normal", value: "normal" },
  { label: "Tight (-0.05em)", value: "-0.05em" },
  { label: "Wide (0.05em)", value: "0.05em" },
  { label: "Wider (0.1em)", value: "0.1em" },
  { label: "Widest (0.2em)", value: "0.2em" },
];
export const FontStyleFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  if (!editor) return null;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <select
        onChange={(e) => {
          if (e.target.value) {
            editor.chain().focus().setFontSize(e.target.value).run();
          } else {
            editor.chain().focus().unsetFontSize().run();
          }
        }}
        title="Font Size"
      >
        <option value="">Size</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
        <option value="36px">36px</option>
      </select>

      {/* Font Family */}
      <select
        onChange={(e) => {
          if (e.target.value) {
            editor.chain().focus().setFontFamily(e.target.value).run();
          } else {
            editor.chain().focus().unsetFontFamily().run();
          }
        }}
        title="Font Family"
      >
        <option value="">Font</option>
        {COMMON_FONTS.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Letter spacing */}
      <select
        onChange={(e) => {
          if (e.target.value) {
            editor.chain().focus().setLetterSpacing(e.target.value).run();
          } else {
            editor.chain().focus().unsetLetterSpacing().run();
          }
        }}
        title="Letter spacing"
      >
        <option value="">Letter spacing</option>
        {LETTER_SPACING_PRESETS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Text Color */}
      <input
        type="color"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        title="Text Color"
      />
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
        title="Clear Text Color"
      >
        clear color
      </button>

      {/* Background Color */}
      <input
        type="color"
        onChange={(e) =>
          editor.chain().focus().setBackgroundColor(e.target.value).run()
        }
        title="Background Color"
      />
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetBackgroundColor().run()}
        title="Clear Background Color"
      >
        clear bg
      </button>
    </div>
  );
};
