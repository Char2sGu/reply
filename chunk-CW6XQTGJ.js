import{a as f}from"./chunk-T3VJN7I3.js";import{a as v}from"./chunk-5RPBRSJY.js";import{a}from"./chunk-6Q7PW4SA.js";import{a as y}from"./chunk-3UZNBURP.js";import{b as h}from"./chunk-5SE4VJ2X.js";import{Fd as D,Ga as l,ea as s,ha as d,ia as n,p as c,q as u,qd as m}from"./chunk-VGXZBCX5.js";var P=(()=>{let e=class{constructor(){this.store=s(D)}transform(t){return t instanceof Array?u(t.map(r=>this.transformOne(r))):this.transformOne(t)}transformOne(t){let{email:r}=t;return this.store.select(h.selectContacts).pipe(c(o=>o.queryOne(M=>M.email===r)),c(o=>o??this.generateContact(t)))}generateContact(t){return{id:`generated-${t.email}`,name:t.name,email:t.email}}},i=e;return(()=>{e.\u0275fac=function(r){return new(r||e)}})(),(()=>{e.\u0275pipe=n({name:"contactFromMailParticipant",type:e,pure:!0,standalone:!0})})(),i})();var Y=(()=>{let e=class{constructor(){this.bottomNavService=s(y),this.scrollDirections=s(a),this.scrollDirections.scrollUp.pipe(m()).subscribe(()=>{this.bottomNavService.setStatus("expanded")}),this.scrollDirections.scrollDown.pipe(m()).subscribe(()=>{this.bottomNavService.setStatus("collapsed")})}},i=e;return(()=>{e.\u0275fac=function(r){return new(r||e)}})(),(()=>{e.\u0275dir=d({type:e,selectors:[["","rplLayoutContent",""]],standalone:!0,features:[l([a])]})})(),i})();var B=(()=>{let e=class{constructor(){this.dateDistancePipe=new v}transform(t){let r=f(t),o=f();return r.diff(o,"week")>-1?this.dateDistancePipe.transform(t):r.diff(o,"year")>-1?r.format("MMM D"):r.format("MMM D, YYYY")}},i=e;return(()=>{e.\u0275fac=function(r){return new(r||e)}})(),(()=>{e.\u0275pipe=n({name:"readableDate",type:e,pure:!0,standalone:!0})})(),i})();var H=(()=>{let e=class{transform(t,r){return t instanceof Array?r.query(o=>t.includes(r.identify(o))):r.retrieve(t)}},i=e;return(()=>{e.\u0275fac=function(r){return new(r||e)}})(),(()=>{e.\u0275pipe=n({name:"resolveRef",type:e,pure:!0,standalone:!0})})(),i})();export{P as a,Y as b,B as c,H as d};
