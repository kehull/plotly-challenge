//initialize page with populated charts
function init() {
  var barPlot = [{
    type: 'bar',
    x: [24, 27, 28, 37, 40, 84, 92, 162, 178, 194],
    y: ["OTU 1977", "OTU 2318", "OTU 189", "OTU 352", "OTU 1189", "OTU 41", "OTU 2264", "OTU 482", "OTU 2859", "OTU 1167"],
    orientation: 'h',
    text: ["Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Peptoniphilus", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales"]
  }];

  Plotly.newPlot('bar', barPlot);

  var bubblePlot = {
    x:  [1977, 2318, 189, 352, 1189, 41, 2264, 482, 2859, 1167],
    y: [24, 27, 28, 37, 40, 84, 92, 162, 178, 194],
    mode: 'markers',
    text: ["Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Peptoniphilus", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales"],
    marker: {
      color:  [1977, 2318, 189, 352, 1189, 41, 2264, 482, 2859, 1167],
      opacity: [1, 0.8, 0.6, 0.4],
      size: [24, 27, 28, 37, 40, 84, 92, 162, 178, 194]
    }
  };
  var bubbleData = [bubblePlot];
  var layout = {
    showlegend: false,
    height: 600,
    width: 1200
  };
  Plotly.newPlot("bubble", bubbleData, layout);

var metadataInfo = {
  age: 34,
  bbtype: "I",
  ethnicity: "Caucasian/Midleastern",
  gender: "F",
  id: 941,
  location: "Chicago/IL",
  wfreq: 1,
}
const metadataArrays = Object.entries(metadataInfo);
  var ul = document.createElement('ul');
  document.getElementById('sample-metadata').appendChild(ul);
  ul.innerHTML = "";
  metadataArrays.forEach(function(keyValuePair) {
    var li = document.createElement('li');
    ul.appendChild(li);
    li.innerHTML += keyValuePair;
  });
}

// Use D3 fetch to read the JSON file
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
  // this logs twice and doesn't clear on change for some reason?
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
    Plotly.newPlot("bubble", bubbleData, layout);
  }
  createBubbleChart();
}

init();