var p=Object.create;var k=Object.defineProperty,q=Object.defineProperties,r=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertyNames,g=Object.getOwnPropertySymbols,u=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty,m=Object.prototype.propertyIsEnumerable;var j=(b,a,c)=>a in b?k(b,a,{enumerable:!0,configurable:!0,writable:!0,value:c}):b[a]=c,w=(b,a)=>{for(var c in a||={})l.call(a,c)&&j(b,c,a[c]);if(g)for(var c of g(a))m.call(a,c)&&j(b,c,a[c]);return b},x=(b,a)=>q(b,s(a));var y=(b,a)=>{var c={};for(var d in b)l.call(b,d)&&a.indexOf(d)<0&&(c[d]=b[d]);if(b!=null&&g)for(var d of g(b))a.indexOf(d)<0&&m.call(b,d)&&(c[d]=b[d]);return c};var z=(b,a)=>()=>(a||b((a={exports:{}}).exports,a),a.exports);var v=(b,a,c,d)=>{if(a&&typeof a=="object"||typeof a=="function")for(let e of t(a))!l.call(b,e)&&e!==c&&k(b,e,{get:()=>a[e],enumerable:!(d=r(a,e))||d.enumerable});return b};var A=(b,a,c)=>(c=b!=null?p(u(b)):{},v(a||!b||!b.__esModule?k(c,"default",{value:b,enumerable:!0}):c,b));var B=(b,a,c)=>(j(b,typeof a!="symbol"?a+"":a,c),c);var C=(b,a,c)=>new Promise((d,e)=>{var n=f=>{try{h(c.next(f))}catch(i){e(i)}},o=f=>{try{h(c.throw(f))}catch(i){e(i)}},h=f=>f.done?d(f.value):Promise.resolve(f.value).then(n,o);h((c=c.apply(b,a)).next())});export{w as a,x as b,y as c,z as d,A as e,B as f,C as g};
