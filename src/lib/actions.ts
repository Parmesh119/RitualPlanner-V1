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
        localStorage.clear()
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

export async function checkAuthTypeByEmail(): Promise<string> {
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
        localStorage.clear()
        throw new Error('User is not authenticated')
    }
    const bearerToken = `Bearer ${token}`

    const response = await axios.post(
        `${getBackendUrl()}/api/v2/auth/get/email`,
        {},
        { headers: { Authorization: bearerToken } }
    )

    return response.data
}

export async function forgotPasswordAction(email: string): Promise<string> {
    const response = await axios.post(
        `${getBackendUrl()}/api/v2/auth/forgot-password`,
        { email: email },
        {},
    )

    return response.data
}

export async function verifyOTPAction(otp: string, email: string): Promise<boolean> {
    const response = await axios.post(
        `${getBackendUrl()}/api/v2/auth/verify-otp`,
        { otp: otp, email: email},
        {}
    )
    return response.data
}

export async function resetPasswordAction(email: string | null, password: string, confirmPassword: string): Promise<boolean> {
    const response = await axios.post(
        `${getBackendUrl()}/api/v2/auth/reset-password`,
        { email: email,  password: password, confirmPassword: confirmPassword},
        {}
    )
    return response.data
}