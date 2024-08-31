import { chooseHashes, generateHashes } from '$lib/crypto';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
    const hashes = await generateHashes(["1", "2", "3", "4", "5"])
    console.log(hashes)
    const winners = chooseHashes(
        "dfee0a3fcc04f7acd0e867af6fd43b48a9a9a5074782b20aa70f2fb947f60ec872d6ad6aa109f12d3f92b8fedf56ca394100bd82950ea441e8d9676b186af729",
        hashes.map((elem) => elem.hash),
        2
    ).map((hash) => ({hash}))

    return {
        hashes: hashes.map((obj) => ({hash: obj.hash})),
        winners: winners,
        countdownDate: new Date().getTime() + (Number(params.id) * 60 * 60 * 1000),
    }
}