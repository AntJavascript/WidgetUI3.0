import { Promise } from 'q';
/*
  msg // 显示的内容
  type type='error' // 显示图标
  position // 显示位置
  time // 显示时长
*/
function Snack (option) {
  // 如果存在一个Snack
  // if (document.querySelector('#wt-snack') !== null) {
  //   return;
  // }
  if (option.msg === '' || option.msg === undefined || option.msg === null) {
    return;
  }
  // time参数是否为数字
  if (isNaN(option.time)) {
    option.time = 2000;
  } else {
    option.time = parseInt(option.time);
  }
  // 是否需要显示图标
  let icon = '';
  if (option.type === 'error') {
    icon= "icon-close-fill"
  }
  // 创建图标
  var i = document.createElement('i');
  i.className ='error ' + icon;
  var div = document.createElement('div');
  div.appendChild(i)
  // 创建文本
  var text = document.createTextNode(option.msg);
  div.appendChild(text)
  div.id = 'wt-snack';
  div.className =(option.position || 'bottom') + ' animate';
  //  添加到body
  document.body.appendChild(div);
  Promise.resolve().then(() => {
    div.style.transform = 'translate3d(0,0,0)';
  })
  // 关闭
  setTimeout(() => {
    if(option.position === 'top') {
      div.style.transform = 'translate3d(0,-50px,0)';
    } else {
      div.style.transform = 'translate3d(0,50px,0)';
    }
    div.addEventListener('transitionend', ()=> {
        document.body.removeChild(div);
    })
  }, option.time);
}
export default Snack;
