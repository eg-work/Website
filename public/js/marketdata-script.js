'use strict';
/*jslint node: true */
/*jshint esversion: 6 */
/*jshint browser: true */
/*globals $:false */




// *** FILL ALL MENUS *** //
function populate_dropdown_menu(menu_element, ls) {
    for (var i=0; i<ls.length; i++) {
        
        var a_element = document.createElement("a");
        a_element.setAttribute("href", "#");
        
        var text_link = document.createTextNode(ls[i]);
        a_element.appendChild(text_link);
        
        menu_element.append(a_element);
    }
}

// Populate asset type list
var asset_type = $( '#assettype-selector > .dropdown-content' );
var asset_type_list = ['Indices', "Forex (doesn't work)'", "Commodities (doesn't work)"];
populate_dropdown_menu(asset_type, asset_type_list);

// Populate dates list
var date = $( '#date-selector > .dropdown-content' );
var dates_list = ["01-05-19", "03-05-19", "09-05-19", "12-05-19", "15-05-19", "16-05-19"];
populate_dropdown_menu(date, dates_list);

// Populate index names
var index = $( '#indexname-selector > .dropdown-content' );
var index_names = ["Wall Street", "China 300", "FTSE100", "Germany 30"];
populate_dropdown_menu(index, index_names);



// ***     MARKET DATA GET METHODS      *** //
var normal_headers = ['Asset type', 'Index name', 'Date'];
var all_options = $( '.dropdown-content > a' );
all_options.on("click", function(event) {
    // console.log(event.target.parentNode.parentNode);
    // console.log(event.target.text);

    var text_selected = event.target.text;
    var button_tochange = $( event.target.parentNode.parentNode ).find("button");
    button_tochange.text( text_selected );




    var current_options = buttons_list.map( x => x.text() );
    // console.log("Current options", current_options);
    var accum_truth = 0;
    for (var i=0; i<normal_headers.length; i++) {
        if (normal_headers[i] != current_options[i]) accum_truth++;
    }
    if (accum_truth == 3) {
        console.log("Changing picture!");
        // var input_data = { 'assettype': current_options[0], 'indexname': current_options[1], 'date': current_options[2] };
        current_options = current_options.map(x => x.replace(" ",""));
        var input_string = ['assettype=' + current_options[0], 'indexname=' + current_options[1], 'date=' + current_options[2]];
        input_string = input_string.join("?");
        // console.log(input_string);

        


        $.get('/MarketData/' + input_string, function(data, status) {
            var ps = JSON.parse(data);
            // console.log("PS", ps);


            var xx_list = []; var yy_list = []; var tt_list = [];
            for (var i=0; i<ps.length; i++) {   
                xx_list.push(i);
                yy_list.push(Number(ps[i].price));
                tt_list.push(ps[i].date);
            }
 
            var t = { x: xx_list, y: yy_list, type: 'scatter', text: tt_list, name: 'Prices' };
            Plotly.newPlot(graph, [t], { 'showlegend': true, 'title': { text: current_options[1] + "  |||  " + current_options[2], } });

        });
    }


});








var assettype_button = $( '#assettype-selector > .dropbtn' );
var indexname_button = $( '#indexname-selector > .dropbtn' );
var date_button = $( '#date-selector > .dropbtn' );

console.log("ast", assettype_button);
console.log("index", indexname_button);
console.log("date", date_button);

// date_button.on('DOMSubtreeModified', function(event) {
//     console.log("change", event.currentTarget.innerText);
// });


var buttons_list = [assettype_button, indexname_button, date_button];
// console.log(buttons_list);
// buttons_list.forEach(function(btn) {
//     btn.on('DOMSubtreeModified', function(event) {
//         var text_list = 
//     });
// });



/* PLOTLY GRAPH */
// var graph = $( '#plotly-graph' );
var graph = document.getElementById( 'plotly-changer' );
console.log("g",graph);







































// var pngdata = $('#png-data');
// console.log(pngdata)
// pngdata.hover(function(ev) {
//     console.log(ev)
//     var bg = ev.currentTarget
//     console.log(bg)
//     var styles = $(ev.currentTarget).css('background-color')

//     console.log("styles", styles)
//     $(ev.currentTarget).css('background-color', 'red')

// },
// function(ev1) {
//     console.log(ev1)

//     $( this ).css('background-color', 'rgb(47, 79, 79)')
// })


// $('#png-data > button').css('display', 'none');


// var png_count = 0;
// $('#png-data').on( 'transitionend webkitTransitionEnd oTransitionEnd', function(ev) {
//     if ((ev.originalEvent.elapsedTime == 2) && (png_count == 0)) {
//         console.log("Forwards");
//         png_count++;
//     } else if ((ev.originalEvent.elapsedTime != 2)) {
//         // console.log(ev)
//         console.log("PNG count changed:", png_count);
//         png_count = 0;
//     }
    
//     // else if (ev.originalEvent.elapsedTime == 0.5) {
//     //     console.log("Backwards")
//     //     png_count = 0;
//     // }
// });



// var plotlydata = $('#plotly-data')
// console.log("plotly data", plotlydata)
// $('#plotly-data').on( 'transitionend webkitTransitionEnd oTransitionEnd', function(ev) {
//     console.log("Transition happened:", ev)
//     // console.log($('#information-button > a'))
//     // $('#information-button > a')[0].click(function() {
//     //     console.log("clicked link")
//     // })
// })