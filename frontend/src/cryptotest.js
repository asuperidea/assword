async function deriveAuthKey(masterPassword, salt) {
  const authKey = masterPassword + salt + "AUTHKEY";
  return authKey;
}

async function deriveEncryptionKey(masterPassword, salt) {
  const encryptionKey = masterPassword + salt + "ENCRYPTIONKEY"
  return encryptionKey;
}

async function encryptEntry(encryptionKey, plainText) {
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

async function decryptEntry(encryptionKey, ciphertext, iv) {
  const encoder = new TextEncoder();
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(encryptionKey),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    cryptoKey,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

function generateSalt() { 
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let length = 35;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
 }

const key = await deriveEncryptionKey("67676767" + generateSalt());
const encrypted = await encryptEntry(key, "Hello World");
console.log(encrypted);
console.log(encrypted['ciphertext']);
const decrypted = await decryptEntry(key, encrypted['ciphertext'], encrypted['iv'])
console.log(decrypted);