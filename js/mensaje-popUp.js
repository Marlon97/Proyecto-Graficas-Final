const MensajePopUp = {};

MensajePopUp.x = 0;
MensajePopUp.y = 0;

MensajePopUp.intersected = undefined;

MensajePopUp.htmlPopUp = `
	<div id="MensajeDivContainer" >
		<div id="MensajeDivHeader">
			Info <span ontouchstart=MensajeDivPopUp.hidden=true; onclick=MensajeDivPopUp.hidden=true; style=cursor:pointer;float:right;z-index:20; >[ x ]</span>
		</div>
		<div id="MensajeDivContent" >
		</div>
	</div>`;



MensajePopUp.init = function () {

	MensajePopUp.objects = group.children;

	const div = document.body.appendChild( document.createElement( "div" ) );
	div.id = "MensajeDivPopUp";

	MensajeDivPopUp.innerHTML = MensajePopUp.htmlPopUp;

	window.addEventListener( "keydown", MensajePopUp.onStart );

	SHConf.renderer.domElement.addEventListener( "mousedown", MensajePopUp.onStart );
	SHConf.renderer.domElement.addEventListener( "wheel", MensajePopUp.onStart );

	SHConf.renderer.domElement.addEventListener( "touchstart", MensajePopUp.onStart );
	SHConf.renderer.domElement.addEventListener( "touchmove", MensajePopUp.onStart );
	SHConf.renderer.domElement.addEventListener( "touchend", MensajePopUp.onStart );

	MensajeDivHeader.addEventListener( "mousedown", MensajePopUp.onMouseDown );
	MensajeDivHeader.addEventListener( "touchstart", MensajePopUp.onMouseDown );

	MensajeDivContent.scrollTop = 800;

};


MensajePopUp.onStart = function () {

	window.removeEventListener( "keydown", MensajePopUp.onStart );

	SHConf.renderer.domElement.removeEventListener( "wheel", MensajePopUp.onStart );

	SHConf.renderer.domElement.removeEventListener( "touchstart", MensajePopUp.onStart );
	SHConf.renderer.domElement.removeEventListener( "touchmove", MensajePopUp.onStart );
	SHConf.renderer.domElement.removeEventListener( "touchend", MensajePopUp.onStart );

	SHConf.renderer.domElement.addEventListener( "mouseover", MensajePopUp.onEvent );
	SHConf.renderer.domElement.addEventListener( "touchstart", MensajePopUp.onEvent );

	//MensajeDdivPopUp.hidden = true;

	MensajePopUp.onEvent();

};

MensajePopUp.onEvent = function (e ) {

	SHConf.renderer.domElement.addEventListener( "touchstart", MensajePopUp.onMove );
	SHConf.renderer.domElement.addEventListener( "touchmove", MensajePopUp.onMove );
	SHConf.renderer.domElement.addEventListener( "touchend", MensajePopUp.onOut );
	SHConf.renderer.domElement.addEventListener( "mousemove", MensajePopUp.onMove );
	SHConf.renderer.domElement.addEventListener( "mouseout", MensajePopUp.onOut );

	MensajePopUp.onMove( e );

};

MensajePopUp.onMove = function (e ) {

	if ( e ) {

		MensajePopUp.checkIntersect( e );

	}
};

MensajePopUp.onMouseOverOut = function () {

	SHConf.renderer.domElement.removeEventListener( "touchmove", MensajePopUp.onMove );
	SHConf.renderer.domElement.removeEventListener( "touchend", MensajePopUp.onOut );
	SHConf.renderer.domElement.removeEventListener( "mousemove", MensajePopUp.onMove );
	SHConf.renderer.domElement.removeEventListener( "mouseup", MensajePopUp.onOut );

};

MensajePopUp.checkIntersect = function (event ) {

	if ( event.type === "touchmove" || event.type === "touchstart" ) {

		event.clientX = event.touches[ 0 ].clientX;
		event.clientY = event.touches[ 0 ].clientY;

	}

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / SHConf.renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / SHConf.renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, SHConf.camera );

	const intersects = raycaster.intersectObjects( MensajePopUp.objects );
	const cutOff = SHConf.camera.position.distanceTo( SHConf.scene.position );

	if ( intersects.length > 0 ) {

		if ( MensajePopUp.intersected !== intersects[ 0 ].object && intersects[ 0 ].distance < cutOff ) {


			MensajePopUp.intersects = intersects;
			MensajePopUp.intersected = intersects[ 0 ].object;

			MensajePopUp.displayYourMessage( MensajePopUp.intersected );

		}

	} else {

		MensajePopUp.intersected = null;

		if ( event.type === "touchmove" || event.type === "touchstart" ) {

			MensajeDivPopUp.hidden = true;

		}

	}

};

