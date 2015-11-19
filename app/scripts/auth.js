const BrowserWindow = require('remote').require('browser-window');
var vis = require('../scripts/instavis');
var rp = require('request-promise');


// Build the OAuth consent page URL
var authWindow = new BrowserWindow({ width: 800, height: 600, show: true, 'node-integration': false, 'always-on-top': true});
var authUrl = "https://api.instagram.com/oauth/authorize/?client_id=20020af689ea4d66a623067196c2987a&redirect_uri=http%3A%2F%2Flocalhost%3A8000&response_type=code";
authWindow.loadUrl(authUrl);
authWindow.show();

console.log("test: Stuff is happening!!");

var raw_code = null;
// Handle the response from instgram
authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
    try {
        //Convert er' to a string
        raw_code = newUrl.toString();
        console.log("FULL URL: "+ raw_code);
        //Grab the fucking code here.

        raw_code = raw_code.substr(newUrl.indexOf('=')+1);

        //TODO: remove shitty console logging.
        console.log("RAW CODE: " + raw_code);
        getToken(raw_code);
    }
    catch (Exception) {
        console.log(Exception);
        //TODO: Something Useful Here
    }
});


function getToken(raw_code){
    console.log("GETTING THE MOTHERFUCKING TOKEN");
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
            console.log("test: " + parsedBody.access_token);
            vis.vis(parsedBody.access_token);
            authWindow.close();
        })
        .catch(function (err) {
            console.log(err);
        });
}