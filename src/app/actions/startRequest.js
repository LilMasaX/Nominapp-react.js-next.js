"use server";

export async function startRequest(token) {
    try {
        const response = await fetch('https://api.ilovepdf.com/v1/start/officepdf', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${JSON.stringify(errorData.error)}`);
        }

        const data = await response.json();
        return {
            task: data.task,
            server: data.server // Asegurar que se devuelve el server
        };

    } catch (e) {
        console.error("Error en startRequest:", e.message);
        throw e;
    }
}