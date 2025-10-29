/**
 * Auth API service
 * Handles all authentication-related API operations
 * @module services/auth-api
 */

import { rawAxios } from "./http-client";
import { API_BASE_URL } from "../config/env";

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{access_token: string}>}
 */
export async function login(username, password) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const response = await rawAxios.post(`${API_BASE_URL}/auth/token`, formData);
  return response.data;
}

/**
 * Register user
 * @param {Object} userData
 * @param {string} userData.username
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<any>}
 */
export function register(userData) {
  return rawAxios
    .post(`${API_BASE_URL}/auth/register`, userData)
    .then((r) => r.data);
}

/**
 * Get current user info
 * @returns {Promise<any>}
 */
export function me() {
  return rawAxios
    .get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((r) => r.data);
}

/**
 * Logout user
 * @returns {Promise<any>}
 */
export function logout() {
  return rawAxios
    .post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
    .then((r) => r.data);
}
