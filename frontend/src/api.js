function getUrl() {
    const url = (localStorage.getItem('url') || sessionStorage.getItem('url') || '').trim();
    const normalizedUrl = url ? url.replace(/\/+$/, '') + '/' : '';
    sessionStorage.setItem('url', normalizedUrl);
    console.log(normalizedUrl);
    return normalizedUrl;
}
export async function APIloginStart(email) {
    const url = getUrl() + "login/start?userEmail=" + encodeURIComponent(email);

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
    const url = getUrl() + "login/validate" + 
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
    const url = getUrl() + "signup";
    console.log(url);
    const response = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, salt, authKey }),
    });

    if (!response.ok) {
        console.log("THROWING ERROR FROM API.JS");
        throw new Error(`Response status: ${response.status}`);
    }    
    return response.json();
  }

export async function APIcreateEntry(jwt, title, encryptedContent) {
    const url = getUrl() + "entry/new";
    const content = encryptedContent.ciphertext;
    const website = encryptedContent.website;
    const username = encryptedContent.username;
    const iv = encryptedContent.iv;

    const response = await fetch(url, {
        method: 'POST',
        headers: {'Authorization': 'Bearer '+jwt, 'Content-Type': 'application/json'},
        body: JSON.stringify({title, content, website, username, iv})
    });

    if (!response.ok) {
        console.log("THROWING ERROR FROM API.JS");
        throw new Error(`Response status: ${response.status}`);
    }
    return response.json();


}
export async function APIgetEntries(jwt) { 
    const url = getUrl() + "entry/get";

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