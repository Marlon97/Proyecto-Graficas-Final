
const estadisticas = {};

estadisticas.Africa = { cases: 0, deaths: 0, recoveries: 0 };
estadisticas.Americas = { cases: 0, deaths: 0, recoveries: 0 };
estadisticas.Asia = { cases: 0, deaths: 0, recoveries: 0 };
estadisticas.Europe = { cases: 0, deaths: 0, recoveries: 0 };
estadisticas.Oceania = { cases: 0, deaths: 0, recoveries: 0 };

function trunc (x, posiciones = 0) {
	var s = x.toString()
	var l = s.length
	var decimalLength = s.indexOf('.') + 1
	var numStr = s.substr(0, decimalLength + posiciones)
	return Number(numStr)
}

estadisticas.init = function () {

	GeoDataGlobal.forEach(country => {

		if ( country.region === "" ) {

			const continent = estadisticas[ country.continent ];

			continent.cases += Number( country.cases ) || 0;
			continent.deaths += Number( country.deaths ) || 0;
			continent.recoveries += Number( country.recoveries ) || 0;

		} else {

		}
	} );

	TEXTO.addTextContinents();

};

TEXTO.addTextContinents = function () {

	SHConf.scene.remove( TEXTO.group );

	TEXTO.group = new THREE.Group();

	const africa =
		`Africa\n` +
		`Casos: ${ estadisticas.Africa.cases.toLocaleString() }\n` +
		`Muertes: ${ estadisticas.Africa.deaths.toLocaleString() }\n`+
		`Recuperados: ${ estadisticas.Africa.recoveries.toLocaleString() }\n`+
		`Tasa mortalidad: ${trunc(100*estadisticas.Africa.deaths/estadisticas.Africa.cases ,2)}%\n`;

	const europe =
		`Europa\n` +
		`Casos: ${ estadisticas.Europe.cases.toLocaleString() }\n` +
		`Muertes: ${ estadisticas.Europe.deaths.toLocaleString() }\n`+
		`Recuperados: ${ estadisticas.Europe.recoveries.toLocaleString() }\n`+
		`Tasa mortalidad: ${trunc(100*estadisticas.Europe.deaths/estadisticas.Europe.cases ,2)}%\n`;

	const asia =
		`Asia\n` +
		`Casos: ${ estadisticas.Asia.cases.toLocaleString() }\n` +
		`Muertes: ${ estadisticas.Asia.deaths.toLocaleString() }\n`+
		`Recuperados: ${ estadisticas.Asia.recoveries.toLocaleString() }\n`+
		`Tasa mortalidad: ${trunc(100*estadisticas.Asia.deaths/estadisticas.Asia.cases ,2)}%\n`;

	const americas =
		`America\n` +
		`Casos: ${ estadisticas.Americas.cases.toLocaleString() }\n` +
		`Muertes: ${ estadisticas.Americas.deaths.toLocaleString() }\n`+
		`Recuperados: ${ estadisticas.Americas.recoveries.toLocaleString() }\n`+
		`Tasa mortalidad: ${trunc(100*estadisticas.Americas.deaths/estadisticas.Americas.cases ,2)}%\n`;

	const oceania =
		`Oceania\n` +
		`Casos: ${ estadisticas.Oceania.cases.toLocaleString() }\n` +
		`Muertes: ${ estadisticas.Oceania.deaths.toLocaleString() }\n`+
		`Recuperados: ${ estadisticas.Oceania.recoveries.toLocaleString() }\n`+
		`Tasa mortalidad: ${trunc(100*estadisticas.Oceania.deaths/estadisticas.Oceania.cases,2)}%\n`;

	const globals =
		`Total en el mundo\n` +
		`Casos: ${ WIKIPEDIA.totalsGlobal[ 2 ] }\n`+
		`Muertes: ${ WIKIPEDIA.totalsGlobal[ 4 ] } \n`+
		`Recuperados: ${WIKIPEDIA.totalsGlobal[ 6 ] }\n`;

	TEXTO.getTexto( { text: africa, color: 0x34621A, radius: 75, latitude: "0", longitude: "0" } );
	TEXTO.getTexto( { text: europe, color: 0x0085C7, radius: 75, latitude: "60", longitude: "40" } );
	TEXTO.getTexto( { text: asia, color: 0xF4C300, radius: 75, latitude: "30", longitude: "140" } );
	TEXTO.getTexto( { text: oceania, color: 0x009F3D, radius: 75, latitude: "-10", longitude: "170" } );
	TEXTO.getTexto( { text: americas, color: 0xDF0024, radius: 75, latitude: "10", longitude: "-100" } );
	TEXTO.getTexto( { text: globals, color: 0x4AC444, radius: 75, latitude: "20", longitude: "-160" } );

	SHConf.scene.add( TEXTO.group );

};