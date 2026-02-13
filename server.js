const http = require('http');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

const frota = [
    { id: 1, linha: "101 - Centro", horario: "06:00" },
    { id: 2, linha: "202 - Bairro Novo", horario: "07:30" },
    { id: 3, linha: "303 - Terminal Sul", horario: "09:15" },
    { id: 4, linha: "404 - Aeroporto", horario: "11:00" }
];

const server = http.createServer((req, res) => {

    console.log(`Requisição recebida: ${req.url}`.green);

    if (req.url !== '/' && req.url !== '/api/onibus') {
        const filePath = path.join(__dirname, 'public', req.url);
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.json': contentType = 'application/json'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg':
            case '.jpeg': contentType = 'image/jpeg'; break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                const file404 = path.join(__dirname, 'public', '404.html');
                fs.readFile(file404, 'utf8', (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(content404 || '404 - Página não encontrada');
                });
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
        return;
    }


    if (req.url === '/') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Erro do servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content);
            }
        });
    }


    else if (req.url === '/api/onibus') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(frota));
    }

});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`🚌 Servidor rodando em http://localhost:${PORT}`.blue.bold);
});
