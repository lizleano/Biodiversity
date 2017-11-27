function drawgauge(sample){
  d3.json("/wfreq/"+sample, function(err, data) {     
        if (err){
          alert("Error found in fetchdata while reading samples. " + err.message);
        } else { 

          gaugechart(data);
        }
  });
}


function gaugechart(gaugedata)
{
	console.log(gaugedata);

	var gaugeId = document.querySelector("#gauge-chart");
	gaugeId.innerHTML = "";

    var reading = parseInt(gaugedata);	

	// Enter a speed between 0 and 180
	var level = parseInt(gaugedata);

	// Trig to calc meter point
	var degrees = 180-(180/9)*level;
	console.log(degrees);
	var radius = .5;
	var radians = degrees * Math.PI / 180;
	var x = radius * Math.cos(radians);
	var y = radius * Math.sin(radians);

	// Path: may have to change to create a better triangle
	var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
	     pathX = String(x),
	     space = ' ',
	     pathY = String(y),
	     pathEnd = ' Z';
	var path = mainPath.concat(pathX,space,pathY,pathEnd);

	var data = [{ type: 'scatter',
	   x: [0], y:[0],
	    marker: {size: 28, color:'850000'},
	    showlegend: false,
	    name: 'speed',
	    text: level,
	    hoverinfo: 'text+name'},
	  { 
      values: [100/9, 100/9, 100/9,100/9,100/9,100/9,100/9,100/9,100/9,100],
      text: ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9",""],
	  rotation: 90,
      direction: "clockwise",
	  textinfo: 'text',
	  textposition:'inside',
	  marker: {colors:["EDECC0","D2E3BF","B8DABF","9ED2BF","83C9BF","69C1BF","4FB8BF","34B0BF","1AA7BF","white"]},
	  labels: ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9",""],
	  hoverinfo: 'label',
	  hole: .5,
	  type: 'pie',
	  showlegend: false
	}];

	var layout = {
	  shapes:[{
	      type: 'path',
	      path: path,
	      fillcolor: '850000',
	      line: {
	        color: '850000'
	      }
	    }],	  
      title: '<b>Belly Button Washing Frequency</b><br>Scrubs per week',
	  height: 600,
	  width: 500,
	  xaxis: {zeroline:false, showticklabels:false,
	             showgrid: false, range: [-1, 1]},
	  yaxis: {zeroline:false, showticklabels:false,
	             showgrid: false, range: [-1, 1]}
	};

	Plotly.newPlot(gaugeId, data, layout);

}