IDRegistry.genBlockID("geothermalGenerator");
Block.createBlock("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.geothermalGenerator, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.geothermalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.geothermalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.geothermalGenerator);

MachineRegistry.setMachineDrop("geothermalGenerator", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"xax",
		"xax",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', ItemID.cellEmpty, 0, 'b', ItemID.casingIron, 0, 'x', 20, -1]);
});


let guiGeothermalGenerator = InventoryWindow("Geothermal Generator", {
	drawing: [
		{type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE},
		{type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE}
	],

	elements: {
		"energyScale": {type: "scale", x: 702 + 4*GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"liquidScale": {type: "scale", x: 581 + 4*GUI_SCALE, y: 75 + 4*GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE},
		"slot1": {type: "slot", x: 440, y: 75},
		"slot2": {type: "slot", x: 440, y: 183},
		"slotEnergy": {type: "slot", x: 725, y: 165}
	}
});

Callback.addCallback("LevelLoaded", function() {
	MachineRegistry.updateGuiHeader(guiGeothermalGenerator, "Geothermal Generator");
});

namespace Machine {
	export class GeothermalGenerator
	extends Generator {
		getScreenByName() {
			return guiGeothermalGenerator;
		}

		setupContainer(): void {
			this.liquidStorage.setLimit("lava", 8);

			StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", (name, id) => {
				return ChargeItemRegistry.isValidItem(id, "Eu", 1);
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id, count, data) => {
				return LiquidLib.getItemLiquid(id, data) == "lava";
			});
			this.container.setSlotAddTransferPolicy("slot2", () => 0);
		}

		getLiquidFromItem(liquid: string, inputItem: ItemInstance, outputItem: ItemInstance, byHand?: boolean): boolean {
			return MachineRegistry.getLiquidFromItem.call(this, liquid, inputItem, outputItem, byHand);
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				return this.getLiquidFromItem("lava", item, null, true);
			}
			return super.onItemUse(coords, item, player);
		}

		tick(): void {
			StorageInterface.checkHoppers(this);

			let slot1 = this.container.getSlot("slot1");
			let slot2 = this.container.getSlot("slot2");
			this.getLiquidFromItem("lava", slot1, slot2);

			let energyStorage = this.getEnergyStorage();
			if (this.liquidStorage.getAmount("lava").toFixed(3) as any >= 0.001 && this.data.energy + 20 <= energyStorage) {
				this.data.energy += 20;
				this.liquidStorage.getLiquid("lava", 0.001);
				this.setActive(true);
			}
			else {
				this.setActive(false);
			}

			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot("slotEnergy"), "Eu", this.data.energy, 1);

			this.liquidStorage.updateUiScale("liquidScale", "lava");
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendChanges();
		}

		getOperationSound() {
			return "GeothermalLoop.ogg";
		}

		getEnergyStorage(): number {
			return 10000;
		}
	}

	MachineRegistry.registerPrototype(BlockID.geothermalGenerator, new GeothermalGenerator());

	StorageInterface.createInterface(BlockID.geothermalGenerator, {
		slots: {
			"slot1": {input: true},
			"slot2": {output: true}
		},
		isValidInput: (item: ItemInstance) => (
			LiquidLib.getItemLiquid(item.id, item.data) == "lava"
		),
		canReceiveLiquid: (liquid: string) => liquid == "lava",
		canTransportLiquid: (liquid: string) => false
	});
}