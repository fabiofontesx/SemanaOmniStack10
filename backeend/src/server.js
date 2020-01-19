const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors')
const http = require('http');
const { setupWebSocket } = require('./websocket');


const app = express();
const server = http.Server(app);
setupWebSocket(server);
app.use(cors())
app.use(express.json()); //Tem, de vir antes das rotas
app.use(routes);

mongoose.connect('mongodb+srv://fabiofontesx:Fabio1618@cluster0-exhqr.mongodb.net/week10?retryWrites=true&w=majority',
{useUnifiedTopology: true,  useNewUrlParser: true, useFindAndModify: false})


server.listen(3300, ()=> console.log('Aplição UP! na porta 3300'));