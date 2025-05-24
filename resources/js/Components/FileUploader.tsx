import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // in bytes
    acceptedFileTypes?: { [key: string]: string[] };
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onFilesChange,
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB
    acceptedFileTypes = {
        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
        "application/pdf": [".pdf"],
        "text/*": [".txt", ".md"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
    },
}) => {
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = [...uploadedFiles, ...acceptedFiles].slice(
                0,
                maxFiles
            );
            setUploadedFiles(newFiles);
            onFilesChange(newFiles);
        },
        [uploadedFiles, maxFiles, onFilesChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        maxSize,
        multiple: true,
    });

    const removeFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        onFilesChange(newFiles);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            <span>Upload files</span>
                            <input {...getInputProps()} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, PDF up to {formatFileSize(maxSize)}
                    </p>
                </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Uploaded Files ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                            >
                                <div className="flex items-center space-x-3">
                                    <File className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
