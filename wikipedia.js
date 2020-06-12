MensajePopUp.displayYourMessage = function (intersected ) {


	function trunc (x, posiciones = 0) {
		var s = x.toString()
		var l = s.length
		var decimalLength = s.indexOf('.') + 1
		var numStr = s.substr(0, decimalLength + posiciones)
		return Number(numStr)
	}

	MensajeDivPopUp.hidden = false;
	MensajeDivPopUp.style.left = event.clientX + "px";
	MensajeDivPopUp.style.top = event.clientY + "px";

	WIKIPEDIA.places = intersected.userData.places;
	const index = MensajePopUp.intersects[ 0 ].instanceId;
	const line = WIKIPEDIA.places[ index ];
	WIKIPEDIA.line = line;

	WIKIPEDIA.place = line.region ? line.region : line.country;

	WIKIPEDIA.dataLinks = c19LinksGlobal.find(link => link.country === line.country && link.region === line.region );

	MensajeDivPopUp.innerHTML = `
	<div id=MensajeDivIntersected>
		Casos: ${Number(line.cases).toLocaleString()}<br>
		Muertes: ${Number(line.deaths).toLocaleString()}<br>
		Recuperaciones: ${isNaN(Number(line.recoveries)) ? "NA" : Number(line.recoveries).toLocaleString()}<br>
		Activos: ${Number(Number(line.cases) - Number(line.deaths) - (isNaN(Number(line.recoveries)) ? 0 : Number(line.recoveries)))}<br>
		Tasa muerte: ${trunc((100 * Number(line.deaths) / Number(line.cases)), 2)}%<br>
		<button onclick=WIKIPEDIA.getPopUpMore()>***Ver estadisticas de ${WIKIPEDIA.place} ***</button></br>
	</div>`;

};



WIKIPEDIA.getPopUpMore = function () {



	let chart;
	let template;
	WIKIPEDIA.htmPlace = "";
	let htmJhu = "";
	let chartIdx = 1;

	if ( WIKIPEDIA.places === GeoDataUsa ) {



		WIKIPEDIA.htmPlace = `
		<div>
			<a href="${WIKIPEDIA.chartPrefix}${WIKIPEDIA.dataLinks.article}" target="_blank">${WIKIPEDIA.place}</a>
		<div>
		<p>
			<button onclick=WIKIPEDIA.getInfoboxes();>Información general</button>

			<button onclick=WIKIPEDIA.getCases();>Estadisiticas del estado</button>

			<button onclick=WIKIPEDIA.getTables();>Estadisitcas por region</button>

			<button onclick=WIKIPEDIA.getGraphs();>Graficas</button>

		</p>`;

	} else {

		WIKIPEDIA.htmPlace = `
		<div>
			<a href="${WIKIPEDIA.chartPrefix}${WIKIPEDIA.dataLinks.article}" target="_blank">${WIKIPEDIA.place}</a>
		<div>
		<p>
			<button onclick=WIKIPEDIA.getInfoboxes();>Información general</button>

			<button onclick=WIKIPEDIA.getCases();>Estadisticas nacionales</button>

			<button onclick=WIKIPEDIA.getTables();>Estadisticas por region</button>

			<button onclick=WIKIPEDIA.getGraphs();>Graficas</button>

		</p>`;

	}



	MensajeDivPopUp.innerHTML = MensajePopUp.htmlPopUp;

	MensajeDivContent.innerHTML = `
	<div id="MensajeDivJhu"  >${ htmJhu }</div>
	<div id="MensajeDivMoreButtons" >${ WIKIPEDIA.htmPlace }</div>
	<div id=WPdivGraph><div>
	`;


	WIKIPEDIA.getInfoboxes();

	MensajeDivHeader.addEventListener( "mousedown", MensajePopUp.onMouseDown );
	MensajeDivHeader.addEventListener( "touchstart", MensajePopUp.onMouseDown );

};

WIKIPEDIA.getInfoboxes = function () {

	const url = WIKIPEDIA.cors + WIKIPEDIA.api + WIKIPEDIA.query + "COVID-19_pandemic_in_" + WIKIPEDIA.dataLinks.article;

	WPdivGraph.innerHTML = `<img src="progreso.gif" width=100 >`;

	requestFile( url, WIKIPEDIA.onLoadDataInfoboxes );

};

