import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
    const hashes = [];

    function random256BitsHexadecimal() {
		//todo: recordar pasar esto ordenadamente
		return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
	} 

    for (let i = 0; i < Number(params.id); i++) {
		hashes.push({
			hash: random256BitsHexadecimal()
		});
	}
    return {
        hashes: hashes,
        countdownDate: new Date().getTime() + (Number(params.id) * 60 * 60 * 1000),
    }
}