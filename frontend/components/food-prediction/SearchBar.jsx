"use client";
import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                    className="h-5 w-5 text-chefmind-teal" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-chefmind-green/30 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-chefmind-green/50 focus:border-chefmind-green/50 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
            />
        </div>
    );
};

export default SearchBar;