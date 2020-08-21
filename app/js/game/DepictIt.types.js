export class Stack {
    constructor(ownerId, openingHint) {
        this.id = uuidv4();
        this.ownedBy = ownerId;
        this.heldBy = ownerId;
        this.items = [new StackItem("string", openingHint)];
        this.items[0].systemGenerated = true;
        this.items[0].author = "SYSTEM";
        this.requires = "image";
    }

    add(item) {
        this.items.push(item);
        this.requires = item.type == "image" ? "string" : "image";
    }
}

export class StackItem {
    constructor(type, value) {
        this.type = type;   // "string" | "image"
        this.value = value; // "full text | url
    }
}


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}