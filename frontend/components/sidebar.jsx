'use client'
import Link from 'next/link';
import React from 'react'
import { usePathname } from 'next/navigation';
import { Soup,UtensilsCrossed,HandCoins  } from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [activePage, setActivePage] = React.useState(pathname); // Track active page

    // Navigation items to avoid repetition
    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        },
        {
            title: 'Inventory Management',
            href: '/inventory',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        },
        {
            title: 'Food Prediction',
            href: '/food-prediction',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        },
        {
            title: 'Recipe Recommendation',
            href: '/recipe-recommendation',
            icon: <Soup className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" />
        },
        {
            title: 'Cost Optimization',
            href: '/cost-optimization',
            icon: <HandCoins className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" />

        },
        {
            title: 'Custom Dish Creator',
            href: '/custom-dish-creator',
            icon: <UtensilsCrossed className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" />

        }
    ];

    return (
        <>

            {/* Mobile Menu Button with animation */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-chefmind-teal text-chefmind-beige hover:bg-chefmind-beige/20 active:scale-95 transition-all duration-200 shadow-md"
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Sidebar with reduced width */}
            <div className={`fixed left-0 top-0 h-full bg-chefmind-teal text-chefmind-beige flex flex-col shadow-2xl transition-all duration-300 z-40
            ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}`}>
                {/* Logo/Header with enhanced styling */}
                <div className="p-4 border-b border-chefmind-beige/20 flex items-center space-x-2">
                    {/* <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg> */}
                    <h1 className="text-xl font-bold text-[#FFD700] tracking-wide">ChefMind</h1>
                </div>

                {/* User profile section */}
                <div className="p-3 border-b border-chefmind-beige/20">
                    <div className="flex items-center p-1">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-chefmind-teal font-bold text-sm mr-2">
                            U
                        </div>
                        <div>
                            <p className="font-medium text-sm">User Name</p>
                            {/* <p className="text-xs text-chefmind-beige/70">Restaurant Manager</p> */}
                        </div>
                    </div>
                </div>

                {/* Navigation Links with active states */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <div className="mb-3 px-2 text-xs uppercase text-chefmind-beige/50 font-semibold tracking-wider">
                        Main Menu
                    </div>
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center p-2 rounded-lg transition-all duration-200 text-sm
                                        ${activePage === item.href
                                            ? 'bg-chefmind-beige/20 text-[#FFD700] font-medium shadow-sm'
                                            : 'hover:bg-chefmind-beige/10'}`}
                                    onClick={() => {
                                        setActivePage(item.href);
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
                                >
                                    <svg className={`w-4 h-4 mr-2 ${activePage === item.href ? 'text-[#FFD700]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        {item.icon}
                                    </svg>
                                    {item.title}
                                    {activePage === item.href && (
                                        <div className="ml-auto w-1 h-4 bg-[#FFD700] rounded-full"></div>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button with enhanced styling */}
                <div className="p-3 border-t border-chefmind-beige/20">
                    <button className="w-full flex items-center justify-center p-2 rounded-lg bg-chefmind-beige/10 hover:bg-chefmind-beige/20 active:scale-98 transition-all duration-200 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Improved overlay with blur effect */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-30 transition-all duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    )
}

export default Sidebar