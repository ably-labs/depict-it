const Twitter = require('twitter');
const GifCreator = require("../features/gifmaking/GifCreator");
const checkConfig = require("../features/checkConfiguration");

checkConfig(["TWITTER_CONSUMER_KEY", "TWITTER_CONSUMER_SECRET", "TWITTER_ACCESS_TOKEN_KEY", "TWITTER_ACCESS_TOKEN_SECRET"]);

module.exports = async function (context, req) {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    const creator = new GifCreator();
    const gif = await creator.create(req.body.stack);

    const media = await client.post('media/upload', { media: gif });

    var status = {
        status: 'Look at this Depict-It progression!',
        media_ids: media.media_id_string
    };

    const tweet = await client.post('statuses/update', status);

    context.res = {
        headers: { "content-type": "application/json" },
        body: tweet,
        status: 200
    };

};