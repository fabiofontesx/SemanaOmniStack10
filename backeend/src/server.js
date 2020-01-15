const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.use(express.json()); //Tem, de vir antes das rotas
app.use(routes);

mongoose.connect('mongodb+srv://fabiofontesx:Fabio1618@cluster0-exhqr.mongodb.net/week10?retryWrites=true&w=majority',
{useUnifiedTopology: true,  useNewUrlParser: true, useFindAndModify: false})


app.listen(3000, ()=> console.log('Aplição UP! na porta 3000'));