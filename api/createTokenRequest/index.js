const Ably = require('ably/promises');
const checkConfig = require("../features/checkConfiguration");

checkConfig(["ABLY_API_KEY"]);

module.exports = async function (context, req) {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'depict-it' });
    context.res = {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tokenRequestData)
    };
};