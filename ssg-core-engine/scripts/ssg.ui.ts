
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

    declare let window: Window,
        document: Document,
        ssgCore: any,
        ssg: any,
        Prism: any;

    let win = window,
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

    export let State = (() => {


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
        let _validateState = (state: UIState): boolean => {

            // checking if all states are valid
            let checkSumXtras = 0,
                checkSumFilter = 0,
                checkSumScreen = 0;

            // Check current xtra selection
            for (let i = state.xtras.length - 1; i > 0; i--) {

                let curState = state.xtras[i];

                if (XTRAS.indexOf(curState) === -1) {

                    checkSumXtras += 1;

                }

            }

            // Check current filter
            if (FILTERS.indexOf(state.filter) === -1) {

                checkSumFilter += 1;

            }

            // check if single is current selected filter and item has filter selector
            if ((state.filter === "single" ||
                state.filter === "orangism" ||
                state.filter === "templates" ||
                state.filter === "pages") &&
                !state.filterSelector) {

                checkSumFilter += 1;

            }

            // remote filter selector when single is selected
            // if (state.filter === "atom" ||
            //     state.filter === "molecules" &&
            //     !state.filterSelector) {

            //     /// removing filter selector
            //     delete state.filterSelector;

            // }

            // check current screen
            try {

                parseInt(state.screen.toString());

            } catch (exception) {

                console.log("ERROR:" + exception);
                checkSumScreen += 1;

            }

            if (checkSumFilter + checkSumXtras + checkSumScreen === 0) {
                return true;
            }

            return false;

        };

        let _updateState = (state: UIState) => {

            let curState = state;

            if (_validateState(state)) {

                sessionStorage.setItem(STATE_KEY, JSON.stringify(curState));

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

        export let requestData = (method: string, url: string): Promise<{}> => {

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

        export let changeItemToSinglePage = (nodes: NodeList) => {

            let nodeCount = nodes.length;

            while (nodeCount !== 0) {

                nodeCount -= 1;

                let curNode: HTMLElement = <HTMLElement>nodes[nodeCount];

                if (curNode.classList.contains('ssg-item')) {

                    curNode.classList.remove('ssg-item');
                    curNode.classList.add('ssg-item-single');

                }

            }

        };

        export let hideSingleItemSlider = (hide: boolean) => {

            let singleItemSelector = doc.querySelector("." + coreUiElement.singleItemNav);

            if (singleItemSelector !== undefined && singleItemSelector !== null) {

                if (hide === true) {

                    singleItemSelector.classList.add(coreUiElement.state.hidden);

                } else {

                    singleItemSelector.classList.remove(coreUiElement.state.hidden);

                }

            }

        }
    };

    export let Filter = {

        sliderSelection: (filter: string) => {

            let allElements = doc.querySelectorAll('div[data-cat]'),
                firstItemFound = false;

            console.log('Slider Selection:', ssg.UI.State.current());

            // reset currentSingleItem
            currentSingleItems = [];

            for (let i = 0; i < allElements.length; i++) {

                let curElement: HTMLElement = <HTMLElement>allElements[i];

                if (curElement.dataset['cat'] === filter) {

                    let curSingleItem = {
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

            ssg.UI.EnableSingleSlider(currentSingleItems);

            if (currentSingleItems.length > 1) {

                ssg.UI.Utils.hideSingleItemSlider(false);

            } else {

                ssg.UI.Utils.hideSingleItemSlider(true);

            }
        },
        elements: (filterValue: string) => {

            switch (filterValue) {
                case "atoms":
                case "molecules":

                    let newState = ssg.UI.State.current();
                    newState.filter = filterValue;
                    ssg.UI.State.update(newState);

                    let allElements = doc.querySelectorAll('div[data-cat]');

                    for (let i = allElements.length - 1; i >= 0; i--) {

                        let curElement: HTMLElement = <HTMLElement>allElements[i];

                        if (curElement.dataset['cat'] === filterValue) {

                            curElement.classList.remove('hide');

                        } else {

                            curElement.classList.add('hide');

                        }

                    }

                    ssg.UI.Utils.hideSingleItemSlider(true);
                    break;

                case "organism":

                    ssg.UI.Filter.sliderSelection(filterValue);
                    break;

                case "templates":

                    ssg.UI.Filter.sliderSelection(filterValue);
                    break;

                case "pages":

                    ssg.UI.Filter.sliderSelection(filterValue);
                    break;

                default:
                    break;

            }

        }

    }

    export let initDisco = () => {

        let disco = setInterval(
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

    export let Events = {

        // change all filter
        changeFilter: (event: Event) => {

            // prevent all default
            event.preventDefault();

            let allButtons = doc.querySelectorAll(coreUiElement.filterButton);

            for (let i = allButtons.length - 1; i >= 0; i--) {

                if (allButtons[i].classList.contains(coreUiElement.state.active)) {
                    allButtons[i].classList.remove(coreUiElement.state.active);
                }

            }

            let curButton: HTMLElement = <HTMLElement>event.target,
                filter = curButton.dataset['filter'];

            curButton.classList.add(coreUiElement.state.active);
            Filter.elements(filter);

            return false;

        },

        // change view - Add isolated, code, Annotation
        changeView: (event: Event) => {

            // prevent all default
            event.preventDefault();

            let curButton: HTMLElement = <HTMLElement>event.target,
                filter = curButton.dataset['filter'];

            curButton.classList.contains(coreUiElement.state.active) ?
                curButton.classList.remove(coreUiElement.state.active) : curButton.classList.add(coreUiElement.state.active);

        },

        // adjust view port to differnet width
        changeViewPort: (event: Event) => {

            event.preventDefault();

            let vpButton: HTMLElement = <HTMLElement>event.target,
                vpActiveButton: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortButton + '.' + coreUiElement.state.active),
                vpData = vpButton.dataset['viewport'],
                vpTarget: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                widthInput: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

            // Updating State
            let newState = ssg.UI.State.current();
            newState.screen = vpData;
            ssg.UI.State.update(newState);

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

                let kbEvent: KeyboardEvent = <KeyboardEvent>event;

                if (kbEvent.keyCode == 13) {

                    let innerPattern: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                        newWidth: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

                    innerPattern.style.width = newWidth.value;

                }

            } else {

                let innerPattern: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                    newWidth: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

                innerPattern.style.width = newWidth.value;

            }


        },

        // Show and hides source code
        showSource: (event: Event) => {
            event.preventDefault();

            // Updating State
            let newState = ssg.UI.State.current();
            // check if code is already included in UI Extras
            if (newState.xtras.indexOf('code')) {
                newState.xtras.push('code');
            } else {
                newState.xtras.pop('code');
            }

            ssg.UI.State.update(newState);

            if ((<HTMLElement>event.target).classList.contains(coreUiElement.state.active)) {

                // sho source code by adding class
                let codeBlocks = doc.querySelectorAll('.ssg-item-code');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.add(coreUiElement.state.show);
                }

            } else {
                // hide source code by removing the class
                let codeBlocks = doc.querySelectorAll('.ssg-item-code');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.remove(coreUiElement.state.show);
                }
            }
        },
        // show and hides annotations
        showAnnotation: (event: Event) => {

            event.preventDefault();

            // Updating State
            let newState = ssg.UI.State.current();
            // check if code is already included in UI Extras
            if (newState.xtras.indexOf('annotation')) {

                newState.xtras.push('annotation');

            } else {

                newState.xtras.pop('annotation');

            }

            ssg.UI.State.update(newState);

            if ((<HTMLElement>event.target).classList.contains(coreUiElement.state.active)) {

                // sho source code by adding class
                let codeBlocks = doc.querySelectorAll('.ssg-item-description');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.add(coreUiElement.state.show);
                }

            } else {
                // hide source code by removing the class
                let codeBlocks = doc.querySelectorAll('.ssg-item-description');
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

            console.log("Filter TOC");

            let currentToc = <Node>event.target,
                filter = (<HTMLElement>currentToc).dataset['filter'],
                filterFolder = (<HTMLElement>currentToc).dataset['folder'],
                filterCat = (currentToc.parentNode.attributes.getNamedItem('id').value),
                tocButton = doc.querySelector(ssg.UI.btnShowToC);

            if(tocButton){
                tocButton[0].classList.add('active');
            }

            if (filterCat) {

                if (filterFolder === 'templates' ||
                    filterFolder === 'organism' ||
                    filterFolder === 'page') {

                    let selectedItems = doc.querySelectorAll('div[data-cat=' + filterFolder + ']');

                    // Updating current state
                    let curState = ssg.UI.State.current();
                    curState.filterSelector = '.' + filter;
                    ssg.UI.State.update(curState);

                    console.log('----------- A slider selection');
                    ssg.UI.Filter.sliderSelection(filterFolder);

                } else {
                    ssg.UI.Utils.hideSingleItemSlider(true);
                }

                let category = filterCat.split('-')[1];

                let filterButtons = document.querySelectorAll('.ssg-core-filter .ssg-button');

                for (let i = filterButtons.length - 1; i >= 0; i--) {

                    let curFilterButton = filterButtons[i],
                        curFilterStyle = curFilterButton.classList,
                        curDataSet = (<HTMLElement>curFilterButton).dataset['filter'];

                    console.log(curFilterStyle, category);

                    if (curFilterStyle.contains('active')) {

                        curFilterStyle.remove('active');

                    }

                    if (curDataSet === category) {

                        curFilterStyle.add('active');

                    }

                }

            }

            // Updating State
            let newState = ssg.UI.State.current();
            newState.filter = 'single';
            newState.filterSelector = '.' + filter;
            ssg.UI.State.update(newState);

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
            }

        },
        // search for item in toc
        searchToc: (event: Event) => {

            event.preventDefault();

            let searchBox: HTMLInputElement = <HTMLInputElement>doc.getElementById(coreUiElement.tocSearchValue);

            if (searchBox !== null) {

                let searchValue = searchBox.value;

                let resetResult = doc.querySelectorAll('.ssg-toc-item');

                for (let j = resetResult.length - 1; j >= 0; j--) {

                    if (resetResult[j].classList.contains('hide')) {

                        resetResult[j].classList.remove('hide');

                    }

                }

                if (searchValue !== '') {

                    let searchResult = doc.querySelectorAll(".ssg-toc-item:not([data-filter*='" + searchValue + "'])");

                    if (searchResult !== null) {

                        for (let i = searchResult.length - 1; i >= 0; i--) {

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

    export let Render = () => {

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
                    patterns[j].filename + '\" ' +
                    ' data-folder=\"' + folderpath + '\" ' +
                    '>' +
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

        let allContent = '',
            allToc = '';

        for (let i = patternConfig.patterns.length - 1; i >= 0; i--) {

            let curPattern = patternConfig.patterns[i],
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
                    let domContent = parser.parseFromString(content, 'text/html');
                    // Append parsed content
                    allContent = domContent.body.innerHTML + allContent;

                } catch (exception) {

                    console.log(exception);

                }

            }

        }

        let allContentDOM = parser.parseFromString(allContent, 'text/html');

        // alter templates and pages
        let allTempLates = allContentDOM.querySelectorAll('div[data-cat=templates]'),
            allPages = allContentDOM.querySelectorAll('div[data-cat=pages]'),
            allOrganism = allContentDOM.querySelectorAll('div[data-cat=organism]');

        Utils.changeItemToSinglePage(allTempLates);
        Utils.changeItemToSinglePage(allPages);
        Utils.changeItemToSinglePage(allOrganism);

        container.insertAdjacentHTML('afterbegin', allContentDOM.body.innerHTML);


        Prism.highlightAll();

        RenderToc(patternConfig);

        ApplyUIState(ssg.UI.State.current());

    }

    export let ApplyUIState = (state: any) => {


        let applyFilter: Function = (state: any) => {

            console.log("Filter State", state);

            if (state.filter !== undefined
                && state.filter !== 'toc') {

                let buttons = doc.querySelectorAll(`.ssg-button[data-filter]`);

                // Set correct button
                for (let i: number = buttons.length - 1; i >= 0; i--) {

                    let curButton: HTMLElement = <HTMLElement>buttons[i];

                    if (curButton.dataset !== null
                        && curButton.dataset !== undefined
                        && curButton.dataset['filter'] === state.filter) {

                        if (!curButton.classList.contains('active')) {

                            curButton.classList.add('active');

                        }

                    } else {

                        if (curButton.classList.contains('active')) {

                            curButton.classList.remove('active');

                        }

                    }

                }

                let query: string = `.ssg-item[data-cat='${state.filter}']`,
                    invQuery: string = `.ssg-item:not([data-cat='${state.filter}'])`;

                if (state.filter === 'single') {

                    let filter: string = state.filterSelector.substr(1);

                    query = `div[data-file='${filter}']`;
                    invQuery = `div:not([data-file='${filter}'])`;

                    let tocButton = doc.querySelectorAll(`.ssg-button[data-action='ssg-toc']`);

                    console.log('TOC BUTTON');

                    if (tocButton !== undefined && tocButton.length === 1) {
                        console.log('TOC BUTTON');
                        tocButton[0].classList.add('active');

                    }

                }

                if (state.filter === 'organism' ||
                    state.filter === 'molecules' ||
                    state.filter === 'templates') {

                    ssg.UI.Filter.sliderSelection(state.filter);

                }

                // unselect all
                let notSelItems = doc.querySelectorAll(invQuery);
                for (let i = notSelItems.length - 1; i >= 0; i--) {
                    notSelItems[i].classList.add('hide');
                }

                // make sure all are selected
                let selItems = doc.querySelectorAll(query);

                if (selItems.length === 1) {

                    let curItem: HTMLElement = <HTMLElement>selItems[0];

                    console.log('Current Category:', curItem.dataset.cat);

                    if (curItem.dataset.cat !== undefined
                        && curItem.dataset.cat !== null
                        && (
                            curItem.dataset.cat === 'templates'
                            || curItem.dataset.cat === 'pages'
                            || curItem.dataset.cat === 'organism'
                        )
                    ) {

                        ssg.UI.Filter.sliderSelection(curItem.dataset.cat);

                    } else {

                        ssg.UI.Utils.hideSingleItemSlider(true);

                    }


                } else {

                    for (let i = selItems.length - 1; i >= 0; i--) {
                        selItems[i].classList.remove('hide');
                    }

                }

            }
        };

        // apply the correct selected scren width tot the viewport
        let applyScreenWidth: Function = (state: any) => {

            let viewPortQuery = `button[data-viewport='${state.screen}']`,
                viewPortInvQuery = `button.active[data-viewport]`,
                // selecting buttons
                viewPortActiveButton = doc.querySelector(viewPortInvQuery),
                viewPortButton = doc.querySelector(viewPortQuery),
                // width selector
                widthSelector = <HTMLInputElement>doc.getElementById('ssg-in-width'),
                contentWidth: HTMLElement = <HTMLElement>doc.querySelector('.ssg-patterns-inner');

            // set inner screen width of patterns
            contentWidth.style.width = `${state.screen}px`;

            // view width selector
            widthSelector.value = state.screen;

            // activate viewport button

            if (viewPortButton !== undefined
                && viewPortButton !== null) {

                viewPortButton.classList.add('active');

                if (viewPortButton !== viewPortActiveButton) {

                    viewPortActiveButton.classList.remove('active');

                }

            }

        };

        let applyExtras: Function = (state: any) => {

            if (state.xtras.indexOf('annotation')) {

                let notes = doc.querySelectorAll('.ssg-item-description');

                for (let i = notes.length - 1; i >= 0; i--) {

                    let curNote: HTMLElement = <HTMLElement>notes[i];
                    curNote.classList.add('show');

                }

                let notesButton = doc.querySelectorAll("button[data-action='ssg-annot']");

                for (let i = notesButton.length - 1; i >= 0; i--) {

                    notesButton[i].classList.add('active');

                }

            }

        };

        applyFilter(state);
        applyScreenWidth(state);
        applyExtras(state);

    }

    export let EnableSingleSlider = (currentSingleItems, filter) => {

        let slideItems = currentSingleItems;

        let setCurrentItem = (index: number) => {

            let curElement = slideItems[index];

            currentTitle.textContent = curElement.title;

            let allElements =
                doc.querySelectorAll('div[data-cat=\'' + slideItems[currentSingleCount].category + '\']');

            for (let j = 0; j < allElements.length; j++) {

                let curPatternElement: HTMLElement = <HTMLElement>allElements[j];

                if (curPatternElement.dataset['file'] === curElement.file) {

                    curPatternElement.classList.remove('hide');

                    let newState = ssg.UI.State.current();

                    // newState.filter = "single";
                    newState.filterSelector = '.' + curPatternElement.dataset['file'];

                    ssg.UI.State.update(newState);

                } else {

                    curPatternElement.classList.add('hide');

                }

            }

        }

        let slidePatterns = function (event) {

            event.preventDefault();
            event.stopPropagation();

            console.log('Button called');

            let currentButton: HTMLElement = <HTMLElement>event.target;

            if (currentButton !== null) {

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
            } else {

                // check from current state
                for (let i = 0; currentSingleItems.length; i++) {
                    console.log(currentSingleItems[0]);
                }

            }

            setCurrentItem(currentSingleCount);

        }

        // check if only one pattern is in current selection
        if (slideItems.length <= 1) {
            return;
        }

        let currentTitle = doc.querySelector(coreUiElement.singleItemNavTitle);

        currentTitle.textContent = slideItems[0].title;

        // let slider = doc.querySelectorAll('.ssg-core-nav .ssg-button[data-filter=\'' + filter + '\']');
        let slider = doc.querySelectorAll('.ssg-core-nav .ssg-button');

        for (let i = 0; i < slider.length; i++) {

            // remova all previous registered event handler
            let currentButton = slider[i];
            // clone current node without event handler
            let newButton = currentButton.cloneNode(true);
            // register new Click event
            newButton.addEventListener('click', slidePatterns);
            // replace element
            currentButton.parentNode.replaceChild(newButton, currentButton);

        }

        console.log('------------ DO SOME CODE HERE -------------');
        console.log(ssg.UI.State.current());
        // Setting current Item count i case filter using TOC
        currentSingleCount = currentSingleItems.findIndex(
            x => x.file === (ssg.UI.State.current()).filterSelector.substring(1));

        // Update from current filter
        setCurrentItem(currentSingleCount);


        // if (filter === null || filter === undefined) {
        //     console.log("Rolling slidePatterns");
        //     slidePatterns(null);
        // }

    }

    export let ShowSliderCtrl = (show: boolean) => {

        let singleSliderControl = document.querySelector('.' + coreUiElement.singleItemNav);

        if (show) {

            singleSliderControl.classList.remove('hidden');

        } else {

            singleSliderControl.classList.add('hidden');

        }

    }

    export let InitEvents = () => {
        // Render Events
        let filterButtons: NodeList = doc.querySelectorAll(coreUiElement.filterButton),
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

    export let Init = () => {

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

    export let PostRender = [];

};



ssg.UI.Init();