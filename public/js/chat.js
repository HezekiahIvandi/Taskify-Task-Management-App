const contactLists = document.querySelectorAll(".contact");
const names = document.querySelectorAll(".name");
const latestChat = document.querySelector(".latest-chat");
const chatHeader = document.querySelector(".chat-header-title");
const contactStat = document.querySelector(".group-stat");
const chatCurrentName = document.querySelector(".chat-current-contact-name");
const chatMessages = document.querySelector(".chat-bubble-container");
const chatInputForm = document.querySelector(".chat-input-form");
const chatTextArea = document.querySelector(".text-area");
const clearChatBtn = document.querySelector(".clear-button");
const contactsContainer = document.querySelector(".chat-contacts-list");
const addContact = document.querySelector(".add-contact");
const closePopup = document.getElementById("close-popup");
const sendButton = document.querySelector(".send-button");
const username = document.querySelector(".userName");
const addContactPopup = document.getElementById("popup");
const searchButton = document.querySelector(".search-icon");

//contact lists from db
let contacts;
let currentContact;
let searchedUsers;
//current user
const currentUser = username.innerText;

//get contacts from db
const getContacts = async (callback = null) => {
  fetch("/chat/get")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data received from the server
      contacts = data.contacts;
      try {
        //lakukan callback (jika ada)
        callback(contacts);
      } catch {
        console.log("No callback is called after reading datas from the DB");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
};
//inisialisasi read data contacts dari database
getContacts((contacts) => {
  console.log("Nama current user: ", currentUser);
  console.log("Inisialisasi data contacts (read): ", contacts);
  //inisialisasi currentContacts = contact paling atas
  currentContact = contacts[0].name;
  console.log("Inisialisasi, Current contact: ", currentContact);
});
//create my chat bubble
const createMyChatBubble = (text) => `
<div class="my-chat-bubble">
    <div class="my-chat-bubble-text">
        <p>You</p>
        <div class="my-bubble">
            <p>${text}</p>
        </div>
    </div>
    <div><img src="../../assets/Pfp.png" alt=""></div>
</div>
`;

//create others chat bubble
const createChatBubble = (prop) => `
<div class="chat-bubble">
    <div><img src="../../assets/Pfp.png" alt=""></div>

    <div>
        <p class="chat-current-contact-name">${prop[0]}</p>
        <div class="bubble">
            <p>${prop[1]}</p>
        </div>
    </div>
</div>
`;

//Update current contact UI
const updateCurrentContact = async (nameParam) => {
  currentContact = nameParam;
  console.log("updateCurrentContact, Current contact: ", currentContact);

  chatMessages.innerHTML = "";
  document.querySelector(".chat-header-title").innerText = currentContact;

  //currentContact data
  let currentContactData;
  //Find data matching with currentContact
  contacts.forEach((con) => {
    if (con.name == currentContact) {
      currentContactData = con;
    }
  });
  chats = currentContactData.chats;
  chats.forEach((chat) => {
    if (chat.sender.name == currentUser) {
      chatMessages.innerHTML += createMyChatBubble(chat.message);
    } else {
      chatMessages.innerHTML += createChatBubble([
        chat.sender.name,
        chat.message,
      ]);
    }
  });
};

//delete contact request function
const deleteContactRequest = async (name) => {
  console.log("Delete button is pressed for ", name);
  //cari id contact
  const contact = contacts.find((contact) => contact.name == name);
  if (!contact) {
    console.log("Does not find matching name in contacts");
    return;
  }
  const id = contact._id;
  try {
    const response = await fetch(`/chat/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }
    console.log("Contact deleted successfully");
    //reload UI
    updateCurrentContact(contacts[0].name);
    UpdateContactListUI();
  } catch (err) {
    console.log("Delete contact:", err);
  }
};

//addevent listener for contacts
const addEventListenerForContacts = () => {
  const contactLists = document.querySelectorAll(".contact");
  const deleteContactButtons = document.querySelectorAll(
    ".popup-delete-contact"
  );
  contactLists.forEach((contact, index) => {
    //current contact's name
    const name = contact.querySelector(".name").textContent;

    //click event for contact lists
    contact.addEventListener("click", () => {
      contactLists.forEach((con) => {
        con.classList.remove("contact-selected");
        con.classList.add("not-selected");
      });
      contact.classList.add("contact-selected");
      contact.classList.remove("not-selected");

      updateCurrentContact(name);
    });

    //click event fot delete contact button
    deleteContactButtons[index].addEventListener(
      "click",
      async function deleteContact() {
        await Swal.fire({
          title: "Are you sure?",
          text: `Do you want to delete the contact "${name}"?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteContactRequest(name);
          } else {
            Swal.fire("Cancelled", "Contact deletion cancelled", "info");
          }
        });
      }
    );
  });
};

