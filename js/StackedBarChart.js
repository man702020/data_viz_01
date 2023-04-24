
class stackedBar{
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 350,
      containerHeight: 500,
      margin: {top: 50, right: 10, bottom: 80, left: 70},
    }
    this.data = _data;
    this.initVis();
  }
  
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);
    
    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(6);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Initialize stack generator and specify the categories or layers
    // that we want to show in the chart
    vis.stack = d3.stack()
        .keys(['yValue', 'zValue','aValue']);
    

    vis.color = d3.scaleOrdinal()
      .domain(['yValue', 'zValue','aValue'])
      .range(["#FF0000","#00FF00","#0000FF"]);

    vis.svg.selectAll("legdots")
      .data(['yValue', 'zValue','aValue'])
      .enter()
      .append("circle")
        .attr("cx", function(d,i){ return vis.config.margin.left + 30 + i*80})
        .attr("cy", vis.config.margin.top + vis.height + 30)
        .attr("r", 5)
        .style("fill", function(d){ return vis.color(d)})

        // Add x-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', vis.width / 2)
        .attr('y', vis.height + 55)
        .style('text-anchor', 'middle')
        .text('Months');

      // Add y-axis label
      vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', -vis.height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Number of Calls');


    vis.svg.selectAll("leglabels")
      .data(['yValue', 'zValue','aValue'])
      .enter()
      .append("text")
        .attr("x", function(d,i){ return vis.config.margin.left + i*80 + 40})
        .attr("y", vis.config.margin.top + vis.height + 30) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return vis.color(d)})
        .text(function(d){ 
          if(d=='yValue')
          {
            return 'Open'
          }
          else if(d=='zValue')
          {
            return 'Closed'
          }
          else
          {
            return 'New'
          }
        })
        //.attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")


    vis.updateVis();

  }


  updateVis() {
    let vis = this;

    vis.xScale.domain(["Jan","Feb","Mar", "Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]);
    vis.yScale.domain([0,6000]);

    // Call stack generator on the dataset
    vis.stackedData = vis.stack(vis.data);

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    console.log(vis.stackedData);

    //vis.groups = vis.svg.selectAll(".bars")
      //.data(vis.stackedData)
        //.join("g")
        //.attr("class", "bars")
        //.style("fill", d => vis.color(d.key));

    const rect = vis.chart.selectAll('category')
        .data(vis.stackedData)
      .join('g')
        .attr('class', d => `category cat-${d.key}`)
        .attr('fill', d=>vis.color(d.key))
      .selectAll('rect')
        .data(d => d)
      .join('rect')
        .attr('x', d => vis.xScale(d.data.xValue))
        .attr('y', d => vis.yScale(d[1]))
        .attr('height', d => vis.yScale(d[0]) - vis.yScale(d[1]))
        .attr('width', vis.xScale.bandwidth())
        /*
        .on('mouseover', (event,d) => {
            console.log("User on impact");
            d3.select('#tooltiptest')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltiptest-title">Month: ${d.data.xValue}</div>
              <ul>
                <li>Open: ${d.data.yValue}</li>
                <li>Closed: ${d.data.zValue}</li>
                <li>New: ${d.data.aValue}</li>;
                <li>Total:${d.data.yValue+d.data.zValue+d.data.aValue}</li>
              </ul>
            `);
          })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });
        */

    enableTooltip(rect, (d) => d.tooltip);

    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}