const glob = require('glob');
let fs = require('fs');
var path = require('path');

const chalk = require('chalk');

// let parserAPIB = require('./parserAPIB');


let apis = [];
let endpoints;

function load(location) {
    let apisFiles = glob.sync(location + '**/*.*(apib)');
    apisFiles.forEach((apiFile) => {
        let o = {}
        let input = fs.readFileSync(apiFile, 'utf-8');
        if (input == '') return;
        o.name = apiFile
            .substr(apiFile.lastIndexOf('/') + 1)
            .replace('.apib', '');
        o.location = apiFile.substr(0, apiFile.lastIndexOf('/') + 1);
        o.files = glob.sync(o.location + o.name + '*');
        // o.parsed = parserAPIB.parse(input);
        let location = apiFile.split('/').slice(0, -1).join('/') + '/' + o.name + '.api.json';
        if(fs.existsSync(location)){
            o.parsed = JSON.parse(fs.readFileSync(location, 'utf-8'));
            if(o.parsed.endpoint){
                apis.push(o);
            }
        }
        // console.log('location:', location);
        // fs.writeFileSync(location, JSON.stringify(o.parsed, null, 2), {encoding: 'utf-8'});
    });
    // console.log('apis:', JSON.stringify(apis));
    apis.sort(((a, b) => a.parsed.endpoint.localeCompare(b.parsed.endpoint)));
    // console.log('apis:', JSON.stringify(apis[0], null, 2));
    endpoints = apis.map((api) => {
        return api.parsed.endpoint;
    });
}

function get(endpoint) {
    endpoint = cleanEndpoint(endpoint);
    let idxApi = endpoints.indexOf(endpoint);
    return apis[idxApi];
}

function getAll() {
    return apis;
}

function getEndpoints() {
    return endpoints;
}

function getMethodColorized(method) {
    if (method == 'GET') {
        return chalk.greenBright(method);
    } else if (method == 'POST') {
        return chalk.blueBright(method);
    } else if (method == 'PUT') {
        return chalk.yellowBright(method);
    }
}

function getRoutes() {
    return apis.map((api) => {
        return '\t' +
            getMethodColorized(api.parsed.method)
            + '\t' + api.parsed.endpoint;
        // return api.parsed.transitions[0].method +' '+ api.parsed.endPoint;
    });
}

function getMethodsApi(api) {
    return [api.parsed.method];
}

function cleanEndpoint(originalUrl) {
    let endpoint = originalUrl;
    if (endpoint.charAt(endpoint.length - 1) == '/')
        endpoint = endpoint.substr(0, endpoint.length - 2);
    return endpoint;
}

function exists(endpoint) {
    let endpoints = getEndpoints();
    endpoint = cleanEndpoint(endpoint);
    return (endpoints.indexOf(endpoint) >= 0);
}

function getResponse(api, responseDesired) {
    let response = undefined;
    responseDesired = responseDesired || 0;
    response = api.parsed.responses[responseDesired];

    if (response.bodyFile == undefined && response.bodyFileAttached == undefined) {
        response.contentParsed = response.body;
    } else if(response.bodyFile != undefined){
        response.contentParsed = fs.readFileSync(api.location + response.bodyFile, 'utf-8');
        if (response.contentType == 'application/json') {
            response.contentParsed = JSON.parse(response.contentParsed);
        }
    } else if(response.bodyFileAttached != undefined){
        return response;
    }

    return response;
}


function handle(req, res, config) {
    let endpoint = cleanEndpoint(req.originalUrl);
    let api = get(endpoint);
    let methods = getMethodsApi(api);

    // Revisamos si está definido el método HTTP
    if (methods.indexOf(req.method) === -1) {
        res.status(404).send('Incorrect Method!');
    } else {
        let apiFunction = api.files.find((file) => {
            return file.search(/^.*\.js$/gm) !== -1;
        });
        if (apiFunction !== undefined) {
            require(apiFunction)(req, res);
        } else {
            let responseDesired = 0;
            if (endpoint in config) {
                responseDesired = config[endpoint];
            }

            let responseObject = getResponse(api, responseDesired);

            if(!responseObject.bodyFileAttached){
                if(responseObject.headers){
                    Object.keys(responseObject.headers).forEach((h) => {
                        res.header(h, responseObject.headers[h])
                    });
                }
                res
                .status(responseObject.status)
                .set('Access-Control-Expose-Headers', 'Authorization, Date')
                .send(responseObject.contentParsed);
            }else{
                let filePath = api.location + responseObject.bodyFileAttached;
                filePath = path.join(__dirname, filePath);
                res.sendFile(filePath);
            }
        }
    }




}


module.exports = {
    cleanEndpoint,
    exists,
    get,
    getAll,
    getEndpoints,
    getResponse,
    getRoutes,
    handle,
    load,
}