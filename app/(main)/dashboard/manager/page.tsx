import UserList from '@/components/UserList';
import { checkUserPermission, getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { User, UserRole } from '@/types';
import { redirect } from 'next/navigation';

const ManagerPage = async () => {
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, UserRole.MANAGER)) {
        redirect('/unauthorized');
    }

    const [prismaUsers] = await Promise.all([
        await prisma.user.findMany({
            where: {
                role: UserRole.MANAGER
            }
        })
            
    ]);

    return (
        <div>
            <h1>Manager Dashboard</h1>
            <UserList users={prismaUsers as User[]} />
        </div>
    );
};

export default ManagerPage;