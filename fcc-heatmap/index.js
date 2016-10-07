const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const height = 650,
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

let chart = d3.select(".chart")
  .attr("height", height)
  .attr("width", width);

let gradient = chart.append("defs").append("linearGradient")
  .attr("id", "linear-gradient")	  
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");  

for(let i = 0; i < 1; i += 0.1) {
  gradient.append("stop")
  .attr("offset", `${i * 100}%`)   
  .attr("stop-color", d3.interpolateSpectral(1 - i));
}

let legend = chart.append("g")
  .attr("transform", `translate(${width - 400}, ${height - 60})`);
legend.append("rect")
  .attr("width", 300)
  .attr("height", 20)
  .style("fill", "url(#linear-gradient)");


let color = d3.scaleSequential(d3.interpolateSpectral);
let y = d3.scaleLinear()
  .range([0, height - 100])
  .domain([1, 13]);
let x = d3.scaleLinear()
  .range([0, width - 50]);

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

  let variance = data.map(d => d.variance);
  color.domain(d3.extent(variance).reverse());
  x.domain(d3.extent(data, d => d.year));
  xAxis.scale(x);

  for(let i = 0; i <= 1; i += 0.2) {
    legend.append("text")
      .text(variance[Math.floor((variance.length - 1) * i)])
      .attr("transform", `translate(${270 * i}, 35)`)
      .attr("font-size", "12px");
  }
   
  chart.append("g")
    .attr("transform", `translate(0, ${height - 96})`)
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
