import { useState, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

const UploadField = ({ image, onImageChange, onUploading }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    if (uploading) return;
    fileInputRef.current.click();
  };

  const validateAndUpload = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, JPEG, PNG or WebP).');
      return;
    }

    // Validate size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size exceeds the 5MB limit.');
      return;
    }

    // Clear previous errors
    setError('');

    // 1. Show preview immediately using local Object URL
    const previewUrl = URL.createObjectURL(file);
    onImageChange(previewUrl);

    // 2. Start upload process asynchronously in the background
    setUploading(true);
    if (onUploading) onUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result;
      
      try {
        const response = await apiClient.post('/playlists/upload', { image: base64Data }, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        });
        
        const { url } = response.data;
        onImageChange(url);
      } catch (err) {
        console.error('Upload failed:', err);
        setError(err.response?.data?.error || 'Upload failed. Please try again.');
        onImageChange(null);
      } finally {
        setUploading(false);
        if (onUploading) onUploading(false);
        setProgress(0);
      }
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (uploading) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (uploading) return;
    const file = e.dataTransfer.files[0];
    validateAndUpload(file);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div 
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-48 sm:h-64 bg-surface-container rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group overflow-hidden relative ${
          isDragActive ? 'border-primary bg-white/5' : 'border-white/20'
        } ${uploading ? 'cursor-not-allowed' : ''}`}
      >
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          className="hidden" 
        />

        {/* Immediate Preview */}
        {image ? (
          <>
            <img src={image} alt="Playlist Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-300 ${
              uploading ? 'opacity-100 z-10' : 'opacity-0 group-hover:opacity-100'
            }`}>
              {!uploading && (
                <>
                  <UploadCloud className="w-8 h-8 mb-2 text-white" />
                  <span className="text-sm font-medium text-white">Change Image</span>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <ImageIcon className="w-12 h-12 mb-3 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">Choose or Drag Image</span>
            <span className="text-xs mt-1 opacity-60">JPEG, PNG or WebP up to 5MB</span>
          </>
        )}

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
            <span className="text-white text-sm font-bold mb-2">Uploading Cover Image...</span>
            <div className="w-2/3 bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-white text-xs font-semibold mt-1.5">{progress}%</span>
          </div>
        )}
      </div>
      
      {/* Error alert */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-error font-mono mt-1 px-1">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadField;
