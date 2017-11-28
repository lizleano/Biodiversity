function drawbubble(sample, type) {
    counter=20;
    d3.json("/samples/".concat(sample,"/",counter), function(err, data) {     
        if (err){
          alert("Error found in fetchdata while reading samples. " + err.message);
        } else {
          // enter 0 if all
          values = data;
          d3.json("/otu/".concat(counter), function(otu_err,otu_data){            
            // console.log(otu_data);
            sampledata = {
              "otu_ids": data["otu_ids"],
              "otu_desc": otu_data,
              "sample_values": data["sample_values"]
            }
            bubblechart(sampledata, type);
          })
        }
      return data;
  });
  
}

function bubblechart(data, type){
  var color_bubble = [];

  var graphDiv = document.querySelector("#bubble-chart")

  // delete traces of previous plotting
  if (graphDiv.data){   
    for (var i=0; i<graphDiv.data.length; i++){
      deleteTrace(graphDiv, [i]);
    }
  }

  data['sample_values'].forEach(function(element, idx) {
      color_bubble.push(idx*25);
  });

  var text = data["sample_values"].map((v, i) => `
    ${data["otu_desc"][i]}`)

  var trace1 = {
      x: data["otu_ids"],
      y: data["sample_values"],
      mode: 'markers',      
      text: text,
      hoverinfo: 'x+y+text',
      marker: {
        size: data["sample_values"],
        color: color_bubble,
        colorscale:'Viridis',
        showscale: false
      }
    };

  var data = [trace1];

  var layout = {
    showlegend: false,
    hovermode: "closest", 
    height: 800,
    width: 1500,
    xaxis: {
      title: '<b>OTU ID</b>',
      zeroline: true
    },
    yaxis:{
      title: '<b>Sample Values</b>'
    }
  };

  
  Plotly.plot(graphDiv, data, layout);
}
