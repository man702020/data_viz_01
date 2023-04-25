class orbitPlot {

  constructor(_config, _data) {

    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: { top: 90, bottom: 50, right: 20, left: 70 },
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
      .text('Exoplanet System')
      .style('font-size', 32);

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.updateVis(); 
  }

  updateVis(){
    let vis = this;


    
    let test_data= [];
    if(vis.data.sy_snum==1)
    {
      test_data=['Stars: 1'];
    }
    else if(vis.data.sy_snum==2)
    {
      test_data=['Stars: 1','Stars: 2']
    }
    else if(vis.data.sy_snum==2)
    {
      test_data=['Stars: 1','Stars: 2', 'Stars: 3']
    }
    else{
      test_data=['Stars: 1','Stars: 2', 'Stars: 3', 'Stars: 4']
    }

    vis.sun_circles=vis.chart.selectAll('.sun_point')
        .data(test_data)
        .enter()
        .append('circle')
        .attr('class', 'sun_point')
        .attr('r', d=> Math.log(vis.data[0].st_rad*695700)*5)
        .attr('cy', vis.height/2)
        .attr('cx', d=>vis.width/2)
        .attr('fill', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('opacity',0.5);
     
     


    vis.line = vis.chart.append("line")
        .data(vis.data)
        .attr("x1", vis.width/2) // x-coordinate of starting point
        .attr("y1", vis.height/2) // y-coordinate of starting point
        .attr("x2", d=>vis.width/2+Math.log(d.sy_dist*3.86*10^13)*5)///11.33*2) // x-coordinate of ending point
        .attr("y2", vis.height/2) // y-coordinate of ending point
        .attr("stroke", "black") // color of the line
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5"); // width of the line
    
    vis.test_circle=vis.chart.selectAll('.test_point')
        .data(vis.data)
        .enter()
        .append('circle')
        .attr('class', 'test_point')
        .attr('cy', vis.height/2)
        .attr('cx', d=>vis.width/2)
        .attr("stroke", "black") // color of the line
        .attr("stroke-width", 2)
        .attr('r', d=>Math.log(d.sy_dist*3.86*10^13)*5)//d.sy_dist/11.33*2)
        .attr("stroke-dasharray", "5,5")
        .attr("fill","none");

    vis.circles=vis.chart.selectAll('.point')
        .data(vis.data)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('r', d=>Math.log(d.pl_rade*6378.14)*5)
        .attr('cy', vis.height/2)
        .attr('cx', d=>vis.width/2+Math.log(d.sy_dist*3.86*10^13)*5)//d.sy_dist/11.33*2) // to mange 8500 max d.sy_dist into 750 space 
        .attr('fill', 'blue')
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('opacity',0.5);
    
    vis.circles
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Planet Radius: ${d.pl_rade}  [Earth Radius]</div>
            `)
          });

    vis.sun_circles
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Star Radius: ${vis.data[0].st_rad} [Solar Radius]</div>
            `)
          });
  

    vis.line
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Distance from Star: ${d.sy_dist} [pc]</div>
            `)
          });
    
    vis.test_circle
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Orbital Semi-major axis: ${d.pl_orbsmax}[au] Eccentricity: ${d.pl_orbeccen}  </div>
            `)
          });
    /*
    vis.ellipses = vis.chart.selectAll('.ellipse')
        .data(vis.data)
        .enter()
        .append('ellipse')
        .attr('class', 'ellipse')
        .attr('rx', d => Math.log(d.pl_orbsmax*206625)) // semi-major axis and change of data from pc to au
        .attr('ry', d => Math.log(d.pl_orbsmax*206625)* Math.sqrt(1 - d.pl_orbeccen ** 2)) // semi-minor axis
        .attr('cx', d=>vis.width/2)
        .attr('cy', vis.height/2)
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', 'black');
        //.attr('transform', d => `rotate(${d.pl_orbincl} ${vis.width/2},${vis.height/2})`);
    */
    vis.renderVis()

  }

  renderVis(){
    let vis=this; 
  }
}
