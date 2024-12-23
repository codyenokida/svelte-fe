const FAST_API_BASE_URL = import.meta.env.VITE_FAST_API_BASE_URL;

export async function load() {
	try {
		const response = await fetch(`${FAST_API_BASE_URL}/simulations`);
		const result = await response.json();

	return {
			simulations: result.simulations
		};
	} catch (error) {
		console.error(error);
		return {
			simulations: []
		};
	}
}
