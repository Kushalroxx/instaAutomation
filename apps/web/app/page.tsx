'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Bypass all authentication - go directly to dashboard
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading Dashboard...</p>
            </div>
        </div>
    );
}
