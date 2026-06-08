import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import * as dotenv from 'dotenv'

import prisma from '../prisma'

dotenv.config()

const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000'
const backendOrigin = process.env.BETTER_AUTH_URL ?? 'http://localhost:1234'

// Each *.onrender.com subdomain is a separate site (public suffix). Cross-origin
// fetch login needs SameSite=None; Secure. Localhost different ports stay lax.
function isCrossSiteAuth(): boolean {
    try {
        const frontendHost = new URL(frontendOrigin).hostname
        const backendHost = new URL(backendOrigin).hostname
        if (frontendHost === backendHost) return false
        if (frontendHost === 'localhost' && backendHost === 'localhost') return false
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
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:1234',
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
