const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const next = require('next');
const express = require('express');

const nextApp = next({ dev: isDev, dir: path.join(__dirname, '..') });
const handle = nextApp.getRequestHandler();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1260,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        const server = express();
        server.all('*', (req, res) => handle(req, res));
        server.listen(3000, (err) => {
            if (err) {
                console.error('Error al iniciar el servidor Next.js:', err);
                return;
            }
            console.log('Servidor Next.js iniciado en http://localhost:3000');
            mainWindow.loadURL('http://localhost:3000');
            mainWindow.webContents.openDevTools();
        });
    }
}

app.on('ready', async () => {
    if (!isDev) {
        try {
            await nextApp.prepare();
            console.log('Next.js preparado correctamente');
        } catch (err) {
            console.error('Error al preparar Next.js:', err);
        }
    }

    const server = require('./server');
    server.listen(4000, (err) => {
        if (err) {
            console.error('Error al iniciar el servidor Express:', err);
            return;
        }
        console.log('Servidor Express (backend) escuchando en el puerto 4000');
        createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});