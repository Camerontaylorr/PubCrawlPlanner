let map;
let places;
let infoWindow;
let markers = [];
var addresses11 = [];
let autocomplete;
var myLatLng =[];
var ltylng;


const countryRestrict = { country: "us" };
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");
const countries = {
  au: {
    center: { lat: -25.3, lng: 133.8 },
    zoom: 4,
  },
  br: {
    center: { lat: -14.2, lng: -51.9 },
    zoom: 3,
  },
  ca: {
    center: { lat: 62, lng: -110.0 },
    zoom: 3,
  },
  fr: {
    center: { lat: 46.2, lng: 2.2 },
    zoom: 5,
  },
  de: {
    center: { lat: 51.2, lng: 10.4 },
    zoom: 5,
  },
  mx: {
    center: { lat: 23.6, lng: -102.5 },
    zoom: 4,
  },
  nz: {
    center: { lat: -40.9, lng: 174.9 },
    zoom: 5,
  },
  it: {
    center: { lat: 41.9, lng: 12.6 },
    zoom: 5,
  },
  za: {
    center: { lat: -30.6, lng: 22.9 },
    zoom: 5,
  },
  es: {
    center: { lat: 40.5, lng: -3.7 },
    zoom: 5,
  },
  pt: {
    center: { lat: 39.4, lng: -8.2 },
    zoom: 6,
  },
  us: {
    center: { lat: 37.1, lng: -95.7 },
    zoom: 3,
  },
  uk: {
    center: { lat: 54.8, lng: -4.6 },
    zoom: 5,
  },
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: countries["uk"].zoom,
    center: countries["uk"].center,
    mapTypeControl: true,
    panControl: false,
    zoomControl: true,
    streetViewControl: true,
  });
  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("info-content"),
  });
  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
      types: ["(cities)"],
      componentRestrictions: countryRestrict,
    }
  );
  places = new google.maps.places.PlacesService(map);
  autocomplete.addListener("place_changed", onPlaceChanged);
  // Add a DOM event listener to react when the user selects a country.
  document
    .getElementById("country")
    .addEventListener("change", setAutocompleteCountry);
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  const place = autocomplete.getPlace();

  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
  } else {
    document.getElementById("autocomplete").placeholder = "Enter a city";
  }
}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
  const search = {
    bounds: map.getBounds(),
    types: ['bar','restaurant'],
  };
  places.nearbySearch(search, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();

      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (let i = 0; i < results.length; i++) {
        const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
        const markerIcon = MARKER_PATH + markerLetter + ".png";
        // Use marker animation to drop the icons incrementally on the map.
        
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
       //   icon: markerIcon,  
        });
      //  console.log(markers)
        DrawLine();

        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], "click");
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);

    }
  }
  markers = [];
  
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.
function setAutocompleteCountry() {
  const country = document.getElementById("country").value;

  if (country == "all") {
    autocomplete.setComponentRestrictions({ country: [] });
    map.setCenter({ lat: 15, lng: 0 });
    map.setZoom(2);
  } else {
    autocomplete.setComponentRestrictions({ country: country });
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
  }
  clearResults();
  clearMarkers();
}


function dropMarker(i) {
  return function () {
      markers[i];
   //   console.log(i);
  };
}


function addResult(result, i) {
  const results = document.getElementById("results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");
  tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";

  tr.onclick = function () {
    dropMarker(i);
    markers[i].setMap(map);
    console.log(result.name);
    console.log(result);
    console.log(result.plus_code.global_code);
    console.log(result.vicinity);
    var a = result.plus_code.global_code;
    var area = OpenLocationCode.decode(a);
  //var original_code = OpenLocationCode.encode(area.latitudeCenter, area.longitudeCenter, area.codeLength);
    var lat = parseFloat(area.latitudeCenter);
    var lng = parseFloat(area.longitudeCenter);
    console.log("lat: " + lat + " lng: " + lng);
    var lat1 = parseFloat(lat);
    var lng1 = parseFloat(lng);
    const newlatlng = new google.maps.LatLng(lat1, lng1);

    myLatLng.push(newlatlng);
  //  myLatLng =  [lat1, lng1];
 addTextBox();

    DrawLine();
    console.log("area: "+ myLatLng);
    
    
   // addresses11 = result.vicinity;
    addresses11.push(result.name);
    console.log("address array " + addresses11);
  //  myLatLng.push(pos);
   // geocodeAddress();

    
    //  console.log(result.location);
    //google.maps.event.trigger(markers[i], "click");

    google.maps.event.addListener(map, 'click', function(event) {
      //console.log(result.location);
   });
   

  };
  const iconTd = document.createElement("td");
  const nameTd = document.createElement("td");
  const icon = document.createElement("img");
  icon.src = markerIcon;
  icon.setAttribute("class", "placeIcon");
  icon.setAttribute("className", "placeIcon");
  const name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  const results = document.getElementById("results");

  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

  function DrawLine(){
    const pubPath = new google.maps.Polyline({
      path: myLatLng,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    pubPath.setMap(map);
}

function addTextBox()
{
  document.getElementById("results").onclick = function() {
    var form = document.getElementById("myForm");
    var input = document.createElement("input");
    var values = ["Beer", "Wine", "Spirit", "Shot"];
    var select = document.createElement("select");
    select.name = "Drinks";
    select.id = "Drinks";
    input.type = "text";
    for(var i = 0; i < addresses11.length; i++){
    input.value = addresses11[i];
    }
    for (const val of values) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      select.appendChild(option);
    }
    var br = document.createElement("br");

    form.appendChild(input).readOnly = true;;
    form.appendChild(select);
    form.appendChild(br);

    
  }
}



      
