
module.exports = function(room){
  return (room || '').toString().
          replace(/[^a-zA-Z0-9À-Ïà-ïÐ-Öð-öØ-ßø-ÿ¢-ª®°²-Žž¹ºŒ-Ÿ\$€]/g,'-').
          replace(/\-\-+/g,'-').
          replace(/\-$/,'').
          replace(/^\-/,'');
};
