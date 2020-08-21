import { default as stubAbly } from "./stubs/ably";
const ablyStub = stubAbly();

global.Ably = ablyStub;
global.Vue = require("../app/js/vue.min.js");
global.crypto = { getRandomValues: function () { return [123454373] } };
global.window = { location: { protocol: "https:", host: "localhost", pathname: "/" } }

const { app } = require("../app/index.js");

describe("Vue app", () => {

    it("Hosting a game creates a server", async () => {
        await app.host({ preventDefault: function () { } });

        expect(app.p2pClient).toBeDefined();
        expect(app.p2pServer).not.toBeNull();
    });

    it("Hosting a game creates a client", async () => {
        await app.host({ preventDefault: function () { } });

        expect(app.p2pClient).toBeDefined();
        expect(app.p2pClient).not.toBeNull();
    });

    it("Joining a game creates a client", async () => {
        await app.join({ preventDefault: function () { } });

        expect(app.p2pClient).toBeDefined();
        expect(app.p2pClient).not.toBeNull();
    });

    it("Starting a game tells the p2pServer to start the state machine", async () => {
        await app.host({ preventDefault: function () { } });
        app.startGame();

        expect(app.p2pServer.state.started).toBe(true);
    });

    // This test is flickering because of callbacks and async / await.
    // It makes me feel nervous.
    /*it("Starting a next round tells the p2pServer to trigger a next round", async () => {        
        await app.host({ preventDefault: function() {}});
        
        await app.startGame();
        await sleep(1000);

        app.nextRound();
        await sleep(200);
        
        expect(app.p2pServer.stateMachine.currentStepKey).toBe("GetUserDrawingHandler");
    });*/
});