import type { webcrypto } from "node:crypto"

const CONFIG = {
    name: "AES-GCM",
    lenght: 256,
    digest: "SHA-256",
    iterations: 600_000, // Source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
}

/**
 * Short:
 * We derivate the master key to an perfect lenght and more secure PBKDF2 key.
 * 
 * Long:
 * We derivate our master key (of an uncertain lenght) to a certain lenght (256 bits) with a more
 * random value (more cryptographical and less "psycological" key).
 * Also, the iterations (600K min) ensures the key requires a min time for ensure the key is valid, making more hard and
 * long the brute-force attacks.
 * 
 * The iterations are asigned that value (600_000) because a article, but, it can be a long high number, it would be the best
 * and the value should be adjusted in the context of usage of this app.
 * 
 * ---
 * 
 * If you are hosting this on local, without external access (for sure) you can set that number lower. If this is being used in, per
 * example, a corporate example, with password used to access important and high confidencial applications, the iterations would need to be BILLIONS.
 * 
 * 
 * @param password Master password
 * @param salt
 * @param usage Usage of the key
 * @returns
 */
async function deriveKey(password: string, salt: Uint8Array, usage: webcrypto.KeyUsage[]) {
    const enc = new TextEncoder();

    const rawKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    )

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: CONFIG.iterations,
            hash: CONFIG.digest
        },
        rawKey,
        { name: CONFIG.name, length: CONFIG.lenght },
        false,
        usage
    )
}

export async function encryptData(secretData: string, masterPassword: string) {
    const enc = new TextEncoder();

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(masterPassword, salt, ['encrypt'])

    const encryptedBlob = await crypto.subtle.encrypt(
        { name: CONFIG.name, iv },
        key,
        enc.encode(secretData)
    )

    return {
        blob: arrayBufferToBase64(encryptedBlob),
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv)
    }
}

/**
 * Decrypt data with master password and some other data (salt & iv)
 * @param blob Base64 encoded encrypted data
 * @param salt Base64 encoded salt
 * @param iv Base64 encoded iv
 * @param masterPassword Text with master password (will be derived)
 * @returns Decoded text or error
 */
export async function decryptData(blob: string, salt: string, iv: string, masterPassword: string) {
    try {
        const dec = new TextDecoder();

        const saltB = base64ToArrayBuffer(salt);
        const ivB = base64ToArrayBuffer(iv);
        const blobB = base64ToArrayBuffer(blob);

        const key = await deriveKey(masterPassword, saltB, ["decrypt"])

        const plainContent = await crypto.subtle.decrypt(
            { name: CONFIG.name, iv: ivB },
            key,
            blobB
        )

        return dec.decode(plainContent)
    } catch {
        throw new Error("Error while decrypting content.")
    }
}

// Helpers

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}