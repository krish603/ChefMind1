"use server";

export async function getRecipe() {
    try {
        const response = await fetch("https://1a17-202-131-110-12.ngrok-free.app/recipe_recommendations", {
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
