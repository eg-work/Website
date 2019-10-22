'use strict';
/*jslint node: true */
/*jshint esversion: 6 */
/*jshint browser: true */



// console.log($('.menubutton'));
// document.body.style.border = "5px solid green";


$('.menubutton').each(function(i,x) {
    x.children[0].style.border = "solid white 0px";
});

$('.menubutton').click(function(e) {
    e.target.children[0].click();
});




var worldmap = document.getElementsByClassName("worldmapbox")[0];
if (worldmap !== null && worldmap !== undefined) {
    (Array.prototype.slice.call($('.menubutton')))[0].style.borderBottom = 'solid #edcb96 5px';
}
var marketdata = document.getElementById("marketdata-menu");
if (marketdata !== null && marketdata !== undefined) {
    (Array.prototype.slice.call($('.menubutton')))[1].style.borderBottom = 'solid #edcb96 5px';
}
var signup = document.getElementById("signup");
if (signup !== null && signup !== undefined) {
    (Array.prototype.slice.call($('.menubutton')))[2].style.borderBottom = 'solid #edcb96 5px';
}


