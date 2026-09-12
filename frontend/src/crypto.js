export async function deriveAuthKey(masterPassword, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(masterPassword+salt+"AUTHKEY"), { name: "PBKDF2" }, false, ["deriveBits"]
    );
  
    const derivada = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations: 600000,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
  
    return btoa(String.fromCharCode(...new Uint8Array(derivada)));
}

export async function deriveEncryptionKey(masterPassword, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(masterPassword+salt+"ENCRYPTIONKEY"), { name: "PBKDF2" }, false, ["deriveBits"]
    );
  
    const derivada = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations: 600000,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
  
    return btoa(String.fromCharCode(...new Uint8Array(derivada)));
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
  const encoder = new TextEncoder();

  const passwordBuffer = encoder.encode(encryptionKey);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', passwordBuffer);

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const ivBuffer = new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0)));
  const ciphertextBuffer = new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)));

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    cryptoKey,
    ciphertextBuffer
  );

  return new TextDecoder().decode(decrypted);
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