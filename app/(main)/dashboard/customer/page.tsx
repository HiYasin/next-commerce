import UserList from '@/components/UserList';
import { checkUserPermission, getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { User, UserRole } from '@/types';
import { redirect } from 'next/navigation';

const CustomerPage = async () => {
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, UserRole.CUSTOMER)) {
        redirect('/unauthorized');
    }

    const [prismaUsers] = await Promise.all([
        await prisma.user.findMany({
            where: {
                id: user.id
            }
        })
            
    ]);

    return (
        <div>
            <h1>Customer Dashboard</h1>
            <UserList users={prismaUsers as User[]} />
        </div>
    );
};

export default CustomerPage;