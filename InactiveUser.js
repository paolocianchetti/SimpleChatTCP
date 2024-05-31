// InactiveUser class that extends EventEmitter class
// Provides functionalities to detect lurker users

const EventEmitter = require('events');

class InactiveUser extends EventEmitter {
  constructor(sec) {
    super();
    this.inactiveUsers = {};
    this.timeout = sec * 1000;
  }

  setInactiveUser(nickname) {
    this.inactiveUsers[nickname] = setTimeout(() => {
      this.emit('inactive_user', nickname);
    }, this.timeout);
  }

  toggleActiveUser(nickname) {
    clearTimeout(this.inactiveUsers[nickname]);
    this.setInactiveUser(nickname);
  }

  deleteInactiveUser(nickname) {
    clearTimeout(this.inactiveUsers[nickname]);
    delete this.inactiveUsers[nickname];
  }

  renameInactiveUser(oldID, nickname) {
    this.deleteInactiveUser(oldID);
    this.setInactiveUser(nickname);
  }
}

module.exports = InactiveUser;
