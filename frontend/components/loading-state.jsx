"use client";
import React from 'react';

const LoadingState = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-chefmind-green/30 border-t-chefmind-green rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg 
                        className="w-8 h-8 text-chefmind-green" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M13 10V3L4 14h7v7l9-11h-7z" 
                        />
                    </svg>
                </div>
            </div>
            <p className="text-center text-gray-600 text-lg font-medium">{message}</p>
            <p className="text-center text-gray-500 text-sm">Please wait while we fetch your data</p>
        </div>
    );
};

export default LoadingState;