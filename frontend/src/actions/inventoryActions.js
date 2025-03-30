"use server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function uploadPhotoVideo({ name, type, data }) {
   

    if (!data || !type) {
        console.error("uploadPhotoVideo received invalid data");
        return { error: "Invalid file data" };
    }

    console.log("Uploading File:", name);

    const apiUrl = type.startsWith("image")
        ? "https://5415-2401-4900-791d-8ea3-1841-df19-53da-cc75.ngrok-free.app/detect-food"
        : "https://5415-2401-4900-791d-8ea3-1841-df19-53da-cc75.ngrok-free.app/process-video";

    try {
        // const user = await currentUser();
        // if (!user) {
        //     throw new Error("User not authenticated");
        // }

        // Find the user in our database using Clerk ID
        // const dbUser = await prisma.user.findUnique({
        //     where: {
        //         clerkId: user.id
        //     }
        // });

        // if (!dbUser) {
        //     throw new Error("User not found in database");
        // }

        // Convert base64 to blob
        const base64Response = await fetch(data);
        const blob = await base64Response.blob();

        const formData = new FormData();
        formData.append("file", blob, name);

        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
           
        });

        if (!response.ok) {
            throw new Error(`FastAPI error: ${response.statusText}`);
        }

        const result = await response.json();

        const createdItems = await Promise.all(
            result.items.map(async (item) => {
                return await prisma.inventoryItem.create({
                    data: {
                        name: item.name,
                        quantity: item.quantity || 1,
                        description: item.description || null,
                        userId: "cuid1", // Associate with user directly
                        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                });
            })
        );

        return {success: true, items: createdItems};
    } catch (error) {
        console.error("Upload Failed:", error);
        return {success:false,  error: "Failed to process file" };
    }
}
