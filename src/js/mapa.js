(function() {
    const lat = document.querySelector('#lat').value || 20.67444163271174;
    const lng = document.querySelector('#lng').value || -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    marker.on('moveend', function(e) {
        const posicion = marker.getLatLng(); 
        mapa.panTo(posicion);

        //Obtener la información de las calles
        const geocodeService = L.esri.Geocoding.geocodeService(); 
        geocodeService.reverse().latlng(posicion).run(function(error, resultado) {
            if (error) {
                console.error(error);
                return;
            }
            console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel).openPopup(); 

            //Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value =  resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value =  resultado?.latlng?.lng ?? '';
        });
    });
})();
