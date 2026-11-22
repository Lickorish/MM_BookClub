// Minimal static server for Railway. No dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

// Only these files are served; everything else gets the home page.
const files = {
  '/robots.txt':  { file: 'robots.txt',  type: 'text/plain; charset=utf-8' },
  '/sitemap.xml': { file: 'sitemap.xml', type: 'application/xml; charset=utf-8' },
};
const home = { file: 'index.html', type: 'text/html; charset=utf-8' };

http.createServer((req, res) => {
  const route = files[req.url.split('?')[0]] || home;
  fs.readFile(path.join(__dirname, route.file), (err, data) => {
    if (err) {
      // Missing optional file (e.g. no sitemap yet): fall back to 404
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': route.type });
    res.end(data);
  });
}).listen(port, () => console.log('Listening on ' + port));
