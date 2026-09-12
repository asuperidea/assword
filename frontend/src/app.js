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

document.querySelectorAll("#toSignUp").forEach(button => {
    button.addEventListener("click", () => showView("signup"));
});
document.querySelectorAll("#toLogIn").forEach(button => {
    button.addEventListener("click", () => showView("login"));
});
document.querySelectorAll("#toValut").forEach(button => {
    button.addEventListener("click", () => showView("valut"));
});
document.querySelectorAll("#ridJWT").forEach(button => {
    button.addEventListener("click", () => {
        sessionStorage.removeItem("jwt");
        window.location.reload();
    });
});

if (sessionStorage.getItem("jwt")){
    showView("valut");
} else {
    showView("landing");
}