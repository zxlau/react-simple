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
  if((vnode.childrens && vnode.childrens.length > 0) || (out.childNodes && out.childNodes.length > 0)) {
    diffChildren(out, vnode.childrens);
  }
  diffAttribute(out, vnode)
  return out;
}

function diffChildren(dom, vChildren) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};
  if(domChildren.length > 0) {

  }
  if(vChildren && vChildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;
    [...vChildren].forEach((vchild, i) => {
      const key = vchild.key;
      let child;
      if(key) {
        if(keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if(childrenLen > min) {
        for(let j = min; j < childrenLen; j++) {
          let c = children[j];
          if(c) {
            child = c;
            children[j] = undefined;
            if(j === childrenLen - 1) childrenLen--;
            if(j === min) min++;
            break;
          }
        }
      }
      child = diffNode(child, vchild);
      const f = domChildren[i];
      if(child && child !== dom && child !== f) {
        if(!f) {
          dom.appendChild(child);
        } else if(child === f.nextSibling) {
          removeNode(f);
        }else {
          dom.insertBefore(child, f);
        }
      }
    })
  }

}

function removeNode(node) {
  
}

function diffAttribute(dom ,vnode) {
  const oldAttrs = {};
  const newAttrs = vnode.attrs;
  const domAttrs = dom.attributes;
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