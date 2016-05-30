
module.exports = function(avatar){
  var ourl,osrc;

  avatar.frozen().then(function(){
    if(ourl) URL.revokeObjectURL(ourl);
  });

  return avatar.to(function(src){

    if(ourl){
      if(osrc === src) return ourl;
      URL.revokeObjectURL(ourl);
      ourl = null;
      osrc = null;
    }

    if(src instanceof Blob){
      ourl = URL.createObjectURL(src);
      osrc = src;
      return ourl;
    }
    
    return src;
  });
};
