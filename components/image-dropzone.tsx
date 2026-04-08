"use client";

import { Upload, ImageIcon } from "lucide-react";
import { useDropzone } from "@/hooks/use-dropzone";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ImageDropzoneProps {
  onImageUpload: (base64: string) => void;
  onError: (error: string) => void;
}

export function ImageDropzone({ onImageUpload, onError }: ImageDropzoneProps) {
  const handleDrop = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    onError,
  });

  return (
    <Card
      className={cn(
        "cursor-pointer rounded-[1.5rem] border-2 border-dashed glass-panel transition-all duration-300",
        isDragActive
          ? "border-primary/60 bg-primary/10 shadow-[0_20px_50px_rgba(59,130,246,0.18)]"
          : "border-white/20 hover:border-white/35 hover:bg-white/12"
      )}
    >
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className="flex aspect-[4/3] flex-col items-center justify-center p-8"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4 text-center">
            {isDragActive ? (
              <>
                <Upload className="text-primary h-12 w-12" />
                <p className="font-semibold">Drop your image here</p>
              </>
            ) : (
              <>
                <ImageIcon className="text-muted-foreground h-12 w-12" />
                <div>
                  <p className="font-semibold">Drag and drop your room photo</p>
                  <p className="text-muted-foreground text-sm">
                    or click to browse (JPEG/PNG, max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
