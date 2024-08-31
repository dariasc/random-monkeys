import { generateHashes, randomHex } from '$lib/crypto'
import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async ({ params }) => {
    // @todo check params.user
    return {
        id: params.id,
        isAdmin: Math.random() < 0.5,
        observer: randomHex(16),
        hashes: await generateHashes(["1", "2", "3", "4", "5"])
    }
}