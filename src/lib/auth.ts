import axios from 'axios'
import { getBackendUrl } from './actions'
import { type TUserJwtInformation } from '@/schemas/Auth'
import { refreshTokenAction } from '@/lib/actions'

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'app-accessToken',
    REFRESH_TOKEN: 'app-refreshToken',
    SUB: 'app-sub',
    USER_ID: 'app-userId',
    EMAIL: 'app-email',
    EXP: 'app-exp',
    IAT: 'app-iat',
}

export const api = axios.create({
    baseURL: getBackendUrl(),
})

export const authService = {

    _refreshingToken: false,

    _refreshQueue: [] as Array<{ resolve: (value: string) => void; reject: (reason?: any) => void }>,

    _refreshThreshold: 0.85,

    async isLoggedIn(): Promise<boolean> {
        try {
            const token = await this.getAccessToken()
            return !!token
        } catch (error) {
            console.error('Error checking if logged in:', error)
            return false
        }
    },

    decodeToken(token: string): TUserJwtInformation | null {
        if (!token) return null

        try {
            return JSON.parse(atob(token.split('.')[1]))
        } catch (error) {
            console.error('Error decoding token:', error)
            return null
        }
    },

    isTokenExpired(token: string, useThreshold = false): boolean {
        if (!token) return true

        try {
            const payload = this.decodeToken(token)
            if (!payload || !payload.exp) return true

            const expiry = payload.exp * 1000 // Convert to milliseconds

            if (useThreshold && payload.iat) {
                // Refresh when token is X% through its lifetime
                const tokenLifetime = expiry - payload.iat * 1000
                const refreshTime = payload.iat * 1000 + tokenLifetime * this._refreshThreshold
                return Date.now() > refreshTime
            }

            return Date.now() > expiry
        } catch {
            return true
        }
    },

    async getAccessToken(): Promise<string | null> {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

        // If no token or token is completely expired (not just at threshold)
        if (!accessToken || this.isTokenExpired(accessToken, false)) {
            // Try to refresh the token
            try {
                return await this.refreshToken()
            } catch (error) {
                console.error('Error getting access token:', error)
                // If refresh fails, clear tokens and return null
                this.clearTokens()
                return null
            }
        }

        // If token exists but is approaching expiration, refresh in background
        if (this.isTokenExpired(accessToken, true)) {
            // Don't await - let it refresh in background
            this.refreshToken().catch((error) => {
                console.error('Background token refresh failed:', error)
            })
        }

        return accessToken
    },

    async setTokens(tokens: { accessToken: string, refreshToken: string }): Promise<void> {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)

        try {
            const payload = this.decodeToken(tokens.accessToken) as TUserJwtInformation
            if (!payload) throw new Error('Failed to decode token')


            localStorage.setItem(STORAGE_KEYS.USER_ID, payload.userId)
            localStorage.setItem(STORAGE_KEYS.SUB, payload.sub)
            localStorage.setItem(STORAGE_KEYS.EXP, payload.exp.toString())
            if (payload.iat) {
                localStorage.setItem(STORAGE_KEYS.IAT, payload.iat.toString())
            }
        } catch (error) {
            console.error('Error decoding token:', error)
        }
    },

    async storeEmail(email: string) {
        localStorage.setItem(STORAGE_KEYS.EMAIL, email)
    },

    async getEmail(): Promise<string> {
        return localStorage.getItem(STORAGE_KEYS.EMAIL) || ''
    },

    async refreshToken(): Promise<string> {

        if (this._refreshingToken) {
            return new Promise((resolve, reject) => {
                this._refreshQueue.push({ resolve, reject })
            })
        }

        this._refreshingToken = true

        try {
            const refreshTokenValue = this.getRefreshToken()

            if (!refreshTokenValue) {
                throw new Error('No refresh token available')
            }

            const newTokens = await refreshTokenAction({ refreshToken: refreshTokenValue })


            await this.setTokens(newTokens)


            this._refreshQueue.forEach(({ resolve }) => resolve(newTokens.accessToken))

            return newTokens.accessToken
        } catch (error) {

            this._refreshQueue.forEach(({ reject }) => reject(error))

            console.error('Token refresh failed:', error)
            this.clearTokens()
            throw error
        } finally {
            this._refreshQueue = []
            this._refreshingToken = false
        }
    },

    clearTokens(): void {
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key)
        })
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    }
}