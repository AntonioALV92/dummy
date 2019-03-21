// const protagonist = require('protagonist');

// function parseRequests(transitions) {
//     let ret = [];
//     let tranFilt = [];


//     transitions.forEach((transition) => {
//         if (transition.element == 'httpTransaction') {
//             let request = transition.content[0];
//             let response = transition.content[1];
//             let tran = {
//                 response: {},
//             };

//             tran.method = request.attributes.method.content;
//             // console.log('tran.response:', JSON.stringify(response, null, 2));
//             tran.response.statusCode = response.attributes.statusCode.content;
//             tran.response.headers = response.attributes.headers.content.map((h) => {
//                 return {
//                     name: h.content.key.content,
//                     value: h.content.value.content,
//                 }
//             });
//             tran.response.contentType = response.attributes.headers.content[0].content.value.content;
//             let parsedContent = undefined;
//             let responseContent = response.content[0].element == 'asset' ? response.content[0]:response.content[1];
//             tran.response.label = response.content[0].element == 'copy' ? response.content[0].content.substr(12) : tran.response.statusCode;
//             if (responseContent.content.indexOf('<') !== -1) {
//                 parsedContent = tran.response.content = /\s*\<\!\-\-\s*include\((.*)\)\s*\-\-\>/
//                     .exec(responseContent.content.trim())[1];
//                 tran.response.contentFormat = 'fileInclude';
//             } else {
//                 parsedContent = JSON.parse(responseContent.content);
//                 tran.response.contentFormat = 'json';
//             }
//             tran.response.content = parsedContent;
//             let strTran = JSON.stringify(tran);
//             if(tranFilt.indexOf(strTran) === -1 ){
//                 tranFilt.push(strTran);
//                 ret.push(tran);
//             }
//         }
//         // tranFilt.length = 0;
//     })
//     // console.log('ret:', ret);
//     return ret;
// }


// function parse(input) {
    
//     // console.log('input:', input);
//     let parsedProtagonist = protagonist.parseSync(input);
//     let contenidoAPI = parsedProtagonist.content[0].content[0];
//     // console.log('----> ENDPOINT_API:', contenidoAPI.attributes.href.content);
//     // console.log('parsedProtagonist:', JSON.stringify(parsedProtagonist));
//     // console.log('contenidoAPI:', contenidoAPI.content[0].content);
//     let apiParsed = {
//         title: contenidoAPI.meta.title.content,
//         endPoint: contenidoAPI.attributes.href.content,
//         transitions: parseRequests(contenidoAPI.content[0].content)
//     }

//     let reparsed = reparse(apiParsed);
//     // console.log("------ REPARSED "+apiParsed.title+"----- ");
//     // console.log(JSON.stringify(reparsed, null, 2));
//     return reparsed;
//     // return apiParsed;
// }


// function reparse(api){
//     let rep = {};
//     rep.title = api.title;
//     rep.endpoint = api.endPoint;
//     rep.method = api.transitions[0].method;
//     rep.responses = api.transitions.map((t) => {
//         // console.log('t:', t);
//         t = t.response;
//         return {
//             status: t.statusCode,
//             label: t.label,
//             headers: remapHeaders(t.headers),
//             body: t.contentFormat == 'json' ? t.content : undefined,
//             bodyFile: t.contentFormat == 'fileInclude' ? t.content: undefined,
//         }
//     });
//     return rep;
// }


// function remapHeaders(headers) {
//     let res = {};
//     headers = headers || [];
//     headers.forEach((h) => {
//         res[h.name] = h.value
//     });
//     return res;
// }

// module.exports = { parse };