let express = require('express');
let mysql = require('mysql');
var connect = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'sampleDB'
});

mysql.createConnection.connect(function(error){
if(!!error){
    console.log('Error');
} else {
    console.log('Connected');
}
});

app.get('/', function (req, resp) {
    connection.query("SELECT * FROM sampleDB", function(error, rows, fields,){
    if(!!error) {
        console.log('Error in the query');
} else {
    console.log('Successful query');
}
});
})


app.listen(1337);