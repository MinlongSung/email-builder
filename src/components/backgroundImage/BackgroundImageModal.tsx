import { ImageList, type ImageFile } from "./ImageList";

interface BackgroundImageModalProps {
  currentImageUrl?: string;
  onImageSelected: (imageFile: ImageFile) => void;
  onClose: () => void;
}

export const BackgroundImageModal = ({
  onImageSelected,
  onClose
}: BackgroundImageModalProps) => {
  const handleImageSelected = (imageFile: ImageFile) => {
    onImageSelected(imageFile);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Select Background Image</h3>
          <button
            onClick={onClose}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            X
          </button>
        </div>

        <div>
          <ImageList onImageSelected={handleImageSelected} />
        </div>
      </div>
    </div>
  );
};
