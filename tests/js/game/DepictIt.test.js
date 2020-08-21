import { NullMessageChannel } from "../../../app/js/game/GameStateMachine";
import {
    StartHandler,
    DealHandler,
    GetUserDrawingHandler,
    GetUserCaptionHandler,
    PassStacksAroundHandler,
    GetUserScoresHandler,
    EndHandler
} from "../../../app/js/game/DepictIt.handlers";
import { Stack, StackItem } from "../../../app/js/game/DepictIt.types";
import { DepictIt } from "../../../app/js/game/DepictIt";
import { Identity } from "../../../app/js/Identity";

describe("DepictIt", () => {
    let sut;
    beforeEach(() => {
        sut = DepictIt({
            channel: {}
        });

        sut.state.players = [];
        sut.state.players.push(new Identity("Player1"));
        sut.state.players.push(new Identity("Player2"));
    });

    it("run, sets up the game and prompts users for their first drawing", async () => {
        await sut.run();

        expect(sut.currentStepKey).toBe("GetUserDrawingHandler");
    });
});

describe("StartHandler", () => {
    let step, state;
    beforeEach(() => {
        state = {};
        step = new StartHandler();
    });

    it("execute, clears down stacks", async () => {
        step.execute(state);
        expect(state.stacks.length).toBe(0);
    });

    it("execute, populates hints in state", async () => {
        const result = await step.execute(state);
        expect(state.hints.length).not.toBe(0);
    });

    it("execute, triggers 'deal' step", async () => {
        const result = await step.execute(state);
        expect(result.transitionTo).toBe("DealHandler");
    });
});

describe("DealHandler", () => {
    let step, state;
    beforeEach(() => {
        state = {
            players: [new Identity("Some player")],
            stacks: [],
            hints: ["hint1", "hint2"]
        };
        step = new DealHandler();
    });

    it("execute, generates a stack for each player", async () => {
        await step.execute(state);
        expect(state.stacks.length).toBe(1);
    });

    it("execute, triggers 'getUserDrawing' step to start game", async () => {
        const result = await step.execute(state);
        expect(result.transitionTo).toBe("GetUserDrawingHandler");
    });
});

describe("GetUserDrawingHandler", () => {

    let step, state, identity;
    beforeEach(() => {
        identity = new Identity("Some player");
        state = {
            players: [identity],
            activePlayers: [identity],
            stacks: [new Stack(identity.clientId, "hint1")],
            hints: ["hint1", "hint2"]
        };
        step = new GetUserDrawingHandler(5_000);
    });

    it("execute, sends instruction for each user to draw an image from the hint at the top of their stack", async () => {
        const channel = new NullMessageChannel();
        const context = { channel: channel };

        step.execute(state, context);

        expect(channel.sentMessages.length).toBe(1);
        expect(channel.sentMessages[0].message.kind).toBe("instruction");
        expect(channel.sentMessages[0].message.type).toBe("drawing-request");
        expect(channel.sentMessages[0].message.value).toBe("hint1");
    });

    it("execute, transitions to PassStacksAroundHandler after all users have provided input", async () => {
        const channel = new NullMessageChannel();
        const context = { channel: channel };
        const step = new GetUserDrawingHandler(200);

        setTimeout(async () => {
            step.handleInput(state, context, { kind: "drawing-response", imageUrl: "http://my/drawing.jpg", metadata: { clientId: identity.clientId } });
        }, 50);

        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("PassStacksAroundHandler");
        expect(result.error).not.toBeDefined();
    });

    it("execute, transitions to PassStacksAroundHandler with error flag if users timeout.", async () => {
        const channel = new NullMessageChannel();
        const context = { channel: channel };
        const step = new GetUserDrawingHandler(50);

        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("PassStacksAroundHandler");
        expect(result.error).toBeDefined();
    });

    it("execute, if user times out, all stacks still have correct number of items in them so things don't crash later.", async () => {
        const channel = new NullMessageChannel();
        const context = { channel: channel };
        const initialStackLength = state.stacks[0].items.length;

        step = new GetUserDrawingHandler(100);
        const result = await step.execute(state, context);

        expect(state.stacks[0].items.length).toBe(initialStackLength + 1);
    });

    it("execute, timeout returned to user has three seconds of leeway in it.", async () => {
        const channel = new NullMessageChannel();
        const context = { channel: channel };

        step = new GetUserDrawingHandler(10_000);
        step.execute(state, context);

        expect(channel.sentMessages[0].message.timeout).toBe(7_000);
    });

    it("execute when three seconds of leeway would be too much, timeout is the same as the handler timeout", async () => {
        const channel = new NullMessageChannel();
        const context = { channel: channel };

        step = new GetUserDrawingHandler(2_000);
        step.execute(state, context);

        expect(channel.sentMessages[0].message.timeout).toBe(2_000);
    });
});

