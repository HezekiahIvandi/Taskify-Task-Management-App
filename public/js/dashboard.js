const deleteButtons = document.querySelectorAll(".Delete");

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
getUsers(() => {
  console.log(users);
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
  //add the click event
  document.querySelectorAll(".Delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const id = deleteButton.id; // Get the id of the clicked deleteButton element
      deleteUserRequest(id);
      console.log(id);
    });
  });
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
      reloadUser(users);
    });
  } catch (err) {
    console.log("Delete user:", err);
  }
};

deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", () => {
    const id = deleteButton.id; // Get the id of the clicked deleteButton element
    deleteUserRequest(id);
    console.log(id);
  });
});
