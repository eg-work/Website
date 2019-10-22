'use strict';
/*jslint node: true */
/*jshint esversion: 6 */
/*jshint browser: true */


const express = require('express');
const url = require('url');
const app = express();
const port = 4000;

var path = require('path');
var jquery = require('jquery');
var csv = require('fast-csv');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb', extended: true, parameterLimit: 100 }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100 }));




// app.use( express.json() );
app.use( express.static('Index') );

















/* SQlite */
const dppath = path.resolve(__dirname, 'finance_data.db')
console.log(dppath);
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(dppath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database');


    var nums = ["01", "03", "09", "12", "15", "16"];
    // for (var count=0;count<nums.length;count++) {
    //     var idx=count+200;
    //     var datestring = nums[count] + "-05-19";
    //     var indexname="FTSE100";
    //     var filename="TICK#WallStreet#"+nums[count] + "-05-19.csv";
    //     db.run('INSERT INTO data(ID,DATE,INDEXNAME,FILENAME) VALUES(?,?,?,?)', [idx, datestring, indexname, filename]);
    // }
});








/* Server && Database */
console.log("dirname", __dirname);
var path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
    console.log("req path:", req.route.path);
    console.log("req url:", req.url);
    console.log("req params:", req.params);

    var options = {
        root: __dirname
    };
    res.sendFile('index.html', options);
});

// assettype=Forex?indexname=WallStreet?date=15-04-19
// app.get('/Market Data/')
app.get('/MarketData/*', function(req, res) {
    console.log("req path:", req.route.path);
    console.log("req url:", req.url);
    console.log("req params:", req.params);

    var options = req.url.replace('/MarketData/','');
    options = options.split("?");
    options = options.map(x => x.split("="));

    console.log("Options", options);


    var assettype = options.filter(x => x[0] == "assettype"); assettype = assettype[0][1];
    var indexname = options.filter(x => x[0] == "indexname"); indexname = indexname[0][1];
    var date = options.filter(x => x[0] == "date"); date = date[0][1];


    var file_name = 'TICK#WallStreet#16-05-19.csv';


    console.log(date, indexname);
    var dateStr = date;
    var indexStr = indexname.toUpperCase();
    let sql_cmd = `SELECT FILENAME FROM data WHERE DATE=? AND INDEXNAME=?`;
    // *** file_name is to be from the database !!! *** //
    db.all(sql_cmd, [dateStr, indexStr], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log("row!!", row);
            file_name = row.FILENAME;
            console.log(assettype, indexname, date);
    var file_path = path.join('Data', date, indexname, file_name);
    console.log("Filepath:", file_path);

    var stream = fs.createReadStream( file_path );

    const rl = readline.createInterface({
        input: fs.createReadStream( file_path ),
        crlfDelay: Infinity
    });

    var rows = [];
    rl.on('line', (line) => {
        rows.push(line.split(","));
    });
    rl.on('close', () => {
        console.log("Data collection done");
        // console.log(rows[0]);
        // console.log(rows[1]);

        var date_window_start = new Date(2019, Number(date.split("-")[1])-1, Number(date.split("-")[0]), 1);
        var date_window_end = new Date(2019, Number(date.split("-")[1])-1, Number(date.split("-")[0]) + 1, 1);
        // console.log(date_window_start);

        date_window_start = date_window_start.getTime();
        date_window_end = date_window_end.getTime();
        // console.log(date_window_start, date_window_end);
        // console.log(new Date(1558028248557));


        var output = [];
        for (var i=1; i<rows.length; i++) {
            var timestamp = rows[i][2];
            if ((date_window_start < Number(timestamp)) && (Number(timestamp) < date_window_end)) {
                var row_json = { timestamp: rows[i][2], date: rows[i][3], price: rows[i][4] };
                // console.log(row_json);
                output.push( row_json );
            }

        }

        res.end(JSON.stringify( output ));
    });

        });
    });











});



app.post('/menuselect/', function(req, res) {
    // console.log('req');
    // console.log(req.body);

    var name = req.body.name;

    var idx = 0;
    if (name == "Market Data") {
        idx = 1;
    }
    if (name == "Sign up") {
        idx = 2;
    }





    res.json({});
});

app.listen(port, () => console.log('Example app listening on port ${port}!'));


//  // close database
//  db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log("Close the database connection");
// });
