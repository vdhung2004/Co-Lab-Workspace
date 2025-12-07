'use client' 

import { BrowserRouter } from 'react-router-dom';
import Sidebar from './sidebar'; 

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <BrowserRouter> 
            <div className="flex min-h-screen">
                
                <div className="w-64 flex-shrink-0 bg-gray-900 text-white"> 
                    <Sidebar />
                </div>
                
                <main className="flex-1 p-6 overflow-auto bg-gray-50"> 
                    {children}
                </main>
            </div>
        </BrowserRouter>
    );
}