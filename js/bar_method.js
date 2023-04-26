class BarChartMethod{

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
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
    

    vis.yScale = d3.scaleLog()
        .range([vis.height, 1]) 

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
        //.ticks(6)
        .ticks(7, ",.0f")
        .tickSizeOuter(0)
        //.tickFormat(d3.formatPrefix('.0s', 1e6)); // Format y-axis ticks as millions

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
      .text('Discovery of Exoplanet systems');

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`)


    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis); // add a margin to the bottom of the text
    
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
        .text('Discovery Method');

      // Add y-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', -vis.height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Number of Systems');
      
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


    //vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
    
    vis.colorScale = d3.scaleOrdinal()
    .domain(vis.data.map(d => d.xValue))
    .range(d3.schemeSet2);

    vis.renderVis();
    
 }


 //leave this empty for now...
 renderVis() { 
        let vis = this;



    // Add rectangles
    let bars = vis.chart.selectAll('.bar')
        .data(vis.data, vis.xValue)
      .join('rect');
    
    bars.style('opacity', 0.5)
      .transition().duration(1000)
        .style('opacity', 1)
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(vis.xValue(d)))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        .attr('y', d => vis.yScale(vis.yValue(d)))
        .attr('fill', d => vis.colorScale(d.xValue));
        //.attr('fill','#808080')
        //.attr("transform", "rotate(90)")

      var legendCircles = vis.chart.selectAll('.legend-circle')
        .data(vis.data)
        .enter()
        .append('circle')
        .attr('class', 'legend-circle')
        .attr('r', 6) // Set the radius of the circles to 6 pixels
        .attr('cx', vis.width+17) // Set the x-coordinate of the circles
        .attr('cy', function(d, i) { return 0 + i * 20; }) // Set the y-coordinate of the circles
        .style('fill', function(d) { return vis.colorScale(d.xValue); }); // Set the fill color of the circles using the color scale
    
    var legendLabels = vis.chart.selectAll('.legend-label')
        .data(vis.data)
        .enter()
        .append('text')
        .attr('class', 'legend-label')
        .attr('x', vis.width + 27) // Set the x-coordinate of the labels
        .attr('y', function(d, i) { return 0+ i * 20; }) // Set the y-coordinate of the labels
        .attr('dy', '0.3em') // Adjust the vertical alignment of the labels
        .text(function(d) { return d.xValue; }); // Set the text of the labels to the data item

        
     // Style the labels
    legendLabels
       .style('font-size', '12px')
        .style('fill', function(d) { return vis.colorScale(d.xValue); })
        .style('text-anchor', 'start'); 
    
    bars.on("click", function(d) {
        window.location.href = "https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets";
        });

    bars
        .on('mouseover', (event,d) => {
            console.log("User over! ");

        d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Discovery Method: ${d.xValue}</div>
              <ul>
                <li>Total Frequency: ${d.yValue}</li>
              </ul>
            `);

        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

  }
}


