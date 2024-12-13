import { error, type Actions, redirect } from '@sveltejs/kit';

const FAST_API_BASE_URL = import.meta.env.VITE_FAST_API_BASE_URL;

export async function load({ params }) {
    const response = await fetch(`${FAST_API_BASE_URL}/simulations/${params.id}`);
    const result = await response.json();

    if (!result.simulation) {
        throw error(404, 'Simulation not found');
    }

    return {
        ...result.simulation
    };
}

export const actions = {
    deleteSimulation: async ({ url }) => {
        const pathname = url.pathname;
        const id = pathname.split('/').pop();

        const response = await fetch(`${FAST_API_BASE_URL}/simulations/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            throw redirect(303, '/');
        } else {
            return { success: false };
        }
    }
} satisfies Actions;
