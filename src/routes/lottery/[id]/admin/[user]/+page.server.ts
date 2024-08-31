import { chooseHashes, generateHashes, randomHex } from '$lib/crypto'
import { Monkey, MonkeyBox, MonkeySecrets } from '$lib/model'
import type { UUID } from 'crypto'
import type { PageServerLoad } from '../$types'
import { getPulse } from '$lib/random'

export const load: PageServerLoad = async ({ params }) => {
    const monkeyBox = MonkeyBox.get(params.id as UUID)
    const monkeys = Monkey.getAll(monkeyBox)
    const hashes = monkeys.map((monkey) => {
        return {
            id: monkey.value,
            hash: monkey.hash as string,
            salt: MonkeySecrets.get(monkey).salt
        }
    })

    const publishAt = monkeyBox.publishAt*1000
    let winners: { id?: string, salt?: string, hash: string }[] = []
    if (Date.now() >= publishAt) {
        const pulse = await getPulse(publishAt-60000)
        if (pulse) {
            winners = chooseHashes(
                pulse,
                hashes,
                monkeyBox.winners as number
            )
        }
    }
    return {
        id: params.id,
        name: monkeyBox.name,
        isAdmin: true,
        observer: params.user,
        hashes: hashes,
        winners: winners,
        winnersCount: monkeyBox.winners as number,
        publishAt: publishAt
    }
}