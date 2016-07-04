var walk = require('y-walk'),
    Cb = require('y-callback');

module.exports = walk(function*(){
  var req,res,db,version;

  req = indexedDB.open('chatiku',4);

  res = yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb(),
    blocked: req.onblocked = Cb(),
    upgrade: req.onupgradeneeded = Cb()
  };

  if(res.upgrade){

    version = res.upgrade[0].oldVersion;
    db = req.result;

    if(version < 2) db.createObjectStore('profile');
    if(version < 3) db.createObjectStore('history');
    if(version < 4) db.createObjectStore('configuration');

    res = yield {
      success: req.onsuccess = Cb(),
      error: db.onerror = req.onerror = Cb(),
      blocked: req.onblocked = Cb(),
      upgrade: req.onupgradeneeded = Cb()
    };

  }

  if(res.error) throw res.error;
  return req.result;
});
