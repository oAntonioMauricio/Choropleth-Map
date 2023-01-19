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

Promise.all([
    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'),
    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
]).then(function ([data01, data02]) {

    console.log(data01)
    console.log(data02)

    // Draw the map
    svg.append("g")
        .attr("class", "myG")
        .attr("transform", `translate(${padding * 3},${0})`)
        .selectAll("path")
        .data(topojson.feature(data01, data01.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "county")
        .attr("data-fips", (d) => d.id)
        .attr("fill", "grey")
        .style("stroke", "none")

})