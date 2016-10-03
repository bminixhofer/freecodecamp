const dataSource = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
const width = window.innerWidth,
  height = window.innerHeight;

const drag = {
  start: d => {
    if (!d3.event.active) simulation.alphaTarget(0.2).restart();
    d.fx = d.x;
    d.fy = d.y;
  },
  active: d => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  },
  end: d => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
};

let svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

svg.append("text")
  .attr("transform", `translate(${width / 2}, 50)`)
  .text("Force Directed Graph of State Contiguity");

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id((d, i) => i))
    .force("charge", d3.forceManyBody().distanceMax(120).distanceMin(20))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json(dataSource, (err, json) => {
  let node = d3.select(".flags")
    .selectAll("img")
    .data(json.nodes)
    .enter().append("img")
      .attr("class", (d, i) => `flag flag-${d.code}`)
      .call(d3.drag()
        .on("start", drag.start)
        .on("drag", drag.active)
        .on("end", drag.end));

  let link = svg.append("g")
    .selectAll("line")
    .data(json.links)
    .enter().append("line")
    .attr("stroke-width", 2);

  simulation.nodes(json.nodes).on("tick", tick);
  simulation.force("link").links(json.links);

  function tick() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node
      .style("transform", "translate(-8px, -5px)")
      .style("top", (d, i) => `${d.y}px`)
      .style("left", (d, i) => `${d.x}px`);
  }
});
