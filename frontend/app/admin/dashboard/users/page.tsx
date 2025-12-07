'use client'
import SimpleUserTable from '@/components/admin/users/components/userTable';

export default function UsersPage() {
    return (
        <>
            <div>
                <h1 className="text-3xl font-bold mb-6">Quản Lý Người Dùng</h1>
                <SimpleUserTable />
            </div>
        </>
    )
}