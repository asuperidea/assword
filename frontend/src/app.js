function showView(viewName) {
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

if (sessionStorage.getItem("jwt")) {
    showView("landing");
    // init valut!!
}
else {
    showView("landing");
}