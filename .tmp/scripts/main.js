// global ssgDoc, window
// getting global variables to work
var ssgDoc = ssgDoc || {};
(function () {
    var doc = document.querySelector('#ssg-docbar-inner'), mainDoc = document.querySelector('body');
    for (var name in ssgDoc) {
        doc.insertAdjacentHTML('afterbegin', ssgDoc[name].body);
        // mainDoc.insertAdjacentHTML('afterbegin', ssgDoc[name].body);
    }
})();
// ssg.UI.PostRender.push(function(){
//     console.log('>>>>>>>>>>> Hello World 1');
// })
// ssg.UI.PostRender.push(function(){
//     console.log('>>>>>>>>>>> Hello World 2');
// }) 
