var {Hybrid} = require('y-setter'),
    app = require('wapp'),

    storageKeys = new Set([
      'nick',
      'avatar'
    ]),

    key;


for(key of storageKeys){
  exports[key] = new Hybrid(localStorage[key] || '');
  exports[key].connect(localStorage,key);
}

window.addEventListener('storage',function(e){
  if(!storageKeys.has(e.key) || e.storageArea != localStorage) return;
  exports[e.key].value = localStorage[key];
});

exports.status = new Hybrid(0);
