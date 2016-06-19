var walk = require('y-walk'),
    Cb = require('y-callback'),
    getUrl = require('./get-avatar-url'),
    Setter = require('y-setter'),
    {Hybrid} = Setter,
    updatePeer;

updatePeer = walk.wrap(function*(data,peer){
  var id,info,pdata;

  if(peer.info) id = (yield peer.info).id;
  else id = peer.id;

  pdata = data.peers[id] = data.peers[id] || {};
  pdata.avatar = peer.avatar.value;
  if(peer.info) pdata.self = true;

});

exports.addMsg = walk.wrap(function*(room,peer,msg){
  var db = yield require('./db'),
      t0,t1,storage,req,data,id;

  t0 = new Date();
  yield msg.frozen();
  t1 = new Date();

  if(!msg.value) return;
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

  if(peer.info) id = (yield peer.info).id;
  else id = peer.id;

  data.messages[`${id}/${msg.id}`] = {
    message: msg.value,
    peer: id,
    t0: t0,
    t1: t1
  };

  yield updatePeer(data,peer);
  db.transaction(['history'],'readwrite').objectStore('history').put(data,room);

});

exports.updatePeer = walk.wrap(function*(room,peer){
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

  yield updatePeer(data,peer);
  db.transaction(['history'],'readwrite').objectStore('history').put(data,room);

});

exports.apply = walk.wrap(function*(room,messages){
  var db = yield require('./db'),
      storage,req,data,newData,key,
      array,blocks,msg,block,tmp;

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
        avatar: new Hybrid((newData.peers[block.peer] || {}).avatar)
      };

      block.peer.avatar.url = getUrl(block.peer.avatar);
      block.peer.avatar.freeze();

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
      avatar: new Hybrid((newData.peers[block.peer] || {}).avatar)
    };

    block.peer.avatar.url = getUrl(block.peer.avatar);
    block.peer.avatar.freeze();

    blocks.push(block);
    block = null;

  }

  messages.value.unshift(...blocks);
  messages.update();

  storage.put(newData,room);

});

function t0Sort(a,b){
  if(a.t0 > b.t0) return 1;
  if(a.t0 < b.t0) return -1;
  return 0;
}
