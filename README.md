# SimpleChatTCP

SimpleChatTCP is a TCP-based terminal text chat, or rather, a TCP server that provides chat capabilities to connected clients.
To start the server just run the file using 'node'.

$ node SimpleChatTCP.js

To connect to the server we can use 'telnet'.

$ telnet 127.0.0.1 5050

But it is preferable to use another tool created specifically for reading and writing data over TCP connections: netcat.

$ netcat 127.0.0.1 5050

Since the chat uses only text, special commands are allowed to be inserted at the beginning of the text. As a tribute to the text-based chats of the 1980s and 1990s that marked the history of the Internet, the supported commands are as follows:

- /nick <nickname> -> allows to change the name of the user

- /pvt <receiver> <message> -> allows exclusive communication with
  the chosen user

- /list -> returns, to the user running it, the list of all
  connected clients

- /whoami -> allows the user to know his or her nickname
