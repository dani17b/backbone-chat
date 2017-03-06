# Backbone Chat
Sample application to demonstrate an optimal design solution based on Backbone and the AMD approach.
In this application there are several use cases that expose a solution that may not always be the most optimal but all follow with a simple project structure and easy to extend.

## Features included
* Log in by getting all users and processing them with underscore
* User registration information display window
* Viewing chats sent by other users
* Send chats to a broadcast group
* Viewing alerts when you receive a new message

## Instalation
Clone project from repo [project repo](https://github.com/dani17b/backbone-chat)

```bash
$ git clone https://github.com/dani17b/backbone-chat.git

$ cd backbone-chat
```

Next, download all project dependencies

```bash
$ npm install
```

Get dummy server from https://github.com/dani17b/backbone-chat-service

Configure service port and polling interval at conf/config.js file.

## Usage
Run server and run web server for this application with your favourite server, for example:
```bash
$ cd backbone-chat

$ python -m http.server
```

## Screenshots
### Login view

![alt tag](https://raw.githubusercontent.com/dani17b/backbone-chat/master/screenshots/login.png)

### User information view

![alt tag](https://raw.githubusercontent.com/dani17b/backbone-chat/master/screenshots/init_session.png)

### Chats view

![alt tag](https://raw.githubusercontent.com/dani17b/backbone-chat/master/screenshots/chat.png)

### Notes
The objective of this project is to show an optimal structure using Backbone, jQuery, underscore and requirejs. In many cases, functionalities have been implemented in a less optimal way to force the example to show the advantages and disadvantages of the technologies exposed.

The following are possible improvements:
* Managing the user session and login
* Perform synchronization using Web Sockets instead of polling every (t) time
* Do not pass or store user information between various points of the application
* Improve chats scroll
