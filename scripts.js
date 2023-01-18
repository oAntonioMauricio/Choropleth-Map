const w = 1300;
const h = 600;
const padding = 70;
const paddingBottom = 100;

// CREATE SVG
const svg = d3.select("#holder")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

/*
// Map and projection
var projection = d3.geoMercator()
    .center([2, 47])                // GPS of location to zoom on
    .scale(50)                       // This is like the zoom
    .translate([w / 2, h / 2])
*/

// GEO PATH
let path = d3.geoPath();

//GET JSON DATA
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json", function (data) {

    console.log(data)
    console.log(data.objects.counties)

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.counties).features)
        .enter()
        .append("path")
        .attr("fill", "grey")
        .attr("d", path)
        .attr("class", "county")
        .style("stroke", "none")

})

/*

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function (data) {

    // Filter data
    let dataFrance = data.features.filter(function(d){return d.properties.name=="France"})

    console.log(data)
    console.log(dataFrance)

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(dataFrance)
        .enter()
        .append("path")
        .attr("fill", "grey")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "none")
})

*/