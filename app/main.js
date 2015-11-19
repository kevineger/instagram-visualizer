var app = require('app');  // Module to control application life.
const BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();
var rp = require('request-promise');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    'width': 1050,
    'height': 768,
    'min-width': 1050,
    'min-height': 768,
    'auto-hide-menu-bar': true,
    'center': true
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.openDevTools();

  // Build the OAuth consent page URL
  var authWindow = new BrowserWindow({ width: 800, height: 600, show: true, 'node-integration': false, 'always-on-top': true});
  var authUrl = "https://api.instagram.com/oauth/authorize/?client_id=20020af689ea4d66a623067196c2987a&redirect_uri=http%3A%2F%2Flocalhost%3A8000&response_type=code";
  authWindow.loadUrl(authUrl);
  authWindow.show();

   var raw_code = null;
  // Handle the response from instagram
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

                authWindow.close();
            })
            .catch(function (err) {
                console.log(err);
            });
    }



  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});