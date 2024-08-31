import {
  createHash,
  randomBytes
} from 'crypto';

function splitmix32(a: number) {
  return function() {
    a |= 0;
    a = a + 0x9e3779b9 | 0;
    let t = a ^ a >>> 16;
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15;
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  }
}

function chooseHashes(seed: string, hashes: string[], k: number) {
  hashes.sort()
  const seedNumber = parseInt(seed.slice(0, 8), 16)
  const prng = splitmix32(seedNumber)
  const randomInt = (max: number) => {
    return Math.floor(prng() * max)
  }
  for (let i = hashes.length-1; i >= 0; i--) {
    let j = randomInt(i+1);
    [hashes[j], hashes[i]] = [hashes[i], hashes[j]]
  }
  return hashes.slice(0, k)
}

function generateSalt() {
  const salt = randomBytes(64)
  return salt.toString('hex')
}

function generateHashes(ids: string[]) {
  return ids.map((id) => {
    const salt = generateSalt()
    const hash = hashUser(id, salt)
    return {
      id,
      salt,
      hash
    }
  })
}

function hashUser(id: string, salt: string) {
  const hash = createHash('sha256')
  hash.update(id + salt)
  return hash.digest('hex')
}

function verify(hashes: string[], id: string, salt: string) {
  const hash = hashUser(id, salt)
  return hashes.includes(hash)
}

export { hashUser, generateHashes, verify, chooseHashes }
