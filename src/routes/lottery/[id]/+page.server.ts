import { chooseHashes } from '$lib/crypto';
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

    const winners = chooseHashes(
        "dfee0a3fcc04f7acd0e867af6fd43b48a9a9a5074782b20aa70f2fb947f60ec872d6ad6aa109f12d3f92b8fedf56ca394100bd82950ea441e8d9676b186af729",
        hashes.map((elem) => elem.hash),
        2
    ).map((hash) => ({hash}))

    return {
        hashes: hashes,
        winners: Math.random() < 0.5 ? winners : [],
        countdownDate: new Date().getTime() + (Number(params.id) * 60 * 60 * 1000),
    }
}