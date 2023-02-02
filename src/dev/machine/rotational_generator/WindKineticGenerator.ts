BlockRegistry.createBlock("windKineticGenerator", [
	{name: "WInd Kinetic Generator", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.windKineticGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.windKineticGenerator, 4);

TileRenderer.setStandardModelWithRotation(BlockID.windKineticGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.windKineticGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.windKineticGenerator, true);

Callback.addCallback("PreLoaded", function() {
	/*Recipes.addShaped({id: BlockID.windKineticGenerator, count: 1, data: 0}, [
		"sms"
	], ['s', ItemID.shaftIron, 0, 'm', BlockID.machineBlock, 0]);*/
});

namespace Machine {
	export class WindKineticGenerator extends MachineBase {
		onTick(): void {
			/*if (rotor exist) {
			  if rotor obstructed - not or slowly rotate, lower kU  
			  calculate wind properties (WindSim) and kU
			  create and send kU to front of kinetic generator, damage rotor (too much strength - 4x damage, normal - 1x damage)

			  }*/ 
		}

		canRotate(): boolean {
			return true;
		}
	}
	
	MachineRegistry.registerPrototype(BlockID.windKineticGenerator, new WindKineticGenerator());
}
