var css = require('u-css'),
    app = require('wapp'),
    {unique} = require('u-rand'),
    detacher = require('u-elem/detacher'),
    bottomToTop = unique(),
    mainAnimation = unique();

// fonts

css.add('@font-face',{
  fontFamily: 'Noto Color Emoji',
  src: `url('${app.asset('/fonts/NotoColorEmoji/NotoColorEmoji.ttf')}') format('truetype')`
});

// ----

// body

css.add('html, body',{
  width: '100%',
  height: '100%',
  margin: '0px',
  padding: '0px'
});

// ----

exports.hoverOutline = unique();

css.add(`.${exports.hoverOutline}:hover`,{
  outline: '3px solid #737373'
});

css.add(`.${exports.hoverOutline}`,{
  outline: '3px solid white'
});

exports.buttonContainer = unique();
exports.smallButtonContainer = unique();
exports.column = unique();

css.add(`.${exports.column}, .${exports.buttonContainer}, .${exports.smallButtonContainer}`,{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

css.add(`.${exports.column}`,{
  minWidth: '100%',
  minHeight: '100%'
});

css.add(`.${exports.buttonContainer}`,{
  backgroundColor: '#4a4a4a',
  color: 'white',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  cursor: 'pointer'
});

css.add(`.${exports.smallButtonContainer}`,{
  backgroundColor: '#4a4a4a',
  color: 'white',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer'
});

exports.blankInput = unique();

css.add('.' + exports.blankInput,{
  background: 'none',
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  color: '#4a4a4a'
});

exports.blankButton = unique();

css.add('.' + exports.blankButton,{
  background: 'none',
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  color: '#4a4a4a',
  cursor: 'pointer',
  transition: 'color 250ms'
});

exports.button = {
  fontSize: '35px',
  lineHeight: '35px'
};

exports.smallButton = {
  fontSize: '20px',
  lineHeight: '20px'
};

css.add(`.${exports.blankButton}:focus`,{
  border: 'none',
  outline: 'none',
  boxShadow: 'none'
});

css.add(`.${exports.blankButton}:hover`,{
  color: 'black'
});

exports.textInput = unique();

css.add('.' + exports.textInput,{
  fontSize: '18px',
  fontFamily: 'Noto Sans',
  lineHeight: '18px',
  padding: '15px',
  borderRadius: '2px',
  border: '1px solid rgb(168, 168, 168)',
  color: 'black',
  backgroundColor: 'white',
  outline: 'none',
  transition: 'border 250ms',
  boxShadow: '0px 1px 1px 0px #7c7c7c'
});

css.add(`.${exports.textInput}:focus`,{
  border: '1px solid rgb(134, 134, 134)',
  outline: 'none',
  boxShadow: '0px 1px 1px 0px #7c7c7c'
});

css.add(`@keyframes ${bottomToTop}`,{

  from: {
    bottom: '-70px'
  },

  to: {
    bottom: '0px'
  }

});

exports.bottomBar = unique();

css.add('.' + exports.bottomBar,{
  position: 'fixed',
  left: '0px',
  right: '0px',
  height: '50px',
  display: 'flex',
  padding: '10px',
  bottom: '0px',
  transition: 'bottom 250ms',

  animationName: bottomToTop,
  animationDuration: '250ms'
});

css.add(`@keyframes ${mainAnimation}`,{

  from: {
    opacity: 0
  },

  to: {
    opacity: 1
  }

});

exports.mainAnimation = unique();

css.add('.' + exports.mainAnimation,{
  animationName: mainAnimation,
  animationDuration: '500ms'
});

// Bubbles

exports.rightBubble = unique();

css.add('.' + exports.rightBubble,{
  border: '1px solid rgb(209, 209, 209)',
  borderRadius: '5px',
  fontSize: '16px',
  padding: '10px',
  margin: '0px 5px',
  marginLeft: '17px',
  marginTop: '5px',
  backgroundColor: 'white',
  fontFamily: 'Noto Sans',
  position: 'relative',
  wordBreak: 'break-word'
});

css.add('.' + exports.rightBubble + '::before',{
  content: '""',
  position: 'absolute',
  borderTop: '1px solid rgb(209, 209, 209)',
  borderLeft: '1px solid rgb(209, 209, 209)',
  backgroundColor: 'white',
  transform: 'skew(43deg)',
  width: '15px',
  height: '10px',
  top: '-1px',
  left: '-6px'
});

exports.leftBubble = unique();

css.add('.' + exports.leftBubble,{
  border: '1px solid rgb(209, 209, 209)',
  borderRadius: '5px',
  fontSize: '16px',
  padding: '10px',
  margin: '0px 5px',
  marginRight: '17px',
  marginTop: '5px',
  backgroundColor: 'white',
  fontFamily: 'Noto Sans',
  position: 'relative',
  wordBreak: 'break-word'
});

css.add('.' + exports.leftBubble + '::before',{
  content: '""',
  position: 'absolute',
  borderTop: '1px solid rgb(209, 209, 209)',
  borderRight: '1px solid rgb(209, 209, 209)',
  backgroundColor: 'white',
  transform: 'skew(-43deg)',
  width: '15px',
  height: '10px',
  top: '-1px',
  right: '-6px'
});

// ----
