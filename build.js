var fs = require('fs');
var path = require('path');

const files = [
    { src: "/node_modules/@snakemode/snake-canvas/src/DrawableCanvasElement.js", dest: "/app/web_modules/DrawableCanvasElement.js" },
];

for (let file of files) {
    const src = process.cwd() + file.src;
    const dest = process.cwd() + file.dest;
    const targetDirectory = path.dirname(dest);

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    fs.copyFileSync(src, dest);
}