class informationPlot {

  constructor(_config, _data) {

    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: { top: 70, bottom: 50, right: 20, left: 70 },
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = _data;
    this.initVis();
  } 

  initVis() {
    let vis = this; 

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.svg = d3.select(vis.config.parentElement)
    .attr('width', vis.config.containerWidth)
    .attr('height', vis.config.containerHeight);

    vis.svg.append('text')
        .attr('class', 'chart-title')
      .attr('x', vis.config.containerWidth / 2)
      .attr('y', vis.config.margin.top / 2-15)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('font-size', 16)
      .text('Information Regarding exoplanet system');

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.updateVis(); 
  }

  updateVis(){
    let vis = this;
    console.log(vis.data);

    vis.chart.selectAll("text")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("x", vis.width/2-150)
      .attr("y", function(d, i) { return i * 200 + 25; })
      .text(function(d) { 
        return "Planet Name: " + d.pl_name;
      })
      .attr("font-size", "12px")
      .attr("fill", "black");
    
    vis.chart.selectAll("text1")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("x", vis.width/2-150)
      .attr("y", function(d, i) { return i * 200 + 50; })
      .text(function(d) { 
        return "Orbit Semi-Major Axis: " + d.pl_orbsmax+"[au]";
      })
      .attr("font-size", "12px")
      .attr("fill", "black");
    
    vis.chart.selectAll("text2")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("x",vis.width/2-150)
      .attr("y", function(d, i) { return i * 200 + 75; })
      .text(function(d) { 
        return "Size of the Planet: " + d.pl_rade+"[Earth Radius]";
      })
      .attr("font-size", "12px")
      .attr("fill", "black");

    vis.chart.selectAll("text3")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("x", vis.width/2-150)
      .attr("y", function(d, i) { return i * 200 + 100; })
      .text(function(d) { 
        return "Size of the Star " + d.st_rad + "[Solar Mass]"; 
      })
      .attr("font-size", "12px")
      .attr("fill", "black");
    
    vis.chart.selectAll("text4")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("x", vis.width/2-150)
      .attr("y", function(d, i) { return i * 200 + 125; })
      .text(function(d) { 
        if(d.st_spectype.charAt(0) =="A" )
        {
          return "Star Type: A"; 
        }
        else if(d.st_spectype.charAt(0) =="F" )
        {
          return "Star Type: F"; 
        }
        else if(d.st_spectype.charAt(0) =="G" )
        {
          return "Star Type: G"; 
        }
        else if(d.st_spectype.charAt(0) =="K" )
        {
          return "Star Type: K"; 
        }
        else if(d.st_spectype.charAt(0) =="M" )
        {
          return "Star Type: M"; 
        }
        
      })
      .attr("font-size", "12px")
      .attr("fill", "black");
    
    vis.chart.selectAll("text5")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("x", vis.width/2-150)
      .attr("y", function(d, i) { return i * 200 + 150; })
      .text(function(d) { 
        return "Distance from planet to Start: " + d.sy_dist+"[pc]";
      })
      .attr("font-size", "12px")
      .attr("fill", "black");
    
    vis.chart.selectAll("text6")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("x", vis.width/2-150)
      .attr("y", function(d, i) { return i * 200 + 175; })
      .text(function(d) { 
        if(d.pl_bmasse<=0.00001)
        {
          return "Planet Type: Asteroidan"; 
        }
        else if(d.pl_bmasse>0.00001 && d.pl_bmasse<=0.1)
        {
          return "Planet Type: Mercurian"; 
        }
        else if(d.pl_bmasse>0.1 && d.pl_bmasse<=0.5 )
        {
          return "Planet Type: Subterran"; 
        }
        else if(d.pl_bmasse>0.5 && d.pl_bmasse<=2)
        {
          return "Planet Type: Terran (Earths)"; 
        }
        else if(d.pl_bmasse>2 && d.pl_bmasse<=10)
        {
          return "Planet Type: Superterran(Super-Earths)"; 
        }
        else if(d.pl_bmasse>10 && d.pl_bmasse<=50)
        {
          return "Planet Type: Neptunian (Neptunes)"; 
        }
        else if(d.pl_bmasse>50 && d.pl_bmasse<=5000)
        {
          return "Planet Type: Jovian (Jupiters)"; 
        }
        else
        {
          return "Planet Type: Undefined"
        }
      })
      .attr("font-size", "12px")
      .attr("fill", "black");
  }

  renderVis(){
    let vis=this; 
  }
}
