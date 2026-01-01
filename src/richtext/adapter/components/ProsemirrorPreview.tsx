import { useRef } from "react";
import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import styles from "./ProsemirrorPreview.module.css";

interface ProsemirrorPreviewProps {
  content: string;
}

export const ProsemirrorPreview = ({ content }: ProsemirrorPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { setSelectionStart, setSelectionEnd } = useProsemirror();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!previewRef.current) return;
    setSelectionStart(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!previewRef.current) return;
    setSelectionEnd(e.clientX, e.clientY);
  };

  return (
    <div
      ref={previewRef}
      className={`${styles.editorPreview}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
