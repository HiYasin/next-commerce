import UserList from '@/components/UserList';
import { checkUserPermission, getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { User, UserRole } from '@/types';
import { redirect } from 'next/navigation';

const AdminPage = async () => {
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, UserRole.ADMIN)) {
        redirect('/unauthorized');
    }

    const [prismaUsers] = await Promise.all([
        await prisma.user.findMany({
            where: {
                role: UserRole.CUSTOMER
            }
        })
            
    ]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <UserList users={prismaUsers as User[]} />
        </div>
    );
};

export default AdminPage;