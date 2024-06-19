class WebSocketManager {
  constructor() {
    this.gameSocket = null;
    this.friendSocket = null;
  }

  returnGameSocket() {
    return this.gameSocket;
  }

  connectGameSocket(url) {
    if (!this.gameSocket || this.gameSocket.readyState !== WebSocket.CLOSED) {
      this.gameSocket = new WebSocket(url);
    }
  }

  connectFriendSocket(url) {
    if (!this.friendSocket || this.friendSocket.readyState !== WebSocket.CLOSED) {
      this.friendSocket = new WebSocket(url);
      this.setupFriendSocketListeners();
    }
  }

  setupFriendSocketListeners() {
    this.friendSocket.onopen = (event) => {
      console.log('Friend socket connected');
    };
    this.friendSocket.onmessage = (event) => {};
    this.friendSocket.onclose = (event) => {
      console.log('Friend socket closed');
    };
    this.friendSocket.onerror = (event) => {
      console.log('Friend socket error');
    };
  }

  closeGameSocket() {
    if (this.gameSocket) {
      this.gameSocket.close();
    }
  }

  closeFriendSocket() {
    if (this.friendSocket) {
      this.friendSocket.close();
    }
  }
}

export default new WebSocketManager();
