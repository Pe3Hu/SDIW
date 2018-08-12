class Scoreboard {
  constructor(scene, table) {
    this.scene = scene;
    this.table = table ? table : [];
    this.borders = [];
    this.setLines();
    for (let j=0; j<5; j++)
      this.borders.push({row: 0, col: j, mesh: null});
    if (this.table.length == 0)
      for (let i=0; i<3; i++){
        this.table.push([]);
        for (let j=0; j<5; j++){
          this.table[i].push(new Tile(j,i));//Math.floor(Math.random()*10);
  				this.table[i][j].show(this.scene);
        }
      }
    this.best = {index: null, score: {biggest: -100, nearest: -100}, result: null};
    for (let line of this.lines){
      let tryArray = [];
        for (let j=0; j<5; j++)
          tryArray.push(this.table[line.array[j]][j])
      let result = new Result(tryArray);
      result.check(this.best, line.index);
    }
    console.log(this.best.score)
    for (let j=0; j<5; j++)
      this.borders[j].row = this.lines[this.best.index].array[j];
    this.best.result.show(this.scene);
    this.draw();
  }
  setLines(){
    this.lines = [];
  	for (let i=0; i<29; i++){
  		let type = 0, count = 3, order = i;
  		if (i>2){
  			type = Math.floor((i-1)/2);
  			count = 2;
  			order = Math.floor((i-1)%2)
  		}
  		type++;
  		let obj = {
  			"index":i,
  			"type":type,
  			"count":count,
  			"order":order,
  			"array":[]
  		}
  		this.lines.push(obj);
  	}
  	let value = 1, index = 0;
  	this.lines[index].array = [0,0,0,0,0]; index++;
  	this.lines[index].array = [1,1,1,1,1]; index++;
  	this.lines[index].array = [2,2,2,2,2]; index++;
  	this.lines[index].array = [0,1,2,1,0]; index++;
  	this.lines[index].array = [2,1,0,1,2]; index++;
  	this.lines[index].array = [1,0,1,2,1]; index++;
  	this.lines[index].array = [1,2,1,0,1]; index++;
  	this.lines[index].array = [0,0,1,2,2]; index++;
  	this.lines[index].array = [2,2,1,0,0]; index++;
  	this.lines[index].array = [0,1,0,1,0]; index++;
  	this.lines[index].array = [2,1,2,1,2]; index++;
  	this.lines[index].array = [1,0,0,0,1]; index++;
  	this.lines[index].array = [1,2,2,2,1]; index++;
  	this.lines[index].array = [0,1,1,1,0]; index++;
  	this.lines[index].array = [2,1,1,1,2]; index++;
  	this.lines[index].array = [1,1,0,1,1]; index++;
  	this.lines[index].array = [1,1,2,1,1]; index++;
  	this.lines[index].array = [0,2,0,2,0]; index++;
  	this.lines[index].array = [2,0,2,0,2]; index++;
  	this.lines[index].array = [0,2,1,2,0]; index++;
  	this.lines[index].array = [2,0,1,0,2]; index++;
  	this.lines[index].array = [0,2,2,2,0]; index++;
  	this.lines[index].array = [2,0,0,0,2]; index++;
  	this.lines[index].array = [1,0,2,0,1]; index++;
  	this.lines[index].array = [1,2,0,2,1]; index++;
  	this.lines[index].array = [0,0,2,0,0]; index++;
  	this.lines[index].array = [2,2,0,2,2]; index++;
  	this.lines[index].array = [1,0,1,0,1]; index++;
  	this.lines[index].array = [1,2,1,2,1]; index++;
  }
  draw() {

    let size = this.table[0][0].size;
    let color = new THREE.Color( 0x000000 );
    let borderMaterial = new THREE.LineBasicMaterial({	color: color  });

    let borderGeometry = new THREE.Geometry();
    borderGeometry.vertices.push(	new THREE.Vector3( 0*size.x, 0*size.y, size.x/10));
    borderGeometry.vertices.push(	new THREE.Vector3( 4*size.x, 0*size.y, size.x/10));
    borderGeometry.vertices.push(	new THREE.Vector3( 4*size.x, -4*size.y, size.x/10));
    borderGeometry.vertices.push(	new THREE.Vector3( 0*size.x, -4*size.y, size.x/10));
    borderGeometry.vertices.push(	new THREE.Vector3( 0*size.x, 0*size.y, size.x/10));
    let border = new THREE.Line( borderGeometry, borderMaterial );

    let brokenLineGeometry = new THREE.Geometry();
  	var brokenLineMaterial = new THREE.MeshPhongMaterial( { color : 0xcccccc } );

    for (let j=0; j<5; j++){

      let x = this.borders[j].col*5*size.x;
      let y = (-this.borders[j].row*5)*size.y;
      let vec = new THREE.Vector3(x, y, 0);
      this.borders[j].mesh = border.clone();
      this.borders[j].mesh.position.add(vec);
      this.borders[j].mesh.position.add(this.table[0][0].offset);
      this.scene.add( this.borders[j].mesh );
      for (let i=0; i<this.borders[j].mesh.geometry.vertices.length-1; i++){
        let blVec = this.borders[j].mesh.geometry.vertices[i].clone();
        blVec.add(this.borders[j].mesh.position);
        blVec.add(new THREE.Vector3(0, 0, -size.x/5));
        brokenLineGeometry.vertices.push(blVec);
      }
    }

  	let	arrays = [[0,1,5,6,7,3],[3,0,4,5,6,2],[0,5,6,3]];

  	for (let j=0; j<16; j+=4){
  		let order = 0;
  		if (brokenLineGeometry.vertices[j].y<brokenLineGeometry.vertices[j+4].y)
  			order = 1;
  		if (brokenLineGeometry.vertices[j].y==brokenLineGeometry.vertices[j+4].y)
  			order = 2;
  		for (let i=1; i<arrays[order].length-1; i++){
  			let first = arrays[order][i+1]+j, second = arrays[order][i]+j, third = arrays[order][0]+j;
  			var face = new THREE.Face3( first,  second, third );
  			brokenLineGeometry.faces.push( face );
  		}
  	}
		brokenLineGeometry.computeFaceNormals();
		brokenLineGeometry.computeVertexNormals();
    this.brokenLine =   new THREE.Mesh( brokenLineGeometry, brokenLineMaterial )
		this.scene.add( this.brokenLine );

  }
}
