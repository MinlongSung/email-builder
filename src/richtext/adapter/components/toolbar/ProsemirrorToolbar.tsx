// import styles from "./ProsemirrorToolbar.module.css";
// import { useProsemirrorEditor } from "../hooks/useProsemirrorEditor";
// import { useEditorState } from "../hooks/useEditorState";
// import { EmojiPicker } from "./EmojiPicker";
// import { TableMenuPortal } from "./TableMenuPortal";
// import { tableCoordinatesPluginKey } from "@/richText/core/extensions/nodes/table/plugins/tableCoordinates";

// /**
//  * Fuentes comunes para el selector de font-family
//  */
// export const COMMON_FONTS = [
//   "Arial",
//   "Verdana",
//   "Helvetica",
//   "Tahoma",
//   "Trebuchet MS",
//   "Times New Roman",
//   "Georgia",
//   "Garamond",
//   "Courier New",
//   "Brush Script MT",
//   "Comic Sans MS",
//   "Impact",
//   "Lucida Sans Unicode",
//   "Palatino Linotype",
// ];

// /**
//  * Presets de letter-spacing
//  */
// export const LETTER_SPACING_PRESETS = [
//   { label: "Normal", value: "normal" },
//   { label: "Tight (-0.05em)", value: "-0.05em" },
//   { label: "Wide (0.05em)", value: "0.05em" },
//   { label: "Wider (0.1em)", value: "0.1em" },
//   { label: "Widest (0.2em)", value: "0.2em" },
// ];

// const LINE_HEIGHT_PRESETS = [
//   { value: "1", label: "1.0 (Compacto)" },
//   { value: "1.15", label: "1.15 (Ajustado)" },
//   { value: "1.2", label: "1.2 (Normal)" },
//   { value: "1.4", label: "1.4 (Cómodo)" },
//   { value: "1.5", label: "1.5 (Lectura)" },
//   { value: "1.75", label: "1.75 (Amplio)" },
//   { value: "2", label: "2.0 (Muy amplio)" },
// ];

// export const ProsemirrorToolbar = () => {
//   const { activeEditor: editor } = useProsemirrorEditor();

//   const editorState = useEditorState({
//     editor,
//     selector: (editor) => {
//       // Get table rect from plugin state
//       const tableCoordinatesState = tableCoordinatesPluginKey.getState(
//         editor.state
//       );
//       const tableRect = tableCoordinatesState?.rect || null;

//       return {
//         tableRect,
//         /* ===== Marks ===== */
//         marks: {
//           bold: editor.isActive("bold"),
//           italic: editor.isActive("italic"),
//           strike: editor.isActive("strike"),
//           underline: editor.isActive("underline"),
//           subscript: editor.isActive("subscript"),
//           superscript: editor.isActive("superscript"),
//         },
//         isLink: editor.isActive("link"),

//         /* ===== Blocks ===== */
//         isParagraph: editor.isActive("paragraph"),
//         heading: {
//           h1: editor.isActive("heading", { level: 1 }),
//           h2: editor.isActive("heading", { level: 2 }),
//           h3: editor.isActive("heading", { level: 3 }),
//           h4: editor.isActive("heading", { level: 4 }),
//           h5: editor.isActive("heading", { level: 5 }),
//           h6: editor.isActive("heading", { level: 6 }),
//         },

//         /* ===== Lists ===== */
//         bulletList: {
//           disc: editor.isActive("bulletList", { listStyleType: "disc" }),
//           circle: editor.isActive("bulletList", { listStyleType: "circle" }),
//           square: editor.isActive("bulletList", { listStyleType: "square" }),
//         },

//         orderedList: {
//           decimal: editor.isActive("orderedList", {
//             listStyleType: "decimal",
//           }),
//           lowerAlpha: editor.isActive("orderedList", {
//             listStyleType: "lower-alpha",
//           }),
//           upperAlpha: editor.isActive("orderedList", {
//             listStyleType: "upper-alpha",
//           }),
//           lowerRoman: editor.isActive("orderedList", {
//             listStyleType: "lower-roman",
//           }),
//           upperRoman: editor.isActive("orderedList", {
//             listStyleType: "upper-roman",
//           }),
//         },

//         /* ===== Alignment ===== */
//         textAlign: {
//           left: editor.isActive({ textAlign: "left" }),
//           center: editor.isActive({ textAlign: "center" }),
//           right: editor.isActive({ textAlign: "right" }),
//           justify: editor.isActive({ textAlign: "justify" }),
//         },

//         /* ===== Direction ===== */
//         direction: {
//           ltr: editor.isActive({ dir: "ltr" }),
//           rtl: editor.isActive({ dir: "rtl" }),
//         },

//         canOutdent: editor.can().setIndentation(-15)
//       };
//     },
//   });

//   if (!editor) return null;

