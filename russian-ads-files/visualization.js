
data = russian_ads

var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
    formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }).join(""); };

var margin = {top: 30, right: 30, bottom: 30, left: 70},
    width = 550
    // width1 = 1050 - margin.left,
    // width2 = widthT - width1 - margin.right,
    height = 400


var data_dict = {"Ad Impressions": "ad_impressions",
                    "Ad Clicks": "ad_clicks",
                    "Ad Cost ($USD)": "ad_spend_usd",
                    "Ad Conversion Rate": 'conversation_rate',
                    "Ad Efficiency (Clicks)": 'efficiency_clicks',
                    "Ad Efficiency (Impressions": 'efficiency_impressions'}

console.log(Object.entries(data_dict))
var selectData = Object.entries(data_dict).map(x => {x[0]: 'text'});
console.log(selectData)

var selectData = [ { "text" : "Ad Impressions" },
                 { "text" : "Ad Clicks" },
                 { "text" : "Ad Cost ($USD)"},
                 { "text" : 'Ad Conversion Rate'}
               ]
console.log(selectData)

var viz_container = d3.select("#visualization-container")
var viz_details = d3.select("#visualization-details")
var xScaleLog = false
var yScaleLog = false

var xTitle, yTitle

function getLogTicks(data_type){

}

function getDomain(data_tag, scale_type="linear"){
    if (scale_type == "linear"){
        return [0, d3.max(data, function (d) { return d[data_tag] })]
    }
    if (scale_type == 'log'){
        return [1, 10 ** Math.ceil(Math.log10(d3.max(data,function (d) { return d[data_tag] })))]
    }
}


function applyScale(data_type, scale_type="linear", position="x", format="$", ticks=null) {
    
    // Very awful function.

    var scale_range, scale_map, chart_scale, chart_axis, chart_value;

    var data_tag = data_dict[data_type]

    chart_value = function(d) { return d[data_tag];}; // data -> value

    if (position == 'x'){
        scale_range = [0, width]
        xTitle = data_type
    }
    else if (position == 'y'){
        scale_range = [height, 0]
        yTitle = data_type
    }

    if (scale_type == 'linear'){
        chart_scale = d3.scaleLinear().range(scale_range).domain(getDomain(data_tag, 'linear'))
        scale_map = function(d) { return chart_scale(chart_value(d))}
    } 
    else if (scale_type == 'log'){
        chart_scale = d3.scaleLog().base(10).range(scale_range).domain(getDomain(data_tag, 'log'))
        scale_map = function(d) {return chart_scale(chart_value(d) + 1)}
    }

    if (position == 'x'){
        chart_axis = d3.axisBottom(chart_scale)
    }
    else if (position == 'y'){
        chart_axis = d3.axisLeft(chart_scale)
    }

    if (ticks != null){
        chart_axis = chart_axis.ticks(ticks)
    }
    else if (scale_type == 'log'){
        var tick_number = Math.floor(Math.log10(d3.max(data, chart_value)))
        console.log('tick_number', tick_number)
        chart_axis = chart_axis.ticks(tick_number)
    }

    if (format == '$'){
        chart_axis = chart_axis.tickFormat(function(d) { return "$" + d3.format(",.2f")(d);}).tickFormat(d3.format(","))
    }
    else if (format == ','){
        chart_axis = chart_axis.tickFormat(function(d) { return d3.format(',')(d)})
    }
    else {
    }

    return [chart_axis, scale_map, chart_scale, chart_value]
}

// console.log(xValue(d)); console.log(Math.log10(xValue(d) + 1)

// setup x 
// var xValue = function(d) { return d.ad_clicks;}, // data -> value
//     // xScale = d3.scaleLinear().range([0, width]), // value -> display
//     xScale= d3.scaleLog().base(10).range([0, width]),
//     xMap = function(d) {return xScale(xValue(d) + 1);}, // data -> display
//     // xAxis = d3.axisBottom(xScale).tickFormat(function(d) { return "10" + formatPower(Math.round(Math.log10(d))); });
//     xAxis = d3.axisBottom(xScale).tickFormat(d3.format(',')).ticks(Math.floor(Math.log10(d3.max(data, xValue))));
//     // tickFormat(function(d) { return "10" + formatPower(Math.round(Math.log10(d))); })
//     // xAxis.tickFormat(function(d) { return d });
//     xTitle = "Ad Clicks"

