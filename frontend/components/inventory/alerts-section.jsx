"use client"

import { useState } from "react"
import { AlertTriangle, AlertCircle } from "lucide-react"
import { uploadPhotoVideo } from "@/src/actions/inventoryActions"

export function AlertsSection({ spoiledItems, lowStockItems }) {
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [uploadResponse, setUploadResponse] = useState(null)

    const handleFileInput = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Only update UI with basic file info
        setUploadedFiles([{
            name: file.name,
            size: file.size,
            type: file.type
        }]);

        try {
            // Convert file to base64 string
            const reader = new FileReader();
            const base64Data = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Send only necessary data to server action
            const response = await uploadPhotoVideo({
                name: file.name,
                type: file.type,
                data: base64Data
            });

            setUploadResponse(response);
        } catch (error) {
            console.error("Upload Error:", error);
            setUploadResponse({ error: "Failed to upload file" });
        }
    };

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

                <div className="border-2 border-dashed border-[#255653]/30 rounded-lg p-6 text-center">
                    <p className="text-[#255653] mb-2">Click below to upload a photo or video</p>
                    <p className="text-sm text-[#255653]/70 mb-4">Only one file can be uploaded at a time</p>

                    <input
                        type="file"
                        id="fileUpload"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileInput}
                    />
                    <label
                        htmlFor="fileUpload"
                        className="bg-[#54aa52] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#54aa52]/90 transition-colors"
                    >
                        Browse File
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

                {/* Display API response */}
                {uploadResponse && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#255653] mb-2">Server Response</h3>
                        <pre className="text-sm bg-gray-100 p-3 rounded-lg text-[#255653]">
                            {JSON.stringify(uploadResponse, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
