BlockRegistry.createBlock("manualKineticGenerator", [
	{name: "Manual Kinetic Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0]], inCreative: true},
], "machine");
BlockRegistry.setBlockMaterial(BlockID.manualKineticGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.manualKineticGenerator, 4);

TileRenderer.setStandardModelWithRotation(BlockID.manualKineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.manualKineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0]], true);
TileRenderer.setRotationFunction(BlockID.manualKineticGenerator, true);

Callback.addCallback("PreLoaded", function() {
	/*Recipes.addShaped({id: BlockID.manualKineticGenerator, count: 1, data: 0}, [
		"sm",
	], ['s', ItemID.machineCasing, 0, 'm', levelId!!!, -1]);*/
});

namespace Machine {
	export class ManualKineticGenerator extends MachineBase {
		onItemClick(): boolean {
			let output = 400;

			for(let i = 2; i < 6; i++) {
				Logger.Log("qqss", i.toString());
				let coords = StorageInterface.getRelativeCoords(this, i);
				Logger.Log("sqss", coords.x.toString() + ";" + coords.y.toString() + ";" + coords.z.toString());

				let tile = this.region.getTileEntity(coords) as IMomentOfMomentumConsumer;
				if (tile && tile.canReceiveAngularMomentum && tile.canReceiveAngularMomentum(4) /*All sides of Manual generator*/) {
					output = tile.receiveAngularMomentum(output);
				}
			}
			return false;
		}
		canRotate(): boolean {
			return false;
		}
	}
	MachineRegistry.registerPrototype(BlockID.manualKineticGenerator, new ManualKineticGenerator());
}
