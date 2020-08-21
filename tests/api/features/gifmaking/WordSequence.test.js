import WordSequence from "../../../../api/features/gifmaking/WordSequence";
const sut = new WordSequence();

describe("WordSequence", () => {

    it("Returns one line when words are below the character cap", () => {
        const result = sut.splitOverLines("Below character cap", 200);

        expect(result[0]).toBe("Below character cap");
    });

    it("Return two lines when two words pass over the character cap", () => {
        const result = sut.splitOverLines("1234 6789", 4);

        expect(result[0]).toBe("1234");
        expect(result[1]).toBe("6789");
    });

    it("Returns lines when words are split but there's a word over the boundary", () => {
        const result = sut.splitOverLines("My cat a very nice", 5, 7);

        expect(result[0]).toBe("My cat");
        expect(result[1]).toBe("a very");
        expect(result[2]).toBe("nice");
    });

    it("Forces a word split once the length hits the cap, regardless of word position", () => {
        const result = sut.splitOverLines("My cat a very nice", 4, 5);

        expect(result[0]).toBe("My ca");
        expect(result[1]).toBe("t a");
        expect(result[2]).toBe("very");
        expect(result[3]).toBe("nice");
    });

    it("Can center a line", () => {
        const result = sut.center(["Hello"]);
        expect(result[0]).toBe("Hello");
    });

    it("Can center a line using longest line as guide, when lines can be evenly spaced", () => {
        const result = sut.center([
            "Hell",
            "HelllleH"
        ]);

        expect(result[0]).toBe("  Hell  ");
        expect(result[1]).toBe("HelllleH");
    });

    it("Can center a line using longest line as guide, when lines cannot be evenly spaced", () => {
        const result = sut.center([
            "Hello",
            "HellolleH"
        ]);

        expect(result[0]).toBe("  Hello  ");
        expect(result[1]).toBe("HellolleH");
    });
});