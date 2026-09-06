import { encryptEntry, deriveEncryptionKey } from './crypto.js';

const ba;seURL = "https://assword-backend.simoncrystal.dev/"

export async function APIloginStart(email) {
    const url = baseURL + "login/start?userEmail=" + encodeURIComponent(email);

    const response = await fetch(url);
    if (!response.ok) {
        console.log("THROWING ERROR FROM API.JS");
        throw new Error(`Response status: ${response.status}`);
  }

    const data = await response.json();

    sessionStorage.setItem("email", email);
    sessionStorage.setItem("salt", data.salt);
  
    return data.salt;
}

export async function APIloginValidate(email, authKey) {
    const url = baseURL + "login/validate" + 
    "?userEmail="+ 
    encodeURIComponent(email)+ 
    "&userAuth="+
    encodeURIComponent(authKey);

    const response = await fetch(url);
    if (!response.ok) {
        console.log("THROWING ERROR FROM API.JS");
        throw new Error(`Response status: ${response.status}`);
    }
    const data = response.json();

    sessionStorage.setItem("jwt", data);
    
    return data;
}


export async function APIsignup(email, salt, authKey) {
    const response = await fetch(baseURL + "signup", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, salt, authKey }),
    });

    if (!response.ok) {
        console.log("THROWING ERROR FROM API.JS");
        throw new Error(`Response status: ${response.status}`);
    }    
    return response.json();
  }
export async function APIcreateEntry(jwt, title, encryptedContent) {
    const url = baseURL + "entry/new";
    const content = encryptedContent.ciphertext;
    const iv = encryptedContent.iv;

    const response = await fetch(url, {
        method: 'POST',
        headers: {'Authorization': 'Bearer '+jwt, 'Content-Type': 'application/json'},
        body: JSON.stringify({title, content, iv})
    });

    if (!response.ok) {
        console.log("THROWING ERROR FROM API.JS");
        throw new Error(`Response status: ${response.status}`);
    }
    return response.json();


}
export async function APIgetEntries(jwt) { 
    const url = baseURL + "entry/get";

    const response = await fetch(url, {
        method: 'GET',
        headers: {'Authorization': 'Bearer '+jwt}
    });

    if (!response.ok) {
        console.log("THROWING ERROR FROM API.JS")
        throw new Error(`Response status: ${response.status}`);
    }
    return response.json();
}