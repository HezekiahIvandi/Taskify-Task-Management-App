const taskifySelectorBtn = document.querySelector('#taskify')
const hezeSelectorBtn = document.querySelector('#hezekiah')
const vieSelectorBtn = document.querySelector('#vie')
const marchellaSelectorBtn = document.querySelector('#marchella')


const chatHeader = document.querySelector('.chat-box-header')
const chatMessages = document.querySelector('.chat-bubble-container')
const chatInputForm = document.querySelector('.chat-input-form')
const chatInput = document.querySelector('.text-area')
const clearChatBtn = document.querySelector('.clear-button')

const createChatBubble = (text) =>`
<div class="my-chat-bubble">
    <div class="my-chat-bubble-text">
        <p>You</p>
        <div class="my-bubble">
            <p class="latest-chat">Hi Hezekiah, Good morning!</p>
        </div>
    </div>
    <div><img src="../../assets/Pfp.png" alt=""></div>
</div>
`

