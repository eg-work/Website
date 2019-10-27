'use strict';
/*jslint node: true */
/*jshint esversion: 6 */
/*jshint browser: true */


const express = require('express');
const url = require('url');
const app = express();

// for heroku 
let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}
// const port = 4000;

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



// include sqlite3
const sqlite3 = require('sqlite3').verbose();



// test database
// const testfilepath = path.resolve(__dirname, 'test.db');
// fs.unlinkSync( testfilepath, deleteFileCallback );
// function deleteFileCallback(e) {
//   console.log('delete file callback ->', e);
// }

var newdb = new sqlite3.Database('./db/test.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to test database. OK.');
});


const tabletext = `
  CREATE TABLE IF NOT EXISTS task(
    id INT,
    asset TEXT,
    indice TEXT,
    date TEXT,
    filename TEXT
  )`;
newdb.run(tabletext, [], (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Added the new table to test database. OK.');
});




function populate_table( database ) {

  function get_paths( xs ) {
    var output = [];
    for (var i = 0; i < xs.length; i++)
    {
      var folderpath  = path.join( __dirname, xs[i] );
      var foldernames = fs.readdirSync( folderpath );
      for (var j = 0; j < foldernames.length; j++)
      {
        output.push( path.join( xs[i], foldernames[j] ) );
      }
    }
    return output;
  }
  function get_all_paths(  ) {
    var assetpaths  = get_paths( ['Data'] );
    var indicepaths = get_paths( assetpaths );
    var datepaths   = get_paths( indicepaths );
    return datepaths;
  }

  var paths     = get_all_paths();
  var filepaths = paths.map(x => path.join( x, 'full.json' ));
  console.log('paths:', paths);
  console.log('filepaths:', filepaths);

  var names = paths.map(x => x.split('\\'));
  console.log('names:', names);

  const inserttext = `
  INSERT INTO task(id,asset,indice,date,filename) VALUES(?,?,?,?,?)`;

  for (var i = 0; i < names.length; i++)
  {
    database.run( inserttext, [i, names[i][1], names[i][2], names[i][3], filepaths[i]] );
  }

}
populate_table( newdb );


// query database
function query_database( database ) {
  let query_text = `
    SELECT * FROM task
  `;

  database.all( query_text, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    rows.forEach((row) => {
      console.log('row ->', row);
    });
  });

}
// query_database( newdb );


app.post('/Data/', function(req, res) {
  console.log('data requested', req.body);

  var params = req.body;
  let query_text = `
    SELECT DISTINCT filename
    FROM TASK
    WHERE asset = ? AND indice = ? AND date = ?`;

  newdb.all( query_text, [params.asset, params.indice, params.date], (err, rows) => {
    if (err) {
      return console.error('this is an error message',err.message);
    }
    var filename = rows[0].filename;
    filename = filename.replace(/\\/g, "/");
    
    // new code
    var data = fs.readFileSync( filename, 'utf-8' );
    data = JSON.parse(data);
    console.log(typeof data);
    console.log(Object.keys(data));
    console.log(data['valuelist'].slice(0,10));
    res.json( data );
    
    
//     const rl = readline.createInterface({
//       input: fs.createReadStream( filename ),
//       crlfDelay: Infinity
//     });

//     var rows = [];
//     rl.on('line', (line) => {
//       // console.log('line', line);
//       rows = line;
//     });

//     rl.on('close', () => {
//       var data = JSON.parse(rows);
//       console.log(data.valuelist.slice(0,1), '\n', data.valuelist.slice(data.valuelist.length-2,data.valuelist.length-1));
//       res.json( data );
//     });


  });
});







/* SQlite */
const dppath = path.resolve(__dirname, 'finance_data.db');
console.log(dppath);
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






// pull folder names
app.post('/Names/', function(req, res) {

  console.log('\n',req.body);

  var assetname = req.body.assetname;
  var indexname = req.body.indexname;
  var datename  = req.body.datename;


  if (datename != undefined) {
    if (datename == 'all') {
      var foldernames = fs.readdirSync('Data/' + assetname + '/' + indexname + '/');
      console.log('foldernames (dates all):', foldernames);
      return res.json({ names: foldernames });
    } else {
      // exact date wanted so bring file

    }
  }

  if (indexname == 'all') {
    var foldernames = fs.readdirSync('Data/' + assetname + '/');
    console.log('foldernames: (indexs all)', foldernames);
    return res.json({ names: foldernames });
  }


  if (assetname == 'all') {
    var foldernames = fs.readdirSync('Data/');
    foldernames = foldernames.filter(x => !x.includes('-'));
    console.log('foldernames: (assets all)', foldernames);
    return res.json({ names: foldernames });
  }





  res.json({});
});














app.listen(port, () => console.log('Example app listening on port ${port}!'));
// close database
// newdb.close((err) => {
//   if (err) {
//       return console.error(err.message);
//   }
//   console.log("Close the database connection");
// });


// remove file
// var database_filepath = 'C:\\Users\\Owner\\Desktop\\WebsiteNew\\Website\\test.db';
// fs.unlinkSync( 'test.db' );
