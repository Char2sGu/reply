import{m as B}from"./chunk-N5WRZX2E.js";import{c as y,d as V,e as v,i as q,l as N}from"./chunk-FKHCC5JH.js";import{b as J}from"./chunk-N53OVHMM.js";import{d as W}from"./chunk-DZA5LO2U.js";import{a as G,b as H}from"./chunk-R6VSRYIY.js";import{Ca as R,Da as S,Ea as D,Fa as u,H as M,K as A,M as C,N as d,Q as s,U as p,X as a,Y as l,_ as x,ab as f,dd as P,e as m,ed as j,gd as F,hb as I,hd as E,ia as T,id as L,jb as U,k as w,kb as $,m as c,td as O,ua as g,ud as z}from"./chunk-3QVC2YGB.js";var Q=(()=>{let e=class{},n=e;return(()=>{e.\u0275fac=function(i){return new(i||e)}})(),(()=>{e.\u0275cmp=l({type:e,selectors:[["rpl-avatar"]],inputs:{contact:"contact"},standalone:!0,features:[f],decls:1,vars:1,consts:[["alt","Avatar",3,"src"]],template:function(i,o){if(i&1&&u(0,"img",0),i&2){let r;R("src",(r=o.contact.avatarUrl)!==null&&r!==void 0?r:"assets/avatar.png",T)}},styles:["[_nghost-%COMP%]{display:inline-block;width:40px;height:40px;border-radius:50%}img[_ngcontent-%COMP%]{width:inherit;height:inherit;border-radius:inherit}"],changeDetection:0})})(),n})();var Y=(()=>{let e=class{constructor(t,i){this.viewContainer=t,this.templateRef=i,this.initialized=!1}set value(t){if(t!==this.valueCurrent){if(this.valueCurrent=t,!this.initialized){this.viewContainer.createEmbeddedView(this.templateRef),this.initialized=!0;return}this.viewContainer.clear(),this.viewContainer.createEmbeddedView(this.templateRef)}}},n=e;return(()=>{e.\u0275fac=function(i){return new(i||e)(g($),g(U))}})(),(()=>{e.\u0275dir=x({type:e,selectors:[["","rplReattachOnChange",""]],inputs:{value:["rplReattachOnChange","value"]},standalone:!0})})(),n})();var st=(()=>{let e=class{constructor(){}ngOnInit(){}},n=e;return(()=>{e.\u0275fac=function(i){return new(i||e)}})(),(()=>{e.\u0275cmp=l({type:e,selectors:[["rpl-search-button"]],standalone:!0,features:[f],decls:2,vars:0,consts:[["mat-icon-button","","routerLink","/search","matTooltip","Search"],["fontSet","filled","fontIcon","search"]],template:function(i,o){i&1&&(S(0,"a",0),u(1,"mat-icon",1),D())},dependencies:[z,O,E,F,j,P,H,G],styles:["[_nghost-%COMP%]{display:inline-block}"],changeDetection:0})})(),n})();var ut=(()=>{let e=class{constructor(){this.configChange=new I,this.config$=this.configChange.pipe(A(1),C(null))}useConfig(t){this.configChange.emit(t)}},n=e;return(()=>{e.\u0275fac=function(i){return new(i||e)}})(),(()=>{e.\u0275prov=p({token:e,factory:e.\u0275fac,providedIn:"root"})})(),n})();function gt(){let n=a(N).user$;return W(n,{requireSync:!0})}var Rt=(()=>{let e=class{constructor(){this.backend=a(B),this.repo=a(J),this.syncApplier=a(q),this.syncToken$=new m(null),this.nextPageToken$=new m(null)}loadMails(t){return t?.continuous||this.nextPageToken$.next(null),this.nextPageToken$.pipe(M(),d(i=>{let o=!i,r=this.backend.loadMailPage(i??void 0);return o?this.backend.obtainSyncToken().pipe(s(K=>this.syncToken$.next(K)),d(()=>r)):r}),s(i=>this.nextPageToken$.next(i.nextPageToken??null)),c(i=>i.results),V(this.repo))}loadMail(t){return this.backend.loadMail(t).pipe(y(this.repo))}syncMails(){return this.syncToken$.pipe(M(),d(t=>t?this.backend.syncMails(t):w(()=>new b("Missing sync token"))),s(t=>this.syncToken$.next(t.syncToken)),s(t=>this.syncApplier.applyChanges(this.repo,t.changes)),c(()=>{}))}markMailAsStarred(t){return this.initiateMailUpdateAction(t,()=>this.backend.markMailAsStarred(t),{isStarred:!0})}markMailAsNotStarred(t){return this.initiateMailUpdateAction(t,()=>this.backend.markMailAsNotStarred(t),{isStarred:!1})}markMailAsRead(t){return this.initiateMailUpdateAction(t,()=>this.backend.markMailAsRead(t),{isRead:!0})}markMailAsUnread(t){return this.initiateMailUpdateAction(t,()=>this.backend.markMailAsUnread(t),{isRead:!1})}moveMail(t,i){return this.initiateMailUpdateAction(t,()=>this.backend.moveMail(t,i),{mailbox:i?i.id:void 0})}deleteMail(t){let i=this.repo.delete(t.id);return this.backend.deleteMail(t).pipe(v(i))}initiateMailUpdateAction(t,i,o){let r=this.repo.patch(t.id,o);return i().pipe(y(this.repo),v(r),c(()=>{}))}},n=e;return(()=>{e.\u0275fac=function(i){return new(i||e)}})(),(()=>{e.\u0275prov=p({token:e,factory:e.\u0275fac,providedIn:"root"})})(),n})(),k=class extends L{},b=class extends k{};export{Q as a,Y as b,st as c,ut as d,gt as e,Rt as f};