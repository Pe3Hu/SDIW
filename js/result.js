class Result {
   constructor (array, mode, font, offset, size){
      this.values = array ? array : null;
      this.mode = mode ? mode : "biggest";
      this.font = font ? font : helvetikerFont;
      this.offset = offset ? offset : new THREE.Vector3(0,0,0);
      this.size = size ? size : new THREE.Vector2(18,18);
      this.group = new THREE.Group()
      this.stateRequirement = [new Tile(5), new Tile(6)];
    }
    check(best, index){
      let score = { biggest: 0, nearest: 0};
      for (let index in this.values){
        let sign = 0;
        if (index>2)
          sign = 1;
        this.stateRequirement[sign].add(this.values[index]);
      }
      for (let row in this.stateRequirement[1].values)
        for (let col in this.stateRequirement[1].values[row])
          if (this.stateRequirement[1].values[row][col]>0){
            let state = this.stateRequirement[0].values[row][col];
            let requirement = this.stateRequirement[1].values[row][col];
            score.biggest+=state;
            score.biggest-=requirement;
            let lim = limitSub(state, requirement);
            score.nearest+=lim;
          }

      if (score.biggest>best.score.biggest){
        best.index = index;
        best.score = score;
        best.result = this;
      }
    }
    show(scene){
      this.stateRequirement[0].show(scene);
      this.stateRequirement[1].show(scene);
    }
}
