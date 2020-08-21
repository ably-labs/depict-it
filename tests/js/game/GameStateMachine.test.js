import { GameStateMachine, waitUntil } from "../../../app/js/game/GameStateMachine";

describe("GameStateMachine", () => {

    it("run, triggers opening step", async () => {
        const game = twoStepGame();

        const sut = new GameStateMachine(game);
        await sut.run();

        expect(sut.state.executeCalled).toBe(true);
    });

    it("run, opening step transition is executed", async () => {
        const game = twoStepGame();

        const sut = new GameStateMachine(game);
        await sut.run();

        expect(sut.currentStepKey).toBe("EndHandler");
    });

    it("resetCurrentStepKeepingState, allows games to proceed to a 'next round' without resetting state object.", async () => {
        const game = twoStepGame();
        const sut = new GameStateMachine(game);

        await sut.run();
        sut.state.foo = "bar";
        expect(sut.currentStepKey).toBe("EndHandler");

        await sut.resetCurrentStepKeepingState();
        
        expect(sut.state.foo).toBe("bar");
        expect(sut.currentStepKey).toBe("StartHandler");
    });

    it("run, game that only proceeds with input, proceeds with input", async () => {
        const game = gameThatNeedsInputToProceed();

        const sut = new GameStateMachine(game);
        sut.run();
        sut.handleInput("input");

        await sleep(150);

        expect(sut.currentStepKey).toBe("EndHandler");
    });

    it("run, step doesn't contain input handler when input received, nothing happens", async () => {
        const game = gameThatNeedsToWaitBetweenSteps();

        const sut = new GameStateMachine(game);
        await sut.run();

        sut.handleInput("input");
        await sleep(500);

        expect(sut.currentStepKey).toBe("EndHandler");
    });

    it("waitUntil can resolve before timeouts", async () => {
        let foo = false;
        setTimeout(() => {
            foo = true;
        }, 500);

        await waitUntil(() => { return foo == true; }, 2000);

        expect(foo).toBe(true);        
    });

    it("run, steps execute returns navigable location, navigates using return value", async () => {
        const game = twoStepGame();
        const sut = new GameStateMachine(game);
        
        await sut.run();

        expect(sut.currentStepKey).toBe("EndHandler");       
    });

});


const twoStepGame = () => ({
    steps: {
        "StartHandler": {
            execute: async function (state) { 
                state.executeCalled = true; 
                return { transitionTo: "EndHandler" };
            }
        },
        "EndHandler": {
            execute: async function (state) { }
        }
    }
});

const gameThatNeedsInputToProceed = () => ({
    steps: {
        "StartHandler": {
            execute: async function (state) { 
                state.executeCalled = true;                
                await waitUntil(() => state.gotInput == true, 5_000);                
                return { transitionTo: "EndHandler" }; 
            },
            handleInput: async function(state, input) { 
                state.gotInput = true; 
            }
        },
        "EndHandler": {
            execute: async function (state) { },
            handleInput: async function(state, input) { }
        }
    }
});


const gameThatNeedsToWaitBetweenSteps = () => ({
    steps: {
        "StartHandler": {
            execute: async function (state) { 
                state.executeCalled = true;                
                await waitUntil(() => state.msInCurrentStep >= 250, 5_000);
                return { transitionTo: "EndHandler" };
            }
        },
        "EndHandler": {
            execute: async function (state) { },
            handleInput: async function(state, input) { }
        }
    }
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}