var V=60,Z=V*60,z=Z*24,nt=z*7,y=1e3,U=V*y,k=Z*y,J=z*y,P=nt*y,x="millisecond",p="second",m="minute",O="hour",M="day",g="week",S="month",F="quarter",_="year",I="date",Q="YYYY-MM-DDTHH:mm:ssZ",b="Invalid Date",X=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,K=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;var q={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}};var j=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},at=function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),a=n%60;return(e<=0?"+":"-")+j(r,2,"0")+":"+j(a,2,"0")},it=function u(t,e){if(t.date()<e.date())return-u(e,t);var n=(e.year()-t.year())*12+(e.month()-t.month()),r=t.clone().add(n,S),a=e-r<0,i=t.clone().add(n+(a?-1:1),S);return+(-(n+(e-r)/(a?r-i:i-r))||0)},st=function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},ut=function(t){var e={M:S,y:_,w:g,d:M,D:I,h:O,m,s:p,ms:x,Q:F};return e[t]||String(t||"").toLowerCase().replace(/s$/,"")},ot=function(t){return t===void 0},tt={s:j,z:at,m:it,a:st,p:ut,u:ot};var w="en",A={};A[w]=q;var G=function(t){return t instanceof R},W=function u(t,e,n){var r;if(!t)return w;if(typeof t=="string"){var a=t.toLowerCase();A[a]&&(r=a),e&&(A[a]=e,r=a);var i=t.split("-");if(!r&&i.length>1)return u(i[0])}else{var o=t.name;A[o]=t,r=o}return!n&&r&&(w=r),r||!n&&w},v=function(t,e){if(G(t))return t.clone();var n=typeof e=="object"?e:{};return n.date=t,n.args=arguments,new R(n)},ct=function(t,e){return v(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})},s=tt;s.l=W;s.i=G;s.w=ct;var ft=function(t){var e=t.date,n=t.utc;if(e===null)return new Date(NaN);if(s.u(e))return new Date;if(e instanceof Date)return new Date(e);if(typeof e=="string"&&!/Z$/i.test(e)){var r=e.match(X);if(r){var a=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(e)},R=function(){function u(e){this.$L=W(e.locale,null,!0),this.parse(e)}var t=u.prototype;return t.parse=function(n){this.$d=ft(n),this.$x=n.x||{},this.init()},t.init=function(){var n=this.$d;this.$y=n.getFullYear(),this.$M=n.getMonth(),this.$D=n.getDate(),this.$W=n.getDay(),this.$H=n.getHours(),this.$m=n.getMinutes(),this.$s=n.getSeconds(),this.$ms=n.getMilliseconds()},t.$utils=function(){return s},t.isValid=function(){return this.$d.toString()!==b},t.isSame=function(n,r){var a=v(n);return this.startOf(r)<=a&&a<=this.endOf(r)},t.isAfter=function(n,r){return v(n)<this.startOf(r)},t.isBefore=function(n,r){return this.endOf(r)<v(n)},t.$g=function(n,r,a){return s.u(n)?this[r]:this.set(a,n)},t.unix=function(){return Math.floor(this.valueOf()/1e3)},t.valueOf=function(){return this.$d.getTime()},t.startOf=function(n,r){var a=this,i=s.u(r)?!0:r,o=s.p(n),c=function(N,l){var $=s.w(a.$u?Date.UTC(a.$y,l,N):new Date(a.$y,l,N),a);return i?$:$.endOf(M)},C=function(N,l){var $=[0,0,0,0],L=[23,59,59,999];return s.w(a.toDate()[N].apply(a.toDate("s"),(i?$:L).slice(l)),a)},f=this.$W,d=this.$M,h=this.$D,D="set"+(this.$u?"UTC":"");switch(o){case _:return i?c(1,0):c(31,11);case S:return i?c(1,d):c(0,d+1);case g:{var E=this.$locale().weekStart||0,T=(f<E?f+7:f)-E;return c(i?h-T:h+(6-T),d)}case M:case I:return C(D+"Hours",0);case O:return C(D+"Minutes",1);case m:return C(D+"Seconds",2);case p:return C(D+"Milliseconds",3);default:return this.clone()}},t.endOf=function(n){return this.startOf(n,!1)},t.$set=function(n,r){var a,i=s.p(n),o="set"+(this.$u?"UTC":""),c=(a={},a[M]=o+"Date",a[I]=o+"Date",a[S]=o+"Month",a[_]=o+"FullYear",a[O]=o+"Hours",a[m]=o+"Minutes",a[p]=o+"Seconds",a[x]=o+"Milliseconds",a)[i],C=i===M?this.$D+(r-this.$W):r;if(i===S||i===_){var f=this.clone().set(I,1);f.$d[c](C),f.init(),this.$d=f.set(I,Math.min(this.$D,f.daysInMonth())).$d}else c&&this.$d[c](C);return this.init(),this},t.set=function(n,r){return this.clone().$set(n,r)},t.get=function(n){return this[s.p(n)]()},t.add=function(n,r){var a=this,i;n=Number(n);var o=s.p(r),c=function(h){var D=v(a);return s.w(D.date(D.date()+Math.round(h*n)),a)};if(o===S)return this.set(S,this.$M+n);if(o===_)return this.set(_,this.$y+n);if(o===M)return c(1);if(o===g)return c(7);var C=(i={},i[m]=U,i[O]=k,i[p]=y,i)[o]||1,f=this.$d.getTime()+n*C;return s.w(f,this)},t.subtract=function(n,r){return this.add(n*-1,r)},t.format=function(n){var r=this,a=this.$locale();if(!this.isValid())return a.invalidDate||b;var i=n||Q,o=s.z(this),c=this.$H,C=this.$m,f=this.$M,d=a.weekdays,h=a.months,D=a.meridiem,E=function($,L,Y,et){return $&&($[L]||$(r,i))||Y[L].slice(0,et)},T=function($){return s.s(c%12||12,$,"0")},H=D||function(l,$,L){var Y=l<12?"AM":"PM";return L?Y.toLowerCase():Y},N=function($){switch($){case"YY":return String(r.$y).slice(-2);case"YYYY":return s.s(r.$y,4,"0");case"M":return f+1;case"MM":return s.s(f+1,2,"0");case"MMM":return E(a.monthsShort,f,h,3);case"MMMM":return E(h,f);case"D":return r.$D;case"DD":return s.s(r.$D,2,"0");case"d":return String(r.$W);case"dd":return E(a.weekdaysMin,r.$W,d,2);case"ddd":return E(a.weekdaysShort,r.$W,d,3);case"dddd":return d[r.$W];case"H":return String(c);case"HH":return s.s(c,2,"0");case"h":return T(1);case"hh":return T(2);case"a":return H(c,C,!0);case"A":return H(c,C,!1);case"m":return String(C);case"mm":return s.s(C,2,"0");case"s":return String(r.$s);case"ss":return s.s(r.$s,2,"0");case"SSS":return s.s(r.$ms,3,"0");case"Z":return o;default:break}return null};return i.replace(K,function(l,$){return $||N(l)||o.replace(":","")})},t.utcOffset=function(){return-Math.round(this.$d.getTimezoneOffset()/15)*15},t.diff=function(n,r,a){var i=this,o=s.p(r),c=v(n),C=(c.utcOffset()-this.utcOffset())*U,f=this-c,d=function(){return s.m(i,c)},h;switch(o){case _:h=d()/12;break;case S:h=d();break;case F:h=d()/3;break;case g:h=(f-C)/P;break;case M:h=(f-C)/J;break;case O:h=f/k;break;case m:h=f/U;break;case p:h=f/y;break;default:h=f;break}return a?h:s.a(h)},t.daysInMonth=function(){return this.endOf(S).$D},t.$locale=function(){return A[this.$L]},t.locale=function(n,r){if(!n)return this.$L;var a=this.clone(),i=W(n,r,!0);return i&&(a.$L=i),a},t.clone=function(){return s.w(this.$d,this)},t.toDate=function(){return new Date(this.valueOf())},t.toJSON=function(){return this.isValid()?this.toISOString():null},t.toISOString=function(){return this.$d.toISOString()},t.toString=function(){return this.$d.toUTCString()},u}(),rt=R.prototype;v.prototype=rt;[["$ms",x],["$s",p],["$m",m],["$H",O],["$W",M],["$M",S],["$y",_],["$D",I]].forEach(function(u){rt[u[1]]=function(t){return this.$g(t,u[0],u[1])}});v.extend=function(u,t){return u.$i||(u(t,R,v),u.$i=!0),v};v.locale=W;v.isDayjs=G;v.unix=function(u){return v(u*1e3)};v.en=A[w];v.Ls=A;v.p={};var St=v;export{St as a};