// // setup y
// var yValue = function(d) { return d.ad_spend_usd;}, // data -> value
//     yScale = d3.scaleLinear().range([height, 0]), // value -> display
//     yScale = d3.scaleLog().base(10).range([height, 0]), // value -> display
//     // yMap = function(d) { return yScale(yValue(d));}, // data -> display
//     yMap = function(d) {return yScale(yValue(d) + 1);}
//     yAxis = d3.axisLeft(yScale).tickFormat(function(d) { return "$" + d3.format(",.2f")(d);}).ticks(3)
//     // ticks(Math.ceil(Math.log10(d3.max(data, yValue))));
//     // .tickFormat(d3.format(","))
//     yTitle = "Ad Cost ($USD)"

    // console.log(Math.ceil(Math.log10(d3.max(data, yValue))))



  // don't want dots overlapping axis, so add in buffer to data domain
  // xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  // xScale.domain([d3.min(data, xValue) + 1, d3.max(data, xValue)]);
  // xScale.domain([1, 10 ** Math.ceil(Math.log10(d3.max(data, xValue)))])
  // xScale.domain([1, 1000000]);
  // yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);
  // yScale.domain([d3.min(data, yValue) + 1, d3.max(data, yValue)]);
  var [xAxis, xMap, xScale, xValue] = applyScale(data_type='Ad Cost ($USD)', scale_type="linear", position="x", format=',', ticks=null)
  var [yAxis, yMap, yScale, yValue] = applyScale(data_type='Ad Clicks', scale_type="linear", position="y", format='$', ticks=null)
  // var [yAxis, yMap] = applyScale('Ad Cost ($USD)', 'linear', 'y', '$')

// Prepare the barchart canvas
var svg = viz_container.append("svg")
    .attr("id", "main")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var scatter = svg
    // .attr("preserveAspectRatio","xMidYMid meet")
    // .attr("viewBox","0 0 1320 620")
    .classed("svg-content-responsive", true)
    // .style('display', 'none')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart_title = scatter.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("id", "title")
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("IRA Russian Ad Release, " + xTitle + " vs. " + yTitle);

// x-axis
scatter.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .attr("id", "xAxis")
  .call(xAxis)
.append("text")
  .attr("class", "label")
  .attr("id", "xAxisLabel")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text(xTitle);

// y-axis
scatter.append("g")
  .attr("class", "y axis")
  .attr("id", "yAxis")
  .call(yAxis)
