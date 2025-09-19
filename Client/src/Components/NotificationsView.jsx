import React from 'react';

const NotificationsView = () => (
    <div className="w-full p-6 rounded-xl shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Notifications</h3>
        </div>
        <div className="text-center py-8 text-white">
            <p>No notifications at this time.</p>
        </div>
    </div>
);

export default NotificationsView;
