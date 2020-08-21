module.exports = async function (context, req) {
    context.res = {
        headers: { "content-type": "application/json" },
        body: { status: "ok" }
    };
};