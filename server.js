const http = require('http');
const fs = require('fs');
const path = require('path');

const websiteDirectory = "html";
const port = 2828;

process.env.TZ = 'Europe/Oslo';

const server = http.createServer((req, res) => {
  const clientTimeStr = req.headers['client-time'];
  const clientTime = clientTimeStr
    ? new Date(clientTimeStr).getHours() * 60 + new Date(clientTimeStr).getMinutes()
    : new Date().getHours() * 60 + new Date().getMinutes();

  const openingHours = {
    monday: [8 * 60, 20 * 60],
    tuesday: [8 * 60, 20 * 60],
    wednesday: [8 * 60, 20 * 60],
    thursday: [8 * 60, 20 * 60],
    friday: [8 * 60, 20 * 60],
    saturday: [8 * 60, 18 * 60],
    sunday: [0, -1], // Set a range that will never match to indicate closed on Sundays
    //sunday : [8 * 60,23*60]
};

// Get the current day in Norwegian format
const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
const currentTimeInMinutes = new Date().getHours() * 60 + new Date().getMinutes();

let isOpen;
if (openingHours[currentDay]) {
    const [openingStart, openingEnd] = openingHours[currentDay];
    isOpen = currentTimeInMinutes >= openingStart && currentTimeInMinutes <= openingEnd;
} else {
    isOpen = false;
}

const directory = isOpen ? 'day_version' : 'night_version';

// Get the current real time in Norwegian format
const currentTime = new Date().toLocaleTimeString('nb-NO', { timeZone: 'Europe/Oslo' });

let filePath;

// Check if the requested URL is the root ("/")
if (req.url === '/') {
    // Set a default file for the root URL (e.g., "index.html")
    filePath = path.join(__dirname, websiteDirectory, directory, 'index.html');
} else {
    // Construct the file path for other URLs
    const normalizedUrl = req.url.replace(/\//g, path.sep);
    filePath = path.join(__dirname, websiteDirectory, directory, normalizedUrl);
}

// Log information about the request, including the client's IP address
console.log(`Request from ${req.socket.remoteAddress} for URL: ${req.url}`);
console.log('Client Time (in minutes):', clientTime);
console.log('Client Time (formatted):', formatClientTime(clientTime));
console.log('Current Day:', currentDay);
console.log('Current Real Time:', currentTime);
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

// Function to format client time into hours and minutes
const formatClientTime = (clientTime) => {
const hours = Math.floor(clientTime / 60);
const minutes = clientTime % 60;
return `${hours} hours and ${minutes} minutes`;
};

server.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});