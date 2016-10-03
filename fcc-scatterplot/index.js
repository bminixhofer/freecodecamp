const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const height = 600,
  width = 1400,
  textMargin = 3;
  heightMargin = -1,
  pointSize = 10;

let y = d3.scaleLinear()
  .range([0, height]);
let x = d3.scaleLinear()
  .range([0, width]);
let chart = d3.select(".chart")
  .attr("height", height)
  .attr("width", width);

d3.json(dataSource, (err, data) => {
  if(err) throw err;

  y.domain([0, d3.max(data, d => d.Place)]);
  x.domain(d3.extent(data, d => d.Seconds));
  let yAxis = d3.axisLeft().scale(y);
  let xAxis = d3.axisBottom().scale(x);
  let max = d3.max(data, d => d.Seconds);
  chart.append("g")
    .call(yAxis);
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll(".tick")
    .each(function(d) {
      let val = max - d;
      this.childNodes[1].textContent = `${Math.floor(val/60)}:${val % 60}`;
    });

  let bar = chart.append("g").selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", (d, i) => `translate(${width - x(d.Seconds)}, ${y(d.Place) - pointSize})`);

  bar.append('rect')
    .attr("width", pointSize)
    .attr("height", pointSize);
  bar.append('text')
    .text(d => d.Name)
    .attr("x", pointSize + textMargin)
    .attr("y", pointSize + heightMargin)
    .attr("font-family", "sans-serif")
    .attr("font-size", `${pointSize}px`);
});
