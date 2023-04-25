class orbitPlot {

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
      .text('Exoplanet System');

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.updateVis(); 
  }

  updateVis(){
    let vis = this;

    vis.number = d => d.sy_snum;

    console.log(vis.data);
    vis.circles=vis.chart.selectAll('.point')
        .data(vis.data)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('r', d=>d.pl_rade)
        .attr('cy', vis.height/2)
        .attr('cx', d=>vis.width/2+d.sy_dist/8500*1500) //8500 is d.sy_dist max * 1500 is vis.width
        .attr('fill', 'blue')
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('opacity',0.5);
    
    vis.sun_circles=vis.chart.selectAll('.sun_point')
        .data(vis.data)
        .enter()
        .append('circle')
        .attr('class', 'sun_point')
        .attr('r', d=>d.st_rad)
        .attr('cy', vis.height/2)
        .attr('cx', d=>vis.width/2)
        .attr('fill', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('opacity',0.5);

    vis.ellipses = vis.chart.selectAll('.ellipse')
        .data(vis.data)
        .enter()
        .append('ellipse')
        .attr('class', 'ellipse')
        .attr('rx', d => d.pl_orbsmax) // semi-major axis
        .attr('ry', d => d.pl_orbsmax * Math.sqrt(1 - d.pl_orbeccen ** 2)) // semi-minor axis
        .attr('cx', d=>vis.width/2+d.sy_dist/8500*1500)
        .attr('cy', vis.height/2)
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', 'black')
        .attr('transform', d => `rotate(${d.pl_orbincl} ${vis.width/2},${vis.height/2})`);

    vis.renderVis()

  }

  renderVis(){
    let vis=this; 
  }
}
