"use client";

import { Upload, ImageIcon, Camera } from "lucide-react";
import { useDropzone } from "@/hooks/use-dropzone";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "@/lib/constants";

interface ImageDropzoneProps {
  onImageUpload: (base64: string) => void;
  onError: (error: string) => void;
}

export function ImageDropzone({ onImageUpload, onError }: ImageDropzoneProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      onError("Please upload a JPEG or PNG image");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      onError("File size must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onImageUpload(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    onError,
  });

  return (
    <Card
      className={cn(
        "glass-panel rounded-[1.5rem] border-2 border-dashed transition-all duration-300",
        isDragActive
          ? "border-primary/60 bg-primary/10 shadow-[0_20px_50px_rgba(59,130,246,0.18)]"
          : "border-white/20 hover:border-white/35 hover:bg-white/12"
      )}
    >
      <CardContent className="p-0">
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-6 p-8">
          {/* Hidden camera input */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCameraCapture}
          />

          {isDragActive ? (
            <div
              {...getRootProps()}
              className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 text-center"
            >
              <input {...getInputProps()} />
              <Upload className="text-primary h-12 w-12" />
              <p className="font-semibold">Drop your image here</p>
            </div>
          ) : (
            <>
              <ImageIcon className="text-muted-foreground h-10 w-10" />
              <div className="text-center">
                <p className="font-semibold">Upload your room photo</p>
                <p className="text-muted-foreground text-sm">
                  JPEG / PNG · max 5 MB
                </p>
              </div>

              {/* Two buttons */}
              <div className="flex w-full max-w-[220px] flex-col gap-2">
                {/* Browse files */}
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    <Upload className="h-4 w-4" />
                    Browse files
                  </button>
                </div>

                {/* Take photo — opens camera on mobile */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <Camera className="h-4 w-4" />
                  Take a photo
                </button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
