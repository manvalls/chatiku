var app = require('wapp'),
    Setter = require('y-setter'),
    {when,on} = require('u-elem/hooks'),
    {blankButton} = require('./styles'),
    apply = require('u-proto/apply'),
    $ = require('u-elem'),
    css = require('u-css'),
    open = new Setter(),
    animationName = require('u-rand').unique(),
    animation = css.add(`@keyframes ${animationName}`),
    toRule = animation.add('to'),
    fromRule = animation.add('from'),
    container,element,currentTask;

$('body',
  when(open.getter,['div',
    {
      style: {
        position: 'fixed',
        top: '0px',
        bottom: '0px',
        right: '0px',
        left: '0px',
        zIndex: 1000,
        transition: 'all 700ms cubic-bezier(.55,0,.1,1)',
        backgroundColor: 'white',
        animationName: animationName,
        animationDuration: '700ms'
      }
    },
    function(){
      container = this;
    },
    ['div',
      {
        className: `icon-ok-1 ${blankButton}`,
        style: {
          position: 'absolute',
          bottom: '15px',
          right: '20px',
          fontSize: '35px',
          lineHeight: '35px'
        }
      },
      on('click',e => currentTask ? currentTask.accept() : null)
    ]
  ],{removalTimeout: 700})
);

exports.isOpen = open.getter;

exports.open = function(elem,x,y){
  var task = app.task(),
      animate = open.value,
      w,h,rx,ry,oldTask,
      prevElement,e,pe,to;

  if(!open.value){

    currentTask = task;

    if(y < innerHeight / 2) y = 0;
    else y = innerHeight;

    if(x < innerWidth / 2) x = 0;
    else x = innerWidth;

    rx = x / innerWidth;
    ry = y / innerHeight;

    fromRule[apply]({
      clipPath: `circle(0px at ${x}px ${y}px)`
    });

    w = Math.max(innerWidth - x,x);
    h = Math.max(innerHeight - y,y);

    toRule[apply]({
      clipPath: `circle(${Math.sqrt( Math.pow(w,2) + Math.pow(h,2) )}px at ${x}px ${y}px)`
    });

    open.value = true;
    task.listen(function(){
      var e = container;
      open.value = false;

      w = Math.max(innerWidth * (1 - rx),rx * innerWidth);
      h = Math.max(innerHeight * (1 - ry),ry * innerHeight);

      e[apply]({style: {
        clipPath: `circle(${Math.sqrt( Math.pow(w,2) + Math.pow(h,2) )}px at ${rx * innerWidth}px ${ry * innerHeight}px)`
      }});

      setTimeout(function(){

        e[apply]({style: {
          clipPath: `circle(0px at ${rx * innerWidth}px ${ry * innerHeight}px)`
        }});

      },0);

    });

  }else{

    prevElement = element;
    oldTask = currentTask;
    currentTask = task;

    pe = prevElement;
    to = setTimeout(function(){

      pe.style[apply]({
        opacity: 0,
        left: '-100%',
        right: '100%'
      });

      to = setTimeout(function(){
        pe.remove();
      },700);

    },0);

    task.listen(function(){
      var e,pe;

      if(currentTask != task) return;
      currentTask = oldTask;
      clearTimeout(to);

      e = element;
      setTimeout(function(){

        e.style[apply]({
          opacity: 0,
          left: '100%',
          right: '-100%'
        });

        setTimeout(function(){
          e.remove();
        },700);

      },0);

      pe = element = prevElement;
      $(container,element);

      pe.style[apply]({
        opacity: 0,
        left: '-100%',
        right: '100%'
      });

      setTimeout(function(){

        pe.style[apply]({
          opacity: 1,
          left: '0%',
          right: '0%'
        });

      },0);

    });

  }

  $(container,
    e = element = $('div',{style: {
      position: 'absolute',
      top: '0px',
      bottom: '65px',
      left: '0%',
      right: '0%',
      opacity: 1,
      overflow: 'auto',
      transition: 'all 700ms'
    }},elem)
  );

  if(prevElement){

    e.style[apply]({
      opacity: 0,
      left: '100%',
      right: '-100%'
    });

    setTimeout(function(){

      e.style[apply]({
        opacity: 1,
        left: '0%',
        right: '0%'
      });

    },0);

  }

  return task;
};
