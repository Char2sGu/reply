import{$ as W,M as X,S as Q,V as P,_ as K,b as J,ea as ee,qa as Y,sd as te,ua as k}from"./chunk-GLFUZ6DN.js";var re=60,ne=re*60,se=ne*24,pe=se*7,A=1e3,V=re*A,j=ne*A,ie=se*A,ae=pe*A,b="millisecond",m="second",D="minute",$="hour",y="day",N="week",p="month",U="quarter",M="year",E="date",oe="YYYY-MM-DDTHH:mm:ssZ",G="Invalid Date",ue=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,ce=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;var le={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],n=e%100;return"["+e+(t[(n-20)%10]||t[n]||t[0])+"]"}};var q=function(e,t,n){var r=String(e);return!r||r.length>=t?e:""+Array(t+1-r.length).join(n)+e},Ce=function(e){var t=-e.utcOffset(),n=Math.abs(t),r=Math.floor(n/60),s=n%60;return(t<=0?"+":"-")+q(r,2,"0")+":"+q(s,2,"0")},Se=function a(e,t){if(e.date()<t.date())return-a(t,e);var n=(t.year()-e.year())*12+(t.month()-e.month()),r=e.clone().add(n,p),s=t-r<0,i=e.clone().add(n+(s?-1:1),p);return+(-(n+(t-r)/(s?r-i:i-r))||0)},ge=function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},ye=function(e){var t={M:p,y:M,w:N,d:y,D:E,h:$,m:D,s:m,ms:b,Q:U};return t[e]||String(e||"").toLowerCase().replace(/s$/,"")},Me=function(e){return e===void 0},fe={s:q,z:Ce,m:Se,a:ge,p:ye,u:Me};var R="en",I={};I[R]=le;var z=function(e){return e instanceof H},F=function a(e,t,n){var r;if(!e)return R;if(typeof e=="string"){var s=e.toLowerCase();I[s]&&(r=s),t&&(I[s]=t,r=s);var i=e.split("-");if(!r&&i.length>1)return a(i[0])}else{var u=e.name;I[u]=e,r=u}return!n&&r&&(R=r),r||!n&&R},f=function(e,t){if(z(e))return e.clone();var n=typeof t=="object"?t:{};return n.date=e,n.args=arguments,new H(n)},me=function(e,t){return f(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})},o=fe;o.l=F;o.i=z;o.w=me;var De=function(e){var t=e.date,n=e.utc;if(t===null)return new Date(NaN);if(o.u(t))return new Date;if(t instanceof Date)return new Date(t);if(typeof t=="string"&&!/Z$/i.test(t)){var r=t.match(ue);if(r){var s=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(t)},H=function(){function a(t){this.$L=F(t.locale,null,!0),this.parse(t)}var e=a.prototype;return e.parse=function(n){this.$d=De(n),this.$x=n.x||{},this.init()},e.init=function(){var n=this.$d;this.$y=n.getFullYear(),this.$M=n.getMonth(),this.$D=n.getDate(),this.$W=n.getDay(),this.$H=n.getHours(),this.$m=n.getMinutes(),this.$s=n.getSeconds(),this.$ms=n.getMilliseconds()},e.$utils=function(){return o},e.isValid=function(){return this.$d.toString()!==G},e.isSame=function(n,r){var s=f(n);return this.startOf(r)<=s&&s<=this.endOf(r)},e.isAfter=function(n,r){return f(n)<this.startOf(r)},e.isBefore=function(n,r){return this.endOf(r)<f(n)},e.$g=function(n,r,s){return o.u(n)?this[r]:this.set(s,n)},e.unix=function(){return Math.floor(this.valueOf()/1e3)},e.valueOf=function(){return this.$d.getTime()},e.startOf=function(n,r){var s=this,i=o.u(r)?!0:r,u=o.p(n),c=function(w,S){var v=o.w(s.$u?Date.UTC(s.$y,S,w):new Date(s.$y,S,w),s);return i?v:v.endOf(y)},h=function(w,S){var v=[0,0,0,0],O=[23,59,59,999];return o.w(s.toDate()[w].apply(s.toDate("s"),(i?v:O).slice(S)),s)},d=this.$W,C=this.$M,l=this.$D,g="set"+(this.$u?"UTC":"");switch(u){case M:return i?c(1,0):c(31,11);case p:return i?c(1,C):c(0,C+1);case N:{var _=this.$locale().weekStart||0,T=(d<_?d+7:d)-_;return c(i?l-T:l+(6-T),C)}case y:case E:return h(g+"Hours",0);case $:return h(g+"Minutes",1);case D:return h(g+"Seconds",2);case m:return h(g+"Milliseconds",3);default:return this.clone()}},e.endOf=function(n){return this.startOf(n,!1)},e.$set=function(n,r){var s,i=o.p(n),u="set"+(this.$u?"UTC":""),c=(s={},s[y]=u+"Date",s[E]=u+"Date",s[p]=u+"Month",s[M]=u+"FullYear",s[$]=u+"Hours",s[D]=u+"Minutes",s[m]=u+"Seconds",s[b]=u+"Milliseconds",s)[i],h=i===y?this.$D+(r-this.$W):r;if(i===p||i===M){var d=this.clone().set(E,1);d.$d[c](h),d.init(),this.$d=d.set(E,Math.min(this.$D,d.daysInMonth())).$d}else c&&this.$d[c](h);return this.init(),this},e.set=function(n,r){return this.clone().$set(n,r)},e.get=function(n){return this[o.p(n)]()},e.add=function(n,r){var s=this,i;n=Number(n);var u=o.p(r),c=function(l){var g=f(s);return o.w(g.date(g.date()+Math.round(l*n)),s)};if(u===p)return this.set(p,this.$M+n);if(u===M)return this.set(M,this.$y+n);if(u===y)return c(1);if(u===N)return c(7);var h=(i={},i[D]=V,i[$]=j,i[m]=A,i)[u]||1,d=this.$d.getTime()+n*h;return o.w(d,this)},e.subtract=function(n,r){return this.add(n*-1,r)},e.format=function(n){var r=this,s=this.$locale();if(!this.isValid())return s.invalidDate||G;var i=n||oe,u=o.z(this),c=this.$H,h=this.$m,d=this.$M,C=s.weekdays,l=s.months,g=s.meridiem,_=function(v,O,L,ve){return v&&(v[O]||v(r,i))||L[O].slice(0,ve)},T=function(v){return o.s(c%12||12,v,"0")},x=g||function(S,v,O){var L=S<12?"AM":"PM";return O?L.toLowerCase():L},w=function(v){switch(v){case"YY":return String(r.$y).slice(-2);case"YYYY":return o.s(r.$y,4,"0");case"M":return d+1;case"MM":return o.s(d+1,2,"0");case"MMM":return _(s.monthsShort,d,l,3);case"MMMM":return _(l,d);case"D":return r.$D;case"DD":return o.s(r.$D,2,"0");case"d":return String(r.$W);case"dd":return _(s.weekdaysMin,r.$W,C,2);case"ddd":return _(s.weekdaysShort,r.$W,C,3);case"dddd":return C[r.$W];case"H":return String(c);case"HH":return o.s(c,2,"0");case"h":return T(1);case"hh":return T(2);case"a":return x(c,h,!0);case"A":return x(c,h,!1);case"m":return String(h);case"mm":return o.s(h,2,"0");case"s":return String(r.$s);case"ss":return o.s(r.$s,2,"0");case"SSS":return o.s(r.$ms,3,"0");case"Z":return u;default:break}return null};return i.replace(ce,function(S,v){return v||w(S)||u.replace(":","")})},e.utcOffset=function(){return-Math.round(this.$d.getTimezoneOffset()/15)*15},e.diff=function(n,r,s){var i=this,u=o.p(r),c=f(n),h=(c.utcOffset()-this.utcOffset())*V,d=this-c,C=function(){return o.m(i,c)},l;switch(u){case M:l=C()/12;break;case p:l=C();break;case U:l=C()/3;break;case N:l=(d-h)/ae;break;case y:l=(d-h)/ie;break;case $:l=d/j;break;case D:l=d/V;break;case m:l=d/A;break;default:l=d;break}return s?l:o.a(l)},e.daysInMonth=function(){return this.endOf(p).$D},e.$locale=function(){return I[this.$L]},e.locale=function(n,r){if(!n)return this.$L;var s=this.clone(),i=F(n,r,!0);return i&&(s.$L=i),s},e.clone=function(){return o.w(this.$d,this)},e.toDate=function(){return new Date(this.valueOf())},e.toJSON=function(){return this.isValid()?this.toISOString():null},e.toISOString=function(){return this.$d.toISOString()},e.toString=function(){return this.$d.toUTCString()},a}(),he=H.prototype;f.prototype=he;[["$ms",b],["$s",m],["$m",D],["$H",$],["$W",y],["$M",p],["$y",M],["$D",E]].forEach(function(a){he[a[1]]=function(e){return this.$g(e,a[0],a[1])}});f.extend=function(a,e){return a.$i||(a(e,H,f),a.$i=!0),f};f.locale=F;f.isDayjs=z;f.unix=function(a){return f(a*1e3)};f.en=I[R];f.Ls=I;f.p={};var Te=f;var Le=(()=>{let e=class extends te{identify(n){return n.id}},a=e;return(()=>{e.\u0275fac=function(){let n;return function(s){return(n||(n=ee(e)))(s||e)}}()})(),(()=>{e.\u0275prov=Q({token:e,factory:e.\u0275fac,providedIn:"root"})})(),a})();function $e(a){a||(Y($e),a=P(k));let e=new J(t=>a.onDestroy(t.next.bind(t)));return t=>t.pipe(X(e))}var B=class extends Error{constructor(e,t){super(Ee(e,t)),this.code=e}};function Ee(a,e){return`${`NG0${Math.abs(a)}`}${e?": "+e:""}`}var _e=(()=>typeof globalThis<"u"&&globalThis||typeof global<"u"&&global||typeof window<"u"&&window||typeof self<"u"&&typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&self)();var Z=class{constructor(e){this.ref=e}deref(){return this.ref}},je=_e.WeakRef??Z;function Ae(a,e){let t=!e?.manualCleanup;t&&!e?.injector&&Y(Ae);let n=t?e?.injector?.get(k)??P(k):null,r;e?.requireSync?r=W({kind:0}):r=W({kind:1,value:e?.initialValue});let s=a.subscribe({next:i=>r.set({kind:1,value:i}),error:i=>r.set({kind:2,error:i})});return n?.onDestroy(s.unsubscribe.bind(s)),K(()=>{let i=r();switch(i.kind){case 1:return i.value;case 2:throw i.error;case 0:throw new B(601,"`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.")}})}export{Te as a,Le as b,$e as c,Ae as d};
