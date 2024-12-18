import {connection} from "next/server";

export async function fetchData(): Promise<any> {
    // We don't want to render this page statically
    await connection();
    
    const apiUrl = process.env.FINGERTIPS_API_URL;
    
    const response = await fetch(`${apiUrl}/weatherforecast`, {
        // Cache the data for 60s
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    
    return await response.json();
}