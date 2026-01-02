/**
 * Servicio de upload de imágenes
 * Cambiar la implementación de uploadImage para usar S3, Cloudinary, u otro servicio
 */

export interface UploadedImage {
  url: string; // URL o base64 de la imagen
  fileName: string;
  fileSize: number;
  dimensions: { width: number; height: number };
}

/**
 * Sube una imagen y retorna la información
 * TODO: Implementar upload a S3 o servicio de terceros
 *
 * Para S3:
 * - Instalar aws-sdk
 * - Configurar credenciales
 * - Subir file a bucket
 * - Retornar URL pública
 *
 * Para Cloudinary:
 * - Instalar cloudinary
 * - Configurar API keys
 * - Subir usando su API
 * - Retornar URL
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      // Obtener dimensiones de la imagen
      const img = new Image();
      img.onload = () => {
        resolve({
          url: base64, // Por ahora usar base64, cambiar a URL de S3/servicio
          fileName: file.name,
          fileSize: file.size,
          dimensions: { width: img.width, height: img.height },
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Ejemplo de implementación con S3 (comentado):
/*
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadImage(file: File): Promise<UploadedImage> {
  const timestamp = new Date().getTime();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `backgrounds/${timestamp}-${file.name}`,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        url: result.Location,
        fileName: file.name,
        fileSize: file.size,
        dimensions: { width: img.width, height: img.height },
      });
    };
    img.src = result.Location;
  });
}
*/
