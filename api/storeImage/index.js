const saveToAzure = require("../features/storage/saveToAzure");

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = async function (context, req) {
    const unique = `game_${req.body.gameId}_${uuidv4()}.png`;
    const fileData = req.body.imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(fileData, "base64");

    const url = await saveToAzure(unique, buffer);

    context.res = {
        headers: { "content-type": "application/json" },
        body: { url: url }
    };
};