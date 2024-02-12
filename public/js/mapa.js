(function() {
  const lat = 13.6756466;
  const lng = -89.2824174;
  const mapa = L.map('mapa').setView([lat, lng ], 16);
  let marker;

  //Utilizar provider y geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  //el pin
  marker = new L.marker([lat,lng], {
    draggable: true,
    autoPan: true
  })
  .addTo(mapa)

  //Detectar el movimiento del pin lat lng

  marker.on('moveend', function(event){
    marker = event.target

    const posicion = marker.getLatLng();

    mapa.panTo(new L.latLng(posicion.lat, posicion.lng))

    //Obtener informacion de las calles al soltar el pin
    geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){
      marker.bindPopup(resultado.address.LongLabel)

      //llenar los campos

      document.querySelector('.calle').textContent = resultado?.address.Address ?? '';
      document.querySelector('#calle').value = resultado?.address.Address ?? '';

    })

  })



})()