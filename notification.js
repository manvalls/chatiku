var walk = require('y-walk'),
    conf = require('./conf');

exports.show = walk.wrap(function*(room,peer,msg){

  yield msg.frozen();
  if(!msg.value) return;
  if(document.hasFocus() && !document.hidden) return;
  if(!(yield conf(room,'notifications')).value) return;

  (yield navigator.serviceWorker.ready).showNotification(peer.nick.value,{
    body: msg.value,
    icon: peer.avatar.url.value,
    tag: room,
    renotify: true,
    requireInteraction: true
  });

});

exports.clean = walk.wrap(function*(room){
  var registration,notifications,notification;

  if(!(yield conf(room,'notifications')).value) return;
  registration = yield navigator.serviceWorker.ready;
  notifications = yield registration.getNotifications();

  for(notification of notifications) if(notification.tag == room) notification.close();
});
