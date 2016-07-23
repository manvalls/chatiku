var x = require('u-elem'),
    manifest = '2FivkF23UfMvHqY';

module.exports = function(src){
  module.exports.remove();
  global[manifest] = x(['link',{rel: 'manifest',href: src}]);
  x('head',global[manifest]);
};

module.exports.remove = function(){

  if(global[manifest]){
    global[manifest].remove();
    delete global[manifest];
  }
  
};
