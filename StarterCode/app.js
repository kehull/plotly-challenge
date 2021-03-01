// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then((importedData) => {
  var data = importedData;
  console.log(importedData.names)
  console.log(importedData.metadata)
  console.log(importedData.samples)
  
  var select = document.getElementById("selDataset");
  var options = data.names;
  for(var i = 0; i < options.length; i++) {
      var opt = options[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
  }

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
    var barPlotData = data.samples.find(findSubject);
    console.log(barPlotData); // show's specific subject's info in the console

    // show metadata for subject
    // @@@ TDL: figure out why this doesn't work ??
    function findMeta(meta) {
      return meta.id === dataset;
    }
    var metadataInfo = data.metadata.find(findMeta);
    console.log(metadataInfo); // show's specific subject's info in the console @@@ just says "undefined"

    // create bar plot

    // @@@ TDL: figure out how to sort the three lists (sample_values, otu_ids, and otu_labels) together to get top ten items, 
      //figure out why the chart renders so weird on the page
    var xAxis = barPlotData.sample_values.slice(0,10); 
    var yAxis = barPlotData.otu_ids.map(String).slice(0,10);
    var labels = barPlotData.otu_labels.slice(0,10);
    console.log(xAxis);
    console.log(yAxis);
    console.log(labels);

    var barPlot = [{
      type: 'bar',
      x: xAxis,
      y: yAxis,
      orientation: 'h',
      text: labels
    }];
    
    Plotly.newPlot('bar', barPlot);

    // create bubble plot

    // create gauge (maybe)
  }
  

});
