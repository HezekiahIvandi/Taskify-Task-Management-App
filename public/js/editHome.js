const editableInputs = document.querySelectorAll(".editable-input");
const editButtons = document.querySelectorAll(".edit-button");

let isEditing = false;

// let changingText = [
//   "easily ",
//   "efficiently ",
//   "neatly ",
//   "quickly ",
//   "effortlessly",
// ];

// let homePageValues = [
//   ["easily ", "efficiently ", "neatly ", "quickly ", "effortlessly"],
//   "Become focused, organized, and calm with Taskify The world's #1 task manager app",
//   "1+ million users trust Taskify for their tasks",
// ];

let changingText;
let homePageValues;
let desc;
let info;
let placeholderDefaultValue;
// Async function to fetch data
async function getHomeData(callback = null) {
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

      desc = newData.mainTitleDesc;
      info = newData.featuresInfo;
      changingText = newData.ChangingText;
      homePageValues = [changingText, desc, info];
      placeholderDefaultValue = [
        `Organize your task {${changingText}} with Taskify`,
        desc,
        info,
      ];
      console.log(newData);
      console.log(homePageValues);
      try {
        callback();
      } catch (err) {
        console.log("no callback");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
}

getHomeData(() => {
  initValue();

  editableInputs.forEach((editableInput, index) => {
    editableInput.addEventListener("blur", () => {
      if (isEditing) {
        isEditing = false;
        editableInput.setAttribute("readonly", true);
        editableInput.placeholder = placeholderDefaultValue[index];
        console.log(editableInput.value);

        //update functions
        updateFunctions[index](editableInput.value);
        //updateChangingText(arrayOfStrings);
        reloadPreview();
      }
    });

    editButtons[index].addEventListener("click", () => {
      isEditing = !isEditing;

      if (isEditing) {
        editableInput.removeAttribute("readonly");
        editableInput.value = homePageValues[index];
        //editableInput.placeholder = "";
        editableInput.focus();
      } else {
        editableInput.setAttribute("readonly", true);
        //editableInput.placeholder = mainTitleDefaultValue[index];
      }
    });
  });
});

const initValue = async () => {
  placeholderDefaultValue.forEach((value, index) => {
    editableInputs[index].value = "";
    editableInputs[index].placeholder = value;
  });
};

const updateChangingText = async (newChangingText) => {
  console.log(newChangingText, "Hello");
  const stringWithCommas = newChangingText;
  const arrayOfStrings = stringWithCommas.split(/,\s*/);
  newChangingText = arrayOfStrings;
  console.log("data is", newChangingText);
  try {
    const response = await fetch("/home/update/ChangingText", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newChangingText }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      getHomeData();
    } else {
      console.error("Error updating ChangingText:", response.status);
    }
  } catch (err) {
    console.error("Error updating ChangingText:", err);
  }
};
const updateDesc = async (newDesc) => {
  try {
    const response = await fetch("/home/update/MainTitleDesc", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newDesc }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      getHomeData();
    } else {
      console.error("Error updating ChangingText:", response.status);
    }
  } catch (err) {
    console.error("Error updating ChangingText:", err);
  }
};
const updateFeaturesInfo = async (newInfo) => {
  try {
    const response = await fetch("/home/update/FeaturesInfo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newInfo }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      getHomeData();
    } else {
      console.error("Error updating ChangingText:", response.status);
    }
  } catch (err) {
    console.error("Error updating ChangingText:", err);
  }
};
const reloadPreview = async () => {
  const preview = document.querySelector(".preview");
  preview.innerHTML = `  <h2>Preview</h2>
<iframe src="/"></iframe>`;
};

const updateFunctions = [updateChangingText, updateDesc, updateFeaturesInfo];
