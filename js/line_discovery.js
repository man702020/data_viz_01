class LineChart{

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 50, bottom: 50, right: 20, left: 70 },
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }
  initVis() {
    let vis = this; 

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);
    
    vis.svg.append('text')
        .attr('class', 'chart-title')
      .attr('x', vis.config.containerWidth / 2)
      .attr('y', vis.config.margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text('Exoplanet discovery with time');

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        
  }
  updateVis(){

  }
  renderVis(){

  }
}


/*
class LineChart{

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth ,
      containerHeight: _config.containerHeight,
      margin: { top: 50, bottom: 50, right: 20, left: 270 },
      tooltipPadding: _config.tooltipPadding || 15
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
    let vis = this; 
    
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
       .attr('width', vis.config.containerWidth)
       .attr('height', vis.config.containerHeight);
    
    vis.svg.append('text')
        .attr('class', 'chart-title')
      .attr('x', vis.config.containerWidth / 2+100)
      .attr('y', vis.config.margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text('Exoplanet discovery with time');

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xScale = d3.scaleTime()
        .range([0, vis.width])
        .domain([1992,2023]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .nice()
        .domain([0,3000]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(d=>d*1);
        //.tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(4)
        .tickSizeOuter(0)
        .tickPadding(10);

    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis);
    
    // Add x-axis line
    vis.chart.append('line')
      .attr('class', 'axis-line')
      .attr('x1', 0)
      .attr('y1', vis.height)
      .attr('x2', vis.width)
      .attr('y2', vis.height);

    // Add y-axis line
    vis.chart.append('line')
      .attr('class', 'axis-line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', vis.height); 

    vis.marks = vis.chart.append('g');
     // Add y-axis label
    vis.chart.append('text')
     .attr('class', 'axis-label')
     .attr('x', -vis.height / 2)
     .attr('y', -50)
     .style('text-anchor', 'middle')
     .attr('transform', 'rotate(-90)')
     .text('Number of Discoveries');
    
     vis.chart.append('text')
     .attr('class', 'axis-label')
     .attr('x', vis.width / 2)
     .attr('y', vis.height + 40)
     .style('text-anchor', 'middle')
     .text('Years');

    vis.updateVis();
    
  }
  updateVis(){
    let vis=this; 
    console.log(vis.data); 
    vis.xValue = d => d.year;
    vis.yValue = d => d.discovery;

    
    vis.line = d3.line()
      .x(d => vis.xScale(vis.xValue(d)))
      .y(d => vis.yScale(vis.yValue(d)));

    vis.bisectDate = d3.bisector(vis.xValue).left;

    
    
    vis.marks.selectAll('.chart-line')
    .data([vis.data])
    .join('path')
    .attr('stroke','#4169E1')
    .attr('fill','none')
    .attr('class', 'chart-line')
    .attr('d', vis.line)
    .attr('stroke-width', 3);
    //.attr('fill','#4169E1');
    vis.trackingArea = vis.chart.append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

        //(event,d) => {

    // Empty tooltip group (hidden by default)
    vis.tooltip = vis.chart.append('g')
        .attr('class', 'tooltip')
        .style('display', 'none');

    vis.tooltip.append('circle')
        .attr('r', 4);

    vis.tooltip.append('text');

    vis.trackingArea
      .on('mouseenter', () => {
        vis.tooltip.style('display', 'block');
      })
      .on('mouseleave', () => {
        vis.tooltip.style('display', 'none');
      })
      .on('mousemove', function(event) {
        // Get date that corresponds to current mouse x-coordinate
        const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
        const year = vis.xScale.invert(xPos);

        // Find nearest data point
        const index = vis.bisectDate(vis.data, year, 1);
        const a = vis.data[index - 1];
        const b = vis.data[index];
        const c = b && (year- a.year > b.year- year) ? b : a; 

        //console.log(c); 
        d3.select('#tooltip')
          .style('display', 'block')
          .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
          .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
          .html(` 
            <div class="tooltip-title">Year:${c.year}</div>
            <div class="tooltip-title">Total Number of Discoveries: ${c.discovery}</div>
          `);
        
    });

    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
    vis.renderVis();

  }
  renderVis(){
        // Add line path
    let vis = this;

  }
}
*/