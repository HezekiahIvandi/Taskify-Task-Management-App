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
//contact lists from db
let contacts;
let currentContact;
//current user sementara
const currentUser = "Hezekiah";

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
  console.log("Inisialisasi read: ", contacts);
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
const updateCurrentContact = async (nameHeader) => {
  currentContact = nameHeader;
  console.log("updateCurrentContact, Current contact: ", currentContact);
  chatMessages.innerHTML = "";
  chatHeader.innerText = currentContact;

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
    updateCurrentContact(currentContact);
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
    console.log(contacts);
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
  currentContact = chatHeader.innerText;
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
    contacts[chatHeader.innerText].chats.length = 0;
    contacts[chatHeader.innerText].lastChat = "";
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
  currentContact = chatHeader.innerText;
  console.log("Update chat, Current contact: ", currentContact);
  console.log("Current user: ", currentUser);
  const contact = contacts.find((contact) => contact.name === currentContact);
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

//insert contact to db
document
  .getElementById("popup")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = {};
    for (const [key, value] of formData.entries()) {
      jsonData[key] = value;
    }

    const response = await fetch("/chat/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    const responseData = await response.json();
    if (response.ok) {
      // Tampilkan pesan sukses jika request berhasil dengan jeda waktu
      Swal.fire({
        title: "Success!",
        text: "Data berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
      }).then(() => {
        // Setelah jeda waktu selesai, reset form
        this.reset();
        setTimeout(() => {
          //close form popup
          const container = document.getElementById("blur");
          container.classList.toggle("active");
          const popup = document.getElementById("popup");
          popup.classList.toggle("active");

          //update the contact's chats UI
          console.log(jsonData.name);
          updateCurrentContact(jsonData.name);

          //update contact ui
          UpdateContactListUI();
        }, 340);
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Kontak dengan user ini sudah ada!",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        this.reset();
      });
    }
  });

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
