const baseURL = "https://assword-backend.simoncrystal.dev/"

export async function APIloginStart(email) { 
    const url = baseURL + "login/start?userEmail=" + email
    
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}
export async function APIloginValidate(email, authKey) {  }  // GET /login/validate
export async function APIsignup(email, salt, authKey) {
    const templete = new Request(baseURL + "signup", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            email: email,
            salt: salt,
            authKey: authKey
        }),
    });

    const response1 = await fetch(templete);
    console.log(response1.status);
    
    return response1;
    }
export async function APIcreateEntry(jwt, title, ciphertext, iv) { }  // POST /entry/new
export async function APIgetEntries(jwt) { } 