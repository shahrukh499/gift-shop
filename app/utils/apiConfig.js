import { createHeaders, APIAuthError } from "./apiAuth";

/**
 * API Endpoints configuration
 * @type {Object.<string, string>}
 */
const ENDPOINTS = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    FORGOTPASSWORD: '/auth/forgot-password', 
    FORGOTPASSWORDCONFIRM: '/auth/forgot-password/confirm', 
    ALLPRODUCTS: '/products',
    ADDTOCART: '/cart',
    INCREMENTCARTITEM: '/cart/increment',
    DECREMENTCARTITEM: '/cart/decrement',
    PRODUCTDETAILS: '/products',
    APPLYCOUPONCODE: '/coupons/apply-coupon',
    UPLOADPRODUCTIMG: '/products/upload-image',
    ADDPRODUCT: '/products',
};

/**
 * HTTP Methods configuration
 * @type {Object.<string, string>}
 */
const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

/**
 * API Response Status Codes
 * @type {Object.<string, number>}
 */
const STATUS_CODES = {
    SUCCESS: 0,
    ERROR: 1,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
};

/**
 * Creates API request options with proper configuration
 * @param {string} method - HTTP method
 * @param {Object} [body] - Request body for POST/PUT requests
 * @returns {Object} Request options for fetch
 */
const createRequestOptions = (method, body = null) => {
    const options = {
        method,
        headers: createHeaders(), // Use createHeaders to get dynamic headers
        redirect: "follow"
    };

    if (body && (method === HTTP_METHODS.POST || method === HTTP_METHODS.PUT)) {
        options.body = JSON.stringify(body);
    }

    return options;
};

/**
 * Main API configuration object
 */
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    ENDPOINTS,
    HTTP_METHODS,
    STATUS_CODES,
    createRequestOptions
};

/**
 * Helper function to construct full API URL
 * @param {string} endpoint - API endpoint
 * @param {Object} [params] - URL parameters
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint, params = {}) => {
    const baseUrl = API_CONFIG.BASE_URL;
    const url = new URL(`${baseUrl}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
        }
    });
    
    return url.toString();
};

export { APIAuthError };