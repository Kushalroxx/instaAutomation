import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'

export const metadata: Metadata = {
    title: 'InstaAuto - Instagram Automation Dashboard',
    description: 'AI-powered Instagram DM automation system with advanced analytics',
    keywords: ['Instagram', 'Automation', 'AI', 'DM', 'Marketing'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