//update contact list UI
const ContactLists = (contact) => {
  let className = "contact";
  if (contact.name == currentContact) {
    className += " contact-selected";
  } else {
    className += " not-selected";
  }
  return `
  <div
    class="${className} relative"
    id="${contact.id}"
  >
    <img src="${contact.imageUrl}" alt="" />
    <div>
      <p class="name" >${contact.name}</p>
      <p class="latest-chat">${contact.latestChat}</p>
    </div>
    <div class="popup-delete-contact">
      <i class="fa-solid fa-user-minus delete-contact-icon"></i>
    </div>
  </div>
`;
};
const UpdateContactListUI = () => {
  getContacts((contacts) => {
    const con = document.getElementById("contacts-container");
    con.innerHTML = "";
    contacts.forEach((contact) => {
      con.innerHTML += ContactLists(contact);
    });

    addEventListenerForContacts();
  });
  //location.reload();
};

//Update chat content to nothing (deletion)
const clearChats = async () => {
  //currentContact = document.querySelector(".chat-header-title").innerText;
  console.log("Clear chats, Current contact: ", currentContact);
  const contact = contacts.find((contact) => contact.name === currentContact);
  if (!contact) {
    console.error("Contact not found");
    return;
  }
  const chatId = contact._id;
  try {
    // Send an HTTP PUT request to update the chat with the new message
    const response = await fetch(`/chat/update/${chatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats: [],
        latestChat: "",
      }), // Send the message data in the request body
    });

    if (!response.ok) {
      throw new Error("Failed to update chat");
    }

    const responseData = await response.json();
    console.log("Chat updated successfully:", responseData);
    //reload UI
    updateCurrentContact(currentContact);
    UpdateContactListUI();
    //update ui
    chatMessages.innerHTML = "";
  } catch (error) {
    console.error("Error updating chat:", error.message);
  }
};
clearChatBtn.addEventListener("click", clearChats);

// Update chat to db (add new chat to existing chats history)
const updateChat = async (event) => {
  //Prevent page from reloading after clicking the button
  event.preventDefault();

  // Get the value of the message from the text field
  const message = chatTextArea.value;
  if (!message) return; // If message is empty, do nothing

  //Find the contact object with the matching name
  //currentContact = document.querySelector(".chat-header-title").innerText;
  console.log("Update chat, Current contact: ", currentContact);
  const contact = contacts.find((contact) => contact.name == currentContact);
  if (!contact) {
    console.error("Contact not found");
    return;
  }

  //push chat baru ke contact.chats
  contact.chats.push({
    sender: {
      name: currentUser,
      imageUrl: "assets/Pfp.png",
    },
    message: message,
  });
  const chatId = contact._id;

  try {
    const response = await fetch(`/chat/update/${chatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats: contact.chats,
        latestChat: message,
      }), // Send the message data in the request body
    });

    if (!response.ok) {
      throw new Error("Failed to update chat");
    }

    const responseData = await response.json();
    console.log("Chat updated successfully:", responseData);

    // Clear the text area after successful submission
    chatTextArea.value = "";
    //update ui
    updateCurrentContact(currentContact);
    UpdateContactListUI();
  } catch (error) {
    console.error("Error updating chat:", error.message);
  }
};
chatInputForm.addEventListener("click", updateChat);

