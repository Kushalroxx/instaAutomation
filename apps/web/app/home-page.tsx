'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardPage from './dashboard/page';

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/landing');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (status === 'authenticated') {
        return <DashboardPage />;
    }

    return null;
}
