const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const height = 600,
  width = 1400;
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

let y = d3.scaleLinear()
  .range([0, height])
  .domain([1, 12]);
let x = d3.scaleLinear()
  .range([0, width]);

let chart = d3.select(".chart")
  .attr("height", height)
  .attr("width", width);

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft()
  .scale(y);
chart.append("g")
  .call(yAxis)
  .selectAll(".tick")
  .each(function(d) {
    this.childNodes[1].textContent = months[d - 1];
  });

let tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return ``;
  });
chart.call(tip);

d3.json(dataSource, (err, json) => {
  if(err) throw err;

  let data = json.monthlyVariance;
  x.domain(d3.extent(data, d => d.year));
  xAxis.scale(x);
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
});
