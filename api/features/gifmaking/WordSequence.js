class WordSequence {
    center(arrayOfLines, maxLength) {
        maxLength = maxLength || arrayOfLines.reduce((r, s) => r > s.length ? r : s.length, 0);

        for (let index in arrayOfLines) {
            const value = arrayOfLines[index];
            if (value.length >= maxLength) {
                continue;
            }

            const spacesToDistribute = (maxLength - value.length) / 2;
            const eitherSide = " ".repeat(spacesToDistribute);
            arrayOfLines[index] = eitherSide + value + eitherSide;
        }

        return arrayOfLines;
    }

    splitOverLines(words, minSplit, maxLength) {
        maxLength = maxLength || minSplit;

        let buffer = "";
        const output = [];

        for (let char of words) {
            if (skipLeadingSpace(buffer, char)) {
                continue;
            }

            buffer += char;

            if (hardBreak(buffer, maxLength)
                || softBreak(buffer, char, minSplit)) {
                output.push(buffer);
                buffer = "";
            }
        }

        if (buffer.length > 0) {
            output.push(buffer);
        }

        trimLines(output);

        return output;
    }
}

const skipLeadingSpace = (buffer, char) => (buffer.length === 0 && char == " ");
const hardBreak = (buffer, maxLength) => (buffer.length === maxLength);
const softBreak = (buffer, char, minSplit) => (buffer.length >= minSplit && char === " ");

function trimLines(output) {
    for (let index in output) {
        output[index] = output[index].trim();
    }
}

module.exports = WordSequence;