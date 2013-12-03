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
      limit: 12
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

  var getPrefix = function(){
    var prefixes = ['wow ', 'so ', 'many ', 'such ', 'much '],
        prefix = '';

    if(Math.random() > .25){
      prefix = prefixes[parseInt(prefixes.length * Math.random())];
    }

    return prefix;
  };

  var getSuffix = function(){
    var suffixes = ['!', ' wow'],
        suffix = '';

    if(Math.random() > .66){
      suffix = suffixes[parseInt(suffixes.length * Math.random())];
    }

    return suffix;
  };

  var getStartingSpacing = function(i){
    return i%2 ? '' : '   ';
  };

  var getEndingSpacing = function(i){
    return i%2 ? '\n' : '';
  };

  app.get('/:word', function(req, res){
    var word = decodeURIComponent(req.params.word.replace(/-/g, ' ')),
        promise = getDoges(),
        txt = 'wow such ' + word + '\n';

    promise.then(function(adjectives){
      adjectives.forEach(function(a, i){
        txt = txt + getPrefix() + a + getSuffix() + '\n';
      });

      res.end(txt);
    }, function(err){
      res.end(err)
    });
  });
};

