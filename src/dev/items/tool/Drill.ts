/// <reference path="ElectricTool.ts" />

class ToolDrill
extends ElectricTool {
	constructor(stringID: string, name: string, toolData: {energyPerUse: number, level: number, efficiency: number, damage: number}, maxCharge: number, transferLimit: number, tier: number) {
		super(stringID, name, toolData, ["stone", "dirt"], maxCharge, transferLimit, tier);
	}

	onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number) {
		if (Block.getDestroyTime(block.id) > 0) {
			ICTool.dischargeItem(item, this.energyPerUse, player);
			//this.playDestroySound(item, block);
		}
		return true;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, playerUid: number) {
		let region = WorldRegion.getForActor(playerUid);
		let place = coords as Vector;
		if (!World.canTileBeReplaced(block.id, block.data)) {
			place = coords.relative;
			let block2 = region.getBlock(place);
			if (!World.canTileBeReplaced(block2.id, block2.data)) {
				return;
			}
		}
		let player = new PlayerManager(playerUid);
		for (let i = 9; i < 45; i++) {
			let slot = player.getInventorySlot(i);
			if (slot.id == 50) {
				if (Block.isSolid(block.id)) {
					region.setBlock(place, 50, (6 - coords.side)%6);
				} else {
					let blockID = region.getBlockId(place.x, place.y - 1, place.z);
					if (Block.isSolid(blockID)) {
						region.setBlock(place, 50, 5);
					} else {
						break;
					}
				}
				player.setInventorySlot(i, --slot.count > 0 ? slot.id : 0, slot.count, 0);
				break;
			}
		}
	}

	continueDestroyBlock(item, coords, block, progress) {
		if (progress > 0) {
			this.playDestroySound(item, block);
		}
	}

	playDestroySound(item: ItemInstance, block: Tile) {
		if (ConfigIC.soundEnabled && ChargeItemRegistry.getEnergyStored(item) >= this.energyPerUse) {
			let hardness = Block.getDestroyTime(block.id);
			if (hardness > 1 || hardness < 0) {
				SoundManager.startPlaySound(SourceType.PLAYER, "DrillHard.ogg");
			}
			else if (hardness > 0) {
				SoundManager.startPlaySound(SourceType.PLAYER, "DrillSoft.ogg");
			}
		}
	}
}