//   return (
//     <div className={styles.toolbar}>
//       {/* Formato de texto básico */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={editorState?.marks.bold ? styles.active : ""}
//           title="Bold (Ctrl+B)"
//         >
//           <strong>B</strong>
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={editorState?.marks.italic ? styles.active : ""}
//           title="Italic (Ctrl+I)"
//         >
//           <em>I</em>
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={editorState?.marks.underline ? styles.active : ""}
//           title="Underline (Ctrl+U)"
//         >
//           <u>U</u>
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={editorState?.marks.strike ? styles.active : ""}
//           title="Strikethrough"
//         >
//           <s>S</s>
//         </button>
//       </div>

//       {/* Superscript / Subscript */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.chain().focus().toggleSuperscript().run()}
//           className={editorState?.marks.superscript ? styles.active : ""}
//           title="Superscript"
//         >
//           X<sup>2</sup>
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleSubscript().run()}
//           className={editorState?.marks.subscript ? styles.active : ""}
//           title="Subscript"
//         >
//           X<sub>2</sub>
//         </button>
//       </div>

//       {/* Headings y Paragraph */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.chain().focus().setParagraph().run()}
//           className={editorState?.isParagraph ? styles.active : ""}
//           title="Paragraph"
//         >
//           P
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 1 }).run()
//           }
//           className={editorState?.heading.h1 ? styles.active : ""}
//           title="Heading 1"
//         >
//           H1
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run()
//           }
//           className={editorState?.heading.h2 ? styles.active : ""}
//           title="Heading 2"
//         >
//           H2
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 3 }).run()
//           }
//           className={editorState?.heading.h3 ? styles.active : ""}
//           title="Heading 3"
//         >
//           H3
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 4 }).run()
//           }
//           className={editorState?.heading.h4 ? styles.active : ""}
//           title="Heading 4"
//         >
//           H4
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 5 }).run()
//           }
//           className={editorState?.heading.h5 ? styles.active : ""}
//           title="Heading 5"
//         >
//           H5
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 6 }).run()
//           }
//           className={editorState?.heading.h6 ? styles.active : ""}
//           title="Heading 6"
//         >
//           H6
//         </button>
//       </div>

//       {/* Bullet Lists */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList("disc").run()}
//           className={editorState?.bulletList.disc ? styles.active : ""}
//           title="Bullet List - Disc"
//         >
//           ●
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleBulletList("circle").run()
//           }
//           className={editorState?.bulletList.circle ? styles.active : ""}
//           title="Bullet List - Circle"
//         >
//           ○
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleBulletList("square").run()
//           }
//           className={editorState?.bulletList.square ? styles.active : ""}
//           title="Bullet List - Square"
//         >
//           ■
//         </button>
//       </div>

//       {/* Ordered Lists */}
//       <div className={styles.group}>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleOrderedList("decimal").run()
//           }
//           className={editorState?.orderedList.decimal ? styles.active : ""}
//           title="Ordered List - 1, 2, 3"
//         >
//           1.
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleOrderedList("lower-alpha").run()
//           }
//           className={editorState?.orderedList.lowerAlpha ? styles.active : ""}
//           title="Ordered List - a, b, c"
//         >
//           a.
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleOrderedList("upper-alpha").run()
//           }
//           className={editorState?.orderedList.upperAlpha ? styles.active : ""}
//           title="Ordered List - A, B, C"
//         >
//           A.
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleOrderedList("lower-roman").run()
//           }
//           className={editorState?.orderedList.lowerRoman ? styles.active : ""}
//           title="Ordered List - i, ii, iii"
//         >
//           i.
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleOrderedList("upper-roman").run()
//           }
//           className={editorState?.orderedList.upperRoman ? styles.active : ""}
//           title="Ordered List - I, II, III"
//         >
//           I.
//         </button>
//       </div>

//       {/* Text Align */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.chain().focus().toggleTextAlign("left").run()}
//           className={editorState?.textAlign.left ? styles.active : ""}
//           title="Align Left"
//         >
//           ⇤
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleTextAlign("center").run()}
//           className={editorState?.textAlign.center ? styles.active : ""}
//           title="Align Center"
//         >
//           ⇥
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleTextAlign("right").run()}
//           className={editorState?.textAlign.right ? styles.active : ""}
//           title="Align Right"
//         >
//           ⇥
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleTextAlign("justify").run()
//           }
//           className={editorState?.textAlign.justify ? styles.active : ""}
//           title="Justify"
//         >
//           ≡
//         </button>
//       </div>

//       {/* Text Direction */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.commands.setTextDirection("ltr")}
//           className={editorState?.direction.ltr ? styles.active : ""}
//           title="Left to Right"
//         >
//           LTR
//         </button>
//         <button
//           onClick={() => editor.commands.setTextDirection("rtl")}
//           className={editorState?.direction.rtl ? styles.active : ""}
//           title="Right to Left"
//         >
//           RTL
//         </button>
//       </div>

