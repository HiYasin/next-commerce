import Header from '@/components/layout/Header';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header user={null}/>
            <main className='container mx-auto px-4 py-8'>
                {children}
            </main>
        </>
    );
};

export default MainLayout;