import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";

const LINE_HEIGHT_PRESETS = [
  { value: "1", label: "1.0 (Compacto)" },
  { value: "1.15", label: "1.15 (Ajustado)" },
  { value: "1.2", label: "1.2 (Normal)" },
  { value: "1.4", label: "1.4 (Cómodo)" },
  { value: "1.5", label: "1.5 (Lectura)" },
  { value: "1.75", label: "1.75 (Amplio)" },
  { value: "2", label: "2.0 (Muy amplio)" },
];

export const LineHeightFormats = () => {
  const { activeEditor: editor } = useProsemirror();

  if (!editor) return null;

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <select
        onChange={(e) => {
          if (e.target.value) {
            editor.chain().focus().setLineHeight(e.target.value).run();
          } else {
            editor.chain().focus().unsetLineHeight().run();
          }
        }}
        title="Line Height"
      >
        {LINE_HEIGHT_PRESETS.map((preset) => (
          <option key={preset.label} value={preset.value || ""}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
};
