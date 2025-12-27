// Stub auth configuration for development (authentication disabled)
// This allows API routes to compile without errors

export const authOptions = {
    providers: [],
    pages: {},
    callbacks: {},
    session: {
        strategy: 'jwt' as const,
    },
    secret: 'development-secret',
    debug: false,
};

// Mock session for development
export const mockSession = {
    user: {
        id: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@instaauto.com',
        image: null,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};
