const ReactDom = {
  render
}

function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  if(!vnode) return;
  if(typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }
  const { tag, attrs } = vnode;
  const dom = document.createElement(tag);
  if(attrs) {
    Object.keys(attrs).forEach(key => {
      const value = attrs[key];
      setAttribute(dom, key, value);
    })
  }

  vnode.childrens.forEach(child => render(child, dom))

  return dom;
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

export default ReactDom;