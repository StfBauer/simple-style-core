
/// <reference path="../../typings/index.d.ts" />

// import * as UIState from './ssg.uistate';
// tslint:global ssgDoc;

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

declare var ssgDoc: any;

namespace ssg {

    declare let window: Window;
    declare let document: Document;
    declare let ssgCore: any;
    declare let Prism: any;
    declare let ssgData: any;
    export declare let templates: any;


    export namespace UI {


        let win = window,
            doc = document,
            ssgCoreTemplates = ssgCore.templates,
            ssgTemplates: any = ssg.templates,
            patternConfig: any = null,
            currentSingleItems = [],
            currentSingleCount = 0,
            currentUIState: any = ssg.UI.State;

        let viewports: Array<number> = [
            320,
            768,
            1024,
            3500
        ]

        export let coreUiElement = {
            // Buttons
            btnShowAnnotion: '.ssg-button[data-action=\'ssg-annot\']',
            btnShowCode: '.ssg-button[data-action=\'ssg-code\']',
            btnShowToC: '.ssg-button[data-action=\'ssg-toc\']',
            discoButton: '.ssg-button[data-viewport=\'disco\']',

            filterButton: '.ssg-core-filter .ssg-button',
            patternItem: 'div[class^=ssg-item]',
            tocItem: '.ssg-toc-item',
            viewButton: '.ssg-core-view .ssg-button',
            viewPortButton: '.ssg-core-viewport .ssg-button',
            viewPortTarget: '.ssg-patterns-inner',
            viewPortWidth: '#ssg-in-width',
            viewToc: '.ssg-toc',
            viewTocInner: '.ssg-toc-inner',


            singleItemNav: 'ssg-core-nav',
            singleItemNavTitle: '#ssg-item-nav-label',
            singleNavLeft: 'ssg-left',
            singleNavRight: 'ssg-right',

            tocSearchBox: '.ssg-toc-searchbox',
            tocSearchValue: 'toc-searchbox',

            // States
            state: {
                active: 'active',
                hidden: 'hidden',
                show: 'show'
            }
        };

