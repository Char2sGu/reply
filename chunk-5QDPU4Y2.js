import{a as j}from"./chunk-MILDH525.js";import{A as nt,C as it,D as st,G as at,I as ot,K as Z,L as ct,La as P,R as w,S as ut,W as lt,X as z,d as G,fa as Y,hb as H,m as et,oa as J,pa as ft,s as rt,ta as x}from"./chunk-HFIM43UT.js";var kt=(()=>{let t=class{constructor(r){this.elementRef=r,this.scrollDown=new H,this.scrollUp=new H,this.scrollTop$=new G,this.scrollTopDiff$=this.scrollTop$.pipe(Z(0),at(),et(([e,i])=>i-e)),this.scrollTopDiff$.subscribe(e=>{e>0&&this.scrollDown.emit(),e<0&&this.scrollUp.emit()})}onScroll(){this.scrollTop$.next(this.elementRef.nativeElement.scrollTop)}},s=t;return(()=>{t.\u0275fac=function(e){return new(e||t)(x(J))}})(),(()=>{t.\u0275dir=z({type:t,selectors:[["","scrollUp",""],["","scrollDown",""]],hostBindings:function(e,i){e&1&&P("scroll",function(){return i.onScroll()})},outputs:{scrollDown:"scrollDown",scrollUp:"scrollUp"},standalone:!0})})(),s})(),Q=(()=>{let t=class{constructor(){this.scrollStopDelay=500}},s=t;return(()=>{t.\u0275fac=function(e){return new(e||t)}})(),(()=>{t.\u0275prov=w({token:t,factory:t.\u0275fac})})(),s})(),Bt=(()=>{let t=class{constructor(r,e,i){this.config=r,this.renderer=e,this.elementRef=i,this.scrollStart=new H,this.scrollStop=new H,this.scroll$=new G,this.scrolling$=this.scroll$.pipe(ct(()=>rt(this.config.scrollStopDelay).pipe(nt(),Z(!0),st(!1))),it(),ot(1)),this.scrolling$.subscribe(a=>{a?this.scrollStart.emit():this.scrollStop.emit()}),this.scrollStart.subscribe(()=>{this.className&&this.renderer.addClass(this.elementRef.nativeElement,this.className)}),this.scrollStop.subscribe(()=>{this.className&&this.renderer.removeClass(this.elementRef.nativeElement,this.className)})}onScroll(){this.scroll$.next(null)}},s=t;return(()=>{t.\u0275fac=function(e){return new(e||t)(x(Q),x(ft),x(J))}})(),(()=>{t.\u0275dir=z({type:t,selectors:[["","scrolling",""],["","scrollStart",""],["","scrollStop",""]],hostBindings:function(e,i){e&1&&P("scroll",function(){return i.onScroll()})},inputs:{className:["scrolling","className"]},outputs:{scrollStart:"scrollStart",scrollStop:"scrollStop"},standalone:!0})})(),s})();var Vt=(()=>{let t=class{static forRoot(r=new Q){return{ngModule:t,providers:[{provide:Q,useValue:r}]}}},s=t;return(()=>{t.\u0275fac=function(e){return new(e||t)}})(),(()=>{t.\u0275mod=lt({type:t})})(),(()=>{t.\u0275inj=ut({})})(),s})();var zt=(()=>{let t=class extends j{identify(r){return r.id}},s=t;return(()=>{t.\u0275fac=function(){let r;return function(i){return(r||(r=Y(t)))(i||t)}}()})(),(()=>{t.\u0275prov=w({token:t,factory:t.\u0275fac,providedIn:"root"})})(),s})();var Qt=(()=>{let t=class extends j{identify(r){return r.id}},s=t;return(()=>{t.\u0275fac=function(){let r;return function(i){return(r||(r=Y(t)))(i||t)}}()})(),(()=>{t.\u0275prov=w({token:t,factory:t.\u0275fac,providedIn:"root"})})(),s})();var dt=60,vt=dt*60,pt=vt*24,Ot=pt*7,O=1e3,W=dt*O,X=vt*O,Dt=pt*O,St=Ot*O,R="millisecond",m="second",y="minute",I="hour",C="day",L="week",p="month",k="quarter",M="year",g="date",$t="YYYY-MM-DDTHH:mm:ssZ",K="Invalid Date",Ct=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,Mt=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;var yt={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var n=["th","st","nd","rd"],r=t%100;return"["+t+(n[(r-20)%10]||n[r]||n[0])+"]"}};var q=function(t,n,r){var e=String(t);return!e||e.length>=n?t:""+Array(n+1-e.length).join(r)+t},Nt=function(t){var n=-t.utcOffset(),r=Math.abs(n),e=Math.floor(r/60),i=r%60;return(n<=0?"+":"-")+q(e,2,"0")+":"+q(i,2,"0")},_t=function s(t,n){if(t.date()<n.date())return-s(n,t);var r=(n.year()-t.year())*12+(n.month()-t.month()),e=t.clone().add(r,p),i=n-e<0,a=t.clone().add(r+(i?-1:1),p);return+(-(r+(n-e)/(i?e-a:a-e))||0)},At=function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},wt=function(t){var n={M:p,y:M,w:L,d:C,D:g,h:I,m:y,s:m,ms:R,Q:k};return n[t]||String(t||"").toLowerCase().replace(/s$/,"")},Lt=function(t){return t===void 0},It={s:q,z:Nt,m:_t,a:At,p:wt,u:Lt};var F="en",N={};N[F]=yt;var tt=function(t){return t instanceof V},B=function s(t,n,r){var e;if(!t)return F;if(typeof t=="string"){var i=t.toLowerCase();N[i]&&(e=i),n&&(N[i]=n,e=i);var a=t.split("-");if(!e&&a.length>1)return s(a[0])}else{var c=t.name;N[c]=t,e=c}return!r&&e&&(F=e),e||!r&&F},h=function(t,n){if(tt(t))return t.clone();var r=typeof n=="object"?n:{};return r.date=t,r.args=arguments,new V(r)},Tt=function(t,n){return h(t,{locale:n.$L,utc:n.$u,x:n.$x,$offset:n.$offset})},o=It;o.l=B;o.i=tt;o.w=Tt;var xt=function(t){var n=t.date,r=t.utc;if(n===null)return new Date(NaN);if(o.u(n))return new Date;if(n instanceof Date)return new Date(n);if(typeof n=="string"&&!/Z$/i.test(n)){var e=n.match(Ct);if(e){var i=e[2]-1||0,a=(e[7]||"0").substring(0,3);return r?new Date(Date.UTC(e[1],i,e[3]||1,e[4]||0,e[5]||0,e[6]||0,a)):new Date(e[1],i,e[3]||1,e[4]||0,e[5]||0,e[6]||0,a)}}return new Date(n)},V=function(){function s(n){this.$L=B(n.locale,null,!0),this.parse(n)}var t=s.prototype;return t.parse=function(r){this.$d=xt(r),this.$x=r.x||{},this.init()},t.init=function(){var r=this.$d;this.$y=r.getFullYear(),this.$M=r.getMonth(),this.$D=r.getDate(),this.$W=r.getDay(),this.$H=r.getHours(),this.$m=r.getMinutes(),this.$s=r.getSeconds(),this.$ms=r.getMilliseconds()},t.$utils=function(){return o},t.isValid=function(){return this.$d.toString()!==K},t.isSame=function(r,e){var i=h(r);return this.startOf(e)<=i&&i<=this.endOf(e)},t.isAfter=function(r,e){return h(r)<this.startOf(e)},t.isBefore=function(r,e){return this.endOf(e)<h(r)},t.$g=function(r,e,i){return o.u(r)?this[e]:this.set(i,r)},t.unix=function(){return Math.floor(this.valueOf()/1e3)},t.valueOf=function(){return this.$d.getTime()},t.startOf=function(r,e){var i=this,a=o.u(e)?!0:e,c=o.p(r),u=function(_,S){var v=o.w(i.$u?Date.UTC(i.$y,S,_):new Date(i.$y,S,_),i);return a?v:v.endOf(C)},d=function(_,S){var v=[0,0,0,0],A=[23,59,59,999];return o.w(i.toDate()[_].apply(i.toDate("s"),(a?v:A).slice(S)),i)},l=this.$W,D=this.$M,f=this.$D,$="set"+(this.$u?"UTC":"");switch(c){case M:return a?u(1,0):u(31,11);case p:return a?u(1,D):u(0,D+1);case L:{var E=this.$locale().weekStart||0,T=(l<E?l+7:l)-E;return u(a?f-T:f+(6-T),D)}case C:case g:return d($+"Hours",0);case I:return d($+"Minutes",1);case y:return d($+"Seconds",2);case m:return d($+"Milliseconds",3);default:return this.clone()}},t.endOf=function(r){return this.startOf(r,!1)},t.$set=function(r,e){var i,a=o.p(r),c="set"+(this.$u?"UTC":""),u=(i={},i[C]=c+"Date",i[g]=c+"Date",i[p]=c+"Month",i[M]=c+"FullYear",i[I]=c+"Hours",i[y]=c+"Minutes",i[m]=c+"Seconds",i[R]=c+"Milliseconds",i)[a],d=a===C?this.$D+(e-this.$W):e;if(a===p||a===M){var l=this.clone().set(g,1);l.$d[u](d),l.init(),this.$d=l.set(g,Math.min(this.$D,l.daysInMonth())).$d}else u&&this.$d[u](d);return this.init(),this},t.set=function(r,e){return this.clone().$set(r,e)},t.get=function(r){return this[o.p(r)]()},t.add=function(r,e){var i=this,a;r=Number(r);var c=o.p(e),u=function(f){var $=h(i);return o.w($.date($.date()+Math.round(f*r)),i)};if(c===p)return this.set(p,this.$M+r);if(c===M)return this.set(M,this.$y+r);if(c===C)return u(1);if(c===L)return u(7);var d=(a={},a[y]=W,a[I]=X,a[m]=O,a)[c]||1,l=this.$d.getTime()+r*d;return o.w(l,this)},t.subtract=function(r,e){return this.add(r*-1,e)},t.format=function(r){var e=this,i=this.$locale();if(!this.isValid())return i.invalidDate||K;var a=r||$t,c=o.z(this),u=this.$H,d=this.$m,l=this.$M,D=i.weekdays,f=i.months,$=i.meridiem,E=function(v,A,b,Et){return v&&(v[A]||v(e,a))||b[A].slice(0,Et)},T=function(v){return o.s(u%12||12,v,"0")},U=$||function(S,v,A){var b=S<12?"AM":"PM";return A?b.toLowerCase():b},_=function(v){switch(v){case"YY":return String(e.$y).slice(-2);case"YYYY":return o.s(e.$y,4,"0");case"M":return l+1;case"MM":return o.s(l+1,2,"0");case"MMM":return E(i.monthsShort,l,f,3);case"MMMM":return E(f,l);case"D":return e.$D;case"DD":return o.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return E(i.weekdaysMin,e.$W,D,2);case"ddd":return E(i.weekdaysShort,e.$W,D,3);case"dddd":return D[e.$W];case"H":return String(u);case"HH":return o.s(u,2,"0");case"h":return T(1);case"hh":return T(2);case"a":return U(u,d,!0);case"A":return U(u,d,!1);case"m":return String(d);case"mm":return o.s(d,2,"0");case"s":return String(e.$s);case"ss":return o.s(e.$s,2,"0");case"SSS":return o.s(e.$ms,3,"0");case"Z":return c;default:break}return null};return a.replace(Mt,function(S,v){return v||_(S)||c.replace(":","")})},t.utcOffset=function(){return-Math.round(this.$d.getTimezoneOffset()/15)*15},t.diff=function(r,e,i){var a=this,c=o.p(e),u=h(r),d=(u.utcOffset()-this.utcOffset())*W,l=this-u,D=function(){return o.m(a,u)},f;switch(c){case M:f=D()/12;break;case p:f=D();break;case k:f=D()/3;break;case L:f=(l-d)/St;break;case C:f=(l-d)/Dt;break;case I:f=l/X;break;case y:f=l/W;break;case m:f=l/O;break;default:f=l;break}return i?f:o.a(f)},t.daysInMonth=function(){return this.endOf(p).$D},t.$locale=function(){return N[this.$L]},t.locale=function(r,e){if(!r)return this.$L;var i=this.clone(),a=B(r,e,!0);return a&&(i.$L=a),i},t.clone=function(){return o.w(this.$d,this)},t.toDate=function(){return new Date(this.valueOf())},t.toJSON=function(){return this.isValid()?this.toISOString():null},t.toISOString=function(){return this.$d.toISOString()},t.toString=function(){return this.$d.toUTCString()},s}(),gt=V.prototype;h.prototype=gt;[["$ms",R],["$s",m],["$m",y],["$H",I],["$W",C],["$M",p],["$y",M],["$D",g]].forEach(function(s){gt[s[1]]=function(t){return this.$g(t,s[0],s[1])}});h.extend=function(s,t){return s.$i||(s(t,V,h),s.$i=!0),h};h.locale=B;h.isDayjs=tt;h.unix=function(s){return h(s*1e3)};h.en=N[F];h.Ls=N;h.p={};var re=h;export{kt as a,Bt as b,Vt as c,zt as d,Qt as e,re as f};
