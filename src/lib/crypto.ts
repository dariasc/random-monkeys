function arrayBufferToHex(buffer: ArrayBuffer) {
  const byteArray = new Uint8Array(buffer);
  let hexString = '';
  for (let i = 0; i < byteArray.length; i++) {
    let hex = byteArray[i].toString(16).padStart(2, '0');
    hexString += hex;
  }
  return hexString;
}

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

function chooseHashes(seed: string, hashes: any[], k: number) {
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

function randomHex(length: number) {
  const array = new Uint8Array(Math.floor(length/2));
  const salt = crypto.getRandomValues(array)
  return arrayBufferToHex(salt)
}

function generateSalt() {
  return randomHex(16)
}

async function generateHashes(ids: string[]) {
  const promises = ids.map(async (id) => {
    const salt = generateSalt()
    const hash = await hashUser(id, salt)
    return {
      id,
      salt,
      hash
    }
  })
  return Promise.all(promises)
}

async function hashUser(id: string, salt: string) {
  const msg = new TextEncoder().encode(id + salt)
  const hash = await crypto.subtle.digest("SHA-256", msg)
  return arrayBufferToHex(hash)
}

async function verify(hashes: string[], id: string, salt: string) {
  const hash = await hashUser(id, salt)
  return hashes.includes(hash)
}

export { hashUser, generateHashes, verify, chooseHashes, randomHex }
