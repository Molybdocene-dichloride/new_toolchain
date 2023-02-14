namespace RotorRegistry {
  rotors: RotorTile[];
	
	registerRotor(tile: RotorTile): void {
	  rotors.push(tile);
	  
	  //socket (initClient)
	}
	
	initClient() {
	  for(let rotor of rotors) {
	    //rotor.initProto(rotor.size);
	    //BlockRenderer.enableCoordMapping(BlockID[rotor.id], 0, rotor.model)
    }
	}