var x = require('u-elem'),
    {on} = require('u-elem/hooks'),
    detacher = require('u-elem/detacher'),
    Resolver = require('y-resolver');

module.exports = function(){
  var res = new Resolver(),
      input;

  x('body',
    input = x('input',
      {
        type: 'file',
        multiple: false,
        style: {
          visibility: 'hidden',
          position: 'fixed',
          top: '0px',
          bottom: '0px',
          zIndex: -1000
        }
      },
      on('input',onChange),
      on('change',onChange)
    )
  );

  function onChange(){
    if(input.files && input.files.length) res.accept(input.files[0]);
  }

  res.yielded.listen(function(){
    input[detacher].detach();
    input.remove();
  });

  input.click();
  return res.yielded;
};
