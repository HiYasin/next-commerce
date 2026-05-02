
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';

const DashboardPage = async() => {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    switch (user.role) {
        case UserRole.ADMIN:
            redirect('/dashboard/admin');
            break;
        case UserRole.CUSTOMER:
            redirect('/dashboard/customer');
            break;
        case UserRole.MANAGER:
            redirect('/dashboard/manager');
            break;
        default:
            redirect('/login');
    }
};

export default DashboardPage;