//Get check marked users
const getMarkedUsers = async () => {
  // Array to store data from checked user-items
  const checkedUsers = [];

  // Select all user-items
  const userItems = document.querySelectorAll(".user-item");

  // Iterate over each user-item
  userItems.forEach((userItem, index) => {
    // Check if the checkbox inside the user-item is checked
    const checkbox = userItem.querySelector(".add-user-checkbox");
    if (checkbox.checked) {
      // Push the data to the checkedUsers array
      checkedUsers.push(searchedUsers[index]);
    }
  });

  // Log or process the checkedUsers array as needed
  console.log("Checked users:", checkedUsers);
  return checkedUsers;
};
//Display searched user
const userListHtml = async (users) => {
  const userList = document.getElementById("user-list");
  if (users.length == 0) {
    return (userList.innerHTML =
      "<p style='margin-left: 8px;'> User not found</p>");
  }
  let userHtml = "";
  users.forEach((user) => {
    userHtml += `
    <div class="user-item">
    <img src="assets/Pfp.png" alt="User 1" class="user-pfp" />
    <p class="user-email">${user.email}</p>
    <label class="checkbox-container">
      <input type="checkbox" class="add-user-checkbox" />
      <span class="checkmark"></span>
    </label>
  </div>
    `;
  });
  userList.innerHTML = userHtml;
};
//search user
const searchUser = async (event) => {
  event.preventDefault();
  const searchInput = document.getElementById("search-email");
  const email = searchInput.value;
  console.log("search email: ", email);
  const response = await fetch(`/search?searchTerm=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  if (response.ok) {
    //berhasil
    searchedUsers = responseData.users.filter(
      (user) => user.name !== currentUser
    );
    console.log(searchedUsers);
    userListHtml(searchedUsers);
  } else {
    console.log("Failed");
  }
};
searchButton.addEventListener("click", searchUser);
//insert user as contact to db
const addUserAsContact = async (event) => {
  event.preventDefault();

  //Get marked users info
  const markedUsers = await getMarkedUsers();
  if (markedUsers.length == 0) {
    //if no user has been selected
    return Swal.fire("Cancelled", "No user has been selected", "info");
  }
  try {
    // Array to store all fetch promises
    const fetchPromises = markedUsers.map(async (markedUser) => {
      const { name, _id } = markedUser;
      const jsonData = { name: [name, currentUser], id: _id };
      console.log(JSON.stringify(jsonData));
      return fetch("/chat/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
    });

    // Wait for all fetch requests to complete
    const responses = await Promise.all(fetchPromises);

    // Check if all responses are okay
    const allResponsesOk = responses.every((response) => response.ok);
    const form = document.getElementById("popup");
    if (allResponsesOk) {
      // Tampilkan pesan sukses jika request berhasil dengan jeda waktu
      Swal.fire({
        title: "Success!",
        text: "Data berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      }).then(() => {
        // Setelah jeda waktu selesai, reset form
        form.reset();
        setTimeout(() => {
          //close form popup
          const container = document.getElementById("blur");
          container.classList.toggle("active");
          const popup = document.getElementById("popup");
          popup.classList.toggle("active");

          //Inisialisasi header contact info jika contacts length == 0
          chatHeaderInit().then(
            //Read contacts data kemudian reload ui
            getContacts(() => {
              markedUsers.forEach((user) => {
                //update the contact's chats UI
                console.log("Contact added: ", user.name);
              });
              //update contact ui
              updateCurrentContact(markedUsers[markedUsers.length - 1].name); //Update currentContact to the last user of markedUsers
              UpdateContactListUI();
            })
          );
        }, 340);
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Kontak dengan user ini sudah ada!",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        form.reset();
      });
    }
  } catch {
    console.log("Unable to add contact");
  }
};
addContactPopup.addEventListener("submit", addUserAsContact);

//Inisialisasi chat header
const chatHeaderInit = async () => {
  console.log("Contacts length, ", contacts.length);
  if (contacts.length == 0) {
    const chatBoxInfo = document.querySelector(".chat-box-header-info");

    chatBoxInfo.innerHTML = `
        <img src="assets/Pfp.png" alt="" />
        <div>
          <p class="chat-header-title">test</p>
          <p class="group-stat light-blue highlight">
          Online
          </p>
        </div>
    `;
  }
};
//Add-contact eventlistener
addContact.addEventListener("click", () => {
  const container = document.getElementById("blur");
  container.classList.toggle("active");
  const popup = document.getElementById("popup");
  popup.classList.toggle("active");
});
closePopup.addEventListener("click", () => {
  const container = document.getElementById("blur");
  container.classList.toggle("active");
  const popup = document.getElementById("popup");
  popup.classList.toggle("active");
});

//Popup delete contact

addEventListenerForContacts();
