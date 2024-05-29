// SimpleChatTCP.js
// A simple 1980s text chat that takes advantage of the TCP protocol

const net = require('net');

const {
  getUserID,
  sendMsgToAll,
  excludeSameUser,
  removeControlChar,
  colorRed,
  colorGreen,
  colorBlue,
  getNameFromMsg,
  getPrivateMessage,
} = require('./functions');

const port = 5050;
const host = '127.0.0.1';

let users = []; // vector of socket objects
let usersMap = {}; // map of users connected to the server

const serverTCP = net.createServer();

// This function allows the specific user to obtain his or her name
// @ (user -> socket object)
// return (usersMap[userID])
function getNickname(user) {
  return usersMap[getUserID(user)];
}

// This function returns a specific user (socket object) from its nickname
// @ (users -> array of socket objects, nickname -> string)
// return (user -> socket object)
function getUserByName(users, nickname) {
  return users.find((u) => getNickname(u) === nickname);
}

// This function fills the map of users connected to the server
// with their nickname. It allows the specific user to change its name
// @ (user -> socket object, nickname -> string)
function setNickname(user, nickname) {
  usersMap[getUserID(user)] = nickname;
}

// This function produces a green-colored message
// informing that a given user has connected to the chat
// @ (user -> socket object)
// return (string)
function loginMessage(user) {
  return `${colorGreen(`${getNickname(user)} joined the chat!`)}\n`;
}

// This function produces a red-colored message
// informing that a given user has disconnected from the chat
// @ (user -> socket object)
// return (string)
function logoutMessage(user) {
  return `${colorRed(`${getNickname(user)} left the chat!`)}\n`;
}

function parseMessageAndSend(user, msg) {
  const message = removeControlChar(msg);

  if (message.startsWith('/nick ')) {
    const oldID = getNickname(user);
    const nickname = getNameFromMsg(message);
    setNickname(user, nickname);
    sendMsgToAll(users, `${colorBlue(`${oldID} is now ${nickname}`)}\n`);
  } else if (message.startsWith('/pvt ')) {
    const [receiver, privateMsg] = getPrivateMessage(message);
    const receiverUser = getUserByName(users, receiver);
    const info = colorGreen(`(private message from ${getNickname(user)})`);
    receiverUser.write(`${info} ${privateMsg}\n`);
  } else if (message === '/list') {
    const info = colorBlue(`(only visible to you)`);
    const usersString = users.map((u) => getNickname(u)).join(', ');
    user.write(`${info} Users connected to the server are:\n ${usersString}\n`);
  } else if (message === '/whoami') {
    const info = colorRed(`(only visible to you)`);
    const userID = getNickname(user);
    user.write(`${info} You are: ${userID} \n`);
  } else {
    sendMsgToAll(
      excludeSameUser(users, user),
      `<${getNickname(user)}> ${message}\n`
    );
  }
}

serverTCP.listen(port, host, () => {
  console.log(`Server TCP is running on host: ${host}, port: ${port}.`);
});

serverTCP.on('connection', function (user) {
  console.log(`CONNECTED: ${getUserID(user)}`);

  users.push(user);
  setNickname(user, getUserID(user));
  sendMsgToAll(users, loginMessage(user));

  user.on('data', function (data) {
    parseMessageAndSend(user, data.toString());
  });

  user.on('close', function () {
    users = excludeSameUser(users, user);
    sendMsgToAll(users, logoutMessage(user));
    console.log('CLOSED: ' + getUserID(user));
  });
});
