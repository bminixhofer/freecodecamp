const dataSource = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const height = window.innerHeight,
  width = window.innerWidth;

let chart = d3.select(".chart")
  .attr("height", height)
  .attr("width", width);
