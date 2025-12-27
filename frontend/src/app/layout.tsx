import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'InstaAuto - AI Instagram Automation Agent',
    description: 'Automate your Instagram DMs, comments, and engagement with AI-powered agents',
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
