import "./signup.js";
import "./login.js";
import "./valut.js";

export function showView(viewName) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });

    const view = document.getElementById(`${viewName}View`);
    if (view) {
        view.style.display = "block";
    }
}
export function setUrl(url){
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

document.querySelectorAll(".toSignUp").forEach(button => {
    button.addEventListener("click", () => showView("signup"));
});
document.querySelectorAll(".toLogIn").forEach(button => {
    button.addEventListener("click", () => showView("login"));
});
document.querySelectorAll(".toValut").forEach(button => {
    button.addEventListener("click", () => showView("valut"));
});
document.querySelectorAll(".ridJWT").forEach(button => {
    button.addEventListener("click", () => {
        sessionStorage.removeItem("jwt");
        window.location.reload();
    });
});
document.querySelectorAll(".setUrl").forEach(button => {
    button.addEventListener("click", () => {
        localStorage.setItem("url", setUrl(document.getElementById("signup-url").value));
        showView("login")
    });
});

if (sessionStorage.getItem("jwt")){
    showView("valut");
} else if (!localStorage.getItem('url')){
    showView("noUrl");
} 
else {
    showView("landing");
}