"use client";
import React, { useState } from 'react';
import IngredientCard from './IngredientCard';
import PaginationControls from './PaginationControls';
import SearchBar from './SearchBar';

const IngredientsInventory = ({ ingredients, searchTerm, setSearchTerm }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredIngredients = ingredients.filter(ingredient => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);

    const currentIngredients = filteredIngredients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleViewMore = (ingredient) => {
        console.log(`Viewing details for: ${ingredient}`);
        window.location.href = `/analysis/${ingredient.toLowerCase()}`;
    };

    return (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-chefmind-teal">Ingredients Inventory</h2>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            
            {filteredIngredients.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-chefmind-green/20">
                    <svg 
                        className="mx-auto h-12 w-12 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-700">No ingredients found</h3>
                    <p className="mt-1 text-gray-500">No ingredients match "{searchTerm}"</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {currentIngredients.map((ingredient, index) => (
                            <IngredientCard 
                                key={index} 
                                ingredient={ingredient} 
                                handleViewMore={handleViewMore} 
                            />
                        ))}
                    </div>
                    
                    <PaginationControls 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        handlePageChange={handlePageChange} 
                        itemsPerPage={itemsPerPage}
                        filteredIngredientsLength={filteredIngredients.length}
                    />
                </>
            )}
        </div>
    );
};

export default IngredientsInventory;