class BarChartGroup{

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 40, bottom: 80, right: 20, left: 70 },
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

    vis.stack = d3.stack()
      .keys(['yValue', 'zValue']);

    vis.color = d3.scaleOrdinal()
      .domain(['yValue', 'zValue'])
      .range(["#2196F3","#F44336"]);

    vis.svg.selectAll("legdots")
      .data(['yValue', 'zValue'])
      .enter()
      .append("circle")
        .attr("cx", function(d,i){ return vis.config.margin.left + 150 + i*80})
        .attr("cy", vis.config.margin.top + vis.height + 30)
        .attr("r", 5)
        .style("fill", function(d){ return vis.color(d)})

        // Add x-axis label
     vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', vis.width / 2)
        .attr('y', vis.height + 65)
        .style('text-anchor', 'middle')
        .text('Spectral Type');

      // Add y-axis label
     vis.chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', -vis.height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Habitable and Unhabitable System');

    vis.svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', vis.config.containerWidth / 2+50)
        .attr('y', vis.config.margin.top / 2+10)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Habitable vs Unhabitable Systems');

    vis.svg.selectAll("leglabels")
      .data(['yValue', 'zValue'])
      .enter()
      .append("text")

        .attr("x", function(d,i){ return vis.config.margin.left + i*80 + 160})
        .attr("y", vis.config.margin.top + vis.height + 30) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return vis.color(d)})
        .text(function(d){ 
          if(d=='yValue')
          {
            return 'Habitable'
          }
          else
          {
            return 'Unhabitable'
          }
        })
        //.attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    vis.updateVis();

  }


  //leave this empty for now
 updateVis() { 
    let vis = this;

    vis.xScale.domain(['A','F','G','K','M']);
    vis.yScale.domain([0,800]);

    vis.stackedData = vis.stack(vis.data);

    vis.renderVis();
 }


 //leave this empty for now...
 renderVis() { 
  
  let vis=this; 

  vis.rectangles= vis.chart.selectAll('category')
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
          .attr('width', vis.xScale.bandwidth());
        

    vis.rectangles
      .on('mouseover', (event,d) => {
        console.log("User on impact");

        d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
        .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
        .html(` 
          <div class="tooltip-title">Spectral Type: ${d.data.xValue}</div>
          <ul>
            <li>Habitable Planets: ${d.data.yValue}</li>
            <li>Unhabitable Planets: ${d.data.zValue}</li>
          </ul>
        `);
      })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
    });
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
    /*
        vis.rectangles=vis.chart.selectAll('.category')
        .data(vis.stackedData)
      .join('g')
        .attr('class', d => `category cat-${d.key}`)
      .selectAll('rect')
        .data(d => d)
      .join('rect')
        .attr('x', d => vis.xScale(d.data.xValue))
        .attr('y', d => vis.yScale(d[1]))
        .attr('height', d => vis.yScale(d[0]) - vis.yScale(d[1]))
        .attr('width', vis.xScale.bandwidth())
        .attr("fill", d =>vis.color(d.key))
        .attr("border",1)
        .attr('opacity','.9')
        .attr('stroke-width', 1)
        .attr('stroke', 'black');

        vis.rectangles
          .on('mouseover', (event,d) => {
            console.log("User on impact");

            d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(` 
              <div class="tooltip-title">Spectral Type: ${d.data.xValue}</div>
              <ul>
                <li>Habitable Planets: ${d.data.yValue}</li>
                <li>Unhabitable Planets: ${d.data.zValue}</li>
              </ul>
            `);
          })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });
    */

    


}
}

