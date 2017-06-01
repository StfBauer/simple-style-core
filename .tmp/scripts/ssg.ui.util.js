"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
})(Utils = exports.Utils || (exports.Utils = {}));
;
