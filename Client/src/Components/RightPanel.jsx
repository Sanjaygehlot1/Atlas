import React from 'react';
import { Card } from 'antd';

const RightPanel = () => (
    <aside className="w-80 bg-white shadow-sm p-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
        <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
                <p>Statistics will be loaded from the database.</p>
            </div>
        </div>
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
            <div className="text-center py-8 text-gray-500">
                <p>No notifications at this time.</p>
            </div>
        </div>
    </aside>
);

export default RightPanel;
