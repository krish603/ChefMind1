"use client"

import { useState } from "react"
import { AlertTriangle, Upload, AlertCircle } from "lucide-react"

export function AlertsSection({ spoiledItems, lowStockItems }) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState([])

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files)
        handleFiles(files)
    }

    const handleFiles = (files) => {
        const newFiles = files.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
        }))

        setUploadedFiles([...uploadedFiles, ...newFiles])
    }

    return (
        <div className="space-y-6">
            {/* Alerts Section */}
            <div className="bg-[#255653] rounded-lg shadow-md p-6 text-[#faf6eb]">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <AlertCircle className="mr-2" size={20} />
                    Alerts & Warnings
                </h2>

                {/* Spoiled Items */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Spoiled Items ({spoiledItems.length})</h3>
                    {spoiledItems.length === 0 ? (
                        <p className="text-sm opacity-80">No spoiled items.</p>
                    ) : (
                        <ul className="space-y-2">
                            {spoiledItems.map((item) => (
                                <li key={item.id} className="flex items-center">
                                    <AlertTriangle className="mr-2 text-red-300" size={16} />
                                    <span>
                                        {item.name} - {item.quantity} {item.unit || "units"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Low Stock Items */}
                <div>
                    <h3 className="font-semibold mb-2">Low Stock Items ({lowStockItems.length})</h3>
                    {lowStockItems.length === 0 ? (
                        <p className="text-sm opacity-80">No low stock items.</p>
                    ) : (
                        <ul className="space-y-2">
                            {lowStockItems.map((item) => (
                                <li key={item.id} className="flex items-center">
                                    <AlertTriangle className="mr-2 text-yellow-300" size={16} />
                                    <span>
                                        {item.name} - {item.quantity} {item.unit || "units"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#255653] mb-4">Upload Media</h2>

                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? "border-[#54aa52] bg-[#54aa52]/10" : "border-[#255653]/30"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Upload className="mx-auto text-[#255653] mb-2" size={24} />
                    <p className="text-[#255653] mb-2">Drag & drop photos or videos here</p>
                    <p className="text-sm text-[#255653]/70 mb-4">or click to browse files</p>
                    <input
                        type="file"
                        id="fileUpload"
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileInput}
                    />
                    <label
                        htmlFor="fileUpload"
                        className="bg-[#54aa52] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#54aa52]/90 transition-colors"
                    >
                        Browse Files
                    </label>
                </div>

                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#255653] mb-2">Uploaded Files</h3>
                        <ul className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className="flex items-center text-[#255653]">
                                    <span className="truncate">{file.name}</span>
                                    <span className="text-xs ml-2 text-[#255653]/70">({(file.size / 1024).toFixed(1)} KB)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

