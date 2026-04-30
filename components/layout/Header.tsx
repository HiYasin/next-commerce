"use client";
import { User } from '@/types';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
    user: User | null;
}

const Header = ({ user }: HeaderProps) => {
    const pathName = usePathname();
    const navigation = [
        {
            name: "Home",
            href: "/",
            show: true
        },
        {
            name: "Dashboard",
            href: "/dashboard",
            show: true
        }
    ].filter(item => item.show);
    return (
        <div className='flex justify-between gap-4 p-4 bg-gray-800 text-white'>
            <div className='text-2xl font-bold'>
                <Link href="/">My App</Link>
            </div>
            <div className='flex gap-4'>
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`px-3 py-1 rounded-lg ${pathName === item.href ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
            <div>
                {
                    user ? (
                        <div className='flex items-center gap-4'>
                            <span>{user.lastName}</span>
                            <Button variant="outline" size="sm">Logout</Button>
                        </div>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <Link href="/login">
                                <Button variant="outline" size="sm">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Header;