var walk = require('y-walk'),
    Cb = require('y-callback'),
    {Hybrid} = require('y-setter');

module.exports = walk.wrap(function*(room,property,h){
  var db = yield require('./db'),
      req = db.transaction(['configuration'],'readwrite').objectStore('configuration').get(room),
      result = h || new Hybrid(),
      data;

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

  data = req.result || {};
  result.value = data[property];
  result.observe(result.value,updateConf,room,property);
  return result;
});

function* updateConf(v,ov,d,room,property){
  var db = yield require('./db'),
      storage = db.transaction(['configuration'],'readwrite').objectStore('configuration'),
      req = storage.get(room),
      data;

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

  data = req.result || {};
  data[property] = v;
  storage.put(data,room);
}
