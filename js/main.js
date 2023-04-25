console.log("Hello world");
let data, lineChart, barChart1, barChart2, barChart3, barChart4, barChart5, scatterPlot, histogram,graph1;
let max_value, min_value;

d3.csv('data/Exoplanets.csv')
  .then(_data => {
  	console.log('Data loading complete. Work with dataset.');
  	//data = _data;
  
    data = _data.filter(d => {
      return (d.disc_year !== null && 
              d.sy_pnum !== null && 
              d.sy_snum !== null && 
              d.st_rad !== null && 
              d.st_mass !== null && 
              d.sy_dist !== null && 
              d.pl_orbsmax !== null && 
              d.discoverymethod !== null && 
              d.st_spectype !== null && 
              d.sys_name !== null)
    });
    
    console.log(data); 
    
    //process the data - this is a forEach function. 
    data.forEach(d => { 
      	d.disc_year = +d.disc_year; // convert string 'disc_year' to discovery year
        d.sy_pnum= +d.sy_pnum;
        d.sy_snum=+d.sy_snum;
        d.discoverymethod=d.discoverymethod; //keep string as string
        d.st_rad=+d.st_rad; 
        d.st_mass=+d.st_mass; 
        d.sy_dis =+d.sy_dis;
        d.st_spectype=d.st_spectype;
        d.pl_orbsmax=+d.pl_orbsmax; 
        d.sys_name=d.sys_name; 

  	});


    //lets compute costs per year for the line chart
    let minYear = d3.min(data, d =>  d.disc_year);
    let maxYear = d3.max(data, d=> d.disc_year);

        //console.log(minYear);
        //console.log(maxYear); 
    let discPerYear = []; //this will be our data for the line chart
    for(let i = minYear; i < maxYear; i++){
          
          let counter=0;

          let justThisYear = data.filter( d => d.disc_year == i ); //only include the selected year
          
          let planet_cost = d3.sum(justThisYear, d => d.sy_pnum);; //sum over the filtered array, for the cost field
          if(i>=1992) //min year got declared as 1992
          {
            discPerYear.push( {"year": i, "discovery":planet_cost});
          }
          
      }

    graph1=[
      {xValue : 1, yValue : 0},
      {xValue : 2, yValue : 0},
      {xValue : 3, yValue : 0},
      {xValue : 4, yValue : 0}
      ];

    let graph2=[
      {xValue : 1, yValue : 0},
      {xValue : 2, yValue : 0},
      {xValue : 3, yValue : 0},
      {xValue : 4, yValue : 0},
      {xValue : 5, yValue : 0},
      {xValue : 6, yValue : 0},
      {xValue : 7, yValue : 0},
      {xValue : 8, yValue : 0}
      ];
    
    let graph3=[
    {xValue : "Transit", yValue : 0},
    {xValue : "Radial Velocity", yValue : 0},
    {xValue : "Microlensing", yValue : 0},
    {xValue : "Imaging", yValue : 0},
    {xValue : "Transit Timing Variations", yValue : 0},
    {xValue : "Eclipse Timing Variations", yValue : 0},
    {xValue : "Orbital Brightness Modulation", yValue : 0},
    {xValue : "Pulsar Timing", yValue : 0},
    {xValue : "Astrometry", yValue : 0},
    {xValue : "Pulsation Timing Variations", yValue : 0},
    {xValue : "Disk Kinematics", yValue : 0},
    ];

    let graph4=[
      {xValue : "A", yValue:0, linkurl:"https://en.wikipedia.org/wiki/Stellar_classification#Class_A"},
      {xValue : "F", yValue:0, linkurl:"https://en.wikipedia.org/wiki/Stellar_classification#Class_F"},
      {xValue : "G", yValue:0, linkurl:"https://en.wikipedia.org/wiki/Stellar_classification#Class_G"},
      {xValue : "K", yValue:0, linkurl:"https://en.wikipedia.org/wiki/Stellar_classification#Class_K"},
      {xValue : "M", yValue:0, linkurl:"https://en.wikipedia.org/wiki/Stellar_classification#Class_M"},
    ];

    let graph5=[
        {'xValue': "A", 'yValue':0, 'zValue':0 }, 
        {'xValue': "F", 'yValue':0, 'zValue':0 }, 
        {'xValue': "G", 'yValue':0, 'zValue':0 }, 
        {'xValue': "K", 'yValue':0, 'zValue':0 }, 
        {'xValue': "M", 'yValue':0, 'zValue':0 }, 
    ];
    
    let graph6=[
      {xValue : 270, yValue : 0},
      {xValue : 810, yValue : 0},
      {xValue : 1350, yValue : 0},
      {xValue : 1890, yValue : 0},
      {xValue : 2430, yValue : 0},
      {xValue : 2970, yValue : 0},
      {xValue : 3510, yValue : 0},
      {xValue : 4050, yValue : 0},
      {xValue : 4590, yValue : 0},
      {xValue : 5130, yValue : 0},
      {xValue : 5670, yValue : 0},
      {xValue : 6210, yValue : 0},
      {xValue : 6750, yValue : 0},
      {xValue : 7290, yValue : 0},
      {xValue : 7830, yValue : 0},
      {xValue : 8370, yValue: 0}
    ];

    data.forEach(d=>{
      if(d.sy_snum==1)
      {
        graph1[0].yValue=graph1[0].yValue + 1;
      }
      else if(d.sy_snum==2)
      {
        graph1[1].yValue=graph1[1].yValue + 1;
      }
      else if(d.sy_snum==3)
      {
        graph1[2].yValue=graph1[2].yValue + 1;
      }
      else if(d.sy_snum==4)
      {
        graph1[3].yValue=graph1[3].yValue + 1;
      }

      if(d.sy_pnum==1)
      {
        graph2[0].yValue=graph2[0].yValue + 1;
      }
      else if(d.sy_pnum==2)
      {
        graph2[1].yValue=graph2[1].yValue + 1;
      }
      else if(d.sy_pnum==3)
      {
        graph2[2].yValue=graph2[2].yValue + 1;
      }
      else if(d.sy_pnum==4)
      {
        graph2[3].yValue=graph2[3].yValue + 1;
      }
      else if(d.sy_pnum==5)
      {
        graph2[4].yValue=graph2[4].yValue + 1;
      }
      else if(d.sy_pnum==6)
      {
        graph2[5].yValue=graph2[5].yValue + 1;
      }
      else if(d.sy_pnum==7)
      {
        graph2[6].yValue=graph2[6].yValue + 1;
      }
      else if(d.sy_pnum==8)
      {
        graph2[7].yValue=graph2[7].yValue + 1;
      }

      if(d.discoverymethod =="Transit")
      {
        graph3[0].yValue=graph3[0].yValue + 1;
      }
      else if(d.discoverymethod=="Radial Velocity")
      {
        graph3[1].yValue=graph3[1].yValue + 1;
      }
      else if(d.discoverymethod=="Microlensing")
      {
        graph3[2].yValue=graph3[2].yValue + 1;
      }
      else if(d.discoverymethod=="Imaging")
      {
        graph3[3].yValue=graph3[3].yValue + 1;
      }
      else if(d.discoverymethod=="Transit Timing Variations")
      {
        graph3[4].yValue=graph3[4].yValue + 1;
      }
      else if(d.discoverymethod=="Eclipse Timing Variations")
      {
        graph3[5].yValue=graph3[5].yValue + 1;
      }
      else if(d.discoverymethod=="Orbital Brightness Modulation")
      {
        graph3[6].yValue=graph3[6].yValue + 1;
      }
      else if(d.discoverymethod=="Pulsar Timing")
      {
        graph3[7].yValue=graph3[7].yValue + 1;
      }
      else if(d.discoverymethod=="Astrometry")
      {
        graph3[8].yValue=graph3[8].yValue + 1;
      }
      else if(d.discoverymethod=="Pulsation Timing Variations")
      {
        graph3[9].yValue=graph3[9].yValue + 1;
      }      
      else if(d.discoverymethod=="Disk Kinematics")
      {
        graph3[10].yValue=graph3[10].yValue + 1;
      } 

      if(d.st_spectype.charAt(0) =="A" )
      {
        graph4[0].yValue=graph4[0].yValue + 1;
      }
      else if(d.st_spectype.charAt(0) =="F" )
      {
        graph4[1].yValue=graph4[1].yValue + 1;
      }
      else if(d.st_spectype.charAt(0) =="G" )
      {
        graph4[2].yValue=graph4[2].yValue + 1;
      }
      else if(d.st_spectype.charAt(0) =="K" )
      {
        graph4[3].yValue=graph4[3].yValue + 1;
      }
      else if(d.st_spectype.charAt(0) =="M" )
      {
        graph4[4].yValue=graph4[4].yValue + 1;
      }

      
      if(d.st_spectype.charAt(0) =="A" )
      {
        if(d.pl_orbsmax>=8.5 && d.pl_orbsmax <12.5)
        {
          graph5[0].yValue=graph5[0].yValue + 1;
        }
        else
        {
          graph5[0].zValue=graph5[0].zValue + 1;
        }
      }
      else if(d.st_spectype.charAt(0) =="F" )
      {
        if(d.pl_orbsmax>=1.5 && d.pl_orbsmax <2.2)
        {
          graph5[1].yValue=graph5[1].yValue + 1;
        }
        else
        {
          graph5[1].zValue=graph5[1].zValue + 1;
        }
      }
      else if(d.st_spectype.charAt(0) =="G" )
      {
        if(d.pl_orbsmax>=0.95 && d.pl_orbsmax <1.4)
        {
          graph5[2].yValue=graph5[2].yValue + 1;
        }
        else
        {
          graph5[2].zValue=graph5[2].zValue + 1;
        }
      }
      else if(d.st_spectype.charAt(0) =="K" )
      {
        if(d.pl_orbsmax>=0.38 && d.pl_orbsmax <0.56)
        {
          graph5[3].yValue=graph5[3].yValue + 1;
        }
        else
        {
          graph5[3].zValue=graph5[3].zValue + 1;
        }
      }
      else if(d.st_spectype.charAt(0) =="M" )
      {
        if(d.pl_orbsmax>=0.08 && d.pl_orbsmax <0.12)
        {
          graph5[4].yValue=graph5[4].yValue + 1;
        }
        else
        {
          graph5[4].zValue=graph5[4].zValue + 1;
        }
      }
      //max_value= 8500
      //min_value=1.3019
      //bin_number=15
      //bin_width=531.16
      if(d.sy_dist>1 && d.sy_dist<=540)
      {
        graph6[0].yValue=graph6[0].yValue+1;
      }
      else if(d.sy_dist>540 && d.sy_dist<=1080)
      {
        graph6[1].yValue=graph6[1].yValue+1;
      }
      else if(d.sy_dist>1080 && d.sy_dist<=1620)
      {
        graph6[2].yValue=graph6[3].yValue+1;
      }
      else if(d.sy_dist>1620 && d.sy_dist<=2160)
      {
        graph6[3].yValue=graph6[3].yValue+1;
      }
      else if(d.sy_dist>2160 && d.sy_dist<=2700)
      {
        graph6[4].yValue=graph6[4].yValue+1;
      }
      else if(d.sy_dist>2700 && d.sy_dist<=3240)
      {
        graph6[5].yValue=graph6[5].yValue+1;
      }
      else if(d.sy_dist>3240 && d.sy_dist<=3780)
      {
        graph6[6].yValue=graph6[6].yValue+1;
      }
      else if(d.sy_dist>3780 && d.sy_dist<=4320)
      {
        graph6[7].yValue=graph6[7].yValue+1;
      }
      else if(d.sy_dist>4320 && d.sy_dist<=4860)
      {
        graph6[8].yValue=graph6[8].yValue+1;
      }
      else if(d.sy_dist>4860 && d.sy_dist<=5400)
      {
        graph6[9].yValue=graph6[9].yValue+1;
      }
      else if(d.sy_dist>5400 && d.sy_dist<=5940)
      {
        graph6[10].yValue=graph6[10].yValue+1;
      }
      else if(d.sy_dist>5940 && d.sy_dist<=6480)
      {
        graph6[11].yValue=graph6[11].yValue+1;
      }
      else if(d.sy_dist>6480 && d.sy_dist<=7020)
      {
        graph6[12].yValue=graph6[12].yValue+1;
      }
      else if(d.sy_dist>7020 && d.sy_dist<=7560)
      {
        graph6[13].yValue=graph6[13].yValue+1;
      }
      else if(d.sy_dist>7560 && d.sy_dist<=8100)
      {
        graph6[14].yValue=graph6[14].yValue+1;
      }
      else if(d.sy_dist>8100)
      {
        graph6[15].yValue=graph6[15].yValue+1;
      }
    });


    console.log(graph6);

    let table = $('#my-table tbody');

    
    data.forEach((d) => {
      let row = $('<tr>');
      row.append($('<td>').text(d.sys_name));
      row.append($('<td>').text(d.sy_snum));
      row.append($('<td>').text(d.sy_pnum));
      row.append($('<td>').text(d.discoverymethod));
      row.append($('<td>').text(d.disc_year));
      row.append($('<td>').text(d.st_spectype)); 
      row.append($('<td>').text(d.st_rad)); 
      row.append($('<td>').text(d.st_mass));    
      row.append($('<td>').text(d.sy_dist));    
      table.append(row);
    });

    // Add event listener for scrolling
    $('.table-container').scroll(function() {
      let distanceFromTop = $('.table-container').scrollTop();
      let tableHeight = $('#my-table').height();
      let containerHeight = $('.table-container').height();
      if (distanceFromTop + containerHeight >= tableHeight) {
        // Load more data or update the table
      }
    });

    //console.log(graph1);
    //console.log(graph2); 
    //console.log(graph3); 
    //console.log(graph4); 
    //console.log(graph5); 
    //console.log(discPerYear);  

    barChart1= new BarChartStar({
      'parentElement' : '#bar1',
      'containerHeight': 300,
      'containerWidth': 400,
    },graph1);


    barChart2= new BarChartPlanet({
      'parentElement' : '#bar2',
      'containerHeight': 300,
      'containerWidth': 400
    },graph2);


    barChart4= new BarChartType({
      'parentElement' : '#bar4',
      'containerHeight': 300,
      'containerWidth': 250
    },graph4);
    
    barChart3= new BarChartMethod({
      'parentElement' : '#bar3',
      'containerHeight': 300,
      'containerWidth': 500
    },graph3);

    barChart5= new BarChartGroup({
      'parentElement' : '#bar5',
      'containerHeight': 300,
      'containerWidth': 500
    },graph5);
    
    
    histogram=new Histogram({
      'parentElement': '#histogram',
      'containerHeight': 300,
      'containerWidth': 800
    },graph6);
    
    
    lineChart = new LineChart({
      'parentElement': '#line',
      'containerHeight': 200,
      'containerWidth': 700
      }, discPerYear); 

    scatterPlot= new ScatterPlot({
      'parentElement' : '#scatterplot',
      'containerHeight': 400,
      'containerWidth': 1000
    }, data);

})
.catch(error => {
    console.error('Error loading the data'+error);
});


d3.selectAll('.legend-btn').on('click', function() {
  console.log("button! ");
  // Toggle 'inactive' class
  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
  
  // Check which categories are active
  let selectedCategory = [];
  d3.selectAll('.legend-btn:not(.inactive)').each(function() {
    selectedCategory.push(d3.select(this).attr('category'));
  });

  // Filter data accordingly and update vis
  scatterPlot.data = data.filter(d => selectedCategory.includes(d.sy_snum)) ;
  scatterPlot.updateVis();

  barChart1.graph1=graph1.filter(d=>selectedCategory.includes(d.sy_snum));
  barChart1.updateVis();

});