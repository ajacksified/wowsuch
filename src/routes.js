var querystring = require('querystring'),
    Q = require('q'),
    http = require('http');

module.exports = function(app){
  var getDoges = function(number){
    var deferred = Q.defer();

    var query = {
      hasDictionaryDef: true,
      includePartOfSpeech: 'adjective,noun,idiom,verb-transitive',
      minCorpusCount: 1,
      maxCorpusCount: -1,
      minDictionaryCount: 2,
      maxDictionaryCount: -1,
      minLength: 3,
      maxLength: -1,
      api_key: app.config.wordnikAPIKey,
      limit: 10
    };

    var qs = querystring.stringify(query),
        url = 'http://api.wordnik.com/v4/words.json/randomWords?' + qs;

    http.get(url, function(res) {
      var body = '';

      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        var r = JSON.parse(body);
        deferred.resolve(r.map(function(word){ return word.word; }));
      });
    }).on('error', function(e) {
      deferred.reject(e.message)
    });

    return deferred.promise;
  };

  app.get('/:word', function(req, res){
    var word = decodeURIComponent(req.params.word.replace(/-/g, ' ')),
        promise = getDoges();

    var prefixes = ['wow', 'so', 'many', 'such'];

    promise.then(function(adjectives){
      var txt = 'wow such ' + word + '\n';

      adjectives.forEach(function(a){
        txt = txt + prefixes[parseInt(prefixes.length * Math.random())] + ' ' + a + '\n';
      });

      res.end(txt);
    }, function(err){
      res.end(err)
    });
  });
};

