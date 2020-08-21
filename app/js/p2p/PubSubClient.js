export class PubSubClient {
  constructor(onMessageReceivedCallback) {
    this.connected = false;
    this.onMessageReceivedCallback = onMessageReceivedCallback;
  }

  async connect(identity, uniqueId) {
    if (this.connected) return;

    this.metadata = { uniqueId: uniqueId, ...identity };

    const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
    this.channel = await ably.channels.get(`p2p-sample-${uniqueId}`, { params: { rewind: '1m' } });

    await this.channel.subscribe((message) => {
      this.onMessageReceivedCallback(message.data, this.metadata);
    });

    this.connected = true;
  }

  sendMessage(message, targetClientId) {
    if (!this.connected) {
      throw "Client is not connected";
    }

    message.metadata = this.metadata;
    message.forClientId = targetClientId ? targetClientId : null;
    this.channel.publish({ name: "myMessageName", data: message });
  }
}