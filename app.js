const express = require("express");
// const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post("/", function (req, res) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/weather?";
    var units = "imperial";
    var location = req.body.cityName;
    var apiId = "ea8345ddbca4e28cb4e31fdf810a298e";
    var query = weatherApi + "units=" + units + "&q=" + location + "&appid=" + apiId;

    console.log (query);
    https.get ( query, function (response) {
        console.log ( response.statusCode );

        response.on ( "data", function (data) {
            const weatherData = JSON.parse ( data );
            if(weatherData.cod == 401){
                res.write("<p>Error Code Encountered: " + weatherData.cod + "</p>")
                res.write(weatherData.message)
            }
            else
            {
                const weatherTemp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                var icon = weatherData.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.write ( "<p>The weather is currently " + weatherDescription + "</p>" );
                res.write ( "<h1>The temperature in " + weatherData.name + " is " + weatherTemp + " degrees F</h1>", 'utf8' );
                res.write ( "<img src=" + iconUrl + " alt=\"current weather icon\"/>" );
            }
           res.send ();
        } );
    } );
});


// request(query, function(err, res, body){
//     console.log ("error: " + err);
//     console.log ("res: " + res);
//     console.log ("body: " + body);
// });
//


app.listen(port, function(){
    console.log("listening on port " + port);
});