"use server";

export async function getRecipe() {
    try {
        const response = await fetch("https://60f5-2409-40c1-500f-dfe2-4d09-9cc9-9f41-a7db.ngrok-free.app/recipe_recommendations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });


        console.log("Response from server:", response); // Log the response object
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.log("Error fetching recipe:", error);
        return { success: false, data: null };
    }
}
