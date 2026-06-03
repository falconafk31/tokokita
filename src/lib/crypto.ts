import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'TokoKitaSecretEncryptionKey32Bit' // Must be 32 bytes
const IV_LENGTH = 16 

// Deterministic encryption to allow database equality queries (.eq)
export function encrypt(text: string) {
  if (!text || text === 'Unknown') return text
  
  const key = Buffer.alloc(32, ENCRYPTION_KEY)
  // Use a hash of the text as the IV so the same IP always produces the same encrypted string
  const iv = crypto.createHash('md5').update(text + ENCRYPTION_KEY).digest() 
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(text: string) {
  if (!text || text === 'Unknown') return text
  
  try {
    const textParts = text.split(':')
    if (textParts.length !== 2) return text 
    
    const iv = Buffer.from(textParts[0], 'hex')
    const encryptedText = Buffer.from(textParts[1], 'hex')
    
    const key = Buffer.alloc(32, ENCRYPTION_KEY)
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    
    return decrypted.toString()
  } catch (error) {
    return 'Invalid Data'
  }
}
