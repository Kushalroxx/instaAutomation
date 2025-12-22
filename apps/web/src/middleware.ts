export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/automations/:path*',
        '/analytics/:path*',
        '/settings/:path*',
    ]
}
