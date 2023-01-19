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

    // Colors for different percentages
    let colors = ["#ddf9ff", "#94dbf5", "#3cbaf2", "#0097ee", "#0071e6", "#0047d4", "#0000b3"];

    function applyColor(value) {
        if (value >= 0 && value < 12) {
            return colors[0]
        } else if (value >= 12 && value < 21) {
            return colors[1]
        } else if (value >= 21 && value < 30) {
            return colors[2]
        } else if (value >= 30 && value < 39) {
            return colors[3]
        } else if (value >= 39 && value < 48) {
            return colors[4]
        } else if (value >= 48 && value < 57) {
            return colors[5]
        } else if (value >= 57) {
            return colors[6]
        }
    }

    // TOOLTIPS
    tooltip = d3.select("#holder")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0)

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it.
    let mouseover = function (e, d) {
        tooltip
            .style("opacity", 0.9)
        tooltip
            .html(`${d.area_name}, ${d.state}: ${d.bachelorsOrHigher}%`)
            .style("left", (d3.pointer(e, path)[0]) + "px")
            .style("top", (d3.pointer(e, path)[1]) + "px")
            .attr("data-education", `${d.bachelorsOrHigher}`)
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 2)
    }

    let mouseleave = function (e, d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
    }

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
        .style("stroke", "none")
        .data(organizedData02)
        .attr("data-education", (d) => d.bachelorsOrHigher)
        .attr("fill", (d) => applyColor(Math.round(d.bachelorsOrHigher)))
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    // X Axis for legend
    let valuesArray = [0.03, 0.12, 0.21, 0.30, 0.39, 0.48, 0.57, 0.66];

    let xLegendScale = d3.scaleLinear()
        .domain([0.03, 0.66])
        .range([0, 200])

    let xLegendAxis = d3.axisBottom(xLegendScale)
        .ticks(8)
        .tickFormat(d3.format(".0%"))
        .tickValues(valuesArray)
        .tickSize(15)

    // Create G for legend
    let legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${w / 2 + 180},${50})`)

    // Append rects on the legend
    let rectsArray = [...valuesArray];
    rectsArray.pop();

    legend.selectAll("rect")
        .data(rectsArray)
        .enter()
        .append("rect")
        .attr("x", (d) => xLegendScale(d + 0.002))
        .attr("y", 0)
        .attr("width", 200 / 7)
        .attr("height", 10)
        .style("z-index", -1)
        .attr("fill", (d) => applyColor((d * 100).toFixed(1)))

    // Append axis on legend
    legend.append("g")
        .attr("id", "x-legend-axis")
        .attr("transform", `translate(${0},${0})`)
        .call(xLegendAxis)
        .call(g => g.select(".domain").remove())

})