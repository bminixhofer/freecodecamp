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
});
