const fs = require("fs");
const express = require("express");
const { EventEmitter } = require("events");

const chatEmitter = new EventEmitter();

chatEmitter.on('message', console.log);

const port = process.env.PORT || 1337;

const app = express();
app.use(express.static(__dirname));

app.get('/', respondText);
app.get('/json', respondJSON);
app.get('/echo', respondEcho);
app.get('/sse', respondSSE);
app.get('/chat', respondChat);

app.listen(port, () => console.log(`Server is listening on ${port}`));

function respondText(req, res) {
    res.setHeader('Content-type', 'text/plain');
    res.end("Text response");
}

function respondJSON(req, res) {
    res.json({
        text: 'hi',
        number: [1, 2, 3]
    });
}

function respondEcho(req, res) {
    const { input = '' } = req.query;
    res.json(
        {
            normal: input,
            shouty: input.toUpperCase(),
            charCount: input.length,
            backwards: input.split('').reverse().join('')
        }
    );
}

function respondSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    });

    const onMessage = msg => {
        res.write(`data:${msg}\n\n`);
    };

    chatEmitter.on('message', onMessage);

    res.on('close', function () {
        chatEmitter.off('message', onMessage);
    });
}

function respondChat(req, res) {
    const { message } = req.query;
    chatEmitter.emit('message', message);
    res.end();
}