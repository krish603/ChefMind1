import React from 'react';

const AnalysisHeader = ({ item }) => {
    return (
        <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-chefmind-teal mb-2 md:mb-3 capitalize">
                {item.replace(/-/g, ' ')}
            </h1>
            <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
                Optimize your inventory with our AI-powered demand prediction system that analyzes historical data to forecast future needs while reducing waste.
            </p>
        </div>
    );
};

export default AnalysisHeader;