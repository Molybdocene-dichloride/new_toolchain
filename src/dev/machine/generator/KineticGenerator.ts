/// <reference path="../IMomentOfMomentumConsumer.ts" />

BlockRegistry.createBlock("kineticGenerator", [
	{name: "Kinetic Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["kinetic_generator_back", 0], ["kinetic_generator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
BlockRegistry.setBlockMaterial(BlockID.kineticGenerator, "stone", 1);

TileRenderer.setHandAndUiModel(BlockID.kineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["kinetic_generator_back", 0], ["kinetic_generator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.kineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["kinetic_generator_back", 0], ["kinetic_generator_front", 0], ["machine_side", 0], ["machine_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.kineticGenerator, true);

Callback.addCallback("PreLoaded", function() {
	/*Recipes.addShaped({id: BlockID.stirlingGenerator, count: 1, data: 0}, [
		"ccc",
		"#ms",
		"ccc"
		], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'm', ItemID.electricMotor, 0, 'm', ItemID.shaftIron, 0]);*/
});

namespace Machine {
	export class KineticGenerator extends Generator
	implements IMomentOfMomentumConsumer {
		defaultValues = {
			energy: 0,
			heat: 0
		}

		getScreenName(): string {
			return null;
		}

		getTier(): number {
			return 3;
		}

		canRotate(): boolean {
			return true;
		}

		canReceiveAngularMomentum(side: number): boolean {
			Logger.Log("ss", "recAng");
			Logger.Log("ss", side.toString());
			Logger.Log("ss", this.getFacing().toString());
			
			return side == this.getFacing();
		}

		receiveAngularMomentum(amount: number): number {
			if (this.data.energy == 0) {
				this.data.energy = Math.round(amount / 4);
				Logger.Log("am", amount.toString());
				Logger.Log("amen", this.data.energy.toString());
				return amount;
			}
			Logger.Log("ss", amount.toString());
			return 0;
		}

		energyTick(type: string, src: EnergyTileNode): void {
			if (src.add(this.data.energy) < this.data.energy) {
				this.data.energy = 0;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.kineticGenerator, new KineticGenerator());
}