class ScatterPlot {

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

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right-100;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales
    vis.colorScale = d3.scaleOrdinal()
        .range(['#FF00FF', '#FF0000', '#0000FF','#00FF00'])
        .domain(['Number of Star: 1','Number of Star: 2','Number of Star: 3', 'Number of Star: 4']);
        

    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSize(-vis.height - 20)
        .tickPadding(10)

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSize(-vis.width - 5)
        .tickPadding(10);

    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.svg.append('text')
        .attr('class', 'chart-title')
      .attr('x', vis.config.containerWidth / 2)
      .attr('y', vis.config.margin.top / 2-15)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text('Variation of weight and volume of the exoplanet System');
    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Append both axis titles

              // Add x-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', vis.width / 2)
        .attr('y', vis.height + 40)
        .style('text-anchor', 'middle')
        .text('Stellar Mass (Solar Mass)');

      // Add y-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', -vis.height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Stellar Radius (Solar Radius)');
      
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

updateVis() {
    let vis = this;

    vis.xValue = d => d.st_mass;
    vis.yValue = d => d.st_rad;

    vis.colorValue = d => d.sy_snum;

    //console.log(vis.colorValue);
    vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

    vis.circles=vis.chart.selectAll('.point')
        .data(vis.data)
        .enter()
      .append('circle')
        .attr('class', 'point')
        .attr('r', d =>  d.sys_name === "30 Ari B" ? 25: d.st_rad/3)
        .attr('cy', d => vis.yScale(vis.yValue(d)))
        .attr('cx', d => vis.xScale(vis.xValue(d)))
        .attr('fill', (d) => vis.colorScale(d.sy_snum))
        //.attr('fill', d => vis.colorScale(vis.colorValue(d)))
        .attr('stroke-width', d => d.sys_name === "30 Ari B" ? 2 : 1)
        .attr('stroke', 'black')
        .attr('opacity', d => d.sys_name === "30 Ari B" ? 0.9 : 0.6);
    
   
    var legendCircles = vis.chart.selectAll('.legend-circle')
        .data(['Number of Star: 1', 'Number of Star: 2', 'Number of Star: 3', 'Number of Star: 4'])
        .enter()
        .append('circle')
        .attr('class', 'legend-circle')
        .attr('r', 6) // Set the radius of the circles to 6 pixels
        .attr('cx', vis.width+40) // Set the x-coordinate of the circles
        .attr('cy', function(d, i) { return vis.height*2/3 + i * 20; }) // Set the y-coordinate of the circles
        .style('fill', function(d) { return vis.colorScale(d); }); // Set the fill color of the circles using the color scale
    
    var legendLabels = vis.chart.selectAll('.legend-label')
        .data(['Stars: 4', 'Stars: 3', 'Stars: 2', 'Stars: 1'])
        .enter()
        .append('text')
        .attr('class', 'legend-label')
        .attr('x', vis.width + 50) // Set the x-coordinate of the labels
        .attr('y', function(d, i) { return vis.height*2/3 + i * 20; }) // Set the y-coordinate of the labels
        .attr('dy', '0.3em') // Adjust the vertical alignment of the labels
        .text(function(d) { return d; }); // Set the text of the labels to the data item

        
     // Style the labels
    legendLabels
       .style('font-size', '12px')
        .style('fill', function(d) { return vis.colorScale(d); })
        .style('text-anchor', 'start'); 

    vis.circles
          .on('mouseover', (event,d) => {
            d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">System Name: ${d.sys_name}</div>
              <ul>
                <li>System Mass: ${d.st_mass}</li>
                <li>System Radius: ${d.st_rad}</li>
              </ul>
            `);
          })
        .on('click',(event,d) => { 
          localStorage.setItem('clickedData', JSON.stringify(d));
          window.open('browser.html', '_blank');
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

    vis.xAxisG
        .call(vis.xAxis)
        .call(g => g.select('.domain').remove());

    vis.yAxisG
        .call(vis.yAxis)
        .call(g => g.select('.domain').remove());

    
    vis.renderVis();
  }

  renderVis() {
    
    let vis = this;


    }
}