        export let State = (() => {


            const STATE_KEY = 'ssg.UI.State',
                XTRAS = ['isolate', 'code', 'annotation'],
                FILTERS = ['atoms', 'molecules', 'organism', 'templates', 'pages', 'single'],
                SCREEN = ['s', 'm', 'l', 'uwd', 'full', 'disco'];

            let _currentUIState: any = null;

            // default UI State;
            let defState: UIState = {
                'filter': 'atoms',
                'screen': window.screen.availWidth,
                'xtras': ['annotation']
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

                // check current screen
                try {

                    parseInt(state.screen.toString(), 10);

                } catch (exception) {

                    console.log('ERROR:' + exception);
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

                    localStorage.setItem(STATE_KEY, JSON.stringify(curState));

                } else {

                    throw 'There are some errors with the state';

                }

            }

            (() => {

                let sessionState = localStorage.getItem(STATE_KEY);

                // If session already exists
                if (sessionState) {

                    _currentUIState = JSON.parse(sessionState);

                } else {

                    localStorage.setItem(STATE_KEY, JSON.stringify(defState));
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

                    let loaded: any = function (this: any): void {

                        let curStatus: any = this.status;

                        if (curStatus >= 200 && curStatus < 300) {
                            resolve(xhr.response);
                        } else {
                            reject({
                                status: this.status,
                                statusText: xhr.statusText
                            });
                        }
                    };

                    let onError: any = function (this: any): void {
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

                let singleItemSelector = doc.querySelector('.' + coreUiElement.singleItemNav);

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

            elements: (filterValue: any) => {

                switch (filterValue) {
                    case 'atoms':
                    case 'molecules':

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

                    case 'organism':

                        ssg.UI.Filter.sliderSelection(filterValue);
                        break;

                    case 'templates':

                        ssg.UI.Filter.sliderSelection(filterValue);
                        break;

                    case 'pages':

                        ssg.UI.Filter.sliderSelection(filterValue);
                        break;

                    default:
                        break;

                }

            },
            sliderSelection: (filter: any) => {

                let allElements = doc.querySelectorAll('div[data-cat]'),
                    firstItemFound = false;

                // reset currentSingleItem
                currentSingleItems = [];

                for (let i = 0; i < allElements.length; i++) {

                    let curElement: HTMLElement = <HTMLElement>allElements[i];

                    if (curElement.dataset['cat'] === filter) {

                        let curSingleItem = {
                            category: filter,
                            file: curElement.dataset['file'],
                            title: curElement.getAttribute('title')

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

                ssg.UI.EnableSingleSlider(currentSingleItems, null);

                if (currentSingleItems.length > 1) {

                    ssg.UI.Utils.hideSingleItemSlider(false);

                } else {

                    ssg.UI.Utils.hideSingleItemSlider(true);

                }
            }

        }

        export let initDisco = () => {

            let disco = setInterval(
                function () {

                    let discoButton = document.querySelector(coreUiElement.discoButton + '.' + coreUiElement.state.active),
                        viewPortInner: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                        viewPortWidth: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);

                    if (discoButton !== null) {

                        let curViewPort = Math.floor(Math.random() * (viewports.length - 0)) + 0;

                        viewPortWidth.value = viewPortInner.style.width = viewports[curViewPort].toString();

                    } else {

                        clearInterval(disco);

                    }

                },
                1000);

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

                if (filter === undefined) {
                    throw 'filter cannot be undefined';
                }

                Filter.elements(filter);

                // Check if toc button is active otherwise remove state.
                let tocButton = doc.querySelectorAll(coreUiElement.btnShowToC);

                // if toc button was found
                if (tocButton.length !== 0) {
                    // remove active state in case toc was selected

                    if (tocButton[0].classList.contains(coreUiElement.state.active)) {

                        tocButton[0].classList.remove('active');

                    }

                };

                let curState = ssg.UI.State.current();

                curState.filter = filter;

                ssg.UI.State.update(curState);

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
                    vpActiveButton: HTMLElement = <HTMLElement>doc.querySelector(
                        coreUiElement.viewPortButton + '.' + coreUiElement.state.active),
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

                            if (vpData !== undefined && vpData !== null) {

                                vpTarget.style.width = vpData;

                            }
                            break;

                    }

                    if (vpData !== undefined && vpData !== null) {
                        // assign special class for documentation
                        let vpCurSize: number = parseInt(vpData, 10);

                        if (vpCurSize !== NaN && vpCurSize <= 1024) {
                            console.log('small view port size');
                            vpTarget.classList.add('vp-small');
                        } else {
                            console.log('large view port size');
                            vpTarget.classList.remove('vp-small');
                        }
                    }


                }

                if (vpData !== undefined && vpData !== 'disco') {
                    // Update width indicator
                    vpTarget = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget);
                    widthInput.value = vpData;
                }

            },
            // filter single toc element
            filterToc: (event: Event) => {

                event.preventDefault();

                let currentToc = <Node>event.target;

                // just in case current toc is null and the parent node is null
                if (currentToc === null || currentToc.parentNode === null) {
                    return;
                }



                let filter = (<HTMLElement>currentToc).dataset['filter'],
                    filterFolder = (<HTMLElement>currentToc).dataset['folder'],
                    filterCat = (currentToc.parentNode.attributes.getNamedItem('id').value),
                    tocButton: any = doc.querySelector(ssg.UI.coreUiElement.btnShowToC);

                if (tocButton) {
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

                    if (tocElement === null) {
                        throw 'Current toc elment is null';
                    }

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

            // show and hides annotations
            showAnnotation: (event: Event) => {

                event.preventDefault();
                event.stopImmediatePropagation();

                // Updating State
                let newState = ssg.UI.State.current();

                // check if code is already included in UI Extras
                if (newState.xtras.indexOf('annotation') === -1) {

                    newState.xtras.push('annotation');

                } else {

                    let newXtras = newState.xtras.filter((e: any) => e !== 'annotation');
                    newState.xtras = newXtras;

                }

                ssg.UI.State.update(newState);

                if ((<HTMLElement>event.target).classList.contains(coreUiElement.state.active)) {

                    // show annotation by adding class
                    let codeBlocks = doc.querySelectorAll('.ssg-item-description');
                    for (let i = codeBlocks.length - 1; i >= 0; i--) {
                        codeBlocks[i].classList.add(coreUiElement.state.show);
                    }

                } else {
                    // hide annotation code by removing the class
                    let codeBlocks = doc.querySelectorAll('.ssg-item-description');
                    for (let i = codeBlocks.length - 1; i >= 0; i--) {
                        codeBlocks[i].classList.remove(coreUiElement.state.show);
                    }
                }

            },
            // Show and hides source code
            showSource: (event: Event) => {

                event.preventDefault();
                event.stopImmediatePropagation();

                // Updating State
                let newState = ssg.UI.State.current();

                // check if code is already included in UI Extras
                if (newState.xtras.indexOf('code') === -1) {

                    newState.xtras.push('code');

                } else {

                    let newXtras = newState.xtras.filter((e: any) => e !== 'code');
                    newState.xtras = newXtras;

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

            // Resize View Port through manual update of width
            viewPortResizer: (event: Event) => {

                if (event instanceof KeyboardEvent) {

                    let kbEvent: KeyboardEvent = <KeyboardEvent>event;

                    if (kbEvent.keyCode === 13) {

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

            // register specific event on all notes
            registerEvents: (curElements: NodeList, eventType: any, handler: any) => {

                for (let i = curElements.length - 1; i >= 0; i--) {

                    curElements[i].addEventListener(eventType, handler);

                }

            }

        }

        export let Render = () => {

            let RenderToc = (patternConfig: any) => {

                let patterns: PatternItem[] = patternConfig.patterns.filter(function (object: any) {
                    return object['deleted'] === undefined;
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

                    let currentSection: HTMLElement = <HTMLElement>doc.getElementById('ssg-' + folderpath + '-items');

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
                allToc = '',
                parser = new DOMParser();

            for (let i = patternConfig.patterns.length - 1; i >= 0; i--) {

                let curPattern = patternConfig.patterns[i],
                    curPatternTitle = curPattern.filename,
                    curTemplate = ssgTemplates[curPatternTitle];

                // Define base filter
                curPattern.baseFilter = curPattern.filepath.split('/')[0];

                if (curPattern !== null) {

                    curPattern.sample = curTemplate !== undefined ? curTemplate(ssgData) : curTemplate;

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

                if (state.filter !== undefined
                    && state.filter !== 'single') {

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

                    let query: string = `div[class^='ssg-item'][data-cat='${state.filter}']`,
                        invQuery: string = `div[class^='ssg-item']:not([data-cat='${state.filter}'])`;

                    if (state.filter === 'single') {

                        let filter: string = state.filterSelector.substr(1);

                        query = `div[data-file='${filter}']`;
                        invQuery = `div:not([data-file='${filter}'])`;

                        let tocButton = doc.querySelectorAll(`.ssg-button[data-action='ssg-toc']`);

                        if (tocButton !== undefined && tocButton.length === 1) {

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

                        if (curItem !== undefined &&
                            curItem !== null &&
                            curItem.dataset !== undefined &&
                            curItem.dataset !== null
                            && (
                                curItem.dataset.cat === 'templates'
                                || curItem.dataset.cat === 'pages'
                                || curItem.dataset.cat === 'organism'
                            )
                        ) {

                            if (curItem.dataset.cat !== undefined
                                && curItem.dataset.cat !== null) {
                                ssg.UI.Filter.sliderSelection(curItem.dataset.cat);
                            }

                        } else {

                            ssg.UI.Utils.hideSingleItemSlider(true);

                        }


                    } else {

                        for (let i = selItems.length - 1; i >= 0; i--) {
                            selItems[i].classList.remove('hide');
                        }

                    }

                } else if (state.filter === 'single') {

                    let tocButton = doc.querySelector(coreUiElement.btnShowToC);

                    if (tocButton !== null) {

                        tocButton.classList.add('active');

                    }


                    if (state.filterSelector !== undefined &&
                        state.filterSelector !== null) {

                        let curFilter = state.filterSelector.substr(1);

                        let allAMItems = [].slice.call(
                            doc.querySelectorAll('div[class=ssg-item')
                        ),
                            allOPTItems = [].slice.call(
                                doc.querySelectorAll('div[class=ssg-item-single')
                            ),
                            allItems = allAMItems.concat(allOPTItems);

                        for (let i = allItems.length - 1; i >= 0; i--) {

                            if (allItems[i].dataset['file'] !== curFilter) {

                                let curItem: HTMLElement = <HTMLElement>allItems[i];
                                curItem.classList.add('hide');

                            }

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

                // If full screeen use actian width
                if (state.screen === 'full') {

                    state.screen = window.innerWidth;

                }

                // set inner screen width of patterns
                contentWidth.style.width = `${state.screen}px`;

                // view width selector
                widthSelector.value = state.screen;

                // activate viewport button
                if (viewPortButton !== undefined
                    && viewPortButton !== null) {

                    viewPortButton.classList.add('active');

                    if (viewPortButton !== viewPortActiveButton && viewPortActiveButton !== null) {

                        viewPortActiveButton.classList.remove('active');

                    }

                }

            };

            // applies extras such as shwo Source code
            let applyExtras: Function = (state: any) => {

                // Set annotation button and enable annotations
                if (state.xtras.indexOf('annotation') !== -1) {

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

                // Set code button and shows code
                if (state.xtras.indexOf('code') !== -1) {

                    let notes = doc.querySelectorAll('.ssg-item-code');

                    for (let i = notes.length - 1; i >= 0; i--) {

                        let curNote: HTMLElement = <HTMLElement>notes[i];
                        curNote.classList.add('show');

                    }

                    let notesButton = doc.querySelectorAll("button[data-action='ssg-code']");

                    for (let i = notesButton.length - 1; i >= 0; i--) {

                        notesButton[i].classList.add('active');

                    }

                }

            };

            applyFilter(state);
            applyScreenWidth(state);
            applyExtras(state);

        }

        export let EnableSingleSlider = (currentSingleItems: any, filter: any) => {

            let slideItems = currentSingleItems,
                currentTitle = doc.querySelector(coreUiElement.singleItemNavTitle);

            if (currentTitle !== null) {
                currentTitle.textContent = slideItems[0].title;
            }


            let setCurrentItem = (index: number) => {

                let curElement = slideItems[index];

                if (currentTitle !== null) {
                    currentTitle.textContent = curElement.title;
                }

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

            let slidePatterns = function (event: any) {

                event.preventDefault();
                event.stopPropagation();

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
                }

                setCurrentItem(currentSingleCount);

            }

            // check if only one pattern is in current selection
            if (slideItems.length <= 1) {
                return;
            }

            // let slider = doc.querySelectorAll('.ssg-core-nav .ssg-button[data-filter=\'' + filter + '\']');
            let slider = doc.querySelectorAll('.ssg-core-nav .ssg-button');

            for (let i = 0; i < slider.length; i++) {

                // remova all previous registered event handler
                let currentButton = slider[i];

                if (currentButton !== null) {

                    // clone current node without event handler
                    let newButton = currentButton.cloneNode(true);

                    // register new Click event
                    newButton.addEventListener('click', slidePatterns);

                    if (currentButton.parentNode !== null) {
                        // replace element
                        currentButton.parentNode.replaceChild(newButton, currentButton);
                    }
                }

            }

            let curState = ssg.UI.State.current();

            // Check if TOC have been selected
            if (curState.filterSelector !== undefined) {
                // Setting current Item count i case filter using TOC
                currentSingleCount = currentSingleItems.findIndex(
                    (x: any) => x.file === curState.filterSelector.substring(1));

                // Update from current filter
                setCurrentItem(currentSingleCount);

            }

        }

        export let ShowSliderCtrl = (show: boolean) => {

            let singleSliderControl = document.querySelector('.' + coreUiElement.singleItemNav);

            if (singleSliderControl !== null) {

                if (show) {

                    singleSliderControl.classList.remove('hidden');

                } else {

                    singleSliderControl.classList.add('hidden');

                }

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

                    ApplyUIState(ssg.UI.State.current());

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
}



ssg.UI.Init();
