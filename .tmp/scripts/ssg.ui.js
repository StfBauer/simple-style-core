/// <reference path="../../typings/index.d.ts" />
;
var ssg;
(function (ssg_1) {
    var UI;
    (function (UI) {
        var win = window, doc = document, ssgCoreTemplates = ssgCore.templates, ssgTemplates = ssg.templates, patternConfig = null, currentSingleItems = [], currentSingleCount = 0, currentUIState = ssg.UI.State;
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
            patternItem: 'div[class^=ssg-item]',
            singleItemNavTitle: '#ssg-item-nav-label',
            singleItemNav: 'ssg-core-nav',
            singleNavLeft: 'ssg-left',
            singleNavRight: 'ssg-right',
            // States
            state: {
                active: 'active',
                hidden: 'hidden',
                show: 'show'
            }
        };
        UI.State = (function () {
            var STATE_KEY = "ssg.UI.State", XTRAS = ['isolate', 'code', 'annotation'], FILTERS = ['atoms', 'molecules', 'organism', 'templates', 'pages', 'single'], SCREEN = ['s', 'm', 'l', 'uwd', 'full', 'disco'];
            var _currentUIState = null;
            // default UI State;
            var defState = {
                "filter": "atoms",
                "xtras": [],
                "screen": window.screen.availWidth
            };
            // Validate current state entry
            var _validateState = function (state) {
                // checking if all states are valid
                var checkSumXtras = 0, checkSumFilter = 0, checkSumScreen = 0;
                // Check current xtra selection
                for (var i = state.xtras.length - 1; i > 0; i--) {
                    var curState = state.xtras[i];
                    if (XTRAS.indexOf(curState) === -1) {
                        checkSumXtras += 1;
                    }
                }
                // Check current filter
                if (FILTERS.indexOf(state.filter) === -1) {
                    checkSumFilter += 1;
                }
                // check if single is current selected filter and item has filter selector
                if (state.filter === "single" &&
                    !state.filterSelector) {
                    checkSumFilter += 1;
                }
                // remote filter selector when single is selected
                if (state.filter !== "single") {
                    /// removing filter selector
                    delete state.filterSelector;
                }
                // check current screen
                try {
                    parseInt(state.screen.toString());
                }
                catch (exception) {
                    console.log(exception);
                    checkSumScreen += 1;
                }
                console.log('checkSumXtras', checkSumXtras);
                console.log('filters', checkSumXtras);
                console.log('screen', checkSumScreen);
                console.log('combined Checksum', checkSumXtras + checkSumFilter + checkSumScreen);
                console.log('combined Checksum', (checkSumXtras + checkSumFilter + checkSumScreen) === 0);
                if (checkSumFilter + checkSumXtras + checkSumScreen === 0) {
                    return true;
                }
                return false;
            };
            var _updateState = function (state) {
                if (_validateState(state)) {
                    console.log('>> State is valid');
                    console.log(state);
                    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
                }
                else {
                    throw "There are some errors with the state";
                }
            };
            (function () {
                var sessionState = sessionStorage.getItem(STATE_KEY);
                // If session already exists
                if (sessionState) {
                    _currentUIState = JSON.parse(sessionState);
                }
                else {
                    sessionStorage.setItem(STATE_KEY, JSON.stringify(defState));
                    _currentUIState = defState;
                }
            })();
            return {
                current: function () {
                    return _currentUIState;
                },
                update: function (state) {
                    _updateState(state);
                }
            };
        })();
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
                while (nodeCount !== 0) {
                    nodeCount -= 1;
                    var curNode = nodes[nodeCount];
                    if (curNode.classList.contains('ssg-item')) {
                        curNode.classList.remove('ssg-item');
                        curNode.classList.add('ssg-item-single');
                    }
                }
            };
            Utils.hideShowSingleItemSlider = function (hide) {
                var singleItemSelector = doc.querySelector("." + coreUiElement.singleItemNav);
                if (singleItemSelector !== undefined && singleItemSelector !== null) {
                    if (hide === true) {
                        singleItemSelector.classList.add(coreUiElement.state.hidden);
                    }
                    else {
                        singleItemSelector.classList.remove(coreUiElement.state.hidden);
                    }
                }
            };
        })(Utils = UI.Utils || (UI.Utils = {}));
        ;
        UI.Filter = {
            sliderSelection: function (filter) {
                var allElements = doc.querySelectorAll('div[data-cat]'), firstItemFound = false;
                // reset currentSingleItem
                currentSingleItems = [];
                for (var i = 0; i < allElements.length; i++) {
                    var curElement = allElements[i];
                    if (curElement.dataset['cat'] === filter) {
                        var curSingleItem = {
                            title: curElement.getAttribute('title'),
                            file: curElement.dataset['file'],
                            category: filter
                        };
                        currentSingleItems.push(curSingleItem);
                        if (firstItemFound === false) {
                            currentSingleCount = 0;
                            firstItemFound = true;
                            if (curElement.classList.contains('hide')) {
                                curElement.classList.remove('hide');
                            }
                        }
                        else {
                            curElement.classList.add('hide');
                        }
                    }
                    else {
                        curElement.classList.add('hide');
                    }
                }
                ssg.UI.EnableSingleSlider(currentSingleItems, filter);
                if (currentSingleItems.length > 1) {
                    ssg.UI.Utils.hideShowSingleItemSlider(false);
                }
                else {
                    ssg.UI.Utils.hideShowSingleItemSlider(true);
                }
            },
            elements: function (filterValue) {
                var newState = ssg.UI.State.current();
                newState.filter = filterValue;
                ssg.UI.State.update(newState);
                switch (filterValue) {
                    case "atoms":
                    case "molecules":
                        var allElements = doc.querySelectorAll('div[data-cat]');
                        for (var i = allElements.length - 1; i >= 0; i--) {
                            var curElement = allElements[i];
                            if (curElement.dataset['cat'] === filterValue) {
                                curElement.classList.remove('hide');
                            }
                            else {
                                curElement.classList.add('hide');
                            }
                        }
                        ssg.UI.Utils.hideShowSingleItemSlider(true);
                        break;
                    case "organism":
                        console.log("Called Organism");
                        console.log(currentSingleItems);
                        console.log(currentSingleItems = []);
                        console.log(currentSingleItems);
                        ssg.UI.Filter.sliderSelection(filterValue);
                        break;
                    case "templates":
                        console.log("Called Templates");
                        console.log(currentSingleItems);
                        console.log(currentSingleItems = []);
                        console.log(currentSingleItems);
                        ssg.UI.Filter.sliderSelection(filterValue);
                        break;
                    case "pages":
                        console.log("Called Pages");
                        console.log(currentSingleItems);
                        console.log(currentSingleItems = []);
                        console.log(currentSingleItems);
                        ssg.UI.Filter.sliderSelection(filterValue);
                        break;
                }
            }
        };
        UI.initDisco = function () {
            var disco = setInterval(function () {
                var discoButton = document.querySelector(coreUiElement.discoButton + "." + coreUiElement.state.active), viewPortInner = doc.querySelector(coreUiElement.viewPortTarget), viewPortWidth = doc.querySelector(coreUiElement.viewPortWidth);
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
                return false;
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
                // Updating State
                console.log('Updating UI State');
                var newState = ssg.UI.State.current();
                newState.screen = vpData;
                ssg.UI.State.update(newState);
                console.log('Updating UI State');
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
            // Show and hides source code
            showSource: function (event) {
                event.preventDefault();
                // Updating State
                console.log('Updating UI State');
                var newState = ssg.UI.State.current();
                // check if code is already included in UI Extras
                if (newState.xtras.indexOf('code')) {
                    newState.xtras.push('code');
                }
                else {
                    newState.xtras.pop('code');
                }
                ssg.UI.State.update(newState);
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
            // show and hides annotations
            showAnnotation: function (event) {
                event.preventDefault();
                // Updating State
                console.log('Updating UI State');
                var newState = ssg.UI.State.current();
                // check if code is already included in UI Extras
                if (newState.xtras.indexOf('annotation')) {
                    newState.xtras.push('annotation');
                }
                else {
                    newState.xtras.pop('annotation');
                }
                ssg.UI.State.update(newState);
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
                currentButton !== null && currentButton.classList.contains(coreUiElement.state.active) ?
                    currentButton.classList.remove(coreUiElement.state.active) : currentButton.classList.add(coreUiElement.state.active);
                if (containerToc !== null) {
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
                // Updating State
                console.log('Updating UI State');
                var newState = ssg.UI.State.current();
                newState.filter = "single";
                newState.filterSelector = "." + filter;
                ssg.UI.State.update(newState);
                console.log('Updating UI State');
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
                    tocElement.classList.add('hidden');
                    console.log(tocElement);
                }
            },
            // search for item in toc
            searchToc: function (event) {
                event.preventDefault();
                var searchBox = doc.getElementById(coreUiElement.tocSearchValue);
                if (searchBox !== null) {
                    var searchValue = searchBox.value;
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
                var curPattern = patternConfig.patterns[i], curPatternTitle = curPattern.filename, curTemplate = ssgTemplates[curPatternTitle], parser = new DOMParser();
                // Define base filter
                curPattern.baseFilter = curPattern.filepath.split('/')[0];
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
            // alter templates and pages
            var allTempLates = allContentDOM.querySelectorAll('div[data-cat=templates]'), allPages = allContentDOM.querySelectorAll('div[data-cat=pages]'), allOrganism = allContentDOM.querySelectorAll('div[data-cat=organism]');
            Utils.changeItemToSinglePage(allTempLates);
            Utils.changeItemToSinglePage(allPages);
            Utils.changeItemToSinglePage(allOrganism);
            container.insertAdjacentHTML('afterbegin', allContentDOM.body.innerHTML);
            Prism.highlightAll();
            RenderToc(patternConfig);
        };
        UI.EnableSingleSlider = function (currentSingleItems, filter) {
            var slideItems = currentSingleItems;
            var slidePatterns = function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log(event);
                var currentButton = event.target;
                if (currentButton.dataset['filter'] === coreUiElement.singleNavLeft) {
                    currentSingleCount -= 1;
                }
                ;
                if (currentButton.dataset['filter'] === coreUiElement.singleNavRight) {
                    currentSingleCount += 1;
                }
                ;
                if (currentSingleCount > currentSingleItems.length - 1) {
                    currentSingleCount = 0;
                }
                if (currentSingleCount < 0) {
                    currentSingleCount = currentSingleItems.length - 1;
                }
                var curElement = slideItems[currentSingleCount];
                currentTitle.textContent = curElement.title;
                var allElements = doc.querySelectorAll('div[data-cat=\'' + slideItems[currentSingleCount].category + '\']');
                console.log('div[data-cat=\'' + slideItems[currentSingleCount].category + '\']');
                for (var j = 0; j < allElements.length; j++) {
                    var curPatternElement = allElements[j];
                    if (curPatternElement.dataset['file'] === curElement.file) {
                        curPatternElement.classList.remove('hide');
                    }
                    else {
                        curPatternElement.classList.add('hide');
                    }
                }
            };
            // Check if only one pattern is in current selection
            if (slideItems.length <= 1) {
                return;
            }
            var currentTitle = doc.querySelector(coreUiElement.singleItemNavTitle);
            currentTitle.textContent = slideItems[0].title;
            // var slider = doc.querySelectorAll('.ssg-core-nav .ssg-button[data-filter=\'' + filter + '\']');
            var slider = doc.querySelectorAll('.ssg-core-nav .ssg-button');
            for (var i = 0; i < slider.length; i++) {
                // remova all previous registered event handler
                var currentButton = slider[i];
                // clone current node without event handler
                var newButton = currentButton.cloneNode(true);
                // register new Click event
                newButton.addEventListener('click', slidePatterns);
                // replace element
                currentButton.parentNode.replaceChild(newButton, currentButton);
            }
        };
        UI.ShowSliderCtrl = function (show) {
            var singleSliderControl = document.querySelector("." + coreUiElement.singleItemNav);
            if (show) {
                singleSliderControl.classList.remove('hidden');
            }
            else {
                singleSliderControl.classList.add('hidden');
            }
        };
        UI.InitEvents = function () {
            // Render Events
            var filterButtons = doc.querySelectorAll(coreUiElement.filterButton), viewButtons = doc.querySelectorAll(coreUiElement.viewButton), viewPortButtons = doc.querySelectorAll(coreUiElement.viewPortButton), viewPortWidth = doc.querySelectorAll(coreUiElement.viewPortWidth), 
            // Action Buttons
            showCode = doc.querySelectorAll(coreUiElement.btnShowCode), showAnnot = doc.querySelectorAll(coreUiElement.btnShowAnnotion), showToc = doc.querySelectorAll(coreUiElement.btnShowToC), 
            // TOC Eevent
            allTocItems = doc.querySelectorAll(coreUiElement.tocSearchBox);
            UI.Events.registerEvents(filterButtons, 'click', UI.Events.changeFilter);
            UI.Events.registerEvents(viewButtons, 'click', UI.Events.changeView); // mabye obsolete?
            UI.Events.registerEvents(viewPortButtons, 'click', UI.Events.changeViewPort);
            UI.Events.registerEvents(viewPortWidth, 'blur', UI.Events.viewPortResizer);
            UI.Events.registerEvents(viewPortWidth, 'focusout', UI.Events.viewPortResizer);
            UI.Events.registerEvents(viewPortWidth, 'keypress', UI.Events.viewPortResizer);
            UI.Events.registerEvents(showCode, 'click', UI.Events.showSource);
            UI.Events.registerEvents(showAnnot, 'click', UI.Events.showAnnotation);
            // show and hide table fo contents
            UI.Events.registerEvents(showToc, 'click', UI.Events.showToc);
            // Search table of contents
            UI.Events.registerEvents(allTocItems, 'keyup', UI.Events.searchToc);
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
                UI.InitEvents();
                if (UI.PostRender.length !== 0) {
                    UI.PostRender.forEach(function (element) {
                        element();
                    });
                }
            })
                .catch(function (error) {
                console.log(error);
            });
        };
        UI.PostRender = [];
    })(UI = ssg_1.UI || (ssg_1.UI = {}));
})(ssg || (ssg = {}));
;
ssg.UI.Init();