WIKIPEDIA.onLoadDataInfoboxes = function (xhr ) {

	const response = xhr.target.response;

	const json = JSON.parse( response );

	let text = json.parse.text[ "*" ];

	text = text
		.replace( /\<a href(.*?)>/gi, "" )
		.replace( /\<ul>(.*?)\<\/ul>/i, "" )
		.replace( /\[(.*?)\]/g, "" );

	const parser = new DOMParser();
	WIKIPEDIA.html = parser.parseFromString( text, "text/html" );

	const infoboxes = WIKIPEDIA.html.querySelectorAll( ".infobox" );

	WPdivGraph.innerHTML = !infoboxes.length ?
		`<p>Wikipedia no tiene esta informacion para ${ WIKIPEDIA.place }.</p>`
		:
		"";

	infoboxes.forEach( infobox => {

		if ( location.protocol.includes( "file" ) ) {

			images = infobox.querySelectorAll( "img" );
			images.onload = MensajePopUp.onLoadMore;
			images.forEach( image => image.src = "https://" + image.src.slice( 5 ) );

		}

		refs = infobox.querySelectorAll( ".reference" );
		refs.forEach( ref => ref.outerHTML = "" );
		WPdivGraph.innerHTML += infobox.outerHTML + "<br><hr>";

	} );


	MensajePopUp.onLoadMore();

	setTimeout( MensajePopUp.onLoadMore, 100 );

	WPdivGraph.scrollTop = 660;

};

WIKIPEDIA.getCases = function () {

	let chart, template;

	if ( WIKIPEDIA.places === GeoDataUsa ) {

		chart = WIKIPEDIA.dataLinks.chart + "_medical cases chart";

		template = "Template:COVID-19_pandemic_data/United_States/";

	} else {

		WIKIPEDIA.chart = WIKIPEDIA.dataLinks.chart;

		const suffix = WIKIPEDIA.chart === "United States" ? "_medical cases by state" : "_medical cases chart";

		chart = WIKIPEDIA.chart + suffix;

		template = WIKIPEDIA.templateGlobal + "/";

	}

	const chartIdx = WIKIPEDIA.dataLinks.chartIdx;

	if ( chartIdx > 0 ) {

		const url = WIKIPEDIA.cors + WIKIPEDIA.api + WIKIPEDIA.query + template + chart;

		requestFile( url, WIKIPEDIA.onLoadBarBox );

		WPdivGraph.innerHTML = `<img src="progreso.gif" width=100 >`;

	} else {

		WPdivGraph.innerHTML = "Wikipedia no tiene estos datos.";

	}

};



WIKIPEDIA.onLoadBarBox = function (xhr ) {

	const response = xhr.target.response;

	const json = JSON.parse( response );

	let text = json.parse.text[ "*" ];

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const bbox = html.querySelector( ".barbox" );


	const plinks = bbox.querySelectorAll( `.plainlinks, .reflist, td[colspan="5"]` );

	plinks.forEach( link => link.style.display = "none" );

	const s = new XMLSerializer();

	str = s.serializeToString( bbox );

	str = str.replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = `
<p><button onclick=MensajeDivContent.scrollTop=8888>&dArr; Bajar</button ></p>
${ str }
<p><button onclick=MensajeDivContent.scrollTop=0>&uArr; Subir</button ></p >
`;

	MensajePopUp.onLoadMore();

	setTimeout( MensajePopUp.onLoadMore, 100 );

	WPdivGraph.scrollTop = 0;

};



//////////

WIKIPEDIA.getTables = function () {

	const tables = WIKIPEDIA.html.querySelectorAll( ".wikitable" );

	WPdivGraph.innerHTML = ! tables.length ?
		`<p>Wikipedia no tiene tablas para esta zona.</p>`
		:
		"";

	const s = new XMLSerializer();

	tables.forEach( table => {

		const plinks = table.querySelectorAll( `img, .plainlinks, .reference, .reflist, td[colspan="5"]` );
		plinks.forEach( link => link.outerHTML = "" );

		const str = s.serializeToString( table );

		WPdivGraph.innerHTML += str + "<br><hr>";

	} );

	MensajePopUp.onLoadMore();

	setTimeout( MensajePopUp.onLoadMore, 100 );

	WPdivGraph.scrollTop = 0;

};


WIKIPEDIA.getGraphs = function () {

	const graphs = WIKIPEDIA.html.querySelectorAll( ".mw-graph" );

	WPdivGraph.innerHTML = ! graphs.length ?
		`<p>Wikipedia no tiene graficas para esta zona.</p>`
		:
		"";

	const s = new XMLSerializer();

	graphs.forEach( graph => {

		const plinks = graph.querySelectorAll( `.plainlinks, .reference, .reflist, td[colspan="5"]` );
		plinks.forEach( link => link.outerHTML = "" );

		const images = graph.querySelectorAll( "img" );

		images.forEach( image => {
			image.src = "https://en.wikipedia.org" + image.src.slice( image.src.indexOf( "/api" ) );
		} );
		images.forEach( image => image.style.maxWidth = "50rem" );

		const str = s.serializeToString( graph );

		WPdivGraph.innerHTML += str + "<br><hr>";

	} );

	MensajePopUp.onLoadMore();

	setTimeout( MensajePopUp.onLoadMore, 100 );

	WPdivGraph.scrollTop = 0;


}
