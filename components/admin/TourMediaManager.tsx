'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Star, 
  Check, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

interface TourMediaManagerProps {
  coverImage?: string;
  gallery?: string[];
  onChange: (data: { coverImage: string; gallery: string[] }) => void;
}

export default function TourMediaManager({
  coverImage = '',
  gallery = [],
  onChange,
}: TourMediaManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    let count = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        formData.append('files', file);
        count++;
      }
    }

    if (count === 0) {
      setUploadError('Please select valid image files (JPG, PNG, WEBP).');
      setIsUploading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.urls || data.urls.length === 0) {
        throw new Error(data.error || 'Failed to upload and optimize images');
      }

      const newUrls: string[] = data.urls;
      let newCover = coverImage;
      let newGallery = [...gallery];

      if (!newCover && newUrls.length > 0) {
        newCover = newUrls[0];
        newGallery = [...newGallery, ...newUrls.slice(1)];
      } else {
        newGallery = [...newGallery, ...newUrls];
      }

      onChange({
        coverImage: newCover,
        gallery: newGallery,
      });
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSetCover = (imgUrl: string) => {
    if (imgUrl === coverImage) return;

    const remainingGallery = gallery.filter((item) => item !== imgUrl);
    const newGallery = coverImage ? [coverImage, ...remainingGallery] : remainingGallery;

    onChange({
      coverImage: imgUrl,
      gallery: newGallery,
    });
  };

  const handleRemove = (imgUrl: string, isCover: boolean) => {
    if (isCover) {
      if (gallery.length > 0) {
        const [nextCover, ...restGallery] = gallery;
        onChange({
          coverImage: nextCover,
          gallery: restGallery,
        });
      } else {
        onChange({
          coverImage: '',
          gallery: [],
        });
      }
    } else {
      const newGallery = gallery.filter((item) => item !== imgUrl);
      onChange({
        coverImage,
        gallery: newGallery,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const allImages = [
    ...(coverImage ? [{ url: coverImage, isCover: true }] : []),
    ...gallery.map((url) => ({ url, isCover: false })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#C2410C]" />
          <span>Route Photos & Media Manager</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium">
          {coverImage ? '1 Cover' : 'No Cover'} &bull; {gallery.length} Gallery Photos
        </span>
      </div>

      {/* DROPZONE AREA */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#C2410C] bg-[#C2410C]/10 scale-[1.005]'
            : 'border-white/15 bg-[#08101A]/60 hover:border-white/30 hover:bg-[#08101A]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFilesUpload(e.target.files);
          }}
        />

        {isUploading ? (
          <div className="py-3 flex flex-col items-center justify-center gap-2 text-slate-300">
            <Loader2 className="w-7 h-7 animate-spin text-[#C2410C]" />
            <span className="text-xs font-bold text-white">
              Compressing & optimizing images (WebP)...
            </span>
            <span className="text-[11px] text-slate-400">
              Resizing up to 1920x1280, stripping metadata, applying WebP compression.
            </span>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center justify-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C2410C] mb-1">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white">
              Drop route photos here, or <span className="text-[#C2410C] underline">browse files</span>
            </div>
            <div className="text-[11px] text-slate-400">
              PNG, JPG, WEBP &bull; Automatic high-speed WebP conversion
            </div>
          </div>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* IMAGE PREVIEWS GRID */}
      {allImages.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
            {allImages.map((img, idx) => (
              <div
                key={`${img.url}-${idx}`}
                className={`relative group rounded-xl overflow-hidden border aspect-video bg-black/40 transition-all ${
                  img.isCover
                    ? 'border-[#C2410C] shadow-lg shadow-orange-950/40 ring-1 ring-[#C2410C]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <img
                  src={img.url}
                  alt={`Tour preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* BADGE OR ACTION OVERLAY */}
                {img.isCover ? (
                  <div className="absolute top-1.5 left-1.5 bg-[#C2410C] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Cover Photo</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetCover(img.url);
                    }}
                    className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 bg-black/75 hover:bg-[#C2410C] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md transition-all cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Set as Cover</span>
                  </button>
                )}

                {/* DELETE BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(img.url, img.isCover);
                  }}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 bg-black/75 hover:bg-rose-600 text-white p-1 rounded-md shadow-md transition-all cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
