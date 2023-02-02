ItemRegistry.createItem("shaftIron", {name: "Iron shaft", icon: "shaft_iron"});
ItemRegistry.createItem("shaftSteel", {name: "Steel shaft", icon: "shaft_steel"});

Item.addCreativeGroup("shaft", Translation.translate("Shafts"), [
	ItemID.shaftIron,
	ItemID.shaftSteel,
]);
