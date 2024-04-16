const editPfp = document.getElementById("edit-photo");
const editUsername = document.getElementById("edit-username");
const editEmail = document.getElementById("edit-email");
const editPassword = document.getElementById("edit-password");
const blur = document.getElementById("blur");

editUsername.addEventListener("click", () => {
    const popup = document.getElementById("username-popup");
    popup.classList.toggle("active");
    blur.classList.toggle("active");
});

editEmail.addEventListener("click", () => {
    const popup = document.getElementById("email-popup");
    popup.classList.toggle("active");
    blur.classList.toggle("active");
});

editPassword.addEventListener("click", () => {
    const popup = document.getElementById("password-popup");
    popup.classList.toggle("active");
    blur.classList.toggle("active");
});