"use server"
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

        //  Limpiar el task de comillas extra si las tuviera
        const cleanTask = String(data.task).trim().replace(/^"|"$/g, '');

        return {
            task: cleanTask,
            server: data.server 
        };

    } catch (e) {
        console.error("Error en startRequest:", e.message);
        throw e;
    }
}
