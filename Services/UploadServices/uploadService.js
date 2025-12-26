const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

const uploadImageToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      console.error('❌ Upload failed: No file buffer provided');
      reject(new Error('No file buffer provided'));
      return;
    }

    console.log('📤 Starting Cloudinary upload:', {
      fileName,
      bufferSize: fileBuffer.length,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mentor-mate/profiles',
        resource_type: 'auto',
        public_id: `${Date.now()}-${fileName.replace(/\s+/g, '-')}`,
        timeout: 60000,
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary callback error:', {
            code: error.http_code,
            message: error.message,
            fullError: error,
          });
          reject(new Error(`Image upload failed: ${error.message}`));
        } else {
          console.log('📡 Cloudinary response received:', {
            hasResult: !!result,
            hasSecureUrl: !!result?.secure_url,
            secureUrl: result?.secure_url,
            fullResult: result,
          });
          
          if (result && result.secure_url) {
            console.log('✅ Upload successful:', result.secure_url);
            resolve(result.secure_url);
          } else {
            console.error('❌ No secure URL in result:', result);
            reject(new Error('No secure URL returned from Cloudinary'));
          }
        }
      }
    );

    uploadStream.on('error', (error) => {
      console.error('❌ Upload stream error:', error);
      reject(new Error(`Upload stream error: ${error.message}`));
    });

    uploadStream.on('finish', () => {
      console.log('📤 Stream finished');
    });

    try {
      console.log('🔄 Creating read stream and piping to Cloudinary...');
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    } catch (error) {
      console.error('❌ Streamifier error:', error);
      reject(new Error(`Failed to stream file: ${error.message}`));
    }
  });
};

module.exports = {
  uploadImageToCloudinary,
};
