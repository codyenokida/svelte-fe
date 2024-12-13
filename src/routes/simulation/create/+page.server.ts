export async function load({ params, url }) {
	let num_scenarios = url.searchParams.get('num_scenarios');
	let scenario_type = url.searchParams.get('scenario_type');
	let start_date = url.searchParams.get('start_date');
	let end_date = url.searchParams.get('end_date');
	return { num_scenarios, scenario_type, start_date, end_date };
}
