!function(e,n){var t="JSE",r=[];if("function"==typeof define&&define.amd)define(t,r,n);else if("object"==typeof exports){var i=r.map(function(e){return require(e)});module.exports=n.apply(e,i)}else{var i=r.map(function(n){return e[n]});e[t]=n.apply(e,i)}}(this,function(){return function(){function e(e){return e instanceof HTMLElement?e:"string"==typeof e||"number"==typeof e?document.createTextNode(""+e):void 0}var n={},t=[],r=-1;return n.open=function(e,n){var i=document.createElement(e);if(n)for(var o=0,f=Object.keys(n),u=f[0],a=n[u],p=f.length;p>o;o++,u=f[o],a=n[u])u in i?i[u]=a:i.setAttribute(u,a);return t[r]&&t[r].appendChild(i),this.selfClosing||(t.push(i),r+=1),i},n.close=function(){return r-=1,t.pop()},n.text=function(n){if(Array.isArray(n))for(var i=0,o=n.length;o>i;i++){var f=e(n[i]);f&&t[r].appendChild(f)}else{var f=e(n);f&&t[r].appendChild(f)}},n}});