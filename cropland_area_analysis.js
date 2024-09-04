 // centering the map on a geometry
Map.centerObject(geometry);

var time_start = '2001', time_end = '2024';

var modis = imageCollection.select('LC_Type1')
.filterDate(time_start, time_end);

function cropland_area(img){
  var thr = img.eq(12) .or (img.eq(14));
  var mask = thr.updateMask(thr);
  var area = mask.multiply(ee.Image.pixelArea().divide(1e6));
  return area
  .copyProperties(img,['system:time_start', 'system:time_end'])
}

var cropland = modis.map(cropland_area);

// Generate and print a time series chart of cropland area
print(
  ui.Chart.image.series({
    imageCollection: cropland,
    region: geometry,
    reducer: ee.Reducer.sum(),
    scale: 500,
    xProperty: 'system:time_start'
  }).setOptions({
    title: 'Kenya Cropland Area 2000 - 2022',
    vAxis: {title: 'Cropland Area (sq km)'},
    hAxis: {title: 'Year'}
  })
);