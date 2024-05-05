const blur = document.getElementById("blur");
const admin = document.getElementById("admin-text");
const closeAdmin = document.getElementById("close-popup-admin");

admin.addEventListener("click", () => {
    const popup = document.getElementById("admin-popup");
    popup.classList.add("active");
    blur.classList.add("active");
});

closeAdmin.addEventListener("click", () => {
    const popup = document.getElementById("admin-popup");
    popup.classList.remove("active");
    blur.classList.remove("active");
});