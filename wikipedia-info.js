const BAR = {

	lat: 0,
	lon: 0,
	places: "Punto cero",
	index: 0,
	color: "red",
	radius: 0.4,
	height: 40,
	offset: 0,
	radialSegments: 5,
	heightSegments: 1,
	openEnded: true

};


const WIKIPEDIA = {};

WIKIPEDIA.cors = "";

WIKIPEDIA.api = "https://en.wikipedia.org/w/api.php?";

WIKIPEDIA.query = "action=parse&format=json&origin=*&page=";

WIKIPEDIA.chartPrefix = "https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_";

WIKIPEDIA.templateUsa = "Template:COVID-19_pandemic_data/United_States_medical_cases_by_state";

WIKIPEDIA.templateGlobal = "Template:COVID-19_pandemic_data";

WIKIPEDIA.init = function () {

	resetGroups();

	const timeStartAll = performance.now();

	WIKIPEDIA.getPandemicData( GeoDataUsa, WIKIPEDIA.templateUsa );

	WIKIPEDIA.getPandemicData( GeoDataGlobal, WIKIPEDIA.templateGlobal );


};



WIKIPEDIA.getPandemicData = function (c19GeoData, chart ) {

	WIKIPEDIA.timeStart = performance.now();

	url =  WIKIPEDIA.cors + WIKIPEDIA.api + WIKIPEDIA.query + chart;

	WIKIPEDIA.requestFileUserData( url, WIKIPEDIA.onLoadData, c19GeoData );

};



WIKIPEDIA.requestFileUserData = function (url, callback, userData ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onload = ( xhr ) => callback( xhr, userData );
	xhr.send( null );

};



WIKIPEDIA.onLoadData = function (xhr, c19GeoData ) {


	const response = xhr.target.response;

	const json = JSON.parse( response );

	const text = json.parse.text[ "*" ];


	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const table = html.querySelector( ".wikitable" );

	const trs = table.querySelectorAll( "tr" );

	let rows = Array.from( trs ).slice( 0, - 2 ).map( tr => tr.innerText.trim()
		.replace( /\[(.*?)\]/g, "" )
		.split( "\n" ) );


	if ( c19GeoData === GeoDataUsa ) {

		const totals = rows[ 2 ];
		WIKIPEDIA.totalsUsa = totals;
		WIKIPEDIA.parseUsa( rows );

	} else {

		const totals = rows[ 1 ];
		WIKIPEDIA.totalsGlobal = totals;
		WIKIPEDIA.parseGlobal( rows );

		estadisticas.init();

	}

};



WIKIPEDIA.parseUsa = function (rows ) {


	GeoDataUsa.forEach(state => {

		const find = rows.slice( 1 ).find( row => row[ 0 ] === state.region );

		if ( find ) {

			state.cases = find[ 2 ].trim().replace( /,/g, "" );
			state.deaths = find[ 4 ].trim().replace( /,/g, "" );
			state.recoveries = find[ 6 ].trim().replace( /,/g, "" );
			state.actives = (state.cases-state.deaths-state.recoveries)

		} else {


		}

	} );

	WIKIPEDIA.updateBars( GeoDataUsa );

};



WIKIPEDIA.parseGlobal = function (rows ) {


	const ignores = [ "Diamond Princess", "Greg Mortimer", "MS Zaandam", "Leopold I",
		"Recovered","Coral Princess", "Charles de Gaulle", "HNLMS Dolfijn", "International conveyances",
		"American Samoa", "Guam", "Guantanamo Bay", "USS Theodore Roosevelt", "Puerto Rico",
		"U.S. Virgin Islands", "Northern Mariana Islands" ];


	const filter1 = rows.filter( row => ignores.includes( row[ 0 ].trim() ) === false );

	const filter = filter1.filter( row => {

		const find1 = GeoDataGlobal.find(country => row[ 0 ] === country.country );

		const find2 = GeoDataGlobal.find(country => row[ 0 ] === country.region );

		return find1 || find2;

	} );


	const countries = filter.map( row => {

		let country;

		country = GeoDataGlobal.find(country => row[ 0 ] === country.country && country.region === "" );

		if ( country ) {

			country.cases = row[ 2 ].replace( /,/g, "" );
			country.deaths = row[ 4 ].replace( /,/g, "" );
			country.recoveries = row[ 6 ].replace( /,/g, "" );
			country.actives=(country.cases-country.deaths-country.recoveries);

		} else {

			country = GeoDataGlobal.find(country => row[ 0 ] === country.region );

			if ( country ) {

				country.cases = row[ 2 ].replace( /,/g, "" );
				country.deaths = row[ 4 ].replace( /,/g, "" );
				country.recoveries = row[ 6 ].replace( /,/g, "" );
				country.actives=(country.cases-country.deaths-country.recoveries);

			} else {


			}

		}

		return country;

	} );

	WIKIPEDIA.updateBars( countries );

};



WIKIPEDIA.updateBars = function (places ) {


	const heightsCases = places.map( line => Number( line.cases ) );

	meshCases = WIKIPEDIA.addBars( places, heightsCases, "red" );
	meshCases.userData.places = places;
	groupCasesWP.add( meshCases );

	const activeCases = places.map( line => Number( line.actives ) );

	meshActiveCases = WIKIPEDIA.addBars( places, activeCases, "deepskyblue" );
	groupActiveCasesWP.add( meshActiveCases );


	const heightsDeaths = places.map( line => Number( line.deaths ) );

	meshDeaths = WIKIPEDIA.addBars( places, heightsDeaths, "purple" );
	groupDeathsWP.add( meshDeaths );


	const heightsRecoveries = places.map( line => Number( line.recoveries ) );

	meshRecoveries = WIKIPEDIA.addBars( places, heightsRecoveries, "green" );
	groupRecoveriesWP.add( meshRecoveries );

};



WIKIPEDIA.addBars = function (places, heights, color = "red" ) {

	radius = 0.5;
	radialSegments = 5;
	heightSegments = 1;
	openEnded = true;

	let geometry = new THREE.CylinderBufferGeometry( 0.2, radius, 1, radialSegments, heightSegments, openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeScale( - 1, - 1, - 1 ) );

	const material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	const cases = new THREE.InstancedMesh( geometry, material, places.length );

	for ( let i = 0; i < places.length; i ++ ) {

		place = places[ i ];
		let height = isNaN( heights[ i ] ) ? 10 : Number( heights[ i ] );
		height = 0.05 * Math.sqrt( height );

		const matrix = BAR.getMatrixComposed( 50, place.latitude, place.longitude, height );
		cases.setMatrixAt( i, matrix );

	}

	return cases;

};



BAR.getMatrixComposed = function ( r = 50, lat = 0, lon = 0, height = 5 ) {

	const position = BAR.latLonToXYZ( r + 0.5 * height, lat, lon );
	const quaternion = new THREE.Quaternion().setFromUnitVectors(
		new THREE.Vector3( 0, 0, 1 ), position.clone().normalize() );
	const scale = new THREE.Vector3( 1, 1, height );
	const matrix = new THREE.Matrix4();
	matrix.compose( position, quaternion, scale );

	return matrix;

};



BAR.latLonToXYZ = function ( radius, lat, lon ) {

	const phi = ( 90 - lat ) * Math.PI / 180;
	const theta = ( 180 - lon ) * Math.PI / 180;

	const x = radius * Math.sin( phi ) * Math.cos( theta );
	const y = radius * Math.sin( phi ) * Math.sin( theta );
	const z = radius * Math.cos( phi );

	return new THREE.Vector3( - x, y, z );

};

