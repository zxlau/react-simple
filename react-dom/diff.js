export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode);

  if(container) {
    container.appendChild(ret);
  }
  return ret;
}

function diffNode(dom, vnode) {
  let out = dom;
  if(vnode === null || vnode === undefined || typeof vnode === 'boolean') return;
  if(typeof vnode === 'number') vnode = String(vnode);
  if(typeof vnode === 'string') {
    if(dom && dom.nodeType === 3) {
      if(dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    }else {
      out = document.createTextNode(vnode);
      if(dom && dom.parentNode) {
        dom.parentNode.replaceNode(out, dom);
      }
    }
    return out;
  }
  if(!dom) {
    out = document.createElement(vnode.tag);
  }
  diffAttribute(out, vnode)
  return out;
}

function diffAttribute(dom ,vnode) {
  const oldAttrs = {};
  const newAttrs = vnode.attrs;
  const domAttrs = dom.attribute;
  [...domAttrs].forEach(item => {
    oldAttrs[item.name] = item.value;
  })
  for(let key in oldAttrs) {
    if(!key in newAttrs) {
      setAttribute(dom, key, undefined);
    }
  }
  for(let key in newAttrs) {
    if(oldAttrs[key] !== newAttrs[key]) {
      setAttribute(dom, key, newAttrs[key]);
    }
  }
}

function setAttribute(dom, key, value) {
  if(key === 'className') {
    key = 'class'
  }
  if(/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || '';
  } else if(key === 'style') {
    if(!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if(typeof value === 'object') {
      Object.keys(value).forEach(k => {
        if(typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px';
        } else {
          dom.style[k] = value[k]
        }
      })
    }
  } else {
    if(key in dom) {
      dom[key] = value || '';
    }
    if(value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
}