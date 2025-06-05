import axios from 'axios'
import { type TLogin, type TAuthResponse, type TRegister, type TRefreshTokenRequest } from "@/schemas/Auth"

export function getBackendUrl() {
    const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:8080'
    return backendUrl
}

// Authentication actions
export const loginAction = async (data: TLogin): Promise<TAuthResponse> => {
    const response = await axios.post(`${getBackendUrl()}/api/v2/auth/login`, data)
    return response.data
}

export const registerAction = async (data: TRegister): Promise<TLogin> => {
    const response = await axios.post(`${getBackendUrl()}/api/v2/auth/register`, data)
    return response.data
}

export const refreshTokenAction = async (data: TRefreshTokenRequest): Promise<TAuthResponse> => {
    const response = await axios.post(`${getBackendUrl()}/api/v2/auth/refresh-token`, data)
    return response.data
}