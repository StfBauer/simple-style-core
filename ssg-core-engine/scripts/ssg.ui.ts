
/// <reference path="../../typings/index.d.ts" />

// import * as UIState from './ssg.uistate';

// pattern Config Response
// pattern Item Config Entry
interface PatternItem {
    title: string,
    description: string,
    filename: string,
    filepath: string,
    baseFilter?: string,
    sample?: string;
}

/// pattern Folder Config
interface PatternFolder {
    name: string,
    description: string
}

/// patternConfig
interface PatternConfig {
    patterns: PatternItem[],
    folder: PatternFolder[]
}

interface UIState {
    filter: string,
    filterSelector?: string,
    xtras: string[],
    screen: number;
};


namespace ssg.UI {

    declare var window: Window,
        document: Document,
        ssgCore: any,
        ssg: any,
        Prism: any;

    var win = window,
        doc = document,
        ssgCoreTemplates = ssgCore.templates,
        ssgTemplates = ssg.templates,
        patternConfig = null,
        currentSingleItems = [],
        currentSingleCount = 0,
        currentUIState = ssg.UI.State;

    let viewports: Array<number> = [
        320,
        768,
        1024,
        3500
    ]

    let coreUiElement = {
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

    export var State = (() => {


        const STATE_KEY = "ssg.UI.State",
            XTRAS = ['isolate', 'code', 'annotation'],
            FILTERS = ['atoms', 'molecules', 'organism', 'templates', 'pages', 'single'],
            SCREEN = ['s', 'm', 'l', 'uwd', 'full', 'disco'];

        let _currentUIState = null;

        // default UI State;
        let defState: UIState = {
            "filter": "atoms",
            "xtras": [],
            "screen": window.screen.availWidth
        };

        // Validate current state entry
        var _validateState = (state: UIState): boolean => {

            // checking if all states are valid
            var checkSumXtras = 0,
                checkSumFilter = 0,
                checkSumScreen = 0;

            // Check current xtra selection
            for (let i = state.xtras.length - 1; i > 0; i--) {

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

            } catch (exception) {

                console.log(exception);
                checkSumScreen += 1;

            }

            // console.log('checkSumXtras', checkSumXtras);
            // console.log('filters', checkSumXtras);
            // console.log('screen', checkSumScreen);
            // console.log('combined Checksum', checkSumXtras + checkSumFilter + checkSumScreen);
            // console.log('combined Checksum', (checkSumXtras + checkSumFilter + checkSumScreen) === 0);

            if (checkSumFilter + checkSumXtras + checkSumScreen === 0) {
                return true;
            }

            return false;

        };

        var _updateState = (state: UIState) => {

            if (_validateState(state)) {

                console.log('>> State is valid');
                console.log(state);
                sessionStorage.setItem(STATE_KEY, JSON.stringify(state));

            } else {

                throw "There are some errors with the state";

            }

        }

        (() => {

            let sessionState = sessionStorage.getItem(STATE_KEY);

            // If session already exists
            if (sessionState) {

                _currentUIState = JSON.parse(sessionState);

            } else {

                sessionStorage.setItem(STATE_KEY, JSON.stringify(defState));
                _currentUIState = defState;

            }

        })();

        return {

            current: () => {
                return _currentUIState
            },
            update: (state: UIState) => {

                _updateState(state);

            }
        }

    })();

    export namespace Utils {

        export var requestData = (method: string, url: string): Promise<{}> => {

            return new Promise(function (resolve: Function, reject: Function) {

                let xhr: XMLHttpRequest;

                let loaded: any = function (): void {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };

                let onError: any = function (): void {
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

        export var changeItemToSinglePage = (nodes: NodeList) => {

            var nodeCount = nodes.length;

            while (nodeCount !== 0) {

                nodeCount -= 1;

                let curNode: HTMLElement = <HTMLElement>nodes[nodeCount];

                if (curNode.classList.contains('ssg-item')) {

                    curNode.classList.remove('ssg-item');
                    curNode.classList.add('ssg-item-single');

                }

            }

        };

        export var hideShowSingleItemSlider = (hide: boolean) => {

            var singleItemSelector = doc.querySelector("." + coreUiElement.singleItemNav);

            if (singleItemSelector !== undefined && singleItemSelector !== null) {

                if (hide === true) {

                    singleItemSelector.classList.add(coreUiElement.state.hidden);

                } else {

                    singleItemSelector.classList.remove(coreUiElement.state.hidden);

                }

            }

        }
    };

    export var Filter = {

        sliderSelection: (filter: string) => {
            var allElements = doc.querySelectorAll('div[data-cat]'),
                firstItemFound = false;

            // reset currentSingleItem
            currentSingleItems = [];

            for (let i = 0; i < allElements.length; i++) {

                var curElement: HTMLElement = <HTMLElement>allElements[i];

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

                    } else {

                        curElement.classList.add('hide')

                    }

                } else {

                    curElement.classList.add('hide');

                }

            }

            ssg.UI.EnableSingleSlider(currentSingleItems, filter);

            if (currentSingleItems.length > 1) {

                ssg.UI.Utils.hideShowSingleItemSlider(false);

            } else {

                ssg.UI.Utils.hideShowSingleItemSlider(true);

            }
        },
        elements: (filterValue: string) => {

            var newState = ssg.UI.State.current();
            newState.filter = filterValue;
            ssg.UI.State.update(newState);

            switch (filterValue) {
                case "atoms":
                case "molecules":

                    var allElements = doc.querySelectorAll('div[data-cat]');

                    for (let i = allElements.length - 1; i >= 0; i--) {

                        var curElement: HTMLElement = <HTMLElement>allElements[i];

                        if (curElement.dataset['cat'] === filterValue) {

                            curElement.classList.remove('hide');

                        } else {

                            curElement.classList.add('hide');

                        }

                    }

                    ssg.UI.Utils.hideShowSingleItemSlider(true);
                    break;

                case "organism":
                    console.log("Called Organism");
                    // console.log(currentSingleItems);    
                    // console.log(currentSingleItems = []);
                    // console.log(currentSingleItems);
                    ssg.UI.Filter.sliderSelection(filterValue);
                    break;
                case "templates":
                    console.log("Called Templates");
                    // console.log(currentSingleItems);    
                    // console.log(currentSingleItems = []);
                    // console.log(currentSingleItems);

                    ssg.UI.Filter.sliderSelection(filterValue);
                    break;
                case "pages":

                    console.log("Called Pages");
                    // console.log(currentSingleItems);    
                    // console.log(currentSingleItems = []);
                    // console.log(currentSingleItems);
                    ssg.UI.Filter.sliderSelection(filterValue);
                    break;

            }

        }

    }

    export var initDisco = () => {

        var disco = setInterval(
            function () {

                let discoButton = document.querySelector(coreUiElement.discoButton + "." + coreUiElement.state.active),
                    viewPortInner: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                    viewPortWidth: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

                if (discoButton !== null) {

                    let curViewPort = Math.floor(Math.random() * (viewports.length - 0)) + 0;

                    viewPortWidth.value = viewPortInner.style.width = viewports[curViewPort].toString();

                } else {

                    clearInterval(disco);

                }

            }, 1000);

    }

    export var Events = {

        // change all filter
        changeFilter: (event: Event) => {

            // prevent all default
            event.preventDefault();

            var allButtons = doc.querySelectorAll(coreUiElement.filterButton);

            for (let i = allButtons.length - 1; i >= 0; i--) {

                if (allButtons[i].classList.contains(coreUiElement.state.active)) {
                    allButtons[i].classList.remove(coreUiElement.state.active);
                }

            }

            var curButton: HTMLElement = <HTMLElement>event.target,
                filter = curButton.dataset['filter'];

            curButton.classList.add(coreUiElement.state.active);
            Filter.elements(filter);

            return false;

        },

        // change view - Add isolated, code, Annotation
        changeView: (event: Event) => {

            // prevent all default
            event.preventDefault();

            var curButton: HTMLElement = <HTMLElement>event.target,
                filter = curButton.dataset['filter'];

            curButton.classList.contains(coreUiElement.state.active) ?
                curButton.classList.remove(coreUiElement.state.active) : curButton.classList.add(coreUiElement.state.active);

        },

        // adjust view port to differnet width
        changeViewPort: (event: Event) => {

            event.preventDefault();

            var vpButton: HTMLElement = <HTMLElement>event.target,
                vpActiveButton: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortButton + '.' + coreUiElement.state.active),
                vpData = vpButton.dataset['viewport'],
                vpTarget: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                widthInput: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

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

            } else {

                vpButton.classList.add(coreUiElement.state.active);

            }

            // recheck Active Buttons
            vpActiveButton = <HTMLElement>doc.querySelector(coreUiElement.viewPortButton + '.' + coreUiElement.state.active);

            if (vpActiveButton === null) {

                vpActiveButton = <HTMLElement>doc.querySelector('.ssg-button[data-viewport=\'full\']');

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
                vpTarget = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget);
                widthInput.value = vpData;
            }

        },

        // Resize View Port through manual update of width
        viewPortResizer: (event: Event) => {

            if (event instanceof KeyboardEvent) {

                var kbEvent: KeyboardEvent = <KeyboardEvent>event;

                if (kbEvent.keyCode == 13) {

                    var innerPattern: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                        newWidth: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

                    innerPattern.style.width = newWidth.value;

                }

            } else {

                var innerPattern: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                    newWidth: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

                innerPattern.style.width = newWidth.value;

            }


        },

        // Show and hides source code
        showSource: (event: Event) => {
            event.preventDefault();

            // Updating State
            console.log('Updating UI State');
            var newState = ssg.UI.State.current();
            // check if code is already included in UI Extras
            if (newState.xtras.indexOf('code')) {
                newState.xtras.push('code');
            } else {
                newState.xtras.pop('code');
            }
            ssg.UI.State.update(newState);

            if ((<HTMLElement>event.target).classList.contains(coreUiElement.state.active)) {

                // sho source code by adding class
                var codeBlocks = doc.querySelectorAll('.ssg-item-code');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.add(coreUiElement.state.show);
                }

            } else {
                // hide source code by removing the class
                var codeBlocks = doc.querySelectorAll('.ssg-item-code');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.remove(coreUiElement.state.show);
                }
            }
        },
        // show and hides annotations
        showAnnotation: (event: Event) => {

            event.preventDefault();

            // Updating State
            console.log('Updating UI State');

            var newState = ssg.UI.State.current();
            // check if code is already included in UI Extras
            if (newState.xtras.indexOf('annotation')) {

                newState.xtras.push('annotation');

            } else {

                newState.xtras.pop('annotation');

            }

            ssg.UI.State.update(newState);

            if ((<HTMLElement>event.target).classList.contains(coreUiElement.state.active)) {

                // sho source code by adding class
                var codeBlocks = doc.querySelectorAll('.ssg-item-description');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.add(coreUiElement.state.show);
                }

            } else {
                // hide source code by removing the class
                var codeBlocks = doc.querySelectorAll('.ssg-item-description');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.remove(coreUiElement.state.show);
                }
            }

        },
        // show and collapse table of contents
        showToc: (event: Event) => {

            event.preventDefault();
            let currentButton = <HTMLElement>event.target,
                containerToc = doc.querySelector(coreUiElement.viewToc);

            currentButton !== null && currentButton.classList.contains(coreUiElement.state.active) ?
                currentButton.classList.remove(coreUiElement.state.active) : currentButton.classList.add(coreUiElement.state.active)

            if (containerToc !== null) {

                if (containerToc.classList.contains(coreUiElement.state.show)) {

                    containerToc.classList.add(coreUiElement.state.hidden);
                    containerToc.classList.remove(coreUiElement.state.show);

                } else {

                    containerToc.classList.remove(coreUiElement.state.hidden);
                    containerToc.classList.add(coreUiElement.state.show);

                }

            }

        },
        // filter single toc element
        filterToc: (event: Event) => {

            event.preventDefault();
            var currentToc = <Node>event.target,
                filter = (<HTMLElement>currentToc).dataset['filter'],
                filterCat = (currentToc.parentNode.attributes.getNamedItem("id").value);


            if (filterCat) {

                console.log('filter cat');
                var category = filterCat.split('-')[1];

                var filterButtons = document.querySelectorAll('.ssg-core-filter .ssg-button');

                console.log('Filter Button:   ', filterButtons);

                for (let i = filterButtons.length - 1; i >= 0; i--) {

                    let curFilterButton = filterButtons[i],
                        curFilterStyle = curFilterButton.classList,
                        curDataSet = (<HTMLElement>curFilterButton).dataset['filter'];

                    if (curFilterStyle.contains('active')) {

                        curFilterStyle.remove('active');

                    }

                    if (curDataSet === category) {

                        curFilterStyle.add('active');

                    }

                }

            }

            // Updating State
            console.log('Updating UI State');
            var newState = ssg.UI.State.current();
            newState.filter = "single";
            newState.filterSelector = "." + filter;
            ssg.UI.State.update(newState);
            console.log('Updating UI State');


            if (filter !== null) {

                let allElements = doc.querySelectorAll(coreUiElement.patternItem),
                    tocElement = doc.querySelector(coreUiElement.viewToc);

                for (let i = allElements.length - 1; i >= 0; i--) {

                    let curItem = <HTMLElement>allElements[i];

                    if (curItem.dataset['file'] === filter) {

                        curItem.classList.remove('hide');

                    } else {

                        curItem.classList.add('hide');

                    }

                }
                tocElement.classList.remove('show');
                tocElement.classList.add('hidden');
                console.log(tocElement);
            }

        },
        // search for item in toc
        searchToc: (event: Event) => {

            event.preventDefault();

            let searchBox: HTMLInputElement = <HTMLInputElement>doc.getElementById(coreUiElement.tocSearchValue);

            if (searchBox !== null) {

                let searchValue = searchBox.value;

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
        registerEvents: (curElements: NodeList, eventType, handler) => {

            for (let i = curElements.length - 1; i >= 0; i--) {

                curElements[i].addEventListener(eventType, handler);

            }

        }

    }

    export var Render = () => {

        let RenderToc = (patternConfig) => {

            let patterns: PatternItem[] = patternConfig.patterns.filter(function (object) {
                return object["deleted"] === undefined;
            }),
                folder: PatternFolder[] = patternConfig.folder,
                ssgToc: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewTocInner);

            for (let i: number = 0; i < folder.length; i++) {

                let baseElement: string =
                    '<ul><li id=ssg-' + folder[i].name + ' class=ssg-toc-header>' +
                    folder[i].name +
                    '</li><ul id=ssg-' + folder[i].name + '-items class=ssg-toc-items></ul></ul>';

                ssgToc.insertAdjacentHTML('beforeend', baseElement);

            }

            for (let j: number = 0; j < patterns.length; j++) {

                let folderpath: string = patterns[j].filepath.split('/')[0];

                let patternTitle: string = '<li class=ssg-toc-item data-filter=\"' +
                    patterns[j].filename + '\">' +
                    patterns[j].title + '</li>';

                let currentSection: HTMLElement = doc.getElementById('ssg-' + folderpath + '-items');

                if (currentSection !== null) {

                    currentSection.insertAdjacentHTML('beforeend', patternTitle);

                }

            }

            let tocItems: NodeList = doc.querySelectorAll(coreUiElement.tocItem);

            for (let k: number = 0; k < tocItems.length; k++) {

                tocItems[k].addEventListener('click', Events.filterToc);

            }

        }

        let container: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
            tocContainer: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewTocInner);

        // console.log('..... All Pattern');

        var allContent = "",
            allToc = "";

        for (let i = patternConfig.patterns.length - 1; i >= 0; i--) {

            var curPattern = patternConfig.patterns[i],
                curPatternTitle = curPattern.filename,
                curTemplate = ssgTemplates[curPatternTitle],
                parser = new DOMParser();

            // Define base filter
            curPattern.baseFilter = curPattern.filepath.split('/')[0];

            if (curPattern !== null) {

                curPattern.sample = curTemplate;

                let content = ssgCoreTemplates.patternItem(curPattern);

                try {

                    // Parse Document and check if all elements are properly closed
                    var domContent = parser.parseFromString(content, 'text/html');
                    // Append parsed content
                    allContent = domContent.body.innerHTML + allContent;

                } catch (Exception) {

                    console.log(Exception);

                }

            }

        }

        let allContentDOM = parser.parseFromString(allContent, 'text/html');

        // alter templates and pages
        var allTempLates = allContentDOM.querySelectorAll('div[data-cat=templates]'),
            allPages = allContentDOM.querySelectorAll('div[data-cat=pages]'),
            allOrganism = allContentDOM.querySelectorAll('div[data-cat=organism]');
        Utils.changeItemToSinglePage(allTempLates);
        Utils.changeItemToSinglePage(allPages);
        Utils.changeItemToSinglePage(allOrganism);

        container.insertAdjacentHTML('afterbegin', allContentDOM.body.innerHTML);


        Prism.highlightAll();

        RenderToc(patternConfig);

        console.log('1. Rendering');
        console.log();
        console.log('--- Apply State');
        ApplyUIState(ssg.UI.State.current());

    }

    export let ApplyUIState = (state: any) => {

        console.log('Apply UI State');
        console.log(state);

        if (state.filter !== undefined
            && state.filter !== 'toc') {

            console.log(`button[data-filter='${state.filter}']`);

            let buttons = doc.querySelectorAll(`.ssg-button[data-filter]`);

            console.log('Length: ', buttons.length);

            for (let i: number = buttons.length - 1; i >= 0; i--) {

                let curButton: HTMLElement = <HTMLElement>buttons[i];

                if (curButton.dataset !== null
                    && curButton.dataset !== undefined
                    && curButton.dataset['filter'] === state.filter) {

                    if (curButton.classList.contains('active')) {

                        console.log('deactive');

                    } else {

                        curButton.classList.add('active');
                        console.log('actived');

                    }

                } else {

                    if (curButton.classList.contains('active')) {

                        curButton.classList.remove('active');

                    }

                }

            }

            var notSelItems = doc.querySelectorAll(`.ssg-item:not([data-cat='${state.filter}'])`);
            for (let i = notSelItems.length - 1; i >= 0; i--) {
                notSelItems[i].classList.add('hide');
            }


            var selItems = doc.querySelectorAll(`.ssg-item[data-cat='${state.filter}']`);
            for (let i = selItems.length - 1; i >= 0; i--) {
                selItems[i].classList.remove('hide');
            }
            console.log(selItems);

        }

    }

    export var EnableSingleSlider = (currentSingleItems, filter) => {



        let slideItems = currentSingleItems;

        var slidePatterns = function (event) {

            event.preventDefault();
            event.stopPropagation();

            var currentButton: HTMLElement = <HTMLElement>event.target;

            if (currentButton.dataset['filter'] === coreUiElement.singleNavLeft) {

                currentSingleCount -= 1;

            };

            if (currentButton.dataset['filter'] === coreUiElement.singleNavRight) {

                currentSingleCount += 1;

            };

            if (currentSingleCount > currentSingleItems.length - 1) {

                currentSingleCount = 0;

            }

            if (currentSingleCount < 0) {

                currentSingleCount = currentSingleItems.length - 1;

            }

            let curElement = slideItems[currentSingleCount];

            currentTitle.textContent = curElement.title;

            var allElements =
                doc.querySelectorAll('div[data-cat=\'' + slideItems[currentSingleCount].category + '\']');

            console.log('div[data-cat=\'' + slideItems[currentSingleCount].category + '\']');

            for (let j = 0; j < allElements.length; j++) {

                var curPatternElement: HTMLElement = <HTMLElement>allElements[j];

                if (curPatternElement.dataset['file'] === curElement.file) {

                    curPatternElement.classList.remove('hide');

                } else {

                    curPatternElement.classList.add('hide');

                }

            }

        }


        // Check if only one pattern is in current selection
        if (slideItems.length <= 1) {
            return;
        }

        var currentTitle = doc.querySelector(coreUiElement.singleItemNavTitle);

        currentTitle.textContent = slideItems[0].title;

        // var slider = doc.querySelectorAll('.ssg-core-nav .ssg-button[data-filter=\'' + filter + '\']');
        var slider = doc.querySelectorAll('.ssg-core-nav .ssg-button');

        for (let i = 0; i < slider.length; i++) {

            // remova all previous registered event handler
            var currentButton = slider[i];
            // clone current node without event handler
            var newButton = currentButton.cloneNode(true);
            // register new Click event
            newButton.addEventListener('click', slidePatterns);
            // replace element
            currentButton.parentNode.replaceChild(newButton, currentButton);

        }

    }

    export var ShowSliderCtrl = (show) => {

        var singleSliderControl = document.querySelector("." + coreUiElement.singleItemNav);

        if (show) {

            singleSliderControl.classList.remove('hidden');

        } else {

            singleSliderControl.classList.add('hidden');

        }

    }

    export var InitEvents = () => {
        // Render Events
        var filterButtons: NodeList = doc.querySelectorAll(coreUiElement.filterButton),
            viewButtons: NodeList = doc.querySelectorAll(coreUiElement.viewButton),
            viewPortButtons: NodeList = doc.querySelectorAll(coreUiElement.viewPortButton),
            viewPortWidth: NodeList = doc.querySelectorAll(coreUiElement.viewPortWidth),
            // Action Buttons
            showCode: NodeList = doc.querySelectorAll(coreUiElement.btnShowCode),
            showAnnot: NodeList = doc.querySelectorAll(coreUiElement.btnShowAnnotion),
            showToc: NodeList = doc.querySelectorAll(coreUiElement.btnShowToC),
            // TOC Eevent
            allTocItems: NodeList = doc.querySelectorAll(coreUiElement.tocSearchBox);

        Events.registerEvents(filterButtons, 'click', Events.changeFilter);
        Events.registerEvents(viewButtons, 'click', Events.changeView); // mabye obsolete?
        Events.registerEvents(viewPortButtons, 'click', Events.changeViewPort);
        Events.registerEvents(viewPortWidth, 'blur', Events.viewPortResizer);
        Events.registerEvents(viewPortWidth, 'focusout', Events.viewPortResizer);
        Events.registerEvents(viewPortWidth, 'keypress', Events.viewPortResizer);
        Events.registerEvents(showCode, 'click', Events.showSource);
        Events.registerEvents(showAnnot, 'click', Events.showAnnotation);
        // show and hide table fo contents
        Events.registerEvents(showToc, 'click', Events.showToc);
        // Search table of contents
        Events.registerEvents(allTocItems, 'keyup', Events.searchToc);
    }

    export var Init = () => {

        Promise.all([ssg.UI.Utils.requestData('GET', '/_config/pattern.conf.json')])
            .then(function (result: any): void {
                try {

                    patternConfig = JSON.parse(result.toString());

                } catch (error) {

                    console.log(error);

                }

            })
            .then(function (): void {

                Render();
                InitEvents();
                if (PostRender.length !== 0) {

                    PostRender.forEach(element => {
                        element();
                    });

                }

            })
            .catch(function (error: any): void {
                console.log(error);
            })

    }

    export var PostRender = [];

};



ssg.UI.Init();