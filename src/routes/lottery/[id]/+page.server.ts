import { chooseHashes, generateHashes, randomHex } from '$lib/crypto'
import { Monkey, MonkeyBox, MonkeySecrets } from '$lib/model'
import type { UUID } from 'crypto'
import type { PageServerLoad } from '../$types'
import { getPulse } from '$lib/random'

export const load: PageServerLoad = async ({ params }) => {
    const monkeyBox = MonkeyBox.get(params.id as UUID)
    const monkeys = Monkey.getAll(monkeyBox)
    let hashes;
    if(monkeyBox.privacy === 'Public'){
        hashes = monkeys.map((monkey) => {
            return {
                id: monkey.value,
                hash: monkey.hash as string,
                salt: MonkeySecrets.get(monkey).salt
            }
        })
    } else if(monkeyBox.privacy === 'SemiPrivate'){
        hashes = monkeys.map((monkey) => {
            return {
                id: monkey.value,
                hash: monkey.hash as string,
            }
        })
    } else if(monkeyBox.privacy === 'Private'){
        hashes = monkeys.map((monkey) => {
            return {
                hash: monkey.hash as string,
            }
        })
    }

    const publishAt = monkeyBox.publishAt*1000
    let winners: { id?: string, salt?: string, hash: string }[] = []
    if (Date.now() >= publishAt) {
        const pulse = await getPulse(monkeyBox.publishAt * 1000)
        if (pulse) {
            winners = chooseHashes(
                pulse,
                hashes.map((elem) => elem.hash),
                1
            ).map((hash) => ({hash}))
        }
    }
    return {
        id: params.id,
        name: "$nombre",
        isAdmin: Math.random() < 0.5,
        observer: randomHex(16),
        hashes: hashes,
        winners: winners,
        publishAt: monkeyBox.publishAt*1000
    }
}