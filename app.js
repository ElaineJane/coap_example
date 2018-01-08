var coap = require('coap');
var mysql = require('mysql');

var server = coap.createServer();
var config = require('./db-config.json');
var pool = mysql.createPool(config)

server.on('request', function(req,res){
	console.log('get the data');
	var payload = req.payload.toString();
	var ser = new Array();
	ser = payload.split(',');
	var temp = ser[0];
	var hum = ser[1];
	var light = ser[2];
	var device_id = ser[3];
	console.log('device id:%s, temperature:%s, humidity:%s, light:%s \n',device_id,temp,hum,light);

	pool.getConnection(function(err, connection){
		connection.query('insert into sensor_history set device_id=?, temp=?, hum = ?,light=?,time=NOW()',
			[device_id,temp,hum,light],
			function(err, results){
				if(err){
					console.log(err.message);
				}
				console.log('Data insert successfully!');
				connection.release;
			})
	})
})

server.listen(function() {
  console.log('server started')
}) 
