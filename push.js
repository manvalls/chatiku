var walk = require('y-walk'),
    app = require('wapp');

exports.getSubscription = walk.wrap(function*(script){
  var reg,sub;

  [reg] = yield [
    navigator.serviceWorker.register(script,{
      scope: app.prefix + '/'
    }),
    navigator.serviceWorker.ready
  ];

  sub = yield reg.pushManager.subscribe({
    userVisibleOnly: true
  });

  return sub;
});

exports.unsubscribe = walk.wrap(function*(script){
  var reg,sub;

  [reg] = yield [
    navigator.serviceWorker.register(script,{
      scope: app.prefix + '/'
    }),
    navigator.serviceWorker.ready
  ];

  sub = yield reg.pushManager.getSubscription();
  if(sub) yield sub.unsubscribe();
});
