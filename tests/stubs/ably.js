const fakeAblyChannel = {
  published: [],
  subscribe: function(callback) { 
      this.callback = callback 
  },
  publish: function(message) {
      this.published.push(message); 
      this.callback(message);
  }
}

class AblyStub {
  fakeAblyChannel = fakeAblyChannel;
  connection = { on: function(string) { } };
  channels = { get: function(chName) { return fakeAblyChannel; } }
}

const globalAblyObject = { Realtime: { Promise: AblyStub } };

export default function() {
    window.Ably = globalAblyObject;
    return globalAblyObject;
}
