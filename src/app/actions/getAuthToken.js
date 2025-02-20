"use server"
import fetch from 'node-fetch'

const PUBLIC_KEY = 'project_public_01fab4e7e4d2c22eaf6bbafabd23eb45_p6LeG531c486ad23cc8496e7483eab71caf0d';
const SECRET_KEY = 'secret_key_ecf031f60be58ccb016efb48cc1cb3ae_I73iX37a4a16dc5611986527c4d738e22dbab';
export async function getAuthToken() {
    const response = await fetch('https://api.ilovepdf.com/v1/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_key: PUBLIC_KEY }) // ⚠️ ¿Requiere también secret_key?
    });
    const data = await response.json();
    return data.token; // ✅ Retorna solo el token, no todo el objeto
}