import { chromium } from "playwright";
const chromeOptions = { headless: false };

export class DepictItAppPageObject {
    static async create() {
        const browser = await chromium.launch(chromeOptions);
        const page = await browser.newPage();
        await page.goto('http://127.0.0.1:8080');
        return new DepictItAppPageObject(browser, page);
    }

    constructor(browser, page) {
        this.browser = browser;
        this.page = page;
    }

    async hostASession() {
        this.playerName = await this.getSessionId();
        await this.page.click('text=Create Game');
        await this.page.waitForSelector('text=Start Game');

        this.joinGameUrl = await this.getJoinGameUrl();
        return this.joinGameUrl;
    }

    async followJoinLink(joinUrl) { await this.page.goto(joinUrl); }

    async joinASession(joinUrl) {
        await this.followJoinLink(joinUrl);
        this.playerName = await this.getSessionId();
        await this.page.click('text=Join a Session');
        await this.waitForGameLobbyToBeVisible();
    }

    async waitForGameLobbyToBeVisible() {
        await this.page.waitForSelector(".game-lobby");
    }

    async clickStartGame() {
        await this.page.click('text=Start Game');
    }

    async clickNextRound() {
        await this.page.click('#nextRoundButton');
    }

    async getJoinGameUrl() {
        return await this.page.$eval('#copyLinkInputBox', e => e.innerText);
    }

    async waitForDrawingCanvasToAppear() {
        await this.page.waitForSelector('.drawing-hint');
    }

    async drawOnCanvas() {
        await this.waitForDrawingCanvasToAppear();
        await this.page.mouse.move(500, 500);
        await this.page.mouse.down();
        await this.page.mouse.move(550, 550);
        await this.page.mouse.up();
        await this.page.click("text=I'm finished!");
    }

    async voteForFirstStackItem() {
        await this.page.waitForSelector('.stack-item');
        await this.page.dispatchEvent('.stack-item:first-of-type', 'click');
    }

    async waitForScores() {
        await this.page.waitForSelector('text=Scores');
    }

    async getSessionId() {
        return await this.page.$eval('[name=name]', e => e.value);
    }

    async captionImageReceivedFromServer(text) {
        await this.page.waitForSelector('[name=caption]');
        await this.page.fill('[name=caption]', text);
        await this.page.click('text=Send Caption');
    }

    async connectedPlayers() {
        return await this.page.$eval('.players', e => e.innerHTML);
    }

    async youAreWaitingMessage() {
        await this.page.waitForSelector('#wait-message');
        return await this.page.$eval('#wait-message', e => e.innerHTML);
    }

    async pageBody() {
        return await this.page.$eval('body', e => e.innerHTML);
    }

    async drawableCanvasIsVisible() {
        await this.page.waitForSelector('.drawable-canvas');
    }

    close() {
        this.page.close();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}