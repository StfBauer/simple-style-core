/// <reference path="../../typings/index.d.ts" />
var ssg;
(function (ssg) {
    var UI;
    (function (UI) {
        var win = window, doc = document, ssgTemplates = ssgCore.templates, patternConfig = null;
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
            discoButton: '.ssg-button[data-viewport=\'disco\']',
            stateActive: '.active'
        };
        var Utils;
        (function (Utils) {
            function requestData(method, url) {
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
            }
            Utils.requestData = requestData;
            ;
        })(Utils = UI.Utils || (UI.Utils = {}));
        ;
        UI.Filter = {
            elements: function (filterValue) {
                console.log(filterValue);
            }
        };
        UI.initDisco = function () {
            var disco = setInterval(function () {
                var discoButton = doc.querySelector(coreUiElement.discoButton + coreUiElement.stateActive), viewPortInner = doc.querySelector(coreUiElement.viewPortTarget), viewPortWidth = doc.querySelector(coreUiElement.viewPortWidth);
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
                    if (allButtons[i].classList.contains('active')) {
                        allButtons[i].classList.remove('active');
                    }
                }
                var curButton = event.target, filter = curButton.dataset['filter'];
                curButton.classList.add('active');
                UI.Filter.elements(filter);
            },
            // change view - Add isolated, code, Annotation
            changeView: function (event) {
                // prevent all default
                event.preventDefault();
                var curButton = event.target, filter = curButton.dataset['filter'];
                curButton.classList.contains('active') ?
                    curButton.classList.remove('active') : curButton.classList.add('active');
            },
            // adjust view port to differnet width
            changeViewPort: function (event) {
                event.preventDefault();
                var vpButton = event.target, vpActiveButton = doc.querySelector(coreUiElement.viewPortButton + coreUiElement.stateActive), vpData = vpButton.dataset['viewport'], vpTarget = doc.querySelector(coreUiElement.viewPortTarget), widthInput = doc.querySelector(coreUiElement.viewPortWidth);
                // remove current active button
                if (vpActiveButton !== null) {
                    vpActiveButton.classList.remove('active');
                }
                if (vpActiveButton === vpButton) {
                    vpButton.classList.remove('active');
                    vpData = 'full';
                }
                else {
                    vpButton.classList.add('active');
                }
                // recheck Active Buttons
                vpActiveButton = doc.querySelector(coreUiElement.viewPortButton + coreUiElement.stateActive);
                if (vpActiveButton === null) {
                    vpActiveButton = doc.querySelector('.ssg-button[data-viewport=\'full\']');
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
            // register specific event on all notes
            registerEvents: function (curElements, eventType, handler) {
                for (var i = curElements.length - 1; i >= 0; i--) {
                    curElements[i].addEventListener(eventType, handler);
                }
            }
        };
        UI.Render = function () {
            console.log('...... SSG Templates Config');
            console.log(ssgTemplates);
            console.log('...... Pattern Config');
            console.log(patternConfig);
            console.log(('..... Config'));
            var container = doc.querySelector(coreUiElement.viewPortTarget);
            console.log('..... All Pattern');
            for (var i = patternConfig.patterns.length - 1; i >= 0; i--) {
                var content = ssgTemplates.patternItem(patternConfig.patterns[i]);
                container.insertAdjacentHTML('afterbegin', content);
            }
            // var patternItem = ssgTemplates.patternItem();
        };
        UI.Init = function () {
            console.log('.... Load Configuration');
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
            var filterButtons = doc.querySelectorAll(coreUiElement.filterButton), viewButtons = doc.querySelectorAll(coreUiElement.viewButton), viewPortButtons = doc.querySelectorAll(coreUiElement.viewPortButton), viewPortWidth = doc.querySelectorAll(coreUiElement.viewPortWidth);
            UI.Events.registerEvents(filterButtons, 'click', UI.Events.changeFilter);
            UI.Events.registerEvents(viewButtons, 'click', UI.Events.changeView);
            UI.Events.registerEvents(viewPortButtons, 'click', UI.Events.changeViewPort);
            UI.Events.registerEvents(viewPortWidth, 'blur', UI.Events.viewPortResizer);
            UI.Events.registerEvents(viewPortWidth, 'focusout', UI.Events.viewPortResizer);
            UI.Events.registerEvents(viewPortWidth, 'keypress', UI.Events.viewPortResizer);
        };
    })(UI = ssg.UI || (ssg.UI = {}));
})(ssg || (ssg = {}));
;
ssg.UI.Init();
