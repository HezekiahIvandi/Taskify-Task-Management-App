const editPfp = document.getElementById("edit-photo");
const editUsername = document.getElementById("edit-username");
const editEmail = document.getElementById("edit-email");
const editPassword = document.getElementById("edit-password");
const blur = document.getElementById("blur");
const closePopupUsername = document.getElementById("close-popup-username");
const closePopupEmail = document.getElementById("close-popup-email");
const closePopupPassword = document.getElementById("close-popup-password");

// Event listener untuk popup edit profile
editUsername.addEventListener("click", () => {
    const popup = document.getElementById("username-popup");
    popup.classList.add("active");
    blur.classList.add("active");
});

editEmail.addEventListener("click", () => {
    const popup = document.getElementById("email-popup");
    popup.classList.add("active");
    blur.classList.add("active");
});

editPassword.addEventListener("click", () => {
    const popup = document.getElementById("password-popup");
    popup.classList.add("active");
    blur.classList.add("active");
});

closePopupUsername.addEventListener("click", () => {
    const popup = document.getElementById("username-popup");
    popup.classList.remove("active");
    blur.classList.remove("active");
});

closePopupEmail.addEventListener("click", () => {
    const popup = document.getElementById("email-popup");
    popup.classList.remove("active");
    blur.classList.remove("active");
});

closePopupPassword.addEventListener("click", () => {
    const popup = document.getElementById("password-popup");
    popup.classList.remove("active");
    blur.classList.remove("active");
});

let loadFile = function (event) {
    let image = document.getElementById("userPfp");
    image.src = URL.createObjectURL(event.target.files[0]);
};