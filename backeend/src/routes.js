const {Router} = require('express');
const routes = Router();
const DevController  = require('./controllers/DevController');
const SearchController  = require('./controllers/SearchController');

//Tipos de Parametros
//Query parms /query?param=value&param2=value2
// (Filtros, ordenação, paginação etc...)
routes.get('/query', (req, res)=>{
    const {name, idade} = req.query;

    return res.json({message: `Nome ${name} Idade: ${idade}`});
});

//Route Params (Identificar um recurso na alteração ou remoção)
routes.delete('/route/:id/:name', (req, res)=>{
    const {id, name} = req.params;

    return res.json({id, name});
});

//Body (Dados para criação ou alteração de um registro)
routes.post('/body', (req, res)=>{
    const {name, email} = req.body;
    return res.json({
        created: true,
        name,
        email
    });
});


routes.get('/', (req, res)=>{
    return res.json({ok: true});
    
})
//Rotas reais da aplicação
routes.post('/devs', DevController.store);
routes.get('/devs', DevController.index);
routes.put('/devs/', DevController.update);
routes.delete('/devs/:github_username', DevController.destroy);

routes.get('/search', SearchController.index);


module.exports = routes;