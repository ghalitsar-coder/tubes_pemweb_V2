import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: Date | string) {
    return new Date(date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}

export const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    // Check if it's ISO format (contains 'T')
    if (dateString.includes("T")) {
        // ISO format: "2025-06-02T00:00:00.000000Z"
        const date = new Date(dateString);
        // Create a new date in local timezone to avoid timezone shifts
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } else {
        // YYYY-MM-DD format: "2025-05-24"
        const [year, month, day] = dateString.split("-").map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        return new Date(year, month - 1, day); // month is 0-indexed
    }
};

export const getFullCloudinaryUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const cloudName = window.CLOUDINARY_CLOUD_NAME || "dtpflpunp"; // fallback to your cloud name
    return `https://res.cloudinary.com/${cloudName}/image/upload/${path}`;
};

// Function to transform Cloudinary URL for thumbnails
export const getThumbnailUrl = (url: string) => {
    const fullUrl = getFullCloudinaryUrl(url);
    if (!fullUrl.includes("cloudinary.com")) return fullUrl;
    return fullUrl.replace("/upload/", "/upload/c_thumb,w_200,h_200,g_face/");
};

// Function to transform Cloudinary URL for preview
export const getPreviewUrl = (url: string) => {
    const fullUrl = getFullCloudinaryUrl(url);
    if (!fullUrl.includes("cloudinary.com")) return fullUrl;
    return fullUrl.replace("/upload/", "/upload/q_auto,f_auto/");
};
