var before = [
      [/¢|©/g,'c'],
      [/£/g,'l'],
      [/€/g,'e'],
      [/¥/g,'y'],
      [/§|\$/g,'s'],
      [/ª/g,'a'],
      [/®/g,'r'],
      [/°|º|0/g,'o'],
      [/¹/g,'1'],
      [/²/g,'2'],
      [/³/g,'3'],
      [/ß|6/g,'b']
    ],
    after = [
      [/œ/g,'oe'],
      [/ð/g,'d'],
      [/ñ/g,'n'],
      [/þ/g,'p'],
      [/ò|ó|ô|õ|ö|ø/g,'o'],
      [/ù|ú|û|ü/g,'u'],
      [/ž/g,'z'],
      [/ÿ|ý/g,'y'],
      [/à|á|â|ã|ä|å|4/g,'a'],
      [/ç/g,'c'],
      [/è|é|ê|ë|3/g,'e'],
      [/ì|í|î|ï|l|1/g,'i'],
      [/æ/g,'ae'],
      [/š|5/g,'s'],
      [/[^a-z0-9]/g,'']
    ];

module.exports = function(room){
  var rule,or;

  room = (room || '').toString();
  if(room.charAt(0) == '!') return room;

  for(rule of before) room = room.replace(...rule);
  room = room.toLowerCase();
  for(rule of after) room = room.replace(...rule);

  do{
    or = room;
    room = room.replace(/(.+)\1+/g,'$1');
  }while(or != room);

  return room;
};
