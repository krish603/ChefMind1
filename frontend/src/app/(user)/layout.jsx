import React from "react";
import Sidebar from "@/components/sidebar";

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen">
            {/* Sidebar - Fixed on the left */}
            <div className="w-64 fixed h-full bg-gray-800 text-white">
                <Sidebar />
            </div>

            {/* Main Content - Takes up remaining space */}
            <div className="flex-1 ml-64 p-4 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;
