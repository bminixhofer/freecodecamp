const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const height = 600,
  width = 1400;

let y = d3.scaleLinear()
  .range([0, height]);
let x = d3.scaleLinear()
  .range([0, width]);
let chart = d3.select(".chart")
  .attr("height", height)
  .attr("width", width);
let tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return ``;
  });
chart.call(tip);

d3.json(dataSource, (err, data) => {
  if(err) throw err;

});
