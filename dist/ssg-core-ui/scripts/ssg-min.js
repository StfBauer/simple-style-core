var ssg;!function(e){!function(e){var t=window,s=document,a=ssgCore.templates,r=ssg.templates,l=null,i=[],n=0,o=(ssg.UI.State,[320,768,1024,3500]),c=".ssg-core-filter .ssg-button",d=".ssg-core-view .ssg-button",g=".ssg-core-viewport .ssg-button",v=".ssg-patterns-inner",u="#ssg-in-width",f=".ssg-toc",S=".ssg-toc-inner",h=".ssg-button[data-viewport='disco']",m=".ssg-button[data-action='ssg-code']",y=".ssg-button[data-action='ssg-annot']",p=".ssg-button[data-action='ssg-toc']",L=".ssg-toc-item",I=".ssg-toc-searchbox",q="toc-searchbox",w="div[class^=ssg-item]",U="#ssg-item-nav-label",E="ssg-core-nav",A="ssg-left",b="ssg-right",x={active:"active",hidden:"hidden",show:"show"};e.State=function(){var e="ssg.UI.State",t=["isolate","code","annotation"],s=["atoms","molecules","organism","templates","pages","single"],a=null,r={filter:"atoms",xtras:[],screen:window.screen.availWidth},l=function(a){var r=a;if(!function(e){for(var a=0,r=0,l=0,i=e.xtras.length-1;i>0;i--){var n=e.xtras[i];-1===t.indexOf(n)&&(a+=1)}-1===s.indexOf(e.filter)&&(r+=1),console.log("state filter",e.filter,e,!e.filterSelector);try{parseInt(e.screen.toString())}catch(e){console.log("ERROR:"+e),l+=1}return r+a+l===0}(a))throw"There are some errors with the state";localStorage.setItem(e,JSON.stringify(r))};return function(){var t=localStorage.getItem(e);t?a=JSON.parse(t):(localStorage.setItem(e,JSON.stringify(r)),a=r)}(),{current:function(){return a},update:function(e){l(e)}}}();var T;(P=T=e.Utils||(e.Utils={})).requestData=function(e,t){return new Promise(function(s,a){var r;(r=new XMLHttpRequest).open(e,t),r.onload=function(){this.status>=200&&this.status<300?s(r.response):a({status:this.status,statusText:r.statusText})},r.onerror=function(){a({status:this.status,statusText:r.statusText})},r.send()})},P.changeItemToSinglePage=function(e){for(var t=e.length;0!==t;){var s=e[t-=1];s.classList.contains("ssg-item")&&(s.classList.remove("ssg-item"),s.classList.add("ssg-item-single"))}},P.hideSingleItemSlider=function(e){var t=s.querySelector("."+E);void 0!==t&&null!==t&&(!0===e?t.classList.add(x.hidden):t.classList.remove(x.hidden))};var P;e.Filter={sliderSelection:function(e){var t=s.querySelectorAll("div[data-cat]"),a=!1;i=[];for(var r=0;r<t.length;r++){var l=t[r];if(l.dataset.cat===e){var o={title:l.getAttribute("title"),file:l.dataset.file,category:e};i.push(o),!1===a?(n=0,a=!0,l.classList.contains("hide")&&l.classList.remove("hide")):l.classList.add("hide")}else l.classList.add("hide")}ssg.UI.EnableSingleSlider(i),i.length>1?ssg.UI.Utils.hideSingleItemSlider(!1):ssg.UI.Utils.hideSingleItemSlider(!0)},elements:function(e){switch(e){case"atoms":case"molecules":var t=ssg.UI.State.current();t.filter=e,ssg.UI.State.update(t);for(var a=s.querySelectorAll("div[data-cat]"),r=a.length-1;r>=0;r--){var l=a[r];l.dataset.cat===e?l.classList.remove("hide"):l.classList.add("hide")}ssg.UI.Utils.hideSingleItemSlider(!0);break;case"organism":case"templates":case"pages":ssg.UI.Filter.sliderSelection(e)}}},e.initDisco=function(){var e=setInterval(function(){var t=document.querySelector(h+"."+x.active),a=s.querySelector(v),r=s.querySelector(u);if(null!==t){var l=Math.floor(Math.random()*(o.length-0))+0;r.value=a.style.width=o[l].toString()}else clearInterval(e)},1e3)},e.Events={changeFilter:function(t){t.preventDefault();for(var a=s.querySelectorAll(c),r=a.length-1;r>=0;r--)a[r].classList.contains(x.active)&&a[r].classList.remove(x.active);var l=t.target,i=l.dataset.filter;l.classList.add(x.active),e.Filter.elements(i);var n=s.querySelectorAll(p);0!==n.length&&n[0].classList.contains(x.active)&&n[0].classList.remove("active"),console.log("BEFORE :::",ssg.UI.State.current()),console.log(i);var o=ssg.UI.State.current();return o.filter=i,console.log(o),ssg.UI.State.update(o),console.log("AFTER :::",ssg.UI.State.current()),!1},changeView:function(e){e.preventDefault();var t=e.target;t.dataset.filter;t.classList.contains(x.active)?t.classList.remove(x.active):t.classList.add(x.active)},changeViewPort:function(e){e.preventDefault();var a=e.target,r=s.querySelector(g+"."+x.active),l=a.dataset.viewport,i=s.querySelector(v),n=s.querySelector(u),o=ssg.UI.State.current();if(o.screen=l,ssg.UI.State.update(o),null!==r&&r.classList.remove(x.active),r===a?(a.classList.remove(x.active),l="full"):a.classList.add(x.active),null===(r=s.querySelector(g+"."+x.active))&&(r=s.querySelector(".ssg-button[data-viewport='full']")).classList.add(x.active),void 0!==typeof i)switch(l){case"full":l=i.style.width=t.innerWidth.toString();break;case"disco":ssg.UI.initDisco();break;default:i.style.width=l}"disco"!==l&&(i=s.querySelector(v),n.value=l)},viewPortResizer:function(e){if(e instanceof KeyboardEvent){if(13==e.keyCode){var t=s.querySelector(v),a=s.querySelector(u);t.style.width=a.value}}else{t=s.querySelector(v),a=s.querySelector(u);t.style.width=a.value}},showSource:function(e){e.preventDefault();var t=ssg.UI.State.current();if(t.xtras.indexOf("code")?t.xtras.push("code"):t.xtras.pop("code"),ssg.UI.State.update(t),e.target.classList.contains(x.active))for(var a=(r=s.querySelectorAll(".ssg-item-code")).length-1;a>=0;a--)r[a].classList.add(x.show);else{var r;for(a=(r=s.querySelectorAll(".ssg-item-code")).length-1;a>=0;a--)r[a].classList.remove(x.show)}},showAnnotation:function(e){e.preventDefault();var t=ssg.UI.State.current();if(t.xtras.indexOf("annotation")?t.xtras.push("annotation"):t.xtras.pop("annotation"),ssg.UI.State.update(t),e.target.classList.contains(x.active))for(var a=(r=s.querySelectorAll(".ssg-item-description")).length-1;a>=0;a--)r[a].classList.add(x.show);else{var r;for(a=(r=s.querySelectorAll(".ssg-item-description")).length-1;a>=0;a--)r[a].classList.remove(x.show)}},showToc:function(e){e.preventDefault();var t=e.target,a=s.querySelector(f);null!==t&&t.classList.contains(x.active)?t.classList.remove(x.active):t.classList.add(x.active),null!==a&&(a.classList.contains(x.show)?(a.classList.add(x.hidden),a.classList.remove(x.show)):(a.classList.remove(x.hidden),a.classList.add(x.show)))},filterToc:function(e){e.preventDefault();var t=e.target,a=t.dataset.filter,r=t.dataset.folder,l=t.parentNode.attributes.getNamedItem("id").value,i=s.querySelector(ssg.UI.btnShowToC);if(i&&i[0].classList.add("active"),l){if("templates"===r||"organism"===r||"page"===r){s.querySelectorAll("div[data-cat="+r+"]");var n=ssg.UI.State.current();n.filterSelector="."+a,ssg.UI.State.update(n),ssg.UI.Filter.sliderSelection(r)}else ssg.UI.Utils.hideSingleItemSlider(!0);for(var o=l.split("-")[1],c=document.querySelectorAll(".ssg-core-filter .ssg-button"),d=c.length-1;d>=0;d--){var g=c[d],v=g.classList,u=g.dataset.filter;v.contains("active")&&v.remove("active"),u===o&&v.add("active")}}var S=ssg.UI.State.current();if(S.filter="single",S.filterSelector="."+a,ssg.UI.State.update(S),null!==a){var h=s.querySelectorAll(w),m=s.querySelector(f);for(d=h.length-1;d>=0;d--){var y=h[d];y.dataset.file===a?y.classList.remove("hide"):y.classList.add("hide")}m.classList.remove("show"),m.classList.add("hidden")}},searchToc:function(e){e.preventDefault();var t=s.getElementById(q);if(null!==t){for(var a=t.value,r=s.querySelectorAll(".ssg-toc-item"),l=r.length-1;l>=0;l--)r[l].classList.contains("hide")&&r[l].classList.remove("hide");if(""!==a){var i=s.querySelectorAll(".ssg-toc-item:not([data-filter*='"+a+"'])");if(null!==i)for(var n=i.length-1;n>=0;n--)i[n].classList.add("hide")}}},registerEvents:function(e,t,s){for(var a=e.length-1;a>=0;a--)e[a].addEventListener(t,s)}},e.Render=function(){for(var t=s.querySelector(v),i=(s.querySelector(S),""),n=new DOMParser,o=l.patterns.length-1;o>=0;o--){var c=l.patterns[o],d=c.filename,g=r[d];if(c.baseFilter=c.filepath.split("/")[0],null!==c){c.sample=g;var u=a.patternItem(c);try{i=n.parseFromString(u,"text/html").body.innerHTML+i}catch(e){console.log(e)}}}var f=n.parseFromString(i,"text/html"),h=f.querySelectorAll("div[data-cat=templates]"),m=f.querySelectorAll("div[data-cat=pages]"),y=f.querySelectorAll("div[data-cat=organism]");T.changeItemToSinglePage(h),T.changeItemToSinglePage(m),T.changeItemToSinglePage(y),t.insertAdjacentHTML("afterbegin",f.body.innerHTML),Prism.highlightAll(),function(t){for(var a=t.patterns.filter(function(e){return void 0===e.deleted}),r=t.folder,l=s.querySelector(S),i=0;i<r.length;i++){var n="<ul><li id=ssg-"+r[i].name+" class=ssg-toc-header>"+r[i].name+"</li><ul id=ssg-"+r[i].name+"-items class=ssg-toc-items></ul></ul>";l.insertAdjacentHTML("beforeend",n)}for(var o=0;o<a.length;o++){var c=a[o].filepath.split("/")[0],d='<li class=ssg-toc-item data-filter="'+a[o].filename+'"  data-folder="'+c+'" >'+a[o].title+"</li>",g=s.getElementById("ssg-"+c+"-items");null!==g&&g.insertAdjacentHTML("beforeend",d)}for(var v=s.querySelectorAll(L),u=0;u<v.length;u++)v[u].addEventListener("click",e.Events.filterToc)}(l),e.ApplyUIState(ssg.UI.State.current())},e.ApplyUIState=function(e){console.log("STATE:::",e),function(e){if(void 0!==e.filter&&"single"!==e.filter){for(var t=s.querySelectorAll(".ssg-button[data-filter]"),a=t.length-1;a>=0;a--){var r=t[a];null!==r.dataset&&void 0!==r.dataset&&r.dataset.filter===e.filter?r.classList.contains("active")||r.classList.add("active"):r.classList.contains("active")&&r.classList.remove("active")}var l=".ssg-item[data-cat='"+e.filter+"']",i=".ssg-item:not([data-cat='"+e.filter+"'])";if("single"===e.filter){var n=e.filterSelector.substr(1);l="div[data-file='"+n+"']",i="div:not([data-file='"+n+"'])",void 0!==(d=s.querySelectorAll(".ssg-button[data-action='ssg-toc']"))&&1===d.length&&d[0].classList.add("active")}"organism"!==e.filter&&"molecules"!==e.filter&&"templates"!==e.filter||ssg.UI.Filter.sliderSelection(e.filter);var o=s.querySelectorAll(i);for(a=o.length-1;a>=0;a--)o[a].classList.add("hide");var c=s.querySelectorAll(l);if(1===c.length)void 0===(S=c[0]).dataset.cat||null===S.dataset.cat||"templates"!==S.dataset.cat&&"pages"!==S.dataset.cat&&"organism"!==S.dataset.cat?ssg.UI.Utils.hideSingleItemSlider(!0):ssg.UI.Filter.sliderSelection(S.dataset.cat);else for(a=c.length-1;a>=0;a--)c[a].classList.remove("hide")}else if("single"===e.filter){var d;if((d=s.querySelector(p)).classList.add("active"),void 0!==e.filterSelector&&null!==e.filterSelector){var g=e.filterSelector.substr(1),v=[].slice.call(s.querySelectorAll("div[class=ssg-item")),u=[].slice.call(s.querySelectorAll("div[class=ssg-item-single")),f=v.concat(u);for(a=f.length-1;a>=0;a--)if(f[a].dataset.file!==g){var S;(S=f[a]).classList.add("hide")}}}}(e),function(e){var t="button[data-viewport='"+e.screen+"']",a=s.querySelector("button.active[data-viewport]"),r=s.querySelector(t),l=s.getElementById("ssg-in-width"),i=s.querySelector(".ssg-patterns-inner");"full"===e.screen&&(e.screen=window.innerWidth),i.style.width=e.screen+"px",l.value=e.screen,void 0!==r&&null!==r&&(r.classList.add("active"),r!==a&&a.classList.remove("active"))}(e),function(e){if(e.xtras.indexOf("annotation")){for(var t=s.querySelectorAll(".ssg-item-description"),a=t.length-1;a>=0;a--)t[a].classList.add("show");var r=s.querySelectorAll("button[data-action='ssg-annot']");for(a=r.length-1;a>=0;a--)r[a].classList.add("active")}}(e)},e.EnableSingleSlider=function(e,t){var a=e,r=function(e){var t=a[e];i.textContent=t.title;for(var r=s.querySelectorAll("div[data-cat='"+a[n].category+"']"),l=0;l<r.length;l++){var o=r[l];if(o.dataset.file===t.file){o.classList.remove("hide");var c=ssg.UI.State.current();c.filterSelector="."+o.dataset.file,ssg.UI.State.update(c)}else o.classList.add("hide")}},l=function(t){t.preventDefault(),t.stopPropagation();var s=t.target;null!==s&&(s.dataset.filter===A&&(n-=1),s.dataset.filter===b&&(n+=1),n>e.length-1&&(n=0),n<0&&(n=e.length-1)),r(n)};if(!(a.length<=1)){var i=s.querySelector(U);i.textContent=a[0].title;for(var o=s.querySelectorAll(".ssg-core-nav .ssg-button"),c=0;c<o.length;c++){var d=o[c],g=d.cloneNode(!0);g.addEventListener("click",l),d.parentNode.replaceChild(g,d)}var v=ssg.UI.State.current();void 0!==v.filterSelector&&(n=e.findIndex(function(e){return e.file===v.filterSelector.substring(1)}),r(n))}},e.ShowSliderCtrl=function(e){var t=document.querySelector("."+E);e?t.classList.remove("hidden"):t.classList.add("hidden")},e.InitEvents=function(){var t=s.querySelectorAll(c),a=s.querySelectorAll(d),r=s.querySelectorAll(g),l=s.querySelectorAll(u),i=s.querySelectorAll(m),n=s.querySelectorAll(y),o=s.querySelectorAll(p),v=s.querySelectorAll(I);e.Events.registerEvents(t,"click",e.Events.changeFilter),e.Events.registerEvents(a,"click",e.Events.changeView),e.Events.registerEvents(r,"click",e.Events.changeViewPort),e.Events.registerEvents(l,"blur",e.Events.viewPortResizer),e.Events.registerEvents(l,"focusout",e.Events.viewPortResizer),e.Events.registerEvents(l,"keypress",e.Events.viewPortResizer),e.Events.registerEvents(i,"click",e.Events.showSource),e.Events.registerEvents(n,"click",e.Events.showAnnotation),e.Events.registerEvents(o,"click",e.Events.showToc),e.Events.registerEvents(v,"keyup",e.Events.searchToc)},e.Init=function(){Promise.all([ssg.UI.Utils.requestData("GET","/_config/pattern.conf.json")]).then(function(e){try{l=JSON.parse(e.toString())}catch(e){console.log(e)}}).then(function(){e.Render(),e.InitEvents(),console.log("applying UI filter"),console.log(ssg.UI.State.current()),e.ApplyUIState(ssg.UI.State.current()),console.log("applying UI filter"),0!==e.PostRender.length&&e.PostRender.forEach(function(e){e()})}).catch(function(e){console.log(e)})},e.PostRender=[]}(e.UI||(e.UI={}))}(ssg||(ssg={})),ssg.UI.Init();
//# sourceMappingURL=ssg-min.js.map
