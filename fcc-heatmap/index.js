const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const height = 600,
  barHeight = 50,
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

let color = d3.scaleSequential(d3.interpolateSpectral);
let y = d3.scaleLinear()
  .range([0, height])
  .domain([1, 13]);
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
    this.childNodes[1].setAttribute("transform", `translate(0, ${barHeight / 2})`);
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
  color.domain(d3.extent(data, d => d.variance).reverse());
  x.domain(d3.extent(data, d => d.year));
  xAxis.scale(x);
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  let bar = chart.append("g").selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", (d, i) => `translate(${x(d.year)}, ${y(d.month)})`);

  bar.append("rect")
    .attr("height", barHeight)
    .attr("width", Math.ceil(width / (data.length / 12)))
    .attr("fill", (d, i) => color(d.variance));
});
