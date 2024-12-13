import { json } from '@sveltejs/kit';

const FAST_API_BASE_URL = import.meta.env.VITE_FAST_API_BASE_URL;

export async function GET() {
    const response = await fetch(`${FAST_API_BASE_URL}/simulations`);
    const result = await response.json();

    return json(result);
}
