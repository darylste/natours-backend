const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGFyeWwxMyIsImEiOiJjbDc3ZHg0bmQwa3NyM3FwZzNhb3I4ZnN5In0.h5-7dA78DVZXgy22YGQaXA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/daryl13/cl77gxiu6000s14pnp51v5i5e',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((location) => {
  const el = document.createElement('div');
  el.classsName = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(location.coordinates)
    .setHTML(
      `<p>
        Day ${location.day}: ${location.description}
      </p>`
    )
    .addTo(map);

  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
