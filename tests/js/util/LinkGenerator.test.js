import { LinkGenerator } from "../../../app/js/util/LinkGenerator";

describe("LinkGenerator", () => {
    let sut;
    beforeEach(() => {
        sut = new LinkGenerator({
            protocol: "https:",
            host: "localhost",
            pathname: "/foo"
        });
    });

    it("Link generator, with zero parameters, constructs", async () => {
        const result = sut.linkTo();        
        expect(result).toBe("https://localhost/foo");
    });

    it("Link generator, with one parameter, constructs", async () => { 
        const result = sut.linkTo({ first: "val1" });        
        expect(result).toBe("https://localhost/foo?first=val1");
    });  

    it("Link generator, with one parameter that requires encoding, urlencodes and constructs", async () => {
        const result = sut.linkTo({ first: "some thing" });        
        expect(result).toBe("https://localhost/foo?first=some%20thing");
    });

    it("Link generator, with multiple parameters, constructs", async () => { 
        const result = sut.linkTo({ first: "val1", second: "val2" });        
        expect(result).toBe("https://localhost/foo?first=val1&second=val2");
    }); 

    it("Link generator, with multiple parameter types, constructs", async () => { 
        const result = sut.linkTo({ first: true, second: 123 });        
        expect(result).toBe("https://localhost/foo?first=true&second=123");
    });  
});