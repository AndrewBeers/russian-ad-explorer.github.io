
data = russian_ads

var margin = {top: 30, right: 30, bottom: 30, left: 70},
    width = 550
    // width1 = 1050 - margin.left,
    // width2 = widthT - width1 - margin.right,
    height = 400


var data_dict = {"Ad Impressions": "ad_impressions",
                    "Ad Clicks": "ad_clicks",
                    "Ad Cost ($USD)": "ad_spend_usd",
                    "Ad Conversion Rate": 'conversation_rate'}
var selectData = [ { "text" : "Ad Impressions" },
                 { "text" : "Ad Clicks" },
                 { "text" : "Ad Cost ($USD)" },
               ]

var viz_container = d3.select("#visualization-container")
var viz_details = d3.select("#visualization-details")

// setup x 
var xValue = function(d) { return d.ad_clicks;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale)

// setup y
var yValue = function(d) { return d.ad_spend_usd;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale).tickFormat(function(d) { return "$" + d3.format(",.2f")(d);}).tickFormat(d3.format(","))

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);


// Prepare the barchart canvas
var scatter = viz_container.append("svg")
    .attr("id", "main")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .attr("preserveAspectRatio","xMidYMid meet")
    // .attr("viewBox","0 0 1320 620")
    .classed("svg-content-responsive", true)
    // .style('display', 'none')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

scatter.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("id", "title")
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Ad Clicks vs. Ad Cost (USD)");

    // Select X-axis Variable
var span = viz_details.append('span')
    .text('Select X-Axis variable: ')
    var yInput = viz_details.append('select')
      .attr('id','xSelect')
      .on('change',xChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
    viz_details.append('br')

    // Select Y-axis Variable
var span = viz_details.append('span')
      .text('Select Y-Axis variable: ')
    var yInput = viz_details.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
    viz_details.append('br')

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
      .text("Ad Cost (USD)");

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
      .text("Ad Impressions");

  circles = scatter.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot non-brushed")
      .attr("r", 2)
      .attr("cx", xMap)
      .attr("cy", yMap)

  function yChange() {
    var value = this.value // get the new y value
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[data_dict[value]] })]),
        d3.max([0,d3.max(data,function (d) { return d[data_dict[value]] })])
        ])
    yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)

    title = "IRA Russian Ad Release, " + $("#xSelect")[0].value + " vs. " + $("#ySelect")[0].value
    d3.select('#title') // change the yAxisLabel
      .text(title)

    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i/4})
        .attr('cy',function (d) { return yScale(d[data_dict[value]]) })
  }

  function xChange() {
    var value = this.value // get the new x value
    xScale // change the xScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[data_dict[value]] })]),
        d3.max([0,d3.max(data,function (d) { return d[data_dict[value]] })])
        ])
    xAxis.scale(xScale) // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition().duration(1000)
      .call(xAxis)
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition().duration(1000)
      .text(value)

    title = "IRA Russian Ad Release, " + $("#xSelect")[0].value + " vs. " + $("#ySelect")[0].value
    d3.select('#title') // change the yAxisLabel
      .text(title)

    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i/4})
        .attr('cx',function (d) { return xScale(d[data_dict[value]]) })
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

                console.log(vals)
            }

    var brush = d3.brush()
                  .on("brush", highlightBrushedCircles)
                   .on("end", displayTable);

    scatter.append("g")
       .call(brush); 

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