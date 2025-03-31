"use server";

export async function demand(name){
try {
    
    const result =await fetch(`https://60f5-2409-40c1-500f-dfe2-4d09-9cc9-9f41-a7db.ngrok-free.app/api/patterns/${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!result.ok) {
        throw new Error(`Error: ${result.statusText}`);
    }
    const data = await result.json();
    // console.log("Data fetched successfully demand:", data);
return {success: true, data: data};
} catch (error) {
    console.error("Error fetching data:", error);
    return { error: error.message };
}
}

export async function forecast(name){
    try {
    
        const result =await fetch(`https://60f5-2409-40c1-500f-dfe2-4d09-9cc9-9f41-a7db.ngrok-free.app/api/forecast/${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!result.ok) {
            throw new Error(`Error: ${result.statusText}`);
        }
        const data = await result.json();
        // console.log("Data fetched successfully forecast:", data);
    return {success: true, data: data};
    } catch (error) {
        console.error("Error fetching data:", error);
        return { error: error.message };
    }
}

export async function waste(name){
    try {
    
        const result =await fetch(`https://60f5-2409-40c1-500f-dfe2-4d09-9cc9-9f41-a7db.ngrok-free.app/waste_prediction/${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!result.ok) {
            throw new Error(`Error: ${result.statusText}`);
        }
        const data = await result.json();
        // console.log("Data fetched successfully waste :", data);
    return {success: true, data: data};
    } catch (error) {
        console.error("Error fetching data:", error);
        return { error: error.message };
    }
}
export async function ingredients(){
    try {
    
        const result =await fetch(`https://60f5-2409-40c1-500f-dfe2-4d09-9cc9-9f41-a7db.ngrok-free.app/api/ingredients`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!result.ok) {
            throw new Error(`Error: ${result.statusText}`);
        }
        const data = await result.json();
        // console.log("Data fetched successfully ingredients :", data);
        return {success: true, data: data};
    } catch (error) {
        console.error("Error fetching data:", error);
        return { error: error.message };
    }
}