const contactLists = document.querySelectorAll(".contact");
const names = document.querySelectorAll(".name");
const chatHeader = document.querySelector('.chat-header-title')
const chatCurrentName = document.querySelector('.chat-current-contact-name')
const chatMessages = document.querySelector('.chat-bubble-container')
const chatInputForm = document.querySelector('.chat-input-form')
const chatTextArea = document.querySelector('.text-area')
const clearChatBtn = document.querySelector('.clear-button')

const updateCurrentContact = (nameHeader)=>{
    chatHeader.innerText = nameHeader;
    chatCurrentName.innerText = nameHeader;
}

contactLists.forEach((contact)=>{
    //current contact's name
    const name = contact.querySelector('.name').textContent;

    //click event for contact lists
    contact.addEventListener('click', ()=>{
        contactLists.forEach((con)=>{
            con.classList.remove('contact-selected');
        });
       contact.classList.add('contact-selected');

       updateCurrentContact(name);
    });
});


const createChatBubble = (text) =>`
<div class="my-chat-bubble">
    <div class="my-chat-bubble-text">
        <p>You</p>
        <div class="my-bubble">
            <p class="latest-chat">${text}</p>
        </div>
    </div>
    <div><img src="../../assets/Pfp.png" alt=""></div>
</div>
`
const displayChatBubble = (event) =>{
    event.preventDefault();
    const message = {
        text: chatTextArea.value
    }

    chatMessages.innerHTML += createChatBubble(message.text);

}

chatInputForm.addEventListener('submit', displayChatBubble);
