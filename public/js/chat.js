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
      if (typeof callback === "function") {
        callback(contacts);
      } else {
        console.error("Callback is not a function");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
};
getContacts((contacts) => console.log(contacts));

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

//Update current contact
const updateCurrentContact = async (nameHeader) => {
  //update data
  getContacts();
  currentContact = nameHeader;
  chatMessages.innerHTML = "";
  chatHeader.innerText = nameHeader;
  let contact;
  contacts.forEach((con) => {
    if (con.name == nameHeader) {
      contact = con;
    }
  });
  contactStat.innerHTML = contact.groupStat;
  chats = contact.chats;
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

//addevent listener for contacts
const addEventListenerForContacts = () => {
  const contactLists = document.querySelectorAll(".contact");
  contactLists.forEach((contact) => {
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
    class="${className}"
    id="${contact.id}"
  >
    <img src="${contact.imageUrl}" alt="" />
    <div>
      <p class="name" >${contact.name}</p>
      <p class="latest-chat">${contact.latestChat}</p>
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

// Update chat to db
const updateChat = async (event) => {
  event.preventDefault();
  // Get the value of the message from the text field
  const message = chatTextArea.value;
  if (!message) return; // If message is empty, do nothing

  //Find the contact object with the matching name
  currentContact = chatHeader.innerText;
  console.log(currentContact);
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
    // Send an HTTP PUT request to update the chat with the new message
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
    //update latest chat UI
    UpdateContactListUI();
  } catch (error) {
    console.error("Error updating chat:", error.message);
  }
};
chatInputForm.addEventListener("click", updateChat);

//add-contact to db
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
      alert(responseData.msg);
      this.reset();
      //close popup
      const container = document.getElementById("blur");
      container.classList.toggle("active");
      const popup = document.getElementById("popup");
      popup.classList.toggle("active");
      //update ui
      console.log(jsonData.name);
      updateCurrentContact(jsonData.name);
      //update contact ui
      UpdateContactListUI();
    } else {
      alert("Error: " + responseData.msg);
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

addEventListenerForContacts();
