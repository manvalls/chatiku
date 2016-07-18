var walk = require('y-walk'),
    Cb = require('y-callback'),
    getUrl = require('./get-avatar-url'),
    {avatars: defaultAvatars} = require('./constants'),
    Setter = require('y-setter'),
    {Hybrid} = Setter,
    updatePeer;

updatePeer = walk.wrap(function*(data,peer,avatars,scope){
  var id,info,pdata;

  avatars = avatars || {};
  if(peer.info) id = (yield peer.info).id;
  else id = peer.id;

  pdata = data.peers[id] = data.peers[id] || {};
  pdata.avatar = (peer.avatar || {}).value || pdata.avatar || scope + '.assets' + defaultAvatars[
    id.charCodeAt(id.length - 1) % defaultAvatars.length
  ];

  if(avatars[id]) avatars[id].value = pdata.avatar;
  if(peer.info) pdata.self = true;

});

exports.addMsg = walk.wrap(function*(room,peer,msg,avatars,scope,t0,t1){
  var db = yield require('./db'),
      storage,req,data,id;

  t0 = t0 || new Date();
  yield msg.frozen();
  t1 = t1 || new Date();

  if(!msg.value) return;
  if(peer.info) yield peer.info;
  
  storage = db.transaction(['history'],'readwrite').objectStore('history');
  req = storage.get(room);

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

  data = req.result || {
    messages: {},
    peers: {}
  };

  if(peer.info) id = (yield peer.info).id;
  else id = peer.id;

  data.messages[`${id}/${msg.id}`] = {
    message: msg.value,
    peer: id,
    t0: t0,
    t1: t1
  };

  yield updatePeer(data,peer,avatars,scope);
  storage.put(data,room);

});

exports.updatePeer = walk.wrap(function*(room,peer,avatars){
  var db = yield require('./db'),
      storage,req,data;

  if(peer.info) yield peer.info;
  storage = db.transaction(['history'],'readwrite').objectStore('history');
  req = storage.get(room);

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

  data = req.result || {
    messages: {},
    peers: {}
  };

  yield updatePeer(data,peer,avatars);
  storage.put(data,room);

});

exports.apply = walk.wrap(function*(room,messages,avatars){
  var db = yield require('./db'),
      storage,req,data,newData,key,
      array,blocks,msg,block,tmp;

  avatars = avatars || {};
  storage = db.transaction(['history'],'readwrite').objectStore('history');
  req = storage.get(room);

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

  data = req.result || {
    messages: {},
    peers: {}
  };

  newData = {
    messages: {},
    peers:{}
  };

  array = [];
  for(key of Object.keys(data.messages)){

    if(Date.now() - data.messages[key].t0 > 24 * 3600e3){
      delete data.messages[key];
      continue;
    }

    array.push(data.messages[key]);
    newData.messages[key] = data.messages[key];
    newData.peers[newData.messages[key].peer] = data.peers[newData.messages[key].peer];

  }

  array.sort(t0Sort);
  blocks = [];

  for(msg of array){

    if(block && (block.peer != msg.peer || block.date.value < msg.t0 - 10e3)){

      block.peer = {
        avatar: avatars[block.peer] = avatars[block.peer] || new Hybrid((newData.peers[block.peer] || {}).avatar)
      };

      block.peer.avatar.url = block.peer.avatar.url || getUrl(block.peer.avatar);
      blocks.push(block);
      block = null;

    }

    if(!block){

      tmp = new Setter([]);
      tmp.freeze();

      block = {
        self: (newData.peers[msg.peer] || {}).self,
        peer: msg.peer,
        type: 'block',
        messages: new Hybrid([]),
        date: new Hybrid(msg.t1)
      };

    }

    tmp = new Setter(msg.message);
    tmp.freeze();
    block.messages.value.push(tmp.getter);
    block.date.value = msg.t1;

  }

  if(block){

    block.peer = {
      avatar: avatars[block.peer] = avatars[block.peer] || new Hybrid((newData.peers[block.peer] || {}).avatar)
    };

    block.peer.avatar.url = block.peer.avatar.url || getUrl(block.peer.avatar);
    blocks.push(block);
    block = null;

  }

  messages.value.unshift(...blocks);
  messages.update();

  storage.put(newData,room);

});

exports.getAvatar = walk.wrap(function*(room,id,scope){
  var db = yield require('./db'),
      storage,req,data;

  storage = db.transaction(['history'],'readonly').objectStore('history');
  req = storage.get(room);

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

  data = req.result || {
    messages: {},
    peers: {}
  };

  return (data.peers[id] || {}).avatar || scope + '.assets' + defaultAvatars[
    id.charCodeAt(id.length - 1) % defaultAvatars.length
  ];
});

exports.erase = walk.wrap(function*(room){
  var db = yield require('./db'),
      req = db.transaction(['history'],'readwrite').objectStore('history').delete(room);

  yield {
    success: req.onsuccess = Cb(),
    error: req.onerror = Cb()
  };

});

function t0Sort(a,b){
  if(a.t0 > b.t0) return 1;
  if(a.t0 < b.t0) return -1;
  return 0;
}
