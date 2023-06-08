import React from 'react'
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';
import { getCurrentUser } from '@/app/utils/getCurrentUser';

const Sidebar = async ({ children }: { children: React.ReactNode }) => {
    const currentUserPromise = getCurrentUser();
    const currentUser = await currentUserPromise;
    return (
        <div className='h-full'>
            <DesktopSidebar currentUser={currentUser!} />
            <MobileFooter />
            <main className='lg:pl-20 h-full'>
                {children}
            </main>
        </div>
    )
}

export default Sidebar;