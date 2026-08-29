export async function deriveAuthKey(masterPassword, salt) {
  const authKey = masterPassword + salt + "AUTHKEY";
  return authKey;
}

export async function deriveEncryptionKey(masterPassword, salt) {
  const encryptionKey = masterPassword + salt + "ENCRYPTIONKEY"
  return encryptionKey;
}

export async function encryptEntry(encryptionKey, plainText) {
  const encoder = new TextEncoder();
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const passwordBuffer = encoder.encode(encryptionKey);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', passwordBuffer);
  const key = await window.crypto.subtle.importKey(
    'raw', 
    hashBuffer, 
    { name: 'AES-GCM' }, 
    false, 
    ['encrypt']
  );

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(plainText)
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const ivString = btoa(String.fromCharCode(...iv));
  const encryptedString = btoa(String.fromCharCode(...encryptedBytes));

  return { iv: ivString, ciphertext: encryptedString };
}

export async function decryptEntry(encryptionKey, ciphertext, iv) {
  return window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, encryptionKey, ciphertext);
}

export function generateSalt() { 
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let length = 35;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
 }

const key = deriveEncryptionKey("67676767", generateSalt());
const encrypted = encryptEntry(key, "Hello World");
console.log(encrypted);
const decrypted = decryptEntry(key, encrypted["ciphertext"], encrypted["iv"]);
console.log(decrypted);