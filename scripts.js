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

    // Let's get all the ids in data01
    idsArray = [];

    for (let x = 0; x < data01.objects.counties.geometries.length; x++) {
        idsArray.push(data01.objects.counties.geometries[x].id)
    }

    // Let's order the ids at data02 to match the counties order at data01
    organizedData02 = [];

    for (let x = 0; x < idsArray.length; x++) {
        for (let y = 0; y < data02.length; y++) {
            if (idsArray[x] === data02[y].fips) {
                organizedData02.push(data02[y])
            }
        }
    }

    console.log(idsArray)
    console.log(organizedData02)

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
        .data(organizedData02)
        .attr("data-education", (d) => d.bachelorsOrHigher)


})