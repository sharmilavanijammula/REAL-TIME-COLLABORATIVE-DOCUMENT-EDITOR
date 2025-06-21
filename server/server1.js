const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/collab', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// MongoDB Schema
const Document = mongoose.model('Document', new mongoose.Schema({
    _id: String,
    content: Object, // Store as Quill Delta object
}));

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('get-document', async (documentId) => {
        let document = await Document.findById(documentId);
        if (!document) {
            document = await Document.create({ _id: documentId, content: { ops: [] } });
        }
        socket.join(documentId);
        socket.emit('load-document', document.content);

        socket.on('send-changes', (delta) => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on('save-document', async (data) => {
            await Document.findByIdAndUpdate(documentId, { content: data });
        });
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

server.listen(3001, () => {
    console.log('✅ Server running on http://localhost:3001');
});
