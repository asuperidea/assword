const baseURL = "https://assword-backend.simoncrystal.dev/"

export async function loginStart(email) { 
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
export async function loginValidate(email, authKey) {  }  // GET /login/validate
export async function signup(email, salt, authKey) {  }   // POST /signup
export async function createEntry(jwt, title, ciphertext, iv) { }  // POST /entry/new
export async function getEntries(jwt) { } 

console.log(loginStart("HELLOADI"));