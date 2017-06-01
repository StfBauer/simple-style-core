// global ssgDoc, window
// getting global variables to work
var ssgDoc = ssgDoc || {};

console.log("hello World");

(function() {

    var doc = document.querySelector('#ssg-docbar-inner'),
    mainDoc = document.querySelector('body');

    for (var name in ssgDoc){

        doc.insertAdjacentHTML('afterbegin', ssgDoc[name].body);
        // mainDoc.insertAdjacentHTML('afterbegin', ssgDoc[name].body);
    }
})();