var walk = require('y-walk'),
    Cb = require('y-callback');

module.exports = walk(function*(){
  var req,res,db;

  req = indexedDB.open('chatiku',2);

  res = yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb(),
    blocked: req.onblocked = Cb(),
    upgrade: req.onupgradeneeded = Cb()
  };

  if(res.upgrade){

    db = req.result;
    db.createObjectStore('profile');

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
