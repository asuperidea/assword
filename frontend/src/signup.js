import { deriveAuthKey, generateSalt } from './crypto.js';
import { APIsignup } from './api.js';
import { showView } from './app.js'

function evalPassword(password) {
    if (password.length < 10 || password.length > 100) {
        console.log("THROWING ERROR FROM SIGNUP.JS");
        throw new Error();
    } else {
        return {"accept": true, "reason": null};
    }
}
function setUrl(url){
    if (url == ""){
        return "https://assword-backend.simoncrystal.dev/"
    }
    if (!url.includes("https://")){
        url = "https://"+url;
    }
    if (url[url.length-1] != "/"){
        url = url+"/"
    }
    return url;
}

document.getElementById("startSignUp").addEventListener("click", async() => {
    console.log("started");
    const area = document.getElementById("signUpErrorBox");
    const email = document.getElementById("signup-email").value;
    const master = document.getElementById("signup-password").value;
    const salt = generateSalt();
    const authKey = await deriveAuthKey(master, salt);
    localStorage.setItem("url", setUrl(document.getElementById("signup-url").value));
    try{
        console.log(evalPassword(master));
    } catch(error) {
        console.log("CATCHING ERROR FROM SIGNUP.JS");
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5 lightclr">Password Issue!</h2>
            <p class="reg lightclr">Your password must be between 10 and 100 characters!</p>`)
        return "error";
    }
    try {
        await APIsignup(email, salt, authKey);
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5 lightclr">Sign Up Successful!</h2>
            <button class="basicbtn lightclr underline-slide toLogIn">Log In</button>`);
        const loginButton = area.querySelector('.toLogIn');
        loginButton?.addEventListener('click', () => showView('login'));
    } catch(error) {
        area.innerHTML='';
        area.insertAdjacentHTML('beforeend', `
            <h2 class="bold fs-5 lightclr">Sign Up Error!</h2>
            <p class="reg lightclr">An error occured during your signup process. The username you used may already be in use.</p>
            <p class="reg lightclr">Make Sure ${localStorage.getItem('url')} Is Working!`)
    }
});