import React from 'react';
import { Card } from 'antd';

export const CardTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
);

export const CardComponent = ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>{children}</div>
);
