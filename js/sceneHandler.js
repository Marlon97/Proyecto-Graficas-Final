
let SHConf = {};

SHConf.group = new THREE.Group();


SHConf.init = function () {

	SHConf.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	SHConf.camera.position.set( 120, 0, 65 );
	SHConf.camera.up.set( 0, 0, 1 );

	SHConf.scene = new THREE.Scene();
	SHConf.scene.background = new THREE.Color( 0xcce0ff );
	SHConf.scene.add( SHConf.camera );



	SHConf.renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
	SHConf.renderer.setPixelRatio( window.devicePixelRatio );
	SHConf.renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( SHConf.renderer.domElement );

	SHConf.controls = new THREE.OrbitControls( SHConf.camera, SHConf.renderer.domElement );
	SHConf.controls.enablePan = false;
	SHConf.controls.minDistance = 30;
	SHConf.controls.maxDistance = 300;
	SHConf.controls.autoRotate = true;

	window.addEventListener( 'resize', SHConf.onWindowResize, false );
	window.addEventListener( 'orientationchange', SHConf.onWindowResize, false );

	window.addEventListener( 'keydown', SHConf.onStart );

	SHConf.renderer.domElement.addEventListener( 'mousedown', SHConf.onStart );
	SHConf.renderer.domElement.addEventListener( 'wheel', SHConf.onStart );

	SHConf.renderer.domElement.addEventListener( 'touchstart', SHConf.onStart );
	SHConf.renderer.domElement.addEventListener( 'touchmove', SHConf.onStart );
	SHConf.renderer.domElement.addEventListener( 'touchend', SHConf.onStart );


};



SHConf.onLoad = function (event ) {

	console.log( 'event thr', event );

};


SHConf.onStart = function () {

	SHConf.controls.autoRotate = false;

	window.removeEventListener( 'keydown', SHConf.onStart );
	SHConf.renderer.domElement.removeEventListener( 'mousedown', SHConf.onStart );
	SHConf.renderer.domElement.removeEventListener( 'mousemove', SHConf.onStart );
	SHConf.renderer.domElement.removeEventListener( 'wheel', SHConf.onStart );

	SHConf.renderer.domElement.removeEventListener( 'touchstart', SHConf.onStart );
	SHConf.renderer.domElement.removeEventListener( 'touchmove', SHConf.onStart );
	SHConf.renderer.domElement.removeEventListener( 'touchend', SHConf.onStart );

};



SHConf.latLonToXYZ = function (radius, lat, lon ) {

	const pi2 = Math.PI / 2;

	const theta = Number( lat ) * Math.PI / 180;
	const phi = Number( lon ) * Math.PI / 180;

	const x = radius * Math.sin( theta + pi2 ) * Math.cos( phi );
	const y = radius * Math.sin( theta + pi2 ) * Math.sin( phi );
	const z = radius * Math.cos( theta - pi2 );

	return new THREE.Vector3( x, y, z );

};



SHConf.drawPlacard = function (text = [ "abc", "testing 123" ], scale = "0.2", color = 20, x = 20, y = 20, z = 20 ) {

	const placard = new THREE.Object3D();
	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );

	const texture = canvasMultilineText( text, { backgroundColor: color } );
	const spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
	const sprite = new THREE.Sprite( spriteMaterial );
	sprite.position.set( x, y, z );
	sprite.scale.set( scale * texture.image.width, scale * texture.image.height );

	const geometry = new THREE.Geometry();
	geometry.vertices = [ v( 0, 0, z ), v( x, 0, z ) ];
	const material = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );
	const line = new THREE.Line( geometry, material );

	placard.add( sprite );

	return placard;


	function canvasMultilineText ( textArray, parameters ) {

		parameters = parameters || {};

		const canvas = document.createElement( 'canvas' );
		const context = canvas.getContext( '2d' );
		let width = parameters.width ? parameters.width : 0;
		const font = parameters.font ? parameters.font : '48px monospace';
		const color = parameters.backgroundColor ? parameters.backgroundColor : 120;

		if ( typeof textArray === 'string' ) textArray = [ textArray ];

		context.font = font;

		for ( let i = 0; i < textArray.length; i++ ) {

			width = context.measureText( textArray[ i ] ).width > width ? context.measureText( textArray[ i ] ).width : width;

		}

		canvas.width = width + 20;
		canvas.height = parameters.height ? parameters.height : textArray.length * 60;

		context.fillStyle = 'hsl( ' + color + ', 80%, 50% )';
		context.fillRect( 0, 0, canvas.width, canvas.height );

		context.lineWidth = 1;
		context.strokeStyle = '#000';
		context.strokeRect( 0, 0, canvas.width, canvas.height );

		context.fillStyle = '#000';
		context.font = font;

		for ( let i = 0; i < textArray.length; i++ ) {

			context.fillText( textArray[ i ], 10, 48 + i * 60 );

		}

		const texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		return texture;

	}

};



SHConf.onWindowResize = function () {

	SHConf.camera.aspect = window.innerWidth / window.innerHeight;
	SHConf.camera.updateProjectionMatrix();

	SHConf.renderer.setSize( window.innerWidth, window.innerHeight );

};



SHConf.animate = function () {

	requestAnimationFrame( SHConf.animate );
	SHConf.renderer.render( SHConf.scene, SHConf.camera );
	SHConf.controls.update();

};