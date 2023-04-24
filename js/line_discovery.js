
class LineChart{

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 80, right: 20, left: 70 },
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
      
    let vis = this; 

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleTime()
        .range([0, vis.width])
        .domain([1992,2023]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .nice()
        .domain([0,3000]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSizeOuter(0)
        .ticks(7)
        .tickFormat(d=>d*1);
        //.tickPadding(10);
        //.tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
        //.tickformat(d=>d*1000);
        //.ticks(4)
        //.tickSizeOuter(0)
        //.tickPadding(10);

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

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis);

    vis.marks = vis.chart.append('g');
    

    // Add y-axis label
    vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', -vis.height / 2)
        .attr('y', -50)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Number of Discoveries');
      
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
   

    vis.trackingArea = vis.chart.append('rect')
        .attr('width', vis.width)
        .attr('height', vis.height)
        .attr('fill', 'transparent')
        .attr('pointer-events', 'all');
    
        // Empty tooltip group (hidden by default)
    vis.tooltip = vis.chart.append('g')
        .attr('class', 'tooltip')
        .style('display', 'none');

    vis.tooltip.append('circle')
        .attr('r', 4);

    vis.tooltip.append('text');

    vis.updateVis();


  }


  //leave this empty for now
 updateVis() { 
    let vis = this;


    vis.xValue = d => d.year;
    vis.yValue = d => d.discovery;

    
    vis.line = d3.line()
        .x(d => vis.xScale(vis.xValue(d)))
        .y(d => vis.yScale(vis.yValue(d)));
    
    // Set the scale input domains
    vis.xScale.domain(d3.extent(vis.data, vis.xValue));
    vis.yScale.domain(d3.extent(vis.data, vis.yValue));

    vis.bisectDate = d3.bisector(vis.xValue).left;

    vis.renderVis();

 }


 //leave this empty for now...
 renderVis() { 
    let vis = this;

    // Add line path
    
    vis.marks.selectAll('.chart-line')
        .data([vis.data])
      .join('path')
        .attr('class', 'chart-line')
        .attr('d', vis.line)
        .attr('fill','#4169E1');
    
    //console.log("Linechart completed");
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
          const d = b && (year - a.year > b.year - year) ? b : a; 

          // Update tooltip
          vis.tooltip.select('circle')
              .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.discovery)})`);
          
          vis.tooltip.select('text')
              .attr('transform', `translate(${vis.xScale(d.year)},${(vis.yScale(d.discovery) - 15)})`)
              .text(Math.round(d.discovery));
        });

    }
}
