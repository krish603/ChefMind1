"use client";
import React from 'react';

const PaginationControls = ({ 
    currentPage, 
    totalPages, 
    handlePageChange, 
    itemsPerPage,
    filteredIngredientsLength 
}) => {
    const renderPagination = () => {
        const pages = [];
        
        // Previous button
        pages.push(
            <button 
                key="prev" 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 rounded-lg transition-all duration-200 ${
                    currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-chefmind-teal hover:bg-chefmind-green/10 border border-chefmind-green/30 shadow-sm'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        );
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button 
                    key={1} 
                    onClick={() => handlePageChange(1)}
                    className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === 1 
                        ? 'bg-chefmind-green text-white shadow-md' 
                        : 'bg-white text-chefmind-teal hover:bg-chefmind-green/10 border border-chefmind-green/30 shadow-sm'
                    }`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="start-ellipsis" className="px-4 py-2 text-gray-500">...</span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button 
                    key={i} 
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded-lg transition-all duration-200 ${
                        currentPage === i 
                        ? 'bg-chefmind-green text-white shadow-md' 
                        : 'bg-white text-chefmind-teal hover:bg-chefmind-green/10 border border-chefmind-green/30 shadow-sm'
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="end-ellipsis" className="px-4 py-2 text-gray-500">...</span>
                );
            }
            pages.push(
                <button 
                    key={totalPages} 
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === totalPages 
                        ? 'bg-chefmind-green text-white shadow-md' 
                        : 'bg-white text-chefmind-teal hover:bg-chefmind-green/10 border border-chefmind-green/30 shadow-sm'
                    }`}
                >
                    {totalPages}
                </button>
            );
        }
        
        // Next button
        pages.push(
            <button 
                key="next" 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-chefmind-teal hover:bg-chefmind-green/10 border border-chefmind-green/30 shadow-sm'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        );
        
        return pages;
    };

    return (
        totalPages > 1 && (
            <div className="flex flex-col items-center mt-8 space-y-4">
                <div className="flex items-center space-x-2">
                    {renderPagination()}
                </div>
                <div className="text-sm text-chefmind-teal/80">
                    Page {currentPage} of {totalPages} • Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredIngredientsLength)} of {filteredIngredientsLength} ingredients
                </div>
            </div>
        )
    );
};

export default PaginationControls;