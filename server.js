const http = require('http');
const fs = require('fs');
const path = require('path');

const websiteDirectory = 'html';
const port = 2828;

process.env.TZ = 'Europe/Oslo';

function isTimeInRange(startHour, endHour) {
    const currentHour = new Date().getHours();
    if (startHour <= endHour) {
        return currentHour >= startHour && currentHour < endHour;
    } else {
        return currentHour >= startHour || currentHour < endHour;
    }
}

function serveContent() {
    if (isTimeInRange(8, 12)) {
        return "day_version";
    } else {
        return "night_version";
    }
}

const getContentType = (req, filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain',
        '.mp3':  'audio/mpeg',
    };
    return mimeTypes[extname] || 'application/octet-stream';
};

const formatClientTime = (clientTime) => {
    const hours = Math.floor(clientTime / 60);
    const minutes = clientTime % 60;
    return `${hours} hours and ${minutes} minutes`;
};

const server = http.createServer((req, res) => {
    const clientTimeStr = req.headers['client-time'];
    const clientTime = clientTimeStr
        ? new Date(clientTimeStr).getHours() * 60 + new Date(clientTimeStr).getMinutes()
        : new Date().getHours() * 60 + new Date().getMinutes();

    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const directory = serveContent();

    const filePath = req.url === '/'
        ? path.join(__dirname, websiteDirectory, directory, 'index.html')
        : path.join(__dirname, websiteDirectory, directory, req.url);

    console.log(`Request from ${req.socket.remoteAddress} for URL: ${req.url}`);
    console.log('Client Time (in minutes):', clientTime);
    console.log('Client Time (formatted):', formatClientTime(clientTime));
    console.log('Current Day:', currentDay);
    console.log('Requested URL:', req.url);
    console.log('Constructed FilePath:', filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Serve the custom 404 page
            const errorFilePath = path.join(__dirname, websiteDirectory, directory, '404.html');
            fs.readFile(errorFilePath, (error, errorData) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error loading the custom 404 page.');
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(errorData);
                }
            });
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(req, filePath) });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); // This line closes the http.createServer callback
