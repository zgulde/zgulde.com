//todo: 
//refactor inputs to be within a form, can prevent page refresh with
// .preventDefault()
$(document).ready(function(){
	var mapOptions = {
        zoom: 10,
        center: {lat: 29.425967, lng: -98.486142},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map($('#map-area').get(0), mapOptions);
    var searchResults = [];
    var resultsIndex = 0;
    var marker = new google.maps.Marker({
		position: map.center,
		map: map,
		animation: google.maps.Animation.DROP
	});

	//returns a forecastOptions object with numberOfDays and
	//checkboxOptions properties
	function getForecastOptions () {
		return {
			checkboxOptions : {
				iconIsChecked : $('#icon-checkbox').is(':checked'),
				descriptionIsChecked : $('#description-checkbox').is(':checked'),
				lowHighIsChecked : $('#low-high-checkbox').is(':checked'),
				tempAvgIsChecked : $('#temp-avg-checkbox').is(':checked'),
				humidityIsChecked : $('#humidity-checkbox').is(':checked')
			},
			numberOfDays : $('#num-of-days').val()
		};
	}

	//builds the forecast-day divs and updates the content of the appropriate elements
	//sends the ajax request and when it is done builds each day with the selected options
	function buildDailyForecast(forecastOptions){
		var columnSize = "col-md-" + Math.floor(12/forecastOptions.numberOfDays);
		var latitude = searchResults[resultsIndex].geometry.location.lat();
		var longitude = searchResults[resultsIndex].geometry.location.lng();

		$('#daily-forecast').html('');
    	$('#location-select').html('');

    	$('#location-search-input').val(searchResults[resultsIndex].formatted_address);
    	$('#current-location').text(searchResults[resultsIndex].formatted_address);
    	$('#current-lat-lng').text(latitude.toFixed(2) + ', ' + longitude.toFixed(2));

    	map.panTo(searchResults[resultsIndex].geometry.location);
    	marker.setPosition(map.center);
    	for (var i = 0; i < searchResults.length; i++) {
    		$('#location-select').append('<option value="'+i+'">'+searchResults[i].formatted_address+'</option>');
    	}
    	$('#location-select').val(resultsIndex);

		for (var i = 0; i < forecastOptions.numberOfDays; i++) {
			$('#daily-forecast').append('<div class="'+columnSize+' forecast-day"></div>');
		}
		if (12%forecastOptions.numberOfDays != 0) {
		    $('.forecast-day').first().addClass('col-md-offset-1');
		}

		$.get('http://api.openweathermap.org/data/2.5/forecast/daily',{
				APPID: "f74c0a4204389722b788e0af5c916ffa",
				lat:    latitude,
			    lon:    longitude,
				units: "imperial",
				cnt: forecastOptions.numberOfDays
		}).done(function(data){
			$('.forecast-day').each(function(index,h4){
				var date = new Date(data.list[index].dt * 1000);
				var dailyMin = Math.round(data.list[index].temp.min);
				var dailyMax = Math.round(data.list[index].temp.max);
				var dailyAvg = Math.round(data.list[index].temp.day);

				$(this).append('<p class="date">' + date.toLocaleString().substring(0,date.toLocaleString().indexOf(',') ) + '</p>');

				if(forecastOptions.checkboxOptions.iconIsChecked){
					$(this).append('<img src="http://openweathermap.org/img/w/'+data.list[index].weather[0].icon+'.png">');
				}
				if (forecastOptions.checkboxOptions.descriptionIsChecked) {
					$(this).append('<p>'+data.list[index].weather[0].description+'</p>');
				}
				if (forecastOptions.checkboxOptions.tempAvgIsChecked) {
					$(this).append('<p>'+dailyAvg+'°</p>');
				}
				if (forecastOptions.checkboxOptions.lowHighIsChecked) {
					$(this).append('<p>'+dailyMin+'° / '+dailyMax+'°</p>');
				}
				if (forecastOptions.checkboxOptions.humidityIsChecked) {
					$(this).append('<p>'+data.list[index].humidity+'% humidity</p>');
				}

			}); // end of columnSize.each()
		});// end of ajax.done()
	}

	$('#location-results').hide();
	$('#drop-marker-btn').hide();

	//creates a geocoder and geocodes based on wheter the
	//search field or marker is used
	//shows the search-results area
	//sets the searchResults to the geocoder results
	//calls buildDailyForecast with getForecastOptions()
	$('#go-btn').click(function(){
		var geocoder = new google.maps.Geocoder();
		var geocoderRequest = {};
		resultsIndex = 0;

		$('#forecast-options').slideUp(300);
		$('.options-area').children().first().attr('pseudo-content','<');
		$('.options-area').children().first().attr('expanded','false');
		$('#location-results').slideDown(300);

		if( $('#search-by-marker-btn').is(':checked') ){
			geocoderRequest = {
				location: {
					lat: marker.getPosition().lat(),
					lng: marker.getPosition().lng()
				}
			}
		} else {
			geocoderRequest = {
				address: $('#location-search-input').val()
			}	
		}

		geocoder.geocode(geocoderRequest, function(results, status) {
	            if (status == google.maps.GeocoderStatus.OK) {
	            	searchResults = results;
	            	buildDailyForecast(getForecastOptions());
	            } else {
	                alert("Geocoding was not successful - STATUS: " + status);
	            }
	        });
	});

	$('.forecast-option').attr('pseudo-content','V').attr('expanded','true');
	$('.forecast-option').click(function(){
		$(this).next().slideToggle(300);
		if($(this).attr('expanded') === 'true'){
			$(this).attr('expanded','false');
			$(this).attr('pseudo-content','<');
		} else {
			$(this).attr('expanded','true');
			$(this).attr('pseudo-content','V');
		}
	});


	$('#location-select').change(function(){
		resultsIndex = $('#location-select').val();
		buildDailyForecast(getForecastOptions());
	});

	$('#drop-marker-btn').click(function(){
		marker.setPosition(map.center);
	});

	$('#search-by-marker-btn').click(function(){
		$('#location-search-input').hide();
		$('#drop-marker-btn').slideDown(300);
	});

	$('#search-by-string-btn').click(function(){
		$('#drop-marker-btn').hide();
		$('#location-search-input').slideDown(300);
	});

});