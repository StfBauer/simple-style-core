this.ssgCore=this.ssgCore||{},this.ssgCore.templates=this.ssgCore.templates||{},this.ssgCore.templates.addTools=Handlebars.template({compiler:[7,">= 4.0.0"],main:function(e,t,s,a,l){return'<div id="ssg-add-tools">\n</div>'},useData:!0}),Handlebars.registerPartial("buttons",Handlebars.template({compiler:[7,">= 4.0.0"],main:function(e,t,s,a,l){var i,n=null!=t?t:e.nullContext||{},r=s.helperMissing,o="function",c=e.escapeExpression;return'<button id="ssg-btn'+c((i=null!=(i=s.action||(null!=t?t.action:t))?i:r,typeof i===o?i.call(n,{name:"action",hash:{},data:l}):i))+'" class="ssg-btn '+c((i=null!=(i=s.class||(null!=t?t.class:t))?i:r,typeof i===o?i.call(n,{name:"class",hash:{},data:l}):i))+'">'+c((i=null!=(i=s.title||(null!=t?t.title:t))?i:r,typeof i===o?i.call(n,{name:"title",hash:{},data:l}):i))+"</button>"},useData:!0})),this.ssgCore.templates.itemselector=Handlebars.template({compiler:[7,">= 4.0.0"],main:function(e,t,s,a,l){var i,n=null!=t?t:e.nullContext||{},r=s.helperMissing,o="function",c=e.escapeExpression;return'<div id="ssg-items" data-item-index="'+c((i=null!=(i=s.index||(null!=t?t.index:t))?i:r,typeof i===o?i.call(n,{name:"index",hash:{},data:l}):i))+'">\n\t<button class="ssg-btn prev" '+c((i=null!=(i=s.prevEnabled||(null!=t?t.prevEnabled:t))?i:r,typeof i===o?i.call(n,{name:"prevEnabled",hash:{},data:l}):i))+' >&lt;</button>\n\t<span class="item-title">'+c((i=null!=(i=s.title||(null!=t?t.title:t))?i:r,typeof i===o?i.call(n,{name:"title",hash:{},data:l}):i))+'</span>\n\t<button class="ssg-btn next" '+c((i=null!=(i=s.nextEnabled||(null!=t?t.nextEnabled:t))?i:r,typeof i===o?i.call(n,{name:"nextEnabled",hash:{},data:l}):i))+" >&gt;</button>\n</div>"},useData:!0}),this.ssgCore.templates.patternItem=Handlebars.template({compiler:[7,">= 4.0.0"],main:function(e,t,s,a,l){var i,n,r=null!=t?t:e.nullContext||{},o=s.helperMissing,c="function",d=e.escapeExpression;return'<div class="ssg-item" data-cat="'+d((n=null!=(n=s.baseFilter||(null!=t?t.baseFilter:t))?n:o,typeof n===c?n.call(r,{name:"baseFilter",hash:{},data:l}):n))+'" data-file="'+d((n=null!=(n=s.filename||(null!=t?t.filename:t))?n:o,typeof n===c?n.call(r,{name:"filename",hash:{},data:l}):n))+'">\n\t<div class="ssg-item-header">\n\t\t<div class="ssg-item-title">'+d((n=null!=(n=s.title||(null!=t?t.title:t))?n:o,typeof n===c?n.call(r,{name:"title",hash:{},data:l}):n))+'</div>\n\t\t<div class="ssg-item-description">\n\t\t\t<div class="ssg-docs">'+d((n=null!=(n=s.description||(null!=t?t.description:t))?n:o,typeof n===c?n.call(r,{name:"description",hash:{},data:l}):n))+'</div>\n\t\t\t<b class="ssg-pattern-label">Pattern name:</b>\n\t\t\t<span class="ssg-pattern-name">'+d((n=null!=(n=s.filename||(null!=t?t.filename:t))?n:o,typeof n===c?n.call(r,{name:"filename",hash:{},data:l}):n))+'</span>\n\t\t</div>\n\t</div>\n\t<div class="sample">'+(null!=(n=null!=(n=s.sample||(null!=t?t.sample:t))?n:o,i=typeof n===c?n.call(r,{name:"sample",hash:{},data:l}):n)?i:"")+"</div>\n\t<pre class=\"ssg-item-code\"><code class='language-markup'>"+d((n=null!=(n=s.sample||(null!=t?t.sample:t))?n:o,typeof n===c?n.call(r,{name:"sample",hash:{},data:l}):n))+"</code></pre>\n</div>"},useData:!0}),this.ssgCore.templates.test=Handlebars.template({compiler:[7,">= 4.0.0"],main:function(e,t,s,a,l){return'<div class="ello"></div>'},useData:!0}),this.ssgCore.templates.vpresizer=Handlebars.template({compiler:[7,">= 4.0.0"],main:function(e,t,s,a,l){var i,n=null!=t?t:e.nullContext||{},r=s.helperMissing,o=e.escapeExpression;return'\n\t<input type="numeric" id="ssg-vp-w" class="ssg-input-s" value="'+o((i=null!=(i=s.width||(null!=t?t.width:t))?i:r,"function"==typeof i?i.call(n,{name:"width",hash:{},data:l}):i))+'">\n\t<span id="ssg-vp-by">x</span>\n\t<input type="numeric" id="ssg-vp-h" class="ssg-input-s" value="'+o((i=null!=(i=s.height||(null!=t?t.height:t))?i:r,"function"==typeof i?i.call(n,{name:"height",hash:{},data:l}):i))+'">\n\t<button id="ssg-btn-disco" class="ssg-btn">Disco</button>\n'},useData:!0});var ssg;!function(e){!function(e){var t=window,s=document,a=ssgCore.templates,l=ssg.templates,i=null,n=[],r=0,o=(ssg.UI.State,[320,768,1024,3500]),c=".ssg-core-filter .ssg-button",d=".ssg-core-view .ssg-button",u=".ssg-core-viewport .ssg-button",g=".ssg-patterns-inner",v="#ssg-in-width",f=".ssg-toc",h=".ssg-toc-inner",m=".ssg-button[data-viewport='disco']",p=".ssg-button[data-action='ssg-code']",S=".ssg-button[data-action='ssg-annot']",y=".ssg-button[data-action='ssg-toc']",b=".ssg-toc-item",L=".ssg-toc-searchbox",I="toc-searchbox",q="div[class^=ssg-item]",w="#ssg-item-nav-label",E="ssg-core-nav",x="ssg-left",U="ssg-right",A={active:"active",hidden:"hidden",show:"show"};e.State=function(){var e="ssg.UI.State",t=["isolate","code","annotation"],s=["atoms","molecules","organism","templates","pages","single"],a=null,l={filter:"atoms",xtras:["annotation"],screen:window.screen.availWidth},i=function(a){var l=a;if(!function(e){for(var a=0,l=0,i=0,n=e.xtras.length-1;n>0;n--){var r=e.xtras[n];-1===t.indexOf(r)&&(a+=1)}-1===s.indexOf(e.filter)&&(l+=1);try{parseInt(e.screen.toString())}catch(e){console.log("ERROR:"+e),i+=1}return l+a+i===0}(a))throw"There are some errors with the state";localStorage.setItem(e,JSON.stringify(l))};return function(){var t=localStorage.getItem(e);t?a=JSON.parse(t):(localStorage.setItem(e,JSON.stringify(l)),a=l)}(),{current:function(){return a},update:function(e){i(e)}}}();var D;(P=D=e.Utils||(e.Utils={})).requestData=function(e,t){return new Promise(function(s,a){var l;(l=new XMLHttpRequest).open(e,t),l.onload=function(){this.status>=200&&this.status<300?s(l.response):a({status:this.status,statusText:l.statusText})},l.onerror=function(){a({status:this.status,statusText:l.statusText})},l.send()})},P.changeItemToSinglePage=function(e){for(var t=e.length;0!==t;){var s=e[t-=1];s.classList.contains("ssg-item")&&(s.classList.remove("ssg-item"),s.classList.add("ssg-item-single"))}},P.hideSingleItemSlider=function(e){var t=s.querySelector("."+E);void 0!==t&&null!==t&&(!0===e?t.classList.add(A.hidden):t.classList.remove(A.hidden))};var P;e.Filter={sliderSelection:function(e){var t=s.querySelectorAll("div[data-cat]"),a=!1;n=[];for(var l=0;l<t.length;l++){var i=t[l];if(i.dataset.cat===e){var o={title:i.getAttribute("title"),file:i.dataset.file,category:e};n.push(o),!1===a?(r=0,a=!0,i.classList.contains("hide")&&i.classList.remove("hide")):i.classList.add("hide")}else i.classList.add("hide")}ssg.UI.EnableSingleSlider(n),n.length>1?ssg.UI.Utils.hideSingleItemSlider(!1):ssg.UI.Utils.hideSingleItemSlider(!0)},elements:function(e){switch(e){case"atoms":case"molecules":var t=ssg.UI.State.current();t.filter=e,ssg.UI.State.update(t);for(var a=s.querySelectorAll("div[data-cat]"),l=a.length-1;l>=0;l--){var i=a[l];i.dataset.cat===e?i.classList.remove("hide"):i.classList.add("hide")}ssg.UI.Utils.hideSingleItemSlider(!0);break;case"organism":case"templates":case"pages":ssg.UI.Filter.sliderSelection(e)}}},e.initDisco=function(){var e=setInterval(function(){var t=document.querySelector(m+"."+A.active),a=s.querySelector(g),l=s.querySelector(v);if(null!==t){var i=Math.floor(Math.random()*(o.length-0))+0;l.value=a.style.width=o[i].toString()}else clearInterval(e)},1e3)},e.Events={changeFilter:function(t){t.preventDefault();for(var a=s.querySelectorAll(c),l=a.length-1;l>=0;l--)a[l].classList.contains(A.active)&&a[l].classList.remove(A.active);var i=t.target,n=i.dataset.filter;i.classList.add(A.active),e.Filter.elements(n);var r=s.querySelectorAll(y);0!==r.length&&r[0].classList.contains(A.active)&&r[0].classList.remove("active");var o=ssg.UI.State.current();return o.filter=n,ssg.UI.State.update(o),!1},changeView:function(e){e.preventDefault();var t=e.target;t.dataset.filter;t.classList.contains(A.active)?t.classList.remove(A.active):t.classList.add(A.active)},changeViewPort:function(e){e.preventDefault();var a=e.target,l=s.querySelector(u+"."+A.active),i=a.dataset.viewport,n=s.querySelector(g),r=s.querySelector(v),o=ssg.UI.State.current();if(o.screen=i,ssg.UI.State.update(o),null!==l&&l.classList.remove(A.active),l===a?(a.classList.remove(A.active),i="full"):a.classList.add(A.active),null===(l=s.querySelector(u+"."+A.active))&&(l=s.querySelector(".ssg-button[data-viewport='full']")).classList.add(A.active),void 0!==typeof n){switch(i){case"full":i=n.style.width=t.innerWidth.toString();break;case"disco":ssg.UI.initDisco();break;default:n.style.width=i}var c=parseInt(i,10);NaN!==c&&c<=1024?(console.log("small view port size"),n.classList.add("vp-small")):(console.log("large view port size"),n.classList.remove("vp-small"))}"disco"!==i&&(n=s.querySelector(g),r.value=i)},viewPortResizer:function(e){if(e instanceof KeyboardEvent){if(13==e.keyCode){var t=s.querySelector(g),a=s.querySelector(v);t.style.width=a.value}}else{t=s.querySelector(g),a=s.querySelector(v);t.style.width=a.value}},showSource:function(e){e.preventDefault(),e.stopImmediatePropagation();var t=ssg.UI.State.current();if(-1===t.xtras.indexOf("code"))t.xtras.push("code");else{var a=t.xtras.filter(function(e){return"code"!==e});t.xtras=a}if(ssg.UI.State.update(t),e.target.classList.contains(A.active))for(var l=(i=s.querySelectorAll(".ssg-item-code")).length-1;l>=0;l--)i[l].classList.add(A.show);else{var i;for(l=(i=s.querySelectorAll(".ssg-item-code")).length-1;l>=0;l--)i[l].classList.remove(A.show)}},showAnnotation:function(e){e.preventDefault(),e.stopImmediatePropagation();var t=ssg.UI.State.current();if(-1===t.xtras.indexOf("annotation"))t.xtras.push("annotation");else{var a=t.xtras.filter(function(e){return"annotation"!==e});t.xtras=a}if(ssg.UI.State.update(t),e.target.classList.contains(A.active))for(var l=(i=s.querySelectorAll(".ssg-item-description")).length-1;l>=0;l--)i[l].classList.add(A.show);else{var i;for(l=(i=s.querySelectorAll(".ssg-item-description")).length-1;l>=0;l--)i[l].classList.remove(A.show)}},showToc:function(e){e.preventDefault();var t=e.target,a=s.querySelector(f);null!==t&&t.classList.contains(A.active)?t.classList.remove(A.active):t.classList.add(A.active),null!==a&&(a.classList.contains(A.show)?(a.classList.add(A.hidden),a.classList.remove(A.show)):(a.classList.remove(A.hidden),a.classList.add(A.show)))},filterToc:function(e){e.preventDefault();var t=e.target,a=t.dataset.filter,l=t.dataset.folder,i=t.parentNode.attributes.getNamedItem("id").value,n=s.querySelector(ssg.UI.btnShowToC);if(n&&n[0].classList.add("active"),i){if("templates"===l||"organism"===l||"page"===l){s.querySelectorAll("div[data-cat="+l+"]");var r=ssg.UI.State.current();r.filterSelector="."+a,ssg.UI.State.update(r),ssg.UI.Filter.sliderSelection(l)}else ssg.UI.Utils.hideSingleItemSlider(!0);for(var o=i.split("-")[1],c=document.querySelectorAll(".ssg-core-filter .ssg-button"),d=c.length-1;d>=0;d--){var u=c[d],g=u.classList,v=u.dataset.filter;g.contains("active")&&g.remove("active"),v===o&&g.add("active")}}var h=ssg.UI.State.current();if(h.filter="single",h.filterSelector="."+a,ssg.UI.State.update(h),null!==a){var m=s.querySelectorAll(q),p=s.querySelector(f);for(d=m.length-1;d>=0;d--){var S=m[d];S.dataset.file===a?S.classList.remove("hide"):S.classList.add("hide")}p.classList.remove("show"),p.classList.add("hidden")}},searchToc:function(e){e.preventDefault();var t=s.getElementById(I);if(null!==t){for(var a=t.value,l=s.querySelectorAll(".ssg-toc-item"),i=l.length-1;i>=0;i--)l[i].classList.contains("hide")&&l[i].classList.remove("hide");if(""!==a){var n=s.querySelectorAll(".ssg-toc-item:not([data-filter*='"+a+"'])");if(null!==n)for(var r=n.length-1;r>=0;r--)n[r].classList.add("hide")}}},registerEvents:function(e,t,s){for(var a=e.length-1;a>=0;a--)e[a].addEventListener(t,s)}},e.Render=function(){for(var t=s.querySelector(g),n=(s.querySelector(h),""),r=new DOMParser,o=i.patterns.length-1;o>=0;o--){var c=i.patterns[o],d=c.filename,u=l[d];if(c.baseFilter=c.filepath.split("/")[0],console.log(c.baseFilter),null!==c){c.sample=void 0!==u?u(ssgData):u,console.log("Current Pattern: ",c);var v=a.patternItem(c);try{n=r.parseFromString(v,"text/html").body.innerHTML+n}catch(e){console.log(e)}}}var f=r.parseFromString(n,"text/html"),m=f.querySelectorAll("div[data-cat=templates]"),p=f.querySelectorAll("div[data-cat=pages]"),S=f.querySelectorAll("div[data-cat=organism]");D.changeItemToSinglePage(m),D.changeItemToSinglePage(p),D.changeItemToSinglePage(S),t.insertAdjacentHTML("afterbegin",f.body.innerHTML),Prism.highlightAll(),function(t){for(var a=t.patterns.filter(function(e){return void 0===e.deleted}),l=t.folder,i=s.querySelector(h),n=0;n<l.length;n++){var r="<ul><li id=ssg-"+l[n].name+" class=ssg-toc-header>"+l[n].name+"</li><ul id=ssg-"+l[n].name+"-items class=ssg-toc-items></ul></ul>";i.insertAdjacentHTML("beforeend",r)}for(var o=0;o<a.length;o++){var c=a[o].filepath.split("/")[0],d='<li class=ssg-toc-item data-filter="'+a[o].filename+'"  data-folder="'+c+'" >'+a[o].title+"</li>",u=s.getElementById("ssg-"+c+"-items");null!==u&&u.insertAdjacentHTML("beforeend",d)}for(var g=s.querySelectorAll(b),v=0;v<g.length;v++)g[v].addEventListener("click",e.Events.filterToc)}(i),e.ApplyUIState(ssg.UI.State.current())},e.ApplyUIState=function(e){!function(e){if(void 0!==e.filter&&"single"!==e.filter){for(var t=s.querySelectorAll(".ssg-button[data-filter]"),a=t.length-1;a>=0;a--){var l=t[a];null!==l.dataset&&void 0!==l.dataset&&l.dataset.filter===e.filter?l.classList.contains("active")||l.classList.add("active"):l.classList.contains("active")&&l.classList.remove("active")}var i="div[class^='ssg-item'][data-cat='"+e.filter+"']",n="div[class^='ssg-item']:not([data-cat='"+e.filter+"'])";if("single"===e.filter){var r=e.filterSelector.substr(1);i="div[data-file='"+r+"']",n="div:not([data-file='"+r+"'])",void 0!==(d=s.querySelectorAll(".ssg-button[data-action='ssg-toc']"))&&1===d.length&&d[0].classList.add("active")}"organism"!==e.filter&&"molecules"!==e.filter&&"templates"!==e.filter||ssg.UI.Filter.sliderSelection(e.filter);var o=s.querySelectorAll(n);for(a=o.length-1;a>=0;a--)o[a].classList.add("hide");var c=s.querySelectorAll(i);if(1===c.length)void 0===(h=c[0]).dataset.cat||null===h.dataset.cat||"templates"!==h.dataset.cat&&"pages"!==h.dataset.cat&&"organism"!==h.dataset.cat?ssg.UI.Utils.hideSingleItemSlider(!0):ssg.UI.Filter.sliderSelection(h.dataset.cat);else for(a=c.length-1;a>=0;a--)c[a].classList.remove("hide")}else if("single"===e.filter){var d;if((d=s.querySelector(y)).classList.add("active"),void 0!==e.filterSelector&&null!==e.filterSelector){var u=e.filterSelector.substr(1),g=[].slice.call(s.querySelectorAll("div[class=ssg-item")),v=[].slice.call(s.querySelectorAll("div[class=ssg-item-single")),f=g.concat(v);for(a=f.length-1;a>=0;a--)if(f[a].dataset.file!==u){var h;(h=f[a]).classList.add("hide")}}}}(e),function(e){var t="button[data-viewport='"+e.screen+"']",a=s.querySelector("button.active[data-viewport]"),l=s.querySelector(t),i=s.getElementById("ssg-in-width"),n=s.querySelector(".ssg-patterns-inner");"full"===e.screen&&(e.screen=window.innerWidth),n.style.width=e.screen+"px",i.value=e.screen,void 0!==l&&null!==l&&(l.classList.add("active"),l!==a&&a.classList.remove("active"))}(e),function(e){if(-1!==e.xtras.indexOf("annotation")){for(var t=(a=s.querySelectorAll(".ssg-item-description")).length-1;t>=0;t--)a[t].classList.add("show");for(t=(l=s.querySelectorAll("button[data-action='ssg-annot']")).length-1;t>=0;t--)l[t].classList.add("active")}if(-1!==e.xtras.indexOf("code")){var a;for(t=(a=s.querySelectorAll(".ssg-item-code")).length-1;t>=0;t--)a[t].classList.add("show");var l;for(t=(l=s.querySelectorAll("button[data-action='ssg-code']")).length-1;t>=0;t--)l[t].classList.add("active")}}(e)},e.EnableSingleSlider=function(e,t){var a=e,l=function(e){var t=a[e];n.textContent=t.title;for(var l=s.querySelectorAll("div[data-cat='"+a[r].category+"']"),i=0;i<l.length;i++){var o=l[i];if(o.dataset.file===t.file){o.classList.remove("hide");var c=ssg.UI.State.current();c.filterSelector="."+o.dataset.file,ssg.UI.State.update(c)}else o.classList.add("hide")}},i=function(t){t.preventDefault(),t.stopPropagation();var s=t.target;null!==s&&(s.dataset.filter===x&&(r-=1),s.dataset.filter===U&&(r+=1),r>e.length-1&&(r=0),r<0&&(r=e.length-1)),l(r)};if(!(a.length<=1)){var n=s.querySelector(w);n.textContent=a[0].title;for(var o=s.querySelectorAll(".ssg-core-nav .ssg-button"),c=0;c<o.length;c++){var d=o[c],u=d.cloneNode(!0);u.addEventListener("click",i),d.parentNode.replaceChild(u,d)}var g=ssg.UI.State.current();void 0!==g.filterSelector&&(r=e.findIndex(function(e){return e.file===g.filterSelector.substring(1)}),l(r))}},e.ShowSliderCtrl=function(e){var t=document.querySelector("."+E);e?t.classList.remove("hidden"):t.classList.add("hidden")},e.InitEvents=function(){var t=s.querySelectorAll(c),a=s.querySelectorAll(d),l=s.querySelectorAll(u),i=s.querySelectorAll(v),n=s.querySelectorAll(p),r=s.querySelectorAll(S),o=s.querySelectorAll(y),g=s.querySelectorAll(L);e.Events.registerEvents(t,"click",e.Events.changeFilter),e.Events.registerEvents(a,"click",e.Events.changeView),e.Events.registerEvents(l,"click",e.Events.changeViewPort),e.Events.registerEvents(i,"blur",e.Events.viewPortResizer),e.Events.registerEvents(i,"focusout",e.Events.viewPortResizer),e.Events.registerEvents(i,"keypress",e.Events.viewPortResizer),e.Events.registerEvents(n,"click",e.Events.showSource),e.Events.registerEvents(r,"click",e.Events.showAnnotation),e.Events.registerEvents(o,"click",e.Events.showToc),e.Events.registerEvents(g,"keyup",e.Events.searchToc)},e.Init=function(){Promise.all([ssg.UI.Utils.requestData("GET","/_config/pattern.conf.json")]).then(function(e){try{i=JSON.parse(e.toString())}catch(e){console.log(e)}}).then(function(){e.Render(),e.InitEvents(),e.ApplyUIState(ssg.UI.State.current()),0!==e.PostRender.length&&e.PostRender.forEach(function(e){e()})}).catch(function(e){console.log(e)})},e.PostRender=[]}(e.UI||(e.UI={}))}(ssg||(ssg={})),ssg.UI.Init(),Handlebars.registerHelper("description",function(e){var t="",s=e.data.root.baseFilter+"_"+e.data.root.title;return void 0!==ssgDoc[s]?(t=ssgDoc[s].body,new Handlebars.SafeString(t)):e.data.root.description}),Handlebars.registerHelper("description",function(e){var t="",s=e.data.root.baseFilter+"_"+e.data.root.title;return void 0!==ssgDoc[s]?(t=ssgDoc[s].body,new Handlebars.SafeString(t)):e.data.root.description});
//# sourceMappingURL=ssg.ui-min.js.map
