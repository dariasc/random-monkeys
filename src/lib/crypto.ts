import {
  createHash,
  randomBytes
} from 'crypto';

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

export { hashUser, generateHashes, verify }
