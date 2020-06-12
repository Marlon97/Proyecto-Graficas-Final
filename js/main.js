let pathAssets = "assets/";

spnTitle.innerHTML = document.title;

let group = new THREE.Group();

let groupCasesWP = new THREE.Group();
let groupActiveCasesWP = new THREE.Group();
let groupRecoveriesWP = new THREE.Group();
let groupDeathsWP = new THREE.Group();

let groupPrevious;


function requestFile ( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	xhr.onload = callback;
	xhr.send( null );

}

function resetGroups () {

	SHConf.scene.remove( group, groupCasesWP, groupActiveCasesWP, groupRecoveriesWP, groupDeathsWP );

	groupCasesWP = new THREE.Group();
	groupActiveCasesWP = new THREE.Group();
	groupRecoveriesWP = new THREE.Group();
	groupDeathsWP = new THREE.Group();

	SHConf.scene.add( group, groupCasesWP, groupActiveCasesWP, groupRecoveriesWP, groupDeathsWP );
}

function toggleBars ( group = groupCases ) {

	//console.log( 'group', group  );

	if ( group === groupPrevious ) {

		groupCasesWP.visible = true;
		groupActiveCasesWP.visible = true;
		groupDeathsWP.visible = true;
		groupRecoveriesWP.visible = true;

		group = undefined;

	} else {

		groupCasesWP.visible = false;
		groupActiveCasesWP.visible = false;
		groupDeathsWP.visible = false;
		groupRecoveriesWP.visible = false;

		group.visible = true;

		groupPrevious = group;
	}
}