.append("text")
  .attr("class", "label")
  .attr("id", "yAxisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text(yTitle);

// data entry
circles = scatter.selectAll(".dot")
  .data(data)
.enter().append("circle")
  .attr("class", "dot non-brushed")
  .attr("r", 2)
  .attr("cx", xMap)
  .attr("cy", yMap)

var i, len, axisPositions = ["x", "y"];
for (len = axisPositions.length, i=0; i<len; ++i) {
    (function(){
    var position = axisPositions[i]

    var _Button = viz_details.append('div')
        .attr('class', 'dropdown');
        _Button.append('button')
        .attr('class', 'btn btn-success dropdown-toggle big-text')
        .attr('id', position + 'Select')
        .attr('type', 'button')
        .attr('data-toggle', 'dropdown')
        .attr('aria-haspopup', 'true')
        .attr('aria-expanded', 'false')
        .text('Select ' + position.toUpperCase() + '-Axis Variable')
        .on('toggle', console.log('trigger'));
        _ButtonGroup = _Button.append('div')
            .attr('class', 'dropdown-menu')
            .attr('aria-labelledby', 'dropdownMenuButton');
        _ButtonGroup.selectAll('a')
        .data(selectData)
        .enter()
        .append('div')
        .attr('class', 'dropdown-item')
        // .attr('href', '#')
        .attr('value', function (d) { return d.text })
        .on('click', function (d) {changeAxis(d, position=position)})
        .text(function (d) { return d.text ;})
        viz_details.append('br')
    })();
    }

for (len = axisPositions.length, i=0; i<len; ++i) {
    (function(){
    var position = axisPositions[i]

    var _logButton = viz_details.append('button')
        .attr('class', 'btn btn-primary big-text')
        .attr('type', 'button')
        .attr('id', position + 'LogButton')
        .on('click', function() {changeLog(position=position)})
        .text('Log Scale (' + position.toUpperCase() + '-Axis)')
    })();
    }

var saveButton = viz_details.append('button')
    .attr('class', 'btn btn-primary big-text')
    .attr('type', 'button')
    .attr('id', 'saveButton')
    .text('Save Chart to File')


    saveButton.on('click', function(){
        var svgString = getSVGString(svg.node());
        svgString2Image(svgString, width, height, 'png', save); // passes Blob and filesize String to the callback

        function save( dataBlob, filesize ){
            saveAs(dataBlob, 'RussianAd_Scatter.png'); // FileSaver.js function
            }
    });

  function changeLog(position='x') {

    // Quite a confusing function...

    var targetScale
    console.log(position)

    if (position == 'x'){
        targetScale = !xScaleLog
        xScaleLog = targetScale
    }
    else if (position == 'y'){
        targetScale = !yScaleLog
        yScaleLog = targetScale
    }

    if (targetScale) {
        scale_type = 'log'
    }
    else {
        scale_type = 'linear'
    }

    value = d3.select('#' + position + 'AxisLabel').text()
    var [_Axis, _Map, _Scale, _Value] = applyScale(data_type=value, scale_type=scale_type, position=position, format=',', ticks=null)

    _Axis.scale(_Scale) // change the yScale
    d3.select('#' + position + 'Axis') // redraw the yAxis
      .transition().duration(1000)
      .call(_Axis)

    d3.selectAll('circle') // move the circles
      // .transition().duration(1000)
      // .delay(function (d,i) { return i/4})
        .attr('c' + position, _Map)

  }

  function changeAxis(element, position='x'){
    var value = element.text // get the new x value

    var [_Axis, _Map, _Scale, _Value] = applyScale(data_type=value, scale_type="log", position=position, format=',', ticks=null)

    _Axis.scale(_Scale) // change the yScale
    d3.select('#' + position + 'Axis') // redraw the yAxis
      .transition().duration(1000)
      .call(_Axis)
    d3.select('#' + position + 'AxisLabel') // change the yAxisLabel
      .text(value)

    d3.selectAll('circle') // move the circles
      // .transition().duration(1000)
      // .delay(function (d,i) { return i/4})
        .attr('c' + position, _Map)   
  
    if (position == 'x'){
      xTitle = value
    }
    if (position == 'y'){
      yTitle = value;
    }


    title = "IRA Russian Ad Release, " + $("#xSelect")[0].value + " vs. " + $("#ySelect")[0].value
    d3.select('#title') // change the yAxisLabel
      .text("IRA Russian Ad Release, " + xTitle + " vs. " + yTitle);


  }

    function isBrushed(brush_coords, cx, cy) {

         var x0 = brush_coords[0][0],
             x1 = brush_coords[1][0],
             y0 = brush_coords[0][1],
             y1 = brush_coords[1][1];

        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function highlightBrushedCircles() {

        if (d3.event.selection != null) {

            // revert circles to initial style
            circles.attr("class", "non_brushed");

            var brush_coords = d3.brushSelection(this);

            // style brushed circles
            circles.filter(function (){

                       var cx = d3.select(this).attr("cx"),
                           cy = d3.select(this).attr("cy");

                       return isBrushed(brush_coords, cx, cy);
                   })
                   .attr("class", "brushed");
        }
    }


    function displayTable() {

                var vals = [];

                // disregard brushes w/o selections  
                // ref: http://bl.ocks.org/mbostock/6232537
                if (!d3.event.selection) return;

                // programmed clearing of brush after mouse-up
                // ref: https://github.com/d3/d3-brush/issues/10
                d3.select(this).call(brush.move, null);

                var d_brushed =  d3.selectAll(".brushed").data();

                // populate table if one or more elements is brushed
                if (d_brushed.length > 0) {
                    d_brushed.forEach(d_row => vals.push(d_row['date_order_index']))
                    FJS.filter({'date_order_index.$in': vals})
                } else {
                }

                $('.nav-item a[href="#browse"]').tab('show')
                console.log(vals)
            }

    var brush = d3.brush()
                  .on("brush", highlightBrushedCircles)
                  .on("end", displayTable);

    scatter.append("g")
       .call(brush); 

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push( '#'+parentElement.id );
        for (var c = 0; c < parentElement.classList.length; c++)
                if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                    selectorTextArr.push( '.'+parentElement.classList[c] );

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if ( !contains('#'+id, selectorTextArr) )
                selectorTextArr.push( '#'+id );

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if ( !contains('.'+classes[c], selectorTextArr) )
                    selectorTextArr.push( '.'+classes[c] );
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];
            
            try {
                if(!s.cssRules) continue;
            } catch( e ) {
                    if(e.name !== 'SecurityError') throw e; // for Firefox
                    continue;
                }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                    extractedCSSText += cssRules[r].cssText;
            }
        }
        

        return extractedCSSText;

        function contains(str,arr) {
            return arr.indexOf( str ) === -1 ? false : true;
        }

    }

    function appendCSS( cssText, element ) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css"); 
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore( styleElement, refNode );
    }
}


function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
        context.clearRect ( 0, 0, width, height );
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob( function(blob) {
            var filesize = Math.round( blob.length/1024 ) + ' KB';
            if ( callback ) callback( blob, filesize );
        });

        
    };

    image.src = imgsrc;
}

// console.log(russian_ads)

