// mssql libraries
var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs = require('fs');

// connects to the 'bjjdb' mySQL database as 'root'
var pool = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'bjjdb'
});

http.createServer(function (request, response) {
	var q = url.parse(request.url, true);
	var filepath = "C:/Users/dmarq/Desktop/server/bjjrank/" + q.pathname;
	var qdata = q.query;
	//response.write('<div class="topnav"><a class="active" href="index.html">Home</a><a href="rank.html">Rank</a><a href="#contact">Contact</a><a href="#about">About</a></div>');
	//response.write('<style>.topnav {  background-color: #333;  overflow: hidden;}.topnav a {  float: left;  color: #f2f2f2;  text-align: center;  padding: 14px 16px;  text-decoration: none;  font-size: 17px;}.topnav a:hover {  background-color: #ddd;  color: black;}.topnav a.active {  background-color: #4CAF50;  color: white;}</style>');
	if(q.pathname == '/updateElo.php'){
		if (updateElo(2,1,'tournament') == false){
			response.writeHead(302, {'Content-Type': 'text/html'});
			response.write("error id not found in database");
		}
		response.writeHead(302, {'Location': 'index.html' });
		return response.end();
	}
	else if(q.pathname == '/addUser.php'){
		if (updateElo(2,1,'tournament') == false){
			response.writeHead(302, {'Content-Type': 'text/html'});
			response.write("error id not found in database");
		}
		response.writeHead(302, {'Location': 'index.html' });
		return response.end();
	}
	else if(q.pathname == '/rank.html' || q.pathname == '/rank.php'){
		pool.getConnection(function (err, connection) {
			if(q.pathname == '/rank.php'){
				if(qdata.first_name == '' && qdata.last_name == ''){
					search = '';
				} else if (qdata.first_name == ''){
					search = " WHERE last_name='"  + qdata.last_name + "'";
				} else if (qdata.last_name == '') {
					search = " WHERE first_name = '" + qdata.first_name + "'";
				} else {
					search = " WHERE first_name = '" + qdata.first_name + "' AND last_name='"  + qdata.last_name + "'";
				}
			} else {
				search = '';
			}
			
			connection.query('SELECT first_name,last_name,elo FROM people' + search + ' ORDER BY elo DESC', function(err, result){
				response.writeHead(302, {'Content-Type': 'text/html'});
				response.write('<style>table {border-collapse: collapse;width: 100%;color: #588c7e;font-family: monospace;font-size: 25px;text-align: left;}th {background-color: #588c7e;color: white;}tr:nth-child(even) {background-color: #f2f2f2}</style>');
				/* fs.readFile(filepath, function(err, data) {
					if (err) throw err;
					response.write(data);
					return response.end();
				}) */
				response.write('<div class="topnav"><a href="index.html">Home</a><a class="active" href="rank.html">Rank</a><div class="search-container"><form action="rank.php" method="get"><input type="text" name="first_name" placeholder="First Name">&nbsp;<input type="text" name="last_name" placeholder="Last Name"><button type="submit"><i class="fa fa-search"></i></button></form></div></div>');
				response.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>* {box-sizing: border-box;}body {margin: 0;font-family: Arial, Helvetica, sans-serif;}.topnav {overflow: hidden;  background-color: #588c7e;}.topnav a {  float: left;  display: block;  color: white;  text-align: center;  padding: 18px 20px;  text-decoration: none;  font-size: 17px;}.topnav a:hover {  background-color: #ddd;  color: white;}.topnav a.active {  background-color: #000000;  color: white;}.topnav .search-container {  float: right;}.topnav input[type=text] {padding: 6px;  margin-top: 8px;  font-size: 17px;  border: none;}.topnav .search-container button {  float: right;  padding: 8px 10px;  margin-top: 8px;  margin-right: 16px;  background: #ddd;font-size: 17px;  border: none;  cursor: pointer;}.topnav .search-container button:hover {  background: #ccc;}@media screen and (max-width: 600px) {  .topnav .search-container {   float: none;}  .topnav a, .topnav input[type=text], .topnav .search-container button {    float: none;    display: block;    text-align: left;    width: 100%;    margin: 0;    padding: 14px;  }  .topnav input[type=text] {    border: 1px solid #ccc;    }}</style>');
				//response.write('<form action="rank.php" method="get">First Name: <input type="text" name="first_name"><br>Last Name: <input type="text" name="last_name"><br><input type="submit"></form>');
				response.write('<p><table><tr><th>First Name</th><th>Last Name</th><th>Elo</th></tr>');
				Object.keys(result).forEach(function(key){
					response.write('<tr>' + '<th>' + result[key].first_name + '</th><th>' + result[key].last_name + '</th><th>' + result[key].elo + '</th></tr>');
				});
				response.write('</table></p>');
				response.write('<p></p>')
				
				return response.end();
			});
			
			connection.release();
		});
	}
	else {
		fs.readFile(filepath, function(err, data) {
			if (err) {
				response.writeHead(302, {'Location': 'index.html' });
				return response.end("404 Not Found");
			}
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write('<div class="topnav"><a class="active" href="index.html">Home</a><a href="rank.html">Rank</a></div>');
			response.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>* {box-sizing: border-box;}body {margin: 0;font-family: Arial, Helvetica, sans-serif;}.topnav {overflow: hidden;  background-color: #588c7e;}.topnav a {  float: left;  display: block;  color: white;  text-align: center;  padding: 18px 20px;  text-decoration: none;  font-size: 17px;}.topnav a:hover {  background-color: #ddd;  color: white;}.topnav a.active {  background-color: #000000;  color: white;}.topnav .search-container {  float: right;}.topnav input[type=text] {padding: 6px;  margin-top: 8px;  font-size: 17px;  border: none;}.topnav .search-container button {  float: right;  padding: 8px 10px;  margin-top: 8px;  margin-right: 16px;  background: #ddd;font-size: 17px;  border: none;  cursor: pointer;}.topnav .search-container button:hover {  background: #ccc;}@media screen and (max-width: 600px) {  .topnav .search-container {   float: none;}  .topnav a, .topnav input[type=text], .topnav .search-container button {    float: none;    display: block;    text-align: left;    width: 100%;    margin: 0;    padding: 14px;  }  .topnav input[type=text] {    border: 1px solid #ccc;    }}</style>');
			response.write(data);
			return response.end();
		});
	}
}).listen(80);

function addUser (first_name,last_name) {
	var values = [
		[first_name,last_name]
	];
	pool.getConnection(function (err, connection) {
	connection.query(
		'INSERT INTO people (first_name,last_name) VALUES ?',[values],function(err, result){
		});
		connection.release();
	});
	
};

function updateElo(winnerid, loserid, match_type){
	pool.getConnection(function (err, connection) {
		connection.query('SELECT elo FROM people WHERE uniqueid = ? OR uniqueid = ?',[winnerid,loserid],function(err,result){
			if(err) throw err;
			if(result[0] == undefined || result[1] == undefined){
				console.log('request failed');
				return false; // request failed
			} else {
				if(winnerid < loserid){
					var winnerelo = result[0].elo;
					var loserelo = result[1].elo;
				} else {
					var winnerelo = result[1].elo;
					var loserelo = result[0].elo;
				}

				if(match_type == 'free roll'){
					var newEloarr = newElo(winnerelo,loserelo,16);
				}
				else if(match_type == 'tournament'){
					var newEloarr = newElo(winnerelo,loserelo,32);
				}
				console.log(newEloarr);
				connection.query('UPDATE people SET elo = ? WHERE uniqueid = ?',[newEloarr[0],winnerid], function(err,result1){});
				connection.query('UPDATE people SET elo = ? WHERE uniqueid = ?',[newEloarr[1],loserid], function(err,result1){});
				console.log('request succeeded');
				return true; // request succeeded
			}
		});
		connection.release();
	});
};

function newElo(winnerelo,loserelo,k_value){
	var array = [Math.floor((winnerelo + k_value*((1 - (1/(1 + (Math.pow(10,(loserelo-winnerelo)/400)))))))),Math.floor((loserelo + k_value*((0 - 1/(1 + (Math.pow(10,(winnerelo-loserelo)/400)))))))];
	return array;
};

function getData(filepath){
	fs.readFile(filepath, function(err, data) {
			if (err) throw err;
			console.log(data);
			return data;
		});
}









