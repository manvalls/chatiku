var {on} = require('u-elem/hooks'),
    height = 28,
    width = 50,
    border = 2;

module.exports = setter => ['div',
  on('click',e => setter.value = !setter.value),
  {
    style:{
      borderRadius: `${height / 2}px`,
      height: `${height}px`,
      width: `${width}px`,
      background: 'rgb(233, 233, 233)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }
  },
  ['div',
    {
      style: {
        width: `${height - border * 2}px`,
        height: `${height - border * 2}px`,
        borderRadius: '100%',
        position: 'absolute',
        transition: 'all 250ms',
        top: '0px',
        left: setter.getter.iif(`${width - height}px`,'0px'),
        zIndex: 2,
        background: 'white',
        border: `${border}px solid #737373`
      }
    }
  ],
  ['div',
    {
      style: {
        background: '#737373',
        zIndex: 1,
        width: `${width - height / 2}px`,
        height: `${height}px`,
        position: 'absolute',
        top: '0px',
        transition: 'all 250ms',
        right: setter.getter.iif(`${height / 2}px`,`${width - height / 2}px`)
      }
    }
  ]
];
