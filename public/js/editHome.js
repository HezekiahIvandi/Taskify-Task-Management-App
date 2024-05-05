const editableInputs = document.querySelectorAll(".editable-input");
const editButtons = document.querySelectorAll(".edit-button");

let isEditing = false;
let mainTitleDefaultValue = [
  "Organize your task {easily, efficiently, neatly, quickly, effortleesly} with Taskify",
  "Become focused, organized, and calm with Taskify The world's #1 task manager app",
];

const initValue = async () => {
  mainTitleDefaultValue.forEach((value, index) => {
    editableInputs[index].value = value;
  });
};

initValue();

editableInputs.forEach((editableInput, index) => {
  editableInput.addEventListener("blur", () => {
    if (isEditing) {
      isEditing = false;
      editableInput.setAttribute("readonly", true);
      editableInput.placeholder = mainTitleDefaultValue[index];
    }
  });

  editButtons[index].addEventListener("click", () => {
    isEditing = !isEditing;

    if (isEditing) {
      editableInput.removeAttribute("readonly");
      editableInput.value = mainTitleDefaultValue[index];
      editableInput.placeholder = "";
      editableInput.focus();
    } else {
      editableInput.setAttribute("readonly", true);
      editableInput.placeholder = mainTitleDefaultValue[index];
    }
  });
});
