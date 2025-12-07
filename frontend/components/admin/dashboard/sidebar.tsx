'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook để lấy đường dẫn hiện tại

// Cấu hình menu của bạn
const menuItems = [
    { name: 'Overview', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/dashboard/users' },
    { name: 'Amenities', path: '/admin/dashboard/amenities' },
    { name: 'Bookings', path: '/admin/dashboard/bookings' },
    { name: 'Workspaces', path: '/admin/dashboard/workspaces' },
    { name: 'Payments', path: '/admin/dashboard/payments' },
];

const Sidebar = () => {
    const pathname = usePathname();

    // Style cơ bản
    const baseLinkClass = "flex items-center p-3 text-sm font-medium rounded-lg transition duration-150 ease-in-out";
    // Style khi Active
    const activeLinkClass = "bg-blue-700 text-white shadow-md";
    // Style khi Inactive
    const inactiveLinkClass = "text-gray-300 hover:bg-gray-700";

    return (
        <div className="w-64 flex-shrink-0 bg-gray-900 text-white min-h-screen p-4">
            <h1 className="text-xl font-bold mb-6 border-b border-gray-700 pb-3">Menu</h1>
            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path; 

                    return (
                        <Link key={item.name} href={item.path}>
                            <p 
                                className={`${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                            >
                                {item.name}
                            </p>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;