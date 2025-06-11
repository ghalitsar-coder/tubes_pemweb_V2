import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Note: The JWT Manager already handles request/response interceptors globally,
// so we don't need to duplicate that logic here. The JWT Manager will automatically
// add the correct headers (Authorization: Bearer for /api/* routes).

export default api;