MensajePopUp.onMouseDown = function (e ) {

	MensajePopUp.x = e.clientX;
	MensajePopUp.y = e.clientY;

	MensajeDivHeader.addEventListener( "touchmove", MensajePopUp.onMouseDownMove );
	MensajeDivHeader.addEventListener( "touchend", MensajePopUp.onMouseDownOut );
	MensajeDivHeader.addEventListener( "mousemove", MensajePopUp.onMouseDownMove );
	MensajeDivHeader.addEventListener( "mouseup", MensajePopUp.onMouseDownOut );

	MensajePopUp.onMouseDownMove( e );

};



MensajePopUp.onMouseDownMove = function (e ) {

	let dx, dy;

	if ( e.type === "touchmove" || event.type === "touchstart" ) {

		dx = e.touches[ 0 ].clientX - MensajePopUp.x;
		dy = e.touches[ 0 ].clientY - MensajePopUp.y;

		MensajePopUp.x = e.touches[ 0 ].clientX;
		MensajePopUp.y = e.touches[ 0 ].clientY;

	} else {

		dx = e.clientX - MensajePopUp.x;
		dy = e.clientY - MensajePopUp.y;

		MensajePopUp.x = e.clientX;
		MensajePopUp.y = e.clientY;

	}

	MensajeDivPopUp.style.left = MensajeDivPopUp.offsetLeft + dx + "px";
	MensajeDivPopUp.style.top = MensajeDivPopUp.offsetTop + dy + "px";

};



MensajePopUp.onMouseDownOut = function () {

	MensajeDivHeader.removeEventListener( "touchmove", MensajePopUp.onMouseDownMove );
	MensajeDivHeader.removeEventListener( "touchend", MensajePopUp.onMouseDownOut );
	MensajeDivHeader.removeEventListener( "mousemove", MensajePopUp.onMouseDownMove );
	MensajeDivHeader.removeEventListener( "mouseup", MensajePopUp.onMouseDownOut );

};



MensajePopUp.onLoadMore = function () {

	const maxHeadroom = window.innerHeight - MensajeDivPopUp.offsetTop - 15;

	MensajeDivContainer.style.height = MensajeDivPopUp.clientHeight < maxHeadroom ? "100%" : maxHeadroom + "px";

	const maxLegroom = window.innerWidth - MensajeDivPopUp.offsetLeft - 15;

	MensajeDivContainer.style.width = MensajeDivPopUp.clientWidth < maxLegroom ? "100%" : maxLegroom + "px";

};

MensajePopUp.displayYourMessage = function (intersected ) {

	console.log( "event", event );
	console.log( "Mensaje.intersects", MensajePopUp.intersects );

	MensajeDivPopUp.hidden = false;
	MensajeDivPopUp.style.left = event.clientX + "px";
	MensajeDivPopUp.style.top = event.clientY + "px";

	MensajeDivPopUp.innerHTML = `
	<div id="MensajeDivIntersected" >
		DOM x: ${event.clientX}<br>
		DOM y: ${event.clientY}<br>
		DOM ms: ${event.timeStamp.toLocaleString()}<br>
		Ray found ${MensajePopUp.intersects.length}<br>
		<button onclick=MensajePopUp.getMorePopUp() >⚡️ details ${MensajePopUp.intersects.length} found</button>
	</div>`;

};

MensajePopUp.getMorePopUp = function () {

	const htm = MensajePopUp.intersects.map( (obj, i ) => `
	<p>
		Object ${i}: ${ obj.object.name }<br>
		uuid: ${ obj.object.uuid }<br>
		distance: ${ obj.distance.toLocaleString() }<br>
		point: x${ obj.point.x.toLocaleString() }, y${ obj.point.y.toLocaleString() }, z${ obj.point.z.toLocaleString() }<br>
	</p>`
	).join( "" );

	MensajeDivPopUp.innerHTML = MensajePopUp.htmlPopUp;

	MensajeDivContent.innerHTML = `
<div id=MensajeDivMore>${ htm }</div>
<div id="MensajeDivMoreButtons" ></div>
<div id=MensajeDivMoreGraph  >
</div>
`;

	MensajeDivMoreButtons.innerHTML = `
<button onclick=Mensajeimg.src="../../assets/cube-textures/f4.jpg" >button 1</button>
<button onclick=Mensajeimg.src="../../assets/cube-textures/f1.jpg" >button2 </button>
<button onclick=Mensajeimg.src="../../assets/cube-textures/f2.jpg" >button 3</button>
`;

	MensajeDivMoreGraph.innerHTML = `
<p>
image below for testing scrolling
<img id=Mensajeimg  src=../assets/cube-textures/f4.jpg >
</p>
`;

	MensajePopUp.onLoadMore();

	setTimeout( MensajePopUp.onLoadMore(), 200 );

	MensajeDivHeader.addEventListener( "mousedown", MensajePopUp.onMouseDown );
	MensajeDivHeader.addEventListener( "touchstart", MensajePopUp.onMouseDown );

};


