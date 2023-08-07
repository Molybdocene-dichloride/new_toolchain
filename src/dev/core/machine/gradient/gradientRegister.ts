namespace RotorRegistry {
  rotors: RotorTile[];
	
	registerRotor(tile: RotorTile): void {
	  rotors.push(tile);
	  
	  //sendToAllClients(name: string, packetData: object); (initClient);
	  
	}
	
	initClient(rotor: RotorTile) {
	    //rotor.initProto(rotor.size);
	    //BlockRenderer.enableCoordMapping(BlockID[rotor.id], 0, rotor.model);
	}
}

//addClientPacket<T>(name: string, func: ((packetData: T) => void)): void