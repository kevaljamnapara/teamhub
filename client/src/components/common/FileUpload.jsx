import { useState, useCallback } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "../../utils";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function FileUpload({ onUploadSuccess, accept = "image/*", maxSizeMB = 5 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    // Check type
    if (accept === "image/*" && !selectedFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return false;
    }

    // Check size
    const sizeMB = selectedFile.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      handleFileSelection(droppedFile);
    }
  }, [accept, maxSizeMB]);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile) => {
    setFile(selectedFile);
    
    // Create preview
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(10);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      
      toast.success("File uploaded successfully");
      if (onUploadSuccess) {
        onUploadSuccess(response.data.data.url);
      }
      clearFile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative",
            isDragging
              ? "border-primary-500 bg-primary-500/10"
              : "border-[hsl(var(--border))] hover:border-primary-500/50 hover:bg-[hsl(var(--accent))]"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-2">
              <UploadCloud className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
            </div>
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">
              Drag & drop a file here, or click to select
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Supported files: {accept === "image/*" ? "Images" : "Any file"} up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-[hsl(var(--border))] rounded-xl p-4 bg-[hsl(var(--card))]">
          <div className="flex items-center gap-4">
            {/* Preview Area */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : file.type.startsWith("image/") ? (
                <ImageIcon className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
              ) : (
                <FileText className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                {file.name}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              
              {/* Progress Bar */}
              {isUploading && (
                <div className="mt-2 w-full bg-[hsl(var(--muted))] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            {!isUploading && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
                >
                  Upload
                </button>
              </div>
            )}
            {isUploading && (
              <div className="flex items-center gap-2 pr-2">
                <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                <span className="text-xs font-medium text-primary-500">{progress}%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
