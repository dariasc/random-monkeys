import { chooseHashes, generateHashes, randomHex } from '$lib/crypto'
import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async ({ params }) => {
    // @todo check params.user
    const hashes = await generateHashes(["1", "2", "3", "4", "5"])
    const winners = chooseHashes(
        "dfee0a3fcc04f7acd0e867af6fd43b48a9a9a5074782b20aa70f2fb947f60ec872d6ad6aa109f12d3f92b8fedf56ca394100bd82950ea441e8d9676b186af729",
        hashes.map((elem) => elem.hash),
        2
    ).map((hash) => ({hash}))
    return {
        id: params.id,
        isAdmin: Math.random() < 0.5,
        observer: randomHex(16),
        hashes: hashes,
        winners: Math.random() < 0.5 ? winners : []
    }
}