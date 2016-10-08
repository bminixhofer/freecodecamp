const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
const height = window.innerHeight,
  width = window.innerWidth;

let chart = d3.select(".chart")
  .attr("height", height)
  .attr("width", width);
