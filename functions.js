// functions.js
// Utility file providing functions for SimpleChatTCP.js

// This function receives a socket object and returns
// a string that represents the ID of the user
// connected to the server
// @ user --> (socket object)
// return (string)
function getUserID(user) {
  return `${user.remoteAddress}:${user.remotePort}`;
}

// This function compares IDs of two socket objects and returns
// true or false
// @ (user1, user2) --> (socket objects)
// return (bool)
function isSameUser(user1, user2) {
  return (
    user1.remoteAddress === user2.remoteAddress &&
    user1.remotePort === user2.remotePort
  );
}

// This function takes an array of socket objects and a string
// representation of the message and send the message to all
// users of the chat
// @ (users -> array of sockets, msg -> string)
function sendMsgToAll(users, msg) {
  users.forEach((user) => user.write(msg));
}

// This function takes an array of socket objects and a specific
// socket object, representing the user who sent the message, and
// returns a sub-vector of socket objects that does not include
// the user who sent the message
// @ (users -> array of sockets, user -> socket object)
// return (sub-array of socket objects)
function excludeSameUser(users, user) {
  return users.filter((u) => !isSameUser(u, user));
}

// This function removes CR and LF control characters from the message
// @ (msg -> string)
// return (string message without \r \n)
function removeControlChar(msg) {
  return msg.replace(/[\r\n]+$/, '');
}

// This function takes a string message and return it with a red colour
// @ (msg -> string)
// return (string)
function colorRed(msg) {
  return `\x1b[97;41m${msg}\x1b[0m`;
}

// This function takes a string message and return it with a green colour
// @ (msg -> string)
// return (string)
function colorGreen(msg) {
  return `\x1b[97;42m${msg}\x1b[0m`;
}

// This function takes a string message and return it with a blue colour
// @ (msg -> string)
// return (string)
function colorBlue(msg) {
  return `\x1b[97;44m${msg}\x1b[0m`;
}

// This function returns the nickname from the message of the user
// @ (msg -> string)
// return (string)
// es. /nick Marcus --> Marcus
function getNameFromMsg(msg) {
  const [_, nickname] = msg.split(' ');
  return nickname;
}

// This function return an array containing the receiver and the private
// message from the string sended by the user
// @ (msg -> string)
// return (array --> [receiver, privateMsg])
// es. /pvt Marcus Hello! --> ['Marcus', 'Hello!']
function getPrivateMessage(msg) {
  const [_, receiver, ...words] = msg.split(' ');
  const privateMsg = words.join(' ');
  return [receiver, privateMsg];
}

module.exports = {
  getUserID,
  sendMsgToAll,
  excludeSameUser,
  removeControlChar,
  colorRed,
  colorGreen,
  colorBlue,
  getNameFromMsg,
  getPrivateMessage,
};
