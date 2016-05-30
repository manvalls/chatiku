var {Hybrid} = require('y-setter'),
    getAvatarUrl = require('./get-avatar-url'),
    walk = require('y-walk'),
    Cb = require('y-callback'),
    {unique} = require('u-rand'),

    storageKeys = new Set([
      'nick',
      'avatar'
    ]),

    key,update,ignore;

for(key of storageKeys){
  exports[key] = new Hybrid();
}

exports.status = new Hybrid(0);
exports.avatar.url = getAvatarUrl(exports.avatar);

function* watcher(v,ov,d,key){
  var storage,req;

  if(ignore) return;
  storage = (yield require('./db')).transaction(['profile'],'readwrite').objectStore('profile');
  req = storage.get(key);

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

  if(v !== req.result){
    req = storage.put(v,key);

    yield {
      success: req.onsuccess = Cb(),
      error: req.onerror = Cb()
    };

    localStorage.reload = unique();
  }

}

update = walk.wrap(function*(){
  var storage = (yield require('./db')).transaction(['profile']).objectStore('profile'),
      key,req,res;

  for(key of storageKeys){

    req = storage.get(key);

    res = yield {
      success: req.onsuccess = Cb(),
      error: req.onerror = Cb()
    };

    ignore = true;
    if(res.success) exports[key].value = req.result;
    ignore = false;

  }

});

window.addEventListener('storage',function(e){
  if(e.key != 'reload' || e.storageArea != localStorage) return;
  update();
});

walk(function*(){
  var storage = (yield require('./db')).transaction(['profile'],'readwrite').objectStore('profile'),
      req;

  for(key of storageKeys){

    req = storage.get(key);

    yield {
      success: req.onsuccess = Cb(),
      error: req.onerror = Cb()
    };

    if(req.result) exports[key].value = req.result;
    else if(exports[key].value){

      req = storage.put(exports[key].value,key);

      yield {
        success: req.onsuccess = Cb(),
        error: req.onerror = Cb()
      };

      localStorage.reload = unique();

    }

    exports[key].watch(watcher,key);

  }

});
