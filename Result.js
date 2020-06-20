import {wtDom} from './utils';

function Result (params) {
  var defaults = {
    title: 'Result',
    content: 'WidgetUI3.0',
    zIndex: 100,
    image: '',
    type: "",
    html: ''
  };
  var options = Object.assign(defaults, params);
  var div = wtDom.create('div');
  div.id = "wt-result";
  div.style.zIndex = options.zIndex
  let html = '';
  if (options.type) {
    switch(options.type) {
      case '403':
        html += '<div class="image"><img src="/img/403.svg" /></div>';
        break;
      case '404':
        html += '<div class="image"><img src="/img/404.svg" /></div>';
        break;
      case '500':
        html += '<div class="image"><img src="/img/500.svg" /></div>';
        break;
      case 'info':
        html += '<div class="image"><img src="/img/info.svg" /></div>';
        break;
      case 'warning':
        html += '<div class="image"><img src="/img/warning.svg" /></div>';
        break;
      default:
        html += '';
    }
  } else if (options.image) {
     html+='<div class="image"><img src='+options.image+' /></div>'
  }
  html += `
    <div class="title">${options.title}</div>
    <div class="content">${options.content}</div>
  `
  if (options.html) {
     html+= options.html
  }
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
  return () => {
    document.body.removeChild(div);
  }
  }
  export default Result;
