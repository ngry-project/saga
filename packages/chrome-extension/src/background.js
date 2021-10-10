class DevTools {
  constructor(port, onReady, onMessage, onDisconnect) {
    this.port = port;
    this.tabId = null;

    this.port.onMessage.addListener((message) => {
      switch (message.type) {
        case 'DEVTOOLS_READY':
          if (this.tabId == null && message.tabId != null) {
            this.tabId = message.tabId;
            onReady(this.tabId);
          }
          break;

        case 'DEVTOOLS_MESSAGE':
          if (this.tabId != null) {
            onMessage(this.tabId, message);
          }
          break;
      }
    });

    this.port.onDisconnect.addListener(() => {
      if (this.tabId != null) {
        onDisconnect(this.tabId);
      }
    });
  }

  receive(message) {
    this.port.postMessage(message);
  }
}

class ContentScript {
  constructor(onMessage) {
    chrome.runtime.onMessage.addListener(onMessage);
  }

  receive(tabId, message) {
    chrome.tabs.sendMessage(tabId, message);
  }
}

class BackgroundScript {
  constructor() {
    this.devtools = new Map();

    // Relays received message from content script to the DevTools page for the current tab.
    // Route:
    // agent -> content-script.js -> **background.js** -> dev tools
    this.contentScript = new ContentScript((message, sender) => {
      const devtools = this.devtools.get(sender.tab?.id);

      if (devtools) {
        devtools.receive(message);
      }
    });

    // For each DevTools connected...
    chrome.runtime.onConnect.addListener((port) => {
      // Relays messages from DevTools script to content script for the current tab.
      // Route:
      // agent <- content-script.js <- **background.js** <- dev tools
      const devtools = new DevTools(
        port,
        (tabId) => {
          console.log('DevTools connected on tab', tabId);
          this.devtools.set(tabId, devtools);
        },
        (tabId, message) => {
          console.log('DevTools sent a message', message, 'on tab', tabId);
          this.contentScript.receive(tabId, message);
        },
        (tabId) => {
          console.log('DevTools disconnected on tab', tabId);
          this.devtools.delete(tabId);
        },
      );
    });
  }
}

new BackgroundScript();
