import{Da as r,F as v,I as D,J as g,P as S,T as w,Ta as h,V as a,W as y,ba as b,ca as R,d as c,ga as $,ha as d,p,pb as o,w as m,ya as f,za as j}from"./chunk-VGXZBCX5.js";var x=(()=>{let t=class{constructor(s){this.elementRef=s,this.scrollDown=new o,this.scrollUp=new o,this.scrollTop$=new c,this.scrollTopDiff$=this.scrollTop$.pipe(a(0),S(),p(([e,n])=>n-e)),this.scrollTopDiff$.subscribe(e=>{e>0&&this.scrollDown.emit(),e<0&&this.scrollUp.emit()})}onScroll(){this.scrollTop$.next(this.elementRef.nativeElement.scrollTop)}},i=t;return(()=>{t.\u0275fac=function(e){return new(e||t)(r(f))}})(),(()=>{t.\u0275dir=d({type:t,selectors:[["","scrollUp",""],["","scrollDown",""]],hostBindings:function(e,n){e&1&&h("scroll",function(){return n.onScroll()})},outputs:{scrollDown:"scrollDown",scrollUp:"scrollUp"},standalone:!0})})(),i})(),u=(()=>{let t=class{constructor(){this.scrollStopDelay=500}},i=t;return(()=>{t.\u0275fac=function(e){return new(e||t)}})(),(()=>{t.\u0275prov=b({token:t,factory:t.\u0275fac})})(),i})(),C=(()=>{let t=class{constructor(s,e,n){this.config=s,this.renderer=e,this.elementRef=n,this.scrollStart=new o,this.scrollStop=new o,this.scroll$=new c,this.scrolling$=this.scroll$.pipe(y(()=>m(this.config.scrollStopDelay).pipe(v(),a(!0),g(!1))),D(),w(1)),this.scrolling$.subscribe(l=>{l?this.scrollStart.emit():this.scrollStop.emit()}),this.scrollStart.subscribe(()=>{this.className&&this.renderer.addClass(this.elementRef.nativeElement,this.className)}),this.scrollStop.subscribe(()=>{this.className&&this.renderer.removeClass(this.elementRef.nativeElement,this.className)})}onScroll(){this.scroll$.next(null)}},i=t;return(()=>{t.\u0275fac=function(e){return new(e||t)(r(u),r(j),r(f))}})(),(()=>{t.\u0275dir=d({type:t,selectors:[["","scrolling",""],["","scrollStart",""],["","scrollStop",""]],hostBindings:function(e,n){e&1&&h("scroll",function(){return n.onScroll()})},inputs:{className:["scrolling","className"]},outputs:{scrollStart:"scrollStart",scrollStop:"scrollStop"},standalone:!0})})(),i})();var W=(()=>{let t=class{static forRoot(s=new u){return{ngModule:t,providers:[{provide:u,useValue:s}]}}},i=t;return(()=>{t.\u0275fac=function(e){return new(e||t)}})(),(()=>{t.\u0275mod=$({type:t})})(),(()=>{t.\u0275inj=R({})})(),i})();export{x as a,C as b,W as c};