describe("GetUserCaptionHandler", () => {
    let step, state, identity, channel, context;
    beforeEach(() => {
        identity = new Identity("Some player");
        channel = new NullMessageChannel();
        state = {
            players: [identity],
            activePlayers: [identity],
            stacks: [new Stack(identity.clientId, "hint1")],
            hints: ["hint1", "hint2"]
        };
        context = {
            channel: channel
        };
        step = new GetUserCaptionHandler(5_000);

        state.stacks[0].add(new StackItem("image", "http://tempuri.org/img.png"));
    });

    it("execute, sends instruction for each user to enter caption for the image at the top of their stack", async () => {
        step.execute(state, context);

        expect(channel.sentMessages.length).toBe(1);
        expect(channel.sentMessages[0].message.kind).toBe("instruction");
        expect(channel.sentMessages[0].message.type).toBe("caption-request");
        expect(channel.sentMessages[0].message.value).toBe("http://tempuri.org/img.png");
    });

    it("execute, transitions to PassStacksAroundHandler after all users have provided input", async () => {
        setTimeout(async () => {
            step.handleInput(state, context, { kind: "caption-response", caption: "blah blah blah", metadata: { clientId: identity.clientId } });
        }, 100);

        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("PassStacksAroundHandler");
        expect(result.error).not.toBeDefined();
    });

    it("execute, transitions to passStacksAround with error flag if users timeout.", async () => {
        step = new GetUserCaptionHandler(100);
        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("PassStacksAroundHandler");
        expect(result.error).toBeDefined();
    });

    it("execute, if user times out, all stacks still have correct number of items in them so things don't crash later.", async () => {
        const initialStackLength = state.stacks[0].items.length;
        step = new GetUserCaptionHandler(100);

        await step.execute(state, context);

        const firstStack = state.stacks[0];
        expect(firstStack.items.length).toBe(initialStackLength + 1);
        expect(firstStack.items[firstStack.items.length - 1].value).toBe("hint1");
        expect(firstStack.items[firstStack.items.length - 1].systemGenerated).toBe(true);
    });

    it("execute, timeout returned to user has three seconds of leeway in it.", async () => {
        step = new GetUserCaptionHandler(10_000);
        step.execute(state, context);

        expect(channel.sentMessages[0].message.timeout).toBe(7_000);
    });

    it("execute when three seconds of leeway would be too much, timeout is the same as the handler timeout", async () => {
        step = new GetUserCaptionHandler(2_000);
        step.execute(state, context);

        expect(channel.sentMessages[0].message.timeout).toBe(2_000);
    });
});

describe("PassStacksAroundHandler", () => {
    let step, state, p1, p2, channel, context;
    beforeEach(() => {
        p1 = new Identity("Some player");
        p2 = new Identity("Some player");
        channel = new NullMessageChannel();
        state = {
            players: [p1, p2],
            activePlayers: [p1, p2],
            stacks: [
                new Stack(p1.clientId, "hint1"),
                new Stack(p2.clientId, "hint2"),
            ],
            hints: ["hint1", "hint2"]
        };

        context = {
            channel: channel
        };

        step = new PassStacksAroundHandler();
        state.stacks[0].add(new StackItem("image", "http://tempuri.org/img.png"));
        state.stacks[1].add(new StackItem("image", "http://tempuri.org/img.png"));
    });

    it("execute, assigns players each others stacks", async () => {
        step.execute(state, context);

        expect(state.stacks[0].heldBy).toBe(p2.clientId);
        expect(state.stacks[1].heldBy).toBe(p1.clientId);
    });

    it("execute, when original owners have their stacks again, redirects to getUserScores", async () => {
        await step.execute(state, context);
        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("GetUserScoresHandler");
    });

    it("execute, routes to getUserCaption when last card was an image", async () => {
        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("GetUserCaptionHandler");
    });

    it("execute, routes to getUserDrawing when last card was a caption", async () => {
        state.stacks[0].add(new StackItem("string", "blah blah"));
        state.stacks[1].add(new StackItem("string", "bleh bleh"));

        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("GetUserDrawingHandler");
    });
});

describe("GetUserScoresHandler", () => {
    let step, state, p1, p2, channel, context;
    beforeEach(() => {
        p1 = new Identity("Some player");
        channel = new NullMessageChannel();
        state = {
            players: [p1],
            activePlayers: [p1],
            stacks: [
                new Stack(p1.clientId, "hint1"),
            ],
            hints: ["hint1", "hint2"]
        };

        context = {
            channel: channel
        }

        step = new GetUserScoresHandler();
        const item = new StackItem("image", "http://tempuri.org/img.png");
        item.author = p1.clientId;
        item.id = "1234";
        state.stacks[0].items.push(item);
    });

    it("execute, requests players to vote for one card per stack", async () => {
        setTimeout(async () => {
            step.handleInput(state, context, { kind: "pick-one-response", id: "1234", metadata: { clientId: p1.clientId } });

            expect(channel.sentMessages[1].message.kind).toBe("instruction");
            expect(channel.sentMessages[1].message.type).toBe("wait");
        }, 100);

        const result = await step.execute(state, context);

        expect(channel.sentMessages[0].message.kind).toBe("instruction");
        expect(channel.sentMessages[0].message.type).toBe("pick-one-request");

        expect(result.transitionTo).toBe("EndHandler");
        expect(result.error).not.toBeDefined();
    });

    it("execute, can be skipped by host", async () => {
        setTimeout(async () => {
            step.handleInput(state, context, { kind: "skip-scoring-forwards", metadata: { clientId: p1.clientId } });
        }, 100);

        const result = await step.execute(state, context);

        expect(result.transitionTo).toBe("EndHandler");
    });
});

describe("EndHandler", () => {
    let step, state, p1, p2, channel, context;
    beforeEach(() => {
        p1 = new Identity("Some player");
        channel = new NullMessageChannel();
        state = {
            players: [p1],
            activePlayers: [p1],
            stacks: [new Stack(p1.clientId, "hint1")],
            hints: ["hint1"],
        };

        context = {
            channel: channel
        }

        step = new EndHandler();
    });

    it("execute, completes the state machine", async () => {
        const result = await step.execute(state, context);

        expect(result.complete).toBe(true);
    });

    it("execute, sends a message to the clients to show the scoreboard", async () => {
        const result = await step.execute(state, context);

        expect(channel.sentMessages.length).toBe(1);
        expect(channel.sentMessages[0].message.kind).toBe("instruction");
        expect(channel.sentMessages[0].message.type).toBe("show-scores");
        expect(channel.sentMessages[0].message.playerScores).toBeDefined();
    });
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}