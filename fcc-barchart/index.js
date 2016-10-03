const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const height = 600,
  width = 1400;

var parseTime = d3.timeParse('%Y-%m-%d');
var y = d3.scaleLinear()
  .range([height, 0]);
var x = d3.scaleTime();
var chart = d3.select(".chart")
    .attr("height", height)
    .attr("width", width);

d3.json(dataSource, (err, json) => {
  if(err) throw err;

  document.querySelector(".title").textContent = json.name;
  document.querySelector(".description").textContent = json.description;
  let data = json.data;
  x.range([0, width / data.length])
    .domain(data.map(d => parseTime(d[0])));
  y.domain([0, d3.max(data, d => d[1])]);
  let yAxis = d3.axisLeft()
    .scale(y)
    .tickSizeInner(-width)
    .tickSizeOuter(0);
  let xAxis = d3.axisBottom()
    .scale(x)
    .tickSizeInner(-height)
    .tickSizeOuter(0);

  chart.append("g")
    .call(yAxis)
    .selectAll(".tick")
    .each(function(d) {
      if ( d === 0 ) {
        this.remove();
      }
    });
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  var bar = chart.append("g").selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", (d, i) => `translate(${x(parseTime(d[0]))}, 0)`);

  bar.append("rect")
    .attr("transform", (d, i) => `translate(0, ${y(d[1])})`)
    .attr("width", Math.ceil(width / data.length))
    .attr("height", (d, i) => height - y(d[1]));
});
