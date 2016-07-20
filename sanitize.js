var d = require('u-elem')('div');

module.exports = function(txt){
  d.textContent = txt;
  try{ return d.innerHTML; }
  finally{ d.innerHTML = ''; }
};
