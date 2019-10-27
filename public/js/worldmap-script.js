'use strict';
/*jslint node: true */
/*jshint esversion: 6 */
/*jshint browser: true */



function continent_events_over(ev) {
    // console.log("na:1");
    // console.log(ev);
    var count = 0;
    var ts = Array.from(ev.target.parentNode.children, function(x) {
        var previous_style = x.getAttribute('style');
        // console.log(previous_style);
        if (previous_style != null) { previous_style = previous_style.split(";").filter(p => !p.startsWith('fill:') && !p.startsWith('fill-opacity:')); } else { previous_style = []; }
        previous_style.push('fill:#273F47');
        previous_style.push('fill-opacity:1');
        previous_style = previous_style.filter(x => (x != ""));
        count++;
        // if (count == 0) console.log("PS list:", previous_style);
        x.setAttribute('style', previous_style.join(';'));


        // change world name
        var continentname = x.parentElement.id.replace('_',' ');
        $('#worldmapname').text(continentname);
    });
}

function continent_events_out(ev) {
    // console.log("na:2");
    var count = 0;
    var ts = Array.from(ev.target.parentNode.children, function (x) {
        var previous_style = x.getAttribute('style');
        // console.log("Previouse style:", previous_style);
        // console.log("List:", previous_style.split(";"))
        if (previous_style != null) { previous_style = previous_style.split(";").filter(p => !p.startsWith('fill:')); } else { previous_style = []; }
        previous_style.push('fill:white');
        previous_style = previous_style.filter(x => (x != ""));
        // console.log("Result list:", previous_style)
        // if (count == 0) console.log("PS list:", previous_style);
        count++;
        x.setAttribute('style', previous_style.join(';'));


        // reset world name
        $('#worldmapname').text("Hover over a continent to see it's name");
    });
}


var t = document.getElementById("worldmap");
t.addEventListener("load", function() {
    // layer.setAttribute('style', 'pointer-events:all')


    var result = t.contentDocument;
    var layer = result.children[0].children[2];


    // var na = result.getElementById("North_America");
    // na.addEventListener("mouseover", continent_events_over)
    // na.addEventListener("mouseout", continent_events_out)



    var all_continents = Array.from(result.children[0].children).filter(function(x) {
        let teststring = x.getAttribute('id');
        if (["Africa", "Austrailia", "Asia", "South_America", "Europe", "North_America"].indexOf(teststring) >= 0) {
            return true;
        } else {
            return false;
        }
    });


    for (var i=0;i<all_continents.length;i++) {
        var edges = Array.from(all_continents[i].children, function(x) {
            var previous_style = x.getAttribute('style');
            // console.log("Ini style:", previous_style);
            if (previous_style != null) { previous_style = previous_style.split(";").filter(p => !p.startsWith('fill:') && !p.startsWith('fill-opacity:') && !p.startsWith('stroke:') && !p.startsWith('stroke-width:')); } else { previous_style = []; }
            previous_style.push('fill:white');
            previous_style.push('fill-opacity:1');
            previous_style.push('stroke:#000');
            previous_style.push('stroke-width:1px');

            previous_style = previous_style.filter(x => (x != ""));
            // console.log("Result list:", previous_style);
            x.setAttribute('style', previous_style.join(';'));
        });
        all_continents[i].addEventListener("mouseover", continent_events_over);
        all_continents[i].addEventListener( "mouseout", continent_events_out);
    }



    // console.log("Result", result);
    // console.log("Layer", layer);
    // console.log("Layer-children", layer.children);
    // layer.setAttribute('style', 'pointer-events:all')




}, false);
