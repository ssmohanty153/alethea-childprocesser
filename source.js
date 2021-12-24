const socket = io('http://localhost:5000');
const form = document.getElementById('formid');
const input = document.getElementById('messageInp');
const messageContener=document.querySelector(".container");

const name = prompt("Enter your name");
socket.emit('new-user',name);


const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add('position');
    messageContener.append(messageElement);
}

form.addEventListener('submit',(e)=> {
    e.preventDefault();
    const message=input.value;
    append(`you: ${message}`,'right');
    socket.emit('onMessage',message);
    input.value='';
})


socket.on('user-joined', name => {
    append(`${name} join this chart`,'right')
})

socket.on('recived', data => {
    console.log(data);
    append(`${data.message}`)
})
socket.on('leave', name => {
    append(`${name} left the chat`,'left')
})