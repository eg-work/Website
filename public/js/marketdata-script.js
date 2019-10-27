'use strict';
/*jslint node: true */
/*jshint esversion: 6 */
/*jshint browser: true */
/*globals $:false */




// *** FILL ALL MENUS *** //
function populate_dropdown_menu(menu_element, ls) {

  var constlength = menu_element[0].children.length;
  for (var i=0; i<constlength; i++)
  {
    menu_element[0].removeChild(menu_element[0].children[0]);
  }

  for (var i=0; i<ls.length; i++) {

      var a_element = document.createElement("a");
      a_element.setAttribute("href", "#");

      var text_link = document.createTextNode(ls[i]);
      a_element.appendChild(text_link);

      menu_element.append(a_element);
  }
}


// pull names from server
function get_fromserver( option ) {
  return new Promise(function(resolve, reject) {

    var urlpath = '/Names/';
    // console.log("urlpath:", urlpath);

    $.ajax({
      dataType: 'json',
      type: 'POST',
      url: urlpath,
      data: option,
      success: function(xs) {
        // console.log("data returned:", xs.names);
        resolve(xs.names);
      }
    });

  });
}



// Populate asset type list
var asset_type = $( '#assettype-selector > .dropdown-content' );
get_fromserver( { assetname:'all' } ).
then(function( asset_names_list ) {
  populate_dropdown_menu(asset_type, asset_names_list);


  var asset_box = $( '#assettype-selector' )[0];
  var dropdown  = Array.prototype.slice.call(asset_box.children[1].children);
  // console.log("dropdown", dropdown);

  // add event listeners for drop down
  dropdown.forEach(function(ele) {
    ele.addEventListener('click', dropdownmenu_callback);
  });

});

function dropdownmenu_callback(ele) {
  console.log('callback element:', ele);
  var name  = ele.target.innerText;
  var idtag = ele.target.parentElement.parentElement.id;

  // sort asset names
  if (idtag.startsWith('asset')) {
    $('#assettype-selector > button').text(name);
    if (!$('#indexname-selector > button').text().startsWith('Choose')) $('#indexname-selector > button').text('Choose an index');
    // if (!$('#date-selector > button').text().startsWith('Choose')) $('#date-selector > button').text('Choose a day to view');
    if (!$('#date-selector > button').text().startsWith('Choose')) $('#date-selector > button')[0].innerText = 'Choose a day to view';


    get_fromserver( { assetname: name, indexname: 'all' } )
    .then(function(index_names_list) {
      // console.log('index names:', index_names_list);

      var indexbox = $( '#indexname-selector > .dropdown-content' );
      populate_dropdown_menu( indexbox, index_names_list );

      // console.log('index box:', indexbox);
      var temparr = Array.prototype.slice.call(indexbox[0].children);
      // console.log('temp array:', temparr);
      temparr.forEach(function(indexelement) {
        // console.log(indexelement);
        indexelement.addEventListener('click', dropdownmenu_callback);
      });
    });
  }

  // sort index names
  if (idtag.startsWith('index')) {
    // $('#assettype-selector > button').text(name);
    $('#indexname-selector > button').text(name);
    // if (!$('#date-selector > button').text().startsWith('Choose')) $('#date-selector > button').text('Choose a day to view');
    if (!$('#date-selector > button').text().startsWith('Choose')) $('#date-selector > button')[0].innerText = 'Choose a day to view';


    var assetname = $('#assettype-selector > button').text();
    get_fromserver( { assetname: assetname, indexname: name, datename: 'all' } )
    .then(function(date_names_list) {
      // console.log('date names:', date_names_list);

      var datebox = $( '#date-selector > .dropdown-content' );
      populate_dropdown_menu( datebox, date_names_list );

      // console.log('date box:', datebox);
      Array.prototype.slice.call(datebox[0].children).forEach(function(dateelement) {
        dateelement.addEventListener('click', dropdownmenu_callback);
      });
    });
  }

  // sort dates
  if (idtag.startsWith('date')) {
    $('#date-selector > button')[0].innerText = name;
  }
}


//   dropdown.forEach(function(ele) {
//     ele.addEventListener('click', function(e) {
//       console.log('e:', e);
//       e.target.parentElement.parentElement.children[0].innerText = e.target.innerText;
//
//       var name = e.target.innerText;
//       get_fromserver( { assetname: name, indexname: 'all' } )
//       .then(function(index_names_list) {
//         console.log("indexes gathered:", index_names_list);
//
//         var indexbox = $( '#indexname-selector > .dropdown-content' );
//         populate_dropdown_menu(indexbox, index_names_list);
//
//
//
//         var index_box = $( '#indexname-selector' )[0];
//         console.log(index_box);
//         var dropdown = Array.prototype.slice.call(index_box.children[1].children);
//         dropdown.forEach(function(ele) {
//
//           ele.addEventListener('click', function(e) {
//             e.target.parentElement.parentElement.children[0].innerText = e.target.innerText;
//
//             var indexname = e.target.innerText;
//             get_fromserver( { assetname: name, indexname: indexname, datename: 'all' } )
//             .then(function(date_names_list){
//               var datebox = $( '#date-selector > .dropdown-content' );
//               populate_dropdown_menu( datebox, date_names_list);
//
//
//
//               var date_box = $( '#date-selector' )[0];
//               var dropdown = Array.prototype.slice.call(date_box.children[1].children);
//               console.log(dropdown);
//               dropdown.forEach(function(ele) {
//                 ele.addEventListener('click', function(e) {
//                   console.log(e);
//                   e.target.parentElement.parentElement.children[0].innerText = e.target.innerText;
//
//                 });
//               });
//
//
//
//             });
//
//
//           });
//         });
//
//       });
//
//
//     });
//   });
//
// });




