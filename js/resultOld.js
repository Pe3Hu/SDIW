class Result {
   constructor (leader, squad, equipment, terrain, mission, font, offset, size){
      this.valuesL = leader ? leader.values : [];
      this.valuesS = squad ? squad.values  : [];
      this.valuesE = equipment ? equipment.values : [];
      this.valuesT = terrain ? terrain.values  : [];
      this.valuesM = mission ? mission.values : [];
      this.font = font ? font : helvetikerFont;
      this.offset = offset ? offset : new THREE.Vector3(0,0,0);
      this.size = size ? size : new THREE.Vector2(18,18);
      this.group = new THREE.Group()
      this.state = [0,0,0,0];
      this.requirement = [0,0,0,0];

      console.log(this)
      for (let row in this.valuesL)
        for (let col in this.valuesL[row])
          this.state[row]+=this.valuesL[row][col];

      for (let row in this.valuesE)
        for (let col in this.valuesE[row])
          this.state[row]+=this.valuesE[row][col];

      for (let row in this.valuesS)
        for (let col in this.valuesS[row])
          this.state[row]+=this.valuesS[row][col];

      for (let row in this.valuesT)
        for (let col in this.valuesT[row])
          this.requirement[row]+=this.valuesT[row][col];

      for (let row in this.valuesM)
        for (let col in this.valuesM[row])
          this.requirement[row]+=this.valuesM[row][col];

      let totalState = 0;
      for (let obj of this.state)
        totalState+=obj;
      this.state.push(totalState);
      let totalRequirement = 0;
      for (let obj of this.requirement)
        totalRequirement+=obj;
      this.requirement.push(totalRequirement);
      for (let row in this.state){//colors4Helper[row]
          let txt = this.state[row].toString();
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
          let color;
          if (row<4)
            color = colors4Helper[row];
          else
            color = "black"
      		let textMaterial = new THREE.MeshPhongMaterial( { color: color} );
      		let mesh = new THREE.Mesh( textGeo, textMaterial );
      		mesh.position.x = 30*this.size.x;
        	mesh.position.x-=this.size.x*(txt.length/2)
      		mesh.position.y = (-row-1)*this.size.y;
      		mesh.castShadow = true;
      		mesh.receiveShadow = true;
          this.group.add(mesh);
        }
      for (let row in this.requirement){//colors4Helper[row]
          let txt = this.requirement[row].toString();
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
          let color;
          if (row<4)
            color = colors4Helper[row];
          else
            color = "black"
      		let textMaterial = new THREE.MeshPhongMaterial( { color: color} );
      		let mesh = new THREE.Mesh( textGeo, textMaterial );
      		mesh.position.x = 32*this.size.x;
        	mesh.position.x-=this.size.x*(txt.length/2)
      		mesh.position.y = (-row-1)*this.size.y;
      		mesh.castShadow = true;
      		mesh.receiveShadow = true;
          this.group.add(mesh);
        }
      this.group.position.set(this.offset.x, this.offset.y, this.offset.z);
    }
    show(scene){
      scene.add(this.group);
    }
}
