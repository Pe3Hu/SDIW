let container, stats, raycaster, mouse;
let camera, scene, renderer, controls;

let dragIndex, targetList, deck;
let mark, font;
let cardSize = new THREE.Vector2(18,18);
let colors12Helper = [], colors4Helper = [];
let slotMeshs = [], slotValues = [], planes = [];
let SLOT_NUMBER = 7, SLOT_LENGTH = 8;
let offsetSlot = new THREE.Vector3(-cardSize.x*(SLOT_NUMBER+0.5),cardSize.y*4,0);
let rotateSpeed = Math.PI/1800;
let totalAngles = [], targets = [], victoryIndexs = [], lastAngles = [];
let ticks = 0;
let stopCount = 0;
let randomTime = 50;
let lastMove = false;
let helvetikerFont;

init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x909090 );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 800 );
	scene.add( camera );
	//	var light = new THREE.AmbientLight( 0xffffff );
	//	scene.add( light );
	var light = new THREE.DirectionalLight( 0xefefff, 1.5 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );
	var light = new THREE.DirectionalLight( 0xffefef, 1.5 );
	light.position.set( -1, -1, -1 ).normalize();
	scene.add( light );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

  let divisions = 1000, s = cardSize.x*divisions;
  let gridHelper = new THREE.GridHelper( s, divisions );
  gridHelper.rotateX(Math.PI/2)
  scene.add( gridHelper );

	var axesHelper = new THREE.AxesHelper( cardSize.x );
	axesHelper.position.set( 0, 0,  cardSize.x )
	//scene.add( axesHelper );

	game();

	controls = new THREE.OrbitControls( camera);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	container.appendChild( renderer.domElement );

	var button = document.getElementById( 'best' );
     button.addEventListener( 'click', function ( event ) {
				let sb = new Scoreboard(scene);
     }, false );


	//
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'mousedown', onMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );
}
function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onMouseDown( event )		{
			// update the mouse letiable
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );
			let intersects = raycaster.intersectObjects( targetList );

			if ( intersects.length > 0 )
			{
				let name = intersects[ 0 ].object.name;
				let r = rangePalette();
				if ( dragIndex===null  ){
						dragIndex = name;
						//console.log(dragIndex)
				}
				else if (r){
					//console.log(r);
					addPalette();
					dragIndex = null;
				}
				else
					dragIndex = null;
				//intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 );
				//intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
			}
		}
function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
	render();
}
function render() {
	renderer.render( scene, camera );
}
function game(){
	let loader = new THREE.FontLoader();
	loader.load( 'src/fonts/helvetiker_bold.typeface.json', f=>helvetikerFont=f );

	for (let i=0; i<4; i++){
		let color = new THREE.Color();
		color.setHSL((i*90+360/32*3)/360, 1, 0.5);
		colors4Helper.push(color);
	}

	/*var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( -10, -10, 0 ),
		new THREE.Vector3( -10, 10, 0 ),
		new THREE.Vector3(  0, 30, 0 ),
		new THREE.Vector3(  30, 30, 0 ),
		new THREE.Vector3(  30, 0, 0 ),
		new THREE.Vector3( 10, -10, 0 ),
		new THREE.Vector3( -10, -10, 0 ),
	);

	geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geometry.faces.push( new THREE.Face3( 1, 2, 3 ) );
	geometry.computeBoundingSphere();

	let color = new THREE.Color( 0x000000 );
	let material = new THREE.LineBasicMaterial({	color: color  });

	let mesh = new THREE.Line( geometry, material );
	scene.add(mesh);*/
	/*
	var material = new THREE.MeshPhongMaterial( { color : 0x00cc00 } );
	let size = {x: 18, y: 18}

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( size.x*0, size.y*1, 0 ),
		new THREE.Vector3( size.x*1, size.y*1, 0 ),
		new THREE.Vector3( size.x*1, size.y*0, 0 ),
		new THREE.Vector3( size.x*0, size.y*0, 0 ),
		new THREE.Vector3( size.x*2, size.y*3, 0 ),
		new THREE.Vector3( size.x*3, size.y*3, 0 ),
		new THREE.Vector3( size.x*3, size.y*2, 0 ),
		new THREE.Vector3( size.x*2, size.y*2, 0 ),
		new THREE.Vector3( size.x*4, size.y*-1, 0 ),
		new THREE.Vector3( size.x*5, size.y*-1, 0 ),
		new THREE.Vector3( size.x*5, size.y*-2, 0 ),
		new THREE.Vector3( size.x*4, size.y*-2, 0 ),
		new THREE.Vector3( size.x*6, size.y*-1, 0 ),
		new THREE.Vector3( size.x*7, size.y*-1, 0 ),
		new THREE.Vector3( size.x*7, size.y*-2, 0 ),
		new THREE.Vector3( size.x*6, size.y*-2, 0 ),
	);
	geometry.vertices.push(
		new THREE.Vector3( -0, -0, 0 ),
		new THREE.Vector3( -0, -10, 0 ),
		new THREE.Vector3( -20, -30, 0 ),
		new THREE.Vector3( -30, -30, 0 ),
		new THREE.Vector3( -30, -20, 0 ),
		new THREE.Vector3( -10, 0, 0 ),
	);
	let	arrays = [[0,1,5,6,7,3],[3,0,4,5,6,2],[0,5,6,3]];

	for (let j=0; j<9; j+=4){
		let order = 0;
		if (geometry.vertices[j].y<geometry.vertices[j+4].y)
			order = 1;
		if (geometry.vertices[j].y==geometry.vertices[j+4].y)
			order = 2;
		console.log(order);
		for (let i=1; i<arrays[order].length-1; i++){
			//create a new face using vertices 0, 1, 2
			var normal = new THREE.Vector3( 0, 1, 0 ); //optional
			var color = new THREE.Color( 0xffaa00 ); //optional
			var materialIndex = 0; //optional
			let first = arrays[order][i+1]+j, second = arrays[order][i]+j, third = arrays[order][0]+j;
			var face = new THREE.Face3( first, second, third, normal, color, materialIndex );
			geometry.faces.push( face );
			console.log(i, geometry.faces);
		}
	}


		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		scene.add( new THREE.Mesh( geometry, material ) );*/

}
function limitSub(a,b){
	let sub = a-b;
	if (a>b)
		sub = 0;
	return sub;
}