//       {/* Indent */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.chain().focus().setIndentation(30).run()}
//           title="Increase Indent (Cmd+])"
//         >
//           →
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setIndentation(-15).run()}
//           title="Decrease Indent (Cmd+[)"
//           disabled={!editorState?.canOutdent}
//         >
//           ←
//         </button>
//       </div>

//       {/* Text Style - Font Size */}
//       <div className={styles.group}>
//         <select
//           onChange={(e) => {
//             if (e.target.value) {
//               editor.chain().focus().setFontSize(e.target.value).run();
//             } else {
//               editor.chain().focus().unsetFontSize().run();
//             }
//           }}
//           className={styles.select}
//           title="Font Size"
//         >
//           <option value="">Size</option>
//           <option value="12px">12px</option>
//           <option value="14px">14px</option>
//           <option value="16px">16px</option>
//           <option value="18px">18px</option>
//           <option value="20px">20px</option>
//           <option value="24px">24px</option>
//           <option value="28px">28px</option>
//           <option value="32px">32px</option>
//           <option value="36px">36px</option>
//         </select>

//         {/* Font Family */}
//         <select
//           onChange={(e) => {
//             if (e.target.value) {
//               editor.chain().focus().setFontFamily(e.target.value).run();
//             } else {
//               editor.chain().focus().unsetFontFamily().run();
//             }
//           }}
//           className={styles.select}
//           title="Font Family"
//         >
//           <option value="">Font</option>
//           {COMMON_FONTS.map((font) => (
//             <option key={font} value={font}>
//               {font}
//             </option>
//           ))}
//         </select>

//         {/* Letter spacing */}
//         <select
//           onChange={(e) => {
//             if (e.target.value) {
//               editor.chain().focus().setLetterSpacing(e.target.value).run();
//             } else {
//               editor.chain().focus().unsetLetterSpacing().run();
//             }
//           }}
//           className={styles.select}
//           title="Letter spacing"
//         >
//           <option value="">Letter spacing</option>
//           {LETTER_SPACING_PRESETS.map(({ label, value }) => (
//             <option key={value} value={value}>
//               {label}
//             </option>
//           ))}
//         </select>

//         {/* Text Color */}
//         <input
//           type="color"
//           onChange={(e) =>
//             editor.chain().focus().setColor(e.target.value).run()
//           }
//           title="Text Color"
//           className={styles.colorPicker}
//         />
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().unsetColor().run()}
//           title="Text Color"
//           className={styles.colorPicker}
//         >
//           text clear color
//         </button>

//         {/* Background Color */}
//         <input
//           type="color"
//           onChange={(e) =>
//             editor.chain().focus().setBackgroundColor(e.target.value).run()
//           }
//           title="Background Color"
//           className={styles.colorPicker}
//         />
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().unsetBackgroundColor().run()}
//           title="Text Color"
//           className={styles.colorPicker}
//         >
//           bg clear color
//         </button>
//       </div>

//       {/* Line Height */}
//       <div className={styles.group}>
//         <select
//           onChange={(e) => {
//             if (e.target.value) {
//               editor.chain().focus().setLineHeight(e.target.value).run();
//             } else {
//               editor.chain().focus().unsetLineHeight().run();
//             }
//           }}
//           className={styles.select}
//           title="Line Height"
//         >
//           {LINE_HEIGHT_PRESETS.map((preset) => (
//             <option key={preset.label} value={preset.value || ""}>
//               {preset.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Link */}
//       <div className={styles.group}>
//         <button
//           onClick={() => {
//             const url = window.prompt("Enter URL:");
//             if (url) {
//               editor.chain().focus().setLink({ href: url }).run();
//             }
//           }}
//           className={editorState?.isLink ? styles.active : ""}
//           title="Insert Link"
//         >
//           🔗
//         </button>
//         {editorState?.isLink && (
//           <button
//             onClick={() => editor.chain().focus().unsetLink().run()}
//             title="Remove Link"
//           >
//             ⛓️‍💥
//           </button>
//         )}
//       </div>

//       {/* Table */}
//       <div className={styles.group}>
//         <button
//           onClick={() =>
//             editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
//           }
//           title="Insert Table"
//         >
//           ⊞
//         </button>
//       </div>

//       {/* Emojis & Special Characters */}
//       <div className={styles.group}>
//         <EmojiPicker editor={editor} />
//       </div>

//       {/* Clear Formatting */}
//       <div className={styles.group}>
//         <button
//           onClick={() => editor.chain().focus().unsetAllMarks().run()}
//           className={styles.clearButton}
//           title="Clear Formatting"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Table Menu Portal - Shows when table is active */}
//       {editorState?.tableRect && (
//         <TableMenuPortal editor={editor} tableRect={editorState.tableRect} />
//       )}
//     </div>
//   );
// };
