'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/components/sidebar/sidebar.module.css';

const Sidebar = dynamic(() => import('@/components/sidebar/Sidebar'), {
    ssr: false,
    loading: () => <div>Loading...</div>
});

const ClientLayout = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <Sidebar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </>
    );
};

export default ClientLayout;