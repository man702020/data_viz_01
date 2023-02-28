
class Histogram{

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth - 10 || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 40, right: 20, left: 50 },
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

    //vis.yScale = d3.scaleLinear()
        //.range([vis.height, 0]) 

    /*
    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSizeOuter(0);
    */
        

    //vis.yAxis = d3.axisLeft(vis.yScale)
        //.ticks(6)
        //.tickSizeOuter(0)
        //.ticks(7, ",.0f");
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
      .text('Distance of Exoplanet from Earth');

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart

    


          // Add x-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', vis.width / 2)
        .attr('y', vis.height + 30)
        .style('text-anchor', 'middle')
        .text('Number of Exoplanet Systems');

      // Add y-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', -vis.height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Distance from Earth');
      
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
    
        // Specificy x- and y-accessor functions

     var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.sy_dist })])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, vis.width]);



    var histogram = d3.histogram()
      .value(function(d) { return d.sy_dist; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic


    var bins = histogram(vis.data);

    var y = d3.scaleLinear()
      .range([vis.height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  
      vis.yScale = d3.scaleLinear()
        .range([vis.height, 0])
        .domain([0, d3.max(bins, function(d) { return d.length; })]);

     vis.svg.append("g")
      //.call(d3.axisLeft(y));

    vis.bar=vis.svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 50)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return vis.height - y(d.length)+40; })
        .style("fill", "#FFA500");
    
    vis.yAxis = d3.axisLeft(vis.yScale)

        // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis);

      vis.xScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.sy_dist })])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, vis.width]);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickSizeOuter(0);

    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);

    /*
     vis.bar
        .on('mouseover', (event,d) => {
            console.log("User over! ");

        d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Parameters</div>
              <ul>
                <li>Distance: ${d.sy_dist}</li>
              </ul>
            `);

        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });
    */

    //vis.yAxisG.call(vis.yAxis);

    vis.renderVis();
  }

  renderVis(){

  }
}
