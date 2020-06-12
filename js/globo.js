

const Globo = {};

let geoJsonArray = {};

Globo.onLoadGeoJson = function(xhr ) {

	let response = xhr.target.response;
	const file = xhr.target.responseURL.split( "/" ).pop();

	const geoJson = JSON.parse( response );

	geoJsonArray[ file ] = geoJson;

	drawThreeGeo( geoJson, 50, "sphere", { color: "#888" } );

};


Globo.addLights = function() {

	SHConf.scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

	const pointLight = new THREE.PointLight( 0xffffff, 1 );
	pointLight.position.copy( SHConf.camera.position );
	SHConf.camera.add( pointLight );

	const lightDirectional = new THREE.DirectionalLight( 0xfffffff, 1 );
	lightDirectional.position.set( -50, -200, 100 );
	SHConf.scene.add( lightDirectional );

};



Globo.addGlobe = function() {

	Globo.loadGlobeBasic();

	const urlJsonStatesProvinces = pathAssets + "json/country_1.geojson";

	requestFile( urlJsonStatesProvinces, Globo.onLoadGeoJson );

	const urlJsonChina = pathAssets + "json/china.geojson";

	requestFile( urlJsonChina, Globo.onLoadGeoJson );

	const urlJson = pathAssets + "json/country_2.geojson";

	requestFile( urlJson, Globo.onLoadGeoJson );

};


Globo.loadGlobeBasic = function (size = 50 ) {

	const geometry = new THREE.SphereBufferGeometry( size, 32, 32);
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	const url = pathAssets + "images/tierra_texture_4096_2.jpg";
	var texture = new THREE.TextureLoader().load( url );

	const material = new THREE.MeshBasicMaterial( { color: 0xcce0ff, map: texture } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.name = "globe";
	SHConf.scene.add( mesh );

	mesh.matrixAutoUpdate = false;

};


Globo.loadGlobeWithMapTextures = function() {

	const radius = 50;

	const pi = Math.PI, pi2 = 0.5 * Math.PI;
	const d2r = pi / 180;

	const xStart = 0;
	const yStart = 0;
	const xFinish = 16;
	const yFinish = 16;
	const zoom = 4;
	const deltaPhi = 2.0 * pi / Math.pow( 2, zoom );
	const steps = Math.floor( 18 / zoom );

	const loader = new THREE.TextureLoader();
	group2 = new THREE.Object3D();
	group2.rotation.x = pi2;
	group2.rotation.y = pi;

	for ( let y = yStart; y < yFinish; y++ ) {

		const lat1 = tile2lat( y, zoom );
		const lat2 = tile2lat( y + 1, zoom );
		const deltaTheta = ( lat1 - lat2 ) * d2r;
		const theta = pi2 - lat1 * d2r;

		for ( let x = xStart; x < xFinish; x++ ) {

			const src = "https://mt1.google.com/vt/lyrs=y&x=" + x + "&y=" + y + "&z=" + zoom;

			const texture = loader.load( src );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const geometry = new THREE.SphereBufferGeometry( radius, steps, steps, x * deltaPhi - pi, deltaPhi, theta, deltaTheta );
			const mesh = new THREE.Mesh( geometry, material );

			group2.add( mesh );
			group2.name = "globe";

		}
	}

	SHConf.scene.add( group2 );

		function tile2lat( y, z ) {

			const n = pi - 2 * pi * y / Math.pow( 2, z );
			return ( 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );

		}

};



Globo.toggleSkyBox = function (boole = true ) {

	SHConf.scene.background = boole ?
		new THREE.CubeTextureLoader()
			.setPath( pathAssets + "cube-textures/" )
			.load( [ "f1.jpg", "f2.jpg", "f3.jpg", "f4.jpg", "f5.jpg", "f6.jpg" ] )
		:
		null;

};
