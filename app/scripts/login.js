var $ = require('jquery');
var request = require('request');
console.log('working');
// request('https://api.instagram.com/oauth/authorize/?client_id=20020af689ea4d66a623067196c2987a&redirect_uri=http://localhost:8000&response_type=code', function (error, response, body) {
// // request('http://google.com', function (error, response, body) {
//   console.log(response);
//   console.log('what the heck');
//   console.log(response.statusCode);
//   if (!error && response.statusCode == 200) {
//     document.write(body);
//     // console.log(response);
//   } else if (!error) {
//     console.log(response);
//   }
// })
var jqxhr = $.get( "https://api.instagram.com/oauth/authorize/?client_id=20020af689ea4d66a623067196c2987a&redirect_uri=http://localhost:8000&response_type=code", function(){})
  .done(function(response)  {
    console.log(response);
    document.write(response);
  })
  .fail(function() {
    alert( "error" );
  });
