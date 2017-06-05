
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
        patternConfig = null;

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
        // Buttons
        discoButton: '.ssg-button[data-viewport=\'disco\']',
        btnShowCode: '.ssg-button[data-action=\'ssg-code\']',
        btnShowAnnotion: '.ssg-button[data-action=\'ssg-annot\']',
        // State Elements
        stateActive: '.active',
        stateHidden: '.hidden'
    };

    export namespace Utils {

        export function requestData(method: string, url: string): Promise<{}> {

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

    };

    export var Filter = {

        elements: (filterValue: string) => {

            var allElements = document.querySelectorAll('.ssg-item');

            for (let i = allElements.length - 1; i >= 0; i--) {

                var curElement: HTMLElement = <HTMLElement>allElements[i];

                if (curElement.dataset['cat'] === filterValue) {

                    curElement.classList.remove('hide');

                } else {

                    curElement.classList.add('hide');

                }

            }

        }

    }

    export var initDisco = () => {

        var disco = setInterval(
            function () {

                let discoButton = doc.querySelector(coreUiElement.discoButton + coreUiElement.stateActive),
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

                if (allButtons[i].classList.contains('active')) {
                    allButtons[i].classList.remove('active');
                }

            }

            var curButton: HTMLElement = <HTMLElement>event.target,
                filter = curButton.dataset['filter'];

            curButton.classList.add('active');
            Filter.elements(filter);

        },

        // change view - Add isolated, code, Annotation
        changeView: (event: Event) => {

            // prevent all default
            event.preventDefault();

            var curButton: HTMLElement = <HTMLElement>event.target,
                filter = curButton.dataset['filter'];

            curButton.classList.contains('active') ?
                curButton.classList.remove('active') : curButton.classList.add('active');

        },

        // adjust view port to differnet width
        changeViewPort: (event: Event) => {

            event.preventDefault();

            var vpButton: HTMLElement = <HTMLElement>event.target,
                vpActiveButton: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortButton + coreUiElement.stateActive),
                vpData = vpButton.dataset['viewport'],
                vpTarget: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget),
                widthInput: HTMLInputElement = <HTMLInputElement>doc.querySelector(coreUiElement.viewPortWidth);


            // remove current active button
            if (vpActiveButton !== null) {

                vpActiveButton.classList.remove('active');
            }

            if (vpActiveButton === vpButton) {

                vpButton.classList.remove('active');
                vpData = 'full';

            } else {

                vpButton.classList.add('active');

            }

            // recheck Active Buttons
            vpActiveButton = <HTMLElement>doc.querySelector(coreUiElement.viewPortButton + coreUiElement.stateActive);

            if (vpActiveButton === null) {

                vpActiveButton = <HTMLElement>doc.querySelector('.ssg-button[data-viewport=\'full\']');

                vpActiveButton.classList.add('active');

            }

            // action what to do
            if (typeof vpTarget !== undefined) {

                switch (vpData) {

                    case 'full':

                        vpData = vpTarget.style.width = window.innerWidth.toString();
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

        showSource: (event: Event) => {
            event.preventDefault();
            if ((<HTMLElement>event.target).classList.contains('active')) {

                // sho source code by adding class
                var codeBlocks = doc.querySelectorAll('.ssg-item-code');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.add('show');
                }

            } else {
                // hide source code by removing the class
                var codeBlocks = doc.querySelectorAll('.ssg-item-code');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.remove('show');
                }
            }
        },
        showAnnotation: (event: Event) => {

            event.preventDefault();
            if ((<HTMLElement>event.target).classList.contains('active')) {

                // sho source code by adding class
                var codeBlocks = doc.querySelectorAll('.ssg-item-description');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.add('show');
                }

            } else {
                // hide source code by removing the class
                var codeBlocks = doc.querySelectorAll('.ssg-item-description');
                for (let i = codeBlocks.length - 1; i >= 0; i--) {
                    codeBlocks[i].classList.remove('show');
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

        // console.log('...... SSG Templates Config');
        // console.log(ssgTemplates);

        // console.log('...... Pattern Config');
        // console.log(patternConfig);

        // console.log(('..... Config'));
        let container: HTMLElement = <HTMLElement>doc.querySelector(coreUiElement.viewPortTarget);

        // console.log('..... All Pattern');

        var allContent = "";

        for (let i = patternConfig.patterns.length - 1; i >= 0; i--) {

            var curPattern = patternConfig.patterns[i],
                curPatternTitle = curPattern.title,
                curTemplate = ssgTemplates[curPatternTitle],
                parser = new DOMParser();

            // Define base filter
            curPattern.baseFilter = curPattern.filepath.split('/')[0];
            // console.log(curPattern.baseFilter);

            // console.log('--->', curPattern.title);

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

        container.insertAdjacentHTML('afterbegin', allContent);
        Prism.highlightAll();

    }


    export var Init = () => {

        console.log('.... Load Configuration');
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

            })
            .catch(function (error: any): void {
                console.log(error);
            })
        // Render Events
        var filterButtons: NodeList = doc.querySelectorAll(coreUiElement.filterButton),
            viewButtons: NodeList = doc.querySelectorAll(coreUiElement.viewButton),
            viewPortButtons: NodeList = doc.querySelectorAll(coreUiElement.viewPortButton),
            viewPortWidth: NodeList = doc.querySelectorAll(coreUiElement.viewPortWidth),
            // Action Buttons
            showCode: NodeList = doc.querySelectorAll(coreUiElement.btnShowCode),
            showAnnot: NodeList = doc.querySelectorAll(coreUiElement.btnShowAnnotion);

        console.log(showCode);

        Events.registerEvents(filterButtons, 'click', Events.changeFilter);
        Events.registerEvents(viewButtons, 'click', Events.changeView);
        Events.registerEvents(viewPortButtons, 'click', Events.changeViewPort);
        Events.registerEvents(viewPortWidth, 'blur', Events.viewPortResizer);
        Events.registerEvents(viewPortWidth, 'focusout', Events.viewPortResizer);
        Events.registerEvents(viewPortWidth, 'keypress', Events.viewPortResizer);
        Events.registerEvents(showCode, 'click', Events.showSource);
        Events.registerEvents(showAnnot, 'click', Events.showAnnotation);
    }

};


ssg.UI.Init();