import Component from '../react/component';
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
  if(typeof vnode.tag === 'function') {
    // 1、创建组件
    // 2、设置组件props
    const comp = createComponent(vnode.tag, vnode.attrs);
    //3、组件渲染的节点对象
    return renderComponent(comp);
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

function createComponent(comp, props) {
  let inst;
  if(comp.prototype && comp.prototype.render) {
    inst = new comp(props);
  } else {
    inst = new Component(props);
    inst.constructor = comp;
    inst.render = function() {
      return this.constructor(props);
    }
  }
  return inst;
}

function renderComponent(comp) {
  const renderer = comp.render();
  return _render(renderer);
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