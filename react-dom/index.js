import Component from '../react/component';
const ReactDom = {
  render
}

function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  if(vnode === null || vnode === undefined || typeof vnode === 'boolean') return;
  if(typeof vnode === 'number') vnode = String(vnode);
  if(typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }
  if(typeof vnode.tag === 'function') {
    // 1、创建组件
    // 2、设置组件props
    const comp = createComponent(vnode.tag, vnode.attrs);
    //3、组件渲染的节点对象

    if(!comp.base) {
      if(comp.componentWillMount) comp.componentWillMount();
    } else if(comp.componentWillReceiveProps) {
      comp.componentWillReceiveProps();
    }

    renderComponent(comp);
    return comp.base;
  }
  const { tag, attrs } = vnode;
  const dom = document.createElement(tag);
  if(attrs) {
    Object.keys(attrs).forEach(key => {
      const value = attrs[key];
      setAttribute(dom, key, value);
    })
  }

  vnode.childrens && vnode.childrens.forEach(child => render(child, dom))

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

export function renderComponent(comp) {
  let base;
  const renderer = comp.render();
  base =  _render(renderer);
  if(comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  }
  if(comp.base) {
    if(comp.componentDidUpdate) comp.componentDidUpdate();
  } else if(comp.componentDidMount) {
    comp.componentDidMount();
  }
  // 节点替换
  if(comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base);
  }
  comp.base = base;
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