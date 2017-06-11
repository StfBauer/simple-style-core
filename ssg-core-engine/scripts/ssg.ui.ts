
/// <reference path="../../typings/index.d.ts" />


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
        currentSingleCount = 0;

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

            var singleItemSelector = doc.querySelector(coreUiElement.singleItemNav);

            if (singleItemSelector !== undefined && singleItemSelector !== null) {

                if(hide === true){

                    singleItemSelector.classList.add(coreUiElement.state.hidden);

                } else {

                    singleItemSelector.classList.remove(coreUiElement.state.hidden);

                }

            }

        }
    };

    export var Filter = {

        elements: (filterValue: string) => {

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
                    break;

                case "organism":
                case "templates":
                case "pages":

                    var allElements = doc.querySelectorAll('div[data-cat]'),
                        firstItemFound = false;

                    // reset currentSingleItem
                    currentSingleItems = [];

                    for (let i = 0; i < allElements.length; i++) {

                        var curElement: HTMLElement = <HTMLElement>allElements[i];

                        if (curElement.dataset['cat'] === filterValue) {

                            var curSingleItem = {
                                title: curElement.getAttribute('title'),
                                file: curElement.dataset['file'],
                                category: filterValue
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

                    if (currentSingleItems.length !== 0) {

                        ssg.UI.EnableSingleSlider(currentSingleItems);
                        // ssg.UI.Render.initElementNavigation(curElement);
                    }

                    break;

            }

        }

    }

    export var initDisco = () => {

        var disco = setInterval(
            function () {

                let discoButton = doc.querySelector(coreUiElement.discoButton + coreUiElement.state.active),
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
            var currenToc = <HTMLElement>event.target,
                filter = currenToc.dataset['filter'];

            console.log('FILTER TOC', filter);

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

    }

    export var EnableSingleSlider = (currentSingleItems) => {

        var currentTitle = doc.querySelector(coreUiElement.singleItemNavTitle);

        currentTitle.textContent = currentSingleItems[0].title;

        var slider = doc.querySelectorAll('.ssg-core-nav .ssg-button');

        for (let i = 0; i < slider.length; i++) {

            slider[i].addEventListener('click', function (event) {

                event.preventDefault();

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

                let curElement = currentSingleItems[currentSingleCount];

                currentTitle.textContent = curElement.title;

                var allElements =
                    doc.querySelectorAll('div[data-cat=\'' + currentSingleItems[currentSingleCount].category + '\']');

                for (let j = 0; j < allElements.length; j++) {

                    var curPatternElement: HTMLElement = <HTMLElement>allElements[j];

                    if (curPatternElement.dataset['file'] === curElement.file) {

                        curPatternElement.classList.remove('hide');

                    } else {

                        curPatternElement.classList.add('hide');

                    }

                }

            });

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
        Events.registerEvents(viewButtons, 'click', Events.changeView);
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

                    //ssg.UI.patternConfig: PatternConfig = <PatternConfig>JSON.parse(result.toString());
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