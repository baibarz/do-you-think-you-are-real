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

/**
 * Function to serve different content based on the visitor's time and day of the week.
 *
 @returns {string} The content to be served based on the visitor's time and day of the week.
 */
function serveContent() {
    const currentDay = new Date().toLocaleDateString('no-NO', { weekday: 'long' }).toLowerCase();
    const currentHour = new Date().getHours();

    if (currentDay === 'sunday') {
        return "night_version";
    } else if (currentDay === 'saturday' && isTimeInRange(10, 18)) {
        return "day_version";
    } else if (isTimeInRange(8, 23)) {
        return "day_version";
    } else {
        return "night_version";
    }
}
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
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(req, filePath) });
            res.end(data);
        }
    });
});

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
    };

    return mimeTypes[extname] || 'application/octet-stream';
};

const formatClientTime = (clientTime) => {
    const hours = Math.floor(clientTime / 60);
    const minutes = clientTime % 60;
    return `${hours} hours and ${minutes} minutes`;
};

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
