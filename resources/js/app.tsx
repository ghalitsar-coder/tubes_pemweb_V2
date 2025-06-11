import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import "react-datepicker/dist/react-datepicker.css";
import { jwtManager } from "./utils/jwt";

// Add Cloudinary configuration
declare global {
    interface Window {
        CLOUDINARY_CLOUD_NAME: string;
    }
}

// Get Cloudinary cloud name from meta tag
const cloudinaryCloudName = document
    .querySelector('meta[name="cloudinary-cloud-name"]')
    ?.getAttribute("content");
if (cloudinaryCloudName) {
    window.CLOUDINARY_CLOUD_NAME = cloudinaryCloudName;
}

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        // Initialize JWT token if available
        const jwtData = (props.initialPage.props as any).jwt;
        if (jwtData?.token) {
            jwtManager.setToken(jwtData.token);
        }

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
