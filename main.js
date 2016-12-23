var Mp = require('ebjs/connection/message-port'),
    Resolver = require('y-resolver'),
    walk = require('y-walk'),
    Emitter = require('y-emitter'),
    define = require('u-proto/define'),
    conn = new Resolver.Hybrid(),
    emitter = new Emitter(),
    direction = Symbol(),
    cache = Symbol(),
    em = Symbol(),
    rem = Symbol(),
    cn = Symbol(),
    ch = Symbol(),
    iku = module.exports = emitter.target;

function getYielded(key,connection){
  var res;

  connection[cache] = connection[cache] || new Map();
  if(connection[cache].has(key)) return connection[cache].get(key);

  res = new Resolver();
  connection.send([key,res]);
  connection[cache].set(key,res.yielded);

  return res.yielded;
}

iku.getNick = walk.wrap(function*(){
  return yield getYielded( 'nick', yield conn );
});

iku.getAvatar = walk.wrap(function*(){
  return yield getYielded( 'avatar', yield conn );
});

iku.getMessages = walk.wrap(function*(){
  return yield getYielded( 'messages', yield conn );
});

iku.sendMessage = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver();

  c.send(['send-msg',res,...arguments]);
  return yield res.yielded;
});

iku.showIcon = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver(),
      cnn,target;

  c.send(['show-icon',res,...arguments]);
  cnn = yield res.yielded;
  cnn.open();

  target = yield cnn.until('message');
  target[cn] = cnn;
  target[define]({
    remove: removeIcon,
    removed: untilRemoved
  });

  return target;
});

function removeIcon(){
  this[cn].detach();
}

function untilRemoved(){
  return this[cn].until('detached');
}

iku.focus = walk.wrap(function*(){
  var c = yield conn,
      res = new Resolver();

  c.send(['focus',res,...arguments]);
  return yield res.yielded;
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

  constructor(conn,dir){
    super(em);
    remote.open();
    this[cn] = conn;
    this[direction] = dir;

    conn.emitter = this[em];
    conn.once('detached',onceDetached);
    conn.open();
  }

  getNick(){
    return getYielded( 'nick', this[cn] );
  }

  getAvatar(){
    return getYielded( 'avatar', this[cn] );
  }

  getMessages(){
    return getYielded( 'messages', this[cn] );
  }

  getConnection(){
    var res = new Resolver();
    this[cn].send(['connection',res]);
    return res.yielded;
  }

  detach(){
    this[cn].detach();
  }

}

function onceDetached(){
  this.emitter.set('detached');
}

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

conn.listen(() => {
  var conn = this.value;
  
  conn.on('message',function(msg){

    switch(msg[0]){

      case 'peer':
        emitter.give('peer',new Peer(msg[1],msg[2]));
        break;

      case 'connection':
        emitter.give('connection',msg[1]);
        break;

    }

  });

  conn.open();

});
