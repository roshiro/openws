var http = require('http'),
    express = require('express'),
    module = require('./modules/mongo_crud'),
    app = express();

CollectionDriver = require('./modules/collection_driver').CollectionDriver;
MongoClient = require('mongodb').MongoClient;
Server = require('mongodb').Server;

var mongoHost = 'localhost',
    mongoPort = 27017,
    mongoClient = new MongoClient(new Server(mongoHost, mongoPort));

collectionDriver = null;

mongoClient.open(function(err, mongoClient) {
  if (!mongoClient) {
    console.error("Error! Exiting... Must start MongoDB first");
    process.exit(1);
  }
  var db = mongoClient.db("Openws");
  collectionDriver = new CollectionDriver(db);
  console.info("Database connection OK");
});

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());

app.use(express.bodyParser());
app.get('/:collection', module.findAll);
app.get('/:collection/:entity', module.get);
app.post('/:collection', module.create);
app.put('/:collection/:entity', module.update);
app.delete('/:collection/:entity', module.delete);
// app.get('/cruds', module.findAll);
// app.get('/cruds/:id', module.findById);
// app.post('/cruds', module.create);
// app.delete('/cruds/:id', module.delete);
// app.put('/cruds/:id', module.update);

app.listen(3000);
// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
// console.log('Listening on port 3000...');
