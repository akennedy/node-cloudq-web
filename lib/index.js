var cloudq, filed, http, path, render, request, template, transform, url, view, zeke, _ref;

path = require('path');

_ref = [require('http'), require('request'), require('zeke'), require('url'), require('filed'), require(path.join(__dirname, 'template'))], http = _ref[0], request = _ref[1], zeke = _ref[2], url = _ref[3], filed = _ref[4], template = _ref[5];

cloudq = process.env.VIEW_URL || 'http://localhost:3000/api';

view = cloudq + '/_design/queues/_view/all';

module.exports = function() {
  var server;
  server = http.createServer(function(req, res) {
    var pathname;
    pathname = url.parse(req.url).pathname;
    if (req.url === '/' && req.method === 'GET') {
      return request({
        uri: view + '?group=true',
        json: true
      }, function(e, r, b) {
        if (e != null) return res.end('DB Not Found.');
        return render(b, function(err, html) {
          return res.end(html);
        });
      });
    } else {
      return filed("./public" + pathname).pipe(res);
    }
  });
  return server.listen(process.env.PORT || 4000);
};

render = function(body, cb) {
  return cb(null, zeke.render(template, {
    qResults: transform(body.rows)
  }));
};

transform = function(rows) {
  var item, queue, results, state, _i, _len, _ref2, _ref3, _ref4;
  results = {};
  _ref2 = rows || [];
  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
    item = _ref2[_i];
    _ref3 = item.key.split('-'), queue = _ref3[0], state = _ref3[1];
    if ((_ref4 = results[queue]) == null) results[queue] = {};
    results[queue][state] = item.value;
  }
  return results;
};