var menu_options = { asset: null, index: null, date: null };
var menu_observer = new MutationObserver(function(mutations) {
  // console.log('\n\n\n\n');
  // console.log(mutations);
  mutations.forEach(function(mutation) {
    // console.log("\nmutation:",mutation);
    var txt    = mutation.target.innerText;
    var column = mutation.target.parentElement.id;
    // console.log("column text:", column, typeof column);

    menu_options.index = $('#indexname-selector > button')[0].innerText;
    menu_options.asset = $('#assettype-selector > button')[0].innerText;
    menu_options.date  = $('#date-selector > button')[0].innerText;


    // console.log('menu_options:', menu_options);
    if (menu_options.asset != null && menu_options.index != null && menu_options.date != null &&
       !menu_options.asset.startsWith('Choose') && !menu_options.index.startsWith('Choose') && !menu_options.date.startsWith('Choose'))
    {
      // change data
      // console.log("CHANGE DATA!!!");

      var dataurl = '/Data/';
      $.ajax({
        dataType: 'json',
        type: 'POST',
        url: dataurl,
        data: { asset: menu_options.asset, indice: menu_options.index, date: menu_options.date },
        success: function( data ) {
          // console.log( 'data recieved:', data );
          var prices = data.valuelist.map(x => x[1]);
          var xxindexes = prices.map((x,i) => i);
          var textlist = data.valuelist.map(x => x[0]);
          // console.log('prices', prices);
          // console.log('xxindexes', xxindexes);


          var trace = { x: xxindexes, y: prices, mode: 'lines',
                      line: { width: 2, color: 'blue' },
                      opacity: 0.5,
                      name: 'Prices',
                      text: textlist };
          var traces = [trace];

          var layout = { 'showlegend': true,
                         'title': { text: menu_options.index + ', ' + menu_options.date,
                                    font: { family: 'Roboto Slab', size: 24, color: 'black' } },
                         'xaxis': { tickfont: { family: 'Roboto Slab', size: 18 } },
                         'yaxis': { tickfont: { family: 'Roboto Slab', size: 18 } },
                         'width': 1180,
                         'height': 800
                        };

          Plotly.newPlot( 'plotly-changer', traces, layout );
        }
      });


    }

  });
});

var config = { characterData: true, attributes: true, subtree: true, childList: true };
var menu_buttons = Array.prototype.slice.call(document.getElementsByClassName("dropbtn"));
// console.log("mb:", menu_buttons);
var date_buttons = Array.prototype.slice.call($('#date-selector > button'));
console.log("date buttons ->", date_buttons);
date_buttons.forEach(function(ele) {
  menu_observer.observe(ele, config);
});






// ***     MARKET DATA GET METHODS      *** //
var normal_headers = ['Asset type', 'Index name', 'Date'];
var all_options = $( '.dropdown-content > a' );
all_options.on("click", function(event) {
    // console.log(event.target.parentNode.parentNode);
    // console.log(event.target.text);

    // var text_selected = event.target.text;
    // var button_tochange = $( event.target.parentNode.parentNode ).find("button");
    // button_tochange.text( text_selected );
//
//
//
//
//     var current_options = buttons_list.map( x => x.text() );
//     // console.log("Current options", current_options);
//     var accum_truth = 0;
//     for (var i=0; i<normal_headers.length; i++) {
//         if (normal_headers[i] != current_options[i]) accum_truth++;
//     }
//     if (accum_truth == 3) {
//         console.log("Changing picture!");
//         // var input_data = { 'assettype': current_options[0], 'indexname': current_options[1], 'date': current_options[2] };
//         current_options = current_options.map(x => x.replace(" ",""));
//         var input_string = ['assettype=' + current_options[0], 'indexname=' + current_options[1], 'date=' + current_options[2]];
//         input_string = input_string.join("?");
//         // console.log(input_string);
//
//
//
//
//         $.get('/MarketData/' + input_string, function(data, status) {
//             var ps = JSON.parse(data);
//             // console.log("PS", ps);
//
//
//             var xx_list = []; var yy_list = []; var tt_list = [];
//             for (var i=0; i<ps.length; i++) {
//                 xx_list.push(i);
//                 yy_list.push(Number(ps[i].price));
//                 tt_list.push(ps[i].date);
//             }
//
//             var t = { x: xx_list, y: yy_list, type: 'scatter', text: tt_list, name: 'Prices' };
//             Plotly.newPlot(graph, [t], { 'showlegend': true, 'title': { text: current_options[1] + "  |||  " + current_options[2], } });
//
//         });
//     }
//
//
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
