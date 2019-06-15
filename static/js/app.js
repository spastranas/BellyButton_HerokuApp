






//                          FUnction no1. populate the metadata card.


function buildMetadata(sample) {
              console.log("Build metadata"); 
              // console.log(sample);
            // modify html with the data retured by the dictionary
            
            

            var metadataText = d3.select("#sample-metadata");//select the html element where we will append
            
            metadataText.selectAll("h5").remove();
            
            console.log("cleared Node");
            console.log(metadataText);


            
            // recipe to add each key and value to the panel
              Object.entries(sample).forEach(function([key, value]) {
                // console.log(key, value);
            
                var cell = metadataText.append("h5");
                cell.text(key + " : "+ value);
  });
};




//                                  function No 2. create basic charts


function buildCharts(sample,divScat, divPie) {
  
  
// reorganize the data in order to be able to sort and select top 10 values to graph.
          var recreate=[];
          //  var to=sample.otu_ids.length;
          var count=sample.otu_ids;
          for (var j = 0; j < count.length+1; j++) {
                var dic={"otu_ids":sample.otu_ids[j],
                "otu_labels":sample.otu_labels[j],
                "sample_values":sample.sample_values[j]
                };

                recreate.push(dic);
          
          }

          // Sort the data array using the greekSearchResults value
                    recreate.sort(function(a, b) {
                      return parseFloat(b.sample_values) - parseFloat(a.sample_values);
                    });

          // Slice the first 10 objects for plotting
                    recreate = recreate.slice(0, 10);

          // now that is is sorted, I need to switch back to previouse format.  {otu_ids: 1795, otu_labels: "Bacteria;Firmicutes;Bacilli;Bacillales;Staphylococcaceae;Staphylococcus", sample_values: 805}

          var outid=[];
          var label=[];
          var values=[]

          recreate.forEach((FullRow) => {
            outid.push(FullRow.otu_ids);
            label.push(FullRow.otu_labels);
            values.push(FullRow.sample_values);
              });
            
          DataFOrPie={
                      "otu_ids":outid,
                      "otu_labels":label,
                      "sample_values":values


          }   ;



//  bubblr chart
          var scatterTrace = {
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: "markers",
            type: "scatter",
              marker: {
              color: sample.otu_ids,
              size:sample.sample_values
            }
          };
         
          //  Plotly.newPlot("bubble", [scatterTrace]);
          Plotly.newPlot(divScat, [scatterTrace]);

         
// pie chart
          var PieTrace = {
            labels: DataFOrPie.otu_ids,
            values: DataFOrPie.sample_values,
            type: 'pie'
          };


           Plotly.newPlot(divPie, [PieTrace]);



  
}



//                                        function no.3 gouge chart

function buildGauge(sample,divG){

            // Enter a speed between 0 and 180
            var level = sample.WFREQ;

            // Trig to calc meter point
            var degrees = 180 - level*(180/6),
                radius = .5;
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
                name: 'Scrubs per week',
                text: level,
                hoverinfo: 'text+name'},
              { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
              rotation: 90,
              text: ['>5', '4-5', '4-3', '3-2',
                        '2-1', '1-0', ''],
              textinfo: 'text',
              textposition:'inside',
              marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                    'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                    'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                                    'rgba(255, 255, 255, 0)']},
              labels: ['>5', '4-5', '4-3', '3-2',
              '2-1', '1-0', ''],
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
              title: '<b>Gauge</b> <br> Scrubs per week',
              height: 600,
              width: 600,
              xaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
              yaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]}
            };

             Plotly.newPlot(divG, data, layout);

  };

   






//                                  initialize : execute Function 1, 2, 3 as default graphs

function init() {
            // update dropdown menu
            // Grab a reference to the dropdown select element
            var selector = d3.select("#selDataset");

            // Use the list of sample names to populate the select options
             d3.json("/names").then((sampleNames) => {
               sampleNames.forEach((sample) => {
                 selector
                   .append("option")
                   .text(sample)
                   .property("value", sample);
                 });
                });

    // use some data for default graphs
    

            
            metadata={
              "AGE": 51,
              "BBTYPE": "I",
              "ETHNICITY": "Caucasian",
              "GENDER": "M",
              "LOCATION": "NewYork/NY",
              "WFREQ": 5,
              "sample": 0
              };

            PieData={"otu_ids":[1795,1724],
            "otu_labels":["Bacteria;Firmicutes;Bacilli;Bacillales;Staphylococcaceae;Staphylococcus","Bacteria;Firmicutes;Bacilli;Bacillales"],
            "sample_values":[805,14]};


          //  call functions
             buildMetadata(metadata) ;  
             buildCharts(PieData,"bubble","pie");
            buildGauge(metadata,"gauge");
            



  };










//                              On change execute update functions


  // Get new data whenever the dropdown selection changes
function optionChanged(route) {
  console.log(route);

  PieData={};
  metadata={};



          // get metadata
          d3.json(`/metadata/${route}`).then(function(response1) {
            console.log("metadata", response1);
            var metadata=response1;

            // var metadataText = document.getElementById("#sample-metadata");
            // metadataText.text="";
          
            buildMetadata(metadata); 

            var gchart = document.getElementById("gauge");
            buildGauge(metadata,gchart);
          
          
          });
         // get samples

          d3.json(`/samples/${route}`).then(function(response2) {
            console.log("pieData", response2);
            var PieData=response2;
          
            
            var bchart = document.getElementById("bubble");
            var pchart = document.getElementById("pie");
          
          
            buildCharts(PieData,bchart,pchart);
          
          
          });
                      
          
           
            console.log(bchart);
            console.log(pchart);
            console.log(gchart);

          };
          
         
          init();      
     
    
          
 
        
          