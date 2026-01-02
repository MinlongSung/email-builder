import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { uploadImage } from "./imageUploadService";

export interface ImageFile {
  url: string; // base64 o URL
  fileName: string;
  fileSize: number;
  dimensions?: { width: number; height: number };
}

interface ImageListProps {
  onImageSelected: (imageFile: ImageFile) => void;
}

export const ImageList = ({ onImageSelected }: ImageListProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImagesAdded = async (files: File[]) => {
    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);

      const newImages: ImageFile[] = uploadedImages.map(img => ({
        url: img.url,
        fileName: img.fileName,
        fileSize: img.fileSize,
        dimensions: img.dimensions,
      }));

      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (imageFile: ImageFile, index: number) => {
    setSelectedIndex(index);
    onImageSelected(imageFile);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <ImageUploader onImagesSelected={handleImagesAdded} />

      {uploading && <div style={{ padding: '8px', textAlign: 'center' }}>Uploading images...</div>}

      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(img, index)}
              style={{
                width: '80px',
                height: '80px',
                border: selectedIndex === index ? '2px solid blue' : '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <img
                src={img.url}
                alt={img.fileName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
