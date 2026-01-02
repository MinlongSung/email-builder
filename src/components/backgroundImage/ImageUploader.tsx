import { useRef } from "react";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  multiple?: boolean;
}

export const ImageUploader = ({ onImagesSelected, multiple = true }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      onImagesSelected(files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImagesSelected(files);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '4px',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <p>Drag & drop images or click to select</p>
    </div>
  );
};
