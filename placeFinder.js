
// Test géolocalisation HTML5


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        // Création de la map avec l'objet L

        var map = L.map('map').setView([pos.lat, pos.lng], 12);

// Importation du layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 20,
        }).addTo(map);

        // Ajout d'un listener sur le bouton submit
        var submit = document.querySelector('#submit');

        submit.addEventListener('click', function(){

            // Au click, on récupère la valeur de l'input
            var venue = document.querySelector('#venue').value;

            // Préparation de la requète avec l'input
            const query = "https://api.foursquare.com/v2/venues/search" +
                `?client_id=${clientId}&client_secret=${privateId}&ll=${pos.lat},${pos.lng}&query=${venue}&v=20180509`; // requête de recherche de lieux a proximité des coordonnées

            // Test si l'input est set
            if (venue.value == ' ') {
                alert('Entrez une recherche');
            } else {
                window.fetch(query)
                    .then(res => res.json())
                    .then(function (resJson) { // Récupération de la réponse API en JSON

                        // On efface le contenu de la div content
                        var content = document.getElementById('content');
                        while (content.firstChild) {
                            content.removeChild(content.firstChild);
                        }

                        // On rempli la div content avec l'input de la dernière recherche
                        for (var i = 0; i < resJson.response.venues.length; i++) {
                            var title = document.createElement('h6');
                            title.setAttribute('class', 'title');
                            title.innerHTML = resJson.response.venues[i].name;
                            content.appendChild(title);
                        }

                        var apiRes = [...document.querySelectorAll('.title')]; // Transformation de la NodeList en Array (Spread Operator) ES6

                        apiRes.forEach(function (item) {
                            item.onclick = function () {

                                const details = `https://api.foursquare.com/v2/venues/${resJson.response.id}` +
                                    `?client_id=${clientId}&client_secret=${privateId}&v=20180509`;

                                // Centre la carte sur le nouveau point
                                map.setView([   resJson.response.venues[apiRes.indexOf(item)].location.lat,
                                                resJson.response.venues[apiRes.indexOf(item)].location.lng], 14);

                                // Ajout d'un marqueur
                                // IndexOf récupère l'index du tableau nodelist et le fait correspondre à l'index de la reponse API
                                var marker = L.marker([ resJson.response.venues[apiRes.indexOf(item)].location.lat,
                                                        resJson.response.venues[apiRes.indexOf(item)].location.lng]).addTo(map);

                                // Customisation du marker
                                marker.bindPopup(
                                    '<h3>'+ resJson.response.venues[apiRes.indexOf(item)].name +'</h3>'
                                    +
                                    '<p>'+ resJson.response.venues[apiRes.indexOf(item)].location.address +'</p>'
                                );
                            }
                        })
                    });
            }
        });

    })

} else {
    alert('Votre navigateur ne supporte pas la géolocalisation!');
}















