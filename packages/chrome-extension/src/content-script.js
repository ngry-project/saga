class BackgroundScript {
  constructor(onMessage) {
    chrome.runtime.onMessage.addListener((message) => {
      onMessage(message);
    });
  }

  receive(message) {
    chrome.runtime.sendMessage(message);
  }
}

class UserAgent {
  SOURCE = 'SagaDevtools';

  constructor(onMessage) {
    window.addEventListener('message', (event) => {
      // Only accept messages from the same frame
      if (event.source !== window) {
        return;
      }

      const message = event.data;

      // Only accept messages that we know are ours
      if (message.source === this.SOURCE) {
        if (chrome.runtime && !!chrome.runtime.getManifest()) {
          onMessage(message);
        } else {
          console.log(
            'Cannot send the message because of the Chrome Runtime manifest not available'
          );
        }
      }
    });
  }

  receive(message) {
    window.postMessage(message, '*');
  }
}

class ContentScript {
  constructor() {
    // Relay messages from background script to agent (browser)
    // Route:
    // agent <- **content-script.js** <- background.js <- dev tools
    this.backgroundScript = new BackgroundScript((message) => {
      this.userAgent.receive(message);
    });

    // Relay messages from agent (browser) to background script.
    // Route:
    // agent -> **content-script.js** -> background.js -> dev tools
    this.userAgent = new UserAgent((message) => {
      this.backgroundScript.receive(message);
    });
  }
}

new ContentScript();
