const deleteButtons = document.querySelectorAll(".Delete");
const paginationLabel = document.getElementById("pagination-label");
let pageIndex = 1;
let maxPageIndex;
let users;
const getUsers = async (callback = null) => {
  fetch("/users/get")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data received from the server
      users = data.users;
      maxPageIndex = Math.ceil(users.length / 4);
      try {
        //lakukan callback (jika ada)
        callback(users);
      } catch {
        console.log("No callback is called after reading datas from the DB");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
};
//Init
getUsers(() => {
  console.log(users, maxPageIndex);
  //Initialize label
  updateLabel();
});

const reloadUser = async (users) => {
  console.log("test");
  const usersContainer = document.querySelector(".users-container");
  newhtml = "";
  users.forEach((user) => {
    newhtml += `
      <div class="user">
              <p class="email">${user.email}</p>
              <p class="username">${user.name}</p>
              <p class="see-task" id="${user._id}">See Task</p>
              <p class="see-contacts" id="${user._id}">See Contacts</p>
              <button class="Delete" id="${user._id}">Delete</button>
            </div>
      `;
  });
  usersContainer.innerHTML = newhtml;
  //update label
  updateLabel();

  //add the click event
  addEventListenerForDeleteButtons();
  addClickEventForSeeContactButtons();
  addClickEventForSeeTaskButtons();
};

const deleteUserRequest = async (id) => {
  try {
    const response = await fetch(`/dashboard/delete-user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    console.log("User deleted successfully");
    getUsers(() => {
      const startIndex = (pageIndex - 1) * 4; // Calculate the starting index for the current page
      const endIndex = startIndex + 4;
      slicedUsers = users.slice(startIndex, endIndex);
      reloadUser(slicedUsers);
    });
  } catch (err) {
    console.log("Delete user:", err);
  }
};

const addEventListenerForDeleteButtons = async () => {
  console.log("adding click even for delete button");
  //add the click event
  document.querySelectorAll(".Delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const id = deleteButton.id; // Get the id of the clicked deleteButton element
      deleteUserRequest(id);
      console.log(id);
    });
  });
};
addEventListenerForDeleteButtons();

//navigation
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const pageButtons = document.querySelectorAll(".page-btn");

prevBtn.addEventListener("click", () => {
  console.log("Prev clicked");
  pageIndex--;
  evaluateNavButtons();
  fetchUsersAndUpdateDOM();
});

nextBtn.addEventListener("click", () => {
  console.log("next clicked");
  pageIndex++;
  evaluateNavButtons();
  fetchUsersAndUpdateDOM();
});

// Helper functions

const fetchUsersAndUpdateDOM = async () => {
  // Make a request to fetch the users for the new page
  fetch(`/dashboard/users?page=${pageIndex}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data received from the server
      const current4Users = data.users;
      console.log(current4Users);

      //reload ui
      reloadUser(current4Users);
      try {
        //lakukan callback (jika ada)
        //callback(users);
        console.log("callback");
      } catch {
        console.log("No callback is called after reading datas from the DB");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
  // Update the DOM with the new set of users
  // Update the pagination buttons and page number display
};

//Event listener for see tasks buttons
const addClickEventForSeeTaskButtons = async () => {
  const seeTaskButtons = document.querySelectorAll(".see-task");
  const closePopup = document.getElementById("close-popup");

  seeTaskButtons.forEach((seeTaskButton) => {
    seeTaskButton.addEventListener("click", () => {
      console.log("SEE TASK CLICKED");
      const container = document.getElementById("blur");
      container.classList.toggle("active");
      const popup = document.getElementById("popup");
      popup.classList.toggle("active");
    });
  });

  closePopup.addEventListener("click", () => {
    const container = document.getElementById("blur");
    container.classList.toggle("active");
    const popup = document.getElementById("popup");
    popup.classList.toggle("active");
  });
};
//Event listener for see contacts buttons
const addClickEventForSeeContactButtons = async () => {
  const seeContactButtons = document.querySelectorAll(".see-contacts");
  const closePopup2 = document.getElementById("close-popup-2");

  seeContactButtons.forEach((seeContactButton) => {
    seeContactButton.addEventListener("click", () => {
      console.log("SEE contact CLICKED");
      const container = document.getElementById("blur");
      container.classList.toggle("active");
      const popup = document.getElementById("popup2");
      popup.classList.toggle("active");
    });
  });

  closePopup2.addEventListener("click", () => {
    const container = document.getElementById("blur");
    container.classList.toggle("active");
    const popup = document.getElementById("popup2");
    popup.classList.toggle("active");
  });
};
addClickEventForSeeContactButtons();
addClickEventForSeeTaskButtons();

const evaluateNavButtons = async () => {
  const prevBtn = document.querySelector(".prev-btn");
  const currentBtn = document.querySelector(".page-btn");
  const nextBtn = document.querySelector(".next-btn");
  if (pageIndex == 0) {
    pageIndex = maxPageIndex;
  } else if (pageIndex > maxPageIndex) {
    pageIndex = 1;
  }
  currentBtn.innerText = pageIndex;
};

const updateLabel = async () => {
  startIndex = (pageIndex - 1) * 4 + 1;
  endIndex = startIndex + 4 - 1;
  paginationLabel.innerText = `Showing data ${startIndex} to ${endIndex} of ${maxPageIndex} entries`;
};

const seeTasks = async () => {
  fetch("/users/get")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data received from the server
      users = data.users;
      maxPageIndex = Math.ceil(users.length / 4);
      try {
        //lakukan callback (jika ada)
        callback(users);
      } catch {
        console.log("No callback is called after reading datas from the DB");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
};
