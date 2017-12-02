var base_url = "https://biodiversity-ldl.herokuapp.com/"


function init(){
    var sample = "BB_940";	
	loadnames();
	buildpage(sample, "inital");
}

function loadnames(){
	d3.json(base_url.concat("names"), function(err, data) {
		if (err){
			alert("Error loading names. " + err.message);
		} else {

			var nameoptions = document.querySelector("#selDataSet");
			for (var i=0; i<data.length; i++){
				var opt = document.createElement("option");
				opt.value = data[i];
				opt.text = data[i];
				if (i==0){
					opt.setAttribute("selected", "selected");
				}
				nameoptions.appendChild(opt);
			}
		}
	});
}

function deleteTrace(divId){
  Plotly.deleteTraces(divId, 0);
};

function optionChanged(sample) {
	buildpage(sample, "update");
}

function buildpage(sample, type){
	getSampleMetadata(sample);
	drawpie(sample);
	drawgauge(sample);
	drawbubble(sample, type);

}


function getSampleMetadata(sample){
	d3.json(base_url.concat("metadata/",sample), function(err,data){ 
    	if (err){
			alert("Error getting sample metadata. " + err.message);
		} else {
			var meta = document.querySelector("#metadata");
			metadata.innerHTML = "";

			for(var key in data) {
			  	var value = data[key];
			  	console.log(key + ": " +  value);
			  	var para = document.createElement("P");                       // Create a <p> element
				var t = document.createTextNode(key + ": " +  value);      // Create a text node
				para.appendChild(t);                                          // Append the text to <p>
				meta.appendChild(para);           // Append <p> to <div> with id="myDIV"
			}
		}
	});
}

// // draw piechart
// function piechart(data){
//     console.log(data["otu_desc"]);

//     var text = data["sample_values"].map((v, i) => `
// 		${data["otu_desc"][i]}`)

// 	var piedata = [{
// 	  labels: data["otu_ids"],
// 	  values: data["sample_values"],
// 	  text: text,
// 	  type: 'pie',
// 	  textinfo: 'percent'
// 	}];

	
// 	var layout = {
// 	  autosize: false,
// 	  height: 500,
// 	  width: 500
// 	};

// 	Plotly.newPlot('pie', piedata, layout);

// }

init()
