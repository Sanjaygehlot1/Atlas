import React from 'react';

const Header = ({ title }) => (
    <header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{title === "Welcome back, Professor!" ? "Here's what's happening today." : "Manage your class activities."}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative"><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" /></div>
            <button className="relative p-2 rounded-full hover:bg-gray-100"><span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span></button>
        </div>
    </header>
);

export default Header;
