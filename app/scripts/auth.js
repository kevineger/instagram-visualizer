const BrowserWindow = require('remote').require('browser-window');
var vis = require('./cytoviz');
var rp = require('request-promise');
var instawrapper = require('instawrapper');

// Build the OAuth consent page URL
var authUrl = "https://api.instagram.com/oauth/authorize/?client_id=20020af689ea4d66a623067196c2987a&redirect_uri=http%3A%2F%2Flocalhost%3A8000&response_type=code";

var authCallback;

function setUserID(uid){
    userID = uid;
}


function login(){
    var authWindow = new BrowserWindow({ width: 800, height: 600, show: true, 'node-integration': false, 'always-on-top': true});
    var ses = authWindow.webContents.session;
    ses.clearStorageData(function(success, error){
    });

    authWindow.loadUrl(authUrl);
    //Display the window for the user login
    authWindow.show();
    var raw_code = null;
    // Handle the response from instagram
    authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
        try {
            //Convert it to a string
            raw_code = newUrl.toString();
            //Pull the code out of the return.
            //This could be done much cleaner probably...
            raw_code = raw_code.substr(newUrl.indexOf('=')+1);
            getToken(raw_code);
        }
        catch (Exception) {
            console.log(Exception);
            //TODO: Something Useful Here
        }
    });
    
    /**
    * Method that returns the user token given the first return from the twitter API
    * @param raw_code the first return from the twitter API
    */
    function getToken(raw_code){
        var options = {
            method: 'POST',
            uri: 'https://api.instagram.com/oauth/access_token',
            form: {
                client_id: '20020af689ea4d66a623067196c2987a',
                client_secret: '3a67d854fc304f32b930c291be26c621',
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:8000',
                code: '' + raw_code
            },
            headers:{
                'content-type': 'application/x-www-form-urlencoded'
            },
            json: true // Automatically stringifies the body to JSON
        };
        rp(options)
            .then(function (parsedBody) {
                authWindow.close();
                parsedBody.user.access_token = parsedBody.access_token;
                authCallback(parsedBody.user);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

}
exports.login = login;
    
function draw(uid){
    vis.vis(uid);
}
exports.afterAuthCallback = function(callback){
    authCallback = callback;
}
exports.draw = draw;