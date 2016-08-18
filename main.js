var Mp = require('ebjs/connection/message-port'),
    Resolver = require('y-resolver'),
    walk = require('y-walk'),
    Emitter = require('y-emitter'),
    define = require('u-proto/define'),
    gon = require('gon'),
    peerG = gon(),
    conn = new Resolver.Hybrid(),
    emitter = new Emitter(),
    em = Symbol(),
    rem = Symbol(),
    cn = Symbol(),
    iku = module.exports = emitter.target;

iku.getNick = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver();

  c.send(['nick',res]);
  return yield res.yielded;
});

iku.getAvatar = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver();

  c.send(['avatar',res]);
  return yield res.yielded;
});

iku.getMessages = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver();

  c.send(['messages',res]);
  return yield res.yielded;
});

iku.sendMessage = walk.wrap(function*(msg){
  var c = yield conn;
  c.send(['msg',msg]);
});

iku.showIcon = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver(),
      cnn,target;

  c.send(['icon',res,...arguments]);
  cnn = yield res.yielded;
  cnn.open();

  target = yield cnn.until('message');
  target[cn] = cnn;
  target[define]({remove: removeIcon});
  return target;
});

function removeIcon(){
  this[cn].detach();
}

iku.focus = walk.wrap(function*(){
  var c = yield conn;
  c.send(['focus']);
});

iku.run = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver();

  c.send(['run',res,...arguments]);
  return yield res.yielded;
});

iku.close = walk.wrap(function*(){
  var c = yield conn;
  c.detach();
});

class Peer extends Emitter.Target{

  constructor(conn,remote){
    super(em);
    remote.open();

    conn.emitter = this[em];
    gon.apply(conn,peerG);
    conn.open();

    this[cn] = conn;
    this[rem] = remote;
  }

  send(msg){
    this[cn].send(msg);
  }

}

peerG.once('detached',function(){
  this.emitter.set('detached');
});

peerG.on('message',function(m){
  this.emitter.give('message',m);
});

Peer.prototype[define]({

  getNick: walk.wrap(function*(){
    var res = new Resolver();
    this[rem].send(['nick',res]);
    return yield res.yielded;
  }),

  getAvatar: walk.wrap(function*(){
    var res = new Resolver();
    this[rem].send(['avatar',res]);
    return yield res.yielded;
  }),

  getMessages: walk.wrap(function*(){
    var res = new Resolver();
    this[rem].send(['messages',res]);
    return yield res.yielded;
  })

});

// Connection handlers

if(global.document) global.addEventListener('message',function listener(e){

  if(!/https?:\/\/(localhost|(.*\.)?chatiku\.com)$/.test(e.origin)) return;
  global.removeEventListener('message',listener,false);
  conn.accept(Mp({
    in: global,
    out: e.source
  },{chunkSize: 1e6}));

},false);
else conn.accept(Mp(global,{chunkSize: 1e6}));

conn.listen(function(){

  this.value.on('message',function(msg){

    switch(msg[0]){

      case 'app':
        emitter.give('peer',new Peer(msg[1],msg[2]));
        break;

      case 'connection':
        emitter.give('connection',msg[1]);
        break;

    }

  });

  this.value.open();

});
