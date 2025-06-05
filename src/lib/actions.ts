import axios from 'axios'
import { type TLogin, type TAuthResponse, type TRegister, type TRefreshTokenRequest } from "@/schemas/Auth"
import { type User } from '@/schemas/User'
import { authService } from './auth'
import { toast } from 'sonner'

export function getBackendUrl() {
    const backendUrl = 'http://localhost:8080'
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

export async function getUserDetails(): Promise<User> {
    const token = await authService.getAccessToken()
    if (!token) {
        toast.error('User is not authenticated', {
            style: {
                background: "linear-gradient(90deg, #E53E3E, #C53030)",
                color: "white",
                fontWeight: "bolder",
                fontSize: "13px",
                letterSpacing: "1px",
            }
        })
        throw new Error('User is not authenticated')
    }

    const bearerToken = `Bearer ${token}`

    const response = await axios.post(
        `${getBackendUrl()}/api/v2/auth/get/user`,
        {},
        { headers: { Authorization: bearerToken } }
    )
    return response.data;
}