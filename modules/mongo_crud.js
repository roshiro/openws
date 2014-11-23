(function() {
  var mongo = require('mongodb');

  var _apiKey = function(req) {
    return req.param("apiKey");
  },

  _getNamespace = function(req, res) {
    var apiKey = _apiKey(req);
    if(apiKey && apiKey.length == 0) {
      // Error
    }
    return "app";
  },

  _collection = function(req, res) {
    return _getNamespace(req, res) + "." + req.params.collection;
  };

  exports.findAll = function(req, res) {
    var params = req.params;
    var query = req.param("q");
    var callback = function(error, objs) {
      if (error) {
        res.send(400, error);
      } else {
        res.set('Content-Type','application/json');
        res.send(200, objs);
      }
    };

    if(query) {
      collectionDriver.find(_collection(req,res), JSON.parse(query), callback);
    } else {
      collectionDriver.findAll(_collection(req,res), callback);
    }
  };

  exports.get = function(req, res) {
    var params = req.params;
    var entity = params.entity;

    if (entity) {
      collectionDriver.get(_collection(req,res), entity, function(error, objs) {
        if (error) { res.send(400, error); }
        else { res.send(200, objs); }
      });
    } else {
      res.send(400, {error: 'bad url', url: req.url});
    }
  };

  exports.find = function(req, res) {
    var query = req.param("q");
    console.log(query);
  },

  exports.create = function(req, res) {
    var object = req.body;
    collectionDriver.save(_collection(req,res), object, function(err,docs) {
      if (err) { res.send(400, err); }
      else { res.send(201, docs); }
    });
  };

  exports.update = function(req, res) {
    var params = req.params;
    var entity = params.entity;
    if (entity) {
      collectionDriver.update(_collection(req,res), req.body, entity, function(error, objs) { //B
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
    if (entity) {
      collectionDriver.delete(_collection(req,res), entity, function(error, objs) { //B
        if (error) { res.send(400, error); }
        else { res.send(200, objs); }
      });
    } else {
       var error = { "message" : "Cannot DELETE a whole collection" };
       res.send(400, error);
     }
  };

})();
