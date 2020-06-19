import {wtDom} from './utils';

function Result (params) {
  var defaults = {
    title: 'Result',
    content: 'WidgetUI3.0',
    zIndex: 100,
    image: '',
    type: ""
  };
  var options = Object.assign(defaults, params);
  var div = wtDom.create('div');
  div.id = "wt-result";
  div.style.zIndex = options.zIndex
  let html = `
    <div class="image"><img src="${options.image}" /></div>
    <div class="title">${options.title}</div>
    <div class="content">${options.content}</div>
  `
  // 阻止滑动
   div.addEventListener('touchmove', function () {
    event.preventDefault()
  });
  // 点击
   div.addEventListener('click', function () {
    typeof options.click == 'function' && options.click();
  });
  div.innerHTML = html;
  document.body.appendChild(div);
  }
  export default Result;
