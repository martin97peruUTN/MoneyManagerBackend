import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import * as dotenv from 'dotenv'

import prisma from '../prisma'

dotenv.config()

/** Frontend origin — CORS, trustedOrigins, and (in prod) the public auth URL. */
const frontendOrigin = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
)

/**
 * URL browsers use for `/api/auth/*` (callbacks, cookie domain).
 * Dev: backend (`http://localhost:$PORT`). Prod: FRONTEND_ORIGIN when it is not
 * localhost (frontend proxies /api). Override with BETTER_AUTH_URL if needed.
 */
function resolveAuthPublicUrl(): string {
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL.replace(/\/$/, '')
    }
    const isLocalFrontend = /^https?:\/\/localhost(:\d+)?$/i.test(frontendOrigin)
    if (!isLocalFrontend) {
        return frontendOrigin
    }
    return `http://localhost:${process.env.PORT ?? 1234}`
}

const authPublicUrl = resolveAuthPublicUrl()

// Each *.onrender.com subdomain is a separate site (public suffix). Cross-origin
// fetch login needs SameSite=None; Secure. Localhost different ports stay lax.
function isCrossSiteAuth(): boolean {
    try {
        const frontendHost = new URL(frontendOrigin).hostname
        const authHost = new URL(authPublicUrl).hostname
        if (frontendHost === authHost) return false
        if (frontendHost === 'localhost' && authHost === 'localhost') return false
        return true
    } catch {
        return false
    }
}

const crossSiteAuth = isCrossSiteAuth()

// Only register a social provider when its credentials are present, so the
// server still boots before the OAuth apps are configured.
type SocialProviders = NonNullable<Parameters<typeof betterAuth>[0]['socialProviders']>
const socialProviders: SocialProviders = {}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }
}

export const auth = betterAuth({
    baseURL: authPublicUrl,
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    emailAndPassword: {
        enabled: true,
    },
    // Better Auth's "account" entity must use the `authAccount` Prisma accessor:
    // the finance `Account` model already owns `prisma.account`. (Prisma client
    // accessors come from the model name, not @@map.)
    account: {
        modelName: 'authAccount',
    },
    socialProviders,
    user: {
        additionalFields: {
            lastname: {
                type: 'string',
                required: false,
                input: true,
            },
        },
        deleteUser: {
            enabled: true,
        },
    },
    trustedOrigins: [frontendOrigin],
    ...(crossSiteAuth
        ? {
              advanced: {
                  useSecureCookies: true,
                  defaultCookieAttributes: {
                      sameSite: 'none',
                  },
              },
          }
        : {}),
    plugins: [admin()],
})

export type Session = typeof auth.$Infer.Session
