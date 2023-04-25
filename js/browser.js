console.log("Hello world");

const clickedData = JSON.parse(localStorage.getItem('clickedData'));

let clicked_sys_name= clickedData.sys_name; 

d3.csv('data/Exoplanets.csv')
  .then(_data => {
  	console.log('Data loading complete. Work with dataset.');
  	//data = _data;
  
    data = _data.filter(d => {
      return (d.sys_name==clicked_sys_name &&d.disc_year !== null && 
              d.sy_pnum !== null && 
              d.sy_snum !== null && 
              d.st_rad !== null && 
              d.st_mass !== null && 
              d.sy_dist !== null && 
              d.pl_orbsmax !== null && 
              d.discoverymethod !== null && 
              d.st_spectype !== null && 
              d.sys_name !== null
              && d.pl_rade!==null)
    });
    
    console.log(data); 

    orbitPlot= new orbitPlot({
      'parentElement' : '#orbitplot',
      'containerHeight': 500,
      'containerWidth': 1500
    }, data);
})