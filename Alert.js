import {wtDom} from './utils';
import { Promise } from 'q';
/*
 * @params options {Object} 必须
*/
function Alert (params) {
  var defaults = {
    title: '',
    content: '',
    btns: [],
    zIndex: 100,
    // type: "android"
  };
  var options = Object.assign(defaults, params);
  var Alert = wtDom.create('div');
  Promise.resolve().then(() => {
    Alert.className = 'modal-in';
  })
  Alert.id = 'wt-Alert';
  // 如果title不为空
  if (options.title !== '') {
    var title = wtDom.create();
    title.className = 'title';
    title.innerText = options.title;
    Alert.appendChild(title);
  }
  // 显示内容
  var content = wtDom.create();
  content.className = 'content';
  content.innerText = options.content;
  Alert.appendChild(content);
  // 显示btn
  var btns = wtDom.create();
  btns.className = 'wt-Alert-btns';
  options.btns.forEach((item, index) => {
    var btn = wtDom.create();
    btn.className = 'wt-Alert-btn';
    btn.innerText = item.text;
    // 按钮点击
    btn.addEventListener('click', function () {
      wtDom.del(mask);
      document.body.className = document.body.className.replace(' wt-stop-scroll', '')
      Alert.className = 'modal-out';
       Alert.addEventListener('transitionend', ()=> {
         wtDom.del(Alert);
         Alert = null;
       })
      
      typeof item.handle == 'function' && item.handle(index);
    });
    btns.appendChild(btn);
  });
  Alert.appendChild(btns);
  Alert.style.zIndex = options.zIndex + 1;
  // 添加Alert
  document.body.appendChild(Alert);
  
  // 阻止滑动
  Alert.addEventListener('touchmove', ()=> {
    if (!document.body.className.includes('wt-stop-scroll')) {
      document.body.className = document.body.className + ' wt-stop-scroll'
    }
  })
  
  // 遮罩层
  var mask = wtDom.create();
  mask.className = 'wt-alert-mask';
  mask.style.zIndex = options.zIndex;
  mask.addEventListener('click', function () {
    if (options.btns.length === 0 ) {
      wtDom.del(mask);
      document.body.className = document.body.className.replace(' wt-stop-scroll', '')
      Alert.className = 'modal-out';
      Alert.addEventListener('transitionend', ()=> {
         wtDom.del(Alert);
         Alert = null;
       })
    }
  });
  // 阻止滑动
   mask.addEventListener('touchmove', function () {
    event.preventDefault()
  });
  // 添加遮罩层
  document.body.appendChild(mask);
}
export default Alert;
