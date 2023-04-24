class BarChartStar{

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth-10 || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 50, bottom: 50, right: 20, left: 70 },
      tooltipPadding: _config.tooltipPadding || 15
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
      
    let vis = this; 

        // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales and axes
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.yScale = d3.scaleLog()
        .range([vis.height, 1]) 

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSizeOuter(0);
        

    vis.yAxis = d3.axisLeft(vis.yScale)
        //.ticks(6)
        .tickSizeOuter(0)
        .ticks(7, ",.0f");
        //.tickFormat(d3.formatPrefix('.0s', 1e6)); // Format y-axis ticks as millions

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    //vis.svg.append('Number of Stars vs Frequency of Stars');
    vis.svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', vis.config.containerWidth / 2+50)
      .attr('y', vis.config.margin.top / 2)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text('Variation of Stars');
    // SVG Group containing the actual chart; D3 margin convention
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

          // Add x-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', vis.width / 2)
        .attr('y', vis.height + 40)
        .style('text-anchor', 'middle')
        .text('Number of Stars');

      // Add y-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', -vis.height / 2)
        .attr('y', -50)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Frequency of Stars');
      
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

      vis.updateVis();
  }


  //leave this empty for now
 updateVis() { 
    let vis = this;

    // Specificy x- and y-accessor functions
    vis.xValue = d => d.xValue;
    vis.yValue = d => d.yValue;


    // Set the scale input domains
    vis.xScale.domain(vis.data.map(vis.xValue));

    vis.yScale.domain([1, d3.max(vis.data, vis.yValue)]);


        // Add rectangles
    let bars = vis.chart.selectAll('.bar')
        .data(vis.data, vis.xValue)
      .join('rect');
    
    bars.style('opacity', 0.5)
      .transition().duration(1000)
        .style('opacity', 1)
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(vis.xValue(d)))
        .attr('width', vis.xScale.bandwidth()-2)
        .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        .attr('y', d => vis.yScale(vis.yValue(d)))
        .attr('fill', '#00FF00');

    bars
        .on('mouseover', (event,d) => {
            console.log("User over! ");

        d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Number of Stars: ${d.xValue}</div>
              <ul>
                <li>Total Frequency: ${d.yValue}</li>
              </ul>
            `);

        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);


    vis.renderVis();
 }


 //leave this empty for now...
 renderVis() { 
        let vis = this;




  }
}

