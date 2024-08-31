import { chooseHashes, generateHashes, randomHex } from '$lib/crypto'
import { Monkey, MonkeyBox, MonkeySecrets } from '$lib/model'
import type { UUID } from 'crypto'
import type { PageServerLoad } from '../$types'
import { getPulse } from '$lib/random'

export const load: PageServerLoad = async ({ params }) => {
    const monkeyBox = MonkeyBox.get(params.id as UUID)
    const monkeys = Monkey.getAll(monkeyBox)
    let hashes;
    let ids = [];
    if(monkeyBox.privacy === 'Public'){
        hashes = monkeys.map((monkey) => {
            return {
                id: monkey.value,
                hash: monkey.hash as string,
                salt: MonkeySecrets.get(monkey).salt
            }
        })
    } else if(monkeyBox.privacy === 'SemiPrivate'){
        ids = monkeys.map((monkey) => {
            return {
                id: monkey.value,
            }
        })
        hashes = monkeys.map((monkey) => {
            return {
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
    let pulse;
    let fecha;
    if (Date.now() >= publishAt) {
        const faro = await getPulse(publishAt-60000);
        pulse = faro?.pulso;
        fecha = faro?.fecha;
        if (pulse) {
            winners = chooseHashes(
                pulse,
                hashes,
                monkeyBox.winners as number
            )
        }
    }

    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    shuffleArray(ids)
    shuffleArray(hashes)
    
    return {
        id: params.id,
        name: monkeyBox.name,
        isAdmin: true,
        observer: params.user,
        hashes: hashes,
        winners: winners.map((obj) => ({hash: obj.hash})),
        ids: ids.map((obj) => ({hash: obj.id})),
        winnersCount: monkeyBox.winners as number,
        publishAt: publishAt,
        faro: fecha,
    }
}