class Tile {
   constructor (col, row, index, type, values, font, size, offset){
      this.col = col ? col : 0;
      this.row = row ? row : 0;
      this.index = index ? index : 0;
      this.type = type ? type : [0,0,0,0];
      this.values = values ? values : [];
      this.font = font ? font : helvetikerFont;
      this.table = [];
      this.size = size ? size : new THREE.Vector2(18,18);
      this.offset = offset ? offset : new THREE.Vector3(-this.size.x*17,this.size.y*7,0);
      switch (this.col) {
        case 0: {
          this.style="leader";
          this.total = 5;
          break;
        }
        case 1: {
          this.style="squad";
          this.total = 3;
          break;
        }
        case 2: {
          this.style="equipment";
          this.total = 2;
          break;
        }
        case 3: {
          this.style="terrain";
          this.total = 4;
          break;
        }
        case 4: {
          this.style="mission";
          this.total = 4;
          break;
        }
        case 5: {
          this.style="state";
          this.row = 1;
          break;
        }
        case 6: {
          this.style="requirement";
          this.row = 1;
          break;
        }
      }
      this.name = this.value;
      let max = this.total;
      this.race = 0;
      while (max>0){
        let rand = Math.floor(Math.random()*4);
        this.type[rand]++;
        max--;
        this.race+=Math.pow(10,3-rand);
      }
      for (let i = 0; i<4; i++){
        let number = 0;
        this.values.push([])
        for (let j = 0; j<4; j++)
          this.values[i].push(0);
        while (number < this.type[i]){
          let rand = Math.floor(Math.random()*4);
          this.values[i][rand]++;
          number++;
        }
      }
    }
    show(scene){
      this.group = new THREE.Group()
      for (let row in this.values)
        for (let col in this.values[row]){//colors4Helper[row]
          let txt = this.values[row][col].toString();
          let textGeo = new THREE.TextBufferGeometry( txt, {
      			font: this.font,
      			size: this.size.x,
      			height: this.size.x/40,
      			curveSegments: 10,
      			bevelThickness: 2,
      			bevelSize: this.size.x/40,
      			bevelEnabled: true
      		} );
      		textGeo.computeBoundingBox();
      		let textMaterial = new THREE.MeshPhongMaterial( { color: colors4Helper[row]} );
      		let mesh = new THREE.Mesh( textGeo, textMaterial );
      		mesh.position.x = col*this.size.x+this.col*5*this.size.x;
      		mesh.position.y = (-row-1-this.row*5)*this.size.y;
      		mesh.castShadow = true;
      		mesh.receiveShadow = true;
          //if (this.values[row][col] != 0)
          this.group.add(mesh);
        }
      this.group.position.set(this.offset.x, this.offset.y, this.offset.z);


      if (this.col>4){
        for (let row in this.values)
          for (let col in this.values[row])
            this.type[row]+=this.values[row][col];
        for (let row in this.values)
          this.race+=Math.pow(10,3-row)*this.type[row];
      }
      let txt = this.race.toString();//this.value+this.color;
      while (txt.length<4)
        txt="0"+txt;
      this.group.name = txt;
      //console.log(this.group.name)
      scene.add(this.group);
    }
    add(tile){
      for (let row in this.values)
        for (let col in this.values[row])
          this.values[row][col]+=tile.values[row][col];
    }
}
