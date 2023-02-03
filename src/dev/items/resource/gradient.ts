ItemRegistry.createItem("rotorWooden", {name: "Wooden rotor", icon: "rotor_wooden"});
ItemRegistry.createItem("rotorIron", {name: "Iron rotor", icon: "rotor_iron"});
ItemRegistry.createItem("rotorSteel", {name: "Steel rotor", icon: "rotor_steel"});
ItemRegistry.createItem("rotorCarbon", {name: "Carbon rotor", icon: "rotor_carbon"});

ItemRegistry.createItem("bladeWooden", {name: "Wooden blade", icon: "rotor_blade_wooden"});
ItemRegistry.createItem("bladeIron", {name: "Iron blade", icon: "rotor_blade_iron"});
ItemRegistry.createItem("bladeSteel", {name: "Steel blade", icon: "rotor_blade_steel"});
ItemRegistry.createItem("bladeCarbon", {name: "Carbon blade", icon: "rotor_blade_carbon"});

Item.addCreativeGroup("blade", Translation.translate("Rotor Blades"), [
	ItemID.bladeWooden,
	ItemID.bladeIron,
	ItemID.bladeSteel,
	ItemID.bladeCarbon,
]);

Item.addCreativeGroup("rotor", Translation.translate("Rotors"), [
	ItemID.rotorWooden,
	ItemID.rotorIron,
	ItemID.rotorSteel,
	ItemID.rotorCarbon,
]);
