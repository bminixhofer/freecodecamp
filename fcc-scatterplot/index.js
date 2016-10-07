const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const height = 600,
  width = 1400,
  textMargin = 3,
  heightMargin = -1,
  pointSize = 10;

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
    return `
      ${d.Name} - ${d.Nationality}<br/>
      <strong>Year: </strong>${d.Year}<br/>
      <strong>Time: </strong>${d.Time}<br/>
    `;
  });
chart.call(tip);
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

  chart.append("text")
    .attr("x", width - 210)
    .attr("y", height - 10)
    .text("Minutes Behind Fastest Time");

  chart.append("text")
    .attr("x", -60)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .text("Ranking");

  let legend = chart.append("g")
    .attr("transform", `translate(${width - 200}, ${height / 2})`);

  addLegendPart(legend.append("g"), "black", "No doping allegations");
  addLegendPart(legend.append("g")
    .attr("transform", "translate(0, 30)"),
    "red", "Riders with doping allegations");

  let bar = chart.append("g").selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", (d, i) => `translate(${width - x(d.Seconds)}, ${y(d.Place) - pointSize})`);

  bar.append('rect')
    .attr("fill", (d, i) => d.Doping.length > 0 ? "red" : "black")
    .attr("width", pointSize)
    .attr("height", pointSize)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
  bar.append('text')
    .text(d => d.Name)
    .attr("x", pointSize + textMargin)
    .attr("y", pointSize + heightMargin)
    .attr("font-size", pointSize);
});

function addLegendPart(group, color, text, offset) {
  let _pointSize = pointSize * 1.5;
  group.append("rect")
    .attr("fill", color)
    .attr("width", _pointSize)
    .attr("height", _pointSize);
  group.append("text")
    .text(text)
    .attr("x", _pointSize + textMargin)
    .attr("y", _pointSize + heightMargin);
}
