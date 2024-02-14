(function() {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    marker.on('moveend', function(e) {
        const posicion = marker.getLatLng(); // Corrección: Cambié 'getLatlng()' a 'getLatLng()'
        mapa.panTo(posicion);

        //Obtener la información de las calles
        const geocodeService = L.esri.Geocoding.geocodeService(); // Agregué esta línea para crear el servicio de geocodificación
        geocodeService.reverse().latlng(posicion).run(function(error, resultado) {
            if (error) {
                console.error(error);
                return;
            }
            console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel).openPopup(); // Corrección: Agregué 'openPopup()' para abrir el popup

            //Llenar los campos
            document.querySelector('.calle').textContent = resultado.address.Address || ''; // Usé operador lógico OR para manejar el caso de 'undefined' o 'null'
            document.querySelector('#calle').textContent = resultado.address.Address || ''; // Usé operador lógico OR para manejar el caso de 'undefined' o 'null'
            document.querySelector('#lat').textContent = resultado.latlng.lat || ''; // Usé operador lógico OR para manejar el caso de 'undefined' o 'null'
            document.querySelector('#lng').textContent = resultado.latlng.lng || ''; // Usé operador lógico OR para manejar el caso de 'undefined' o 'null'
        });
    });
})();
