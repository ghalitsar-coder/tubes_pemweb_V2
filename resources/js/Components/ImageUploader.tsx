import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Upload,
    X,
    Image as ImageIcon,
    Eye,
    Download,
    File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ImageUploaderProps {
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // in bytes
    showPreview?: boolean;
    acceptAllFiles?: boolean; // When true, accepts all file types, not just images
    existingImages?: Array<{
        name: string;
        url: string;
        size?: number;
    }>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    onFilesChange,
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024, // 5MB
    showPreview = true,
    acceptAllFiles = false,
    existingImages = [],
}) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // Filter files based on acceptAllFiles prop
            const validFiles = acceptAllFiles
                ? acceptedFiles // Accept all file types
                : acceptedFiles.filter((file) =>
                      file.type.startsWith("image/")
                  ); // Only images

            const newFiles = [...uploadedFiles, ...validFiles].slice(
                0,
                maxFiles
            );
            setUploadedFiles(newFiles);
            onFilesChange(newFiles);

            // Create preview URLs for new files (only for images)
            const newUrls = { ...fileUrls };
            validFiles.forEach((file) => {
                if (!newUrls[file.name] && file.type.startsWith("image/")) {
                    newUrls[file.name] = URL.createObjectURL(file);
                }
            });
            setFileUrls(newUrls);
        },
        [uploadedFiles, maxFiles, onFilesChange, fileUrls, acceptAllFiles]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptAllFiles
            ? undefined // Accept all file types
            : {
                  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
              },
        maxSize,
        multiple: true,
    });

    const removeFile = (index: number) => {
        const fileToRemove = uploadedFiles[index];
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        onFilesChange(newFiles);

        // Clean up URL for removed file
        if (fileUrls[fileToRemove.name]) {
            URL.revokeObjectURL(fileUrls[fileToRemove.name]);
            const newUrls = { ...fileUrls };
            delete newUrls[fileToRemove.name];
            setFileUrls(newUrls);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const openPreview = (url: string) => {
        setPreviewImage(url);
    };

    return (
        <div className="mt-1">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                    isDragActive
                        ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-300 hover:border-gray-400 dark:border-gray-600"
                }`}
            >
                <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />{" "}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            <span>
                                {acceptAllFiles
                                    ? "Upload files"
                                    : "Upload images"}
                            </span>
                            <input {...getInputProps()} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {acceptAllFiles
                            ? `All file types up to ${formatFileSize(maxSize)}`
                            : `PNG, JPG, GIF up to ${formatFileSize(maxSize)}`}
                    </p>
                </div>
            </div>

            {/* Existing Images (for edit mode) */}
            {existingImages.length > 0 && (
                <div className="mt-4 space-y-2">
                    {" "}
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {acceptAllFiles
                            ? `Existing Files (${existingImages.length})`
                            : `Existing Images (${existingImages.length})`}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {existingImages.map((image, index) => (
                            <div
                                key={index}
                                className="relative group bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden"
                            >
                                <div className="aspect-square">
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => openPreview(image.url)}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                openPreview(image.url)
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                window.open(image.url, "_blank")
                                            }
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {image.name}
                                    </p>
                                    {image.size && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatFileSize(image.size)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    {" "}
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {acceptAllFiles
                            ? `New Files (${uploadedFiles.length})`
                            : `New Images (${uploadedFiles.length})`}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="relative group bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden"
                            >
                                {" "}
                                <div className="aspect-square">
                                    {file.type.startsWith("image/") &&
                                    fileUrls[file.name] ? (
                                        <img
                                            src={fileUrls[file.name]}
                                            alt={file.name}
                                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() =>
                                                openPreview(fileUrls[file.name])
                                            }
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                                            <div className="text-center">
                                                <File className="h-8 w-8 mx-auto mb-1 text-gray-400" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {file.type.split("/")[0]}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>{" "}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        {file.type.startsWith("image/") &&
                                            fileUrls[file.name] && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        openPreview(
                                                            fileUrls[file.name]
                                                        )
                                                    }
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            <Dialog
                open={!!previewImage}
                onOpenChange={() => setPreviewImage(null)}
            >
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Image Preview</DialogTitle>
                    </DialogHeader>
                    {previewImage && (
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://via.placeholder.com/400x300?text=Image+Failed+to+Load";
                                }}
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => window.open(previewImage!, "_blank")}
                        >
                            Open in New Tab
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPreviewImage(null)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImageUploader;
