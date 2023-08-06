import{d as Ve}from"./chunk-DZA5LO2U.js";import{$a as Gt,Bc as lt,Dc as Zt,Ec as N,G as Ee,H as Re,Hc as H,L as Fe,M as De,N as Ot,Q as It,U as z,V as Ce,W as ct,X as j,Z as Ae,_ as P,ac as $e,b as Ie,c as je,e as Se,f as Te,h as Me,hb as Kt,j as Yt,ja as jt,jb as Be,kb as Pe,m as wt,nd as ke,pa as Ne,ta as _e,ua as g,wc as $,xa as Wt,xc as Jt,yc as v}from"./chunk-3QVC2YGB.js";import{a as D,b as at,f as c}from"./chunk-OIPWLAE3.js";function St(t,e){var o={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(o[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(t);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(t,r[n])&&(o[r[n]]=t[r[n]]);return o}var Tt=function(){},J=function(){};var pt=(t,e,o)=>Math.min(Math.max(o,t),e);var Qt=.001,_r=.01,Ue=10,Br=.05,Pr=1;function ze({duration:t=800,bounce:e=.25,velocity:o=0,mass:r=1}){let n,s;Tt(t<=Ue*1e3,"Spring duration must be 10 seconds or less");let i=1-e;i=pt(Br,Pr,i),t=pt(_r,Ue,t/1e3),i<1?(n=p=>{let f=p*i,u=f*t,O=f-o,M=Mt(p,i),F=Math.exp(-u);return Qt-O/M*F},s=p=>{let u=p*i*t,O=u*o+o,M=Math.pow(i,2)*Math.pow(p,2)*t,F=Math.exp(-u),A=Mt(Math.pow(p,2),i);return(-n(p)+Qt>0?-1:1)*((O-M)*F)/A}):(n=p=>{let f=Math.exp(-p*t),u=(p-o)*t+1;return-Qt+f*u},s=p=>{let f=Math.exp(-p*t),u=(o-p)*(t*t);return f*u});let a=5/t,l=kr(n,s,a);if(t=t*1e3,isNaN(l))return{stiffness:100,damping:10,duration:t};{let p=Math.pow(l,2)*r;return{stiffness:p,damping:i*2*Math.sqrt(r*p),duration:t}}}var $r=12;function kr(t,e,o){let r=o;for(let n=1;n<$r;n++)r=r-t(r)/e(r);return r}function Mt(t,e){return t*Math.sqrt(1-e*e)}var Vr=["duration","bounce"],Ur=["stiffness","damping","mass"];function He(t,e){return e.some(o=>t[o]!==void 0)}function zr(t){let e=Object.assign({velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1},t);if(!He(t,Ur)&&He(t,Vr)){let o=ze(t);e=Object.assign(Object.assign(Object.assign({},e),o),{velocity:0,mass:1}),e.isResolvedFromDuration=!0}return e}function Et(t){var{from:e=0,to:o=1,restSpeed:r=2,restDelta:n}=t,s=St(t,["from","to","restSpeed","restDelta"]);let i={done:!1,value:e},{stiffness:a,damping:l,mass:p,velocity:f,duration:u,isResolvedFromDuration:O}=zr(s),M=qe,F=qe;function A(){let b=f?-(f/1e3):0,x=o-e,h=l/(2*Math.sqrt(a*p)),d=Math.sqrt(a/p)/1e3;if(n===void 0&&(n=Math.min(Math.abs(o-e)/100,.4)),h<1){let m=Mt(d,h);M=y=>{let I=Math.exp(-h*d*y);return o-I*((b+h*d*x)/m*Math.sin(m*y)+x*Math.cos(m*y))},F=y=>{let I=Math.exp(-h*d*y);return h*d*I*(Math.sin(m*y)*(b+h*d*x)/m+x*Math.cos(m*y))-I*(Math.cos(m*y)*(b+h*d*x)-m*x*Math.sin(m*y))}}else if(h===1)M=m=>o-Math.exp(-d*m)*(x+(b+d*x)*m);else{let m=d*Math.sqrt(h*h-1);M=y=>{let I=Math.exp(-h*d*y),K=Math.min(m*y,300);return o-I*((b+h*d*x)*Math.sinh(K)+m*x*Math.cosh(K))/m}}}return A(),{next:b=>{let x=M(b);if(O)i.done=b>=u;else{let h=F(b)*1e3,d=Math.abs(h)<=r,m=Math.abs(o-x)<=n;i.done=d&&m}return i.value=i.done?o:x,i},flipTarget:()=>{f=-f,[e,o]=[o,e],A()}}}Et.needsInterpolation=(t,e)=>typeof t=="string"||typeof e=="string";var qe=t=>0;var Xt=(t,e,o)=>{let r=e-t;return r===0?1:(o-t)/r};var w=(t,e,o)=>-o*t+o*e+t;var Rt=(t,e)=>o=>Math.max(Math.min(o,e),t),k=t=>t%1?Number(t.toFixed(5)):t,Z=/(-)?([\d]*\.?[\d])+/g,Ft=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,Le=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function _(t){return typeof t=="string"}var Q={test:t=>typeof t=="number",parse:parseFloat,transform:t=>t},Dt=Object.assign(Object.assign({},Q),{transform:Rt(0,1)}),Ln=Object.assign(Object.assign({},Q),{default:1});var ft=t=>({test:e=>_(e)&&e.endsWith(t)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${t}`}),Gn=ft("deg"),X=ft("%"),Kn=ft("px"),Jn=ft("vh"),Zn=ft("vw"),Qn=Object.assign(Object.assign({},X),{parse:t=>X.parse(t)/100,transform:t=>X.transform(t*100)});var tt=(t,e)=>o=>!!(_(o)&&Le.test(o)&&o.startsWith(t)||e&&Object.prototype.hasOwnProperty.call(o,e)),Ct=(t,e,o)=>r=>{if(!_(r))return r;let[n,s,i,a]=r.match(Z);return{[t]:parseFloat(n),[e]:parseFloat(s),[o]:parseFloat(i),alpha:a!==void 0?parseFloat(a):1}};var C={test:tt("hsl","hue"),parse:Ct("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:o,alpha:r=1})=>"hsla("+Math.round(t)+", "+X.transform(k(e))+", "+X.transform(k(o))+", "+k(Dt.transform(r))+")"};var Hr=Rt(0,255),At=Object.assign(Object.assign({},Q),{transform:t=>Math.round(Hr(t))}),S={test:tt("rgb","red"),parse:Ct("red","green","blue"),transform:({red:t,green:e,blue:o,alpha:r=1})=>"rgba("+At.transform(t)+", "+At.transform(e)+", "+At.transform(o)+", "+k(Dt.transform(r))+")"};function qr(t){let e="",o="",r="",n="";return t.length>5?(e=t.substr(1,2),o=t.substr(3,2),r=t.substr(5,2),n=t.substr(7,2)):(e=t.substr(1,1),o=t.substr(2,1),r=t.substr(3,1),n=t.substr(4,1),e+=e,o+=o,r+=r,n+=n),{red:parseInt(e,16),green:parseInt(o,16),blue:parseInt(r,16),alpha:n?parseInt(n,16)/255:1}}var et={test:tt("#"),parse:qr,transform:S.transform};var V={test:t=>S.test(t)||et.test(t)||C.test(t),parse:t=>S.test(t)?S.parse(t):C.test(t)?C.parse(t):et.parse(t),transform:t=>_(t)?t:t.hasOwnProperty("red")?S.transform(t):C.transform(t)};var Ye="${c}",We="${n}";function Lr(t){var e,o,r,n;return isNaN(t)&&_(t)&&((o=(e=t.match(Z))===null||e===void 0?void 0:e.length)!==null&&o!==void 0?o:0)+((n=(r=t.match(Ft))===null||r===void 0?void 0:r.length)!==null&&n!==void 0?n:0)>0}function Ge(t){typeof t=="number"&&(t=`${t}`);let e=[],o=0,r=t.match(Ft);r&&(o=r.length,t=t.replace(Ft,Ye),e.push(...r.map(V.parse)));let n=t.match(Z);return n&&(t=t.replace(Z,We),e.push(...n.map(Q.parse))),{values:e,numColors:o,tokenised:t}}function Ke(t){return Ge(t).values}function Je(t){let{values:e,numColors:o,tokenised:r}=Ge(t),n=e.length;return s=>{let i=r;for(let a=0;a<n;a++)i=i.replace(a<o?Ye:We,a<o?V.transform(s[a]):k(s[a]));return i}}var Yr=t=>typeof t=="number"?0:t;function Wr(t){let e=Ke(t);return Je(t)(e.map(Yr))}var Nt={test:Lr,parse:Ke,createTransformer:Je,getAnimatableNone:Wr};function te(t,e,o){return o<0&&(o+=1),o>1&&(o-=1),o<1/6?t+(e-t)*6*o:o<1/2?e:o<2/3?t+(e-t)*(2/3-o)*6:t}function ee({hue:t,saturation:e,lightness:o,alpha:r}){t/=360,e/=100,o/=100;let n=0,s=0,i=0;if(!e)n=s=i=o;else{let a=o<.5?o*(1+e):o+e-o*e,l=2*o-a;n=te(l,a,t+1/3),s=te(l,a,t),i=te(l,a,t-1/3)}return{red:Math.round(n*255),green:Math.round(s*255),blue:Math.round(i*255),alpha:r}}var Gr=(t,e,o)=>{let r=t*t,n=e*e;return Math.sqrt(Math.max(0,o*(n-r)+r))},Kr=[et,S,C],Ze=t=>Kr.find(e=>e.test(t)),Qe=t=>`'${t}' is not an animatable color. Use the equivalent color code instead.`,_t=(t,e)=>{let o=Ze(t),r=Ze(e);J(!!o,Qe(t)),J(!!r,Qe(e));let n=o.parse(t),s=r.parse(e);o===C&&(n=ee(n),o=S),r===C&&(s=ee(s),r=S);let i=Object.assign({},n);return a=>{for(let l in i)l!=="alpha"&&(i[l]=Gr(n[l],s[l],a));return i.alpha=w(n.alpha,s.alpha,a),o.transform(i)}};var Xe=t=>typeof t=="number";var Jr=(t,e)=>o=>e(t(o)),Bt=(...t)=>t.reduce(Jr);function er(t,e){return Xe(t)?o=>w(t,e,o):V.test(t)?_t(t,e):ne(t,e)}var re=(t,e)=>{let o=[...t],r=o.length,n=t.map((s,i)=>er(s,e[i]));return s=>{for(let i=0;i<r;i++)o[i]=n[i](s);return o}},rr=(t,e)=>{let o=Object.assign(Object.assign({},t),e),r={};for(let n in o)t[n]!==void 0&&e[n]!==void 0&&(r[n]=er(t[n],e[n]));return n=>{for(let s in r)o[s]=r[s](n);return o}};function tr(t){let e=Nt.parse(t),o=e.length,r=0,n=0,s=0;for(let i=0;i<o;i++)r||typeof e[i]=="number"?r++:e[i].hue!==void 0?s++:n++;return{parsed:e,numNumbers:r,numRGB:n,numHSL:s}}var ne=(t,e)=>{let o=Nt.createTransformer(e),r=tr(t),n=tr(e);return r.numHSL===n.numHSL&&r.numRGB===n.numRGB&&r.numNumbers>=n.numNumbers?Bt(re(r.parsed,n.parsed),o):(Tt(!0,`Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`),i=>`${i>0?e:t}`)};var Zr=(t,e)=>o=>w(t,e,o);function Qr(t){if(typeof t=="number")return Zr;if(typeof t=="string")return V.test(t)?_t:ne;if(Array.isArray(t))return re;if(typeof t=="object")return rr}function Xr(t,e,o){let r=[],n=o||Qr(t[0]),s=t.length-1;for(let i=0;i<s;i++){let a=n(t[i],t[i+1]);if(e){let l=Array.isArray(e)?e[i]:e;a=Bt(l,a)}r.push(a)}return r}function tn([t,e],[o]){return r=>o(Xt(t,e,r))}function en(t,e){let o=t.length,r=o-1;return n=>{let s=0,i=!1;if(n<=t[0]?i=!0:n>=t[r]&&(s=r-1,i=!0),!i){let l=1;for(;l<o&&!(t[l]>n||l===r);l++);s=l-1}let a=Xt(t[s],t[s+1],n);return e[s](a)}}function Pt(t,e,{clamp:o=!0,ease:r,mixer:n}={}){let s=t.length;J(s===e.length,"Both input and output ranges must be the same length"),J(!r||!Array.isArray(r)||r.length===s-1,"Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values."),t[0]>t[s-1]&&(t=[].concat(t),e=[].concat(e),t.reverse(),e.reverse());let i=Xr(e,r,n),a=s===2?tn(t,i):en(t,i);return o?l=>a(pt(t[0],t[s-1],l)):a}var ut=t=>e=>1-t(1-e),$t=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,nr=t=>e=>Math.pow(e,t),oe=t=>e=>e*e*((t+1)*e-t),or=t=>{let e=oe(t);return o=>(o*=2)<1?.5*e(o):.5*(2-Math.pow(2,-10*(o-1)))};var sr=1.525,rn=4/11,nn=8/11,on=9/10,mt=t=>t,dt=nr(2),se=ut(dt),q=$t(dt),ir=t=>1-Math.sin(Math.acos(t)),ar=ut(ir),sn=$t(ar),ie=oe(sr),an=ut(ie),cn=$t(ie),ln=or(sr),pn=4356/361,fn=35442/1805,un=16061/1805,cr=t=>{if(t===1||t===0)return t;let e=t*t;return t<rn?7.5625*e:t<nn?9.075*e-9.9*t+3.4:t<on?pn*e-fn*t+un:10.8*t*t-20.52*t+10.72},mn=ut(cr);function dn(t,e){return t.map(()=>e||q).splice(0,t.length-1)}function hn(t){let e=t.length;return t.map((o,r)=>r!==0?r/(e-1):0)}function gn(t,e){return t.map(o=>o*e)}function ht({from:t=0,to:e=1,ease:o,offset:r,duration:n=300}){let s={done:!1,value:t},i=Array.isArray(e)?e:[t,e],a=gn(r&&r.length===i.length?r:hn(i),n);function l(){return Pt(a,i,{ease:Array.isArray(o)?o:dn(i,o)})}let p=l();return{next:f=>(s.value=p(f),s.done=f>=n,s),flipTarget:()=>{i.reverse(),p=l()}}}function lr({velocity:t=0,from:e=0,power:o=.8,timeConstant:r=350,restDelta:n=.5,modifyTarget:s}){let i={done:!1,value:e},a=o*t,l=e+a,p=s===void 0?l:s(l);return p!==l&&(a=p-e),{next:f=>{let u=-a*Math.exp(-f/r);return i.done=!(u>n||u<-n),i.value=i.done?p:p+u,i},flipTarget:()=>{}}}var pr={keyframes:ht,spring:Et,decay:lr};function fr(t){if(Array.isArray(t.to))return ht;if(pr[t.type])return pr[t.type];let e=new Set(Object.keys(t));return e.has("ease")||e.has("duration")&&!e.has("dampingRatio")?ht:e.has("dampingRatio")||e.has("stiffness")||e.has("mass")||e.has("damping")||e.has("restSpeed")||e.has("restDelta")?Et:ht}var ae=16.666666666666668,xn=typeof performance<"u"?()=>performance.now():()=>Date.now(),ce=typeof window<"u"?t=>window.requestAnimationFrame(t):t=>setTimeout(()=>t(xn()),ae);function ur(t){let e=[],o=[],r=0,n=!1,s=!1,i=new WeakSet,a={schedule:(l,p=!1,f=!1)=>{let u=f&&n,O=u?e:o;return p&&i.add(l),O.indexOf(l)===-1&&(O.push(l),u&&n&&(r=e.length)),l},cancel:l=>{let p=o.indexOf(l);p!==-1&&o.splice(p,1),i.delete(l)},process:l=>{if(n){s=!0;return}if(n=!0,[e,o]=[o,e],o.length=0,r=e.length,r)for(let p=0;p<r;p++){let f=e[p];f(l),i.has(f)&&(a.schedule(f),t())}n=!1,s&&(s=!1,a.process(l))}};return a}var yn=40,le=!0,xt=!1,pe=!1,gt={delta:0,timestamp:0},yt=["read","update","preRender","render","postRender"],kt=yt.reduce((t,e)=>(t[e]=ur(()=>xt=!0),t),{}),bn=yt.reduce((t,e)=>{let o=kt[e];return t[e]=(r,n=!1,s=!1)=>(xt||wn(),o.schedule(r,n,s)),t},{}),mr=yt.reduce((t,e)=>(t[e]=kt[e].cancel,t),{}),hs=yt.reduce((t,e)=>(t[e]=()=>kt[e].process(gt),t),{}),vn=t=>kt[t].process(gt),dr=t=>{xt=!1,gt.delta=le?ae:Math.max(Math.min(t-gt.timestamp,yn),1),gt.timestamp=t,pe=!0,yt.forEach(vn),pe=!1,xt&&(le=!1,ce(dr))},wn=()=>{xt=!0,le=!0,pe||ce(dr)};var hr=bn;function fe(t,e,o=0){return t-e-o}function gr(t,e,o=0,r=!0){return r?fe(e+-t,e,o):e-(t-e)+o}function xr(t,e,o,r){return r?t>=e+o:t<=-o}var On=t=>{let e=({delta:o})=>t(o);return{start:()=>hr.update(e,!0),stop:()=>mr.update(e)}};function ue(t){var e,o,{from:r,autoplay:n=!0,driver:s=On,elapsed:i=0,repeat:a=0,repeatType:l="loop",repeatDelay:p=0,onPlay:f,onStop:u,onComplete:O,onRepeat:M,onUpdate:F}=t,A=St(t,["from","autoplay","driver","elapsed","repeat","repeatType","repeatDelay","onPlay","onStop","onComplete","onRepeat","onUpdate"]);let{to:b}=A,x,h=0,d=A.duration,m,y=!1,I=!0,K,ve=fr(A);!((o=(e=ve).needsInterpolation)===null||o===void 0)&&o.call(e,r,b)&&(K=Pt([0,100],[r,b],{clamp:!1}),r=0,b=100);let we=ve(Object.assign(Object.assign({},A),{from:r,to:b}));function Dr(){h++,l==="reverse"?(I=h%2===0,i=gr(i,d,p,I)):(i=fe(i,d,p),l==="mirror"&&we.flipTarget()),y=!1,M&&M()}function Cr(){x.stop(),O&&O()}function Ar(Lt){if(I||(Lt=-Lt),i+=Lt,!y){let Oe=we.next(Math.max(0,i));m=Oe.value,K&&(m=K(m)),y=I?Oe.done:i<=0}F?.(m),y&&(h===0&&(d??(d=i)),h<a?xr(i,d,p,I)&&Dr():Cr())}function Nr(){f?.(),x=s(Ar),x.start()}return n&&Nr(),{stop:()=>{u?.(),x.stop()}}}var yr=(t,e)=>1-3*e+3*t,br=(t,e)=>3*e-6*t,vr=t=>3*t,zt=(t,e,o)=>((yr(e,o)*t+br(e,o))*t+vr(e))*t,wr=(t,e,o)=>3*yr(e,o)*t*t+2*br(e,o)*t+vr(e),In=1e-7,jn=10;function Sn(t,e,o,r,n){let s,i,a=0;do i=e+(o-e)/2,s=zt(i,r,n)-t,s>0?o=i:e=i;while(Math.abs(s)>In&&++a<jn);return i}var Tn=8,Mn=.001;function En(t,e,o,r){for(let n=0;n<Tn;++n){let s=wr(e,o,r);if(s===0)return e;let i=zt(e,o,r)-t;e-=i/s}return e}var Ut=11,Vt=1/(Ut-1);function me(t,e,o,r){if(t===e&&o===r)return mt;let n=new Float32Array(Ut);for(let i=0;i<Ut;++i)n[i]=zt(i*Vt,t,o);function s(i){let a=0,l=1,p=Ut-1;for(;l!==p&&n[l]<=i;++l)a+=Vt;--l;let f=(i-n[l])/(n[l+1]-n[l]),u=a+f*Vt,O=wr(u,t,o);return O>=Mn?En(i,u,t,o):O===0?u:Sn(i,a,a+Vt,t,o)}return i=>i===0||i===1?i:zt(s(i),e,r)}var bt=class{constructor(e,o){c(this,"promise");c(this,"stopper");this.promise=e,this.stopper=o}then(e,o){return this.promise.then(e,o)}stop(){this.stopper()}},rt=class extends bt{constructor(e){let o=Promise.all(e).then(n=>n.every(s=>s===E.Completed)?E.Completed:E.Stopped),r=()=>e.forEach(n=>n.stop());super(o,r)}},E;(function(t){t.Completed="completed",t.Stopped="stopped"})(E=E||(E={}));var R=class{constructor(e){c(this,"top");c(this,"left");c(this,"right");c(this,"bottom");this.top=e.top,this.left=e.left,this.right=e.right,this.bottom=e.bottom}static from(e){return new R(e.getBoundingClientRect())}width(){return this.right-this.left}height(){return this.bottom-this.top}midpoint(){return{x:w(this.left,this.right,.5),y:w(this.top,this.bottom,.5)}}},vt=class{constructor(e){c(this,"origin");c(this,"scale");c(this,"translate");this.origin=e.origin,this.scale=e.scale,this.translate=e.translate}apply(e){let o=e-this.origin;return this.origin+o*this.scale+this.translate}};var L=class{snapshot(e){if(!e.measured())throw new Error(`Node "${e.id}" not measured`);let o=D({},e);return o.children=new Set(e.children),o}snapshotTree(e,o={}){let r=new T,n=new Set;return e.traverse(s=>{if(!(o.filter&&!o.filter(s))){if(n.has(s.id))throw new Error(`Node ID conflict: "${s.id}"`);n.add(s.id),o.measure&&s.measure(),r.set(s.id,this.snapshot(s))}},{includeSelf:!0}),r}},T=class extends Map{merge(e){for(let[o,r]of e)this.set(o,r)}};var Y=class{constructor(e,o,r){c(this,"engine");c(this,"easingParser");c(this,"planners");this.engine=e,this.easingParser=o,this.planners=r}animate(e){let{root:o,from:r,estimation:n=!1}=e;typeof e.easing=="string"&&(e.easing=this.easingParser.parse(e.easing));let{duration:s=225,easing:i=q}=e;this.initialize(o);let a=this.getAnimationPlans(o,r,n),l=this.engine.animate(o,{duration:s,easing:i,plans:a});return l.then(p=>{p===E.Completed&&o.traverse(f=>f.reset(),{includeSelf:!0})}),l}initialize(e){e.traverse(o=>o.reset(),{includeSelf:!0}),e.traverse(o=>o.measure(),{includeSelf:!0})}getAnimationPlans(e,o,r){let n=new Map;return e.traverse(s=>{if(!s.measured())throw new Error("Unknown node");let i=o.get(s.id);if(n.has(s.id)&&s.element===i?.element)return;let a={root:e,node:s,snapshots:o,snapshot:i},l=at(D({},this.planners.reduce((p,f)=>D(D({},p),f.buildPlan(a)),{})),{boundingBox:this.getBoundingBoxRoute(a,r)});n.set(s.id,l)},{includeSelf:!0}),n}getBoundingBoxRoute(e,o){let{root:r,node:n,snapshot:s,snapshots:i}=e,a=s?.boundingBox||o&&this.estimateBoundingBoxRouteStart(r,n,i)||n.boundingBox,l=n.boundingBox;return{from:a,to:l}}estimateBoundingBoxRouteStart(e,o,r){if(!o.measured())throw new Error("Unknown node");let n=o,s;for(;(s=r.get(n.id))===void 0;){if(n===e||!n.parent)return;n=n.parent}if(!n.measured())throw new Error("Unknown ancestor");let a=n.calculateTransform(s.boundingBox).x.scale;return new R({top:s.boundingBox.top-(n.boundingBox.top-o.boundingBox.top)*a,left:s.boundingBox.left-(n.boundingBox.left-o.boundingBox.left)*a,right:s.boundingBox.right-(n.boundingBox.right-o.boundingBox.right)*a,bottom:s.boundingBox.top-(n.boundingBox.top-o.boundingBox.bottom)*a})}},B=class{constructor(e){c(this,"node");c(this,"snapshots");c(this,"animator");c(this,"snapper");c(this,"animationConfig");this.node=e.node,this.snapshots=e.storage??new T,[this.animator,this.snapper]=e.deps,this.animationConfig=e.animation??{}}snapshot(e){let o=this.snapper.snapshotTree(this.node,e);this.snapshots.merge(o)}animate(e){return this.animator.animate(at(D(D({},this.animationConfig),e),{root:this.node,from:this.snapshots}))}},nt=class{parse(e){if(e==="linear")return mt;if(e==="ease")return q;if(e==="ease-in")return dt;if(e==="ease-out")return se;if(e==="ease-in-out")return q;if(e.startsWith("cubic-bezier")){let[o,r,n,s]=e.replace("cubic-bezier(","").replace(")","").split(",").map(i=>parseFloat(i));return me(o,r,n,s)}throw new Error(`Unsupported easing string: ${e}`)}};var ot=class{constructor(e){c(this,"handlers");c(this,"records",new WeakMap);this.handlers=e}animate(e,o){this.records.get(e)?.stop();let r,n=new Promise(i=>{let{duration:a,easing:l,plan:p}=o,f=u=>this.handleFrame(e,p,u);f(0),r=ue({from:0,to:1,duration:a,ease:l,onUpdate:f,onComplete:()=>i(E.Completed),onStop:()=>i(E.Stopped)}).stop}),s=new de(e,n,()=>r());return this.records.set(e,s),s}handleFrame(e,o,r){let n=this.calcFrameBoundingBox(o.boundingBox,r);this.handlers.forEach(s=>s.handleFrame(e,r,o)),e.project(n)}calcFrameBoundingBox(e,o){let{from:r,to:n}=e;return new R({top:w(r.top,n.top,o),left:w(r.left,n.left,o),right:w(r.right,n.right,o),bottom:w(r.bottom,n.bottom,o)})}},de=class extends bt{constructor(o,r,n){super(r,n);c(this,"node");this.node=o}},st=class{constructor(e){c(this,"engine");c(this,"records",new WeakMap);this.engine=e}animate(e,o){this.records.get(e)?.stop();let{duration:r,easing:n,plans:s}=o,i=[];e.traverse(l=>{let p=s.get(l.id);if(!p)throw new Error("Unknown node");let f={duration:r,easing:n,plan:p},u=this.engine.animate(l,f);i.push(u)},{includeSelf:!0});let a=new he(e,i);return this.records.set(e,a),a}},he=class extends rt{constructor(o,r){super(r);c(this,"root");this.root=o}};var U=(()=>{let e=class{constructor(r,n){c(this,"element");c(this,"components");c(this,"id",`anonymous-${e.idNext++}`);c(this,"activated",!0);c(this,"parent");c(this,"children",new Set);c(this,"boundingBox");c(this,"transform");c(this,"identified",!1);this.element=r,this.components=n}identifyAs(r){if(this.identified)throw new Error(`Node "${this.id}" already identified`);this.id=r,this.identified=!0}activate(){this.activated=!0}deactivate(){this.activated=!1}attach(r){this.parent=r,r.children.add(this)}detach(){if(!this.parent)throw new Error("Missing parent");this.parent.children.delete(this),this.parent=void 0}traverse(r,n={}){n.includeSelf??=!1,n.includeDeactivated??=!1,n.includeSelf&&r(this),this.children.forEach(s=>{!n.includeDeactivated&&!s.activated||s.traverse(r,at(D({},n),{includeSelf:!0}))})}track(){let r=[],n=this.parent;for(;n;)r.unshift(n),n=n.parent;return r}reset(){this.transform=void 0,this.element.style.transform="",this.element.style.borderRadius=""}measure(){let r=R.from(this.element);this.boundingBox=r,this.components.forEach(n=>Object.assign(this,n.measureProperties(this.element,r)))}measured(){return!!this.boundingBox}project(r){if(!this.measured())throw new Error("Node not measured");this.transform=this.calculateTransform(r);let n={x:1,y:1},s=this.track();for(let f of s)f.transform&&(n.x*=f.transform.x.scale,n.y*=f.transform.y.scale);let i=this.transform,a=i.x.translate/n.x,l=i.y.translate/n.y;this.element.style.transform=[`translate3d(${a}px, ${l}px, 0)`,`scale(${i.x.scale}, ${i.y.scale})`].join(" ");let p={scaleX:n.x*this.transform.x.scale,scaleY:n.y*this.transform.y.scale};this.components.forEach(f=>{f.cancelDistortion(this.element,this,p)})}calculateTransform(r){let n=this.calculateTransformedBoundingBox(),s=n.midpoint(),i=r.midpoint(),a={x:new vt({origin:s.x,scale:r.width()/n.width(),translate:i.x-s.x}),y:new vt({origin:s.y,scale:r.height()/n.height(),translate:i.y-s.y})};return isNaN(a.x.scale)&&(a.x.scale=1),isNaN(a.y.scale)&&(a.y.scale=1),a}calculateTransformedBoundingBox(){if(!this.measured())throw new Error("Node not measured");let r=this.boundingBox;for(let n of this.track()){if(!n.boundingBox||!n.transform)continue;let s=n.transform;r=new R({top:s.y.apply(r.top),left:s.x.apply(r.left),right:s.x.apply(r.right),bottom:s.y.apply(r.bottom)})}return r}},t=e;return c(t,"idNext",1),t})();var ge=class{constructor(e,o){c(this,"map");c(this,"secondsBeforeDeletion");c(this,"timeouts",new Map);this.map=e,this.secondsBeforeDeletion=o}stale(e){let o=setTimeout(()=>this.performDeletion(e),this.secondsBeforeDeletion*1e3);this.timeouts.set(e,o)}refresh(e){let o=this.timeouts.get(e);clearTimeout(o),this.timeouts.delete(e)}performDeletion(e){this.map.delete(e),this.timeouts.delete(e)}},W=class extends Set{},G=class extends Set{},Or=(()=>{let e=class{constructor(r,n,s){c(this,"nodeRegistry");c(this,"entryRegistry");c(this,"snapshots");this.nodeRegistry=r,this.entryRegistry=n,this.snapshots=s}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(ct(W),ct(G),ct(T))}),c(t,"\u0275prov",z({token:e,factory:e.\u0275fac})),t})(),jr=(()=>{let e=class extends ge{constructor(r){super(r,10)}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(ct(T))}),c(t,"\u0275prov",z({token:e,factory:e.\u0275fac})),t})(),xi=(()=>{let e=class extends B{constructor(n,s,i,a,l){super({node:n,deps:[s,i],storage:a});c(this,"nodeRegistry");c(this,"animationConfig",{});this.nodeRegistry=l}set lpjAnimation(n){typeof n!="string"&&(this.animationConfig=n)}snapshot(n){if(this.nodeRegistry&&n?.filter){let i=n.filter,a=this.nodeRegistry;n.filter=l=>a.has(l)&&i(l)}let s=this.snapper.snapshotTree(this.node,n);this.snapshots.merge(s)}},t=e;return c(t,"\u0275fac",function(s){return new(s||e)(g(U,2),g(Y),g(L),g(T,8),g(W,8))}),c(t,"\u0275dir",P({type:e,selectors:[["","lpjNode","","lpjAnimation",""]],inputs:{lpjAnimation:"lpjAnimation"},exportAs:["lpjAnimation"],standalone:!0,features:[Gt([{provide:B,useExisting:e}]),Wt]})),t})(),yi=(()=>{let e=class{constructor(r,n){c(this,"templateRef");c(this,"viewContainer");c(this,"source");c(this,"current");this.templateRef=r,this.viewContainer=n}set lpjAnimationScope(r){r!==""&&(this.source=r)}ngOnInit(){let r=this.createInjector();this.current=r.get(Or),this.viewContainer.createEmbeddedView(this.templateRef,{$implicit:this.current},{injector:r})}createInjector(){let{nodeRegistry:r=new W,entryRegistry:n=new G,snapshots:s=new T}=this.source??{};return _e.create({providers:[{provide:Or},{provide:W,useValue:r},{provide:G,useValue:n},{provide:T,useValue:s},{provide:jr}]})}static ngTemplateContextGuard(r,n){return!0}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(g(Be),g(Pe))}),c(t,"\u0275dir",P({type:e,selectors:[["","lpjAnimationScope",""]],inputs:{lpjAnimationScope:"lpjAnimationScope"},standalone:!0})),t})(),bi=(()=>{let e=class{constructor(r,n,s){c(this,"node");c(this,"registry");c(this,"snapshots");this.node=r,this.registry=n,this.snapshots=s}ngOnInit(){this.registry?.add(this.node),this.snapshots?.refresh(this.node.id)}ngOnDestroy(){this.registry?.delete(this.node),this.snapshots?.stale(this.node.id)}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(g(U,2),g(W,8),g(jr,8))}),c(t,"\u0275dir",P({type:e,selectors:[["","lpjNode",""]],standalone:!0})),t})(),vi=(()=>{let e=class{constructor(r,n){c(this,"entry");c(this,"registry");this.entry=r,this.registry=n}ngOnInit(){this.registry?.add(this.entry)}ngOnDestroy(){this.registry?.delete(this.entry)}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(g(B,2),g(G,8))}),c(t,"\u0275dir",P({type:e,selectors:[["","lpjAnimation",""]],standalone:!0})),t})(),Fn=(()=>{let e=class{constructor(r){c(this,"entryRegistry");c(this,"trigger$",new Se(Me));c(this,"targets",[]);c(this,"animationTrigger",new Kt);c(this,"animationSettle",new Kt);this.entryRegistry=r}set lpjAnimationTrigger(r){let n=r instanceof Ie?r.pipe(De(Yt(r))):Yt(r);this.trigger$.next(n)}set lpjAnimationTriggerFor(r){this.targets=Array.isArray(r)?r:[r]}ngOnInit(){this.trigger$.pipe(Ee(),Fe(1),It(()=>this.animationTrigger.emit()),It(()=>this.snapshot()),Ot(()=>je().pipe(Re())),wt(()=>this.animate()),It(r=>r.then(()=>this.animationSettle.emit()))).subscribe()}snapshot(){this.resolveTargets().forEach(r=>r.snapshot({measure:!0}))}animate(){let r=this.resolveTargets().map(n=>n.animate());return new rt(r)}resolveTargets(){return this.targets.map(r=>this.resolveTarget(r))}resolveTarget(r){if(r instanceof B)return r;this.entryRegistry||this.resolveFailed(r,"no context provided");let n=Array.from(this.entryRegistry),s=r instanceof U?r.id:r,i=n.find(a=>a.node.id===s);return i||this.resolveFailed(r,"not found"),i}resolveFailed(r,n){throw new Error(`Failed to resolve target ${r}: ${n}`)}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(g(G,8))}),c(t,"\u0275dir",P({type:e,selectors:[["","lpjAnimationTrigger",""]],inputs:{lpjAnimationTrigger:"lpjAnimationTrigger",lpjAnimationTriggerFor:"lpjAnimationTriggerFor"},outputs:{animationTrigger:"animationTrigger",animationSettle:"animationSettle"},standalone:!0})),t})(),wi=(()=>{let e=class{constructor(r,n){n.lpjAnimationTriggerFor=r}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(g(B,2),g(Fn,2))}),c(t,"\u0275dir",P({type:e,selectors:[["","lpjAnimation","","lpjAnimationTrigger",""]],standalone:!0})),t})(),Oi=(()=>{let e=class extends U{set lpjNode(r){typeof r=="string"?(r&&this.identifyAs(r),this.activate()):this.deactivate()}constructor(r,n,s){super(r.nativeElement,n),s&&this.attach(s)}ngOnDestroy(){this.parent&&this.detach()}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)(g(Ne),g(Sr),g(U,12))}),c(t,"\u0275dir",P({type:e,selectors:[["","lpjNode",""]],inputs:{lpjNode:"lpjNode"},exportAs:["lpjNode"],standalone:!0,features:[Gt([{provide:U,useExisting:e}]),Wt]})),t})(),Sr=new jt("PROJECTION_COMPONENTS",{factory:()=>[]}),Tr=new jt("ANIMATION_HANDLERS",{factory:()=>[]}),Mr=new jt("ANIMATION_PLANNERS",{factory:()=>[]});var Dn=[{provide:Y,useFactory:()=>new Y(j(st),j(nt),j(Mr))},{provide:ot,useFactory:()=>new ot(j(Tr))},{provide:st,useFactory:()=>new st(j(ot))},{provide:nt,useFactory:()=>new nt},{provide:L,useFactory:()=>new L}],Ii=(()=>{let e=class{static forRoot(r={}){let n=(s,i)=>i.map(a=>({provide:s,useClass:a,multi:!0}));return{ngModule:e,providers:[Dn,n(Sr,r.components??[]),n(Tr,r.animationHandlers??[]),n(Mr,r.animationPlanners??[])]}}},t=e;return c(t,"\u0275fac",function(n){return new(n||e)}),c(t,"\u0275mod",Ae({type:e})),c(t,"\u0275inj",Ce({})),t})();function Fi(){let t=j(ke);return()=>t.getContext("primary")?.route?.snapshot?.data?.animationId??"none"}var it=class{static apply(...e){return Zt(this.content)}},xe=class extends it{},Ht=xe;(()=>{xe.content=lt([N("mat-drawer",v({transform:"none"}),{optional:!0})])})();var ye=class extends it{},qt=ye;(()=>{ye.content=lt([N("router-outlet ~ *",[$("1ms",v({}))],{optional:!0})])})();var be=class extends it{},Er=be;(()=>{be.content=lt([Ht.apply(),Jt([N(":leave",[v({position:"absolute"}),qt.apply(),v({opacity:1}),$(`90ms ${H.ACCELERATION_CURVE}`,v({opacity:0}))],{optional:!0}),N(":enter",[v({transform:"scale(92%)",opacity:0}),$(`210ms 90ms ${H.DECELERATION_CURVE}`,v({transform:"scale(1)",opacity:1}))])])])})();var Rr=class extends it{static apply(e,o,r={incoming:":enter",outgoing:":leave"}){let n=e==="x"?{overflowX:"visible",overflowY:"*",transformIncomingFrom:"translateX(30px)",transformIncomingTo:"translateX(0)",transformOutgoingFrom:"translateX(0)",transformOutgoingTo:"translateX(-30px)"}:e==="y"?{overflowX:"*",overflowY:"visible",transformIncomingFrom:"translateY(30px)",transformIncomingTo:"translateY(0)",transformOutgoingFrom:"translateY(0)",transformOutgoingTo:"translateY(-30px)"}:{overflowX:"visible",overflowY:"visible",transformIncomingFrom:"scale(80%)",transformIncomingTo:"scale(100%)",transformOutgoingFrom:"scale(100%)",transformOutgoingTo:"scale(110%)"};return o==="backward"&&([n.transformIncomingFrom,n.transformIncomingTo,n.transformOutgoingFrom,n.transformOutgoingTo]=[n.transformOutgoingTo,n.transformOutgoingFrom,n.transformIncomingTo,n.transformIncomingFrom]),Zt(lt([Ht.apply(),Jt([N(r.outgoing,[v({transform:n.transformOutgoingFrom}),$(`300ms ${H.STANDARD_CURVE}`,v({transform:n.transformOutgoingTo}))]),N(r.incoming,[v({transform:n.transformIncomingFrom}),$(`300ms ${H.STANDARD_CURVE}`,v({transform:n.transformIncomingTo}))]),N(r.outgoing,[qt.apply(),$(`90ms ${H.ACCELERATION_CURVE}`,v({opacity:0}))]),N(r.incoming,[v({opacity:0}),$(`210ms 90ms ${H.DECELERATION_CURVE}`,v({opacity:1}))])])]))}};var Fr=(()=>{let e=class{constructor(){this.observer=j($e),this.config$=new Te(1),this.breakpoints$=this.config$.pipe(Ot(r=>this.observeBreakpoints(r)))}applyConfig(r){this.config$.next(r)}observeBreakpoints(r){return this.observer.observe(Object.values(r)).pipe(wt(n=>this.parseState(r,n)))}parseState(r,n){let s={};for(let i in r){let a=i,l=r[a];s[a]=n.breakpoints[l]}return s}},t=e;return(()=>{e.\u0275fac=function(n){return new(n||e)}})(),(()=>{e.\u0275prov=z({token:e,factory:e.\u0275fac,providedIn:"root"})})(),t})();function Vi(){let t=j(Fr).breakpoints$;return Ve(t,{initialValue:{["tablet-portrait"]:!1,["tablet-landscape"]:!1,laptop:!1,desktop:!1}})}var qi=(()=>{let e=class{},t=e;return(()=>{e.\u0275fac=function(n){return new(n||e)}})(),(()=>{e.\u0275prov=z({token:e,factory:e.\u0275fac})})(),t})();export{L as a,T as b,Y as c,U as d,xi as e,yi as f,bi as g,vi as h,Fn as i,wi as j,Oi as k,Ii as l,qi as m,Fi as n,Er as o,Rr as p,Fr as q,Vi as r};