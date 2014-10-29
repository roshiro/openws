(function() {
  var mongo = require('mongodb');

  exports.findAll = function(req, res) {
    var params = req.params;
    collectionDriver.findAll(req.params.collection, function(error, objs) {
      if (error) {
        res.send(400, error);
      } else {
        res.set('Content-Type','application/json');
        res.send(200, objs);
      }
    });
  };

  exports.get = function(req, res) {
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;

    if (entity) {
      collectionDriver.get(collection, entity, function(error, objs) {
        if (error) { res.send(400, error); }
        else { res.send(200, objs); }
      });
    } else {
      res.send(400, {error: 'bad url', url: req.url});
    }
  };

  exports.create = function(req, res) {
    var object = req.body;
    console.info("CREATE called " + object);
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
      if (err) { res.send(400, err); }
      else { res.send(201, docs); }
    });
  };

  exports.update = function(req, res) {
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
      collectionDriver.update(collection, req.body, entity, function(error, objs) { //B
        if (error) { res.send(400, error); }
        else { res.send(200, objs); }
      });
     } else {
       var error = { "message" : "Cannot PUT a whole collection" };
       res.send(400, error);
     }
  };

  exports.delete = function(req, res) {
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
      collectionDriver.delete(collection, entity, function(error, objs) { //B
        if (error) { res.send(400, error); }
        else { res.send(200, objs); }
      });
    } else {
       var error = { "message" : "Cannot DELETE a whole collection" };
       res.send(400, error);
     }
  };

})();
