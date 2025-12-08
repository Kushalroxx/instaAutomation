import type { Metadata } from 'next'
import './globals.css'

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
            <body>{children}</body>
        </html>
    )
}
