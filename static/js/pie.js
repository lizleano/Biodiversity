function drawpie(sample) {
	counter=10;
    d3.json("/samples/".concat(sample,"/",counter), function(err, data) {   	
   	    if (err){
   	    	alert("Error found in fetchdata while reading samples. " + err.message);
   	    } else {
   	    	// enter 0 if all
   	    	values = data;
   	    	d3.json("otu/".concat(counter), function(otu_err,otu_data){   	    		
	   	    	console.log(otu_data);
	   	    	sampledata = {
	   	    		"otu_ids": data["otu_ids"],
	   	    		"otu_desc": otu_data,
	   	    		"sample_values": data["sample_values"]
	   	    	}
	   	    	piechart(sampledata);
   	    	})
   	    }
    	return data;
	});
  
}

// draw piechart
function piechart(data){
    var text = data["sample_values"].map((v, i) => `
		${data["otu_desc"][i]}`)

	var piedata = [{
	  labels: data["otu_ids"],
	  values: data["sample_values"],
	  text: text,
	  type: 'pie',
	  textinfo: 'percent'
	}];

	
	var layout = {
	  title: '<b>Top 10 Bacteria Found</b>',
	  autosize: false,
	  height: 600,
	  width: 600
	};

	Plotly.newPlot('pie', piedata, layout);

}