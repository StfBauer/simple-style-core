/// <reference path="../../typings/index.d.ts" />
var ssg;
(function (ssg_1) {
    var UI;
    (function (UI) {
        var win = window, doc = document, ssgCoreTemplates = ssgCore.templates, ssgTemplates = ssg.templates, patternConfig = null;
        var viewports = [
            320,
            768,
            1024,
            3500
        ];
        var coreUiElement = {
            filterButton: '.ssg-core-filter .ssg-button',
            viewButton: '.ssg-core-view .ssg-button',
            viewPortButton: '.ssg-core-viewport .ssg-button',
            viewPortTarget: '.ssg-patterns-inner',
            viewPortWidth: '#ssg-in-width',
            viewToc: '.ssg-toc',
            viewTocInner: '.ssg-toc-inner',
            // Buttons
            discoButton: '.ssg-button[data-viewport=\'disco\']',
            btnShowCode: '.ssg-button[data-action=\'ssg-code\']',
            btnShowAnnotion: '.ssg-button[data-action=\'ssg-annot\']',
            btnShowToC: '.ssg-button[data-action=\'ssg-toc\']',
            tocItem: '.ssg-toc-item',
            tocSearchBox: '.ssg-toc-searchbox',
            tocSearchValue: 'toc-searchbox',
            patternItem: '.ssg-item',
            // States
            state: {
                active: 'active',
                hidden: 'hidden',
                show: 'show'
            }
        };
        var Utils;
        (function (Utils) {
            Utils.requestData = function (method, url) {
                return new Promise(function (resolve, reject) {
                    var xhr;
                    var loaded = function () {
                        if (this.status >= 200 && this.status < 300) {
                            resolve(xhr.response);
                        }
                        else {
                            reject({
                                status: this.status,
                                statusText: xhr.statusText
                            });
                        }
                    };
                    var onError = function () {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    };
                    xhr = new XMLHttpRequest();
                    xhr.open(method, url);
                    xhr.onload = loaded;
                    xhr.onerror = onError;
                    xhr.send();
                });
            };
            Utils.changeItemToSinglePage = function (nodes) {
                var nodeCount = nodes.length;
                console.log(nodeCount);
                while (nodeCount !== 0) {
                    nodeCount -= 1;
                    var curNode = nodes[nodeCount];
                    console.log(curNode);
                    if (curNode.classList.contains('ssg-item')) {
                        curNode.classList.remove('ssg-item');
                        curNode.classList.add('ssg-item-single');
                    }
                }
            };
        })(Utils = UI.Utils || (UI.Utils = {}));
        ;
        UI.Filter = {
            elements: function (filterValue) {
                switch (filterValue) {
                    case "atoms":
                    case "molecules":
                    case "organism":
                        var allElements = doc.querySelectorAll('.ssg-item');
                        for (var i = allElements.length - 1; i >= 0; i--) {
                            var curElement = allElements[i];
                            if (curElement.dataset['cat'] === filterValue) {
                                curElement.classList.remove('hide');
                            }
                            else {
                                curElement.classList.add('hide');
                            }
                        }
                        break;
                    case "templates":
                    case "pages":
                        console.log('templates or pages');
                        break;
                }
            }
        };
        UI.initDisco = function () {
            var disco = setInterval(function () {
                var discoButton = doc.querySelector(coreUiElement.discoButton + coreUiElement.state.active), viewPortInner = doc.querySelector(coreUiElement.viewPortTarget), viewPortWidth = doc.querySelector(coreUiElement.viewPortWidth);
                if (discoButton !== null) {
                    var curViewPort = Math.floor(Math.random() * (viewports.length - 0)) + 0;
                    viewPortWidth.value = viewPortInner.style.width = viewports[curViewPort].toString();
                }
                else {
                    clearInterval(disco);
                }
            }, 1000);
        };
        UI.Events = {
            // change all filter
            changeFilter: function (event) {
                // prevent all default
                event.preventDefault();
                var allButtons = doc.querySelectorAll(coreUiElement.filterButton);
                for (var i = allButtons.length - 1; i >= 0; i--) {
                    if (allButtons[i].classList.contains(coreUiElement.state.active)) {
                        allButtons[i].classList.remove(coreUiElement.state.active);
                    }
                }
                var curButton = event.target, filter = curButton.dataset['filter'];
                curButton.classList.add(coreUiElement.state.active);
                UI.Filter.elements(filter);
            },
            // change view - Add isolated, code, Annotation
            changeView: function (event) {
                // prevent all default
                event.preventDefault();
                var curButton = event.target, filter = curButton.dataset['filter'];
                curButton.classList.contains(coreUiElement.state.active) ?
                    curButton.classList.remove(coreUiElement.state.active) : curButton.classList.add(coreUiElement.state.active);
            },
            // adjust view port to differnet width
            changeViewPort: function (event) {
                event.preventDefault();
                var vpButton = event.target, vpActiveButton = doc.querySelector(coreUiElement.viewPortButton + '.' + coreUiElement.state.active), vpData = vpButton.dataset['viewport'], vpTarget = doc.querySelector(coreUiElement.viewPortTarget), widthInput = doc.querySelector(coreUiElement.viewPortWidth);
                // remove current active button
                if (vpActiveButton !== null) {
                    vpActiveButton.classList.remove(coreUiElement.state.active);
                }
                if (vpActiveButton === vpButton) {
                    vpButton.classList.remove(coreUiElement.state.active);
                    vpData = 'full';
                }
                else {
                    vpButton.classList.add(coreUiElement.state.active);
                }
                // recheck Active Buttons
                vpActiveButton = doc.querySelector(coreUiElement.viewPortButton + '.' + coreUiElement.state.active);
                if (vpActiveButton === null) {
                    vpActiveButton = doc.querySelector('.ssg-button[data-viewport=\'full\']');
                    vpActiveButton.classList.add(coreUiElement.state.active);
                }
                // action what to do
                if (typeof vpTarget !== undefined) {
                    switch (vpData) {
                        case 'full':
                            vpData = vpTarget.style.width = win.innerWidth.toString();
                            break;
                        case 'disco':
                            ssg.UI.initDisco();
                            break;
                        default:
                            vpTarget.style.width = vpData;
                            break;
                    }
                }
                if (vpData !== 'disco') {
                    // Update width indicator
                    vpTarget = doc.querySelector(coreUiElement.viewPortTarget);
                    widthInput.value = vpData;
                }
            },
            // Resize View Port through manual update of width
            viewPortResizer: function (event) {
                if (event instanceof KeyboardEvent) {
                    var kbEvent = event;
                    if (kbEvent.keyCode == 13) {
                        var innerPattern = doc.querySelector(coreUiElement.viewPortTarget), newWidth = doc.querySelector(coreUiElement.viewPortWidth);
                        innerPattern.style.width = newWidth.value;
                    }
                }
                else {
                    var innerPattern = doc.querySelector(coreUiElement.viewPortTarget), newWidth = doc.querySelector(coreUiElement.viewPortWidth);
                    innerPattern.style.width = newWidth.value;
                }
            },
            showSource: function (event) {
                event.preventDefault();
                if (event.target.classList.contains(coreUiElement.state.active)) {
                    // sho source code by adding class
                    var codeBlocks = doc.querySelectorAll('.ssg-item-code');
                    for (var i = codeBlocks.length - 1; i >= 0; i--) {
                        codeBlocks[i].classList.add(coreUiElement.state.show);
                    }
                }
                else {
                    // hide source code by removing the class
                    var codeBlocks = doc.querySelectorAll('.ssg-item-code');
                    for (var i = codeBlocks.length - 1; i >= 0; i--) {
                        codeBlocks[i].classList.remove(coreUiElement.state.show);
                    }
                }
            },
            showAnnotation: function (event) {
                event.preventDefault();
                if (event.target.classList.contains(coreUiElement.state.active)) {
                    // sho source code by adding class
                    var codeBlocks = doc.querySelectorAll('.ssg-item-description');
                    for (var i = codeBlocks.length - 1; i >= 0; i--) {
                        codeBlocks[i].classList.add(coreUiElement.state.show);
                    }
                }
                else {
                    // hide source code by removing the class
                    var codeBlocks = doc.querySelectorAll('.ssg-item-description');
                    for (var i = codeBlocks.length - 1; i >= 0; i--) {
                        codeBlocks[i].classList.remove(coreUiElement.state.show);
                    }
                }
            },
            // show and collapse table of contents
            showToc: function (event) {
                event.preventDefault();
                var currentButton = event.target, containerToc = doc.querySelector(coreUiElement.viewToc);
                // setting current button to active
                console.log(currentButton);
                currentButton !== null && currentButton.classList.contains(coreUiElement.state.active) ?
                    currentButton.classList.remove(coreUiElement.state.active) : currentButton.classList.add(coreUiElement.state.active);
                if (containerToc !== null) {
                    console.log(containerToc);
                    if (containerToc.classList.contains(coreUiElement.state.show)) {
                        containerToc.classList.add(coreUiElement.state.hidden);
                        containerToc.classList.remove(coreUiElement.state.show);
                    }
                    else {
                        containerToc.classList.remove(coreUiElement.state.hidden);
                        containerToc.classList.add(coreUiElement.state.show);
                    }
                }
            },
            // filter single toc element
            filterToc: function (event) {
                event.preventDefault();
                var currenToc = event.target, filter = currenToc.dataset['filter'];
                if (filter !== null) {
                    var allElements = doc.querySelectorAll(coreUiElement.patternItem), tocElement = doc.querySelector(coreUiElement.viewToc);
                    for (var i = allElements.length - 1; i >= 0; i--) {
                        var curItem = allElements[i];
                        if (curItem.dataset['file'] === filter) {
                            curItem.classList.remove('hide');
                        }
                        else {
                            curItem.classList.add('hide');
                        }
                    }
                    tocElement.classList.remove('show');
                }
            },
            searchToc: function (event) {
                event.preventDefault();
                var searchBox = doc.getElementById(coreUiElement.tocSearchValue);
                if (searchBox !== null) {
                    var searchValue = searchBox.value;
                    console.log(searchValue);
                    var resetResult = doc.querySelectorAll('.ssg-toc-item');
                    for (var j = resetResult.length - 1; j >= 0; j--) {
                        if (resetResult[j].classList.contains('hide')) {
                            resetResult[j].classList.remove('hide');
                        }
                    }
                    if (searchValue !== "") {
                        var searchResult = doc.querySelectorAll(".ssg-toc-item:not([data-filter*='" + searchValue + "'])");
                        if (searchResult !== null) {
                            for (var i = searchResult.length - 1; i >= 0; i--) {
                                searchResult[i].classList.add('hide');
                            }
                        }
                    }
                }
            },
            // register specific event on all notes
            registerEvents: function (curElements, eventType, handler) {
                for (var i = curElements.length - 1; i >= 0; i--) {
                    curElements[i].addEventListener(eventType, handler);
                }
            }
        };
        UI.Render = function () {
            // console.log('...... SSG Templates Config');
            // console.log(ssgTemplates);
            // console.log('...... Pattern Config');
            // console.log(patternConfig);
            // console.log(('..... Config'));
            var RenderToc = function (patternConfig) {
                var patterns = patternConfig.patterns.filter(function (object) {
                    return object["deleted"] === undefined;
                }), folder = patternConfig.folder, ssgToc = doc.querySelector(coreUiElement.viewTocInner);
                for (var i = 0; i < folder.length; i++) {
                    var baseElement = '<ul><li id=ssg-' + folder[i].name + ' class=ssg-toc-header>' +
                        folder[i].name +
                        '</li><ul id=ssg-' + folder[i].name + '-items class=ssg-toc-items></ul></ul>';
                    ssgToc.insertAdjacentHTML('beforeend', baseElement);
                }
                for (var j = 0; j < patterns.length; j++) {
                    var folderpath = patterns[j].filepath.split('/')[0];
                    var patternTitle = '<li class=ssg-toc-item data-filter=\"' +
                        patterns[j].filename + '\">' +
                        patterns[j].title + '</li>';
                    var currentSection = doc.getElementById('ssg-' + folderpath + '-items');
                    if (currentSection !== null) {
                        currentSection.insertAdjacentHTML('beforeend', patternTitle);
                    }
                }
                var tocItems = doc.querySelectorAll(coreUiElement.tocItem);
                for (var k = 0; k < tocItems.length; k++) {
                    tocItems[k].addEventListener('click', UI.Events.filterToc);
                }
            };
            var container = doc.querySelector(coreUiElement.viewPortTarget), tocContainer = doc.querySelector(coreUiElement.viewTocInner);
            // console.log('..... All Pattern');
            var allContent = "", allToc = "";
            for (var i = patternConfig.patterns.length - 1; i >= 0; i--) {
                var curPattern = patternConfig.patterns[i], curPatternTitle = curPattern.title, curTemplate = ssgTemplates[curPatternTitle], parser = new DOMParser();
                // Define base filter
                curPattern.baseFilter = curPattern.filepath.split('/')[0];
                // console.log(curPattern.baseFilter);
                // console.log('--->', curPattern.title);
                if (curPattern !== null) {
                    curPattern.sample = curTemplate;
                    var content = ssgCoreTemplates.patternItem(curPattern);
                    try {
                        // Parse Document and check if all elements are properly closed
                        var domContent = parser.parseFromString(content, 'text/html');
                        // Append parsed content
                        allContent = domContent.body.innerHTML + allContent;
                    }
                    catch (Exception) {
                        console.log(Exception);
                    }
                }
            }
            var allContentDOM = parser.parseFromString(allContent, 'text/html');
            console.log(allContentDOM);
            // alter templates and pages
            var allTempLates = allContentDOM.querySelectorAll('div[data-cat=templates]'), allPages = allContentDOM.querySelectorAll('div[data-cat=pages]'), allOrganism = allContentDOM.querySelectorAll('div[data-cat=organism]');
            Utils.changeItemToSinglePage(allTempLates);
            Utils.changeItemToSinglePage(allPages);
            Utils.changeItemToSinglePage(allOrganism);
            container.insertAdjacentHTML('afterbegin', allContentDOM.body.innerHTML);
            Prism.highlightAll();
            RenderToc(patternConfig);
        };
        UI.Init = function () {
            Promise.all([ssg.UI.Utils.requestData('GET', '/_config/pattern.conf.json')])
                .then(function (result) {
                try {
                    //ssg.UI.patternConfig: PatternConfig = <PatternConfig>JSON.parse(result.toString());
                    patternConfig = JSON.parse(result.toString());
                }
                catch (error) {
                    console.log(error);
                }
            })
                .then(function () {
                UI.Render();
            })
                .catch(function (error) {
                console.log(error);
            });
            // Render Events
            var filterButtons = doc.querySelectorAll(coreUiElement.filterButton), viewButtons = doc.querySelectorAll(coreUiElement.viewButton), viewPortButtons = doc.querySelectorAll(coreUiElement.viewPortButton), viewPortWidth = doc.querySelectorAll(coreUiElement.viewPortWidth), 
            // Action Buttons
            showCode = doc.querySelectorAll(coreUiElement.btnShowCode), showAnnot = doc.querySelectorAll(coreUiElement.btnShowAnnotion), showToc = doc.querySelectorAll(coreUiElement.btnShowToC), 
            // TOC Eevent
            filterToc = doc.querySelectorAll(coreUiElement.tocSearchBox);
            UI.Events.registerEvents(filterButtons, 'click', UI.Events.changeFilter);
            UI.Events.registerEvents(viewButtons, 'click', UI.Events.changeView);
            UI.Events.registerEvents(viewPortButtons, 'click', UI.Events.changeViewPort);
            UI.Events.registerEvents(viewPortWidth, 'blur', UI.Events.viewPortResizer);
            UI.Events.registerEvents(viewPortWidth, 'focusout', UI.Events.viewPortResizer);
            UI.Events.registerEvents(viewPortWidth, 'keypress', UI.Events.viewPortResizer);
            UI.Events.registerEvents(showCode, 'click', UI.Events.showSource);
            UI.Events.registerEvents(showAnnot, 'click', UI.Events.showAnnotation);
            // show and hide table fo contents
            UI.Events.registerEvents(showToc, 'click', UI.Events.showToc);
            // Search table of contents
            UI.Events.registerEvents(filterToc, 'keyup', UI.Events.searchToc);
        };
    })(UI = ssg_1.UI || (ssg_1.UI = {}));
})(ssg || (ssg = {}));
;
ssg.UI.Init();
