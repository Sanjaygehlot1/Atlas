import React from 'react';
import { BookOpenCheck } from 'lucide-react';

const AppLogo = ({ collapsed }) => (
    <div className={`flex items-center p-4 transition-all duration-300 ${collapsed ? 'justify-center' : 'justify-start gap-3'}`}>
        <div className="p-2 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpenCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className={`text-xl font-bold text-white pt-2 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Plannex
        </h1>
    </div>
);

export default AppLogo;