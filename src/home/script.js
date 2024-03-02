// Carousel Button
const buttons = document.querySelectorAll("[data-carousel-button]")

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button.closest("[data-carousel").querySelector("[data-slides]")

        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset
        if (newIndex < 0) newIndex = slides.children.length -1
        if (newIndex >= slides.children.length) newIndex = 0

        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
    })
});

// Text Changing
const changingText = ["easily", "efficiently", "neatly", "quickly", "effortlessly"];
let textIndex = 0;// Carousel Changing
const changingCarousel = document.querySelectorAll("[data-carousel]"); 
const textElement = document.getElementById("changing-text");
textElement.innerHTML = changingText[textIndex];
let lastIntervalTimeStamp = 0;

function renderText(now) {
    if (!lastIntervalTimeStamp || now - lastIntervalTimeStamp >=  1.5 * 1000) {
        lastIntervalTimeStamp = now;
        textElement.innerHTML = changingText[textIndex];
        ++textIndex;

        if (textIndex >= changingText.length) {
            textIndex = 0;
        }
    }

    requestAnimationFrame(renderText);
}

window.requestAnimationFrame(renderText);