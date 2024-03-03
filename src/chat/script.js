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

//contact lists
contacts = {
  "Taskify development team": {
    name: "Taskify development team",
    group: true,
    lastChat: "Morning!",
    status: "3 members, 0 online",
    chats: [
      ["Hezekiah Ivandi", "Good morning!"],
      ["You", "Morning!"],
    ],
  },
  "Vie Huang": {
    name: "Vie Huang",
    group: false,
    lastChat: "Hello",
    status: "online",
    chats: [
      ["Vie Huang", "Hey!"],
      ["You", "Hello"],
    ],
  },
  "Hezekiah Ivandi": {
    name: "Hezekiah Ivandi",
    group: false,
    lastChat: "Good, how about you?",
    status: "online",
    chats: [
      ["Hezekiah Ivandi", "What's up!"],
      ["You", "Good, how about you?"],
    ],
  },
  "Marchella Angelina": {
    name: "Marchella Angelina",
    group: false,
    lastChat: "Hi",
    status: "online",
    chats: [
      ["Marchella Angelina", "Hello!"],
      ["You", "Hi"],
    ],
  },
};

const updateCurrentContact = (nameHeader) => {
  chatMessages.innerHTML = "";
  chatHeader.innerText = nameHeader;
  contact = contacts[nameHeader];
  contactStat.innerHTML = contact.status;
  chats = contact.chats;
  chats.forEach((chat) => {
    if (chat[0] == "You") {
      chatMessages.innerHTML += createMyChatBubble(chat[1]);
    } else {
      chatMessages.innerHTML += createChatBubble(chat);
    }
  });
};

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

//display newly generated chat
const displayChatBubble = (event) => {
  event.preventDefault();
  const message = ["You", chatTextArea.value];
  const partner = chatHeader.innerText;
  saveChanges(partner, message);
  chatMessages.innerHTML += createMyChatBubble(message[1]);

  //update the latest chat
  contactLists.forEach((contact) => {
    //current contact's name
    const name = contact.querySelector(".name").textContent;
    if (name == partner) {
      latestChat.innerText = message[1];
    }
  });
};

const saveChanges = (contactName, newMessage) => {
  contacts[contactName].chats.push(newMessage);
  contacts[contactName].chats.lastChat = newMessage[1];
};

const clearChats = () => {
  chatMessages.innerHTML = "";
  contacts[chatHeader.innerText].chats.length = 0;
  contacts[chatHeader.innerText].lastChat = "";
};

chatInputForm.addEventListener("submit", displayChatBubble);

clearChatBtn.addEventListener("click", clearChats);
