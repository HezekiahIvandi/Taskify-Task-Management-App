const blur = document.getElementById("blur");
const forgotPass = document.getElementById("forgot-pass-text");
const closeForgotPass = document.getElementById("close-popup-forgot")

forgotPass.addEventListener("click", () => {
    const popup = document.getElementById("forgot-popup");
    popup.classList.add("active");
    blur.classList.add("active");
});

closeForgotPass.addEventListener("click", () => {
    const popup = document.getElementById("forgot-popup");
    popup.classList.remove("active");
    blur.classList.remove("active");
});