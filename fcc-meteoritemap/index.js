const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json ";
const height = 882,
  width = 1697;

const mapOffset = [-20, 0];

var color = d3.scaleOrdinal(d3.schemeCategory10)
  .domain([0, 10]);
let size = d3.scaleLog()
  .range([1, 12]);

let chart = d3.select(".chart")
  .attr("height", height)
  .attr("width", width);

let tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    let props = d.properties;
    let date = new Date(props.year);
    return `
      <strong>Name: </strong> ${props.name}<br />
      <strong>Year: </strong> ${date.getFullYear()}<br />
      <strong>Mass: </strong> ${Math.floor(props.mass)}<br />
    `;
  });
chart.call(tip);

let projection = d3.geoMercator()
  .translate([width / 2, height / 2])
  .scale(300);

d3.json(dataSource, (err, json) => {
  if(err) throw err;

  let data = json.features.filter(d => d.geometry);
  size.domain(d3.extent(data, d => {
    return Number(d.properties.mass) || 1;
  }));
  chart.append("g").selectAll("circle")
    .data(data)
    .enter().append("circle")
    .style("stroke", "black")
    .attr("fill", () => color(Math.random() * 10))
    .attr("fill-opacity", 0.8)
    .attr("r", d => {
      return size(d.properties.mass || 0.1);
    })
    .attr("transform", d => {
      let coord = projection([d.geometry.coordinates[0] + mapOffset[0], d.geometry.coordinates[1] + mapOffset[1]]);
      return `translate(${coord[0]}, ${coord[1]})`;
    })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);
});
