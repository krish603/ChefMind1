"use client"

import { Search } from "lucide-react"

export function SearchBar({ onSearch }) {
    return (
        <div className="mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-[#255653]" />
                </div>
                <input
                    type="text"
                    className="bg-white border border-[#255653]/20 text-[#255653] text-sm rounded-lg focus:ring-[#54aa52] focus:border-[#54aa52] block w-full pl-10 p-3"
                    placeholder="Search inventory items..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    )
}

