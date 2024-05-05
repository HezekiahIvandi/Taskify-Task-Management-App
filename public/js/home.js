// Text Changing
let changingText;

// Top-level async function
async function main() {
  // Wait for getChangingText() to complete
  await getChangingText();

  // Carousel Button
  const buttons = document.querySelectorAll("[data-carousel-button]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const offset = button.dataset.carouselButton === "next" ? 1 : -1;
      const slides = button
        .closest("[data-carousel")
        .querySelector("[data-slides]");
      const activeSlide = slides.querySelector("[data-active]");
      let newIndex = [...slides.children].indexOf(activeSlide) + offset;
      if (newIndex < 0) newIndex = slides.children.length - 1;
      if (newIndex >= slides.children.length) newIndex = 0;
      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    });
  });

  let textIndex = 0;
  const textElement = document.getElementById("changing-text");
  textElement.innerHTML = changingText[textIndex];
  console.log(changingText[textIndex]);

  let lastIntervalTimeStamp = 0;
  function renderText(now) {
    if (!lastIntervalTimeStamp || now - lastIntervalTimeStamp >= 1.5 * 1000) {
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
}

// Call the top-level async function
main();

// Async function to fetch data
async function getChangingText() {
  await fetch("/home/get")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data received from the server
      const newData = data.homepage[0];
      console.log(newData);
      changingText = newData.ChangingText;
      console.log(changingText);
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
}
