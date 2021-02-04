/// <reference path="../BaseCards/CropVanilla.ts"/>
namespace Agriculture {
	export class CropCoffee extends CropCard {
		getID(): string {
			return "coffee";
		}

		getAttributes(): string[] {
			return ["Leaves", "Ingredient", "Beans"];
		}

		getDiscoveredBy(): string {
			return "Snoochy";
		}

		getProperties(): CropCardProperties {
			return {
				tier: 7,
				chemistry: 1,
				consumable: 4,
				defensive: 1,
				colorful: 2,
				weed: 0
			};
		}

		getBaseSeed(): BaseSeed {
			return {
				...super.getBaseSeed(),
				id: "ItemID.coffeeBeans"
			};
		}

		getMaxSize(): number {
			return 5;
		}

		canGrow(te: ICropTileEntity): boolean {
			const light = te.region.getLightLevel(te);
			return te.data.currentSize < 5 && light >= 9;
		}

		getGrowthDuration(te: ICropTileEntity): number {
			let base = AgricultureAPI.abstractFunctions["IC2CropCard"];
			if (te.data.currentSize == 3) {
				return Math.round(base.getGrowthDuration(te) * .5);
			} else if (te.data.currentSize == 4) {
				return Math.round(base.getGrowthDuration(te) * 1.5);
			}
			return super.getGrowthDuration(te);
		}

		canBeHarvested(te: ICropTileEntity): boolean {
			return te.data.currentSize >= 4;
		}

		getGain(te: ICropTileEntity): ItemInstance {
			if (te.data.currentSize == 4) return null;
			return { id: ItemID.coffeeBeans, count: 1, data: 0 };
		}

		getSizeAfterHarvest(te: ICropTileEntity): number {
			return 3;
		}
	}
}