// // Scales
// var x = d3.scale.ordinal().rangeRoundBands([0, width - 60], .1);
// var y = d3.scale.linear().range([height, 0]);

// var z = d3.scale.ordinal().range(["steelblue", "indianred"]);

// var brushYears = barchart.append("g")
// brushYears.append("text")
//     .attr("id", "brushYears")
//     .classed("yearText", true)
//     .text(brushYearStart + " - " + brushYearEnd)
//     .attr("x", 35)
//     .attr("y", 12);

// d3.csv("years_count.csv", function (error, post) {

//     // Coercion since CSV is untyped
//     post.forEach(function (d) {
//         d["frequency"] = +d["frequency"];
//         d["frequency_discontinued"] = +d["frequency_discontinued"];
//         d["year"] = d3.time.format("%Y").parse(d["year"]).getFullYear();
//     });

//     var freqs = d3.layout.stack()(["frequency", "frequency_discontinued"].map(function (type) {
//         return post.map(function (d) {
//             return {
//                 x: d["year"],
//                 y: +d[type]
//             };
//         });
//     }));

//     x.domain(freqs[0].map(function (d) {
//         return d.x;
//     }));
//     y.domain([0, d3.max(freqs[freqs.length - 1], function (d) {
//         return d.y0 + d.y;
//     })]);

//     // Axis variables for the bar chart
//     x_axis = d3.svg.axis().scale(x).tickValues([1850, 1855, 1860, 1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900]).orient("bottom");
//     y_axis = d3.svg.axis().scale(y).orient("right");

//     // x axis
//     barchart.append("g")
//         .attr("class", "x axis")
//         .style("fill", "#000")
//         .attr("transform", "translate(0," + height + ")")
//         .call(x_axis);

//     // y axis
//     barchart.append("g")
//         .attr("class", "y axis")
//         .style("fill", "#000")
//         .attr("transform", "translate(" + (width - 85) + ",0)")
//         .call(y_axis);

//     // Add a group for each cause.
//     var freq = barchart.selectAll("g.freq")
//         .data(freqs)
//       .enter().append("g")
//         .attr("class", "freq")
//         .style("fill", function (d, i) {
//             return z(i);
//         })
//         .style("stroke", "#CCE5E5");

//     // Add a rect for each date.
//     rect = freq.selectAll("rect")
//         .data(Object)
//       .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function (d) {
//             return x(d.x);
//         })
//         .attr("y", function (d) {
//             return y(d.y0) + y(d.y) - height;
//         })
//         .attr("height", function (d) {
//             return height - y(d.y);
//         })
//         .attr("width", x.rangeBand())
//         .attr("id", function (d) {
//             return d["year"];
//         });

//     // Draw the brush
//     brush = d3.svg.brush()
//         .x(x)
//         .on("brush", brushmove)
//         .on("brushend", brushend);

//     var arc = d3.svg.arc()
//       .outerRadius(height / 15)
//       .startAngle(0)
//       .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });

//     brushg = barchart.append("g")
//       .attr("class", "brush")
//       .call(brush);

//     brushg.selectAll(".resize").append("path")
//         .attr("transform", "translate(0," +  height / 2 + ")")
//         .attr("d", arc);

//     brushg.selectAll("rect")
//         .attr("height", height);

// });

// ****************************************
// Brush functions
// ****************************************

// function brushmove() {
//     y.domain(x.range()).range(x.domain());
//     b = brush.extent();

//     var localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
//         localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.ceil(y(b[1]));

//     // Snap to rect edge
//     d3.select("g.brush").call((brush.empty()) ? brush.clear() : brush.extent([y.invert(localBrushYearStart), y.invert(localBrushYearEnd)]));

//     // Fade all years in the histogram not within the brush
//     d3.selectAll("rect.bar").style("opacity", function(d, i) {
//       return d.x >= localBrushYearStart && d.x < localBrushYearEnd || brush.empty() ? "1" : ".4";
//     });
// }

// function brushend() {

//   var localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
//       localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.floor(y(b[1]));

//     d3.selectAll("rect.bar").style("opacity", function(d, i) {
//       return d.x >= localBrushYearStart && d.x <= localBrushYearEnd || brush.empty() ? "1" : ".4";
//     });

//   // Additional calculations happen here...
//   // filterPoints();
//   // colorPoints();
//   // styleOpacity();

//   // Update start and end years in upper right-hand corner of the map
//   d3.select("#brushYears").text(localBrushYearStart == localBrushYearEnd ? localBrushYearStart : localBrushYearStart + " - " + localBrushYearEnd);

// }

// function resetBrush() {
//   brush
//     .clear()
//     .event(d3.select(".brush"));
// }