const APIS = require('./apisProcessor');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let port = process.env.PORT || 3050;

app.use(bodyParser.json({limit: '50mb'}))
app.use(cors());

app.use((req, res, next) => {
    console.log('[', (new Date).toLocaleString(), "] request: ", req.url);
    // console.log('reqBody:', req.body);
    next();
})

APIS.load('./services/');
let rutas = APIS.getRoutes();

console.log("Rutas levantadas:");
rutas.forEach((ruta) => {
    console.log(ruta);
});


// Este objeto de configuración indica
// cual respuesta es la que se enviará
// cuando se haga una petición en 
// dicho endpoint, por default será la 0
let config = {
    '/cat/actividadCNBV/': 0,
}

function handleRoute(req, res) {
    let endpoint = req.originalUrl;
    if (APIS.exists(endpoint)) {
        APIS.handle(req, res, config);
    } else  {
        res.status(404).send();
    }
}

io.on('connection', function (socket) {
    socket.on('getApis', function (msg) {
        socket.emit('apis', {
            apis:JSON.stringify(APIS.getAll()),
            config: config,
        });
    });

    socket.on('pedirResponse', function(data) {
        let response = null;
        // console.log('data:', data);
        let api = APIS.get(data.endpoint);
        response = APIS.getResponse(api, data.transitionIdx);
        response.endpoint = data.endpoint;
        response.transitionIdx = data.transitionIdx;
        socket.emit('getResponse', response);
    });

    socket.on('setResponse', function(data) {
        let endpoint = APIS.cleanEndpoint(data.endpoint);
        config[endpoint] = data.transitionIdx;
    })
    
});

app.use('/docs', express.static('docs'));
app.use('/', express.static('static'));
app.all('*', handleRoute);
// app.listen(port, () => console.log(`app listening on port ${port}!`))
http.listen(port, function () {
    console.log('listening on http://localhost:' + port);
});