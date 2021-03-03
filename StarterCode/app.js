// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
var data = {};
d3.json("samples.json").then((importedData) => {
  data = importedData;

  var select = document.getElementById("selDataset");
  var options = data.names;
  for (var i = 0; i < options.length; i++) {
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
  }

});

d3.selectAll("#selDataset").on("change", optionChanged);
function optionChanged() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");

  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.node().value; // this is a number

  // Get specific subject's sample data
  function findSubject(subject) {
    return subject.id === dataset;
  }
  var plotData = data.samples.find(findSubject);

  // show metadata for subject
  // @@@ TDL: figure out why this doesn't work ??
  function findMeta(meta) {
    return meta.id === parseInt(dataset);
  }
  var metadataInfo = data.metadata.find(findMeta);
  const metadataArrays = Object.entries(metadataInfo);
  var ul = document.createElement('ul');
  document.getElementById('sample-metadata').appendChild(ul);
  ul.innerHTML = "";
  metadataArrays.forEach(function(keyValuePair) {
    var li = document.createElement('li');
    ul.appendChild(li);
    li.innerHTML += keyValuePair;
  });

  // create bar plot
  function makeOTUString(otuid) {
    return `OTU ${otuid}`;
  }
  var sampleValues = plotData.sample_values.slice(0, 10).reverse();
  var otuIdsString = plotData.otu_ids.slice(0, 10).map(makeOTUString).reverse();
  var otuIdsNum = plotData.otu_ids.slice(0, 10).reverse();
  var labels = plotData.otu_labels.slice(0, 10);

  var barPlot = [{
    type: 'bar',
    x: sampleValues,
    y: otuIdsString,
    orientation: 'h',
    text: labels
  }];

  Plotly.newPlot('bar', barPlot);
  

  // call bubble plot
  function createBubbleChart() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.node().value; // this is a number

    var bubblePlot = {
      x: otuIdsNum,
      y: sampleValues,
      mode: 'markers',
      text: labels,
      marker: {
        color: otuIdsNum,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    };
    var bubbleData = [bubblePlot];
    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };
    Plotly.newPlot("bubble", bubbleData, layout);;
  }
  createBubbleChart();
  // create gauge (maybe)
}