let socket = io();
let app = angular.module('dummyServices', ['ngMaterial', 'ngMessages', 'hljs']);
app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('amber')
      .accentPalette('green');

  });
app.controller('mainCtrl', ($scope, $timeout) => {
    $scope.test = "Hola";
    $scope.apis = null;
    $scope.responses = {};
    $scope.isShownR = {};
    socket.emit('getApis', null);

        
    socket.on('apis', (data) => {

        $timeout(() => {
            let apis = data.apis;
            let config = data.config;
            $scope.apis = JSON.parse(apis).map((a) => a.parsed);
            $scope.apis = $scope.apis.map((a) => {
                let idxT = config[a.endpoint] || 0;
                a.responses = a.responses.map((t, idx) => {
                    if(idx == idxT){
                        t.enabled = true;
                    } else {
                        t.enabled = false;
                    }
                    return t;
                });
                return a;
            })
            // console.log('$scope.apis:', $scope.apis);
        });
    })

    $scope.changeTransition = (p, t) => {
        let idxT = p.responses.findIndex((tr) => {
            let cond = true;
            if(t.bodyFile){
                cond &= tr.bodyFile == t.bodyFile;
            } else {
                cond &= tr.body == t.body;
            }
            return cond &&  tr.status == t.status;
        })

        p.responses = p.responses.map((tr, idx) => {
            if(idx == idxT){
                tr.enabled = true;
            } else {
                tr.enabled = false;
            }
            return tr;
        });

        socket.emit('setResponse', {
            transitionIdx: idxT,
            endpoint: p.endpoint,
        });

        // $scope.isShownR[p.endpoint] = false;
        if($scope.isShownR[p.endpoint]) {
            $scope.getResponse(p, idxT);
        }

    }
    
    $scope.getResponse = (p, idx) => {
        let tridx = p.responses.findIndex((tr) => {
            return tr.enabled
        });

        socket.emit('pedirResponse', {
            transitionIdx: tridx,
            endpoint: p.endpoint,
        });

        $scope.isShownR[p.endpoint] = true;

        // hljs.initHighlightingOnLoad();
    }
    
    socket.on('getResponse', (response) => {
        $timeout(() => {
            $scope.responses[response.endpoint] = JSON.stringify(JSON.parse(response.contentParsed), null, 2);
        });
    })
}); 