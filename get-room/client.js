
module.exports = function(room){
  room = (room || '').toString();
  if(room.charAt(0) == '!') return room;
  
  return  room.
          replace(/[^a-zA-Z0-9À-Ïà-ïÐ-Öð-öØ-ßø-ÿ¢-ª®°²-Žž¹ºŒ-Ÿ\$€]/g,'-').
          replace(/\-\-+/g,'-').
          replace(/\-$/,'').
          replace(/^\-/,'');
};
