/*
  ___               _                 _            _           _      ____                    __   _
 ║_ _║  _ __     __║ ║  _   _   ___  ║ ║_   _ __  ║_║   __ _  ║ ║    / ___║  _ __    __ _   _/ _║ ║ ║_
  ║ ║  ║ '_ \   / _` ║ ║ ║ ║ ║ / __║ ║ __║ ║ '__║ ,─╗  / _` ║ ║ ║   ║ ║     ║ '__║  / _` ║ [  _]  ║ __║
  ║ ║  ║ ║ ║ ║ ║ (_║ ║ ║ ║_║ ║ \__ \ ║ ║_  ║ ║    ║ ║ ║ (_║ ║ ║ ║   ║ ║___  ║ ║    ║ (_║ ║  ║ ║   ║ ║_
 ║___║ ║_║ ║_║  \__,_║  \__,_║ |___/  \__║ ║_║    ║_║  \__,_║ ║_║    \____║ ║_║     \__,_║  ║_║    \__║
 
 by MineExplorer (vk.com/vlad.gr2027) and NikolaySavenko (vk.com/savenkons)
 based on Industrial Core by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/
// libraries
IMPORT("BlockEngine");
IMPORT("flags");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("SoundLib");
IMPORT("BackpackAPI");
var startTime = Debug.sysTime();
ItemModel.setCurrentCacheGroup("industrial-craft", "1");
// constants
var GUI_SCALE = 3.2;
var GUI_SCALE_NEW = 3;
var fallVelocity = -0.0784;
var ELECTRIC_ITEM_MAX_DAMAGE = 27;
var INDEX_TO_COLOR = {
    0: "black",
    1: "red",
    2: "green",
    3: "brown",
    4: "blue",
    5: "purple",
    6: "cyan",
    7: "light_gray",
    8: "gray",
    9: "pink",
    10: "lime",
    11: "yellow",
    12: "light_blue",
    13: "magenta",
    14: "orange",
    15: "white"
};
// import values
var Color = android.graphics.Color;
var PotionEffect = Native.PotionEffect;
var ParticleType = Native.ParticleType;
var BlockSide = Native.BlockSide;
var EntityType = Native.EntityType;
// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);
// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone
// BLOCKS
Translation.addTranslation("rubber_tree_log", { en: "Rubber Tree Log", ru: "Древесина гевеи", es: "Madera de Árbol de Caucho", pt: "Madeira da árvore de borracha", zh: "橡胶树原木" });
Translation.addTranslation("rubber_tree_leaves", { en: "Rubber Tree Leaves", ru: "Листва гевеи", es: "Hojas de Arbol de Cáucho", pt: "Folhas da árvore de borracha", zh: "橡胶树树叶" });
Translation.addTranslation("rubber_tree_sapling", { en: "Rubber Tree Sapling", ru: "Саженец гевеи", es: "Pimpollo de Árbol de Caucho", pt: "Muda de árvore de borracha", zh: "橡胶树树苗" });
Translation.addTranslation("copper_ore", { en: "Copper Ore", ru: "Медная руда", es: "Mineral de Cobre", pt: "Minério de Cobre", zh: "铜矿石" });
Translation.addTranslation("tin_ore", { en: "Tin Ore", ru: "Оловянная руда", es: "Mineral de Estaño", pt: "Minério de Estanho", zh: "锡矿石" });
Translation.addTranslation("lead_ore", { en: "Lead Ore", ru: "Свинцовая руда", es: "Mineral de Plomo", pt: "Minério de Chumbo", zh: "铅矿石" });
Translation.addTranslation("uranium_ore", { en: "Uranium Ore", ru: "Урановая руда", es: "Mineral de Uranium", pt: "Minério de Urânio", zh: "铀矿石" });
Translation.addTranslation("iridium_ore", { en: "Iridium Ore", ru: "Иридиевая руда", es: "Mineral de Iridio", pt: "Minério de Irídio", zh: "铱矿石" });
Translation.addTranslation("copper_block", { en: "Copper Block", ru: "Медный блок", es: "Bloque de Cobre", pt: "Bloco de Cobre", zh: "铜块" });
Translation.addTranslation("tin_block", { en: "Tin Block", ru: "Оловянный блок", es: "Bloque de Estaño", pt: "Bloco de Estanho", zh: "锡块" });
Translation.addTranslation("bronze_block", { en: "Bronze Block", ru: "Бронзовый блок", es: "Bloque de Bronce", pt: "Bloco de Bronze", zh: "青铜块" });
Translation.addTranslation("lead_block", { en: "Lead Block", ru: "Свинцовый блок", es: "Bloque de Plomo", pt: "Bloco de Chumbo", zh: "铅块" });
Translation.addTranslation("steel_block", { en: "Steel Block", ru: "Стальной блок", es: "Bloque de Hierro Refinado", pt: "Bloco de Aço", zh: "钢块" });
Translation.addTranslation("silver_block", { en: "Silver Block", ru: "Серебряный блок", es: "Bloque de Plata", pt: "Bloco de Prata", zh: "银块" });
Translation.addTranslation("uranium_block", { en: "Uranium Block", ru: "Урановый блок", es: "Bloque de Uranio", pt: "Bloco de Urânio", zh: "铀块" });
Translation.addTranslation("mining_pipe", { en: "Mining Pipe", ru: "Буровая труба", es: "Tubo Minero", pt: "Tubo de Mineração", zh: "采矿管道" });
Translation.addTranslation("reinforced_stone", { en: "Reinforced Stone", ru: "Укреплённый камень", es: "Piedra Reforzada", pt: "Pedra Reforçada", zh: "防爆石" });
Translation.addTranslation("reinforced_glass", { en: "Reinforced Glass", ru: "Укреплённое стекло", es: "Cristal Reforzado", pt: "Vidro Reforçado", zh: "防爆玻璃" });
Translation.addTranslation("machine_block", { en: "Machine Block", ru: "Машинный блок", es: "Máquina", pt: "Bloco de Máquina Básica", zh: "基础机械外壳" });
Translation.addTranslation("advanced_machine_block", { en: "Advanced Machine Block", ru: "Улучшенный машинный блок", es: "Máquina Avanzada", pt: "Bloco de Máquina Avançada", zh: "高级机械外壳" });
// Generators
Translation.addTranslation("Generator", { ru: "Генератор", es: "Generador", pt: "Gerador", zh: "火力发电机" });
Translation.addTranslation("Geothermal Generator", { ru: "Геотермальный генератор", es: "Generador Geotérmico", pt: "Gerador Geotérmico", zh: "地热发电机" });
Translation.addTranslation("Solar Panel", { ru: "Солнечная панель", es: "Panel Solar", pt: "Painel Solar", zh: "太阳能发电机" });
Translation.addTranslation("Water Mill", { ru: "Гидрогенератор", es: "Molino de Agua", pt: "Moinho de água", zh: "水力发电机" });
Translation.addTranslation("Wind Mill", { ru: "Ветрогенератор", es: "Molino de Viento", pt: "Cata-vento", zh: "风力发电机" });
Translation.addTranslation("Radioisotope Thermoelectric Generator", { ru: "Радиоизотопный термоэлектрический генератор", es: "Generador Radioisotopos Termoeléctrico", pt: "Gerador Termoelétrico de Radioisótopos", zh: "放射性同位素温差发电机" });
Translation.addTranslation("Semifluid Generator", { ru: "Полужидкостный генератор", es: "Generador a Semifluidos", pt: "Gerador a Semi-Fluidos", zh: "半流质发电机" });
Translation.addTranslation("Stirling Generator", { ru: "Генератор Стирлинга", es: "Generador Stirling", pt: "Gerador a Calor", zh: "斯特林发电机" });
Translation.addTranslation("Nuclear Reactor", { ru: "Ядерный реактор", es: "Reactor Nuclear", pt: "Reator Nuclear", zh: "核反应堆" });
Translation.addTranslation("Reactor Chamber", { ru: "Реакторная камера", es: "Cámara del Reactor", pt: "Câmara do Reator", zh: "核反应仓" });
// Heat Generators
Translation.addTranslation("Liquid Fuel Firebox", { ru: "Жидкостный теплогенератор", es: "Generador de Calor Líquido", pt: "Aquecedor a Combustível Líquido", zh: "流体加热机" });
Translation.addTranslation("Solid Fuel Firebox", { ru: "Твердотопливный теплогенератор", es: "Generador de calor sólido", pt: "Aquecedor a Combustível Sólido", zh: "固体加热机" });
Translation.addTranslation("Electric Heater", { ru: "Электрический теплогенератор", es: "Generador Eléctrico De Calor", pt: "Aquecedor Elétrico", zh: "电力加热机" });
Translation.addTranslation("Radioisotope Heat Generator", { ru: "Радиоизотопный теплогенератор", es: "Generador de Calor de Radioisótopos", pt: "Aquecedor a Radioisótopos", zh: "放射性同位素温差加热机" });
// Energy storage
Translation.addTranslation("BatBox", { ru: "Энергохранилище", es: "Caja de Baterías", pt: "Caixa de Baterias (CB)", zh: "储电箱" });
Translation.addTranslation("CESU", { ru: "МЭСН", es: "Unidad CESU", pt: "Unidade de Armazenamento de Energia (UAE)", zh: "CESU储电箱" });
Translation.addTranslation("MFE", { ru: "МФЭ", es: "Unidad MFE", pt: "Transmissor de Energia Multi-funcional (TEMF)", zh: "MFE储电箱" });
Translation.addTranslation("MFSU", { ru: "МФСУ", es: "Unidad MFSU", pt: "Unidade de Armazenamento Multi-funcional (UAMF)", zh: "MFSU储电箱" });
// Transformer
Translation.addTranslation("LV Transformer", { ru: "Трансформатор НН", es: "Transformador de Baja Tensión", pt: "Transformador de Baixa Voltagem", zh: "低压变压器" });
Translation.addTranslation("MV Transformer", { ru: "Трансформатор СН", es: "Transformador de Media Tensión", pt: "Transformador de Média Voltagem", zh: "中压变压器" });
Translation.addTranslation("HV Transformer", { ru: "Трансформатор ВН", es: "Transformador de Alta Tensión", pt: "Transformador de Alta Voltagem", zh: "高压变压器" });
Translation.addTranslation("EV Transformer", { ru: "Трансформатор СВН", es: "Transformador de Extrema Tensión", pt: "Transformador de Voltagem Extrema", zh: "超高压变压器" });
// Machines
Translation.addTranslation("Luminator", { ru: "Электролампа", es: "Lámpara", pt: "Iluminador", zh: "日光灯" });
Translation.addTranslation("Iron Furnace", { ru: "Железная печь", es: "Horno de Hierro", pt: "Fornalha de Ferro", zh: "铁炉" });
Translation.addTranslation("Electric Furnace", { ru: "Электрическая печь", es: "Horno Eléctrico", pt: "Fornalha Elétrica", zh: "电炉" });
Translation.addTranslation("Induction Furnace", { ru: "Индукционная печь", es: "Horno de Induccion", pt: "Fornalha de Indução", zh: "感应炉" });
Translation.addTranslation("Macerator", { ru: "Дробитель", es: "Trituradora", pt: "Macerador", zh: "打粉机" });
Translation.addTranslation("Compressor", { ru: "Компрессор", es: "Compresor", pt: "Compactador", zh: "压缩机" });
Translation.addTranslation("Extractor", { ru: "Экстрактор", es: "Extractor", pt: "Extrator", zh: "提取机" });
Translation.addTranslation("Recycler", { ru: "Утилизатор", es: "Reciclador", pt: "Recicladora", zh: "回收机" });
Translation.addTranslation("Metal Former", { ru: "Металлоформовщик", es: "Arqueador de Metal", pt: "Moldelador de Metais", zh: "金属成型机" });
Translation.addTranslation("Ore Washing Plant", { ru: "Рудопромывочная машина", es: "Planta de Lavado de Minerales", pt: "Estação de Lavagem de Minérios", zh: "洗矿机" });
Translation.addTranslation("Thermal Centrifuge", { ru: "Термальная центрифуга", es: "Centrífuga Térmica", pt: "Centrífuga Térmica", zh: "热能离心机" });
Translation.addTranslation("Blast Furnace", { ru: "Доменная печь", es: "Alto Horno", pt: "Fornalha de Aquecimento", zh: "高炉" });
Translation.addTranslation("Miner", { ru: "Буровая установка", es: "Perforadora", pt: "Minerador", zh: "采矿机" });
Translation.addTranslation("Advanced Miner", { ru: "Продвинутый автошахтёр", es: "Minero Avanzado", pt: "Minerador Avançado", zh: "高级采矿机" });
Translation.addTranslation("Tesla Coil", { ru: "Катушка теслы", es: "Bobina de Tesla", pt: "Bobina de Tesla", zh: "特斯拉线圈" });
Translation.addTranslation("Teleporter", { ru: "Телепортер", es: "Teletransportador", pt: "Teletransportador", zh: "传送机" });
Translation.addTranslation("Mass Fabricator", { ru: "Производитель материи", es: "Materializador", pt: "Fabricador de Massa", zh: "物质生成机" });
Translation.addTranslation("Fermenter", { ru: "Ферментер", es: "Fermentadora", pt: "Fermentador", zh: "发酵机" });
Translation.addTranslation("Solid Canning Machine", { ru: "Консервирующий механизм", es: "Máquina de Enlatado", pt: "Enlatadora de Sólidos", zh: "固体装罐机" });
Translation.addTranslation("Fluid/Solid Canning Machine", { ru: "Универсальный наполняющий механизм", es: "Enlatadora de Líquidos/Sólidos", pt: "Enlatadora de Fluidos/Sólidos", zh: "流体/固体装罐机" });
Translation.addTranslation("Crop Matron", { ru: "Автосадовник", es: "Máquina Cosechadora", pt: "Fazendeiro", zh: "作物监管机" });
Translation.addTranslation("Crop Harvester", { ru: "Сборщик урожая", es: "Cocechador de Cultivo", pt: "Colheitadeira", zh: "作物收割机" });
// Explosive
Translation.addTranslation("Nuke", { ru: "Ядерная бомба", pt: "Bomba Nuke", zh: "核弹" });
// Fluid
Translation.addTranslation("Pump", { ru: "Помпа", es: "Bomba Extractora", pt: "Bomba", zh: "泵" });
Translation.addTranslation("Fluid Distributor", { ru: "Жидкостный распределитель", es: "Distribuidor de Líquido", pt: "Distribuidor de Fluidos", zh: "流体分配机" });
Translation.addTranslation("Tank", { ru: "Бак", es: "Tanque", pt: "Tanque", zh: "流体储存器" });
// ITEMS
Translation.addTranslation("latex", { en: "Latex", ru: "Латекс", es: "Caucho", pt: "Resina Pegajosa", zh: "粘性树脂" });
Translation.addTranslation("rubber", { en: "Rubber", ru: "Резина", es: "Rubber", pt: "Borracha", zh: "橡胶" });
Translation.addTranslation("ashes", { en: "Ashes", ru: "Пепел", es: "Ceniza", pt: "Cinzas", zh: "灰烬" });
Translation.addTranslation("slag", { en: "Slag", ru: "Шлак", es: "Escoria", pt: "Sucata", zh: "渣渣" });
Translation.addTranslation("bio_chaff", { en: "Bio Chaff", ru: "Отходы", pt: "Bio-Produto", zh: "糠" });
Translation.addTranslation("scrap", { en: "Scrap", ru: "Утильсырьё", es: "Chatarra", pt: "Sucata", zh: "废料" });
Translation.addTranslation("scrap_box", { en: "Scrap Box", ru: "Коробка утильсырья", es: "Caja de Chatarra", pt: "Caixa de Sucata", zh: "废料盒" });
Translation.addTranslation("uu_matter", { en: "UU-Matter", ru: "Материя", es: "Materia", pt: "Metéria UU", zh: "UU物质" });
Translation.addTranslation("iridium_chunk", { en: "Iridium", ru: "Иридий", es: "Mineral de Iridio", pt: "Minério de Irídio", zh: "铱碎片" });
Translation.addTranslation("iridium_reinforced_plate", { en: "Iridium Reinforced Plate", ru: "Иридиевый композит", es: "Placa de Iridio", pt: "Placa Reforçada com Irídio", zh: "强化铱板" });
Translation.addTranslation("alloy_plate", { en: "Alloy Plate", ru: "Композит", es: "Compuesto Avanzado", pt: "Liga Avançada", zh: "高级合金" });
Translation.addTranslation("carbon_fibre", { en: "Carbon Fibre", ru: "Углеволокно", es: "Fibra de Carbono Básica", pt: "Fibra de Carbono Bruto", zh: "粗制碳网" });
Translation.addTranslation("carbon_mesh", { en: "Carbon Mesh", ru: "Углеткань", es: "Malla de Carbono Básica", pt: "Malha de Carbono", zh: "粗制碳板" });
Translation.addTranslation("carbon_plate", { en: "Carbon Plate", ru: "Углепластик", es: "Placa de Carbono", pt: "Placa de Carbono", zh: "碳板" });
Translation.addTranslation("coal_ball", { en: "Coal Ball", ru: "Угольный шарик", es: "Bola de Carbón", pt: "Bola de Carvão", zh: "煤球" });
Translation.addTranslation("coal_block", { en: "Coal Block", ru: "Сжатый угольный шарик", es: "Bola de Carbón Compactada", pt: "Bola de Carvão Comprimido", zh: "压缩煤球" });
Translation.addTranslation("coal_chunk", { en: "Coal Chunk", ru: "Угольная глыба", es: "Carbono Bruto", zh: "煤块", pt: "Pedaço de Carvão" });
// Nuclear
Translation.addTranslation("enriched_uranium", { en: "Enriched Uranium", ru: "Обогащённый уран", es: "Uranio Enriquecido", pt: "Urânio Enriquecido", zh: "浓缩铀核燃料" });
Translation.addTranslation("uranium_235", { en: "Uranium 235", ru: "Уран-235", es: "Uranio 235", pt: "Urânio 235", zh: "铀-235" });
Translation.addTranslation("small_uranium_235", { en: "Piece of Uranium 235", ru: "Кусочек урана-235", es: "Diminuta Pila de Uranio 235", pt: "Pequena Pilha de Urânio 235", zh: "小撮铀-235" });
Translation.addTranslation("uranium_238", { en: "Uranium 238", ru: "Уран-238", es: "Uranio 238", pt: "Urânio 238", zh: "铀-238" });
Translation.addTranslation("small_uranium_238", { en: "Piece of Uranium 238", ru: "Кусочек урана-238", es: "Diminuta Pila de Uranio 238", pt: "Pequena Pilha de Urânio 238", zh: "小撮铀-238" });
Translation.addTranslation("plutonium", { en: "Plutonium", ru: "Плутоний", es: "Plutonio", pt: "Plutônio", zh: "钚" });
Translation.addTranslation("small_plutonium", { en: "Piece of Plutonium", ru: "Кусочек плутония", es: "Diminuta Pila de Plutonio", pt: "Pequena Pilha de Plutônio", zh: "小撮钚" });
Translation.addTranslation("mox_fuel", { en: "MOX Nuclear Fuel", ru: "Ядерное топливо MOX", es: "MOX Combustible Nuclear", pt: "Combustível Nuclear de MOX", zh: "钚铀混合氧化物核燃料(MOX)" });
Translation.addTranslation("rtg_pellet", { en: "Pellets of RTG Fuel", ru: "Пеллета РИТЭГ-топлива", es: "Perdigones de Combustible RTG", pt: "Pastilhas de Combustível de GTR", zh: "放射性同位素燃料靶丸" });
// Reactor Stuff - Radioactive Items
Translation.addTranslation("fuel_rod", { en: "Fuel Rod (Empty)", ru: "Топливный стержень (Пустой)", es: "Vara Combustible (Vacía)", pt: "Haste de Combustível (Vazia)", zh: "燃料棒(空)" });
Translation.addTranslation("uranium_fuel_rod", { en: "Fuel Rod (Uranium)", ru: "Топливный стержень (Уран)", es: "Vara Combustible (Uranio)", pt: "Haste de Combustível (Urânio)", zh: "燃料棒(铀)" });
Translation.addTranslation("dual_uranium_fuel_rod", { en: "Dual Fuel Rod (Uranium)", ru: "Спаренный топливный стержень (Уран)", es: "Vara Combustible Doble (Uranio)", pt: "Haste de Combustível Dupla (Urânio)", zh: "双联燃料棒(铀)" });
Translation.addTranslation("quad_uranium_fuel_rod", { en: "Quad Fuel Rod (Uranium)", ru: "Счетверённый топливный стержень (Уран)", es: "Vara Combustible Cuádruple (Uranio)", pt: "Haste de Combustível Quádrupla (Urânio)", zh: "四联燃料棒(铀)" });
Translation.addTranslation("mox_fuel_rod", { en: "Fuel Rod (MOX)", ru: "Топливный стержень (MOX)", es: "Vara Combustible (MOX)", pt: "Haste de Combustível (MOX)", zh: "燃料棒(MOX)" });
Translation.addTranslation("dual_mox_fuel_rod", { en: "Dual Fuel Rod (MOX)", ru: "Спаренный топливный стержень (MOX)", es: "Vara Combustible Doble (MOX)", pt: "Haste de Combustível Dupla (MOX)", zh: "双联燃料棒(MOX)" });
Translation.addTranslation("quad_mox_fuel_rod", { en: "Quad Fuel Rod (MOX)", ru: "Счетверённый топливный стержень (MOX)", es: "Vara Combustible Cuádruple (MOX)", pt: "Haste de Combustível Quádrupla (MOX)", zh: "四联燃料棒(MOX)" });
Translation.addTranslation("depleted_uranium_fuel_rod", { en: "Fuel Rod (Depleted Uranium)", ru: "Топливный стержень (Обеднённый Уран)", es: "Vara Combustible (Uranio Empobrecido)", pt: "Haste de Combustível (Urânio Esgotado)", zh: "燃料棒(枯竭铀)" });
Translation.addTranslation("depleted_dual_uranium_fuel_rod", { en: "Dual Fuel Rod (Depleted Uranium)", ru: "Спаренный топливный стержень (Обеднённый Уран)", es: "Vara Combustible Doble (Uranio Empobrecido)", pt: "Haste de Combustível Dupla (Urânio Esgotado)", zh: "双联燃料棒(枯竭铀)" });
Translation.addTranslation("depleted_quad_uranium_fuel_rod", { en: "Quad Fuel Rod (Depleted Uranium)", ru: "Счетверённый топливный стержень (Обеднённый Уран)", es: "Vara Combustible Cuádruple (Uranio Empobrecido)", pt: "Haste de Combustível Quádrupla (Urânio Esgotado)", zh: "四联燃料棒(枯竭铀)" });
Translation.addTranslation("depleted_mox_fuel_rod", { en: "Fuel Rod (Depleted MOX)", ru: "Топливный стержень (Обеднённый MOX)", es: "Vara Combustible (MOX Empobrecido)", pt: "Haste de Combustível (MOX Esgotado)", zh: "燃料棒(枯竭MOX)" });
Translation.addTranslation("depleted_dual_mox_fuel_rod", { en: "Dual Fuel Rod (Depleted MOX)", ru: "Спаренный топливный стержень (Обеднённый MOX)", es: "Vara Combustible Doble (MOX Empobrecido)", pt: "Haste de Combustível Dupla (MOX Esgotado)", zh: "双联燃料棒(枯竭MOX)" });
Translation.addTranslation("depleted_quad_mox_fuel_rod", { en: "Quad Fuel Rod (Depleted MOX)", ru: "Счетверённый топливный стержень (Обеднённый MOX)", es: "Vara Combustible Cuádruple (MOX Empobrecido)", pt: "Haste de Combustível Quádrupla (MOX Esgotado)", zh: "四联燃料棒(枯竭MOX)" });
// Reactor Stuff - Cooling/Heat Management
Translation.addTranslation("reactor_plating", { en: "Reactor Plating", ru: "Обшивка реактора", es: "Revestimiento para Reactor", pt: "Placa de Reator", zh: "反应堆隔板" });
Translation.addTranslation("containment_reactor_plating", { en: "Containment Reactor Plating", ru: "Сдерживающая реакторная обшивка", es: "Revestimiento de Reactor con Capacidad de Calor", pt: "Placa de Contenção de Reator", zh: "高热容反应堆隔板" });
Translation.addTranslation("heat_reactor_plating", { en: "Heat-Capacity Reactor Plating", ru: "Теплоёмкая реакторная обшивка", es: "Revestimiento de Contención para Reactor", pt: "Placa de Reator com Capacidade de Calor", zh: "密封反应堆隔热板" });
Translation.addTranslation("neutron_reflector", { en: "Neutron Reflector", ru: "Отражатель нейтронов", es: "Reflector de Neutrones", pt: "Refletor de Neutrons", zh: "中子反射板" });
Translation.addTranslation("thick_neutron_reflector", { en: "Thick Neutron Reflector", ru: "Утолщённый отражатель нейтронов", es: "Reflector de Neutrones Grueso", pt: "Refletor de Neutrons Grosso", zh: "加厚中子反射板" });
Translation.addTranslation("iridium_neutron_reflector", { en: "Iridium Neutron Reflector", ru: "Иридиевый отражатель нейтронов", es: "Reflector de Neutrones de Iridio", pt: "Refletor de Neutrons de Irídio", zh: "铱中子反射板" });
Translation.addTranslation("heat_storage", { en: "10k Coolant Cell", ru: "Охлаждающая капсула 10к", es: "Celda Refrigerante 10k", pt: "Célula Refrigerante de 10k", zh: "10k冷却单元" });
Translation.addTranslation("tri_heat_storage", { en: "30k Coolant Cell", ru: "Охлаждающая капсула 30к", es: "Celda Refrigerante 30k", pt: "Célula Refrigerante de 30k", zh: "30k冷却单元" });
Translation.addTranslation("six_heat_storage", { en: "60k Coolant Cell", ru: "Охлаждающая капсула 60к", es: "Celda Refrigerante 60k", pt: "Célula Refrigerante de 60k", zh: "60k冷却单元" });
Translation.addTranslation("heat_exchanger", { en: "Heat Exchanger", ru: "Теплообменник", es: "Intercambiador de Calor", pt: "Trocador de Calor", zh: "热交换器" });
Translation.addTranslation("advanced_heat_exchanger", { en: "Advanced Heat Exchanger", ru: "Улучшенный теплообменник", es: "Intercambiador de Calor para Reactor", pt: "Trocador de Calor Avançado", zh: "高级热交换器" });
Translation.addTranslation("component_heat_exchanger", { en: "Component Heat Exchanger", ru: "Компонентный теплообменник", es: "Intercambiador de Calor para Componentes", pt: "Trocador de Calor Componente", zh: "元件热交换器" });
Translation.addTranslation("reactor_heat_exchanger", { en: "Reactor Heat Exchanger", ru: "Реакторный теплообменник", es: "Intercambiador de Calor para Reactor", pt: "Trocador de Calor do Reator", zh: "反应堆热交换器" });
Translation.addTranslation("heat_vent", { en: "Heat Vent", ru: "Теплоотвод", es: "Ventilación de Calor", pt: "Ventilação de Calor", zh: "散热片" });
Translation.addTranslation("component_heat_vent", { en: "Component Heat Vent", ru: "Компонентный теплоотвод", es: "Componente para Ventilación de Calor", pt: "Ventilação de Calor Componente", zh: "元件散热片" });
Translation.addTranslation("reactor_heat_vent", { en: "Reactor Heat Vent", ru: "Реакторный теплоотвод", es: "Ventilación de Calor para Reactor", pt: "Ventilação de Calor para Reator", zh: "反应堆散热片" });
Translation.addTranslation("advanced_heat_vent", { en: "Advanced Heat Vent", ru: "Улучшенный теплоотвод", es: "Ventilación de Calor Avanzada", pt: "Ventilação de Calor Avançada", zh: "高级散热片" });
Translation.addTranslation("overclocked_heat_vent", { en: "Overclocked Heat Vent", ru: "Разогнанный теплоотвод", es: "Ventilación de Calor con Sobreproducción", pt: "Ventilação de Calor com Overclock", zh: "超频散热片" });
Translation.addTranslation("rsh_condensator", { en: "RSH-Condensator", ru: "Красный конденсатор", es: "RSH-Condensador", pt: "Condensador de Calor de Redstone (CCR)", zh: "红石冷凝模块" });
Translation.addTranslation("lzh_condensator", { en: "LZH-Condensator", ru: "Лазуритовый конденсатор", es: "LZH-Condensador", pt: "Condensador de Calor de Lápis-Lazúli (CCL)", zh: "青金石冷凝模块" });
// Crafting Components
Translation.addTranslation("electronic_circuit", { en: "Electronic Circuit", ru: "Электросхема", es: "Circuito Electrónico", pt: "Circuito Eletrônico", zh: "电路板" });
Translation.addTranslation("advanced_circuit", { en: "Advanced Circuit", ru: "Улучшенная электросхема", es: "Circuito Avanzado", pt: "Circuito Avançado", zh: "高级电路板" });
Translation.addTranslation("coil", { en: "Coil", ru: "Катушка", es: "Bobina", pt: "Bobina", zh: "线圈" });
Translation.addTranslation("electric_motor", { en: "Electric Motor", ru: "Электромотор", es: "Motor Eléctrico", pt: "Motor Elétrico", zh: "电动马达" });
Translation.addTranslation("power_unit", { en: "Power Unit", ru: "Силовой агрегат", es: "Unidad de Potencia", pt: "Motor", zh: "驱动把手" });
Translation.addTranslation("small_power_unit", { en: "Small Power Unit", ru: "Малый силовой агрегат", es: "Pequeña Unidad de Potencia", pt: "Motor Pequeno", zh: "小型驱动把手" });
Translation.addTranslation("heat_conductor", { en: "Heat Conductor", ru: "Теплопроводник ", es: "Conductor de calor", pt: "Condutor de Calor", zh: "热传导器" });
// Energy Storage
Translation.addTranslation("re_battery", { en: "RE-Battery", ru: "Аккумулятор", es: "Batería Recargable", pt: "Bateria Reutilizável", zh: "充电电池" });
Translation.addTranslation("adv_re_battery", { en: "Advanced RE-Battery", ru: "Продвинутый аккумулятор", es: "Bateria-RE Avanzada", pt: "Bateria Reutilizável Avançada", zh: "高级充电电池" });
Translation.addTranslation("energy_crystal", { en: "Energy Crystal", ru: "Энергетический кристалл", es: "Cristal de Energía", pt: "Cristal de Energia", zh: "能量水晶" });
Translation.addTranslation("lapotron_crystal", { en: "Lapotron Crystal", ru: "Лазуротроновый кристалл", es: "Cristal Lapotron", pt: "Cristal Lapotrônico", zh: "兰波顿水晶" });
Translation.addTranslation("charging_re_battery", { en: "Charging RE-Battery", ru: "Заряжающий аккумулятор", es: "Batería Cargadora", pt: "Bateria Reutilizável Carregadora", zh: "RE充电电池" });
Translation.addTranslation("adv_charging_battery", { en: "Advanced Charging Battery", ru: "Продвинутый заряжающий аккумулятор", es: "Bateria Cargadora Avanzada", pt: "Bateria Carregadora Avançada", zh: "高级充电电池" });
Translation.addTranslation("charging_energy_crystal", { en: "Charging Energy Crystal", ru: "Заряжающий энергетический кристалл", es: "Cargador de Cristales de Energía", pt: "Carregador de Cristais de Energia", zh: "能量水晶充电电池" });
Translation.addTranslation("charging_lapotron_crystal", { en: "Charging Lapotron Crystal", ru: "Заряжающий лазуротроновый кристалл", es: "Cargador de Cristales Lapotron", pt: "Carregador de Cristais Lapotrônicos", zh: "兰波顿充电电池" });
// Upgrades
Translation.addTranslation("mfsu_upgrade", { en: "MFSU Upgrade Kit", ru: "Набор улучшения МФСУ", es: "Kit de Actualización MFSU", pt: "Kit de Melhoria UAMF", zh: "MFSU升级组件" });
Translation.addTranslation("overclocker_upgrade", { en: "Overclocker Upgrade", ru: "Улучшение «Ускоритель»", es: "Mejora de Sobreproducción", pt: "Melhoria: Overclock", zh: "超频升级" });
Translation.addTranslation("transformer_upgrade", { en: "Transformer Upgrade", ru: "Улучшение «Трансформатор»", es: "Mejora de Transformador", pt: " Melhoria: Transformador Interno", zh: "高压升级" });
Translation.addTranslation("energy_storage_upgrade", { en: "Energy Storage Upgrade", ru: "Улучшение «Энергохранитель»", es: "Mejora de Almacenador de Energía", pt: "Melhoria: Armazenamento de Energia", zh: "储能升级" });
Translation.addTranslation("redstone_inv_upgrade", { en: "Redstone Signal Inverter Upgrade", ru: "Улучшение «Инвертор сигнала редстоуна»", es: "Majora de Invesor de señal Redstone", pt: "Melhoria: Inversor de Sinal de Redstone", zh: "红石信号反转升级" });
Translation.addTranslation("ejector_upgrade", { en: "Ejector Upgrade", ru: "Улучшение «Выталкиватель»", es: "Mejora Expulsora", pt: "Melhoria: Ejetor", zh: "弹出升级" });
Translation.addTranslation("pulling_upgrade", { en: "Pulling Upgrade", ru: "Улучшение «Загрузчик»", es: "Mejora de Traccion", pt: "Melhoria: Sucção", zh: "抽入升级" });
Translation.addTranslation("fluid_ejector_upgrade", { en: "Fluid Ejector Upgrade", ru: "Улучшение «Выталкиватель жидкости»", es: "Mejora Expulsora de Líquidos", pt: "Melhoria: Ejetor de Fluidos", zh: "流体弹出升级" });
Translation.addTranslation("fluid_pulling_upgrade", { en: "Fluid Pulling Upgrade", ru: "Улучшение «Загрузчик жидкости»", es: "Mejora Traccion de Líquidos", pt: "Melhoria: Injeção de Fluidos Avançada", zh: "流体抽入升级" });
// Crushed Ore
Translation.addTranslation("crushed_copper_ore", { en: "Crushed Copper Ore", ru: "Измельчённая медная руда", es: "Mineral de Cobre Triturado", pt: "Minério de Cobre Triturado", zh: "粉碎铜矿石" });
Translation.addTranslation("crushed_tin_ore", { en: "Crushed Tin Ore", ru: "Измельчённая оловянная руда", es: "Mineral de Estaño Triturado", pt: "Minério de Estanho Triturado", zh: "粉碎锡矿石" });
Translation.addTranslation("crushed_iron_ore", { en: "Crushed Iron Ore", ru: "Измельчённая железная руда", es: "Mineral de Hierro Triturado", pt: "Minério de Ferro Triturado", zh: "粉碎铁矿石" });
Translation.addTranslation("crushed_lead_ore", { en: "Crushed Lead Ore", ru: "Измельчённая свинцовая руда", es: "Mineral de Plomo Triturado", pt: "Minério de Chumbo Triturado", zh: "粉碎铅矿石" });
Translation.addTranslation("crushed_gold_ore", { en: "Crushed Gold Ore", ru: "Измельчённая золотая руда", es: "Mineral de Oro Triturado", pt: "Minério de Ouro Triturado", zh: "粉碎金矿石" });
Translation.addTranslation("crushed_silver_ore", { en: "Crushed Silver Ore", ru: "Измельчённая серебряная руда", es: "Mineral de Plata Triturado", pt: "Minério de Prata Triturado", zh: "粉碎银矿石" });
Translation.addTranslation("crushed_uranium_ore", { en: "Crushed Uranium Ore", ru: "Измельчённая урановая руда", es: "Mineral de Uranio Triturado", pt: "Minério de Urânio Triturado", zh: "粉碎铀矿石" });
// Purified Ore
Translation.addTranslation("purified_copper_ore", { en: "Purified Crushed Copper Ore", ru: "Очищенная измельчённая медная руда", es: "Mineral de Cobre Triturado y Purificado", pt: "Minério Purificado de Cobre Triturado", zh: "纯净的粉碎铜矿石" });
Translation.addTranslation("purified_tin_ore", { en: "Purified Crushed Tin Ore", ru: "Очищенная измельчённая оловянная руда", es: "Mineral de Estaño Triturado y Purificado", pt: "Minério Purificado de Estanho Triturado", zh: "纯净的粉碎锡矿石" });
Translation.addTranslation("purified_iron_ore", { en: "Purified Crushed Iron Ore", ru: "Очищенная измельчённая железная руда", es: "Mineral de Hierro Triturado y Purificado", pt: "Minério Purificado de Ferro Triturado", zh: "纯净的粉碎铁矿石" });
Translation.addTranslation("purified_lead_ore", { en: "Purified Crushed Lead Ore", ru: "Очищенная измельчённая свинцовая руда", es: "Mineral de Plomo Triturado y Purificado", pt: "Minério Purificado de Chumbo Triturado", zh: "纯净的粉碎铅矿石" });
Translation.addTranslation("purified_gold_ore", { en: "Purified Crushed Gold Ore", ru: "Очищенная измельчённая золотая руда", es: "Mineral de Oro Triturado y Purificado", pt: "Minério Purificado de Ouro Triturado", zh: "纯净的粉碎金矿石" });
Translation.addTranslation("purified_silver_ore", { en: "Purified Crushed Silver Ore", ru: "Очищенная измельчённая серебряная руда", es: "Mineral de Plata Triturado y Purificado", pt: "Minério Purificado de Prata Triturada", zh: "纯净的粉碎银矿石" });
Translation.addTranslation("purified_uranium_ore", { en: "Purified Crushed Uranium Ore", ru: "Очищенная измельчённая урановая руда", es: "Mineral de Uranio Triturado y Purificado", pt: "Minério Purificado de Urânio Triturado", zh: "纯净的粉碎铀矿石" });
// Dusts
Translation.addTranslation("copper_dust", { en: "Copper Dust", ru: "Медная пыль", es: "Polvo de Cobre", pt: "Pó de Cobre", zh: "铜粉" });
Translation.addTranslation("tin_dust", { en: "Tin Dust", ru: "Оловянная пыль", es: "Polvo de Estaño", pt: "Pó de Estanho", zh: "锡粉" });
Translation.addTranslation("bronze_dust", { en: "Bronze Dust", ru: "Бронзовая пыль", es: "Polvo de Bronce", pt: "Pó de Bronze", zh: "青铜粉" });
Translation.addTranslation("iron_dust", { en: "Iron Dust", ru: "Железная пыль", es: "Polvo de Hierro", pt: "Pó de Ferro", zh: "铁粉" });
Translation.addTranslation("steel_dust", { en: "Steel Dust", ru: "Стальная пыль", es: "Polvo de Acero", pt: "Pó de Aço", zh: "钢粉" });
Translation.addTranslation("lead_dust", { en: "Lead Dust", ru: "Свинцовая пыль", es: "Polvo de Plomo", pt: "Pó de Chumbo", zh: "铅粉" });
Translation.addTranslation("gold_dust", { en: "Gold Dust", ru: "Золотая пыль", es: "Polvo de Oro", pt: "Pó de Ouro", zh: "金粉" });
Translation.addTranslation("silver_dust", { en: "Silver Dust", ru: "Серебряная пыль", es: "Polvo de Plata", pt: "Pó de Prata", zh: "银粉" });
Translation.addTranslation("stone_dust", { en: "Stone Dust", ru: "Каменная пыль", es: "Polvo de Piedra", pt: "Pó de Pedra", zh: "石粉" });
Translation.addTranslation("coal_dust", { en: "Coal Dust", ru: "Угольная пыль", es: "Polvo de Carbón", pt: "Pó de Carvão", zh: "煤粉" });
Translation.addTranslation("sulfur_dust", { en: "Sulfur Dust", ru: "Серная пыль", es: "Polvo de Sulfuro", pt: "Pó de Enxofre", zh: "硫粉" });
Translation.addTranslation("lapis_dust", { en: "Lapis Dust", ru: "Лазуритовая пыль", es: "Polvo de Lapislázuli", pt: "Pó de Lápis-Lazúli", zh: "青金石粉" });
Translation.addTranslation("diamond_dust", { en: "Diamond Dust", ru: "Алмазная пыль", es: "Polvo de Diamante", pt: "Pó de Diamante", zh: "钻石粉" });
Translation.addTranslation("energium_dust", { en: "Energium Dust", ru: "Энергетическая пыль", es: "Polvo de Energium", pt: "Pó de Enérgio", zh: "能量水晶粉" });
// Small Dusts
Translation.addTranslation("small_copper_dust", { en: "Tiny Pile of Copper Dust", ru: "Небольшая кучка медной пыли", es: "Diminuta Pila de Polvo de Cobre", pt: "Pequena Pilha de Pó de Cobre", zh: "小撮铜粉" });
Translation.addTranslation("small_tin_dust", { en: "Tiny Pile of Tin Dust", ru: "Небольшая кучка оловянной пыли", es: "Diminuta Pila de Polvo de Estaño", pt: "Pequena Pilha de Pó de Estanho", zh: "小撮锡粉" });
Translation.addTranslation("small_iron_dust", { en: "Tiny Pile of Iron Dust", ru: "Небольшая кучка железной пыли", es: "Diminuta Pila de Polvo de Hierro", pt: "Pequena Pilha de Pó de Ferro", zh: "小撮铁粉" });
Translation.addTranslation("small_lead_dust", { en: "Tiny Pile of Lead Dust", ru: "Небольшая кучка свинцовой пыли", es: "Diminuta Pila de Polvo de Plomo", pt: "Pequena Pilha de Pó de Chumbo", zh: "小撮铅粉" });
Translation.addTranslation("small_gold_dust", { en: "Tiny Pile of Gold Dust", ru: "Небольшая кучка золотой пыли", es: "Diminuta Pila de Polvo de Oro", pt: "Pequena Pilha de Pó de Ouro", zh: "小撮金粉" });
Translation.addTranslation("small_silver_dust", { en: "Tiny Pile of Silver Dust", ru: "Небольшая кучка серебряной пыли", es: "Diminuta Pila de Polvo de Plata", pt: "Pequena Pilha de Pó de Prata", zh: "小撮银粉" });
Translation.addTranslation("small_sulfur_dust", { en: "Tiny Pile of Sulfur Dust", ru: "Небольшая кучка серной пыли", es: "Diminuta Pila de Polvo de Sulfuro", pt: "Pequena Pilha de Pó de Enxofre", zh: "小撮硫粉" });
// Ingots
Translation.addTranslation("copper_ingot", { en: "Copper Ingot", ru: "Медный слиток", es: "Lingote de Cobre", pt: "Lingote de Cobre", zh: "铜锭" });
Translation.addTranslation("tin_ingot", { en: "Tin Ingot", ru: "Оловянный слиток", es: "Lingote de Estaño", pt: "Lingote de Estanho", zh: "锡锭" });
Translation.addTranslation("bronze_ingot", { en: "Bronze Ingot", ru: "Бронзовый слиток", es: "Lingote de Bronce", pt: "Lingote de Bronze", zh: "青铜锭" });
Translation.addTranslation("steel_ingot", { en: "Steel Ingot", ru: "Стальной слиток", es: "Lingote de Acero", pt: "Lingote de Aço", zh: "钢锭" });
Translation.addTranslation("lead_ingot", { en: "Lead Ingot", ru: "Свинцовый слиток", es: "Lingote de Plomo", pt: "Lingote de Chumbo", zh: "铅锭" });
Translation.addTranslation("silver_ingot", { en: "Silver Ingot", ru: "Серебрянный слиток", es: "Lingote de Plata", pt: "Lingote de Prata", zh: "银锭" });
Translation.addTranslation("alloy_ingot", { en: "Alloy Ingot", ru: "Композитный слиток", es: "Lingote de Metal Compuesto", pt: "Lingote de Liga Metálica", zh: "合金锭" });
// Plates
Translation.addTranslation("copper_plate", { en: "Copper Plate", ru: "Медная пластина", es: "Placa de Cobre", pt: "Placa de Cobre", zh: "铜板" });
Translation.addTranslation("tin_plate", { en: "Tin Plate", ru: "Оловянная пластина", es: "Placa de Estaño", pt: "Placa de Estanho", zh: "锡板" });
Translation.addTranslation("bronze_plate", { en: "Bronze Plate", ru: "Бронзовая пластина", es: "Placa de Bronce", pt: "Placa de Bronze", zh: "青铜板" });
Translation.addTranslation("iron_plate", { en: "Iron Plate", ru: "Железная пластина", es: "Placa de Hierro", pt: "Placa de Ferro", zh: "铁板" });
Translation.addTranslation("steel_plate", { en: "Steel Plate", ru: "Стальная пластина", es: "Placa de Hierro Refinado", pt: "Placa de Aço", zh: "钢板" });
Translation.addTranslation("gold_plate", { en: "Gold Plate", ru: "Золотая пластина", es: "Placa de Oro", pt: "Placa de Ouro", zh: "金板" });
Translation.addTranslation("lapis_plate", { en: "Lapis Plate", ru: "Лазуритовая пластина", es: "Placa de Lapislázuli", pt: "Placa de Lápis-Lazúli", zh: "青金石板" });
Translation.addTranslation("lead_plate", { en: "Lead Plate", ru: "Свинцовая пластина", es: "Placa de Plomo", pt: "Placa de Chumbo", zh: "铅板" });
// Dense Plates
Translation.addTranslation("dense_copper_plate", { en: "Dense Copper Plate", ru: "Плотная медная пластина", es: "Placa de Cobre Denso", pt: "Placa Densa de Cobre", zh: "致密铜板" });
Translation.addTranslation("dense_tin_plate", { en: "Dense Tin Plate", ru: "Плотная оловянная пластина", es: "Placa Densa de Estaño", pt: "Placa Densa de Estanho", zh: "致密锡板" });
Translation.addTranslation("dense_bronze_plate", { en: "Dense Bronze Plate", ru: "Плотная бронзовая пластина", es: "Placa de Bronce Densa", pt: "Placa Densa de Bronze", zh: "致密青铜板" });
Translation.addTranslation("dense_iron_plate", { en: "Dense Iron Plate", ru: "Плотная железная пластина", es: "Placa Densa de Hierro", pt: "Placa Densa de Ferro", zh: "致密铁板" });
Translation.addTranslation("dense_steel_plate", { en: "Dense Steel Plate", ru: "Плотная стальная пластина", es: "Placa de Hierro Refinado Denso", pt: "Placa Densa de Aço", zh: "致密钢板" });
Translation.addTranslation("dense_gold_plate", { en: "Dense Gold Plate", ru: "Плотная золотая пластина", es: "Placa Densa de Oro", pt: "Placa Densa de Ouro", zh: "致密金板" });
Translation.addTranslation("dense_lead_plate", { en: "Dense Lead Plate", ru: "Плотная свинцовая пластина", es: "Placa Densa de Plomo", pt: "Placa Densa de Chumbo", zh: "致密铅板" });
// Casings
Translation.addTranslation("copper_casing", { en: "Copper Casing", ru: "Медная оболочка", es: "Carcasa para Objetos de Cobre", pt: "Invólucro de Cobre", zh: "铜质外壳" });
Translation.addTranslation("tin_casing", { en: "Tin Casing", ru: "Оловянная оболочка", es: "Carcasa para Objetos de Estaño", pt: "Invólucro de Estanho", zh: "锡质外壳" });
Translation.addTranslation("bronze_casing", { en: "Bronze Casing", ru: "Бронзовая оболочка", es: "Carcasa para Objetos de Bronce", pt: "Invólucro de Bronze", zh: "青铜外壳" });
Translation.addTranslation("iron_casing", { en: "Iron Casing", ru: "Железная оболочка", es: "Carcasa para Objetos de Hierro", pt: "Invólucro de Ferro", zh: "铁质外壳" });
Translation.addTranslation("steel_casing", { en: "Steel Casing", ru: "Стальная оболочка", es: "Carcasa para Objetos de Hierro", pt: "Invólucro de Aço", zh: "钢质外壳" });
Translation.addTranslation("gold_casing", { en: "Gold Casing", ru: "Золотая оболочка", es: "Carcasa para Objetos de Oro", pt: "Invólucro de Ouro", zh: "黄金外壳" });
Translation.addTranslation("lead_casing", { en: "Lead Casing", ru: "Свинцовая оболочка", es: "Carcasa para Objetos de Plomo", pt: "Invólucro de Chumbo", zh: "铅质外壳" });
// Cans
Translation.addTranslation("tin_can", { en: "Tin Can", ru: "Консервная банка", es: "Lata de Estaño", pt: "Lata de Estanho", zh: "锡罐(空)" });
Translation.addTranslation("tin_can_full", { en: "Filled Tin Can", ru: "Заполненная консервная банка", es: "Lata de Estaño (llena)", pt: "Lata de Estanho (Cheia)", zh: "锡罐(满)" });
// Cells
Translation.addTranslation("empty_cell", { en: "Empty Cell", ru: "Пустая капсула", es: "Celda Vacía", pt: "Célula Universal de Fluidos", zh: "空单元" });
Translation.addTranslation("water_cell", { en: "Water Cell", ru: "Капсула с водой", es: "Celda de Agua", pt: "Célula com Água", zh: "水单元" });
Translation.addTranslation("lava_cell", { en: "Lava Cell", ru: "Капсула с лавой", es: "Celda de Lava", pt: "Célula com Lava", zh: "岩浆单元" });
Translation.addTranslation("biomass_cell", { en: "Biomass Cell", ru: "Капсула биомассы", es: "Celda de Biomasa", pt: "Célula com Biomassa", zh: "生物质单元" });
Translation.addTranslation("biogas_cell", { en: "Biogas Cell", ru: "Капсула биогаза", pt: "Célula com Biogás", zh: "沼气单元" });
Translation.addTranslation("coolant_cell", { en: "Coolant Cell", ru: "Капсула хладагента", es: "Celda de Refrigerante", pt: "Célula com Líquido Refrigerante", zh: "冷却液单元" });
Translation.addTranslation("uu_matter_cell", { en: "UU-Matter Cell", ru: "Капсула жидкой материи", es: "Celda de Materia UU", pt: "Célula com Matéria UU", zh: "UU物质单元" });
Translation.addTranslation("air_cell", { en: "Compressed Air Cell", ru: "Капсула со сжатым воздухом", es: "Celda de Aire Comprimida", pt: "Célula com Ar Comprimido", zh: "压缩空气单元" });
// Cables
Translation.addTranslation("tin_cable_0", { en: "Tin Cable", ru: "Оловянный провод", es: "Cable de Ultra-Baja Tensión", pt: "Cabo de Estanho", zh: "锡质导线" });
Translation.addTranslation("tin_cable_1", { en: "Insulated Tin Cable", ru: "Оловянный провод с изоляцией", es: "Cable de Estaño Aislado", pt: "Cabo de Estanho Isolado", zh: "绝缘锡质导线" });
Translation.addTranslation("copper_cable_0", { en: "Copper Cable", ru: "Медный провод", es: "Cable de Cobre", pt: "Cabo de Cobre", zh: "铜质导线" });
Translation.addTranslation("copper_cable_1", { en: "Insulated Copper Cable", ru: "Медный провод с изоляцией", es: "Cable de Cobre Aislado", pt: "Cabo de Cobre Isolado", zh: "绝缘质铜导线" });
Translation.addTranslation("gold_cable_0", { en: "Gold Cable", ru: "Золотой провод", es: "Cable de Oro", pt: "Cabo de Ouro", zh: "金质导线" });
Translation.addTranslation("gold_cable_1", { en: "Insulated Gold Cable", ru: "Золотой провод с изоляцией", es: "Cable de Oro Aislado", pt: "Cabo de Ouro Isolado", zh: "绝缘金质导线" });
Translation.addTranslation("gold_cable_2", { en: "2x Ins. Gold Cable", ru: "Золотой провод с 2x изоляцией", es: "Cable de Oro Aislado x2", pt: "Cabo de Ouro Isolado x2", zh: "2x绝缘金质导线" });
Translation.addTranslation("iron_cable_0", { en: "HV Cable", ru: "Высоковольтный провод", es: "Cable de Alta Tensión", pt: "Cabo de Alta Tensão", zh: "高压导线" });
Translation.addTranslation("iron_cable_1", { en: "Insulated HV Cable", ru: "Высоковольтный провод с изоляцией", es: "Cable de Alta Tensión Aislado", pt: "Cabo de Alta Tensão Isolado", zh: "绝缘高压导线" });
Translation.addTranslation("iron_cable_2", { en: "2x Ins. HV Cable", ru: "Высоковольтный провод с 2x изоляцией", es: "Cable de Alta Tensión Aislado x2", pt: "Cabo de Alta Tensão Isolado x2", zh: "2x绝缘高压导线" });
Translation.addTranslation("iron_cable_3", { en: "3x Ins. HV Cable", ru: "Высоковольтный провод с 3x изоляцией", es: "Cable de Alta Tensión Aislado x3", pt: "Cabo de Alta Tensão Isolado x3", zh: "3x绝缘高压导线" });
Translation.addTranslation("glass_cable", { en: "Glass Fibre Cable", ru: "Стекловолоконный провод", es: "Cable de Alta Tensión", pt: "Cabo de Fibra de Vidro", zh: "玻璃纤维导线" });
// Armor
Translation.addTranslation("bronze_helmet", { en: "Bronze Helmet", ru: "Бронзовый шлем", es: "Casco de Bronce", pt: "Elmo de Bronze", zh: "青铜头盔" });
Translation.addTranslation("bronze_chestplate", { en: "Bronze Chestplate", ru: "Бронзовый нагрудник", es: "Chaleco de Bronce", pt: "Peitoral de Bronze", zh: "青铜胸甲" });
Translation.addTranslation("bronze_leggings", { en: "Bronze Leggings", ru: "Бронзовые поножи", es: "Pantalones de Bronce", pt: "Calças de Bronze", zh: "青铜护腿" });
Translation.addTranslation("bronze_boots", { en: "Bronze Boots", ru: "Бронзовые ботинки", es: "Botas de Bronce", pt: "Botas de Bronze", zh: "青铜靴子" });
Translation.addTranslation("composite_helmet", { en: "Composite Helmet", ru: "Композитный шлем", es: "Casco de Compuesto", pt: "Capacete Composto", zh: "复合头盔" });
Translation.addTranslation("composite_chestplate", { en: "Composite Chestplate", ru: "Композитный нагрудник", es: "Chaleco de Compuesto", pt: "Colete Composto", zh: "复合胸甲" });
Translation.addTranslation("composite_leggings", { en: "Composite Leggings", ru: "Композитные поножи", es: "Pantalones de Compuesto", pt: "Calças compostas", zh: "复合护腿" });
Translation.addTranslation("composite_boots", { en: "Composite Boots", ru: "Композитные ботинки", es: "Botas de Compuesto", pt: "Botas compostas", zh: "复合靴子" });
Translation.addTranslation("nightvision_goggles", { en: "Nightvision Goggles", ru: "Прибор ночного зрения", es: "Gafas de Vision Nocturna", pt: "Óculos de Visão Noturna", zh: "夜视镜" });
Translation.addTranslation("nano_helmet", { en: "Nano Helmet", ru: "Нано-шлем", es: "Casco de Nanotraje", pt: "Elmo de Nanotecnologia", zh: "纳米头盔" });
Translation.addTranslation("nano_chestplate", { en: "Nano Bodyarmor", ru: "Нано-жилет", es: "Chaleco de Nanotraje", pt: "Peitoral de Nanotecnologia", zh: "纳米胸甲" });
Translation.addTranslation("nano_leggings", { en: "Nano Leggings", ru: "Нано-штаны", es: "Pantalones de Nanotraje", pt: "Calças de Nanotecnologia", zh: "纳米护腿" });
Translation.addTranslation("nano_boots", { en: "Nano Boots", ru: "Нано-ботинки", es: "Botas de Nanotraje", pt: "Botas de Nanotecnologia", zh: "纳米靴子" });
Translation.addTranslation("quantum_helmet", { en: "Quantum Helmet", ru: "Квантовый шлем", es: "Casco de Traje Cuántico", pt: "Elmo Quântico", zh: "量子头盔" });
Translation.addTranslation("quantum_chestplate", { en: "Quantum Bodyarmor", ru: "Квантовый жилет", es: "Chaleco de Traje Cuántico", pt: "Peitoral Quântico", zh: "量子护甲" });
Translation.addTranslation("quantum_leggings", { en: "Quantum Leggings", ru: "Квантовые штаны", es: "Pantalones de Traje Cuántico", pt: "Calças Quânticas", zh: "量子护腿" });
Translation.addTranslation("quantum_boots", { en: "Quantum Boots", ru: "Квантовые ботинки", es: "Botas de Traje Cuántico", pt: "Botas Quânticas", zh: "量子靴子" });
Translation.addTranslation("hazmat_helmet", { en: "Scuba Helmet", ru: "Шлем-акваланг", es: "Casco de Buceo", pt: "Máscara de Mergulho", zh: "防化头盔" });
Translation.addTranslation("hazmat_chestplate", { en: "Hazmat Suit", ru: "Защитная куртка", es: "Traje para Materiales Peligrosos", pt: "Roupa Anti-Radiação", zh: "防化服" });
Translation.addTranslation("hazmat_leggings", { en: "Hazmat Suit Leggings", ru: "Защитные штаны", es: "Pantalones para Materiales Peligrosos", pt: "Calças Anti-Radiação", zh: "防化裤" });
Translation.addTranslation("rubber_boots", { en: "Rubber Boots", ru: "Резиновые ботинки", es: "Botas de Goma", pt: "Botas de Borracha", zh: "橡胶靴" });
Translation.addTranslation("electric_jetpack", { en: "Jetpack", ru: "Реактивный ранец", es: "Jetpack Eléctrico", pt: "Mochila à Jato Elétrica", zh: "电力喷气背包" });
Translation.addTranslation("batpack", { en: "Batpack", ru: "Аккумуляторный ранец", es: "Mochila de Baterías", pt: "Mochila de Baterias", zh: "电池背包" });
Translation.addTranslation("advanced_batpack", { en: "Advanced Batpack", ru: "Продвинутый аккумуляторный ранец", es: "Mochila de Baterías Avanzada", pt: "Mochila de Baterias Avançada", zh: "高级电池背包" });
Translation.addTranslation("energypack", { en: "Energy Pack", ru: "Энергетический ранец", es: "Pack de Energía", pt: "Mochila de Energia", zh: "能量水晶储电背包" });
Translation.addTranslation("lappack", { en: "Lappack", ru: "Лазуротроновый ранец", es: "Mochila de Baterías Avanzada", pt: "Mochila Lapotrônica", zh: "兰波顿储电背包" });
Translation.addTranslation("solar_helmet", { en: "Solar Helmet", ru: "Шлем с солнечной панелью", es: "Casco Solar", pt: "Elmo Solar", zh: "太阳能头盔" });
// Tools
Translation.addTranslation("tool_box", { en: "Tool Box", ru: "Ящик для инструментов", es: "Caja de Herramientas", pt: "Caixa de Ferramentas", zh: "工具盒" });
Translation.addTranslation("containment_box", { en: "Containment Box", ru: "Защитный контейнер", es: "Caja de Contención", pt: "Caixa de Contenção", zh: "防辐射容纳盒" });
Translation.addTranslation("frequency_transmitter", { en: "Frequency Transmitter", ru: "Частотный связыватель", es: "Transmisor de Frecuencias", pt: "Transmissor de Frequência", zh: "遥控器" });
Translation.addTranslation("scanner", { en: "OD Scanner", ru: "Сканер КР", es: "Escaner de Densidad", zh: "OD扫描器" });
Translation.addTranslation("scanner_advanced", { en: "OV Scanner", ru: "Сканер ЦР", es: "Escaner de Riqueza", zh: "OV扫描器" });
Translation.addTranslation("treetap", { en: "Treetap", ru: "Краник", es: "Grifo para Resina", pt: "Drenador", zh: "木龙头" });
Translation.addTranslation("forge_hammer", { en: "Forge Hammer", ru: "Кузнечный молот", es: "Martillo para Forja", pt: "Martelo de Forja", zh: "锻造锤" });
Translation.addTranslation("cutter", { en: "Cutter", ru: "Кусачки", es: "Pelacables Universal", pt: "Alicate", zh: "板材切割剪刀" });
Translation.addTranslation("bronze_sword", { en: "Bronze Sword", ru: "Бронзовый меч", es: "Espada de Bronce", pt: "Espada de Bronze", zh: "青铜剑" });
Translation.addTranslation("bronze_shovel", { en: "Bronze Shovel", ru: "Бронзовая лопата", es: "Pala de Bronce", pt: "Pá de Bronze", zh: "青铜铲" });
Translation.addTranslation("bronze_pickaxe", { en: "Bronze Pickaxe", ru: "Бронзовая кирка", es: "Pico de Bronce", pt: "Picareta de Bronze", zh: "青铜镐" });
Translation.addTranslation("bronze_axe", { en: "Bronze Axe", ru: "Бронзовый топор", es: "Hacha de Bronce", pt: "Machado de Bronze", zh: "青铜斧" });
Translation.addTranslation("bronze_hoe", { en: "Bronze Hoe", ru: "Бронзовая мотыга", es: "Azada de Bronce", pt: "Enxada de Bronze", zh: "青铜锄" });
Translation.addTranslation("wrench", { en: "Wrench", ru: "Гаечный ключ", es: "Llave Inglesa", pt: "Chave de Grifo", zh: "扳手" });
Translation.addTranslation("electric_wrench", { en: "Electric Wrench", ru: "Электроключ", es: "Llave Inglesa Eléctrica", pt: "Chave de Grifo Elétrica", zh: "电动扳手" });
Translation.addTranslation("electric_hoe", { en: "Electric Hoe", ru: "Электромотыга", es: "Azada Eléctrica", pt: "Enxada Elétrica", zh: "电动锄" });
Translation.addTranslation("electric_treetap", { en: "Electric Treetap", ru: "Электрокраник", es: "Grifo para Resina Eléctrico", pt: "Drenador Elétrico", zh: "电动树脂提取器" });
Translation.addTranslation("wind_meter", { en: "Windmeter", ru: "Измеритель ветра", es: "Piranómetro", pt: "Anemômetro", zh: "风力计" });
Translation.addTranslation("chainsaw", { en: "Chainsaw", ru: "Электропила", es: "Motosierra", pt: "Serra Elétrica", zh: "链锯" });
Translation.addTranslation("drill", { en: "Mining Drill", ru: "Шахтёрский бур", es: "Taladro", pt: "Broca de Mineração", zh: "采矿钻头" });
Translation.addTranslation("diamond_drill", { en: "Diamond Drill", ru: "Алмазный бур", es: "Taladro de Diamante", pt: "Broca de Diamante", zh: "钻石钻头" });
Translation.addTranslation("iridium_drill", { en: "Iridium Drill", ru: "Иридиевый бур", es: "Taladro de Iridio", pt: "Broca de Irídio", zh: "铱钻头" });
Translation.addTranslation("nano_saber", { en: "Nano Saber", ru: "Нано-сабля", es: "Nano-Sable", pt: "Sabre Nano", zh: "纳米剑" });
Translation.addTranslation("mining_laser", { en: "Mining Laser", ru: "Шахтёрский лазер", es: "Láser Minero", pt: "Laser de Mineração", zh: "采矿镭射枪" });
Translation.addTranslation("eu_meter", { en: "EU Meter", ru: "Мультиметр", pt: "Leitor de EU", zh: "EU电表" });
Translation.addTranslation("debug_item", { ru: "Предмет отладки", pt: "Item de Depuração", zh: "测试工具" });
Translation.addTranslation("crop_analyzer", { en: "Crop Analyzer", ru: "Агроанализатор", es: "Semillalizador", pt: "Plantanalizador", zh: "作物分析器" });
Translation.addTranslation("weeding_trowel", { en: "Weeding Trowel", ru: "Пропалыватель", pt: "Espátula Transplantadora", zh: "除草铲" });
// Painter
Translation.addTranslation("painter", { en: "Painter", ru: "Валик", es: "Rodillo de Pintar", pt: "Rolo de Pintura", zh: "刷子" });
Translation.addTranslation("painter.black", { en: "Black Painter", ru: "Чёрный валик", es: "Rodillo Negro", pt: "Rolo de Pintura Preto", zh: "黑色刷子" });
Translation.addTranslation("painter.red", { en: "Red Painter", ru: "Красный валик", es: "Rodillo Rojo", pt: "Rolo de Pintura Vermelho", zh: "红色刷子" });
Translation.addTranslation("painter.green", { en: "Green Painter", ru: "Зелёный валик", es: "Rodillo Verde", pt: "Rolo de Pintura Verde", zh: "绿色刷子" });
Translation.addTranslation("painter.brown", { en: "Brown Painter", ru: "Коричневый валик", es: "Rodillo Marrón", pt: "Rolo de Pintura Marrom", zh: "棕色刷子" });
Translation.addTranslation("painter.blue", { en: "Blue Painter", ru: "Синий валик", es: "Rodillo Azul", pt: "Rolo de Pintura Azul", zh: "蓝色刷子" });
Translation.addTranslation("painter.purple", { en: "Purple Painter", ru: "Фиолетовый валик", es: "Rodillo Púrpura", pt: "Rolo de Pintura Roxo", zh: "紫色刷子" });
Translation.addTranslation("painter.cyan", { en: "Cyan Painter", ru: "Бирюзовый валик", es: "Rodillo Cian", pt: "Rolo de Pintura Ciano", zh: "青色刷子" });
Translation.addTranslation("painter.light_gray", { en: "Light Grey Painter", ru: "Светло-серый валик", es: "Rodillo Gris Claro", pt: "Rolo de Pintura Cinza Claro", zh: "淡灰色刷子" });
Translation.addTranslation("painter.gray", { en: "Dark Grey Painter", ru: "Тёмно-серый валик", es: "Rodillo Gris Oscuro", pt: "Rolo de Pintura Cinza", zh: "灰色刷子" });
Translation.addTranslation("painter.pink", { en: "Pink Painter", ru: "Розовый валик", es: "Rodillo Rosa", pt: "Rolo de Pintura Rosa", zh: "粉色刷子" });
Translation.addTranslation("painter.lime", { en: "Lime Painter", ru: "Лаймовый валик", es: "Rodillo Lima", pt: "Rolo de Pintura Verde-Limão", zh: "柠檬色刷子" });
Translation.addTranslation("painter.yellow", { en: "Yellow Painter", ru: "Жёлтый валик", es: "Rodillo Amarillo", pt: "Rolo de Pintura Amarelo", zh: "黄色刷子" });
Translation.addTranslation("painter.light_blue", { en: "Light Blue Painter", ru: "Светло-голубой валик", es: "Rodillo Celeste", pt: "Rolo de Pintura Azul Claro", zh: "淡蓝色刷子" });
Translation.addTranslation("painter.magenta", { en: "Magenta Painter", ru: "Сиреневый валик", es: "Rodillo Magenta", pt: "Rolo de Pintura Lilás", zh: "品红色刷子" });
Translation.addTranslation("painter.orange", { en: "Orange Painter", ru: "Оранжевый валик", es: "Rodillo Naranja", pt: "Rolo de Pintura Laranjado", zh: "橙色刷子" });
Translation.addTranslation("painter.white", { en: "White Painter", ru: "Белый валик", es: "Rodillo Blanco", pt: "Rolo de Pintura Branco", zh: "白色刷子" });
// Coffee
Translation.addTranslation("coffee_powder", { en: "Coffee Powder", ru: "Молотый кофе", es: "Polvo de Café", pt: "Pó de Café", zh: "咖啡粉" });
Translation.addTranslation("stone_mug", { en: "Stone Mug", ru: "Каменная кружка", es: "Jarra de Piedra", pt: "Caneca de Pedra", zh: "石杯" });
Translation.addTranslation("mug_cold_coffee", { en: "Cold Coffee", ru: "Холодный кофе", es: "Café Frío", pt: "Café Frio", zh: "冷咖啡" });
Translation.addTranslation("mug_dark_coffee", { en: "Dark Coffee", ru: "Тёмный кофе", es: "Café Oscuro", pt: "Café Forte", zh: "黑咖啡" });
Translation.addTranslation("mug_coffee", { en: "Coffee", ru: "Кофе", es: "Café", pt: "Café", zh: "咖啡" });
// Crop Items
Translation.addTranslation("crop_seed_bag", { en: "Seed Bag (%s)", ru: "Мешок с семенами (%s)", es: "Semillas Desconocidas (%s)", pt: "Saco de sementes (%s)", zh: "种子袋 (%s)" });
Translation.addTranslation("crop_stick", { en: "Crop", ru: "Жёрдочки", es: "Palo Para Cultivo", pt: "Muda", zh: "作物架" });
Translation.addTranslation("grin_powder", { en: "Grin Powder", ru: "Токсичная пыль", es: "Polvo Tóxico", zh: "蛤蛤粉", pt: "Pó do Riso" });
Translation.addTranslation("weed_ex", { en: "Weed EX", ru: "Средство от сорняков", es: "Veneno para Hierbas", pt: "Erbicida", zh: "除草剂" });
Translation.addTranslation("fertilizer", { en: "Fertilizer", ru: "Удобрение", es: "Fertilizante", pt: "Fertilizante", zh: "肥料" });
Translation.addTranslation("hydration_cell", { en: "Hydration Cell", ru: "Увлажняющая капсула", es: "Celda Hidratante", pt: "Líquido de Refrigeração", zh: "水化单元" });
Translation.addTranslation("coffee_beans", { en: "Coffee Beans", ru: "Кофейные зёрна", es: "Granos de Café", pt: "Grãos de Café", zh: "咖啡豆" });
// Crops
Translation.addTranslation("wheat", { en: "Wheat", ru: "Пшеница", es: "Trigo", pt: "Trigo", zh: "小麦" });
Translation.addTranslation("weed", { en: "Weed", ru: "Сорняк", pt: "Erva Daninha", zh: "杂草" });
Translation.addTranslation("pumpkin", { en: "Pumpkin", ru: "Тыква", es: "Calabaza", pt: "Abóbora", zh: "南瓜" });
Translation.addTranslation("melon", { en: "Melon", ru: "Арбуз", es: "Sandia", pt: "Melancia", zh: "西瓜" });
Translation.addTranslation("dandelion", { en: "Dandelion", ru: "Одуванчик", es: "Diente de León", pt: "Dente-de-Leão", zh: "蒲公英" });
Translation.addTranslation("rose", { en: "Rose", ru: "Роза", es: "Rosa", pt: "Rosa", zh: "玫瑰" });
Translation.addTranslation("blackthorn", { en: "Blackthorn", ru: "Терновник", es: "Rosa del Whiter", pt: "Espinheiro-negro", zh: "黑刺李" });
Translation.addTranslation("tulip", { en: "Tulip", ru: "Тюльпан", es: "Tulipán", pt: "Tulipa", zh: "郁金香" });
Translation.addTranslation("cyazint", { en: "Cyazint", ru: "Гиацинт", es: "Aciano", pt: "Cyazint", zh: "缤纷花" });
Translation.addTranslation("venomilia", { en: "Venomilia", ru: "Веномилия", es: "Venomilia", pt: "Venomilia", zh: "奇妙花" });
Translation.addTranslation("reed", { en: "Reed", ru: "Сахарный тростник", es: "Caña de Azúcar", pt: "Cana-de-açúcar", zh: "甘蔗" });
Translation.addTranslation("stickreed", { en: "Stickreed", ru: "Резиновый тростник", es: "Junco", zh: "粘性甘蔗", pt: "Cana-de-borracha" });
Translation.addTranslation("cocoa", { en: "Cocoa", ru: "Какао", es: "Cacao", pt: "Cacau", zh: "可可" });
Translation.addTranslation("red_mushroom", { en: "Red Mushroom", ru: "Красный гриб", es: "Champiñon Rojo", pt: "Cogumelo Vermelho", zh: "红色蘑菇" });
Translation.addTranslation("brown_mushroom", { en: "Brown Mushroom", ru: "Коричневый гриб", es: "Champiñion Cafe", pt: "Cogumelo marrom", zh: "棕色蘑菇" });
Translation.addTranslation("nether_wart", { en: "Nether Wart", ru: "Адский нарост", es: "Verruga de Nether", pt: "Fungo do Nether", zh: "地狱疣" });
Translation.addTranslation("terra_wart", { en: "Terra Wart", ru: "Земляной нарост", es: "Verruga de Tierra", pt: "Fungo da Terra", zh: "大地疣" });
Translation.addTranslation("ferru", { en: "Ferru", ru: "Феррий", es: "Ferru", pt: "Ferru", zh: "铁叶草" });
Translation.addTranslation("cyprium", { en: "Cyprium", ru: "Куприй", es: "Cyclamen", pt: "Chipre", zh: "铜叶草" });
Translation.addTranslation("stagnium", { en: "Stagnium", ru: "Стагний", es: "Stagnium", pt: "Stagnium", zh: "银矿草" });
Translation.addTranslation("plumbiscus", { en: "Plumbiscus", ru: "Плюмбий", pt: "Biscoito de canela", zh: "铅叶草" });
Translation.addTranslation("aurelia", { en: "Aurelia", ru: "Аурелия", pt: "Aurélia", zh: "金叶草" });
Translation.addTranslation("shining", { en: "Shining", ru: "Аргентий", pt: "Brilhante", zh: "闪光" });
Translation.addTranslation("redwheat", { en: "Red Wheat", ru: "Красная пшеница", pt: "Trigo Vermelho", zh: "红麦" });
Translation.addTranslation("coffee", { en: "Coffee", ru: "Кофе", es: "Cafe", pt: "Café", zh: "咖啡" });
Translation.addTranslation("hops", { en: "Hops", ru: "Хмель", es: "Lúpulo", pt: "Lúpulo", zh: "啤酒花" });
Translation.addTranslation("carrots", { en: "Carrots", ru: "Морковь", es: "Zanaorias", pt: "Cenouras", zh: "胡萝卜" });
Translation.addTranslation("potato", { en: "Potato", ru: "Картофель", es: "Patatas", pt: "Batata", zh: "马铃薯" });
Translation.addTranslation("eatingplant", { en: "Eating Plant", ru: "Плотоядное растение", es: "Planta Carnivora", pt: "Planta Carnívora", zh: "食人花" });
Translation.addTranslation("beetroots", { en: "Beetroots", ru: "Свёкла", pt: "Beterrabas", zh: "甜菜根" });
// TEXT
Translation.addTranslation("Mode: %s", { ru: "Режим: %s", es: "Modo: %s", pt: "Modo: %s", zh: "模式: %s" });
// Induction Furnace
Translation.addTranslation("Heat:", { ru: "Нагрев:", es: "Calor:", pt: "Calor:", zh: "热量:" });
// Fluid Distributor
Translation.addTranslation("Mode:", { ru: "Режим:", es: "Modo:", pt: "Modo:", zh: "模式:" });
Translation.addTranslation("Distribute", { ru: "распростр.", es: "distribuir", pt: "Distribuir", zh: "分配模式" });
Translation.addTranslation("Concentrate", { ru: "концентрац.", es: "concentrado", pt: "Concentrar", zh: "混合模式" });
// Advanced Miner
Translation.addTranslation("Mode: Blacklist", { ru: "Чёрный список", es: "Modo: lista negra", pt: "Modo: Lst Negra", zh: "模式:黑名单" });
Translation.addTranslation("Mode: Whitelist", { ru: "Белый список", es: "Modo: lista blanca", pt: "Modo: Lst Branca", zh: "模式:白名单" });
// EU Meter
Translation.addTranslation("EnergyIn", { ru: "Вход энергии", pt: "EnergiaEntr", zh: "能量流入" });
Translation.addTranslation("EnergyOut", { ru: "Выход энергии", pt: "EnergiaSaid", zh: "能量流出" });
Translation.addTranslation("EnergyGain", { ru: "Энергии получено", es: "EnergíaGana", pt: "GanhoEnerg", zh: "获得能量" });
Translation.addTranslation("Voltage", { ru: "Напряжение", es: "Voltaje", pt: "Voltagem", zh: "电压" });
Translation.addTranslation("Avg:", { ru: "Средн.:", es: "Promedio:", pt: "Méd:", zh: "平均:" });
Translation.addTranslation("Max/Min", { ru: "Макс./Мин.", pt: "Máx/Min", zh: "最大/最小" });
Translation.addTranslation("Cycle: ", { ru: "Цикл: ", es: "Ciclo: ", pt: "Cíclo: ", zh: "周期: " });
Translation.addTranslation("Reset", { ru: "Сброс", pt: "Resetar", zh: "重置" });
Translation.addTranslation("sec", { ru: "сек", es: "sec", pt: "seg", zh: "秒" });
// Charging Batteries
Translation.addTranslation("charging.disabled", { en: "Disabled", ru: "Выключен", es: "Desabilitado", pt: "Desabilitado", zh: "禁用" });
Translation.addTranslation("charging.not_in_hand", { en: "Charge items not in hand", ru: "Заряжать предметы, которые не в руке", es: "Cargar artículos que no están en la mano", pt: "Carregar itens que não estão nas mãos", zh: "手里没有要充电的东西" });
Translation.addTranslation("charging.enabled", { en: "Enabled", ru: "Включён", es: "Habilitado", pt: "Habilitado", zh: "启用" });
// Mining Laser
Translation.addTranslation("mining_laser.mining", { en: "Mining", ru: "Добыча", es: "Taladrando", pt: "Mineração", zh: "挖矿模式" });
Translation.addTranslation("mining_laser.low_focus", { en: "Low-Focus", ru: "Короткого фокуса", es: "Baja Potencia", pt: "Baixo-Foco", zh: "低聚焦模式" });
Translation.addTranslation("mining_laser.long_range", { en: "Long-Range", ru: "Дальнего действия", es: "Largo Alcance", pt: "Longo Alcance", zh: "远距模式" });
Translation.addTranslation("mining_laser.horizontal", { en: "Horizontal", ru: "Горизонтальный", zh: "水平模式" });
Translation.addTranslation("mining_laser.super_heat", { en: "Super-Heat", ru: "Перегревающий", es: "Super-Calor", pt: "Super Quente", zh: "超级热线模式" });
Translation.addTranslation("mining_laser.scatter", { en: "Scatter", ru: "Разброс", es: "Esparcido", pt: "Dispersão", zh: "散射模式" });
Translation.addTranslation("mining_laser.3x3", { en: "3x3" });
// Iridium Drill
Translation.addTranslation("iridium_drill.fortune", { en: "Fortune III", ru: "Удача III", pt: "Fortuna III", zh: "时运 III" });
Translation.addTranslation("iridium_drill.silk_touch", { en: "Silk Touch", ru: "Шёлковое касание", pt: "Toque suave", zh: "精准采集" });
Translation.addTranslation("iridium_drill.fortune_3x3", { en: "Fortune III (3x3)", ru: "Удача III (3x3)", pt: "Fortuna III (3x3)", zh: "时运 III (3x3)" });
Translation.addTranslation("iridium_drill.silk_touch_3x3", { en: "Silk Touch (3x3)", ru: "Шёлковое касание (3x3)", pt: "Toque suave (3x3)", zh: "精准采集 (3x3)" });
// Messages
Translation.addTranslation("message.nightvision.enabled", { en: "Nightvision mode enabled", es: "Modo Vision Noctura Habilitado", ru: "Режим ночного зрения включен", zh: "已启用夜视模式" });
Translation.addTranslation("message.nightvision.disabled", { en: "Nightvision mode disabled", es: "Modo Vision Noctura Desabilitado", ru: "Режим ночного зрения выключен", zh: "已禁用夜视模式" });
Translation.addTranslation("message.hover_mode.enabled", { en: "Hover mode enabled", ru: "Режим парения включен", zh: "已启用悬浮模式" });
Translation.addTranslation("message.hover_mode.disabled", { en: "Hover mode disabled", ru: "Режим парения выключен", zh: "已禁用悬浮模式" });
Translation.addTranslation("message.scan_result", { en: "Scan Result: %s", ru: "Результат сканирования: %s", es: "Resultado de la exploración: %s", pt: "Resultado do Escaneamento: %s", zh: "扫描结果: %s" });
Translation.addTranslation("message.freq_transmitter.linked", { en: "Frequency Transmitter linked to Teleporter", ru: "Частотный связыватель соединился с телепортером", zh: "遥控器已连接至传送机" });
Translation.addTranslation("message.freq_transmitter.notlinked", { en: "Can`t link Teleporter to itself", ru: "Невозможно связать телепортер с самим собой", zh: "传送机不能连接自己" });
Translation.addTranslation("message.freq_transmitter.established", { en: "Teleportation link established", ru: "Телепортационная связь установлена", zh: "已建立传送点" });
Translation.addTranslation("message.freq_transmitter.unlinked", { en: "Frequency Transmitter unlinked", ru: "Частотный связыватель сброшен", zh: "已断开遥控器" });
Translation.addTranslation("message.mining_laser.aiming", { en: "Mining laser aiming angle too steep", ru: "Шахтёрский лазер направлен слишков высоко", zh: "镭射枪瞄准角度过小" });
// Tooltips
Translation.addTranslation("tooltip.tin_can", { en: "This looks bad...", ru: "Это выглядит несъедобно…", pt: "Isso parece ruim...", zh: "这看起来很糟糕..." });
Translation.addTranslation("tooltip.power_tier", { en: "Power Tier: %s", ru: "Энергоуровень: %s", pt: "Nível de Voltagem: %s", zh: "能量等级: %s" });
Translation.addTranslation("tooltip.max_voltage", { en: "Max voltage: %s EU/t", ru: "Макс. напряжение: %s EU/t", pt: "Voltagem Máx: %s EU/t", zh: "最大电压: %s EU/t" });
Translation.addTranslation("tooltip.upgrade.overclocker.time", { en: "Decrease process time to ", ru: "Уменьшает время работы до ", pt: "Diminui o tempo de processo para ", zh: "加工用时缩短为" });
Translation.addTranslation("tooltip.upgrade.overclocker.power", { en: "Increase power to ", ru: "Увеличивает энергопотребление до ", pt: "Aumenta o Uso de Energia em ", zh: "能量增加到" });
Translation.addTranslation("tooltip.upgrade.transformer", { en: "Increase energy tier by 1", ru: "Увеличивает энергоуровень на 1", pt: "Aumenta o nível da máquina em 1", zh: "增加一级输出电压" });
Translation.addTranslation("tooltip.upgrade.storage", { en: "Increase energy storage by %s EU", ru: "Увеличивает энергоёмкость на %s EU", pt: "Aumenta o armazenamento de energia em %s EU", zh: "增加%s EU储能" });
Translation.addTranslation("tooltip.upgrade.ejector", { en: "Automatically output to\nthe %s side", ru: "Автоматическое извлечение с %s стороны", pt: "Saída automática para o %s", zh: "自动输出到%s方向" });
Translation.addTranslation("tooltip.upgrade.pulling", { en: "Automatically input from\nthe %s side", ru: "Автоматический ввод с %s стороны", pt: "Entrada automática para o %s", zh: "自动从%s抽入物品" });
Translation.addTranslation("tooltip.upgrade.anyside", { en: "first valid", ru: "первой подходящей", es: "Primera vez efectivo", pt: "Primeira vez eficaz", zh: "初次生效" });
Translation.addTranslation("ic2.dir.bottom", { en: "bottom", ru: "нижней", es: "abajo", pt: "lado de baixo", zh: "底部" });
Translation.addTranslation("ic2.dir.top", { en: "top", ru: "верхней", es: "arriba", pt: "lado de cima", zh: "顶部" });
Translation.addTranslation("ic2.dir.north", { en: "north", ru: "северной", es: "norte", pt: "norte", zh: "北边" });
Translation.addTranslation("ic2.dir.south", { en: "south", ru: "южной", es: "sur", pt: "sul", zh: "南边" });
Translation.addTranslation("ic2.dir.east", { en: "east", ru: "восточной", es: "este", pt: "leste", zh: "东边" });
Translation.addTranslation("ic2.dir.west", { en: "west", ru: "западной", es: "oeste", pt: "oeste", zh: "西边" });
// Recipe Viewer
Translation.addTranslation("Heat: ", { ru: "Нагрев: ", es: "Calor: ", pt: "Calor: ", zh: "热量: " });
// Creative Groups
Translation.addTranslation("Ores", { ru: "Руды", pt: "Minérios", zh: "矿石" });
Translation.addTranslation("Resource Blocks", { ru: "Блоки ресурсов", pt: "Blocos de Recusrso", zh: "资源方块" });
Translation.addTranslation("Electric Generators", { ru: "Электрогенераторы", pt: "Geradores Elétricos", zh: "发电机" });
Translation.addTranslation("Heat Generators", { ru: "Теплогенераторы", pt: "Geradores de Calor", zh: "加热机" });
Translation.addTranslation("Processing Machines", { ru: "Машины-обработчики", pt: "Máquinas de Processamento", zh: "加工机器" });
Translation.addTranslation("Energy Storages", { ru: "Энергохранилища", pt: "Armazenamento de Energia", zh: "能量储存" });
Translation.addTranslation("Transformers", { ru: "Трансформаторы", pt: "Transformadores", zh: "变压器" });
Translation.addTranslation("Cables", { ru: "Провода", pt: "Cabos", zh: "导线" });
Translation.addTranslation("Battery Packs", { ru: "Аккумуляторные ранцы", pt: "Mochilas de Baterias", zh: "电池背包" });
Translation.addTranslation("Charging Batteries", { ru: "Заряжающие аккумуляторы", pt: "Carregadores", zh: "充电电池" });
Translation.addTranslation("Crafting Components", { ru: "Компоненты крафта", pt: "Componentes Elétricos", zh: "电子元部件" });
Translation.addTranslation("Materials", { ru: "Материалы", pt: "Materiais", zh: "材料" });
Translation.addTranslation("Batteries", { ru: "Аккумуляторы", pt: "Baterias", zh: "电池" });
Translation.addTranslation("Machine Upgrades", { ru: "Улучшения", pt: "Melhorias", zh: "机器升级组件" });
Translation.addTranslation("Coffee", { ru: "Кофе", pt: "Café", zh: "咖啡" });
Translation.addTranslation("Crushed Ores", { ru: "Измельчённые руды", pt: "Minérios Triturados", zh: "粉碎矿石" });
Translation.addTranslation("Purified Crushed Ores", { ru: "Очищенные измельчённые руды", pt: "Minérios Triturados Purificados", zh: "纯净的粉碎矿石" });
Translation.addTranslation("Dusts", { ru: "Пыль", pt: "Pós", zh: "矿粉" });
Translation.addTranslation("Small Dusts", { ru: "Небольшие кучки пыли", pt: "Pequenas Pilhas de Pó", zh: "小撮矿粉" });
Translation.addTranslation("Ingots", { ru: "Слитки", pt: "Lingotes", zh: "锭" });
Translation.addTranslation("Plates", { ru: "Пластины", pt: "Placas", zh: "金属板" });
Translation.addTranslation("Desne Plates", { ru: "Плотные пластины", pt: "Placas Densas", zh: "致密金属板" });
Translation.addTranslation("Metal Casings", { ru: "Металлические оболочки", pt: "Invólucros", zh: "金属外壳" });
Translation.addTranslation("Nuclear", { ru: "Радиоактивные", pt: "Nuclear", zh: "核原料" });
Translation.addTranslation("Mining Drills", { ru: "Шахтёрские буры", pt: "Brocas de Mineração", zh: "采矿钻头" });
Translation.addTranslation("Cells", { ru: "Капсулы", pt: "Células", zh: "单元" });
Translation.addTranslation("Nuclear Fuel Rods", { ru: "Топливные стержни", pt: "Hastes de Combustível", zh: "核燃料棒" });
Translation.addTranslation("Neutron Reflectors", { ru: "Отражатели нейтронов", pt: "Refletores de Neutrons", zh: "中子反射板" });
Translation.addTranslation("Reactor Platings", { ru: "Обшивки реактора", pt: "Placas de Reator", zh: "反应堆隔板" });
Translation.addTranslation("Reactor Heat Vents", { ru: "Теплоотводы", pt: "Ventilações de Calor", zh: "反应堆散热片" });
Translation.addTranslation("Reactor Heat Exchangers", { ru: "Теплообменники", pt: "Trocadores de Calor", zh: "反应堆热交换器" });
Translation.addTranslation("Reactor Coolants", { ru: "Охлаждающие капсулы", pt: "Células Refrigerantes", zh: "反应堆冷却单元" });
Translation.addTranslation("Seed Bags", { ru: "Мешки с семенами", pt: "Sacos De Sementes", zh: "种子包" });
Translation.addTranslation("Painters", { ru: "Валики", pt: "Rolos de Pintura", zh: "刷子" });
var ICTool;
(function (ICTool) {
    var wrenchData = {};
    function registerWrench(id, properties) {
        wrenchData[id] = properties;
    }
    ICTool.registerWrench = registerWrench;
    function getWrenchData(id) {
        return wrenchData[id];
    }
    ICTool.getWrenchData = getWrenchData;
    function isWrench(id) {
        return !!getWrenchData(id);
    }
    ICTool.isWrench = isWrench;
    function isUseableWrench(item, damage) {
        if (damage === void 0) { damage = 1; }
        var wrench = getWrenchData(item.id);
        return wrench === null || wrench === void 0 ? void 0 : wrench.isUseable(item, damage);
    }
    ICTool.isUseableWrench = isUseableWrench;
    function useWrench(item, damage, player) {
        var wrench = getWrenchData(item.id);
        wrench === null || wrench === void 0 ? void 0 : wrench.useItem(item, damage, player);
    }
    ICTool.useWrench = useWrench;
    function rotateMachine(tileEntity, side, item, player) {
        if (tileEntity.setFacing(side)) {
            useWrench(item, 1, player);
            SoundManager.playSoundAtBlock(tileEntity, "Wrench.ogg", 1);
        }
    }
    ICTool.rotateMachine = rotateMachine;
    function addRecipe(result, data, tool) {
        data.push({ id: tool, data: -1 });
        Recipes.addShapeless(result, data, function (api, field, result) {
            for (var i = 0; i < field.length; i++) {
                if (field[i].id == tool) {
                    field[i].data++;
                    if (field[i].data >= Item.getMaxDamage(tool)) {
                        field[i].id = field[i].count = field[i].data = 0;
                    }
                }
                else {
                    api.decreaseFieldSlot(i);
                }
            }
        });
    }
    ICTool.addRecipe = addRecipe;
    function dischargeItem(item, consume, player) {
        var energyGot = 0;
        var itemTier = ChargeItemRegistry.getItemData(item.id).tier;
        var armor = Entity.getArmorSlot(player, 1);
        var armorEnergy = ChargeItemRegistry.getEnergyStored(armor);
        var armorData = ChargeItemRegistry.getItemData(armor.id);
        if (armorEnergy > 0 && armorData.energy == EU.name && armorData.tier >= itemTier) {
            energyGot = Math.min(armorEnergy, consume);
        }
        var energyStored = ChargeItemRegistry.getEnergyStored(item) + energyGot;
        if (energyStored >= consume) {
            if (energyGot > 0) {
                ChargeItemRegistry.setEnergyStored(armor, armorEnergy - energyGot);
                Entity.setArmorSlot(player, 1, armor.id, 1, armor.data, armor.extra);
            }
            ChargeItemRegistry.setEnergyStored(item, energyStored - consume);
            return true;
        }
        return false;
    }
    ICTool.dischargeItem = dischargeItem;
    function useElectricItem(item, consume, player) {
        if (dischargeItem(item, consume, player)) {
            Entity.setCarriedItem(player, item.id, 1, item.data, item.extra);
            return true;
        }
        return false;
    }
    ICTool.useElectricItem = useElectricItem;
    /** @deprecated */
    function registerElectricHoe(stringID) { }
    ICTool.registerElectricHoe = registerElectricHoe;
    /** @deprecated */
    function registerElectricTreetap(stringID) { }
    ICTool.registerElectricTreetap = registerElectricTreetap;
    function setOnHandSound(itemID, idleSound, stopSound) {
        Callback.addCallback("LocalTick", function () {
            if (!IC2Config.soundEnabled) {
                return;
            }
            var item = Player.getCarriedItem();
            var tool = ToolAPI.getToolData(item.id);
            if (item.id == itemID && (!tool || !tool.energyPerUse || ChargeItemRegistry.getEnergyStored(item) >= tool.energyPerUse)) {
                SoundManager.startPlaySound(SourceType.ENTITY, Player.get(), idleSound);
            }
            else if (SoundManager.stopPlaySound(Player.get(), idleSound) && stopSound) {
                SoundManager.playSound(stopSound);
            }
        });
    }
    ICTool.setOnHandSound = setOnHandSound;
    Callback.addCallback("DestroyBlockStart", function (coords, block) {
        if (MachineRegistry.isMachine(block.id)) {
            var item = Player.getCarriedItem();
            if (ICTool.isUseableWrench(item, 10)) {
                Network.sendToServer("icpe.demontageMachine", { x: coords.x, y: coords.y, z: coords.z });
            }
        }
    });
    Network.addServerPacket("icpe.demontageMachine", function (client, data) {
        var player = client.getPlayerUid();
        var region = WorldRegion.getForActor(player);
        var blockID = region.getBlockId(data);
        if (MachineRegistry.isMachine(blockID)) {
            var item = new ItemStack(Entity.getCarriedItem(player));
            if (ICTool.isUseableWrench(item, 10)) {
                var tileEntity = (region.getTileEntity(data) || region.addTileEntity(data));
                if (!tileEntity)
                    return;
                var drop = tileEntity.adjustDrop(new ItemStack(tileEntity.blockID, 1, 0));
                TileEntity.destroyTileEntity(tileEntity);
                region.setBlock(data, 0, 0);
                region.dropAtBlock(data.x, data.y, data.z, drop);
                ICTool.useWrench(item, 10, player);
                SoundManager.playSoundAtBlock(tileEntity, "Wrench.ogg", 1);
            }
        }
    });
})(ICTool || (ICTool = {}));
var MathUtil;
(function (MathUtil) {
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    MathUtil.randomInt = randomInt;
    function setInRange(value, minValue, maxValue) {
        if (value < minValue)
            return minValue;
        if (value > maxValue)
            return maxValue;
        return value;
    }
    MathUtil.setInRange = setInRange;
})(MathUtil || (MathUtil = {}));
/** @deprecated */
var randomInt = MathUtil.randomInt;
var ItemName;
(function (ItemName) {
    /**@deprecated */
    function setRarity(id, rarity) {
        ItemRegistry.setRarity(id, rarity);
    }
    ItemName.setRarity = setRarity;
    /**@deprecated */
    function getRarity(id) {
        return ItemRegistry.getRarity(id);
    }
    ItemName.getRarity = getRarity;
    function addTooltip(id, tooltip) {
        Item.registerNameOverrideFunction(id, function (item, name) {
            return ItemRegistry.getItemRarityColor(item.id) + name + "\n§7" + tooltip;
        });
    }
    ItemName.addTooltip = addTooltip;
    function addTierTooltip(blockID, tier) {
        addTooltip(Block.getNumericId(blockID), getPowerTierText(tier));
    }
    ItemName.addTierTooltip = addTierTooltip;
    function addStorageBlockTooltip(blockID, tier, capacity) {
        Item.registerNameOverrideFunction(Block.getNumericId(blockID), function (item, name) {
            var color = ItemRegistry.getItemRarityColor(item.id);
            return color + name + "\n§7" + getBlockStorageText(item, tier, capacity);
        });
    }
    ItemName.addStorageBlockTooltip = addStorageBlockTooltip;
    function getBlockStorageText(item, tier, capacity) {
        var energy = item.extra ? item.extra.getInt("energy") : 0;
        return getPowerTierText(tier) + "\n" + displayEnergy(energy) + "/" + capacity + " EU";
    }
    ItemName.getBlockStorageText = getBlockStorageText;
    function getPowerTierText(tier) {
        return Translation.translate("tooltip.power_tier").replace("%s", tier.toString());
    }
    ItemName.getPowerTierText = getPowerTierText;
    function getItemStorageText(item) {
        var energy = ChargeItemRegistry.getEnergyStored(item);
        var capacity = ChargeItemRegistry.getMaxCharge(item.id);
        return displayEnergy(energy) + "/" + displayEnergy(capacity) + " EU";
    }
    ItemName.getItemStorageText = getItemStorageText;
    function displayEnergy(energy, debug) {
        if (debug === void 0) { debug = Game.isDeveloperMode; }
        if (!debug) {
            if (energy >= 1e9) {
                return Math.floor(energy / 1e8) / 10 + "B";
            }
            if (energy >= 1e6) {
                return Math.floor(energy / 1e5) / 10 + "M";
            }
            if (energy >= 1000) {
                return Math.floor(energy / 100) / 10 + "K";
            }
        }
        return energy.toString();
    }
    ItemName.displayEnergy = displayEnergy;
})(ItemName || (ItemName = {}));
SoundManager.init(16);
SoundManager.setResourcePath(__dir__ + "assets/sounds/");
SoundManager.registerSound("GeneratorLoop.ogg", "Generators/GeneratorLoop.ogg", true);
SoundManager.registerSound("GeothermalLoop.ogg", "Generators/GeothermalLoop.ogg", true);
SoundManager.registerSound("WatermillLoop.ogg", "Generators/WatermillLoop.ogg", true);
SoundManager.registerSound("WindGenLoop.ogg", "Generators/WindGenLoop.ogg", true);
SoundManager.registerSound("MassFabLoop.ogg", "Generators/MassFabricator/MassFabLoop.ogg", true);
SoundManager.registerSound("MassFabScrapSolo.ogg", "Generators/MassFabricator/MassFabScrapSolo.ogg");
SoundManager.registerSound("GeigerHighEU.ogg", "Generators/NuclearReactor/GeigerHighEU.ogg", true);
SoundManager.registerSound("GeigerLowEU.ogg", "Generators/NuclearReactor/GeigerLowEU.ogg", true);
SoundManager.registerSound("GeigerMedEU.ogg", "Generators/NuclearReactor/GeigerMedEU.ogg", true);
SoundManager.registerSound("NuclearReactorLoop.ogg", "Generators/NuclearReactor/NuclearReactorLoop.ogg", true);
SoundManager.registerSound("CompressorOp.ogg", "Machines/CompressorOp.ogg", true);
SoundManager.registerSound("ElectrolyzerLoop.ogg", "Machines/ElectrolyzerLoop.ogg", true);
SoundManager.registerSound("ExtractorOp.ogg", "Machines/ExtractorOp.ogg", true);
SoundManager.registerSound("InterruptOne.ogg", "Machines/InterruptOne.ogg");
SoundManager.registerSound("IronFurnaceOp.ogg", "Machines/IronFurnaceOp.ogg", true);
SoundManager.registerSound("MaceratorOp.ogg", "Machines/MaceratorOp.ogg", true);
SoundManager.registerSound("MachineOverload.ogg", "Machines/MachineOverload.ogg");
SoundManager.registerSound("MagnetizerLoop.ogg", "Machines/MagnetizerLoop.ogg", true);
SoundManager.registerSound("MinerOp.ogg", "Machines/MinerOp.ogg", true);
SoundManager.registerSound("PumpOp.ogg", "Machines/PumpOp.ogg", true);
SoundManager.registerSound("RecyclerOp.ogg", "Machines/RecyclerOp.ogg", true);
SoundManager.registerSound("TerraformerGenericloop.ogg", "Machines/TerraformerGenericloop.ogg", true);
SoundManager.registerSound("ElectroFurnaceLoop.ogg", "Machines/Electro Furnace/ElectroFurnaceLoop.ogg", true);
SoundManager.registerSound("ElectroFurnaceStart.ogg", "Machines/Electro Furnace/ElectroFurnaceStart.ogg");
SoundManager.registerSound("ElectroFurnaceStop.ogg", "Machines/Electro Furnace/ElectroFurnaceStop.ogg");
SoundManager.registerSound("InductionLoop.ogg", "Machines/Induction Furnace/InductionLoop.ogg", true);
SoundManager.registerSound("InductionStart.ogg", "Machines/Induction Furnace/InductionStart.ogg");
SoundManager.registerSound("InductionStop.ogg", "Machines/Induction Furnace/InductionStop.ogg");
SoundManager.registerSound("TeleChargedLoop.ogg", "Machines/Teleporter/TeleChargedLoop.ogg", true);
SoundManager.registerSound("TeleUse.ogg", "Machines/Teleporter/TeleUse.ogg");
SoundManager.registerSound("BatteryUse.ogg", "Tools/BatteryUse.ogg");
SoundManager.registerSound("dynamiteomote.ogg", "Tools/dynamiteomote.ogg");
SoundManager.registerSound("eat.ogg", "Tools/eat.ogg");
SoundManager.registerSound("InsulationCutters.ogg", "Tools/InsulationCutters.ogg");
SoundManager.registerSound("JetpackLoop.ogg", "Tools/JetpackLoop.ogg", true);
SoundManager.registerSound("NukeExplosion.ogg", "Tools/NukeExplosion.ogg");
SoundManager.registerSound("ODScanner.ogg", "Tools/ODScanner.ogg");
SoundManager.registerSound("Painter.ogg", "Tools/Painter.ogg");
SoundManager.registerSound("RubberTrampoline.ogg", "Tools/RubberTrampoline.ogg");
SoundManager.registerSound("Treetap.ogg", "Tools/Treetap.ogg");
SoundManager.registerSound("Wrench.ogg", "Tools/Wrench.ogg");
SoundManager.registerSound("ChainsawIdle.ogg", "Tools/Chainsaw/ChainsawIdle.ogg", true);
SoundManager.registerSound("ChainsawStop.ogg", "Tools/Chainsaw/ChainsawStop.ogg");
SoundManager.registerSound("ChainsawUseOne.ogg", "Tools/Chainsaw/ChainsawUseOne.ogg");
SoundManager.registerSound("ChainsawUseTwo.ogg", "Tools/Chainsaw/ChainsawUseTwo.ogg");
SoundManager.registerSound("DrillHard.ogg", "Tools/Drill/DrillHard.ogg");
SoundManager.registerSound("DrillSoft.ogg", "Tools/Drill/DrillSoft.ogg");
SoundManager.registerSound("DrillUseLoop.ogg", "Tools/Drill/DrillUseLoop.ogg", true);
SoundManager.registerSound("MiningLaser.ogg", "Tools/MiningLaser/MiningLaser.ogg");
SoundManager.registerSound("MiningLaserExplosive.ogg", "Tools/MiningLaser/MiningLaserExplosive.ogg");
SoundManager.registerSound("MiningLaserLongRange.ogg", "Tools/MiningLaser/MiningLaserLongRange.ogg");
SoundManager.registerSound("MiningLaserLowFocus.ogg", "Tools/MiningLaser/MiningLaserLowFocus.ogg");
SoundManager.registerSound("MiningLaserScatter.ogg", "Tools/MiningLaser/MiningLaserScatter.ogg");
SoundManager.registerSound("NanosaberIdle.ogg", "Tools/Nanosaber/NanosaberIdle.ogg", true);
SoundManager.registerSound("NanosaberPowerup.ogg", "Tools/Nanosaber/NanosaberPowerup.ogg");
SoundManager.registerSound("NanosaberSwing.ogg", ["Tools/Nanosaber/NanosaberSwing1.ogg", "Tools/Nanosaber/NanosaberSwing2.ogg", "Tools/Nanosaber/NanosaberSwing3.ogg"]);
SoundManager.registerSound("QuantumsuitBoots.ogg", "Tools/QuantumSuit/QuantumsuitBoots.ogg");
var IC2Config;
(function (IC2Config) {
    IC2Config.soundEnabled = getBool("sound_enabled");
    IC2Config.machineSoundEnabled = getBool("machine_sounds");
    IC2Config.voltageEnabled = getBool("voltage_enabled");
    IC2Config.hardRecipes = getBool("hard_recipes");
    function getBool(name) {
        return __config__.getBool(name);
    }
    IC2Config.getBool = getBool;
    function getInt(name) {
        return __config__.getInteger(name);
    }
    IC2Config.getInt = getInt;
    function getFloat(name) {
        return __config__.getFloat(name);
    }
    IC2Config.getFloat = getFloat;
})(IC2Config || (IC2Config = {}));
var isLevelDisplayed = false;
Callback.addCallback("LevelDisplayed", function () {
    isLevelDisplayed = true;
});
Callback.addCallback("LevelLeft", function () {
    isLevelDisplayed = false;
});
// show tps
var lasttime = -1;
var frame = 0;
Callback.addCallback("tick", function () {
    if (!Game.isDeveloperMode)
        return;
    var t = Debug.sysTime();
    if (frame++ % 20 == 0) {
        if (lasttime != -1) {
            var tps = 1000 / (t - lasttime) * 20;
            Game.tipMessage(Math.round(tps * 10) / 10 + "tps");
        }
        lasttime = t;
    }
});
var RadiationAPI;
(function (RadiationAPI) {
    RadiationAPI.radioactiveItems = {};
    RadiationAPI.hazmatArmor = {};
    RadiationAPI.sources = [];
    RadiationAPI.effectDuration = {};
    function setRadioactivity(itemID, duration, stack) {
        if (stack === void 0) { stack = false; }
        RadiationAPI.radioactiveItems[itemID] = { duration: duration, stack: stack };
    }
    RadiationAPI.setRadioactivity = setRadioactivity;
    function getRadioactivity(itemID) {
        return RadiationAPI.radioactiveItems[itemID];
    }
    RadiationAPI.getRadioactivity = getRadioactivity;
    function isRadioactiveItem(itemID) {
        return !!RadiationAPI.radioactiveItems[itemID];
    }
    RadiationAPI.isRadioactiveItem = isRadioactiveItem;
    function emitItemRadiation(entity, itemID) {
        var radiation = getRadioactivity(itemID);
        if (radiation) {
            if (radiation.stack) {
                addRadiation(entity, radiation.duration);
                return true;
            }
            if (getRadiation(entity) < radiation.duration) {
                setRadiation(entity, radiation.duration);
                return true;
            }
        }
    }
    RadiationAPI.emitItemRadiation = emitItemRadiation;
    function registerHazmatArmor(itemID) {
        RadiationAPI.hazmatArmor[itemID] = true;
    }
    RadiationAPI.registerHazmatArmor = registerHazmatArmor;
    function isHazmatArmor(itemID) {
        return RadiationAPI.hazmatArmor[itemID];
    }
    RadiationAPI.isHazmatArmor = isHazmatArmor;
    function hasHazmatSuit(playerUid) {
        for (var i = 0; i < 4; i++) {
            var itemID = Entity.getArmorSlot(playerUid, i).id;
            if (!isHazmatArmor(itemID))
                return false;
        }
        return true;
    }
    RadiationAPI.hasHazmatSuit = hasHazmatSuit;
    function getRadiation(playerUid) {
        return RadiationAPI.effectDuration[playerUid] || 0;
    }
    RadiationAPI.getRadiation = getRadiation;
    function setRadiation(playerUid, duration) {
        duration = Math.max(duration, 0);
        if (duration < getRadiation(playerUid)) {
            Entity.clearEffect(playerUid, PotionEffect.fatal_poison);
            if (duration > 0) {
                addPoisonEffect(playerUid, duration);
            }
        }
        RadiationAPI.effectDuration[playerUid] = duration;
    }
    RadiationAPI.setRadiation = setRadiation;
    function addRadiation(playerUid, duration) {
        setRadiation(playerUid, getRadiation(playerUid) + duration);
    }
    RadiationAPI.addRadiation = addRadiation;
    function addPoisonEffect(ent, duration) {
        Entity.addEffect(ent, PotionEffect.fatal_poison, 1, duration * 20 + 1);
    }
    function addEffect(ent, duration) {
        var isPlayer = EntityHelper.isPlayer(ent);
        if (isPlayer && !hasHazmatSuit(ent) || EntityHelper.isMob(ent)) {
            addPoisonEffect(ent, duration);
            if (isPlayer && getRadiation(ent) < duration) {
                setRadiation(ent, duration);
            }
        }
    }
    RadiationAPI.addEffect = addEffect;
    function addEffectInRange(region, x, y, z, radius, duration) {
        var entities = EntityHelper.getEntitiesInRadius(region, new Vector3(x, y, z), radius);
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var ent = entities_1[_i];
            if (EntityHelper.canTakeDamage(ent, DamageSource.radiation)) {
                addEffect(ent, duration);
            }
        }
    }
    RadiationAPI.addEffectInRange = addEffectInRange;
    function addRadiationSource(x, y, z, dimension, radius, duration) {
        RadiationAPI.sources.push({
            x: x,
            y: y,
            z: z,
            dimension: dimension,
            radius: radius,
            timer: duration
        });
    }
    RadiationAPI.addRadiationSource = addRadiationSource;
    Saver.addSavesScope("radiation", function read(scope) {
        RadiationAPI.sources = scope.source || [];
        RadiationAPI.effectDuration = scope.effects || {};
    }, function save() {
        return {
            source: RadiationAPI.sources,
            effects: RadiationAPI.effectDuration
        };
    });
    Callback.addCallback("tick", function () {
        if (World.getThreadTime() % 20 == 0) {
            for (var i = 0; i < RadiationAPI.sources.length; i++) {
                var source = RadiationAPI.sources[i];
                var region = WorldRegion.getForDimension(source.dimension);
                if (!region)
                    continue;
                addEffectInRange(region, source.x, source.y, source.z, source.radius, 10);
                source.timer--;
                if (source.timer <= 0) {
                    RadiationAPI.sources.splice(i--, 1);
                }
            }
        }
    });
    Callback.addCallback("ServerPlayerTick", function (playerUid) {
        if (World.getThreadTime() % 20 == 0) {
            if (!hasHazmatSuit(playerUid)) {
                var player = new PlayerActor(playerUid);
                for (var i = 0; i < 36; i++) {
                    var itemID = player.getInventorySlot(i).id;
                    emitItemRadiation(playerUid, itemID);
                }
            }
            var duration = RadiationAPI.effectDuration[playerUid];
            if (duration > 0) {
                addPoisonEffect(playerUid, duration);
                RadiationAPI.effectDuration[playerUid]--;
            }
        }
    });
    Callback.addCallback("EntityDeath", function (entity) {
        if (EntityHelper.isPlayer(entity) && getRadiation(entity) > 0) {
            setRadiation(entity, 0);
        }
    });
})(RadiationAPI || (RadiationAPI = {}));
var IntegrationAPI;
(function (IntegrationAPI) {
    function addToRecyclerBlacklist(id) {
        recyclerBlacklist.push(id);
    }
    IntegrationAPI.addToRecyclerBlacklist = addToRecyclerBlacklist;
    function addToolBooxValidItem(id) {
        toolboxItems.push(id);
    }
    IntegrationAPI.addToolBooxValidItem = addToolBooxValidItem;
})(IntegrationAPI || (IntegrationAPI = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EUCableGrid = /** @class */ (function (_super) {
    __extends(EUCableGrid, _super);
    function EUCableGrid(energyType, maxValue, blockID, region) {
        var _this = _super.call(this, energyType, maxValue, blockID, region) || this;
        var cableData = CableRegistry.getCableData(blockID);
        if (cableData) {
            _this.maxSafetyVoltage = CableRegistry.maxSafetyVoltage[cableData.insulation];
        }
        return _this;
    }
    EUCableGrid.prototype.onOverload = function (voltage) {
        if (IC2Config.voltageEnabled) {
            var region = new WorldRegion(this.region);
            for (var key in this.blocksMap) {
                var coords = this.getCoordsFromString(key);
                region.setBlock(coords, 0, 0);
                region.sendPacketInRadius(coords, 64, "ic2.cableBurnParticles", coords);
            }
            this.destroy();
        }
    };
    EUCableGrid.prototype.addBurnParticles = function (x, y, z) {
        for (var i = 0; i < 32; i++) {
            var px = x + Math.random();
            var pz = z + Math.random();
            var py = y + Math.random();
            Particles.addParticle(ParticleType.smoke, px, py, pz, 0, 0.01, 0);
        }
    };
    EUCableGrid.prototype.canConductEnergy = function (coord1, coord2, side) {
        var block1 = this.region.getBlock(coord1.x, coord1.y, coord1.z);
        var block2 = this.region.getBlock(coord2.x, coord2.y, coord2.z);
        if (!CableRegistry.canBePainted(block2.id) || block1.data == 0 || block2.data == 0 || block2.data == block1.data) {
            return true;
        }
        return false;
    };
    EUCableGrid.prototype.dealElectrocuteDamage = function (damage) {
        var minX = 2e9, minY = 256, minZ = 2e9, maxX = -2e9, maxY = 0, maxZ = -2e9;
        for (var key in this.blocksMap) {
            var _a = this.getCoordsFromString(key), x = _a.x, y = _a.y, z = _a.z;
            if (x < minX)
                minX = x;
            if (y < minY)
                minY = y;
            if (z < minZ)
                minZ = z;
            if (x > maxX)
                maxX = x;
            if (y > maxY)
                maxY = y;
            if (z > maxZ)
                maxZ = z;
        }
        var region = new WorldRegion(this.region);
        var entities = region.listEntitiesInAABB(minX - 1, minY - 1, minZ - 1, maxX + 2, maxY + 2, maxZ + 2);
        for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
            var ent = entities_2[_i];
            if (!EntityHelper.canTakeDamage(ent, DamageSource.electricity))
                continue;
            var pos = Entity.getPosition(ent);
            if (EntityHelper.isPlayer(ent))
                pos.y -= 1.62;
            for (var key in this.blocksMap) {
                var keyArr = key.split(":");
                var x = parseInt(keyArr[0]) + .5, y = parseInt(keyArr[1]) + .5, z = parseInt(keyArr[2]) + .5;
                if (Math.abs(pos.x - x) <= 1.5 && Math.abs(pos.y - y) <= 1.5 && Math.abs(pos.z - z) <= 1.5) {
                    Entity.damageEntity(ent, damage);
                    break;
                }
            }
        }
    };
    EUCableGrid.prototype.tick = function () {
        _super.prototype.tick.call(this);
        if (IC2Config.voltageEnabled && this.maxSafetyVoltage && World.getThreadTime() % 20 == 0) {
            if (this.energyPower > this.maxSafetyVoltage) {
                var damage = Math.ceil(this.energyPower / 32);
                this.dealElectrocuteDamage(damage);
            }
        }
    };
    EUCableGrid.prototype.getCoordsFromString = function (coordKey) {
        var coordArray = coordKey.split(':').map(function (c) { return parseInt(c); });
        return { x: coordArray[0], y: coordArray[1], z: coordArray[2] };
    };
    return EUCableGrid;
}(EnergyGrid));
Network.addClientPacket("ic2.cableBurnParticles", function (data) {
    for (var i = 0; i < 32; i++) {
        var px = data.x + Math.random();
        var pz = data.z + Math.random();
        var py = data.y + Math.random();
        Particles.addParticle(ParticleType.smoke2, px, py, pz, 0, 0.01, 0);
    }
});
/// <reference path="EUCableGrid.ts" />
var CableRegistry;
(function (CableRegistry) {
    var insulationData = {};
    var paintableBlocks = [];
    CableRegistry.maxSafetyVoltage = {
        0: 5,
        1: 128,
        2: 512
    };
    function getCableData(id) {
        return insulationData[id];
    }
    CableRegistry.getCableData = getCableData;
    function canBePainted(id) {
        return paintableBlocks.indexOf(id) != -1;
    }
    CableRegistry.canBePainted = canBePainted;
    function getBlockID(stringID, insulation) {
        return Block.getNumericId(stringID + insulation);
    }
    CableRegistry.getBlockID = getBlockID;
    function createBlock(stringID, properties, blockType) {
        var variations = [];
        for (var i = 0; i < 16; i++) {
            variations.push({ name: properties.name, texture: [[properties.texture, i]] });
        }
        BlockRegistry.createBlock(stringID, variations, blockType);
        paintableBlocks.push(Block.getNumericId(stringID));
    }
    CableRegistry.createBlock = createBlock;
    function registerCable(stringID, maxVoltage, maxInsulationLevel) {
        if (maxInsulationLevel) {
            for (var index = 0; index <= maxInsulationLevel; index++) {
                var blockID = Block.getNumericId(stringID + index);
                insulationData[blockID] = { name: stringID, insulation: index, maxInsulation: maxInsulationLevel };
                EU.registerWire(blockID, maxVoltage, EUCableGrid);
                setupDrop(stringID + index);
            }
        }
        else {
            EU.registerWire(Block.getNumericId(stringID), maxVoltage, EUCableGrid);
            setupDrop(stringID);
        }
    }
    CableRegistry.registerCable = registerCable;
    function setupDrop(blockID) {
        BlockRegistry.registerDrop(blockID, function (coords, id, data) {
            return [[Item.getNumericId(blockID), 1, 0]];
        });
    }
    CableRegistry.setupDrop = setupDrop;
    function setupModel(id, width) {
        TileRenderer.setupWireModel(id, 0, width, "ic-wire");
        var group = ICRender.getGroup("ic-wire");
        var groupPainted = ICRender.getGroup("ic-wire-painted");
        group.add(id, -1);
        // painted cables
        width /= 2;
        var boxes = [
            { side: [1, 0, 0], box: [0.5 + width, 0.5 - width, 0.5 - width, 1, 0.5 + width, 0.5 + width] },
            { side: [-1, 0, 0], box: [0, 0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width] },
            { side: [0, 1, 0], box: [0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width, 1, 0.5 + width] },
            { side: [0, -1, 0], box: [0.5 - width, 0, 0.5 - width, 0.5 + width, 0.5 - width, 0.5 + width] },
            { side: [0, 0, 1], box: [0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, 1] },
            { side: [0, 0, -1], box: [0.5 - width, 0.5 - width, 0, 0.5 + width, 0.5 + width, 0.5 - width] },
        ];
        for (var data = 1; data < 16; data++) {
            var groupColor = ICRender.getGroup("ic-wire" + data);
            groupColor.add(id, data);
            groupPainted.add(id, data);
            var render = new ICRender.Model();
            var shape = new ICRender.CollisionShape();
            for (var _i = 0, boxes_1 = boxes; _i < boxes_1.length; _i++) {
                var box = boxes_1[_i];
                // render
                var model_1 = BlockRenderer.createModel();
                model_1.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], id, data);
                var condition1 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
                var condition2 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupPainted, true);
                var condition3 = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], groupColor, false);
                var condition = ICRender.AND(condition1, ICRender.OR(condition2, condition3));
                render.addEntry(model_1).setCondition(condition);
                // collision shape
                var entry_1 = shape.addEntry();
                entry_1.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5]);
                entry_1.setCondition(condition);
            }
            // central box
            var model = BlockRenderer.createModel();
            model.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width, id, data);
            render.addEntry(model);
            var entry = shape.addEntry();
            entry.addBox(0.5 - width, 0.5 - width, 0.5 - width, 0.5 + width, 0.5 + width, 0.5 + width);
            BlockRenderer.setStaticICRender(id, data, render);
            BlockRenderer.setCustomCollisionShape(id, data, shape);
            BlockRenderer.setCustomRaycastShape(id, data, shape);
        }
    }
    CableRegistry.setupModel = setupModel;
})(CableRegistry || (CableRegistry = {}));
var UpgradeAPI;
(function (UpgradeAPI) {
    var data = {};
    function getUpgrade(id) {
        return data[id];
    }
    UpgradeAPI.getUpgrade = getUpgrade;
    function isUpgrade(id) {
        return !!data[id];
    }
    UpgradeAPI.isUpgrade = isUpgrade;
    function isValidUpgrade(id, machine) {
        var upgrade = getUpgrade(id);
        var validUpgrades = machine["upgrades"];
        if (upgrade && (!validUpgrades || validUpgrades.indexOf(upgrade.type) != -1)) {
            return true;
        }
        return false;
    }
    UpgradeAPI.isValidUpgrade = isValidUpgrade;
    function registerUpgrade(id, upgrade) {
        data[id] = upgrade;
    }
    UpgradeAPI.registerUpgrade = registerUpgrade;
    function useUpgrades(machine) {
        return new UpgradeSet(machine);
    }
    UpgradeAPI.useUpgrades = useUpgrades;
    /** @deprecated */
    function executeUpgrades(machine) {
        var upgrades = useUpgrades(machine);
        // reverse compatibility with Advanced Machines
        var data = machine.data;
        if ("power_tier" in data) {
            data.power_tier = upgrades.getTier(data.power_tier);
        }
        if ("energy_storage" in data) {
            data.energy_storage = upgrades.getEnergyStorage(data.energy_storage);
        }
        if ("isHeating" in data) {
            data.isHeating = upgrades.getRedstoneInput(data.isHeating);
        }
        StorageInterface.checkHoppers(machine);
        return upgrades;
    }
    UpgradeAPI.executeUpgrades = executeUpgrades;
    var UpgradeSet = /** @class */ (function () {
        function UpgradeSet(tileEntity) {
            this.tileEntity = tileEntity;
            this.resetRates();
            this.useUpgrades();
        }
        UpgradeSet.prototype.resetRates = function () {
            this.speedModifier = 1;
            this.processTimeMultiplier = 1;
            this.energyDemandMultiplier = 1;
            this.extraEnergyStorage = 0;
            this.extraTier = 0;
        };
        UpgradeSet.prototype.useUpgrades = function () {
            var container = this.tileEntity.container;
            for (var slotName in container.slots) {
                if (slotName.match(/Upgrade/)) {
                    var slot = container.getSlot(slotName);
                    var upgrade = getUpgrade(slot.id);
                    if (upgrade && this.isValidUpgrade(upgrade)) {
                        this.executeUprade(upgrade, slot);
                    }
                }
            }
        };
        UpgradeSet.prototype.isValidUpgrade = function (upgrade) {
            var validUpgrades = this.tileEntity["upgrades"];
            return (!validUpgrades || validUpgrades.indexOf(upgrade.type) != -1);
        };
        UpgradeSet.prototype.executeUprade = function (upgrade, stack) {
            if (upgrade.type == "overclocker") {
                this.speedModifier += upgrade.getSpeedModifier(stack, this.tileEntity) * stack.count;
                this.processTimeMultiplier *= Math.pow(upgrade.getProcessTimeMultiplier(stack, this.tileEntity), stack.count);
                this.energyDemandMultiplier *= Math.pow(upgrade.getEnergyDemandMultiplier(stack, this.tileEntity), stack.count);
            }
            if (upgrade.type == "energyStorage") {
                this.extraEnergyStorage += upgrade.getExtraEnergyStorage(stack, this.tileEntity) * stack.count;
            }
            if (upgrade.type == "transformer") {
                this.extraTier += upgrade.getExtraTier(stack, this.tileEntity) * stack.count;
            }
            if (upgrade.type == "redstone") {
                this.invertRedstone = true;
            }
            if ("onTick" in upgrade) {
                upgrade.onTick(stack, this.tileEntity);
            }
        };
        UpgradeSet.prototype.getProcessTime = function (defaultLength) {
            return Math.round(defaultLength * this.processTimeMultiplier);
        };
        UpgradeSet.prototype.getEnergyDemand = function (defaultEnergy) {
            return Math.round(defaultEnergy * this.energyDemandMultiplier);
        };
        UpgradeSet.prototype.getEnergyStorage = function (defaultEnergyStorage) {
            var energyStorage = defaultEnergyStorage + this.extraEnergyStorage;
            var tileData = this.tileEntity.data;
            tileData.energy = Math.min(tileData.energy, energyStorage);
            return energyStorage;
        };
        UpgradeSet.prototype.getTier = function (defaultTier) {
            return Math.min(defaultTier + this.extraTier, 14);
        };
        UpgradeSet.prototype.getRedstoneInput = function (powered) {
            return this.invertRedstone ? !powered : powered;
        };
        return UpgradeSet;
    }());
    UpgradeAPI.UpgradeSet = UpgradeSet;
})(UpgradeAPI || (UpgradeAPI = {}));
var WindSim;
(function (WindSim) {
    WindSim.windStrength = MathUtil.randomInt(5, 25);
    function getWindAt(height) {
        var windMultiplier = Math.max(1 - Math.pow(Math.abs((160 - height) / 96), 2), 0);
        var wether = World.getWeather();
        if (wether.thunder)
            windMultiplier *= 1.5;
        else if (wether.rain)
            windMultiplier *= 1.25;
        return WindSim.windStrength * windMultiplier;
    }
    WindSim.getWindAt = getWindAt;
    function updateWind() {
        if (World.getThreadTime() % 128 != 0) {
            return;
        }
        var upChance = 10;
        var downChance = 10;
        if (WindSim.windStrength > 20) {
            upChance -= WindSim.windStrength - 20;
        }
        else if (WindSim.windStrength < 10) {
            downChance -= 10 - WindSim.windStrength;
        }
        if (Math.random() * 100 < upChance) {
            WindSim.windStrength++;
        }
        else if (Math.random() * 100 < downChance) {
            WindSim.windStrength--;
        }
    }
    Callback.addCallback("tick", function () {
        updateWind();
    });
    Saver.addSavesScope("windSim", function read(scope) {
        WindSim.windStrength = scope.strength || MathUtil.randomInt(5, 25);
    }, function save() {
        return { strength: WindSim.windStrength };
    });
})(WindSim || (WindSim = {}));
var Agriculture;
(function (Agriculture) {
    Agriculture.NutrientBiomeBonus = {
        21: 10,
        22: 10,
        23: 10,
        149: 10,
        151: 10,
        6: 10,
        134: 10,
        14: 5,
        15: 5,
        4: 5,
        132: 5,
        18: 5,
        27: 5,
        155: 5,
        157: 5,
        29: 5,
        28: 5,
        7: 2,
        11: 2,
        1: 0,
        128: 0,
        129: 0,
        12: 0,
        35: -2,
        163: -2,
        36: -2,
        3: -5,
        13: -5,
        162: -5,
        165: -5,
        166: -5,
        34: -5,
        158: -5,
        131: -5,
        37: -5,
        38: -5,
        39: -5,
        17: -5,
        19: -5,
        20: -5,
        161: -5,
        156: -5,
        33: -5,
        31: -5
    };
})(Agriculture || (Agriculture = {}));
/// <reference path="../CropTile/CropTileData.ts" />
var Agriculture;
(function (Agriculture) {
    var SeedExtraCreator = /** @class */ (function () {
        function SeedExtraCreator() {
        }
        SeedExtraCreator.generateExtraFromValues = function (data) {
            var extra = new ItemExtraData();
            extra.putInt("growth", data.statGrowth);
            extra.putInt("gain", data.statGain);
            extra.putInt("resistance", data.statResistance);
            extra.putInt("scan", data.scanLevel);
            return extra;
        };
        SeedExtraCreator.getDefaultExtra = function (cardIndex) {
            var extra = new ItemExtraData();
            var card = Agriculture.CropCardManager.getCropCardByIndex(cardIndex);
            var baseSeed = card.getBaseSeed();
            extra.putInt("growth", baseSeed.growth);
            extra.putInt("gain", baseSeed.gain);
            extra.putInt("resistance", baseSeed.resistance);
            extra.putInt("scan", 4);
            return extra;
        };
        return SeedExtraCreator;
    }());
    Agriculture.SeedExtraCreator = SeedExtraCreator;
})(Agriculture || (Agriculture = {}));
/// <reference path="NutrientBiomeBonus.ts" />
var Agriculture;
(function (Agriculture) {
    var BiomeBonusesManager = /** @class */ (function () {
        function BiomeBonusesManager() {
        }
        BiomeBonusesManager.getHumidityBiomeBonus = function (x, z) {
            // * yes it really zero
            return 0;
        };
        BiomeBonusesManager.getNutrientBiomeBonus = function (x, z) {
            var biome = World.getBiome(x, z);
            return Agriculture.NutrientBiomeBonus[biome] || 0;
        };
        return BiomeBonusesManager;
    }());
    Agriculture.BiomeBonusesManager = BiomeBonusesManager;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropCard = /** @class */ (function () {
        function CropCard() {
        }
        CropCard.prototype.initialize = function (cardID) {
            if (this.getBaseSeed().addToCreative) {
                var extra = Agriculture.SeedExtraCreator.getDefaultExtra(cardID);
                Item.addToCreative(ItemID.cropSeedBag, 1, cardID, extra);
            }
        };
        CropCard.prototype.getTexture = function () {
            return this.getID();
        };
        CropCard.prototype.getBaseSeed = function () {
            return {
                size: 1,
                growth: 1,
                gain: 1,
                resistance: 1,
                addToCreative: true
            };
        };
        CropCard.prototype.getProperties = function () {
            return {
                tier: 0,
                chemistry: 0,
                consumable: 0,
                defensive: 0,
                colorful: 0,
                weed: 0
            };
        };
        CropCard.prototype.getMaxSize = function () {
            return 1;
        };
        CropCard.prototype.getOptimalHarvestSize = function (te) {
            return te.crop.getMaxSize();
        };
        CropCard.prototype.getDiscoveredBy = function () {
            return "IC2 Team";
        };
        CropCard.prototype.isWeed = function (te) {
            return false;
        };
        CropCard.prototype.tick = function (te) { };
        CropCard.prototype.getDropGainChance = function (te) {
            return Math.pow(0.95, te.crop.getProperties().tier);
        };
        CropCard.prototype.canGrow = function (te) {
            return te.data.currentSize < te.crop.getMaxSize();
        };
        CropCard.prototype.canCross = function (te) {
            return te.data.currentSize >= 3;
        };
        CropCard.prototype.canBeHarvested = function (te) {
            return te.data.currentSize == te.crop.getMaxSize();
        };
        CropCard.prototype.getGrowthDuration = function (te) {
            return te.crop.getProperties().tier * 200;
        };
        CropCard.prototype.getSeeds = function (te) {
            return te.generateSeeds(te.data);
        };
        CropCard.prototype.getProduct = function () {
            return new ItemStack();
        };
        CropCard.prototype.getSeedDropChance = function (te) {
            if (te.data.currentSize == 1)
                return 0;
            var base = .5;
            if (te.data.currentSize == 2)
                base /= 2;
            base *= Math.pow(0.8, te.crop.getProperties().tier);
            return base;
        };
        CropCard.prototype.onLeftClick = function (te, player) {
            return te.pick();
        };
        CropCard.prototype.onRightClick = function (te, player) {
            return te.performManualHarvest();
        };
        CropCard.prototype.onEntityCollision = function (te, entity) {
            return true;
        };
        CropCard.prototype.getSizeAfterHarvest = function (te) {
            return 1;
        };
        CropCard.prototype.getRootsLength = function (te) {
            return 1;
        };
        return CropCard;
    }());
    Agriculture.CropCard = CropCard;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropCardManager = /** @class */ (function () {
        function CropCardManager() {
        }
        /**
         * Register new card
         * @param {CropCard} cropCard
         * @returns {number} registred card ID
         */
        CropCardManager.registerCropCard = function (cropCard) {
            var cardID = this.cropCards.push(cropCard) - 1;
            cropCard.initialize(cardID);
        };
        CropCardManager.getALLCropCards = function () {
            return this.cropCards;
        };
        CropCardManager.getCropCardByIndex = function (index) {
            return this.cropCards[index] || null;
        };
        CropCardManager.getIndexByCropCardID = function (id) {
            for (var i in this.cropCards) {
                if (this.cropCards[i].getID() == id) {
                    return +i;
                }
            }
            return null;
        };
        CropCardManager.getCardFromSeed = function (item) {
            for (var i in this.cropCards) {
                var seed = this.cropCards[i].getBaseSeed();
                if (seed && seed.id == item.id && (!seed.data || seed.data == item.data)) {
                    return this.cropCards[i];
                }
            }
            return null;
        };
        CropCardManager.getCardFromID = function (id) {
            for (var i in this.cropCards) {
                if (this.cropCards[i].getID() == id) {
                    return this.cropCards[i];
                }
            }
            return null;
        };
        CropCardManager.cropCards = [];
        return CropCardManager;
    }());
    Agriculture.CropCardManager = CropCardManager;
})(Agriculture || (Agriculture = {}));
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/// <reference path="../../../CropCard/CropCard.ts" />
/// <reference path="../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../CropTile/ICropTileEntity.ts" />
var Agriculture;
(function (Agriculture) {
    var CropColorFlowerCard = /** @class */ (function (_super) {
        __extends(CropColorFlowerCard, _super);
        function CropColorFlowerCard(id, attributes, dye, baseSeed) {
            var _this = _super.call(this) || this;
            _this.id = id;
            _this.attributes = attributes;
            _this.dye = dye;
            _this.baseSeed = baseSeed;
            return _this;
        }
        CropColorFlowerCard.prototype.getID = function () {
            return this.id;
        };
        CropColorFlowerCard.prototype.getAttributes = function () {
            return this.attributes;
        };
        CropColorFlowerCard.prototype.getDiscoveredBy = function () {
            return "Notch";
        };
        CropColorFlowerCard.prototype.getProperties = function () {
            return {
                tier: 2,
                chemistry: 1,
                consumable: 1,
                defensive: 0,
                colorful: 5,
                weed: 1
            };
        };
        CropColorFlowerCard.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), this.baseSeed);
        };
        CropColorFlowerCard.prototype.getMaxSize = function () {
            return 4;
        };
        CropColorFlowerCard.prototype.getOptimalHarvestSize = function () {
            return 4;
        };
        CropColorFlowerCard.prototype.canGrow = function (tileentity) {
            var light = tileentity.region.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
            return tileentity.data.currentSize < tileentity.crop.getMaxSize() && light >= 12;
        };
        CropColorFlowerCard.prototype.getGain = function (te) {
            return this.dye;
        };
        CropColorFlowerCard.prototype.getSizeAfterHarvest = function (te) {
            return 3;
        };
        CropColorFlowerCard.prototype.getGrowthDuration = function (te) {
            if (te.data.currentSize == 3)
                return 600;
            return 400;
        };
        return CropColorFlowerCard;
    }(Agriculture.CropCard));
    Agriculture.CropColorFlowerCard = CropColorFlowerCard;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropBaseMushroom = /** @class */ (function (_super) {
        __extends(CropBaseMushroom, _super);
        function CropBaseMushroom() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropBaseMushroom.prototype.getProperties = function () {
            return {
                tier: 2,
                chemistry: 0,
                consumable: 4,
                defensive: 0,
                colorful: 0,
                weed: 4
            };
        };
        CropBaseMushroom.prototype.getMaxSize = function () {
            return 3;
        };
        CropBaseMushroom.prototype.canGrow = function (tileentity) {
            return tileentity.data.currentSize < this.getMaxSize() && tileentity.data.storageWater > 0;
        };
        CropBaseMushroom.prototype.getGrowthDuration = function (tileentity) {
            return 200;
        };
        return CropBaseMushroom;
    }(Agriculture.CropCard));
    Agriculture.CropBaseMushroom = CropBaseMushroom;
})(Agriculture || (Agriculture = {}));
/// <reference path="../../../CropCard/CropCard.ts" />
/// <reference path="../../../CropCard/SeedBagStackData.ts" />
/// <reference path="../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../CropTile/ICropTileEntity.ts" />
var Agriculture;
(function (Agriculture) {
    var CropVanilla = /** @class */ (function (_super) {
        __extends(CropVanilla, _super);
        function CropVanilla() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropVanilla.prototype.getDiscoveredBy = function () {
            return "Notch";
        };
        CropVanilla.prototype.getProduct = function () {
            return { id: 0, count: 1, data: 0 };
        };
        CropVanilla.prototype.canGrow = function (tileentity) {
            var light = tileentity.region.getLightLevel(tileentity.x, tileentity.y, tileentity.z);
            return tileentity.data.currentSize < tileentity.crop.getMaxSize() && light >= 9;
        };
        CropVanilla.prototype.getGain = function (te) {
            return te.crop.getProduct();
        };
        CropVanilla.prototype.getSeeds = function (te) {
            if (te.data.statGain <= 1 && te.data.statGrowth <= 1 && te.data.statResistance <= 1) {
                // TODO check reqursion
                return this.getSeed(te);
                // return AgricultureAPI.abstractFunctions["CropVanilla"].getSeed();
            }
            return _super.prototype.getSeeds.call(this, te);
            // return AgricultureAPI.abstractFunctions["IC2CropCard"].getSeeds(te);
        };
        return CropVanilla;
    }(Agriculture.CropCard));
    Agriculture.CropVanilla = CropVanilla;
})(Agriculture || (Agriculture = {}));
/// <reference path="../../../../CropCard/CropCard.ts" />
/// <reference path="../../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../../CropTile/ICropTileEntity.ts" />
var Agriculture;
(function (Agriculture) {
    var CropBaseMetalCommon = /** @class */ (function (_super) {
        __extends(CropBaseMetalCommon, _super);
        function CropBaseMetalCommon(id, attributes, requirements, gain) {
            var _this = _super.call(this) || this;
            _this.id = id;
            _this.attributes = attributes;
            _this.requirements = requirements;
            _this.gain = gain;
            return _this;
        }
        CropBaseMetalCommon.prototype.getID = function () {
            return this.id;
        };
        CropBaseMetalCommon.prototype.getAttributes = function () {
            return this.attributes;
        };
        CropBaseMetalCommon.prototype.getProperties = function () {
            return {
                tier: 6,
                chemistry: 2,
                consumable: 0,
                defensive: 0,
                colorful: 1,
                weed: 0
            };
        };
        CropBaseMetalCommon.prototype.getMaxSize = function () {
            return 4;
        };
        CropBaseMetalCommon.prototype.getOptimalHarvestSize = function () {
            return this.getMaxSize();
        };
        CropBaseMetalCommon.prototype.getRootsLength = function (te) {
            return 5;
        };
        CropBaseMetalCommon.prototype.getCropRootsRequirement = function () {
            return this.requirements;
        };
        CropBaseMetalCommon.prototype.canGrow = function (tileentity) {
            if (tileentity.data.currentSize < 3)
                return true;
            if (tileentity.data.currentSize == 3) {
                // TODO check it
                if (!this.getCropRootsRequirement() || this.getCropRootsRequirement().length > 0) {
                    return true;
                }
                for (var _i = 0, _a = this.getCropRootsRequirement(); _i < _a.length; _i++) {
                    var id = _a[_i];
                    if (tileentity.isBlockBelow(id))
                        return true;
                }
            }
            return false;
        };
        CropBaseMetalCommon.prototype.getDropGainChance = function (te) {
            return _super.prototype.getDropGainChance.call(this, te) / 2;
        };
        CropBaseMetalCommon.prototype.getGrowthDuration = function (tileentity) {
            if (tileentity.data.currentSize == 3) {
                return 2000;
            }
            return 800;
        };
        CropBaseMetalCommon.prototype.getSizeAfterHarvest = function (tileentity) {
            return 2;
        };
        CropBaseMetalCommon.prototype.getGain = function (tileentity) {
            return this.gain;
        };
        return CropBaseMetalCommon;
    }(Agriculture.CropCard));
    Agriculture.CropBaseMetalCommon = CropBaseMetalCommon;
})(Agriculture || (Agriculture = {}));
/// <reference path="../../../../CropCard/CropCard.ts" />
/// <reference path="../../../../CropCard/CropCardProperties.ts" />
/// <reference path="../../../../CropTile/ICropTileEntity.ts" />
var Agriculture;
(function (Agriculture) {
    var CropBaseMetalUncommon = /** @class */ (function (_super) {
        __extends(CropBaseMetalUncommon, _super);
        function CropBaseMetalUncommon() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropBaseMetalUncommon.prototype.getProperties = function () {
            return __assign(__assign({}, _super.prototype.getProperties.call(this)), { colorful: 2 });
        };
        CropBaseMetalUncommon.prototype.getMaxSize = function () {
            return 5;
        };
        CropBaseMetalUncommon.prototype.canGrow = function (tileentity) {
            if (tileentity.data.currentSize < 4)
                return true;
            if (tileentity.data.currentSize == 4) {
                if (!this.getCropRootsRequirement() || this.getCropRootsRequirement().length > 0) {
                    return true;
                }
                for (var _i = 0, _a = this.getCropRootsRequirement(); _i < _a.length; _i++) {
                    var id = _a[_i];
                    if (tileentity.isBlockBelow(id))
                        return true;
                }
            }
            return false;
        };
        CropBaseMetalUncommon.prototype.getDropGainChance = function () {
            return Math.pow(0.95, this.getProperties().tier);
        };
        CropBaseMetalUncommon.prototype.getGrowthDuration = function (tileentity) {
            if (tileentity.data.currentSize == 4) {
                return 2200;
            }
            return 750;
        };
        return CropBaseMetalUncommon;
    }(Agriculture.CropBaseMetalCommon));
    Agriculture.CropBaseMetalUncommon = CropBaseMetalUncommon;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropVenomilia = /** @class */ (function (_super) {
        __extends(CropVenomilia, _super);
        function CropVenomilia() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropVenomilia.prototype.getID = function () {
            return "venomilia";
        };
        CropVenomilia.prototype.getAttributes = function () {
            return ["Purple", "Flower", "Tulip", "Poison"];
        };
        CropVenomilia.prototype.getProperties = function () {
            return {
                tier: 3,
                chemistry: 3,
                consumable: 1,
                defensive: 3,
                colorful: 3,
                weed: 3
            };
        };
        CropVenomilia.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { addToCreative: false });
        };
        CropVenomilia.prototype.getMaxSize = function () {
            return 6;
        };
        CropVenomilia.prototype.getOptimalHarvestSize = function () {
            return 4;
        };
        CropVenomilia.prototype.getDiscoveredBy = function () {
            return "raGan";
        };
        CropVenomilia.prototype.canGrow = function (te) {
            var light = te.region.getLightLevel(te);
            return (te.data.currentSize <= 4 && light >= 12) || te.data.currentSize == 5;
        };
        CropVenomilia.prototype.canBeHarvested = function (te) {
            return te.data.currentSize >= 4;
        };
        CropVenomilia.prototype.getGain = function (te) {
            if (te.data.currentSize == 5) {
                return new ItemStack(ItemID.grinPowder, 1, 0);
            }
            if (te.data.currentSize >= 4) {
                return IDConverter.getStack("purple_dye", 1);
            }
            return null;
        };
        CropVenomilia.prototype.getSizeAfterHarvest = function (tileentity) {
            return 3;
        };
        CropVenomilia.prototype.getGrowthDuration = function (te) {
            if (te.data.currentSize >= 3)
                return 600;
            return 400;
        };
        CropVenomilia.prototype.onRightClick = function (te, entity) {
            if (Entity.getCarriedItem(entity).id != 0) {
                return this.onEntityCollision(te, entity);
            }
            return te.performManualHarvest();
        };
        CropVenomilia.prototype.onLeftClick = function (te, entity) {
            if (Entity.getCarriedItem(entity).id != 0) {
                this.onEntityCollision(te, entity);
            }
            return te.pick();
        };
        CropVenomilia.prototype.onEntityCollision = function (te, entity) {
            if (te.data.currentSize == 5) {
                var armorSlot = new PlayerEntity(entity).getArmor(3);
                if (MathUtil.randomInt(0, 50) && armorSlot.id != 0) {
                    return _super.prototype.onEntityCollision.call(this, te, entity);
                }
                Entity.addEffect(entity, PotionEffect.poison, 1, (MathUtil.randomInt(0, 10) + 5) * 20);
                te.data.currentSize = 4;
                te.updateRender();
            }
            return _super.prototype.onEntityCollision.call(this, te, entity);
        };
        CropVenomilia.prototype.isWeed = function (te) {
            return te.data.currentSize == 5 && te.data.statGrowth >= 8;
        };
        return CropVenomilia;
    }(Agriculture.CropCard));
    Agriculture.CropVenomilia = CropVenomilia;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropWeed = /** @class */ (function (_super) {
        __extends(CropWeed, _super);
        function CropWeed() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropWeed.prototype.getID = function () {
            return "weed";
        };
        CropWeed.prototype.getAttributes = function () {
            return ["Weed", "Bad"];
        };
        CropWeed.prototype.getProperties = function () {
            return {
                tier: 0,
                chemistry: 0,
                consumable: 0,
                defensive: 1,
                colorful: 0,
                weed: 5
            };
        };
        CropWeed.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { addToCreative: false });
        };
        CropWeed.prototype.getGain = function (te) {
            return null;
        };
        CropWeed.prototype.onLeftClick = function (te, player) {
            return false;
        };
        CropWeed.prototype.canBeHarvested = function (te) {
            return false;
        };
        CropWeed.prototype.onEntityCollision = function (te, entity) {
            return false;
        };
        return CropWeed;
    }(Agriculture.CropCard));
    Agriculture.CropWeed = CropWeed;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropHops = /** @class */ (function (_super) {
        __extends(CropHops, _super);
        function CropHops() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropHops.prototype.getID = function () {
            return "hops";
        };
        CropHops.prototype.getAttributes = function () {
            return ["Green", "Ingredient", "Wheat"];
        };
        CropHops.prototype.getDiscoveredBy = function () {
            return "Snoochy";
        };
        CropHops.prototype.getProperties = function () {
            return {
                tier: 5,
                chemistry: 2,
                consumable: 2,
                defensive: 0,
                colorful: 1,
                weed: 1
            };
        };
        CropHops.prototype.getMaxSize = function () {
            return 7;
        };
        CropHops.prototype.canGrow = function (te) {
            var light = te.region.getLightLevel(te);
            return te.data.currentSize < 7 && light >= 9;
        };
        CropHops.prototype.getGrowthDuration = function (te) {
            return 600;
        };
        CropHops.prototype.canBeHarvested = function (te) {
            return te.data.currentSize >= 4;
        };
        CropHops.prototype.getGain = function (te) {
            // TODO check hops count
            return new ItemStack(ItemID.hops, 1, 0);
        };
        CropHops.prototype.getSizeAfterHarvest = function (te) {
            return 3;
        };
        return CropHops;
    }(Agriculture.CropCard));
    Agriculture.CropHops = CropHops;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropEatingplant = /** @class */ (function (_super) {
        __extends(CropEatingplant, _super);
        function CropEatingplant() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropEatingplant.prototype.getID = function () {
            return "eatingplant";
        };
        CropEatingplant.prototype.getAttributes = function () {
            return ["Bad", "Food"];
        };
        CropEatingplant.prototype.getDiscoveredBy = function () {
            return "Hasudako";
        };
        CropEatingplant.prototype.getProperties = function () {
            return {
                tier: 6,
                chemistry: 1,
                consumable: 1,
                defensive: 3,
                colorful: 1,
                weed: 4
            };
        };
        CropEatingplant.prototype.getMaxSize = function () {
            return 6;
        };
        CropEatingplant.prototype.getOptimalHarvestSize = function (te) {
            return 4;
        };
        CropEatingplant.prototype.canGrow = function (te) {
            var light = te.region.getLightLevel(te);
            if (te.data.currentSize < 3) {
                return light > 10;
            }
            return te.isBlockBelow(10) && te.data.currentSize < this.getMaxSize() && light > 10;
        };
        CropEatingplant.prototype.canBeHarvested = function (te) {
            return te.data.currentSize >= 4 && te.data.currentSize < 6;
        };
        CropEatingplant.prototype.getGain = function (te) {
            if (te.data.currentSize >= 4 && te.data.currentSize < 6) {
                return { id: 81, count: 1, data: 0 };
            }
            return null;
        };
        CropEatingplant.prototype.tick = function (te) {
            if (te.data.currentSize == 1)
                return;
            var entity = Entity.findNearest({ x: te.x + .5, y: te.y + .5, z: te.z + .5 }, null, 2);
            if (!entity)
                return;
            Entity.damageEntity(entity, te.data.currentSize * 2);
            if (EntityHelper.isPlayer(entity) && !this.hasMetalArmor(entity)) {
                Entity.addEffect(entity, PotionEffect.poison, 1, 50);
            }
            if (te.crop.canGrow(te))
                te.data.growthPoints += 100;
            World.drop(te.x + .5, te.y + .5, te.z + .5, 367, 1, 0);
        };
        CropEatingplant.prototype.hasMetalArmor = function (player) {
            for (var i = 0; i < 4; i++) {
                var armorSlot = new PlayerEntity(player).getArmor(i);
                if (armorSlot.id > 297 && armorSlot.id < 302)
                    return false;
            }
            return true;
        };
        CropEatingplant.prototype.getGrowthDuration = function (te) {
            var multiplier = 1;
            //TODO: compare with PC version when BiomeDictionary will be available
            return Math.round(_super.prototype.getGrowthDuration.call(this, te) * multiplier);
        };
        CropEatingplant.prototype.getSizeAfterHarvest = function (te) {
            return 1;
        };
        CropEatingplant.prototype.getRootsLength = function (te) {
            return 5;
        };
        return CropEatingplant;
    }(Agriculture.CropCard));
    Agriculture.CropEatingplant = CropEatingplant;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropTerraWart = /** @class */ (function (_super) {
        __extends(CropTerraWart, _super);
        function CropTerraWart() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropTerraWart.prototype.getID = function () {
            return "nether_wart";
        };
        CropTerraWart.prototype.getAttributes = function () {
            return ["Blue", "Aether", "Consumable", "Snow"];
        };
        CropTerraWart.prototype.getProperties = function () {
            return {
                tier: 5,
                chemistry: 2,
                consumable: 4,
                defensive: 0,
                colorful: 3,
                weed: 0
            };
        };
        CropTerraWart.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: "ItemID.terraWart" });
        };
        CropTerraWart.prototype.getMaxSize = function () {
            return 3;
        };
        CropTerraWart.prototype.getDropGainChance = function (te) {
            return .8;
        };
        CropTerraWart.prototype.getGain = function (te) {
            return { id: ItemID.terraWart, count: 1, data: 0 };
        };
        CropTerraWart.prototype.tick = function (te) {
            if (te.isBlockBelow(80)) {
                if (te.crop.canGrow(te)) {
                    te.data.growthPoints += 100;
                }
            }
            else if (te.isBlockBelow(88) && Math.random() < 1 / 300) {
                te.data.crop = Agriculture.CropCardManager.getIndexByCropCardID("nether_wart");
                te.crop = Agriculture.CropCardManager.getCardFromID("nether_wart");
            }
        };
        return CropTerraWart;
    }(Agriculture.CropCard));
    Agriculture.CropTerraWart = CropTerraWart;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropRedWheat = /** @class */ (function (_super) {
        __extends(CropRedWheat, _super);
        function CropRedWheat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropRedWheat.prototype.getID = function () {
            return "redwheat";
        };
        CropRedWheat.prototype.getAttributes = function () {
            return ["Red", "Redstone", "Wheat"];
        };
        CropRedWheat.prototype.getDiscoveredBy = function () {
            return "raa1337";
        };
        CropRedWheat.prototype.getProperties = function () {
            return {
                tier: 6,
                chemistry: 3,
                consumable: 0,
                defensive: 0,
                colorful: 2,
                weed: 0
            };
        };
        CropRedWheat.prototype.getMaxSize = function () {
            return 7;
        };
        CropRedWheat.prototype.getOptimalHarvestSize = function (te) {
            return this.getMaxSize();
        };
        CropRedWheat.prototype.canGrow = function (te) {
            var light = te.region.getLightLevel(te);
            return te.data.currentSize < 7 && light <= 10 && light >= 5;
        };
        CropRedWheat.prototype.getDropGainChance = function (te) {
            return .5;
        };
        CropRedWheat.prototype.getGain = function (te) {
            return new ItemStack(Math.random() < 0.5 ? 331 : 295, 1, 0);
        };
        CropRedWheat.prototype.getGrowthDuration = function (te) {
            return 600;
        };
        CropRedWheat.prototype.getSizeAfterHarvest = function (te) {
            return 2;
        };
        return CropRedWheat;
    }(Agriculture.CropCard));
    Agriculture.CropRedWheat = CropRedWheat;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropStickreed = /** @class */ (function (_super) {
        __extends(CropStickreed, _super);
        function CropStickreed() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropStickreed.prototype.getID = function () {
            return "stickreed";
        };
        CropStickreed.prototype.getAttributes = function () {
            return ["Reed", "Resin"];
        };
        CropStickreed.prototype.getDiscoveredBy = function () {
            return "raa1337";
        };
        CropStickreed.prototype.getProperties = function () {
            return {
                tier: 2,
                chemistry: 0,
                consumable: 0,
                defensive: 2,
                colorful: 0,
                weed: 2
            };
        };
        CropStickreed.prototype.getMaxSize = function () {
            return 4;
        };
        CropStickreed.prototype.getOptimalHarvestSize = function (te) {
            return 4;
        };
        CropStickreed.prototype.canGrow = function (te) {
            return te.data.currentSize < this.getMaxSize();
        };
        CropStickreed.prototype.canBeHarvested = function (te) {
            return te.data.currentSize > 1;
        };
        CropStickreed.prototype.getGain = function (te) {
            if (te.data.currentSize <= 3) {
                return new ItemStack(338, te.data.currentSize - 1, 0);
            }
            return new ItemStack(ItemID.latex, 1, 0);
        };
        CropStickreed.prototype.getSizeAfterHarvest = function (te) {
            return 1;
        };
        CropStickreed.prototype.onEntityCollision = function (te, entity) { return false; };
        CropStickreed.prototype.getGrowthDuration = function (te) {
            if (te.data.currentSize == 4)
                return 400;
            return 100;
        };
        return CropStickreed;
    }(Agriculture.CropCard));
    Agriculture.CropStickreed = CropStickreed;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropCoffee = /** @class */ (function (_super) {
        __extends(CropCoffee, _super);
        function CropCoffee() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropCoffee.prototype.getID = function () {
            return "coffee";
        };
        CropCoffee.prototype.getAttributes = function () {
            return ["Leaves", "Ingredient", "Beans"];
        };
        CropCoffee.prototype.getDiscoveredBy = function () {
            return "Snoochy";
        };
        CropCoffee.prototype.getProperties = function () {
            return {
                tier: 7,
                chemistry: 1,
                consumable: 4,
                defensive: 1,
                colorful: 2,
                weed: 0
            };
        };
        CropCoffee.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: "ItemID.coffeeBeans" });
        };
        CropCoffee.prototype.getMaxSize = function () {
            return 5;
        };
        CropCoffee.prototype.canGrow = function (te) {
            var light = te.region.getLightLevel(te);
            return te.data.currentSize < 5 && light >= 9;
        };
        CropCoffee.prototype.getGrowthDuration = function (te) {
            if (te.data.currentSize == 3) {
                return Math.round(_super.prototype.getGrowthDuration.call(this, te) * .5);
            }
            else if (te.data.currentSize == 4) {
                return Math.round(_super.prototype.getGrowthDuration.call(this, te) * 1.5);
            }
            return _super.prototype.getGrowthDuration.call(this, te);
        };
        CropCoffee.prototype.canBeHarvested = function (te) {
            return te.data.currentSize >= 4;
        };
        CropCoffee.prototype.getGain = function (te) {
            if (te.data.currentSize == 4)
                return null;
            return new ItemStack(ItemID.coffeeBeans, 1, 0);
        };
        CropCoffee.prototype.getSizeAfterHarvest = function (te) {
            return 3;
        };
        return CropCoffee;
    }(Agriculture.CropCard));
    Agriculture.CropCoffee = CropCoffee;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropCarrots = /** @class */ (function (_super) {
        __extends(CropCarrots, _super);
        function CropCarrots() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropCarrots.prototype.getID = function () {
            return "carrots";
        };
        CropCarrots.prototype.getTexture = function () {
            return "ic2_carrots";
        };
        CropCarrots.prototype.getAttributes = function () {
            return ["Orange", "Food", "Carrots"];
        };
        CropCarrots.prototype.getProperties = function () {
            return {
                tier: 2,
                chemistry: 0,
                consumable: 4,
                defensive: 0,
                colorful: 0,
                weed: 2
            };
        };
        CropCarrots.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaItemID.carrot });
        };
        CropCarrots.prototype.getMaxSize = function () {
            return 3;
        };
        CropCarrots.prototype.getProduct = function () {
            return { id: VanillaItemID.carrot, count: 1, data: 0 };
        };
        CropCarrots.prototype.getSeed = function (te) {
            return this.getProduct();
        };
        return CropCarrots;
    }(Agriculture.CropVanilla));
    Agriculture.CropCarrots = CropCarrots;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    // TODO check base card with potato
    var CropPotato = /** @class */ (function (_super) {
        __extends(CropPotato, _super);
        function CropPotato() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropPotato.prototype.getID = function () {
            return "potato";
        };
        CropPotato.prototype.getAttributes = function () {
            return ["Yellow", "Food", "Potato"];
        };
        CropPotato.prototype.getProperties = function () {
            return {
                tier: 2,
                chemistry: 0,
                consumable: 4,
                defensive: 0,
                colorful: 0,
                weed: 2
            };
        };
        CropPotato.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaItemID.potato });
        };
        CropPotato.prototype.getMaxSize = function () {
            return 4;
        };
        // TODO rewrite to get base IC2Card canGrow
        CropPotato.prototype.canGrow = function (te) {
            return te.data.currentSize < te.crop.getMaxSize();
        };
        CropPotato.prototype.getOptimalHarvestSize = function (te) {
            return 3;
        };
        CropPotato.prototype.canBeHarvested = function (te) {
            return te.data.currentSize >= this.getOptimalHarvestSize(te);
        };
        CropPotato.prototype.getGain = function (te) {
            if (te.data.currentSize >= 4 && Math.random() < 0.05) {
                return { id: VanillaItemID.poisonous_potato, count: 1, data: 0 };
            }
            else if (te.data.currentSize >= 3) {
                return { id: VanillaItemID.potato, count: 1, data: 0 };
            }
            return null;
        };
        CropPotato.prototype.getSeed = function (te) {
            // TODO check seed of CropPotato
            return { id: 0, count: 1, data: 0 };
        };
        CropPotato.prototype.getSizeAfterHarvest = function (tileentity) {
            return 1;
        };
        return CropPotato;
    }(Agriculture.CropVanilla));
    Agriculture.CropPotato = CropPotato;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropWheat = /** @class */ (function (_super) {
        __extends(CropWheat, _super);
        function CropWheat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropWheat.prototype.getID = function () {
            return "wheat";
        };
        CropWheat.prototype.getTexture = function () {
            return "ic2_wheat";
        };
        CropWheat.prototype.getAttributes = function () {
            return ["Yellow", "Food", "Wheat"];
        };
        CropWheat.prototype.getProperties = function () {
            return {
                tier: 1,
                chemistry: 0,
                consumable: 4,
                defensive: 0,
                colorful: 0,
                weed: 2
            };
        };
        CropWheat.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaItemID.wheat_seeds });
        };
        CropWheat.prototype.getMaxSize = function () {
            return 7;
        };
        CropWheat.prototype.getSizeAfterHarvest = function (tileentity) {
            return 2;
        };
        CropWheat.prototype.getProduct = function () {
            return IDConverter.getStack("wheat");
        };
        CropWheat.prototype.getSeed = function (te) {
            return { id: VanillaItemID.wheat_seeds, count: 1, data: 0 };
        };
        return CropWheat;
    }(Agriculture.CropVanilla));
    Agriculture.CropWheat = CropWheat;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropNetherWart = /** @class */ (function (_super) {
        __extends(CropNetherWart, _super);
        function CropNetherWart() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropNetherWart.prototype.getID = function () {
            return "nether_wart";
        };
        CropNetherWart.prototype.getTexture = function () {
            return "ic2_nether_wart";
        };
        CropNetherWart.prototype.getDiscoveredBy = function () {
            return "Notch";
        };
        CropNetherWart.prototype.getAttributes = function () {
            return ["Red", "Nether", "Ingredient", "Soulsand"];
        };
        CropNetherWart.prototype.getProperties = function () {
            return {
                tier: 5,
                chemistry: 4,
                consumable: 2,
                defensive: 0,
                colorful: 2,
                weed: 1
            };
        };
        CropNetherWart.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), IDConverter.getIDData("nether_wart"));
        };
        CropNetherWart.prototype.getMaxSize = function () {
            return 3;
        };
        CropNetherWart.prototype.getDropGainChance = function (te) {
            return 2;
        };
        CropNetherWart.prototype.getGain = function (te) {
            return IDConverter.getStack("nether_wart");
        };
        CropNetherWart.prototype.tick = function (te) {
            if (te.isBlockBelow(88)) {
                if (te.crop.canGrow(te)) {
                    te.data.growthPoints += 100;
                }
            }
            else if (te.isBlockBelow(80) && Math.random() < 1 / 300) {
                te.data.crop = Agriculture.CropCardManager.getIndexByCropCardID("terra_wart");
                te.crop = Agriculture.CropCardManager.getCardFromID("terra_wart");
            }
        };
        return CropNetherWart;
    }(Agriculture.CropCard));
    Agriculture.CropNetherWart = CropNetherWart;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropMelon = /** @class */ (function (_super) {
        __extends(CropMelon, _super);
        function CropMelon() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropMelon.prototype.getID = function () {
            return "melon";
        };
        CropMelon.prototype.getAttributes = function () {
            return ["Green", "Food", "Stem"];
        };
        CropMelon.prototype.getProperties = function () {
            return {
                tier: 2,
                chemistry: 0,
                consumable: 4,
                defensive: 0,
                colorful: 2,
                weed: 0
            };
        };
        CropMelon.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaItemID.melon_seeds });
        };
        CropMelon.prototype.getMaxSize = function () {
            return 4;
        };
        CropMelon.prototype.getSizeAfterHarvest = function (tileentity) {
            return this.getMaxSize() - 1;
        };
        CropMelon.prototype.getProduct = function () {
            if (Math.random() < 0.5) {
                return { id: VanillaBlockID.melon_block, count: 1, data: 0 };
            }
            return IDConverter.getStack("melon_slice", MathUtil.randomInt(2, 6));
        };
        CropMelon.prototype.getSeed = function (te) {
            return { id: VanillaItemID.melon_seeds, count: MathUtil.randomInt(1, 3), data: 0 };
        };
        CropMelon.prototype.getGrowthDuration = function (te) {
            if (te.data.currentSize == 3) {
                return 700;
            }
            return 250;
        };
        return CropMelon;
    }(Agriculture.CropVanilla));
    Agriculture.CropMelon = CropMelon;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropBeetroots = /** @class */ (function (_super) {
        __extends(CropBeetroots, _super);
        function CropBeetroots() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropBeetroots.prototype.getID = function () {
            return "beetroots";
        };
        CropBeetroots.prototype.getAttributes = function () {
            return ["Red", "Food", "Beetroot"];
        };
        CropBeetroots.prototype.getProperties = function () {
            return {
                tier: 1,
                chemistry: 0,
                consumable: 4,
                defensive: 0,
                colorful: 1,
                weed: 2
            };
        };
        CropBeetroots.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaItemID.beetroot_seeds });
        };
        CropBeetroots.prototype.getMaxSize = function () {
            return 4;
        };
        CropBeetroots.prototype.getSeed = function (te) {
            return { id: VanillaItemID.beetroot_seeds, count: 1, data: 0 };
        };
        CropBeetroots.prototype.getProduct = function () {
            return IDConverter.getStack("beetroot");
        };
        return CropBeetroots;
    }(Agriculture.CropVanilla));
    Agriculture.CropBeetroots = CropBeetroots;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropReed = /** @class */ (function (_super) {
        __extends(CropReed, _super);
        function CropReed() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropReed.prototype.getID = function () {
            return "reed";
        };
        CropReed.prototype.getAttributes = function () {
            return ["Reed"];
        };
        CropReed.prototype.getDiscoveredBy = function () {
            return "Notch";
        };
        CropReed.prototype.getProperties = function () {
            return {
                tier: 2,
                chemistry: 0,
                consumable: 0,
                defensive: 2,
                colorful: 0,
                weed: 2
            };
        };
        CropReed.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaBlockID.reeds, size: 1, growth: 3, gain: 0, resistance: 2 });
        };
        CropReed.prototype.getMaxSize = function () {
            return 3;
        };
        CropReed.prototype.canBeHarvested = function (te) {
            return te.data.currentSize > 1;
        };
        CropReed.prototype.getGain = function (te) {
            return IDConverter.getStack("reeds", te.data.currentSize - 1);
        };
        CropReed.prototype.onEntityCollision = function (te, entity) { return false; };
        CropReed.prototype.getGrowthDuration = function (te) {
            return 200;
        };
        return CropReed;
    }(Agriculture.CropCard));
    Agriculture.CropReed = CropReed;
})(Agriculture || (Agriculture = {}));
/// <reference path="../BaseCards/CropVanilla.ts"/>
var Agriculture;
(function (Agriculture) {
    var CropPumpkin = /** @class */ (function (_super) {
        __extends(CropPumpkin, _super);
        function CropPumpkin() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropPumpkin.prototype.getID = function () {
            return "pumpkin";
        };
        CropPumpkin.prototype.getAttributes = function () {
            return ["Orange", "Decoration", "Stem"];
        };
        CropPumpkin.prototype.getProperties = function () {
            return {
                tier: 1,
                chemistry: 0,
                consumable: 1,
                defensive: 0,
                colorful: 3,
                weed: 1
            };
        };
        CropPumpkin.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaItemID.pumpkin_seeds });
        };
        CropPumpkin.prototype.getMaxSize = function () {
            return 4;
        };
        CropPumpkin.prototype.getSizeAfterHarvest = function (tileentity) {
            return this.getMaxSize() - 1;
        };
        CropPumpkin.prototype.getProduct = function () {
            return { id: VanillaBlockID.pumpkin, count: 1, data: 0 };
        };
        CropPumpkin.prototype.getSeed = function (te) {
            return { id: VanillaItemID.pumpkin_seeds, count: MathUtil.randomInt(1, 4), data: 0 };
        };
        CropPumpkin.prototype.getGrowthDuration = function (te) {
            if (te.data.currentSize == 3)
                return 600;
            return 200;
        };
        return CropPumpkin;
    }(Agriculture.CropVanilla));
    Agriculture.CropPumpkin = CropPumpkin;
})(Agriculture || (Agriculture = {}));
var Agriculture;
(function (Agriculture) {
    var CropCocoa = /** @class */ (function (_super) {
        __extends(CropCocoa, _super);
        function CropCocoa() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropCocoa.prototype.getID = function () {
            return "cocoa";
        };
        CropCocoa.prototype.getTexture = function () {
            return "ic2_cocoa";
        };
        CropCocoa.prototype.getAttributes = function () {
            return ["Brown", "Food", "Stem"];
        };
        CropCocoa.prototype.getProperties = function () {
            return {
                tier: 3,
                chemistry: 1,
                consumable: 3,
                defensive: 0,
                colorful: 4,
                weed: 0
            };
        };
        CropCocoa.prototype.getBaseSeed = function () {
            return __assign(__assign(__assign({}, _super.prototype.getBaseSeed.call(this)), IDConverter.getIDData("cocoa_beans")), { size: 1, growth: 0, gain: 0, resistance: 0 });
        };
        CropCocoa.prototype.getMaxSize = function () {
            return 4;
        };
        CropCocoa.prototype.getOptimalHarvestSize = function (te) {
            return 4;
        };
        CropCocoa.prototype.canGrow = function (te) {
            return te.data.currentSize <= 3 && te.data.storageNutrients >= 3;
        };
        CropCocoa.prototype.canBeHarvested = function (te) {
            return te.data.currentSize == this.getMaxSize();
        };
        CropCocoa.prototype.getGain = function (te) {
            return IDConverter.getStack("cocoa_beans");
        };
        CropCocoa.prototype.getGrowthDuration = function (te) {
            if (te.data.currentSize == 3) {
                return 900;
            }
            return 400;
        };
        CropCocoa.prototype.getSizeAfterHarvest = function (tileentity) {
            return 3;
        };
        return CropCocoa;
    }(Agriculture.CropCard));
    Agriculture.CropCocoa = CropCocoa;
})(Agriculture || (Agriculture = {}));
/// <reference path="../../CropCards/BaseCards/CropBaseMushroom.ts"/>
var Agriculture;
(function (Agriculture) {
    // TODO make only base constructor like a flowers
    var CropRedMushroom = /** @class */ (function (_super) {
        __extends(CropRedMushroom, _super);
        function CropRedMushroom() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropRedMushroom.prototype.getID = function () {
            return "red_mushroom";
        };
        CropRedMushroom.prototype.getAttributes = function () {
            return ["Red", "Food", "Mushroom"];
        };
        CropRedMushroom.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaBlockID.red_mushroom });
        };
        CropRedMushroom.prototype.getGain = function (te) {
            return IDConverter.getStack("red_mushroom");
        };
        return CropRedMushroom;
    }(Agriculture.CropBaseMushroom));
    Agriculture.CropRedMushroom = CropRedMushroom;
})(Agriculture || (Agriculture = {}));
/// <reference path="../../CropCards/BaseCards/CropBaseMushroom.ts"/>
var Agriculture;
(function (Agriculture) {
    // TODO make only base constructor like a flowers
    var CropBrownMushroom = /** @class */ (function (_super) {
        __extends(CropBrownMushroom, _super);
        function CropBrownMushroom() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CropBrownMushroom.prototype.getID = function () {
            return "brown_mushroom";
        };
        CropBrownMushroom.prototype.getAttributes = function () {
            return ["Brown", "Food", "Mushroom"];
        };
        CropBrownMushroom.prototype.getBaseSeed = function () {
            return __assign(__assign({}, _super.prototype.getBaseSeed.call(this)), { id: VanillaBlockID.brown_mushroom });
        };
        CropBrownMushroom.prototype.getGain = function (te) {
            return { id: VanillaBlockID.brown_mushroom, count: 1, data: 0 };
        };
        return CropBrownMushroom;
    }(Agriculture.CropBaseMushroom));
    Agriculture.CropBrownMushroom = CropBrownMushroom;
})(Agriculture || (Agriculture = {}));
/// <reference path="./CropCards/Basic/CropWeed.ts"/>
/// <reference path="./CropCards/Basic/CropVenomilia.ts"/>
/// <reference path="./CropCards/Basic/CropTerraWart.ts"/>
/// <reference path="./CropCards/Basic/CropRedWheat.ts"/>
/// <reference path="./CropCards/Basic/CropStickreed.ts"/>
/// <reference path="./CropCards/Basic/CropCoffee.ts"/>
/// <reference path="./CropCards/Basic/CropHops.ts"/>
/// <reference path="./CropCards/Basic/CropEatingplant.ts"/>
/// <reference path="./CropCards/Vanilla/CropWheat.ts"/>
/// <reference path="./CropCards/Vanilla/CropPumpkin.ts"/>
/// <reference path="./CropCards/Vanilla/CropCocoa.ts"/>
/// <reference path="./CropCards/Vanilla/CropPotato.ts"/>
/// <reference path="./CropCards/Vanilla/CropMelon.ts"/>
/// <reference path="./CropCards/Vanilla/CropReed.ts"/>
/// <reference path="./CropCards/Vanilla/CropReed.ts"/>
/// <reference path="./CropCards/Vanilla/CropCarrots.ts"/>
/// <reference path="./CropCards/Vanilla/CropBeetroots.ts"/>
/// <reference path="./CropCards/Vanilla/CropNetherWart.ts"/>
/// <reference path="./CropCards/Mushroom/CropRedMushroom.ts"/>
/// <reference path="./CropCards/Mushroom/CropBrownMushroom.ts"/>
/// <reference path="./CropCards/BaseCards/CropColorFlowerCard.ts"/>
/// <reference path="./CropCards/BaseCards/Metal/CropBaseMetalCommon.ts"/>
/// <reference path="./CropCards/BaseCards/Metal/CropBaseMetalUncommon.ts"/>
var Agriculture;
(function (Agriculture) {
    // Basic
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropWeed());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropVenomilia());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropStickreed());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropTerraWart());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropRedWheat());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropCoffee());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropHops());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropEatingplant());
    // Vanilla
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropWheat());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropPotato());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropPumpkin());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropCarrots());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBeetroots());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropMelon());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropReed());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropCocoa());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropNetherWart());
    // Mushroom
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropRedMushroom());
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBrownMushroom());
    // Flowers
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropColorFlowerCard("dandelion", ["Yellow", "Flower"], IDConverter.getStack("yellow_dye"), {
        id: VanillaBlockID.yellow_flower,
        size: 4,
        growth: 1,
        gain: 1,
        resistance: 1,
        addToCreative: true
    }));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropColorFlowerCard("rose", ["Red", "Flower", "Rose"], IDConverter.getStack("red_dye"), {
        id: VanillaBlockID.red_flower,
        size: 4,
        growth: 1,
        gain: 1,
        resistance: 1,
        addToCreative: true
    }));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropColorFlowerCard("blackthorn", ["Black", "Flower", "Rose"], IDConverter.getStack("black_dye")));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropColorFlowerCard("tulip", ["Purple", "Flower", "Tulip"], IDConverter.getStack("purple_dye")));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropColorFlowerCard("cyazint", ["Blue", "Flower"], IDConverter.getStack("cyan_dye")));
    // Metal common
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBaseMetalCommon("ferru", ["Gray", "Leaves", "Metal"], [VanillaTileID.iron_ore, VanillaTileID.iron_block], { id: ItemID.dustSmallIron, count: 1, data: 0 }));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBaseMetalCommon("cyprium", ["Orange", "Leaves", "Metal"], [BlockID.blockCopper, BlockID.oreCopper], { id: ItemID.dustSmallCopper, count: 1, data: 0 }));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBaseMetalCommon("stagnium", ["Shiny", "Leaves", "Metal"], [BlockID.blockTin, BlockID.oreTin], { id: ItemID.dustSmallTin, count: 1, data: 0 }));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBaseMetalCommon("plumbiscus", ["Shiny", "Leaves", "Metal"], [BlockID.blockLead, BlockID.oreLead], { id: ItemID.dustSmallLead, count: 1, data: 0 }));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBaseMetalUncommon("aurelia", ["Gold", "Leaves", "Metal"], [VanillaTileID.gold_ore, VanillaTileID.gold_block], { id: VanillaItemID.gold_nugget, count: 1, data: 0 }));
    Agriculture.CropCardManager.registerCropCard(new Agriculture.CropBaseMetalUncommon("shining", ["Silver", "Leaves", "Metal"], [BlockID.blockSilver, BlockID.oreSilver], { id: ItemID.dustSmallSilver, count: 1, data: 0 }));
})(Agriculture || (Agriculture = {}));
var LaserShot = /** @class */ (function () {
    function LaserShot(player, pos, vel, params) {
        var _a, _b, _c, _d;
        var region = WorldRegion.getForActor(player);
        var entity = region.spawnEntity(pos.x + vel.x, pos.y + vel.y, pos.z + vel.z, EntityType.ARROW);
        Entity.setSkin(entity, "models/laser.png");
        Entity.setVelocity(entity, vel.x, vel.y, vel.z);
        this.player = player;
        this.entity = entity;
        this.region = region;
        this.startPos = pos;
        this.velocity = vel;
        this.power = params.power;
        this.range = (_a = params.range) !== null && _a !== void 0 ? _a : 64;
        this.blockBreaks = (_b = params.blockBreaks) !== null && _b !== void 0 ? _b : 128;
        this.smelt = (_c = params.smelt) !== null && _c !== void 0 ? _c : false;
        this.dropChance = (_d = params.dropChance) !== null && _d !== void 0 ? _d : 0.9;
        this.hitBlock = true;
    }
    LaserShot.prototype.destroyBlock = function (x, y, z, block) {
        var hardness = Block.getDestroyTime(block.id);
        this.power -= hardness / 1.5;
        if (this.power < 0)
            return;
        if (hardness > 0) {
            this.blockBreaks--;
        }
        var drop = this.region.breakBlockForResult(x, y, z, -1, new ItemStack(ItemID.iridiumDrill, 1, 0)).items;
        var material = ToolAPI.getBlockMaterialName(block.id);
        if (Math.random() < 0.5 && (material == "wood" || material == "plant" || material == "fibre" || material == "wool")) {
            this.region.setBlock(x, y, z, 51, 0);
        }
        for (var _i = 0, drop_1 = drop; _i < drop_1.length; _i++) {
            var item = drop_1[_i];
            if (this.smelt && material == "stone") {
                this.power = 0;
                var result = Recipes.getFurnaceRecipeResult(item.id, item.data);
                if (result) {
                    item.id = result.id;
                    item.data = result.data;
                }
                this.region.dropAtBlock(x, y, z, item);
            }
            else if (Math.random() < this.dropChance) {
                this.region.dropAtBlock(x, y, z, item);
            }
        }
    };
    LaserShot.prototype.checkBlock = function (x, y, z) {
        var block = World.getBlock(x, y, z);
        if (ToolAPI.getBlockMaterialName(block.id) == "unbreaking") {
            this.power = 0;
        }
        else if (block.id > 0 && block.id != 50 && block.id != 51) {
            this.destroyBlock(x, y, z, block);
        }
    };
    LaserShot.prototype.onProjectileHit = function (target) {
        if (this.power <= 0 || this.blockBreaks <= 0) {
            LaserShotProvider.removeShot(this);
        }
        if (target.coords) {
            Game.prevent();
            var c = target.coords;
            var block = World.getBlock(c.x, c.y, c.z);
            if (block.id != 7 && block.id != 120) {
                this.destroyBlock(c.x, c.y, c.z, block);
                this.hitBlock = true;
                var vel = this.velocity;
                Entity.setVelocity(this.entity, vel.x, vel.y, vel.z);
            }
            else {
                LaserShotProvider.removeShot(this);
            }
        }
        else {
            if (target.entity == this.player)
                return;
            var damage = this.power;
            if (damage > 0) {
                if (this.smelt)
                    damage *= 2;
                Entity.setFire(target.entity, 100, true);
                Entity.damageEntity(target.entity, damage, 3, { attacker: this.player });
            }
            LaserShotProvider.removeShot(this);
        }
    };
    return LaserShot;
}());
var LaserShotProvider;
(function (LaserShotProvider) {
    var laserShots = [];
    function shootLaser(player, pos, vel, params) {
        var laser = new LaserShot(player, pos, vel, params);
        laserShots.push(laser);
    }
    LaserShotProvider.shootLaser = shootLaser;
    function removeShot(laser) {
        var index = laserShots.indexOf(laser);
        if (index >= 0) {
            Entity.remove(laser.entity);
            laserShots.splice(index, 1);
        }
    }
    LaserShotProvider.removeShot = removeShot;
    function updateAll() {
        for (var i = 0; i < laserShots.length; i++) {
            var laser = laserShots[i];
            var distance = Entity.getDistanceBetweenCoords(Entity.getPosition(laser.entity), laser.startPos);
            if (laser.power <= 0 || laser.blockBreaks <= 0 || distance > laser.range) {
                Entity.remove(laser.entity);
                laserShots.splice(i, 1);
                i--;
            }
            else {
                if (laser.hitBlock) {
                    laser.hitBlock = false;
                }
                else {
                    laser.power -= 0.25;
                }
                var vel = laser.velocity;
                Entity.setVelocity(laser.entity, vel.x, vel.y, vel.z);
                var c = Entity.getPosition(laser.entity);
                laser.checkBlock(Math.floor(c.x), Math.floor(c.y), Math.floor(c.z));
            }
        }
    }
    LaserShotProvider.updateAll = updateAll;
    function onProjectileHit(projectile, target) {
        for (var _i = 0, laserShots_1 = laserShots; _i < laserShots_1.length; _i++) {
            var laser = laserShots_1[_i];
            if (laser.entity == projectile) {
                laser.onProjectileHit(target);
                break;
            }
        }
    }
    LaserShotProvider.onProjectileHit = onProjectileHit;
})(LaserShotProvider || (LaserShotProvider = {}));
Callback.addCallback("tick", function () {
    LaserShotProvider.updateAll();
});
Callback.addCallback("ProjectileHit", function (projectile, item, target) {
    LaserShotProvider.onProjectileHit(projectile, target);
});
var DamageSource;
(function (DamageSource) {
    DamageSource[DamageSource["electricity"] = 0] = "electricity";
    DamageSource[DamageSource["radiation"] = 1] = "radiation";
})(DamageSource || (DamageSource = {}));
var EntityHelper;
(function (EntityHelper) {
    function isFriendlyMobType(type) {
        if (type >= 10 && type <= 31)
            return true;
        if (type == 74 || type == 75)
            return true;
        if (type == 108 || type == 109 || type >= 111 && type <= 113 || type == 115 || type == 118) {
            return true;
        }
        return false;
    }
    EntityHelper.isFriendlyMobType = isFriendlyMobType;
    function isHostileMobType(type) {
        if (type >= 32 && type <= 59)
            return true;
        if (type == 104 || type == 105 || type == 110 || type == 114 || type == 116) {
            return true;
        }
        return false;
    }
    EntityHelper.isHostileMobType = isHostileMobType;
    function isMob(entity) {
        var type = Entity.getType(entity);
        return isFriendlyMobType(type) || isHostileMobType(type);
    }
    EntityHelper.isMob = isMob;
    function isPlayer(entity) {
        var type = Entity.getType(entity);
        return type == 1 || type == 63;
    }
    EntityHelper.isPlayer = isPlayer;
    function canTakeDamage(entity, damageSource) {
        if (Entity.getHealth(entity) <= 0)
            return false;
        if (isPlayer(entity)) {
            var player = new PlayerActor(entity);
            if (player.getGameMode() == 1)
                return false;
            if (damageSource == DamageSource.electricity) {
                if (player.getArmor(0).id == ItemID.hazmatHelmet && player.getArmor(1).id == ItemID.hazmatChestplate &&
                    player.getArmor(2).id == ItemID.hazmatLeggings && player.getArmor(3).id == ItemID.rubberBoots) {
                    return false;
                }
                return true;
            }
            if (damageSource == DamageSource.radiation) {
                return !RadiationAPI.hasHazmatSuit(entity);
            }
        }
        return isMob(entity);
    }
    EntityHelper.canTakeDamage = canTakeDamage;
    function isOnGround(entity) {
        var vel = Entity.getVelocity(entity);
        return Math.abs(vel.y - fallVelocity) < 0.0001;
    }
    EntityHelper.isOnGround = isOnGround;
    function resetFallHeight(entity) {
        Entity.addEffect(entity, PotionEffect.slow_falling, 1, 3);
    }
    EntityHelper.resetFallHeight = resetFallHeight;
    function getEntitiesInRadius(region, pos, rad) {
        var list = region.listEntitiesInAABB(pos.x - rad, pos.y - rad, pos.z - rad, pos.x + rad, pos.y + rad, pos.z + rad);
        var entities = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var ent = list_1[_i];
            if (Entity.getDistanceBetweenCoords(pos, Entity.getPosition(ent)) <= rad) {
                entities.push(ent);
            }
        }
        return entities;
    }
    EntityHelper.getEntitiesInRadius = getEntitiesInRadius;
})(EntityHelper || (EntityHelper = {}));
var JetpackProvider;
(function (JetpackProvider) {
    var playerData = {};
    function getFlying(playerUid) {
        return playerData[playerUid] || false;
    }
    JetpackProvider.getFlying = getFlying;
    function setFlying(playerUid, fly) {
        return playerData[playerUid] = fly;
    }
    JetpackProvider.setFlying = setFlying;
    function onTick(item, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        var vel = Entity.getVelocity(playerUid);
        if (item.extra && item.extra.getBoolean("hover")) {
            if (energyStored < 8 || EntityHelper.isOnGround(playerUid)) {
                item.extra.putBoolean("hover", false);
                var client = Network.getClientForPlayer(playerUid);
                if (client)
                    BlockEngine.sendMessage(client, "§4", "message.hover_mode.disabled");
                return item;
            }
            else {
                if (vel.y < 0) {
                    EntityHelper.resetFallHeight(playerUid);
                }
                if (World.getThreadTime() % 5 == 0) {
                    var energyUse = getFlying(playerUid) ? 40 : 20;
                    ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energyUse, 0));
                    return item;
                }
            }
        }
        else if (getFlying(playerUid) && energyStored > 8) {
            if (vel.y > -1.2 && vel.y < 0) {
                EntityHelper.resetFallHeight(playerUid);
            }
            ChargeItemRegistry.setEnergyStored(item, energyStored - 8);
            return item;
        }
        /*if (playSound && IC2Config.soundEnabled) {
            if (hoverMode) {
                SoundManager.startPlaySound(SourceType.ENTITY, playerUid, "JetpackLoop.ogg", 0.8);
            } else {
                SoundManager.startPlaySound(SourceType.ENTITY, playerUid, "JetpackLoop.ogg", 1);
            }
        }
        if (!playSound) {
            SoundManager.stopPlaySound(playerUid, "JetpackLoop.ogg");
        }*/
        return null;
    }
    JetpackProvider.onTick = onTick;
})(JetpackProvider || (JetpackProvider = {}));
var ToolHUD;
(function (ToolHUD) {
    var AbstractButton = /** @class */ (function () {
        function AbstractButton(name, type, uiData) {
            var _this = this;
            this.name = name;
            this.type = type;
            this.uiData = uiData;
            this.bindedItems = [];
            this.uiElement = __assign(__assign({ type: "button", x: 0, y: uiData.position * 1000 }, uiData), { clicker: {
                    onClick: function () {
                        ToolHUD.onClick(_this.name);
                    }
                } });
        }
        AbstractButton.prototype.bindItem = function (id) {
            this.bindedItems.push(id);
        };
        AbstractButton.prototype.isBindedItem = function (id) {
            return this.bindedItems.indexOf(id) != -1;
        };
        AbstractButton.prototype.onClick = function (player) { };
        AbstractButton.prototype.onUpdate = function (element) { };
        return AbstractButton;
    }());
    ToolHUD.AbstractButton = AbstractButton;
})(ToolHUD || (ToolHUD = {}));
/// <reference path="AbstractButton.ts" />
var ToolHUD;
(function (ToolHUD) {
    var ButtonNightvision = /** @class */ (function (_super) {
        __extends(ButtonNightvision, _super);
        function ButtonNightvision() {
            return _super.call(this, "button_nightvision", "armor", {
                position: 0,
                bitmap: "button_nightvision_on",
                bitmap2: "button_nightvision_off",
                scale: 50,
            }) || this;
        }
        ButtonNightvision.prototype.onClick = function (player) {
            var client = Network.getClientForPlayer(player);
            var slot = Entity.getArmorSlot(player, 0);
            var extra = slot.extra || new ItemExtraData();
            if (extra.getBoolean("nv")) {
                extra.putBoolean("nv", false);
                BlockEngine.sendMessage(client, "§4", "message.nightvision.disabled");
            }
            else {
                extra.putBoolean("nv", true);
                BlockEngine.sendMessage(client, "§2", "message.nightvision.enabled");
            }
            Entity.setArmorSlot(player, 0, slot.id, 1, slot.data, extra);
        };
        return ButtonNightvision;
    }(ToolHUD.AbstractButton));
    ToolHUD.ButtonNightvision = ButtonNightvision;
})(ToolHUD || (ToolHUD = {}));
/// <reference path="AbstractButton.ts" />
var ToolHUD;
(function (ToolHUD) {
    var ButtonHover = /** @class */ (function (_super) {
        __extends(ButtonHover, _super);
        function ButtonHover() {
            return _super.call(this, "button_hover", "armor", {
                position: 2,
                bitmap: "button_hover_off",
                scale: 50,
            }) || this;
        }
        ButtonHover.prototype.onUpdate = function (element) {
            var extra = Player.getArmorSlot(1).extra;
            if (extra === null || extra === void 0 ? void 0 : extra.getBoolean("hover")) {
                element.bitmap = "button_hover_on";
            }
            else {
                element.bitmap = "button_hover_off";
            }
        };
        ButtonHover.prototype.onClick = function (player) {
            var slot = Entity.getArmorSlot(player, 1);
            if (!EntityHelper.isOnGround(player) && ChargeItemRegistry.getEnergyStored(slot) >= 8) {
                var client = Network.getClientForPlayer(player);
                var extra = slot.extra || new ItemExtraData();
                if (extra.getBoolean("hover")) {
                    extra.putBoolean("hover", false);
                    BlockEngine.sendMessage(client, "§4", "message.hover_mode.disabled");
                }
                else {
                    extra.putBoolean("hover", true);
                    BlockEngine.sendMessage(client, "§2", "message.hover_mode.enabled");
                }
                Entity.setArmorSlot(player, 1, slot.id, 1, slot.data, extra);
            }
        };
        return ButtonHover;
    }(ToolHUD.AbstractButton));
    ToolHUD.ButtonHover = ButtonHover;
})(ToolHUD || (ToolHUD = {}));
/// <reference path="AbstractButton.ts" />
var ToolHUD;
(function (ToolHUD) {
    var ButtonToolMode = /** @class */ (function (_super) {
        __extends(ButtonToolMode, _super);
        function ButtonToolMode() {
            return _super.call(this, "button_switch", "tool", {
                position: 4,
                bitmap: "button_switch",
                bitmap2: "button_switch_touched",
                scale: 25,
            }) || this;
        }
        ButtonToolMode.prototype.onClick = function (player) {
            var item = Entity.getCarriedItem(player);
            var instance = ItemRegistry.getInstanceOf(item.id);
            if (instance && 'onModeSwitch' in instance) {
                instance.onModeSwitch(item, player);
            }
        };
        return ButtonToolMode;
    }(ToolHUD.AbstractButton));
    ToolHUD.ButtonToolMode = ButtonToolMode;
})(ToolHUD || (ToolHUD = {}));
/// <reference path="AbstractButton.ts" />
var ToolHUD;
(function (ToolHUD) {
    var ButtonFly = /** @class */ (function (_super) {
        __extends(ButtonFly, _super);
        function ButtonFly() {
            var _this = _super.call(this, "button_fly", "armor", {
                position: 1,
                bitmap: "button_fly_on",
                bitmap2: "button_fly_off",
                scale: 50
            }) || this;
            _this.isTouched = false;
            return _this;
        }
        ButtonFly.prototype.onUpdate = function () {
            var _a;
            var isFlying = ToolHUD.container.isElementTouched(this.name);
            if (this.isTouched != isFlying) {
                this.isTouched = isFlying;
                Network.sendToServer("icpe.setFlying", { fly: isFlying });
            }
            var armor = Player.getArmorSlot(1);
            var hoverMode = ((_a = armor.extra) === null || _a === void 0 ? void 0 : _a.getBoolean("hover")) || false;
            var energyStored = ChargeItemRegistry.getEnergyStored(armor);
            var posY = Player.getPosition().y;
            if (energyStored >= 8 && posY < 256) {
                var vy = Player.getVelocity().y;
                if (isFlying) {
                    var maxVel = Math.min(32, 265 - posY) / 160; // max 0.2
                    if (hoverMode) {
                        if (vy < 0.2)
                            Player.addVelocity(0, Math.min(maxVel, 0.2 - vy), 0);
                    }
                    else if (vy < 0.67) {
                        Player.addVelocity(0, Math.min(maxVel, 0.67 - vy), 0);
                    }
                }
                else if (hoverMode) {
                    if (vy < -0.1)
                        Player.addVelocity(0, Math.min(0.25, -0.1 - vy), 0);
                }
            }
        };
        return ButtonFly;
    }(ToolHUD.AbstractButton));
    ToolHUD.ButtonFly = ButtonFly;
})(ToolHUD || (ToolHUD = {}));
/// <reference path="AbstractButton.ts" />
var ToolHUD;
(function (ToolHUD) {
    var ButtonJump = /** @class */ (function (_super) {
        __extends(ButtonJump, _super);
        function ButtonJump() {
            return _super.call(this, "button_jump", "armor", {
                position: 3,
                bitmap: "button_jump_on",
                bitmap2: "button_jump_off",
                scale: 50,
            }) || this;
        }
        ButtonJump.prototype.onClick = function (player) {
            var slot = Entity.getArmorSlot(player, 3);
            var energyStored = ChargeItemRegistry.getEnergyStored(slot);
            var vel = Entity.getVelocity(player);
            if (energyStored >= 4000 && Math.abs(vel.y - fallVelocity) < 0.0001) {
                Entity.setVelocity(player, vel.x * 3.5, 1.3, vel.z * 3.5);
                ChargeItemRegistry.setEnergyStored(slot, energyStored - 4000);
                Entity.setArmorSlot(player, 3, slot.id, 1, slot.data, slot.extra);
            }
        };
        return ButtonJump;
    }(ToolHUD.AbstractButton));
    ToolHUD.ButtonJump = ButtonJump;
})(ToolHUD || (ToolHUD = {}));
var ToolHUD;
(function (ToolHUD) {
    Callback.addCallback("NativeGuiChanged", function (screenName) {
        ToolHUD.currentUIscreen = screenName;
        if (screenName != "in_game_play_screen" && ToolHUD.container) {
            ToolHUD.container.close();
        }
    });
    var buttonScale = IC2Config.getInt("button_scale");
    var isEnabled = false;
    ToolHUD.container = null;
    ToolHUD.Window = new UI.Window({
        location: {
            x: 1000 - buttonScale,
            y: UI.getScreenHeight() / 2 - buttonScale * 2,
            width: buttonScale,
            height: buttonScale * 5
        },
        drawing: [{ type: "background", color: 0 }],
        elements: {}
    });
    ToolHUD.Window.setAsGameOverlay(true);
    var buttonMap = {};
    ToolHUD.buttons = {};
    function registerButton(button) {
        ToolHUD.buttons[button.name] = button;
        buttonMap[button.name] = false;
    }
    ToolHUD.registerButton = registerButton;
    function getButton(name) {
        return ToolHUD.buttons[name];
    }
    ToolHUD.getButton = getButton;
    function setButtonFor(id, name) {
        getButton(name).bindItem(id);
    }
    ToolHUD.setButtonFor = setButtonFor;
    /** @deprecated */
    function setArmorButton(id, name) {
        setButtonFor(id, name);
    }
    ToolHUD.setArmorButton = setArmorButton;
    function onClick(name) {
        Network.sendToServer("icpe.clickHUDButton", { name: name });
    }
    ToolHUD.onClick = onClick;
    function updateUIbuttons() {
        var elements = ToolHUD.Window.getContent().elements;
        for (var name in buttonMap) {
            if (buttonMap[name]) {
                var button = getButton(name);
                if (!elements[name]) {
                    elements[name] = button.uiElement;
                }
                button.onUpdate(button.uiElement);
                buttonMap[name] = false;
            }
            else {
                elements[name] = null;
            }
        }
    }
    function onUpdate() {
        if (ToolHUD.currentUIscreen == "in_game_play_screen") {
            var item = Player.getCarriedItem();
            var armor = [];
            for (var i = 0; i < 4; i++) {
                var slot = Player.getArmorSlot(i);
                if (slot.id > 0)
                    armor.push(slot);
            }
            for (var name in ToolHUD.buttons) {
                var button = ToolHUD.buttons[name];
                if (button.type == "armor") {
                    for (var _i = 0, armor_1 = armor; _i < armor_1.length; _i++) {
                        var slot = armor_1[_i];
                        if (button.isBindedItem(slot.id)) {
                            buttonMap[name] = true;
                            isEnabled = true;
                            break;
                        }
                    }
                }
                else if (button.isBindedItem(item.id)) {
                    buttonMap[name] = true;
                    isEnabled = true;
                }
            }
            if (isEnabled) {
                if (!ToolHUD.container || !ToolHUD.container.isOpened()) {
                    ToolHUD.container = new UI.Container();
                    ToolHUD.container.openAs(ToolHUD.Window);
                }
                updateUIbuttons();
            }
            else if (ToolHUD.container === null || ToolHUD.container === void 0 ? void 0 : ToolHUD.container.isOpened()) {
                ToolHUD.container.close();
            }
        }
        else if (ToolHUD.container) {
            ToolHUD.container.close();
            ToolHUD.container = null;
        }
        isEnabled = false;
    }
    Callback.addCallback("LocalTick", onUpdate);
    // Server Side
    Network.addServerPacket("icpe.clickHUDButton", function (client, data) {
        var player = client.getPlayerUid();
        getButton(data.name).onClick(player);
    });
    Network.addServerPacket("icpe.setFlying", function (client, data) {
        var player = client.getPlayerUid();
        JetpackProvider.setFlying(player, data.fly);
    });
})(ToolHUD || (ToolHUD = {}));
/// <reference path="ToolHUD.ts" />
/// <reference path="buttons/ButtonFly.ts" />
/// <reference path="buttons/ButtonHover.ts" />
/// <reference path="buttons/ButtonJump.ts" />
/// <reference path="buttons/ButtonNightvision.ts" />
/// <reference path="buttons/ButtonToolMode.ts" />
var ToolHUD;
(function (ToolHUD) {
    ToolHUD.registerButton(new ToolHUD.ButtonFly());
    ToolHUD.registerButton(new ToolHUD.ButtonHover());
    ToolHUD.registerButton(new ToolHUD.ButtonJump());
    ToolHUD.registerButton(new ToolHUD.ButtonNightvision());
    ToolHUD.registerButton(new ToolHUD.ButtonToolMode());
})(ToolHUD || (ToolHUD = {}));
/// <reference path="IWrenchable.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Machine;
(function (Machine) {
    var _a;
    _a = BlockEngine.Decorators, Machine.ClientSide = _a.ClientSide, Machine.NetworkEvent = _a.NetworkEvent, Machine.ContainerEvent = _a.ContainerEvent;
    var MachineBase = /** @class */ (function (_super) {
        __extends(MachineBase, _super);
        function MachineBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MachineBase.prototype.onInit = function () {
            this.networkData.putInt("blockId", this.blockID);
            this.networkData.putInt("facing", this.getFacing());
            this.networkData.sendChanges();
            this.setupContainer();
            delete this.liquidStorage;
        };
        MachineBase.prototype.setupContainer = function () { };
        MachineBase.prototype.addLiquidTank = function (name, limit, liquids) {
            var tank = new BlockEngine.LiquidTank(this, name, limit, liquids);
            var liquid = this.liquidStorage.getLiquidStored();
            if (liquid) {
                var amount = this.liquidStorage.getLiquid(liquid, tank.getLimit() / 1000);
                tank.addLiquid(liquid, Math.round(amount * 1000));
            }
            return tank;
        };
        MachineBase.prototype.canRotate = function (side) {
            return false;
        };
        MachineBase.prototype.onItemUse = function (coords, item, player) {
            if (item.id == ItemID.debugItem)
                return true;
            var side = coords.side;
            if (Entity.getSneaking(player)) {
                side ^= 1;
            }
            if (this.canRotate(side) && ICTool.isUseableWrench(item, 1)) {
                ICTool.rotateMachine(this, side, item, player);
                return true;
            }
            return false;
        };
        MachineBase.prototype.setActive = function (isActive) {
            // TODO: sounds
            if (this.networkData.getBoolean("active") !== isActive) {
                this.networkData.putBoolean("active", isActive);
                this.networkData.sendChanges();
            }
        };
        MachineBase.prototype.renderModel = function () {
            if (this.networkData.getBoolean("active")) {
                var blockId = Network.serverToLocalId(this.networkData.getInt("blockId"));
                var facing = this.networkData.getInt("facing");
                TileRenderer.mapAtCoords(this.x, this.y, this.z, blockId, facing);
            }
            else {
                BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
            }
        };
        MachineBase.prototype.clientLoad = function () {
            var _this = this;
            this.renderModel();
            this.networkData.addOnDataChangedListener(function (data, isExternal) {
                _this.renderModel();
            });
        };
        MachineBase.prototype.clientUnload = function () {
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        };
        MachineBase.prototype.getFacing = function () {
            return this.blockSource.getBlockData(this.x, this.y, this.z);
        };
        MachineBase.prototype.setFacing = function (side) {
            if (this.getFacing() != side) {
                this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
                this.networkData.putInt("blockData", side);
                this.networkData.sendChanges();
                return true;
            }
            return false;
        };
        MachineBase.prototype.decreaseSlot = function (slot, count) {
            slot.count -= count;
            slot.markDirty();
            slot.validate();
        };
        MachineBase.prototype.getDefaultDrop = function () {
            var _a;
            return (_a = this.defaultDrop) !== null && _a !== void 0 ? _a : this.blockID;
        };
        MachineBase.prototype.adjustDrop = function (item) {
            return item;
        };
        MachineBase.prototype.getOperationSound = function () {
            return null;
        };
        MachineBase.prototype.getStartingSound = function () {
            return null;
        };
        MachineBase.prototype.getInterruptSound = function () {
            return null;
        };
        MachineBase.prototype.startPlaySound = function () {
            /*if (!IC2Config.machineSoundEnabled) return;
            if (!this.audioSource && !this.remove) {
                if (this.finishingSound != 0) {
                    SoundManager.stop(this.finishingSound);
                }
                if (this.getStartingSound()) {
                    this.audioSource = SoundManager.createSource(SourceType.TILEENTITY, this, this.getStartingSound());
                    //this.audioSource.setNextSound(this.getOperationSound(), true);
                } else if (this.getOperationSound()) {
                    this.audioSource = SoundManager.createSource(SourceType.TILEENTITY, this, this.getOperationSound());
                }
            }*/
        };
        MachineBase.prototype.stopPlaySound = function () {
            /*if (this.audioSource) {
                SoundManager.removeSource(this.audioSource);
                this.audioSource = null;
                if (this.getInterruptSound()) {
                    this.finishingSound = SoundManager.playSoundAtBlock(this, this.getInterruptSound(), 1);
                }
            }*/
        };
        __decorate([
            Machine.ClientSide
        ], MachineBase.prototype, "renderModel", null);
        return MachineBase;
    }(TileEntityBase));
    Machine.MachineBase = MachineBase;
})(Machine || (Machine = {}));
/// <reference path="MachineBase.ts" />
var Machine;
(function (Machine) {
    var ElectricMachine = /** @class */ (function (_super) {
        __extends(ElectricMachine, _super);
        function ElectricMachine() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0
            };
            return _this;
        }
        ElectricMachine.prototype.getTier = function () {
            return 1;
        };
        ElectricMachine.prototype.getEnergyStorage = function () {
            return 0;
        };
        ElectricMachine.prototype.getRelativeEnergy = function () {
            return this.data.energy / this.getEnergyStorage();
        };
        ElectricMachine.prototype.getMaxPacketSize = function () {
            return 8 << this.getTier() * 2;
        };
        ElectricMachine.prototype.onItemUse = function (coords, item, player) {
            if (item.id == ItemID.EUMeter)
                return true;
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        ElectricMachine.prototype.chargeSlot = function (slotName) {
            this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot(slotName), "Eu", this.data.energy, this.getTier());
        };
        ElectricMachine.prototype.dischargeSlot = function (slotName) {
            var amount = this.getEnergyStorage() - this.data.energy;
            this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot(slotName), "Eu", amount, this.getTier());
        };
        ElectricMachine.prototype.energyTick = function (type, src) { };
        ElectricMachine.prototype.energyReceive = function (type, amount, voltage) {
            var maxVoltage = this.getMaxPacketSize();
            if (voltage > maxVoltage) {
                if (IC2Config.voltageEnabled) {
                    this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
                    this.blockSource.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.getExplosionPower(), true);
                    SoundManager.playSoundAtBlock(this, "MachineOverload.ogg", 1, 32);
                    this.selfDestroy();
                    return 1;
                }
                amount = Math.min(amount, maxVoltage);
            }
            var add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
            this.data.energy += add;
            return add;
        };
        ElectricMachine.prototype.getExplosionPower = function () {
            return 1.2;
        };
        ElectricMachine.prototype.isConductor = function (type) {
            return false;
        };
        ElectricMachine.prototype.canReceiveEnergy = function (side, type) {
            return true;
        };
        ElectricMachine.prototype.canExtractEnergy = function (side, type) {
            return false;
        };
        ElectricMachine.prototype.rebuildGrid = function () {
            this.energyNode.resetConnections();
            EnergyGridBuilder.buildGridForTile(this);
        };
        return ElectricMachine;
    }(Machine.MachineBase));
    Machine.ElectricMachine = ElectricMachine;
})(Machine || (Machine = {}));
/// <reference path="ElectricMachine.ts" />
var Machine;
(function (Machine) {
    var Generator = /** @class */ (function (_super) {
        __extends(Generator, _super);
        function Generator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultDrop = BlockID.primalGenerator;
            return _this;
        }
        Generator.prototype.canReceiveEnergy = function () {
            return false;
        };
        Generator.prototype.canExtractEnergy = function () {
            return true;
        };
        Generator.prototype.energyTick = function (type, src) {
            var output = Math.min(this.data.energy, this.getMaxPacketSize());
            this.data.energy += src.add(output) - output;
        };
        return Generator;
    }(Machine.ElectricMachine));
    Machine.Generator = Generator;
})(Machine || (Machine = {}));
/// <reference path="../../machine/MachineBase.ts" />
/// <reference path="../../machine/ElectricMachine.ts" />
/// <reference path="../../machine/Generator.ts" />
var MachineRegistry;
(function (MachineRegistry) {
    var machineIDs = {};
    function isMachine(id) {
        return machineIDs[id];
    }
    MachineRegistry.isMachine = isMachine;
    // register IC2 Machine
    function registerPrototype(id, Prototype) {
        var _a, _b, _c, _d, _e, _f, _g;
        // setup legacy prototypes
        if (!(Prototype instanceof Machine.MachineBase)) {
            var BasePrototype = Machine.MachineBase.prototype;
            Prototype.id = id;
            (_a = Prototype.getDefaultDrop) !== null && _a !== void 0 ? _a : (Prototype.getDefaultDrop = BasePrototype.getDefaultDrop);
            (_b = Prototype.adjustDrop) !== null && _b !== void 0 ? _b : (Prototype.adjustDrop = BasePrototype.adjustDrop);
            (_c = Prototype.startPlaySound) !== null && _c !== void 0 ? _c : (Prototype.startPlaySound = BasePrototype.startPlaySound);
            (_d = Prototype.stopPlaySound) !== null && _d !== void 0 ? _d : (Prototype.stopPlaySound = BasePrototype.stopPlaySound);
            (_e = Prototype.setActive) !== null && _e !== void 0 ? _e : (Prototype.setActive = function (isActive) {
                if (this.data.isActive != isActive) {
                    this.data.isActive = isActive;
                    TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (isActive ? 4 : 0));
                }
            });
            (_f = Prototype.activate) !== null && _f !== void 0 ? _f : (Prototype.activate = function () {
                this.setActive(true);
            });
            (_g = Prototype.deactivate) !== null && _g !== void 0 ? _g : (Prototype.deactivate = function () {
                this.setActive(false);
            });
        }
        // register prototype
        machineIDs[id] = true;
        TileEntity.registerPrototype(id, Prototype);
        setMachineDrop(id, Prototype.defaultDrop);
        if (Prototype instanceof Machine.ElectricMachine) {
            // wire connection
            ICRender.getGroup("ic-wire").add(id, -1);
            // register for energy net
            EnergyTileRegistry.addEnergyTypeForId(id, EU);
        }
    }
    MachineRegistry.registerPrototype = registerPrototype;
    // for reverse compatibility
    function registerElectricMachine(id, Prototype) {
        var _a, _b, _c, _d;
        // wire connection
        ICRender.getGroup("ic-wire").add(id, -1);
        // setup energy values
        if (Prototype.defaultValues) {
            Prototype.defaultValues.energy = 0;
        }
        else {
            Prototype.defaultValues = {
                energy: 0
            };
        }
        var BasePrototype = Machine.ElectricMachine.prototype;
        (_a = Prototype.getTier) !== null && _a !== void 0 ? _a : (Prototype.getTier = BasePrototype.getTier);
        (_b = Prototype.getMaxPacketSize) !== null && _b !== void 0 ? _b : (Prototype.getMaxPacketSize = BasePrototype.getMaxPacketSize);
        (_c = Prototype.getExplosionPower) !== null && _c !== void 0 ? _c : (Prototype.getExplosionPower = BasePrototype.getExplosionPower);
        (_d = Prototype.energyReceive) !== null && _d !== void 0 ? _d : (Prototype.energyReceive = BasePrototype.energyReceive);
        this.registerPrototype(id, Prototype);
        // register for energy net
        EnergyTileRegistry.addEnergyTypeForId(id, EU);
    }
    MachineRegistry.registerElectricMachine = registerElectricMachine;
    function registerGenerator(id, Prototype) {
        var _a, _b, _c;
        var BasePrototype = Machine.Generator.prototype;
        (_a = Prototype.energyTick) !== null && _a !== void 0 ? _a : (Prototype.energyTick = BasePrototype.energyTick);
        (_b = Prototype.canReceiveEnergy) !== null && _b !== void 0 ? _b : (Prototype.canReceiveEnergy = BasePrototype.canReceiveEnergy);
        (_c = Prototype.canExtractEnergy) !== null && _c !== void 0 ? _c : (Prototype.canExtractEnergy = BasePrototype.canExtractEnergy);
        this.registerElectricMachine(id, Prototype);
    }
    MachineRegistry.registerGenerator = registerGenerator;
    function createStorageInterface(blockID, descriptor) {
        var _a, _b, _c, _d;
        descriptor.liquidUnitRatio = 0.001;
        (_a = descriptor.getInputTank) !== null && _a !== void 0 ? _a : (descriptor.getInputTank = function () {
            return this.tileEntity.liquidTank;
        });
        (_b = descriptor.getOutputTank) !== null && _b !== void 0 ? _b : (descriptor.getOutputTank = function () {
            return this.tileEntity.liquidTank;
        });
        (_c = descriptor.canReceiveLiquid) !== null && _c !== void 0 ? _c : (descriptor.canReceiveLiquid = function (liquid) {
            return this.getInputTank().isValidLiquid(liquid);
        });
        (_d = descriptor.canTransportLiquid) !== null && _d !== void 0 ? _d : (descriptor.canTransportLiquid = function () { return true; });
        StorageInterface.createInterface(blockID, descriptor);
    }
    MachineRegistry.createStorageInterface = createStorageInterface;
    function setStoragePlaceFunction(blockID, hasVerticalRotation) {
        Block.registerPlaceFunction(blockID, function (coords, item, block, player, blockSource) {
            var region = new WorldRegion(blockSource);
            var place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
            var rotation = TileRenderer.getBlockRotation(player, hasVerticalRotation);
            region.setBlock(place, item.id, rotation);
            // region.playSound(place.x + .5, place.y + .5, place.z + .5, "dig.stone", 1, 0.8)
            var tile = region.addTileEntity(place);
            if (item.extra) {
                tile.data.energy = item.extra.getInt("energy");
            }
        });
    }
    MachineRegistry.setStoragePlaceFunction = setStoragePlaceFunction;
    /**@deprecated */
    function getMachineDrop(blockID, level) {
        var drop = [];
        if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
            var dropID = TileEntity.getPrototype(blockID).getDefaultDrop();
            drop.push([dropID, 1, 0]);
        }
        return drop;
    }
    MachineRegistry.getMachineDrop = getMachineDrop;
    function setMachineDrop(blockID, dropID) {
        dropID !== null && dropID !== void 0 ? dropID : (dropID = Block.getNumericId(blockID));
        BlockRegistry.registerDrop(blockID, function (coords, blockID, blockData, level) {
            var drop = [];
            if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
                drop.push([dropID, 1, 0]);
            }
            return drop;
        });
    }
    MachineRegistry.setMachineDrop = setMachineDrop;
    function fillTankOnClick(tank, item, playerUid) {
        var liquid = tank.getLiquidStored();
        var empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
        if (empty && (!liquid && tank.isValidLiquid(empty.liquid) || empty.liquid == liquid) && !tank.isFull()) {
            var player = new PlayerEntity(playerUid);
            var liquidLimit = tank.getLimit();
            var storedAmount = tank.getAmount(liquid);
            var count = Math.min(item.count, Math.floor((liquidLimit - storedAmount) / empty.amount));
            if (count > 0) {
                tank.addLiquid(empty.liquid, empty.amount * count);
                player.addItemToInventory(new ItemStack(empty.id, count, empty.data));
                item.count -= count;
                player.setCarriedItem(item);
            }
            else if (item.count == 1 && empty.storage) {
                var amount = Math.min(liquidLimit - storedAmount, empty.amount);
                tank.addLiquid(empty.liquid, amount);
                item.data += amount;
                player.setCarriedItem(item);
            }
            return true;
        }
        return false;
    }
    MachineRegistry.fillTankOnClick = fillTankOnClick;
    /** @deprecated */
    function isValidEUItem(id, count, data, container) {
        var level = container.tileEntity.getTier();
        return ChargeItemRegistry.isValidItem(id, "Eu", level);
    }
    MachineRegistry.isValidEUItem = isValidEUItem;
    /** @deprecated */
    function isValidEUStorage(id, count, data, container) {
        var level = container.tileEntity.getTier();
        return ChargeItemRegistry.isValidStorage(id, "Eu", level);
    }
    MachineRegistry.isValidEUStorage = isValidEUStorage;
    function updateGuiHeader(gui, text) {
        var header = gui.getWindow("header");
        header.contentProvider.drawing[2].text = Translation.translate(text);
    }
    MachineRegistry.updateGuiHeader = updateGuiHeader;
    function createInventoryWindow(header, uiDescriptor) {
        var gui = new UI.StandartWindow({
            standard: {
                header: { text: { text: Translation.translate(header) } },
                inventory: { standard: true },
                background: { standard: true }
            },
            drawing: uiDescriptor.drawing || [],
            elements: uiDescriptor.elements
        });
        Callback.addCallback("LevelLoaded", function () {
            MachineRegistry.updateGuiHeader(gui, header);
        });
        return gui;
    }
    MachineRegistry.createInventoryWindow = createInventoryWindow;
})(MachineRegistry || (MachineRegistry = {}));
var transferByTier = {
    1: 32,
    2: 256,
    3: 2048,
    4: 8192
};
var MachineRecipeRegistry;
(function (MachineRecipeRegistry) {
    MachineRecipeRegistry.recipeData = {};
    MachineRecipeRegistry.fluidRecipeData = {};
    function registerRecipesFor(name, data, validateKeys) {
        if (validateKeys) {
            var newData = {};
            for (var key in data) {
                var newKey = void 0;
                if (key.includes(":")) {
                    var keyArray = key.split(":");
                    if (keyArray[0] == "minecraft") {
                        var stringID = keyArray[1];
                        var numericID = VanillaBlockID[stringID] || VanillaItemID[stringID];
                        if (!numericID) {
                            var source = IDConverter.getIDData(stringID);
                            newKey = source.id + ":" + source.data;
                        }
                        else {
                            newKey = numericID;
                            if (keyArray[2])
                                newKey += ":" + keyArray[2];
                        }
                    }
                    else {
                        newKey = eval(keyArray[0]) + ":" + keyArray[1];
                    }
                }
                else {
                    newKey = eval(key);
                }
                if (newKey)
                    newData[newKey] = data[key];
            }
            data = newData;
        }
        this.recipeData[name] = data;
    }
    MachineRecipeRegistry.registerRecipesFor = registerRecipesFor;
    function addRecipeFor(name, input, result) {
        var recipes = this.requireRecipesFor(name, true);
        if (Array.isArray(recipes)) {
            recipes.push({ input: input, result: result });
        }
        else {
            recipes[input] = result;
        }
    }
    MachineRecipeRegistry.addRecipeFor = addRecipeFor;
    function requireRecipesFor(name, createIfNotFound) {
        if (!MachineRecipeRegistry.recipeData[name] && createIfNotFound) {
            MachineRecipeRegistry.recipeData[name] = {};
        }
        return MachineRecipeRegistry.recipeData[name];
    }
    MachineRecipeRegistry.requireRecipesFor = requireRecipesFor;
    function getRecipeResult(name, key1, key2) {
        var data = this.requireRecipesFor(name);
        if (data && key1) {
            return data[key1] || data[key1 + ":" + key2];
        }
        return null;
    }
    MachineRecipeRegistry.getRecipeResult = getRecipeResult;
    function hasRecipeFor(name, key1, key2) {
        return !!this.getRecipeResult(name, key1, key2);
    }
    MachineRecipeRegistry.hasRecipeFor = hasRecipeFor;
    function registerFluidRecipes(name, data) {
        MachineRecipeRegistry.fluidRecipeData[name] = data;
    }
    MachineRecipeRegistry.registerFluidRecipes = registerFluidRecipes;
    function requireFluidRecipes(name) {
        if (!MachineRecipeRegistry.fluidRecipeData[name]) {
            MachineRecipeRegistry.fluidRecipeData[name] = {};
        }
        return MachineRecipeRegistry.fluidRecipeData[name];
    }
    MachineRecipeRegistry.requireFluidRecipes = requireFluidRecipes;
    function addFluidRecipe(name, liquid, data) {
        var recipes = requireFluidRecipes(name);
        recipes[liquid] = data;
    }
    MachineRecipeRegistry.addFluidRecipe = addFluidRecipe;
    function getFluidRecipe(name, liquid) {
        var recipes = requireFluidRecipes(name);
        return recipes[liquid];
    }
    MachineRecipeRegistry.getFluidRecipe = getFluidRecipe;
})(MachineRecipeRegistry || (MachineRecipeRegistry = {}));
var RubberTreeGenerator;
(function (RubberTreeGenerator) {
    RubberTreeGenerator.biomeData = {};
    function getBiomeChance(biomeID) {
        var chance = RubberTreeGenerator.biomeData[biomeID] || 0;
        return chance / 100;
    }
    RubberTreeGenerator.getBiomeChance = getBiomeChance;
    function growRubberTree(region, x, y, z) {
        var random = new java.util.Random(Debug.sysTime());
        generateRubberTree(region, x, y, z, random, true);
    }
    RubberTreeGenerator.growRubberTree = growRubberTree;
    function generateRubberTree(region, x, y, z, random, replacePlants) {
        var minHeight = 3, maxHeight = 8;
        var height = getGrowHeight(region, x, y, z, random.nextInt(maxHeight - minHeight + 1) + minHeight, replacePlants);
        if (height >= minHeight) {
            var treeholeChance = 0.25;
            for (var ys = 0; ys < height; ys++) {
                if (random.nextDouble() < treeholeChance) {
                    treeholeChance -= 0.1;
                    region.setBlock(x, y + ys, z, BlockID.rubberTreeLogLatex, 4 + random.nextInt(4));
                }
                else {
                    region.setBlock(x, y + ys, z, BlockID.rubberTreeLog, 0);
                }
            }
            var leavesStart = Math.floor(height / 2);
            var leavesEnd = height;
            for (var ys = leavesStart; ys <= leavesEnd; ys++) {
                for (var xs = -2; xs <= 2; xs++) {
                    for (var zs = -2; zs <= 2; zs++) {
                        var radius = 2.5 + random.nextDouble() * 0.5;
                        if (ys == leavesEnd)
                            radius /= 2;
                        if (Math.sqrt(xs * xs + zs * zs) <= radius) {
                            setLeaves(region, x + xs, y + ys, z + zs);
                        }
                    }
                }
            }
            var pikeHeight = 2 + Math.floor(random.nextDouble() * 2);
            for (var ys = 1; ys <= pikeHeight; ys++) {
                setLeaves(region, x, y + ys + height, z);
            }
        }
    }
    RubberTreeGenerator.generateRubberTree = generateRubberTree;
    function getGrowHeight(region, x, y, z, max, replacePlants) {
        var height = 0;
        while (height < max + 2) {
            var blockID = region.getBlockId(x, y + height, z);
            if (!(blockID == 0 || replacePlants && ToolAPI.getBlockMaterialName(blockID) == "plant"))
                break;
            height++;
        }
        return height > 2 ? height - 2 : 0;
    }
    RubberTreeGenerator.getGrowHeight = getGrowHeight;
    function setLeaves(region, x, y, z) {
        var blockID = region.getBlockId(x, y, z);
        if (blockID == 0 || blockID == 106) {
            region.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
        }
    }
    RubberTreeGenerator.setLeaves = setLeaves;
    var ForestBiomeIDs = [4, 18, 27, 28, 132, 155, 156];
    var JungleBiomeIDs = [21, 22, 23, 149, 151];
    var SwampBiomeIDs = [6, 134];
    function readRubberTreeConfig() {
        var chance = IC2Config.getInt("rubber_tree_gen.plains");
        RubberTreeGenerator.biomeData[1] = chance;
        chance = IC2Config.getInt("rubber_tree_gen.forest");
        ForestBiomeIDs.forEach(function (id) {
            RubberTreeGenerator.biomeData[id] = chance;
        });
        chance = IC2Config.getInt("rubber_tree_gen.jungle");
        JungleBiomeIDs.forEach(function (id) {
            RubberTreeGenerator.biomeData[id] = chance;
        });
        chance = IC2Config.getInt("rubber_tree_gen.swamp");
        SwampBiomeIDs.forEach(function (id) {
            RubberTreeGenerator.biomeData[id] = chance;
        });
    }
    RubberTreeGenerator.readRubberTreeConfig = readRubberTreeConfig;
    readRubberTreeConfig();
    World.addGenerationCallback(BlockEngine.getMainGameVersion() == 11 ? "GenerateChunk" : "PreProcessChunk", function (chunkX, chunkZ, random) {
        var region = BlockSource.getCurrentWorldGenRegion();
        var biome = region.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16);
        if (random.nextDouble() < getBiomeChance(biome)) {
            var treeCount = 1 + random.nextInt(6);
            for (var i = 0; i < treeCount; i++) {
                var coords = GenerationUtils.findSurface(chunkX * 16 + random.nextInt(16), 96, chunkZ * 16 + random.nextInt(16));
                if (region.getBlockId(coords.x, coords.y, coords.z) == 2) {
                    generateRubberTree(region, coords.x, coords.y + 1, coords.z, random);
                }
            }
        }
    }, "rubber_tree");
})(RubberTreeGenerator || (RubberTreeGenerator = {}));
var OreGenerator;
(function (OreGenerator) {
    OreGenerator.copper = {
        enabled: IC2Config.getBool("copper_ore.enabled"),
        count: IC2Config.getInt("copper_ore.count"),
        size: IC2Config.getInt("copper_ore.size"),
        minHeight: IC2Config.getInt("copper_ore.minHeight"),
        maxHeight: IC2Config.getInt("copper_ore.maxHeight")
    };
    OreGenerator.tin = {
        enabled: IC2Config.getBool("tin_ore.enabled"),
        count: IC2Config.getInt("tin_ore.count"),
        size: IC2Config.getInt("tin_ore.size"),
        minHeight: IC2Config.getInt("tin_ore.minHeight"),
        maxHeight: IC2Config.getInt("tin_ore.maxHeight")
    };
    OreGenerator.lead = {
        enabled: IC2Config.getBool("lead_ore.enabled"),
        count: IC2Config.getInt("lead_ore.count"),
        size: IC2Config.getInt("lead_ore.size"),
        minHeight: IC2Config.getInt("lead_ore.minHeight"),
        maxHeight: IC2Config.getInt("lead_ore.maxHeight")
    };
    OreGenerator.uranium = {
        enabled: IC2Config.getBool("uranium_ore.enabled"),
        count: IC2Config.getInt("uranium_ore.count"),
        size: IC2Config.getInt("uranium_ore.size"),
        minHeight: IC2Config.getInt("uranium_ore.minHeight"),
        maxHeight: IC2Config.getInt("uranium_ore.maxHeight")
    };
    OreGenerator.iridium = {
        chance: IC2Config.getInt("iridium_ore.chance"),
        minHeight: IC2Config.getInt("iridium_ore.minHeight"),
        maxHeight: IC2Config.getInt("iridium_ore.maxHeight")
    };
    function addFlag(oreName, flagName, disableOre) {
        if (this[oreName].enabled) {
            var flag = !Flags.addFlag(flagName);
            if (disableOre)
                this[oreName].enabled = flag;
        }
    }
    OreGenerator.addFlag = addFlag;
    function randomCoords(random, chunkX, chunkZ, minHeight, maxHeight) {
        if (minHeight === void 0) { minHeight = 0; }
        if (maxHeight === void 0) { maxHeight = 128; }
        var x = chunkX * 16 + random.nextInt(16);
        var z = chunkZ * 16 + random.nextInt(16);
        var y = random.nextInt(maxHeight - minHeight + 1) + minHeight;
        return { x: x, y: y, z: z };
    }
    OreGenerator.randomCoords = randomCoords;
    function generateOre(chunkX, chunkZ, blockID, properties, random) {
        for (var i = 0; i < properties.count; i++) {
            var coords = randomCoords(random, chunkX, chunkZ, properties.minHeight, properties.maxHeight);
            GenerationUtils.generateOre(coords.x, coords.y, coords.z, blockID, 0, properties.size, false, random.nextInt());
        }
    }
    OreGenerator.generateOre = generateOre;
})(OreGenerator || (OreGenerator = {}));
OreGenerator.addFlag("copper", "oreGenCopper");
OreGenerator.addFlag("tin", "oreGenTin");
OreGenerator.addFlag("lead", "oreGenLead", true);
OreGenerator.addFlag("uranium", "oreGenUranium", true);
Callback.addCallback("GenerateChunk", function (chunkX, chunkZ, random) {
    if (OreGenerator.copper.enabled) {
        OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreCopper, OreGenerator.copper, random);
    }
    if (OreGenerator.tin.enabled) {
        OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreTin, OreGenerator.tin, random);
    }
    if (OreGenerator.lead.enabled) {
        OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreLead, OreGenerator.lead, random);
    }
    if (OreGenerator.uranium.enabled) {
        OreGenerator.generateOre(chunkX, chunkZ, BlockID.oreUranium, OreGenerator.uranium, random);
    }
    if (random.nextDouble() < OreGenerator.iridium.chance) {
        var coords = OreGenerator.randomCoords(random, chunkX, chunkZ, OreGenerator.iridium.minHeight, OreGenerator.iridium.maxHeight);
        if (World.getBlockID(coords.x, coords.y, coords.z) == 1)
            World.setBlock(coords.x, coords.y, coords.z, BlockID.oreIridium, 0);
    }
});
var BlockRubberTreeLog = /** @class */ (function (_super) {
    __extends(BlockRubberTreeLog, _super);
    function BlockRubberTreeLog() {
        var _this = _super.call(this, "rubberTreeLog", "wood") || this;
        var name = "rubber_tree_log";
        var texture_side = ["rubber_wood", 0];
        var texture_side2 = ["rubber_wood", 2];
        var texture_top = ["rubber_wood", 1];
        _this.addVariation(name, [texture_top, texture_top, texture_side, texture_side, texture_side, texture_side], true);
        _this.addVariation(name, [texture_side, texture_side, texture_top, texture_top, texture_side2, texture_side2]);
        _this.addVariation(name, [texture_side2, texture_side2, texture_side2, texture_side2, texture_top, texture_top]);
        _this.setCategory(ItemCategory.NATURE);
        _this.setBlockMaterial("wood");
        return _this;
    }
    BlockRubberTreeLog.prototype.getDrop = function (coords, block, level) {
        return [[block.id, 1, 0]];
    };
    BlockRubberTreeLog.prototype.onPlace = function (coords, item, block, player, region) {
        if (World.canTileBeReplaced(block.id, block.data)) {
            var place = coords;
            var rotation = 0;
        }
        else {
            var place = coords.relative;
            var rotation = Math.floor(coords.side / 2);
        }
        region.setBlock(place.x, place.y, place.z, item.id, rotation);
        //World.playSound(place.x + .5, place.y + .5, place.z + .5, "dig.wood", 1, 0.8)
    };
    return BlockRubberTreeLog;
}(BlockBase));
BlockRegistry.registerBlock(new BlockRubberTreeLog());
Recipes.addFurnace(BlockID.rubberTreeLog, 17, 3);
Recipes.addShapeless({ id: 5, count: 3, data: 3 }, [{ id: BlockID.rubberTreeLog, data: -1 }]);
IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlockWithRotation("rubberTreeLogLatex", [
    { name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 0], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false },
    { name: "tile.rubberTreeLogLatex.name", texture: [["rubber_wood", 1], ["rubber_wood", 1], ["rubber_wood_latex", 1], ["rubber_wood", 0], ["rubber_wood", 0], ["rubber_wood", 0]], inCreative: false },
], "wood");
BlockRegistry.setBlockMaterial(BlockID.rubberTreeLogLatex, "wood");
BlockRegistry.registerDrop("rubberTreeLogLatex", function (coords, blockID) {
    return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
Block.setRandomTickCallback(BlockID.rubberTreeLogLatex, function (x, y, z, id, data, region) {
    if (data < 4 && Math.random() < 1 / 7) {
        region.setBlock(x, y, z, id, data + 4);
    }
});
var BlockRubberTreeSapling = /** @class */ (function (_super) {
    __extends(BlockRubberTreeSapling, _super);
    function BlockRubberTreeSapling() {
        var _this = _super.call(this, "rubberTreeSapling", {
            renderType: 1,
            destroyTime: 0,
            sound: "grass"
        }) || this;
        _this.PLACEABLE_TILES = {
            2: true,
            3: true,
            60: true
        };
        _this.addVariation("rubber_tree_sapling", [["rubber_tree_sapling", 0]], true);
        _this.setCategory(ItemCategory.NATURE);
        _this.setBlockMaterial("plant");
        _this.setShape(1 / 8, 0, 1 / 8, 7 / 8, 1, 7 / 8);
        TileRenderer.setEmptyCollisionShape(_this.id);
        Recipes.addFurnaceFuel(_this.id, -1, 100);
        ItemRegistry.registerItemFuncs(_this.id, _this);
        return _this;
    }
    BlockRubberTreeSapling.prototype.getDrop = function () {
        return [[BlockID.rubberTreeSapling, 1, 0]];
    };
    BlockRubberTreeSapling.prototype.onNeighbourChange = function (coords, block, changeCoords, region) {
        if (changeCoords.y < coords.y && !this.PLACEABLE_TILES[region.getBlockId(coords.x, coords.y - 1, coords.z)]) {
            region.destroyBlock(coords.x, coords.y, coords.z, true);
        }
    };
    BlockRubberTreeSapling.prototype.onRandomTick = function (x, y, z, block, region) {
        if (!this.PLACEABLE_TILES[region.getBlockId(x, y - 1, z)]) {
            region.destroyBlock(x, y, z, true);
        }
        else if (Math.random() < 0.05 && region.getLightLevel(x, y, z) >= 9) {
            RubberTreeGenerator.growRubberTree(region, x, y, z);
        }
    };
    BlockRubberTreeSapling.prototype.onClick = function (coords, item, block, playerUid) {
        var boneMeal = IDConverter.getIDData("bone_meal");
        if (item.id == boneMeal.id && item.data == boneMeal.data) {
            Game.prevent();
            var region = WorldRegion.getForActor(playerUid);
            var player = new PlayerEntity(playerUid);
            if (player.getGameMode() != 1) {
                player.setCarriedItem(item.id, item.count - 1, item.data);
            }
            if (player.getGameMode() == 1 || Math.random() < 0.25) {
                RubberTreeGenerator.growRubberTree(region.blockSource, coords.x, coords.y, coords.z);
            }
            region.sendPacketInRadius(coords, 64, "ic2.growPlantParticles", { x: coords.x, y: coords.y, z: coords.z });
        }
    };
    BlockRubberTreeSapling.prototype.onItemUse = function (coords, item, block, player) {
        var region = BlockSource.getDefaultForActor(player);
        var place = coords.relative;
        var tile1 = region.getBlock(place.x, place.y, place.z);
        var tile2 = region.getBlock(place.x, place.y - 1, place.z);
        if (!World.canTileBeReplaced(tile1.id, tile1.data) || !this.PLACEABLE_TILES[tile2.id]) {
            Game.prevent();
        }
    };
    return BlockRubberTreeSapling;
}(BlockBase));
BlockRegistry.registerBlock(new BlockRubberTreeSapling());
Network.addClientPacket("ic2.growPlantParticles", function (data) {
    for (var i = 0; i < 16; i++) {
        var px = data.x + Math.random();
        var pz = data.z + Math.random();
        var py = data.y + Math.random();
        Particles.addParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
    }
});
var BlockRubberTreeLeaves = /** @class */ (function (_super) {
    __extends(BlockRubberTreeLeaves, _super);
    function BlockRubberTreeLeaves() {
        var _this = _super.call(this, "rubberTreeLeaves", "leaves") || this;
        var name = "rubber_tree_leaves";
        for (var i = 0; i < 3; i++) {
            _this.addVariation(name, [[name, 0]], i == 2);
        }
        _this.setCategory(ItemCategory.NATURE);
        _this.setBlockMaterial("plant");
        return _this;
    }
    BlockRubberTreeLeaves.prototype.getDrop = function (coords, block, level, enchant, item) {
        if (level > 0 || enchant.silk || (item === null || item === void 0 ? void 0 : item.id) == 359) {
            return [[block.id, 1, 2]];
        }
        var drop = [];
        if (Math.random() < .04) {
            drop.push([BlockID.rubberTreeSapling, 1, 0]);
        }
        if (Math.random() < .02) {
            drop.push([280, 1, 0]);
        }
        return drop;
    };
    BlockRubberTreeLeaves.prototype.checkLeaves = function (x, y, z, region, explored) {
        var blockID = region.getBlockId(x, y, z);
        if (blockID == BlockID.rubberTreeLog || blockID == BlockID.rubberTreeLogLatex) {
            return true;
        }
        if (blockID == BlockID.rubberTreeLeaves) {
            explored[x + ':' + y + ':' + z] = true;
        }
        return false;
    };
    BlockRubberTreeLeaves.prototype.checkLeavesFor6Sides = function (x, y, z, region, explored) {
        return this.checkLeaves(x - 1, y, z, region, explored) ||
            this.checkLeaves(x + 1, y, z, region, explored) ||
            this.checkLeaves(x, y, z - 1, region, explored) ||
            this.checkLeaves(x, y, z + 1, region, explored) ||
            this.checkLeaves(x, y - 1, z, region, explored) ||
            this.checkLeaves(x, y + 1, z, region, explored);
    };
    BlockRubberTreeLeaves.prototype.updateLeaves = function (x, y, z, region) {
        for (var xx = x - 1; xx <= x + 1; xx++) {
            for (var yy = y - 1; yy <= y + 1; yy++) {
                for (var zz = z - 1; zz <= z + 1; zz++) {
                    var block = region.getBlock(xx, yy, zz);
                    if (block.id == BlockID.rubberTreeLeaves && block.data == 0) {
                        region.setBlock(xx, yy, zz, BlockID.rubberTreeLeaves, 1);
                    }
                }
            }
        }
    };
    BlockRubberTreeLeaves.prototype.onRandomTick = function (x, y, z, block, region) {
        if (block.data == 1) {
            var explored = {};
            explored[x + ':' + y + ':' + z] = true;
            for (var i = 0; i < 4; i++) {
                var checkingLeaves = explored;
                explored = {};
                for (var coords in checkingLeaves) {
                    var coordArray = coords.split(':').map(function (c) { return parseInt(c); });
                    if (this.checkLeavesFor6Sides(coordArray[0], coordArray[1], coordArray[2], region, explored)) {
                        region.setBlock(x, y, z, BlockID.rubberTreeLeaves, 0);
                        return;
                    }
                }
            }
            region.setBlock(x, y, z, 0, 0);
            this.updateLeaves(x, y, z, region);
            var drop = this.getDrop(new Vector3(x, y, z), block, 0, ToolAPI.getEnchantExtraData(), null);
            for (var _i = 0, drop_2 = drop; _i < drop_2.length; _i++) {
                var item = drop_2[_i];
                region.spawnDroppedItem(x, y, z, item[0], item[1], item[2]);
            }
        }
    };
    BlockRubberTreeLeaves.prototype.onDestroy = function (coords, block, region, player) {
        this.updateLeaves(coords.x, coords.y, coords.z, region);
    };
    BlockRubberTreeLeaves.prototype.onBreak = function (coords, block, region) {
        _super.prototype.onBreak.call(this, coords, block, region);
        this.updateLeaves(coords.x, coords.y, coords.z, region);
    };
    return BlockRubberTreeLeaves;
}(BlockBase));
BlockRegistry.registerBlock(new BlockRubberTreeLeaves());
var BlockOre = /** @class */ (function (_super) {
    __extends(BlockOre, _super);
    function BlockOre(id, oreName, miningLevel) {
        var _this = _super.call(this, id, "ore") || this;
        var name = oreName + "_ore";
        var textureName = "ore_" + oreName;
        _this.addVariation(name, [[textureName, 0]], true);
        _this.setBlockMaterial("stone", miningLevel);
        return _this;
    }
    return BlockOre;
}(BlockBase));
BlockRegistry.registerBlock(new BlockOre("oreCopper", "copper", 2));
BlockRegistry.registerBlock(new BlockOre("oreTin", "tin", 2));
BlockRegistry.registerBlock(new BlockOre("oreLead", "lead", 2));
BlockRegistry.registerBlock(new BlockOre("oreUranium", "uranium", 3));
BlockRegistry.registerBlock(new BlockOre("oreIridium", "iridium", 4));
BlockRegistry.registerDrop("oreIridium", function (coords, blockID, blockData, level, enchant) {
    if (level > 3) {
        if (enchant.silk) {
            return [[blockID, 1, 0]];
        }
        var drop = [[ItemID.iridiumChunk, 1, 0]];
        if (Math.random() < enchant.fortune / 6)
            drop.push(drop[0]);
        ToolAPI.dropOreExp(coords, 12, 28, enchant.experience);
        return drop;
    }
    return [];
});
Item.addCreativeGroup("ores", Translation.translate("Ores"), [
    BlockID.oreCopper,
    BlockID.oreTin,
    BlockID.oreLead,
    BlockID.oreUranium,
    BlockID.oreIridium
]);
var BlockResource = /** @class */ (function (_super) {
    __extends(BlockResource, _super);
    function BlockResource(id, resourceName, miningLevel) {
        var _this = _super.call(this, id, "stone") || this;
        var name = resourceName + "_block";
        var textureName = "block_" + resourceName;
        _this.addVariation(name, [[textureName, 0]], true);
        _this.setBlockMaterial("stone", miningLevel);
        _this.setDestroyTime(5);
        return _this;
    }
    return BlockResource;
}(BlockBase));
BlockRegistry.registerBlock(new BlockResource("blockCopper", "copper", 2));
BlockRegistry.registerBlock(new BlockResource("blockTin", "tin", 2));
BlockRegistry.registerBlock(new BlockResource("blockBronze", "bronze", 2));
BlockRegistry.registerBlock(new BlockResource("blockLead", "lead", 2));
BlockRegistry.registerBlock(new BlockResource("blockSteel", "steel", 2));
BlockRegistry.registerBlock(new BlockResource("blockSilver", "silver", 3));
BlockRegistry.registerBlock(new BlockResource("blockUranium", "uranium", 3));
Item.addCreativeGroup("blockResource", Translation.translate("Resource Blocks"), [
    BlockID.blockCopper,
    BlockID.blockTin,
    BlockID.blockBronze,
    BlockID.blockLead,
    BlockID.blockSteel,
    BlockID.blockSilver,
    BlockID.blockUranium
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.blockCopper, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotCopper, 0]);
    Recipes.addShaped({ id: BlockID.blockTin, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotTin, 0]);
    Recipes.addShaped({ id: BlockID.blockBronze, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotBronze, 0]);
    Recipes.addShaped({ id: BlockID.blockLead, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotLead, 0]);
    Recipes.addShaped({ id: BlockID.blockSteel, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotSteel, 0]);
    Recipes.addShaped({ id: BlockID.blockSilver, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.ingotSilver, 0]);
    Recipes.addShaped({ id: BlockID.blockUranium, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.uranium238, 0]);
    Recipes.addShapeless({ id: ItemID.ingotCopper, count: 9, data: 0 }, [{ id: BlockID.blockCopper, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotTin, count: 9, data: 0 }, [{ id: BlockID.blockTin, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotBronze, count: 9, data: 0 }, [{ id: BlockID.blockBronze, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotLead, count: 9, data: 0 }, [{ id: BlockID.blockLead, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotSteel, count: 9, data: 0 }, [{ id: BlockID.blockSteel, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.ingotSilver, count: 9, data: 0 }, [{ id: BlockID.blockSilver, data: 0 }]);
    Recipes.addShapeless({ id: ItemID.uranium238, count: 9, data: 0 }, [{ id: BlockID.blockUranium, data: 0 }]);
});
var BlockStone = /** @class */ (function (_super) {
    __extends(BlockStone, _super);
    function BlockStone(id, name, texture, miningLevel) {
        if (miningLevel === void 0) { miningLevel = 1; }
        var _this = _super.call(this, id, "stone") || this;
        _this.addVariation(name, texture, true);
        _this.setBlockMaterial("stone", miningLevel);
        _this.setDestroyTime(3);
        return _this;
    }
    return BlockStone;
}(BlockBase));
// legacy
BlockRegistry.createBlockType("machine", {
    extends: "stone",
    destroyTime: 3
});
BlockRegistry.registerBlock(new BlockStone("machineBlockBasic", "machine_block", [["machine_top", 0]]));
BlockRegistry.registerBlock(new BlockStone("machineBlockAdvanced", "advanced_machine_block", [["machine_advanced", 0]]));
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.machineBlockBasic, count: 1, data: 0 }, [
        "xxx",
        "x x",
        "xxx"
    ], ['x', ItemID.plateIron, -1]);
    Recipes.addShaped({ id: BlockID.machineBlockAdvanced, count: 1, data: 0 }, [
        "scs",
        "a#a",
        "scs"
    ], ['#', BlockID.machineBlockBasic, -1, 'c', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, 's', ItemID.plateSteel, -1]);
    Recipes.addShaped({ id: BlockID.machineBlockAdvanced, count: 1, data: 0 }, [
        "sas",
        "c#c",
        "sas"
    ], ['#', BlockID.machineBlockBasic, -1, 'c', ItemID.carbonPlate, -1, 'a', ItemID.plateAlloy, -1, 's', ItemID.plateSteel, -1]);
    Recipes.addShapeless({ id: ItemID.plateIron, count: 8, data: 0 }, [{ id: BlockID.machineBlockBasic, data: 0 }]);
});
BlockRegistry.createBlock("reinforcedStone", [
    { name: "reinforced_stone", texture: [["reinforced_block", 0]], inCreative: true }
], {
    extends: "stone",
    destroyTime: 25,
    explosionResistance: 150,
});
BlockRegistry.setBlockMaterial(BlockID.reinforcedStone, "stone", 2);
BlockRegistry.setDestroyLevel("reinforcedStone", 2);
BlockRegistry.createBlock("reinforcedGlass", [
    { name: "reinforced_glass", texture: [["reinforced_glass", 0]], inCreative: true }
], {
    baseBlock: 1,
    destroyTime: 25,
    explosionResistance: 150,
    renderLayer: 1,
    sound: "stone"
});
BlockRegistry.setBlockMaterial(BlockID.reinforcedGlass, "stone", 2);
BlockRegistry.setDestroyLevel("reinforcedGlass", 2);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.reinforcedStone, count: 8, data: 0 }, [
        "aaa",
        "axa",
        "aaa"
    ], ['x', ItemID.plateAlloy, 0, 'a', 1, 0]);
    Recipes.addShaped({ id: BlockID.reinforcedGlass, count: 7, data: 0 }, [
        "axa",
        "aaa",
        "axa"
    ], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
    Recipes.addShaped({ id: BlockID.reinforcedGlass, count: 7, data: 0 }, [
        "aaa",
        "xax",
        "aaa"
    ], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
});
BlockRegistry.createBlockType("cable", {
    destroyTime: 0.05,
    explosionResistance: 0.5,
    renderLayer: 1,
});
BlockRegistry.createBlock("cableTin0", [
    { name: "tile.cableTin.name", texture: [["cable_tin", 0]], inCreative: false }
], "cable");
CableRegistry.createBlock("cableTin1", { name: "tile.cableTin.name", texture: "cable_tin1" }, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableTin0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableTin1, "stone");
BlockRegistry.createBlock("cableCopper0", [
    { name: "tile.cableCopper.name", texture: [["cable_copper", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableCopper1", { name: "tile.cableCopper.name", texture: "cable_copper1" }, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableCopper0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableCopper1, "stone");
BlockRegistry.createBlock("cableGold0", [
    { name: "tile.cableGold.name", texture: [["cable_gold", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableGold1", { name: "tile.cableGold.name", texture: "cable_gold1" }, "cable");
CableRegistry.createBlock("cableGold2", { name: "tile.cableGold.name", texture: "cable_gold2" }, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableGold0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableGold1, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableGold2, "stone");
BlockRegistry.createBlock("cableIron0", [
    { name: "tile.cableIron.name", texture: [["cable_iron", 0]], inCreative: false },
], "cable");
CableRegistry.createBlock("cableIron1", { name: "tile.cableIron.name", texture: "cable_iron1" }, "cable");
CableRegistry.createBlock("cableIron2", { name: "tile.cableIron.name", texture: "cable_iron2" }, "cable");
CableRegistry.createBlock("cableIron3", { name: "tile.cableIron.name", texture: "cable_iron3" }, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableIron0, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron1, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron2, "stone");
BlockRegistry.setBlockMaterial(BlockID.cableIron3, "stone");
CableRegistry.createBlock("cableOptic", { name: "tile.cableOptic.name", texture: "cable_glass" }, "cable");
BlockRegistry.setBlockMaterial(BlockID.cableOptic, "stone");
// energy net
CableRegistry.registerCable("cableTin", 32, 1);
CableRegistry.registerCable("cableCopper", 128, 1);
CableRegistry.registerCable("cableGold", 512, 2);
CableRegistry.registerCable("cableIron", 2048, 3);
CableRegistry.registerCable("cableOptic", 8192);
// block model
TileRenderer.setupWireModel(BlockID.cableTin0, -1, 4 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableTin1, 6 / 16);
TileRenderer.setupWireModel(BlockID.cableCopper0, -1, 4 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableCopper1, 6 / 16);
TileRenderer.setupWireModel(BlockID.cableGold0, -1, 3 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableGold1, 5 / 16);
CableRegistry.setupModel(BlockID.cableGold2, 7 / 16);
TileRenderer.setupWireModel(BlockID.cableIron0, -1, 6 / 16, "ic-wire");
CableRegistry.setupModel(BlockID.cableIron1, 8 / 16);
CableRegistry.setupModel(BlockID.cableIron2, 10 / 16);
CableRegistry.setupModel(BlockID.cableIron3, 12 / 16);
CableRegistry.setupModel(BlockID.cableOptic, 1 / 4);
BlockRegistry.createBlock("miningPipe", [
    { name: "mining_pipe", texture: [["mining_pipe", 0]], inCreative: true },
    { name: "tile.mining_pipe.name", texture: [["mining_pipe", 1]], inCreative: false }
], { baseBlock: 1, destroyTime: 2, renderLayer: 3, sound: "stone" });
Block.setBlockShape(BlockID.miningPipe, { x: 5 / 16, y: 0, z: 5 / 16 }, { x: 11 / 16, y: 1, z: 11 / 16 }, 0);
BlockRegistry.setBlockMaterial(BlockID.miningPipe, "stone", 1);
BlockRegistry.setDestroyLevel("miningPipe", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.miningPipe, count: 8, data: 0 }, [
        "p p",
        "p p",
        "pxp",
    ], ['x', ItemID.treetap, 0, 'p', ItemID.plateIron, 0]);
});
var Agriculture;
(function (Agriculture) {
    var CropTile = /** @class */ (function (_super) {
        __extends(CropTile, _super);
        function CropTile() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                crop: null,
                dirty: true,
                statGrowth: 0,
                statGain: 0,
                statResistance: 0,
                storageNutrients: 0,
                storageWater: 0,
                storageWeedEX: 0,
                terrainAirQuality: -1,
                terrainHumidity: -1,
                terrainNutrients: -1,
                currentSize: 1,
                growthPoints: 0,
                scanLevel: 0,
                crossingBase: false
            };
            _this.crop = null;
            return _this;
        }
        CropTile.prototype.renderModel = function () {
            var _a, _b;
            var texture = [
                (_a = this.networkData.getString("textureName")) !== null && _a !== void 0 ? _a : "stick",
                (_b = this.networkData.getInt("textureData")) !== null && _b !== void 0 ? _b : 0
            ];
            BlockRenderer.mapAtCoords(this.x, this.y, this.z, TileRenderer.getCropModel(texture));
        };
        CropTile.prototype.clientLoad = function () {
            var _this = this;
            this.renderModel();
            this.networkData.addOnDataChangedListener(function (data, isExternal) {
                _this.renderModel();
            });
        };
        CropTile.prototype.clientUnload = function () {
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        };
        CropTile.prototype.onInit = function () {
            if (this.data.crop)
                this.crop = Agriculture.CropCardManager.getCropCardByIndex(this.data.crop);
            this.updateRender();
        };
        CropTile.prototype.onTick = function () {
            this.checkGround();
            var entities = this.region.listEntitiesInAABB(this.x, this.y, this.z, this.x + 1, this.y + 1, this.z + 1, 1, false);
            if (entities.length > 0) {
                for (var _i = 0, entities_3 = entities; _i < entities_3.length; _i++) {
                    var playerUid = entities_3[_i];
                    this.checkPlayerRunning(playerUid);
                }
            }
            if (World.getThreadTime() % 192 == 0)
                this.performTick();
        };
        CropTile.prototype.onLongClick = function (playerUid) {
            if (this.data.crossingBase) {
                this.region.dropAtBlock(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
                this.data.crossingBase = false;
                this.data.dirty = true;
                this.updateRender();
                return true;
            }
            if (this.crop) {
                return this.crop.onLeftClick(this, playerUid);
            }
            this.region.destroyBlock(this, true, playerUid);
            return false;
        };
        CropTile.prototype.onItemClick = function (id, count, data, coords, playerUid, extra) {
            if (id != 0) {
                var card = Agriculture.CropCardManager.getCardFromSeed(new ItemStack(id, count, data, extra));
                if (id == ItemID.agriculturalAnalyzer)
                    return;
                if (id == ItemID.debugItem && this.crop) {
                    this.data.currentSize = this.crop.getMaxSize();
                    this.updateRender();
                    return;
                }
                if (Game.isDeveloperMode && id == IDConverter.getID("bone_meal") && this.data.crossingBase) {
                    this.attemptCrossing();
                    return;
                }
                var player = new PlayerEntity(playerUid);
                if (!this.crop && !this.data.crossingBase && id == ItemID.cropStick) {
                    this.data.crossingBase = true;
                    this.data.dirty = true;
                    player.decreaseCarriedItem();
                    this.updateRender();
                    return;
                }
                if (this.crop && id == ItemID.fertilizer) {
                    if (this.applyFertilizer(true))
                        this.data.dirty = true;
                    player.decreaseCarriedItem();
                    return;
                }
                if (id == ItemID.cellWater && count == 1) {
                    var amount = this.applyHydration(1000 - data);
                    if (amount > 0) {
                        if (data + amount >= 1000) {
                            player.setCarriedItem(ItemID.cellEmpty, 1, 0);
                        }
                        else {
                            player.setCarriedItem(id, 1, data + amount);
                        }
                    }
                    return;
                }
                var stack = new ItemStack(id, count, data, extra);
                if (this.applyWeedEx(stack, true)) {
                    this.data.dirty = true;
                    return;
                }
                if (!this.crop && !this.data.crossingBase && card) {
                    this.reset();
                    this.data.crop = Agriculture.CropCardManager.getIndexByCropCardID(card.getID());
                    this.crop = Agriculture.CropCardManager.getCropCardByIndex(this.data.crop);
                    var baseSeed = card.getBaseSeed();
                    this.data.currentSize = baseSeed.size;
                    this.data.statGain = baseSeed.gain;
                    this.data.statGrowth = baseSeed.growth;
                    this.data.statResistance = baseSeed.resistance;
                    player.decreaseCarriedItem();
                    this.updateRender();
                    return;
                }
            }
            if (this.crop && this.crop.canBeHarvested(this))
                this.crop.onRightClick(this, playerUid);
        };
        CropTile.prototype.destroyBlock = function (coords, playerUid) {
            _super.prototype.destroyBlock.call(this, coords, playerUid);
            this.region.dropItem(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
            if (this.data.crossingBase)
                this.region.dropItem(this.x, this.y, this.z, ItemID.cropStick, 1, 0);
            if (this.crop)
                this.crop.onLeftClick(this, playerUid);
        };
        CropTile.prototype.updateRender = function () {
            var texture = ["stick", 0];
            if (this.crop) {
                texture[0] = this.crop.getTexture();
                texture[1] = this.data.currentSize;
            }
            else if (this.data.crossingBase)
                texture[1] = 1;
            this.networkData.putString("textureName", texture[0]);
            this.networkData.putInt("textureData", texture[1]);
            this.networkData.sendChanges();
        };
        CropTile.prototype.checkPlayerRunning = function (playerUid) {
            if (!this.crop)
                return;
            var coords = Entity.getPosition(playerUid);
            var playerX = Math.floor(coords.x);
            var playerY = Math.floor(coords.y);
            var playerZ = Math.floor(coords.z);
            if (playerX == this.x && playerY - 1 == this.y && playerZ == this.z) {
                var vel = Entity.getVelocity(playerUid);
                var horizontalVel = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
                if (horizontalVel > 0.15 && this.crop.onEntityCollision(this, playerUid)) {
                    this.region.destroyBlock(this, true, playerUid);
                }
            }
        };
        CropTile.prototype.checkGround = function () {
            if (this.region.getBlockId(this.x, this.y - 1, this.z) != 60) {
                this.region.destroyBlock(this, true);
            }
        };
        CropTile.prototype.performTick = function () {
            if (World.getThreadTime() % 768 == 0) {
                this.updateTerrainHumidity();
                this.updateTerrainNutrients();
                this.updateTerrainAirQuality();
            }
            if (!this.crop && (!this.data.crossingBase || !this.attemptCrossing())) {
                if (MathUtil.randomInt(0, 100) != 0 || this.data.storageWeedEX > 0) {
                    if (this.data.storageWeedEX > 0 && MathUtil.randomInt(0, 10) == 0) {
                        this.data.storageWeedEX--;
                    }
                    return;
                }
                this.reset();
                this.data.crossingBase = false;
                this.data.crop = Agriculture.CropCardManager.getIndexByCropCardID("weed");
                this.crop = Agriculture.CropCardManager.getCardFromID("weed");
                this.data.currentSize = 1;
                this.updateRender();
            }
            if (this.crop) {
                this.crop.tick(this);
                if (this.crop.canGrow(this)) {
                    this.performGrowthTick();
                    var growDuration = this.crop.getGrowthDuration(this);
                    if (this.data.growthPoints >= growDuration) {
                        this.data.growthPoints = 0;
                        this.data.currentSize = this.data.currentSize + 1;
                        this.data.dirty = true;
                        this.updateRender();
                    }
                }
            }
            if (this.data.storageNutrients > 0)
                this.data.storageNutrients--;
            if (this.data.storageWater > 0)
                this.data.storageWater--;
            if (this.crop.isWeed(this) && MathUtil.randomInt(0, 50) - this.data.statGrowth <= 2) {
                this.performWeedWork();
            }
        };
        CropTile.prototype.updateTerrainHumidity = function () {
            var humidity = Agriculture.BiomeBonusesManager.getHumidityBiomeBonus(this.x, this.z);
            if (this.region.getBlockData(this.x, this.y - 1, this.z) == 7)
                humidity += 2;
            if (this.data.storageWater >= 5)
                humidity += 2;
            humidity += (this.data.storageWater + 24) / 25;
            this.data.terrainHumidity = humidity;
        };
        CropTile.prototype.updateTerrainNutrients = function () {
            var nutrients = Agriculture.BiomeBonusesManager.getNutrientBiomeBonus(this.x, this.z);
            nutrients += (this.data.terrainNutrients + 19) / 20;
            for (var i = 2; i < 5; ++i) {
                if (this.region.getBlockId(this.x, this.y - i, this.z) == 3)
                    nutrients++;
            }
            this.data.terrainNutrients = nutrients;
        };
        CropTile.prototype.updateTerrainAirQuality = function () {
            var value = 0;
            var height = Math.floor((this.y - 64) / 15);
            if (height > 4)
                height = 4;
            if (height < 0)
                height = 0;
            var fresh = 9;
            for (var x = this.x - 1; x < this.x + 2; x++) {
                for (var z = this.z - 1; z < this.z + 2; z++) {
                    if (this.region.getBlockId(x, this.y, z))
                        fresh--;
                }
            }
            if (this.region.canSeeSky(this.x, this.y + 1, this.z))
                value += 2;
            value += Math.floor(fresh / 2);
            value += height;
            this.data.terrainAirQuality = value;
        };
        CropTile.prototype.performGrowthTick = function () {
            if (!this.crop)
                return;
            var totalGrowth = 0;
            var baseGrowth = 3 + MathUtil.randomInt(0, 7) + this.data.statGrowth;
            var properties = this.crop.getProperties();
            var sumOfStats = this.data.statGrowth + this.data.statGain + this.data.statResistance;
            var minimumQuality = (properties.tier - 1) * 4 + sumOfStats;
            minimumQuality = Math.max(minimumQuality, 0);
            var providedQuality = 75;
            if (providedQuality >= minimumQuality) {
                totalGrowth = baseGrowth * (100 + (providedQuality - minimumQuality)) / 100;
            }
            else {
                var aux = (minimumQuality - providedQuality) * 4;
                if (aux > 100 && MathUtil.randomInt(0, 32) > this.data.statResistance) {
                    totalGrowth = 0;
                    this.reset();
                    this.updateRender();
                }
                else {
                    totalGrowth = baseGrowth * (100 - aux) / 100;
                    totalGrowth = Math.max(totalGrowth, 0);
                }
            }
            this.data.growthPoints += Math.round(totalGrowth);
        };
        CropTile.prototype.performWeedWork = function () {
            var relativeCropCoords = this.getRelativeCoords();
            var coords = relativeCropCoords[MathUtil.randomInt(0, 3)];
            var preCoords = [this.x + coords[0], this.y + coords[0], this.z + coords[0]];
            if (this.region.getBlockId(preCoords[0], preCoords[1], preCoords[2]) == BlockID.crop) {
                var TE = this.region.getTileEntity(preCoords[0], preCoords[1], preCoords[2]);
                if (!TE.crop || (!TE.crop.isWeed(this) && !TE.hasWeedEX() && MathUtil.randomInt(0, 32) >= TE.data.statResistance)) {
                    var newGrowth = Math.max(this.data.statGrowth, TE.data.statGrowth);
                    if (newGrowth < 31 && MathUtil.randomInt(0, 1))
                        newGrowth++;
                    TE.reset();
                    TE.data.crop = Agriculture.CropCardManager.getIndexByCropCardID("weed");
                    TE.crop = Agriculture.CropCardManager.getCardFromID("weed");
                    TE.data.currentSize = 1;
                    TE.data.statGrowth = newGrowth;
                    TE.updateRender();
                }
            }
            else if (this.region.getBlockId(preCoords[0], preCoords[1] - 1, preCoords[2]) == 60) {
                this.region.setBlock(preCoords[0], preCoords[1] - 1, preCoords[2], 2, 0);
            }
        };
        CropTile.prototype.reset = function () {
            this.data.crop = null;
            this.crop = undefined;
            this.data.statGain = 0;
            this.data.statResistance = 0;
            this.data.statGrowth = 0;
            this.data.terrainAirQuality = -1;
            this.data.terrainHumidity = -1;
            this.data.terrainNutrients = -1;
            this.data.growthPoints = 0;
            this.data.scanLevel = 0;
            this.data.currentSize = 1;
            this.data.dirty = true;
        };
        CropTile.prototype.hasWeedEX = function () {
            if (this.data.storageWeedEX > 0) {
                this.data.storageWeedEX -= 5;
                return true;
            }
            return false;
        };
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
        CropTile.prototype.attemptCrossing = function () {
            if (MathUtil.randomInt(0, 3) != 0)
                return false;
            var cropCoords = this.askCropJoinCross(this.getRelativeCoords());
            if (cropCoords.length < 2)
                return false;
            var cropCards = Agriculture.CropCardManager.getALLCropCards();
            var ratios = [];
            var total = 0;
            for (var j in cropCards) {
                var crop = cropCards[j];
                for (var crd in cropCoords) {
                    var coords = cropCoords[crd];
                    var tileEnt = this.region.getTileEntity(coords.x, coords.y, coords.z);
                    total += this.calculateRatioFor(crop, tileEnt.crop);
                }
                ratios[j] = total;
            }
            var search = MathUtil.randomInt(0, total);
            var min = 0;
            var max = ratios.length - 1;
            while (min < max) {
                var cur = Math.floor((min + max) / 2);
                var value = ratios[cur];
                if (search < value) {
                    max = cur;
                }
                else {
                    min = cur + 1;
                }
            }
            this.data.crossingBase = false;
            this.crop = cropCards[min];
            this.data.crop = min;
            this.data.dirty = true;
            this.data.currentSize = 1;
            this.data.statGrowth = 0;
            this.data.statResistance = 0;
            this.data.statGain = 0;
            for (var i in cropCoords) {
                var te2 = this.region.getTileEntity(cropCoords[i].x, cropCoords[i].y, cropCoords[i].z);
                this.data.statGrowth += te2.data.statGrowth;
                this.data.statResistance += te2.data.statResistance;
                this.data.statGain += te2.data.statGain;
            }
            var count = cropCoords.length;
            this.data.statGrowth = Math.floor(this.data.statGrowth / count);
            this.data.statResistance = Math.floor(this.data.statResistance / count);
            this.data.statGain = Math.floor(this.data.statGain / count);
            this.data.statGrowth += Math.round(MathUtil.randomInt(0, 1 + 2 * count) - count);
            this.data.statGain += Math.round(MathUtil.randomInt(0, 1 + 2 * count) - count);
            this.data.statResistance += Math.round(MathUtil.randomInt(0, 1 + 2 * count) - count);
            this.data.statGrowth = this.lim(this.data.statGrowth, 0, 31);
            this.data.statGain = this.lim(this.data.statGain, 0, 31);
            this.data.statResistance = this.lim(this.data.statResistance, 0, 31);
            this.updateRender();
            return true;
        };
        CropTile.prototype.lim = function (value, min, max) {
            if (value <= min)
                return min;
            if (value >= max)
                return max;
            return value;
        };
        CropTile.prototype.getRelativeCoords = function () {
            return [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
        };
        CropTile.prototype.askCropJoinCross = function (coordsArray) {
            var cropsCoords = [];
            for (var r in coordsArray) {
                var pos = coordsArray[r];
                var coords = { x: this.x + pos[0], y: this.y + pos[1], z: this.z + pos[2] };
                var sideTileEntity = this.region.getTileEntity(coords.x, coords.y, coords.z);
                var blockId = this.region.getBlockId(coords.x, coords.y, coords.z);
                if (!sideTileEntity || !sideTileEntity.crop || blockId != BlockID.crop)
                    continue;
                if (sideTileEntity.crop.canGrow(sideTileEntity) || !sideTileEntity.crop.canCross(sideTileEntity))
                    continue;
                var base = 4;
                if (sideTileEntity.data.statGrowth >= 16)
                    base++;
                if (sideTileEntity.data.statGrowth >= 30)
                    base++;
                if (sideTileEntity.data.statResistance >= 28) {
                    base += 27 - sideTileEntity.data.statResistance;
                }
                if (base >= MathUtil.randomInt(0, 20))
                    cropsCoords.push(coords);
            }
            return cropsCoords;
        };
        CropTile.prototype.calculateRatioFor = function (newCrop, oldCrop) {
            if (newCrop.getID() == oldCrop.getID())
                return 500;
            var value = 0;
            var propOld = oldCrop.getProperties();
            var propNew = newCrop.getProperties();
            for (var i in propOld) {
                var delta = Math.abs(propOld[i] - propNew[i]);
                value += 2 - delta;
            }
            var attributesOld = oldCrop.getAttributes();
            var attributesNew = newCrop.getAttributes();
            for (var iO in attributesOld) {
                for (var iN in attributesNew) {
                    var attO = attributesOld[iO];
                    var attN = attributesNew[iN];
                    if (attO == attN)
                        value += 5;
                }
            }
            var diff = propNew.tier - propOld.tier;
            if (diff > 1)
                value -= 2 * diff;
            if (diff < -3)
                value += diff;
            return Math.max(value, 0);
        };
        CropTile.prototype.applyFertilizer = function (manual) {
            if (this.data.storageNutrients >= 100)
                return false;
            this.data.storageNutrients += manual ? 100 : 90;
            return true;
        };
        CropTile.prototype.applyWeedEx = function (stack, manual) {
            if (stack.id == ItemID.weedEx) {
                var limit = manual ? 100 : 150;
                if (this.data.storageWeedEX >= limit)
                    return false;
                var amount = manual ? 50 : 100;
                this.data.storageWeedEX += amount;
                if (manual)
                    stack.applyDamage(1);
                return true;
            }
            return false;
        };
        CropTile.prototype.applyHydration = function (amount) {
            var limit = 200;
            if (this.data.storageWater >= limit)
                return 0;
            var relativeAmount = limit - this.data.storageWater;
            amount = Math.min(relativeAmount, amount);
            this.data.storageWater += amount;
            return amount;
        };
        CropTile.prototype.tryPlantIn = function (cropCardID, size, statGr, statGa, statRe, scan) {
            var cropCard = Agriculture.CropCardManager.getCropCardByIndex(cropCardID);
            if (!cropCard || cropCard.getID() == "weed" || this.data.crossingBase)
                return false;
            this.reset();
            this.data.crop = cropCardID;
            this.crop = cropCard;
            this.data.currentSize = size;
            this.data.statGain = statGa;
            this.data.statGrowth = statGr;
            this.data.statResistance = statRe;
            this.data.scanLevel = scan;
            this.updateRender();
            return true;
        };
        CropTile.prototype.performHarvest = function () {
            if (!this.crop || !this.crop.canBeHarvested(this))
                return null;
            var chance = this.crop.getDropGainChance(this);
            chance *= Math.pow(1.03, this.data.statGain);
            var dropCount2 = Math.max(0, Math.round(this.nextGaussian() * chance * 0.6827 + chance));
            var ret = [];
            for (var i = 0; i < dropCount2; i++) {
                ret[i] = this.crop.getGain(this);
                if (ret[i] && MathUtil.randomInt(0, 100) <= this.data.statGain) {
                    ret[i] = ret[i].count++;
                }
            }
            this.data.currentSize = this.crop.getSizeAfterHarvest(this);
            this.data.dirty = true;
            this.updateRender();
            return ret;
        };
        CropTile.prototype.performManualHarvest = function () {
            var dropItems = this.performHarvest();
            if (!dropItems || !dropItems.length)
                return;
            for (var _i = 0, dropItems_1 = dropItems; _i < dropItems_1.length; _i++) {
                var item = dropItems_1[_i];
                this.region.dropItem(this.x, this.y, this.z, item);
            }
            return true;
        };
        CropTile.prototype.nextGaussian = function () {
            var v1, v2, s;
            do {
                v1 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
                v2 = 2 * Math.random() - 1; // Between -1.0 and 1.0.
                s = v1 * v1 + v2 * v2;
            } while (s >= 1);
            var norm = Math.sqrt(-2 * Math.log(s) / s);
            return v1 * norm;
        };
        CropTile.prototype.pick = function () {
            if (!this.crop)
                return false;
            var bonus = this.crop.canBeHarvested(this);
            var firstchance = this.crop.getSeedDropChance(this);
            firstchance *= Math.pow(1.1, this.data.statResistance);
            var dropCount = 0;
            if (bonus) {
                if (Math.random() <= (firstchance + 1) * .8)
                    dropCount++;
                var chance = this.crop.getSeedDropChance(this) + this.data.statGrowth / 100;
                chance *= Math.pow(.95, this.data.statGain - 23);
                if (Math.random() <= chance)
                    dropCount++;
            }
            else if (Math.random() <= firstchance * 1.5)
                dropCount++;
            var item = this.crop.getSeeds(this);
            if (item) {
                this.region.dropItem(this.x, this.y, this.z, item.id, dropCount, item.data, item.extra);
            }
            this.reset();
            this.updateRender();
            return true;
        };
        CropTile.prototype.generateSeeds = function (data) {
            var extra = Agriculture.SeedExtraCreator.generateExtraFromValues(data);
            return new ItemStack(ItemID.cropSeedBag, 1, this.data.crop, extra);
        };
        CropTile.prototype.isBlockBelow = function (reqBlockID) {
            if (!this.crop)
                return false;
            var rootsLength = this.crop.getRootsLength(this);
            for (var i = 1; i < rootsLength; i++) {
                var blockID = this.region.getBlockId(this.x, this.y - i, this.z);
                if (!blockID)
                    return false;
                if (reqBlockID == blockID)
                    return true;
            }
            return false;
        };
        __decorate([
            BlockEngine.Decorators.ClientSide
        ], CropTile.prototype, "renderModel", null);
        return CropTile;
    }(TileEntityBase));
    Agriculture.CropTile = CropTile;
})(Agriculture || (Agriculture = {}));
Callback.addCallback("DestroyBlockStart", function (coords, block, playerUid) {
    if (block.id == BlockID.crop) {
        // ? TEST IT!!! i think it can cause problem
        // Block.setTempDestroyTime(block.id, 1000);
        Network.sendToServer("icpe.cropDestroyStart", { x: coords.x, y: coords.y, z: coords.z });
    }
});
Network.addServerPacket("icpe.cropDestroyStart", function (client, data) {
    var region = WorldRegion.getForActor(client.getPlayerUid());
    var tileEntity = region.getTileEntity(data.x, data.y, data.z);
    if (tileEntity) {
        if (tileEntity.onLongClick(client.getPlayerUid())) {
            Game.prevent();
        }
    }
});
/// <reference path="CropTile.ts"/>
BlockRegistry.createBlock("crop", [
    { name: "crop", texture: [["stick", 0]], inCreative: false }
], { baseBlock: 59, renderType: 6, explosionResistance: 0 });
BlockRegistry.setBlockMaterial(BlockID.crop, "wood");
TileRenderer.setEmptyCollisionShape(BlockID.crop);
BlockRenderer.enableCoordMapping(BlockID.crop, 0, TileRenderer.getCropModel(["stick", 0]));
Block.registerDropFunctionForID(BlockID.crop, function (coords, id, data, diggingLevel, toolLevel) {
    return [];
});
TileEntity.registerPrototype(BlockID.crop, new Agriculture.CropTile());
/// <reference path="../Generator.ts" />
BlockRegistry.createBlock("primalGenerator", [
    { name: "Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.primalGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.primalGenerator, 1);
TileRenderer.setStandardModelWithRotation(BlockID.primalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.primalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["generator", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.primalGenerator);
Callback.addCallback("PreLoaded", function () {
    Item.addCreativeGroup("EUGenerators", Translation.translate("Electric Generators"), [
        BlockID.primalGenerator,
        BlockID.geothermalGenerator,
        BlockID.semifluidGenerator,
        BlockID.solarPanel,
        BlockID.genWindmill,
        BlockID.genWatermill,
        BlockID.rtGenerator,
        BlockID.stirlingGenerator,
        BlockID.kineticGenerator,
        BlockID.nuclearReactor,
        BlockID.reactorChamber
    ]);
    Recipes.addShaped({ id: BlockID.primalGenerator, count: 1, data: 0 }, [
        "x",
        "#",
        "a"
    ], ['#', BlockID.machineBlockBasic, 0, 'a', 61, 0, 'x', ItemID.storageBattery, -1]);
    Recipes.addShaped({ id: BlockID.primalGenerator, count: 1, data: 0 }, [
        " x ",
        "###",
        " a "
    ], ['#', ItemID.plateIron, 0, 'a', BlockID.ironFurnace, -1, 'x', ItemID.storageBattery, -1]);
});
var guiGenerator = MachineRegistry.createInventoryWindow("Generator", {
    drawing: [
        { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "burningScale": { type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 441, y: 75 },
        "slotFuel": { type: "slot", x: 441, y: 212 },
        "textInfo1": { type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000" }
    }
});
var Machine;
(function (Machine) {
    var FuelGenerator = /** @class */ (function (_super) {
        __extends(FuelGenerator, _super);
        function FuelGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                burn: 0,
                burnMax: 0
            };
            return _this;
        }
        FuelGenerator.prototype.getScreenByName = function () {
            return guiGenerator;
        };
        FuelGenerator.prototype.setupContainer = function () {
            StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", function (name, id) {
                return ChargeItemRegistry.isValidItem(id, "Eu", 1);
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", function (name, id, count, data) {
                return Recipes.getFuelBurnDuration(id, data) > 0;
            });
        };
        FuelGenerator.prototype.consumeFuel = function (slotName) {
            var fuelSlot = this.container.getSlot(slotName);
            if (fuelSlot.id > 0) {
                var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
                if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
                    this.decreaseSlot(fuelSlot, 1);
                    return burn;
                }
            }
            return 0;
        };
        FuelGenerator.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            var newActive = false;
            var energyStorage = this.getEnergyStorage();
            if (this.data.energy + 10 <= energyStorage) {
                if (this.data.burn <= 0) {
                    this.data.burn = this.data.burnMax = this.consumeFuel("slotFuel") / 4;
                }
                if (this.data.burn > 0) {
                    this.data.energy = Math.min(this.data.energy + 10, energyStorage);
                    this.data.burn--;
                    newActive = true;
                }
            }
            this.setActive(newActive);
            this.chargeSlot("slotEnergy");
            this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.setText("textInfo1", this.data.energy + "/");
            this.container.sendChanges();
        };
        FuelGenerator.prototype.getOperationSound = function () {
            return "GeneratorLoop.ogg";
        };
        FuelGenerator.prototype.getEnergyStorage = function () {
            return 10000;
        };
        FuelGenerator.prototype.canRotate = function (side) {
            return side > 1;
        };
        return FuelGenerator;
    }(Machine.Generator));
    Machine.FuelGenerator = FuelGenerator;
    MachineRegistry.registerPrototype(BlockID.primalGenerator, new FuelGenerator());
    StorageInterface.createInterface(BlockID.primalGenerator, {
        slots: {
            "slotFuel": { input: true }
        },
        isValidInput: function (item) { return Recipes.getFuelBurnDuration(item.id, item.data) > 0; }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("geothermalGenerator", [
    { name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.geothermalGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.geothermalGenerator, 1);
TileRenderer.setStandardModelWithRotation(BlockID.geothermalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.geothermalGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.geothermalGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.geothermalGenerator, count: 1, data: 0 }, [
        "xax",
        "xax",
        "b#b"
    ], ['#', BlockID.primalGenerator, -1, 'a', ItemID.cellEmpty, 0, 'b', ItemID.casingIron, 0, 'x', 20, -1]);
});
var guiGeothermalGenerator = MachineRegistry.createInventoryWindow("Geothermal Generator", {
    drawing: [
        { type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 702 + 4 * GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "liquidScale": { type: "scale", x: 581 + 4 * GUI_SCALE, y: 75 + 4 * GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 440, y: 75 },
        "slot2": { type: "slot", x: 440, y: 183 },
        "slotEnergy": { type: "slot", x: 725, y: 165 }
    }
});
var Machine;
(function (Machine) {
    var GeothermalGenerator = /** @class */ (function (_super) {
        __extends(GeothermalGenerator, _super);
        function GeothermalGenerator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GeothermalGenerator.prototype.getScreenByName = function () {
            return guiGeothermalGenerator;
        };
        GeothermalGenerator.prototype.setupContainer = function () {
            this.liquidTank = this.addLiquidTank("fluid", 8000, ["lava"]);
            StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", function (name, id) {
                return ChargeItemRegistry.isValidItem(id, "Eu", 1);
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slot1", function (name, id, count, data) {
                return LiquidItemRegistry.getItemLiquid(id, data) == "lava";
            });
            this.container.setSlotAddTransferPolicy("slot2", function () { return 0; });
        };
        GeothermalGenerator.prototype.onItemUse = function (coords, item, player) {
            if (Entity.getSneaking(player)) {
                if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
                    this.preventClick();
                    return true;
                }
            }
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        GeothermalGenerator.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            var slot1 = this.container.getSlot("slot1");
            var slot2 = this.container.getSlot("slot2");
            this.liquidTank.getLiquidFromItem(slot1, slot2);
            if (this.liquidTank.getAmount("lava") >= 1 && this.data.energy + 20 <= this.getEnergyStorage()) {
                this.data.energy += 20;
                this.liquidTank.getLiquid(1);
                this.setActive(true);
            }
            else {
                this.setActive(false);
            }
            this.chargeSlot("slotEnergy");
            this.liquidTank.updateUiScale("liquidScale");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        GeothermalGenerator.prototype.getOperationSound = function () {
            return "GeothermalLoop.ogg";
        };
        GeothermalGenerator.prototype.getEnergyStorage = function () {
            return 10000;
        };
        GeothermalGenerator.prototype.canRotate = function (side) {
            return side > 1;
        };
        return GeothermalGenerator;
    }(Machine.Generator));
    Machine.GeothermalGenerator = GeothermalGenerator;
    MachineRegistry.registerPrototype(BlockID.geothermalGenerator, new GeothermalGenerator());
    MachineRegistry.createStorageInterface(BlockID.geothermalGenerator, {
        slots: {
            "slot1": { input: true },
            "slot2": { output: true }
        },
        isValidInput: function (item) { return (LiquidItemRegistry.getItemLiquid(item.id, item.data) == "lava"); },
        canTransportLiquid: function (liquid) { return false; }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("semifluidGenerator", [
    { name: "Semifluid Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.semifluidGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.semifluidGenerator, 1);
TileRenderer.setStandardModelWithRotation(BlockID.semifluidGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 0], ["semifluid_generator_side", 0], ["semifluid_generator_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.semifluidGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["semifluid_generator_front", 1], ["semifluid_generator_side", 1], ["semifluid_generator_side", 1]]);
TileRenderer.setRotationFunction(BlockID.semifluidGenerator);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.semifluidGenerator, count: 1, data: 0 }, [
        "pcp",
        "cxc",
        "pcp"
    ], ['x', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});
MachineRecipeRegistry.registerFluidRecipes("fluidFuel", {
    "biomass": { power: 8, amount: 20 },
    "oil": { power: 8, amount: 10 },
    "biogas": { power: 16, amount: 10 },
    "ethanol": { power: 16, amount: 10 },
});
var guiSemifluidGenerator = MachineRegistry.createInventoryWindow("Semifluid Generator", {
    drawing: [
        { type: "bitmap", x: 702, y: 91, bitmap: "energy_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE }
    ],
    elements: {
        "scaleArrow": { type: "image", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_fluidFuel");
                }
            } },
        "energyScale": { type: "scale", x: 702 + 4 * GUI_SCALE, y: 91, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "liquidScale": { type: "scale", x: 581 + 4 * GUI_SCALE, y: 75 + 4 * GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 440, y: 75 },
        "slot2": { type: "slot", x: 440, y: 183 },
        "slotEnergy": { type: "slot", x: 725, y: 165 }
    }
});
var Machine;
(function (Machine) {
    var FluidGenerator = /** @class */ (function (_super) {
        __extends(FluidGenerator, _super);
        function FluidGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                fuel: 0,
                liquid: null,
            };
            return _this;
        }
        FluidGenerator.prototype.getScreenByName = function () {
            return guiSemifluidGenerator;
        };
        FluidGenerator.prototype.setupContainer = function () {
            var liquidFuel = MachineRecipeRegistry.requireFluidRecipes("fluidFuel");
            this.liquidTank = this.addLiquidTank("fluid", 10000, Object.keys(liquidFuel));
            StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", function (name, id) {
                return ChargeItemRegistry.isValidItem(id, "Eu", 1);
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slot1", function (name, id, count, data) {
                var empty = LiquidItemRegistry.getEmptyItem(id, data);
                if (!empty)
                    return false;
                return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
            });
            this.container.setSlotAddTransferPolicy("slot2", function () { return 0; });
        };
        FluidGenerator.prototype.onItemUse = function (coords, item, player) {
            if (Entity.getSneaking(player)) {
                if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
                    this.preventClick();
                    return true;
                }
            }
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        FluidGenerator.prototype.getFuel = function (liquid) {
            return MachineRecipeRegistry.getFluidRecipe("fluidFuel", liquid);
        };
        FluidGenerator.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            var slot1 = this.container.getSlot("slot1");
            var slot2 = this.container.getSlot("slot2");
            this.liquidTank.getLiquidFromItem(slot1, slot2);
            if (this.data.fuel <= 0) {
                var liquid = this.liquidTank.getLiquidStored();
                var fuel = this.getFuel(liquid);
                var freeCapacity = this.getEnergyStorage() - this.data.energy;
                if (fuel && this.liquidTank.getAmount() >= fuel.amount && fuel.power * fuel.amount <= freeCapacity) {
                    this.liquidTank.getLiquid(fuel.amount);
                    this.data.fuel = fuel.amount;
                    this.data.liquid = liquid;
                }
            }
            if (this.data.fuel > 0) {
                var fuel = this.getFuel(this.data.liquid);
                this.data.energy += fuel.power;
                this.data.fuel -= fuel.amount / 20;
                this.setActive(true);
            }
            else {
                this.data.liquid = null;
                this.setActive(false);
            }
            this.chargeSlot("slotEnergy");
            this.liquidTank.updateUiScale("liquidScale");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        FluidGenerator.prototype.getOperationSound = function () {
            return "GeothermalLoop.ogg";
        };
        FluidGenerator.prototype.getEnergyStorage = function () {
            return 1000;
        };
        FluidGenerator.prototype.canRotate = function (side) {
            return side > 1;
        };
        return FluidGenerator;
    }(Machine.Generator));
    Machine.FluidGenerator = FluidGenerator;
    MachineRegistry.registerPrototype(BlockID.semifluidGenerator, new FluidGenerator());
    MachineRegistry.createStorageInterface(BlockID.semifluidGenerator, {
        slots: {
            "slot1": { input: true },
            "slot2": { output: true }
        },
        isValidInput: function (item) {
            var empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
            if (!empty)
                return false;
            return this.canReceiveLiquid(empty.liquid);
        },
        canTransportLiquid: function () { return false; }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("solarPanel", [
    { name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine", 0], ["machine", 0], ["machine", 0], ["machine", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solarPanel, "stone", 1);
ItemName.addTierTooltip(BlockID.solarPanel, 1);
Callback.addCallback("PreLoaded", function () {
    if (IC2Config.hardRecipes) {
        Recipes.addShaped({ id: BlockID.solarPanel, count: 1, data: 0 }, [
            "aaa",
            "xxx",
            "b#b"
        ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustLapis, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
    }
    else {
        Recipes.addShaped({ id: BlockID.solarPanel, count: 1, data: 0 }, [
            "aaa",
            "xxx",
            "b#b"
        ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, -1]);
    }
});
var guiSolarPanel = MachineRegistry.createInventoryWindow("Solar Panel", {
    elements: {
        "slotEnergy": { type: "slot", x: 600, y: 130 },
        "sun": { type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE }
    }
});
var Machine;
(function (Machine) {
    var SolarGenerator = /** @class */ (function (_super) {
        __extends(SolarGenerator, _super);
        function SolarGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                canSeeSky: false
            };
            _this.defaultDrop = BlockID.machineBlockBasic;
            return _this;
        }
        SolarGenerator.prototype.getScreenByName = function () {
            return guiSolarPanel;
        };
        SolarGenerator.prototype.onInit = function () {
            this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
        };
        SolarGenerator.prototype.setupContainer = function () {
            StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", function (name, id) { return ChargeItemRegistry.isValidItem(id, "Eu", 1); });
        };
        SolarGenerator.prototype.onTick = function () {
            if (World.getThreadTime() % 100 == 0) {
                this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
            }
            if (this.data.canSeeSky && this.region.getLightLevel(this.x, this.y + 1, this.z) == 15) {
                this.data.energy = 1;
                this.chargeSlot("slotEnergy");
                this.container.sendEvent("setSolarElement", "on");
                this.container.sendChanges();
            }
            else {
                this.container.sendEvent("setSolarElement", "off");
            }
        };
        SolarGenerator.prototype.getEnergyStorage = function () {
            return 1;
        };
        SolarGenerator.prototype.setSolarElement = function (container, window, content, data) {
            if (content) {
                content.elements["sun"].bitmap = "sun_" + data;
            }
        };
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], SolarGenerator.prototype, "setSolarElement", null);
        return SolarGenerator;
    }(Machine.Generator));
    Machine.SolarGenerator = SolarGenerator;
    MachineRegistry.registerPrototype(BlockID.solarPanel, new SolarGenerator());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("genWindmill", [
    { name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.genWindmill, "stone", 1);
ItemName.addTierTooltip(BlockID.genWindmill, 1);
TileRenderer.setStandardModelWithRotation(BlockID.genWindmill, 2, [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.genWindmill);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.genWindmill, count: 1, data: 0 }, [
        "x x",
        " # ",
        "xcx"
    ], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'c', ItemID.coil, 0]);
});
var Machine;
(function (Machine) {
    var WindGenerator = /** @class */ (function (_super) {
        __extends(WindGenerator, _super);
        function WindGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                output: 0,
                ticker: -1,
                blockCount: 0
            };
            return _this;
        }
        WindGenerator.prototype.updateBlockCount = function () {
            var blockCount = -1;
            for (var x = -4; x <= 4; x++)
                for (var y = -3; y <= 3; y++)
                    for (var z = -4; z <= 4; z++) {
                        if (this.blockSource.getBlockId(this.x + x, this.y + y, this.z + z) != 0) {
                            blockCount++;
                        }
                    }
            this.data.blockCount = blockCount;
        };
        WindGenerator.prototype.onInit = function () {
            if (this.dimension != 0)
                this.selfDestroy();
        };
        WindGenerator.prototype.energyTick = function (type, src) {
            if (++this.data.ticker % 128 == 0) {
                if (this.data.ticker % 1024 == 0) {
                    this.updateBlockCount();
                }
                var wind = WindSim.getWindAt(this.y) * (1 - this.data.blockCount / 567);
                if (wind < 0)
                    wind = 0;
                this.data.output = Math.round(wind / 3 * 10) / 10;
            }
            src.add(this.data.output);
        };
        WindGenerator.prototype.canRotate = function (side) {
            return side > 1;
        };
        return WindGenerator;
    }(Machine.Generator));
    Machine.WindGenerator = WindGenerator;
    MachineRegistry.registerPrototype(BlockID.genWindmill, new WindGenerator());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("genWatermill", [
    { name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.genWatermill, "stone", 1);
ItemName.addTierTooltip(BlockID.genWatermill, 1);
TileRenderer.setStandardModelWithRotation(BlockID.genWatermill, 2, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);
TileRenderer.setRotationFunction(BlockID.genWatermill);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.genWatermill, count: 1, data: 0 }, [
        "x x",
        "a#a",
        "xcx"
    ], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'a', ItemID.casingSteel, 0, 'c', ItemID.coil, 0]);
});
var Machine;
(function (Machine) {
    var WaterGenerator = /** @class */ (function (_super) {
        __extends(WaterGenerator, _super);
        function WaterGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                output: 0,
                biome: null,
                ticker: -1,
                blockCount: 0
            };
            _this.BASE_POWER = 3;
            return _this;
        }
        WaterGenerator.prototype.isOcean = function (biome) {
            return biome == 0 || biome == 24;
        };
        WaterGenerator.prototype.isRiver = function (biome) {
            return biome == 7;
        };
        WaterGenerator.prototype.getBiome = function (x, z) {
            var coords = [[x, z], [x - 7, z], [x + 7, z], [x, z - 7], [x, z + 7]];
            for (var _i = 0, coords_1 = coords; _i < coords_1.length; _i++) {
                var c = coords_1[_i];
                var biome = this.region.getBiome(c[0], c[1]);
                if (this.isOcean(biome)) {
                    return biome;
                }
                if (this.isRiver(biome)) {
                    return biome;
                }
            }
            return -1;
        };
        WaterGenerator.prototype.onInit = function () {
            if (this.data.biome == null) {
                this.data.biome = this.getBiome(this.x, this.z);
                this.data.ticker = -1; // for old blocks
                if (this.data.biome == -1) {
                    this.selfDestroy();
                }
            }
        };
        WaterGenerator.prototype.updateBlockCount = function () {
            var blockCount = 0;
            if (this.y >= 32 && this.y < 64) {
                for (var x = -1; x <= 1; x++)
                    for (var y = -1; y <= 1; y++)
                        for (var z = -1; z <= 1; z++) {
                            var coords = new Vector3(this.x + x, this.y + y, this.z + z);
                            var blockId = this.region.getExtraBlock(coords).id || this.region.getBlockId(coords);
                            if (blockId == 8 || blockId == 9) {
                                blockCount++;
                            }
                        }
            }
            this.data.blockCount = blockCount;
        };
        WaterGenerator.prototype.energyTick = function (type, src) {
            if (++this.data.ticker % 128 == 0) {
                this.updateBlockCount();
                var output = this.BASE_POWER;
                if (this.isOcean(this.data.biome)) {
                    output *= 1.5 * Math.sin(World.getWorldTime() % 6000 / (6000 / Math.PI));
                }
                else {
                    var wether = World.getWeather();
                    if (wether.thunder) {
                        output *= 2;
                    }
                    else if (wether.rain) {
                        output *= 1.5;
                    }
                }
                output *= this.data.blockCount / 26;
                this.data.output = Math.round(output * 10) / 10;
            }
            src.add(this.data.output);
        };
        WaterGenerator.prototype.canRotate = function (side) {
            return side > 1;
        };
        return WaterGenerator;
    }(Machine.Generator));
    Machine.WaterGenerator = WaterGenerator;
    MachineRegistry.registerPrototype(BlockID.genWatermill, new WaterGenerator());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("rtGenerator", [
    { name: "Radioisotope Thermoelectric Generator", texture: [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.rtGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.rtGenerator, 1);
TileRenderer.setStandardModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 1], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.rtGenerator, count: 1, data: 0 }, [
        "ccc",
        "c#c",
        "cxc"
    ], ['#', BlockID.reactorChamber, 0, 'x', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0]);
});
var guiRTGenerator = MachineRegistry.createInventoryWindow("Radioisotope Thermoelectric Generator", {
    drawing: [
        { type: "bitmap", x: 630, y: 150, bitmap: "energy_bar_background", scale: GUI_SCALE },
    ],
    elements: {
        "slot0": { type: "slot", x: 420, y: 120 },
        "slot1": { type: "slot", x: 480, y: 120 },
        "slot2": { type: "slot", x: 540, y: 120 },
        "slot3": { type: "slot", x: 420, y: 180 },
        "slot4": { type: "slot", x: 480, y: 180 },
        "slot5": { type: "slot", x: 540, y: 180 },
        "energyScale": { type: "scale", x: 630 + GUI_SCALE * 4, y: 150, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
        "textInfo1": { type: "text", x: 742, y: 148, width: 300, height: 30, text: "0/" },
        "textInfo2": { type: "text", x: 742, y: 178, width: 300, height: 30, text: "10000" }
    }
});
var Machine;
(function (Machine) {
    var RTGenerator = /** @class */ (function (_super) {
        __extends(RTGenerator, _super);
        function RTGenerator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RTGenerator.prototype.setupContainer = function () {
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id) { return (id == ItemID.rtgPellet); });
        };
        RTGenerator.prototype.getScreenByName = function () {
            return guiRTGenerator;
        };
        RTGenerator.prototype.onTick = function () {
            var output = 0.5;
            for (var i = 0; i < 6; i++) {
                var slot = this.container.getSlot("slot" + i);
                if (slot.id == ItemID.rtgPellet) {
                    output *= 2;
                }
            }
            if (output >= 1) {
                this.setActive(true);
                this.data.energy = Math.min(this.data.energy + output, this.getEnergyStorage());
            }
            else {
                this.setActive(false);
            }
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.setText("textInfo1", this.data.energy + "/");
            this.container.sendChanges();
        };
        RTGenerator.prototype.getEnergyStorage = function () {
            return 10000;
        };
        return RTGenerator;
    }(Machine.Generator));
    Machine.RTGenerator = RTGenerator;
    MachineRegistry.registerPrototype(BlockID.rtGenerator, new RTGenerator());
})(Machine || (Machine = {}));
/// <reference path="../IHeatConsumer.ts" />
BlockRegistry.createBlock("stirlingGenerator", [
    { name: "Stirling Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.stirlingGenerator, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.stirlingGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.stirlingGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["stirling_generator", 0], ["heat_pipe", 0], ["machine_side", 0], ["machine_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.stirlingGenerator, true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.stirlingGenerator, count: 1, data: 0 }, [
        "cxc",
        "c#c",
        "ccc"
    ], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});
var Machine;
(function (Machine) {
    var StirlingGenerator = /** @class */ (function (_super) {
        __extends(StirlingGenerator, _super);
        function StirlingGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                heat: 0
            };
            return _this;
        }
        StirlingGenerator.prototype.getScreenName = function () {
            return null;
        };
        StirlingGenerator.prototype.getTier = function () {
            return 4;
        };
        StirlingGenerator.prototype.canRotate = function () {
            return true;
        };
        StirlingGenerator.prototype.canReceiveHeat = function (side) {
            return side == this.getFacing();
        };
        StirlingGenerator.prototype.receiveHeat = function (amount) {
            if (this.data.energy == 0) {
                this.data.energy = Math.round(amount / 2);
                return amount;
            }
            return 0;
        };
        StirlingGenerator.prototype.energyTick = function (type, src) {
            if (src.add(this.data.energy) < this.data.energy) {
                this.data.energy = 0;
            }
        };
        return StirlingGenerator;
    }(Machine.Generator));
    Machine.StirlingGenerator = StirlingGenerator;
    MachineRegistry.registerPrototype(BlockID.stirlingGenerator, new StirlingGenerator());
})(Machine || (Machine = {}));
/// <reference path="../IMomentOfMomentumConsumer.ts" />
BlockRegistry.createBlock("kineticGenerator", [
    { name: "Kinetic Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["kinetic_generator_back", 0], ["kinetic_generator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.kineticGenerator, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.kineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["kinetic_generator_back", 0], ["kinetic_generator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.kineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["kinetic_generator_back", 0], ["kinetic_generator_front", 0], ["machine_side", 0], ["machine_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.kineticGenerator, true);
Callback.addCallback("PreLoaded", function () {
    /*Recipes.addShaped({id: BlockID.stirlingGenerator, count: 1, data: 0}, [
        "ccc",
        "#ms",
        "ccc"
        ], ['#', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0, 'm', ItemID.electricMotor, 0, 'm', ItemID.shaftIron, 0]);*/
});
var Machine;
(function (Machine) {
    var KineticGenerator = /** @class */ (function (_super) {
        __extends(KineticGenerator, _super);
        function KineticGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                heat: 0
            };
            return _this;
        }
        KineticGenerator.prototype.getScreenName = function () {
            return null;
        };
        KineticGenerator.prototype.getTier = function () {
            return 3;
        };
        KineticGenerator.prototype.canRotate = function () {
            return true;
        };
        KineticGenerator.prototype.canReceiveAngularMomentum = function (side) {
            Logger.Log("ss", "recAng");
            Logger.Log("ss", side.toString());
            Logger.Log("ss", this.getFacing().toString());
            return side == this.getFacing();
        };
        KineticGenerator.prototype.receiveAngularMomentum = function (amount) {
            if (this.data.energy == 0) {
                this.data.energy = Math.round(amount / 4);
                Logger.Log("am", amount.toString());
                Logger.Log("amen", this.data.energy.toString());
                return amount;
            }
            Logger.Log("ss", amount.toString());
            return 0;
        };
        KineticGenerator.prototype.energyTick = function (type, src) {
            if (src.add(this.data.energy) < this.data.energy) {
                this.data.energy = 0;
            }
        };
        return KineticGenerator;
    }(Machine.Generator));
    Machine.KineticGenerator = KineticGenerator;
    MachineRegistry.registerPrototype(BlockID.kineticGenerator, new KineticGenerator());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("electricHeatGenerator", [
    { name: "Electric Heater", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.electricHeatGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.electricHeatGenerator, 4);
TileRenderer.setStandardModelWithRotation(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["heat_generator_side", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.electricHeatGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 1], ["heat_generator_side", 1], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.electricHeatGenerator, true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.electricHeatGenerator, count: 1, data: 0 }, [
        "xbx",
        "x#x",
        "xax"
    ], ['#', ItemID.circuitBasic, 0, 'x', ItemID.casingIron, 0, 'a', ItemID.heatConductor, 0, 'b', ItemID.storageBattery, -1]);
});
var guiElectricHeatGenerator = MachineRegistry.createInventoryWindow("Electric Heater", {
    drawing: [
        { type: "bitmap", x: 342, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 461, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "slot0": { type: "slot", x: 440, y: 120 },
        "slot1": { type: "slot", x: 500, y: 120 },
        "slot2": { type: "slot", x: 560, y: 120 },
        "slot3": { type: "slot", x: 620, y: 120 },
        "slot4": { type: "slot", x: 680, y: 120 },
        "slot5": { type: "slot", x: 440, y: 180 },
        "slot6": { type: "slot", x: 500, y: 180 },
        "slot7": { type: "slot", x: 560, y: 180 },
        "slot8": { type: "slot", x: 620, y: 180 },
        "slot9": { type: "slot", x: 680, y: 180 },
        "slotEnergy": { type: "slot", x: 340, y: 180 },
        "energyScale": { type: "scale", x: 342, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 530, y: 264, width: 300, height: 30, text: "0    /" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 630, y: 264, width: 300, height: 30, text: "0" }
    }
});
var Machine;
(function (Machine) {
    var ElectricHeatGenerator = /** @class */ (function (_super) {
        __extends(ElectricHeatGenerator, _super);
        function ElectricHeatGenerator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ElectricHeatGenerator.prototype.getTier = function () {
            return 4;
        };
        ElectricHeatGenerator.prototype.getScreenByName = function () {
            return guiElectricHeatGenerator;
        };
        ElectricHeatGenerator.prototype.setupContainer = function () {
            var _this = this;
            this.container.setGlobalAddTransferPolicy(function (container, name, id, amount, data) {
                if (name == "slotEnergy") {
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier()) ? amount : 0;
                }
                if (id == ItemID.coil && container.getSlot(name).count == 0) {
                    return 1;
                }
                return 0;
            });
        };
        ElectricHeatGenerator.prototype.calcOutput = function () {
            var maxOutput = 0;
            for (var i = 0; i < 10; i++) {
                var slot = this.container.getSlot("slot" + i);
                if (slot.id == ItemID.coil) {
                    maxOutput += 10;
                }
            }
            return maxOutput;
        };
        ElectricHeatGenerator.prototype.onTick = function () {
            var maxOutput = this.calcOutput();
            var output = 0;
            if (this.data.energy >= 1) {
                var side = this.getFacing();
                var coords = StorageInterface.getRelativeCoords(this, side);
                var tile = this.region.getTileEntity(coords);
                if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
                    output = tile.receiveHeat(Math.min(maxOutput, this.data.energy));
                    if (output > 0) {
                        this.setActive(true);
                        this.data.energy -= output;
                        var outputText = output.toString();
                        for (var i = outputText.length; i < 6; i++) {
                            outputText += " ";
                        }
                        this.container.setText("textInfo1", outputText + "/");
                    }
                }
            }
            if (output == 0) {
                this.setActive(false);
                this.container.setText("textInfo1", "0     /");
            }
            this.dischargeSlot("slotEnergy");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.setText("textInfo2", maxOutput);
            this.container.sendChanges();
        };
        ElectricHeatGenerator.prototype.getEnergyStorage = function () {
            return 2000;
        };
        ElectricHeatGenerator.prototype.canRotate = function () {
            return true;
        };
        return ElectricHeatGenerator;
    }(Machine.ElectricMachine));
    Machine.ElectricHeatGenerator = ElectricHeatGenerator;
    MachineRegistry.registerPrototype(BlockID.electricHeatGenerator, new ElectricHeatGenerator());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("fluidHeatGenerator", [
    { name: "Liquid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.fluidHeatGenerator, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.fluidHeatGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.setStandardModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 0], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.setStandardModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 2], ["fluid_heat_generator_side", 2]]);
TileRenderer.setStandardModelWithRotation(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 0], ["heat_pipe", 0], ["fluid_heat_generator_side", 0], ["fluid_heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 0, [["heat_pipe", 1], ["fluid_heat_generator_back", 0], ["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.fluidHeatGenerator, 1, [["fluid_heat_generator_back", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["fluid_heat_generator_side", 3], ["fluid_heat_generator_side", 3]]);
TileRenderer.registerModelWithRotation(BlockID.fluidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["fluid_heat_generator_back", 1], ["heat_pipe", 1], ["fluid_heat_generator_side", 1], ["fluid_heat_generator_side", 1]]);
TileRenderer.setRotationFunction(BlockID.fluidHeatGenerator, true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.fluidHeatGenerator, count: 1, data: 0 }, [
        "pcp",
        "cxc",
        "pcp"
    ], ['x', ItemID.heatConductor, 0, 'c', ItemID.cellEmpty, 0, 'p', ItemID.casingIron, 0]);
});
var guiFluidHeatGenerator = MachineRegistry.createInventoryWindow("Liquid Fuel Firebox", {
    drawing: [
        { type: "bitmap", x: 581, y: 75, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 459, y: 139, bitmap: "liquid_bar_arrow", scale: GUI_SCALE },
        { type: "bitmap", x: 660, y: 102, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE },
        { type: "bitmap", x: 660, y: 176, bitmap: "fluid_heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "liquidScale": { type: "scale", x: 581 + 4 * GUI_SCALE, y: 75 + 4 * GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 440, y: 75 },
        "slot2": { type: "slot", x: 440, y: 183 },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 670, y: 112, width: 300, height: 30, text: "Emit: 0" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 670, y: 186, width: 300, height: 30, text: "Max Emit: 0" }
    }
});
var Machine;
(function (Machine) {
    var FluidHeatGenerator = /** @class */ (function (_super) {
        __extends(FluidHeatGenerator, _super);
        function FluidHeatGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                heat: 0,
                fuel: 0,
                liquid: null
            };
            return _this;
        }
        FluidHeatGenerator.prototype.getScreenByName = function () {
            return guiFluidHeatGenerator;
        };
        FluidHeatGenerator.prototype.setupContainer = function () {
            var liquidFuel = MachineRecipeRegistry.requireFluidRecipes("fluidFuel");
            this.liquidTank = this.addLiquidTank("fluid", 10000, Object.keys(liquidFuel));
            StorageInterface.setSlotValidatePolicy(this.container, "slot1", function (name, id, count, data) {
                var empty = LiquidItemRegistry.getEmptyItem(id, data);
                if (!empty)
                    return false;
                return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
            });
            this.container.setSlotAddTransferPolicy("slot2", function () { return 0; });
        };
        FluidHeatGenerator.prototype.canRotate = function () {
            return true;
        };
        FluidHeatGenerator.prototype.onItemUse = function (coords, item, player) {
            if (Entity.getSneaking(player)) {
                if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
                    this.preventClick();
                    return true;
                }
            }
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        FluidHeatGenerator.prototype.getFuel = function (liquid) {
            return MachineRecipeRegistry.getFluidRecipe("fluidFuel", liquid);
        };
        FluidHeatGenerator.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            var slot1 = this.container.getSlot("slot1");
            var slot2 = this.container.getSlot("slot2");
            this.liquidTank.getLiquidFromItem(slot1, slot2);
            if (this.data.fuel <= 0 && this.data.heat == 0) {
                var liquid = this.liquidTank.getLiquidStored();
                var fuel = this.getFuel(liquid);
                if (fuel && this.liquidTank.getAmount() >= fuel.amount) {
                    this.liquidTank.getLiquid(fuel.amount);
                    this.data.fuel = fuel.amount;
                    this.data.liquid = liquid;
                }
            }
            if (this.data.fuel > 0) {
                var fuel = this.getFuel(this.data.liquid);
                this.data.heat = fuel.power * 2;
                this.data.fuel -= fuel.amount / 20;
                this.setActive(true);
                this.container.setText("textInfo2", "Max Emit: " + fuel.power * 2);
            }
            else {
                this.data.liquid = null;
                this.setActive(false);
                this.container.setText("textInfo2", "Max Emit: 0");
            }
            if (this.data.heat > 0) {
                var output = this.spreadHeat(this.data.heat);
                this.container.setText("textInfo1", "Emit: " + output);
                if (output > 0)
                    this.data.heat = 0;
            }
            else {
                this.container.setText("textInfo1", "Emit: 0");
            }
            this.liquidTank.updateUiScale("liquidScale");
            this.container.sendChanges();
        };
        FluidHeatGenerator.prototype.getOperationSound = function () {
            return "GeothermalLoop.ogg";
        };
        FluidHeatGenerator.prototype.spreadHeat = function (heat) {
            var side = this.getFacing();
            var coords = StorageInterface.getRelativeCoords(this, side);
            var tile = this.region.getTileEntity(coords);
            if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
                return tile.receiveHeat(heat);
            }
            return 0;
        };
        return FluidHeatGenerator;
    }(Machine.MachineBase));
    Machine.FluidHeatGenerator = FluidHeatGenerator;
    MachineRegistry.registerPrototype(BlockID.fluidHeatGenerator, new FluidHeatGenerator());
    MachineRegistry.createStorageInterface(BlockID.fluidHeatGenerator, {
        slots: {
            "slot1": { input: true },
            "slot2": { output: true }
        },
        isValidInput: function (item) {
            var empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
            if (!empty)
                return false;
            return MachineRecipeRegistry.hasRecipeFor("fluidFuel", empty.liquid);
        },
        canTransportLiquid: function () { return false; }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("solidHeatGenerator", [
    { name: "Solid Fuel Firebox", texture: [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solidHeatGenerator, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.solidHeatGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.setStandardModel(BlockID.solidHeatGenerator, 0, [["heat_pipe", 0], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.setStandardModel(BlockID.solidHeatGenerator, 1, [["generator", 0], ["heat_pipe", 0], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 2], ["heat_generator_side", 2]]);
TileRenderer.setStandardModelWithRotation(BlockID.solidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["generator", 0], ["heat_pipe", 0], ["heat_generator_side", 0], ["heat_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 0, [["heat_pipe", 1], ["generator", 0], ["machine_bottom", 0], ["machine_top", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerRenderModel(BlockID.solidHeatGenerator, 1, [["generator", 0], ["heat_pipe", 1], ["machine_top", 0], ["machine_bottom", 0], ["heat_generator_side", 3], ["heat_generator_side", 3]]);
TileRenderer.registerModelWithRotation(BlockID.solidHeatGenerator, 2, [["machine_bottom", 0], ["machine_top", 0], ["generator", 1], ["heat_pipe", 1], ["heat_generator_side", 1], ["heat_generator_side", 1]]);
TileRenderer.setRotationFunction(BlockID.solidHeatGenerator, true);
Callback.addCallback("PreLoaded", function () {
    Item.addCreativeGroup("IC2HeatGenerators", Translation.translate("Heat Generators"), [
        BlockID.solidHeatGenerator,
        BlockID.electricHeatGenerator,
        BlockID.fluidHeatGenerator,
        BlockID.rtHeatGenerator
    ]);
    Recipes.addShaped({ id: BlockID.solidHeatGenerator, count: 1, data: 0 }, [
        "a",
        "x",
        "f"
    ], ['a', ItemID.heatConductor, 0, 'x', BlockID.machineBlockBasic, 0, 'f', 61, -1]);
    Recipes.addShaped({ id: BlockID.solidHeatGenerator, count: 1, data: 0 }, [
        " a ",
        "ppp",
        " f "
    ], ['a', ItemID.heatConductor, 0, 'p', ItemID.plateIron, 0, 'f', BlockID.ironFurnace, 0]);
});
var guiSolidHeatGenerator = MachineRegistry.createInventoryWindow("Solid Fuel Firebox", {
    drawing: [
        { type: "bitmap", x: 450, y: 160, bitmap: "fire_background", scale: GUI_SCALE },
        { type: "bitmap", x: 521, y: 212, bitmap: "shovel_image", scale: GUI_SCALE + 1 },
        { type: "bitmap", x: 441, y: 330, bitmap: "heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "slotFuel": { type: "slot", x: 441, y: 212 },
        "slotAshes": { type: "slot", x: 591, y: 212 },
        "burningScale": { type: "scale", x: 450, y: 160, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 500, y: 344, width: 300, height: 30, text: "0    /" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 600, y: 344, width: 300, height: 30, text: "20" }
    }
});
var Machine;
(function (Machine) {
    var SolidHeatGenerator = /** @class */ (function (_super) {
        __extends(SolidHeatGenerator, _super);
        function SolidHeatGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                burn: 0,
                burnMax: 0,
                output: 0
            };
            return _this;
        }
        SolidHeatGenerator.prototype.getScreenByName = function () {
            return guiSolidHeatGenerator;
        };
        SolidHeatGenerator.prototype.setupContainer = function () {
            StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", function (name, id, count, data) {
                return Recipes.getFuelBurnDuration(id, data) > 0;
            });
            this.container.setSlotAddTransferPolicy("slotAshes", function () { return 0; });
        };
        SolidHeatGenerator.prototype.getFuel = function (fuelSlot) {
            if (fuelSlot.id > 0) {
                var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
                if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
                    return burn;
                }
            }
            return 0;
        };
        SolidHeatGenerator.prototype.spreadHeat = function () {
            var side = this.getFacing();
            var coords = StorageInterface.getRelativeCoords(this, side);
            var tile = this.region.getTileEntity(coords);
            if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
                return this.data.output = tile.receiveHeat(20);
            }
            return 0;
        };
        SolidHeatGenerator.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            this.data.output = 0;
            var slot = this.container.getSlot("slotAshes");
            if (this.data.burn <= 0) {
                var fuelSlot = this.container.getSlot("slotFuel");
                var burn = this.getFuel(fuelSlot) / 4;
                if (burn && ((slot.id == ItemID.ashes && slot.count < 64) || slot.id == 0) && this.spreadHeat()) {
                    this.setActive(true);
                    this.data.burnMax = burn;
                    this.data.burn = burn - 1;
                    this.decreaseSlot(fuelSlot, 1);
                }
                else {
                    this.setActive(false);
                }
            }
            else {
                this.data.burn--;
                if (this.data.burn == 0 && Math.random() < 0.5) {
                    slot.setSlot(ItemID.ashes, slot.count + 1, 0);
                }
                this.spreadHeat();
            }
            var outputText = this.data.output.toString();
            for (var i = outputText.length; i < 6; i++) {
                outputText += " ";
            }
            this.container.setText("textInfo1", outputText + "/");
            this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
            this.container.sendChanges();
        };
        SolidHeatGenerator.prototype.canRotate = function () {
            return true;
        };
        return SolidHeatGenerator;
    }(Machine.MachineBase));
    Machine.SolidHeatGenerator = SolidHeatGenerator;
    MachineRegistry.registerPrototype(BlockID.solidHeatGenerator, new SolidHeatGenerator());
    StorageInterface.createInterface(BlockID.solidHeatGenerator, {
        slots: {
            "slotFuel": { input: true },
            "slotAshes": { output: true }
        },
        isValidInput: function (item) { return Recipes.getFuelBurnDuration(item.id, item.data) > 0; }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("rtHeatGenerator", [
    { name: "Radioisotope Heat Generator", texture: [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.rtHeatGenerator, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 0], ["rt_generator_side", 0], ["heat_pipe", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.rtHeatGenerator, 0, [["machine_bottom", 0], ["rt_heat_generator_top", 1], ["rt_generator_side", 0], ["heat_pipe", 1], ["rt_generator_side", 0], ["rt_generator_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.rtHeatGenerator, true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.rtHeatGenerator, count: 1, data: 0 }, [
        "ccc",
        "c#c",
        "cxc"
    ], ['#', BlockID.reactorChamber, 0, 'x', ItemID.heatConductor, 0, 'c', ItemID.casingIron, 0]);
});
var guiRTHeatGenerator = MachineRegistry.createInventoryWindow("Radioisotope Heat Generator", {
    drawing: [
        { type: "bitmap", x: 380, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "slot0": { type: "slot", x: 420, y: 100 },
        "slot1": { type: "slot", x: 480, y: 100 },
        "slot2": { type: "slot", x: 540, y: 100 },
        "slot3": { type: "slot", x: 420, y: 160 },
        "slot4": { type: "slot", x: 480, y: 160 },
        "slot5": { type: "slot", x: 540, y: 160 },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 450, y: 264, width: 300, height: 30, text: "0     /" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 550, y: 264, width: 300, height: 30, text: "0" }
    }
});
var Machine;
(function (Machine) {
    var RTHeatGenerator = /** @class */ (function (_super) {
        __extends(RTHeatGenerator, _super);
        function RTHeatGenerator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RTHeatGenerator.prototype.getScreenByName = function () {
            return guiRTHeatGenerator;
        };
        RTHeatGenerator.prototype.setupContainer = function () {
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id) { return (id == ItemID.rtgPellet); });
        };
        RTHeatGenerator.prototype.calculateOutput = function () {
            var output = 1;
            for (var i = 0; i < 6; i++) {
                var slot = this.container.getSlot("slot" + i);
                if (slot.id == ItemID.rtgPellet) {
                    output *= 2;
                }
            }
            return output > 1 ? output : 0;
        };
        RTHeatGenerator.prototype.getOutputText = function (output) {
            var outputText = output.toString();
            for (var i = outputText.length; i < 6; i++) {
                outputText += " ";
            }
            return outputText;
        };
        RTHeatGenerator.prototype.onTick = function () {
            var output = this.calculateOutput();
            var maxOutput = output;
            var isActive = output > 0;
            if (isActive) {
                output = this.spreadHeat(output);
            }
            this.setActive(isActive);
            this.container.setText("textInfo1", this.getOutputText(output) + "/");
            this.container.setText("textInfo2", maxOutput);
            this.container.sendChanges();
        };
        RTHeatGenerator.prototype.spreadHeat = function (heat) {
            var side = this.getFacing();
            var coords = StorageInterface.getRelativeCoords(this, side);
            var tile = this.region.getTileEntity(coords);
            if (tile && tile.canReceiveHeat && tile.canReceiveHeat(side ^ 1)) {
                return tile.receiveHeat(heat);
            }
            return 0;
        };
        RTHeatGenerator.prototype.canRotate = function () {
            return true;
        };
        return RTHeatGenerator;
    }(Machine.MachineBase));
    Machine.RTHeatGenerator = RTHeatGenerator;
    MachineRegistry.registerPrototype(BlockID.rtHeatGenerator, new RTHeatGenerator());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("manualKineticGenerator", [
    { name: "Manual Kinetic Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.manualKineticGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.manualKineticGenerator, 4);
TileRenderer.setStandardModelWithRotation(BlockID.manualKineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.manualKineticGenerator, 0, [["machine_bottom", 0], ["machine_top", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0], ["manual_kinetic_generator_sides", 0]], true);
TileRenderer.setRotationFunction(BlockID.manualKineticGenerator, true);
Callback.addCallback("PreLoaded", function () {
    /*Recipes.addShaped({id: BlockID.manualKineticGenerator, count: 1, data: 0}, [
        "sm",
    ], ['s', ItemID.machineCasing, 0, 'm', levelId!!!, -1]);*/
});
var Machine;
(function (Machine) {
    var ManualKineticGenerator = /** @class */ (function (_super) {
        __extends(ManualKineticGenerator, _super);
        function ManualKineticGenerator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ManualKineticGenerator.prototype.onItemClick = function () {
            var output = 400;
            for (var i = 2; i < 6; i++) {
                Logger.Log("qqss", i.toString());
                var coords = StorageInterface.getRelativeCoords(this, i);
                Logger.Log("sqss", coords.x.toString() + ";" + coords.y.toString() + ";" + coords.z.toString());
                var tile = this.region.getTileEntity(coords);
                if (tile && tile.canReceiveAngularMomentum && tile.canReceiveAngularMomentum(4) /*All sides of Manual generator*/) {
                    output = tile.receiveAngularMomentum(output);
                }
            }
            return false;
        };
        ManualKineticGenerator.prototype.canRotate = function () {
            return false;
        };
        return ManualKineticGenerator;
    }(Machine.MachineBase));
    Machine.ManualKineticGenerator = ManualKineticGenerator;
    MachineRegistry.registerPrototype(BlockID.manualKineticGenerator, new ManualKineticGenerator());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("electricKineticGenerator", [
    { name: "Electric Kinetic Generator", texture: [["machine_bottom", 0], ["ind_furnace_side", 0], ["electric_kinetic_generator_back", 0], ["kinetic_hole", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.electricKineticGenerator, "stone", 1);
ItemName.addTierTooltip(BlockID.electricKineticGenerator, 4);
TileRenderer.setStandardModelWithRotation(BlockID.electricKineticGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["electric_kinetic_generator_back", 0], ["kinetic_hole", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.electricKineticGenerator, 0, [["machine_bottom", 0], ["ind_furnace_side", 0], ["electric_kinetic_generator_back", 0], ["kinetic_hole", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.electricKineticGenerator, true);
Callback.addCallback("PreLoaded", function () {
    Item.addCreativeGroup("AngularGenerators", Translation.translate("Kinetic Generators"), [
        BlockID.electricKineticGenerator,
        BlockID.manualKineticGenerator
        //BlockID.windKineticGenerator,
        //BlockID.waterKineticGenerator,
        //BlockID.steamKineticGenerator,
    ]);
    /*Recipes.addShaped({id: BlockID.electricKineticGenerator, count: 1, data: 0}, [
        "xbx",
        "xsx",
        "xmx"
    ], ['s', ItemID.shaftIron, 0, 'x', ItemID.casingIron, 0, 'm', ItemID.electricMotor, 0, 'b', ItemID.storageBattery, -1]);*/
});
var guiElectricKineticGenerator = MachineRegistry.createInventoryWindow("Electric Kinetic Generator ", {
    drawing: [
        { type: "bitmap", x: 342, y: 110, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 461, y: 250, bitmap: "heat_generator_info", scale: GUI_SCALE }
    ],
    elements: {
        "slot0": { type: "slot", x: 440, y: 120 },
        "slot1": { type: "slot", x: 500, y: 120 },
        "slot2": { type: "slot", x: 560, y: 120 },
        "slot3": { type: "slot", x: 620, y: 120 },
        "slot4": { type: "slot", x: 680, y: 120 },
        "slot5": { type: "slot", x: 440, y: 180 },
        "slot6": { type: "slot", x: 500, y: 180 },
        "slot7": { type: "slot", x: 560, y: 180 },
        "slot8": { type: "slot", x: 620, y: 180 },
        "slot9": { type: "slot", x: 680, y: 180 },
        "slotEnergy": { type: "slot", x: 340, y: 180 },
        "energyScale": { type: "scale", x: 342, y: 110, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "textInfo1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 530, y: 264, width: 300, height: 30, text: "0    /" },
        "textInfo2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 630, y: 264, width: 300, height: 30, text: "0" }
    }
});
var Machine;
(function (Machine) {
    var ElectricKineticGenerator = /** @class */ (function (_super) {
        __extends(ElectricKineticGenerator, _super);
        function ElectricKineticGenerator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ElectricKineticGenerator.prototype.getTier = function () {
            return 3;
        };
        ElectricKineticGenerator.prototype.getScreenByName = function () {
            return guiElectricKineticGenerator;
        };
        ElectricKineticGenerator.prototype.setupContainer = function () {
            var _this = this;
            this.container.setGlobalAddTransferPolicy(function (container, name, id, amount, data) {
                if (name == "slotEnergy") {
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier()) ? amount : 0;
                }
                if (id == ItemID.electricMotor && container.getSlot(name).count == 0) {
                    return 1;
                }
                return 0;
            });
        };
        ElectricKineticGenerator.prototype.calcOutput = function () {
            var maxOutput = 0;
            for (var i = 0; i < 10; i++) {
                var slot = this.container.getSlot("slot" + i);
                if (slot.id == ItemID.electricMotor) {
                    maxOutput += 100;
                }
            }
            return maxOutput;
        };
        ElectricKineticGenerator.prototype.onTick = function () {
            var maxOutput = this.calcOutput();
            var output = 0;
            if (this.data.energy >= 1) {
                var side = this.getFacing();
                Logger.Log("qqss", this.getFacing().toString());
                var coords = StorageInterface.getRelativeCoords(this, side);
                Logger.Log("sqss", coords.x.toString() + ";" + coords.y.toString() + ";" + coords.z.toString());
                var tile = this.region.getTileEntity(coords);
                if (tile !== null) {
                    Logger.Log("joosqss", tile.toString());
                }
                if (tile && tile.canReceiveAngularMomentum && tile.canReceiveAngularMomentum(side ^ 1)) {
                    Logger.Log("ss", "angular_electric");
                    output = tile.receiveAngularMomentum(Math.min(maxOutput, this.data.energy));
                    Logger.Log("ss", output.toString());
                    if (output > 0) {
                        this.setActive(true);
                        this.data.energy -= output;
                        var outputText = output.toString();
                        for (var i = outputText.length; i < 6; i++) {
                            outputText += " ";
                        }
                        this.container.setText("textInfo1", outputText + "/");
                    }
                }
            }
            if (output == 0) {
                this.setActive(false);
                this.container.setText("textInfo1", "0     /");
            }
            this.dischargeSlot("slotEnergy");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.setText("textInfo2", maxOutput);
            this.container.sendChanges();
        };
        ElectricKineticGenerator.prototype.getEnergyStorage = function () {
            return 4000;
        };
        ElectricKineticGenerator.prototype.canRotate = function () {
            return true;
        };
        return ElectricKineticGenerator;
    }(Machine.ElectricMachine));
    Machine.ElectricKineticGenerator = ElectricKineticGenerator;
    MachineRegistry.registerPrototype(BlockID.electricKineticGenerator, new ElectricKineticGenerator());
})(Machine || (Machine = {}));
/// <reference path="IReactor.ts" />
BlockRegistry.createBlock("nuclearReactor", [
    { name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.nuclearReactor, "stone", 1);
ItemRegistry.setRarity(BlockID.nuclearReactor, EnumRarity.UNCOMMON);
TileRenderer.setStandardModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);
Block.registerPlaceFunction(BlockID.nuclearReactor, function (coords, item, block, player, region) {
    var _a = coords.relative, x = _a.x, y = _a.y, z = _a.z;
    for (var i = 0; i < 6; i++) {
        var c = World.getRelativeCoords(x, y, z, i);
        if (region.getBlockId(c.x, c.y, c.z) == BlockID.reactorChamber) {
            var tileEnt = World.getTileEntity(c.x, c.y, c.z, region);
            if (tileEnt.core) {
                item.count++;
                return;
            }
        }
    }
    region.setBlock(x, y, z, item.id, 0);
    //World.playSound(x, y, z, "dig.stone", 1, 0.8)
    World.addTileEntity(x, y, z, region);
});
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.nuclearReactor, count: 1, data: 0 }, [
        "xcx",
        "aaa",
        "x#x"
    ], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.densePlateLead, 0, 'c', ItemID.circuitAdvanced, 0]);
});
var reactorElements = {
    "heatScale": { type: "scale", x: 346, y: 376, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: 3 },
    "textInfo": { type: "text", font: { size: 24, color: Color.GREEN }, x: 685, y: 382, width: 256, height: 42, text: Translation.translate("Generating: ") },
};
for (var y = 0; y < 6; y++) {
    for (var x = 0; x < 9; x++) {
        var i = x * 6 + y;
        reactorElements["slot" + i] = { type: "slot", x: 400 + 54 * x, y: 40 + 54 * y, size: 54 };
    }
}
var guiNuclearReactor = MachineRegistry.createInventoryWindow("Nuclear Reactor", {
    drawing: [
        { type: "bitmap", x: 340, y: 370, bitmap: "reactor_info", scale: GUI_SCALE },
    ],
    elements: reactorElements
});
var EUReactorModifier = 5;
var Machine;
(function (Machine) {
    var NuclearReactor = /** @class */ (function (_super) {
        __extends(NuclearReactor, _super);
        function NuclearReactor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                isEnabled: false,
                signal: 0,
                heat: 0,
                maxHeat: 10000,
                hem: 1,
                output: 0
            };
            _this.chambers = [];
            return _this;
        }
        NuclearReactor.prototype.getScreenByName = function () {
            return guiNuclearReactor;
        };
        NuclearReactor.prototype.onInit = function () {
            _super.prototype.onInit.call(this);
            this.chambers = [];
            this.rebuildGrid();
            this.__initialized = true;
            for (var i = 0; i < 6; i++) {
                var coords = StorageInterface.getRelativeCoords(this, i);
                if (this.region.getBlockId(coords) == BlockID.reactorChamber) {
                    var tileEnt = this.region.getTileEntity(coords);
                    if (tileEnt) {
                        this.addChamber(tileEnt);
                    }
                }
            }
        };
        NuclearReactor.prototype.setupContainer = function () {
            this.container.setGlobalAddTransferPolicy(function (container, name, id, amount, data) {
                if (!ReactorItem.isReactorItem(id) || container.getSlot(name).count > 0)
                    return 0;
                return 1;
            });
        };
        NuclearReactor.prototype.addChamber = function (chamber) {
            if (!this.__initialized || chamber.remove || (chamber.core && chamber.core != this)) {
                return;
            }
            if (this.chambers.indexOf(chamber) == -1) {
                this.chambers.push(chamber);
                chamber.core = this;
                chamber.data.corePos = { x: this.x, y: this.y, z: this.z };
            }
            this.energyNode.addConnection(chamber.energyNode);
        };
        NuclearReactor.prototype.removeChamber = function (chamber) {
            this.chambers.splice(this.chambers.indexOf(chamber), 1);
            var x = this.getReactorSize();
            for (var y = 0; y < 6; y++) {
                var slotName = this.getSlotName(x, y);
                var slot = this.container.getSlot(slotName);
                if (slot.id > 0) {
                    this.region.dropAtBlock(chamber.x, chamber.y, chamber.z, slot);
                    this.container.setSlot(slotName, 0, 0, 0);
                }
            }
        };
        NuclearReactor.prototype.getReactorSize = function () {
            return 3 + this.chambers.length;
        };
        NuclearReactor.prototype.processChambers = function () {
            var size = this.getReactorSize();
            for (var pass = 0; pass < 2; pass++) {
                for (var y = 0; y < 6; y++) {
                    for (var x = 0; x < size; x++) {
                        var slot = this.container.getSlot(this.getSlotName(x, y));
                        var component = ReactorItem.getComponent(slot.id);
                        if (component) {
                            component.processChamber(slot, this, x, y, pass == 0);
                        }
                    }
                }
            }
        };
        NuclearReactor.prototype.onTick = function () {
            var reactorSize = this.getReactorSize();
            this.container.sendEvent("setFieldSize", { size: reactorSize });
            if (World.getThreadTime() % 20 == 0) {
                if (this.data.isEnabled) {
                    this.data.maxHeat = 10000;
                    this.data.hem = 1;
                    this.data.output = 0;
                    this.processChambers();
                }
                else {
                    this.data.output = 0;
                }
                if (this.calculateHeatEffects()) {
                    return;
                }
                this.setActive(this.data.heat >= 1000 || this.data.output > 0);
            }
            if (this.data.output > 0) {
                this.startPlaySound();
            }
            else {
                this.stopPlaySound();
            }
            this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
            this.container.setText("textInfo", "Generating: " + this.getEnergyOutput() + " EU/t");
            this.container.sendChanges();
        };
        NuclearReactor.prototype.energyTick = function (type, src) {
            var output = this.getEnergyOutput();
            src.add(output, Math.min(output, 8192));
        };
        NuclearReactor.prototype.updateSignal = function () {
            var signal = this.data.signal;
            for (var _i = 0, _a = this.chambers; _i < _a.length; _i++) {
                var chamber = _a[_i];
                signal = Math.max(signal, chamber.data.signal);
            }
            this.data.isEnabled = signal > 0;
        };
        NuclearReactor.prototype.onRedstoneUpdate = function (signal) {
            this.data.signal = signal;
            this.updateSignal();
        };
        NuclearReactor.prototype.getEnergyOutput = function () {
            return Math.floor(this.data.output * EUReactorModifier);
        };
        NuclearReactor.prototype.startPlaySound = function () {
            if (!IC2Config.machineSoundEnabled || this.remove)
                return;
            if (!this.audioSource) {
                this.audioSource = SoundManager.createSource(SourceType.TILEENTITY, this, "NuclearReactorLoop.ogg");
                ;
            }
            if (this.data.output < 40) {
                var geigerSound = "GeigerLowEU.ogg";
            }
            else if (this.data.output < 80) {
                var geigerSound = "GeigerMedEU.ogg";
            }
            else {
                var geigerSound = "GeigerHighEU.ogg";
            }
            if (!this.audioSourceGeiger) {
                this.audioSourceGeiger = SoundManager.createSource(SourceType.TILEENTITY, this, geigerSound);
            }
            else if (this.audioSourceGeiger.soundName != geigerSound) {
                this.audioSourceGeiger.setSound(geigerSound);
            }
        };
        NuclearReactor.prototype.stopPlaySound = function () {
            if (this.audioSource) {
                SoundManager.removeSource(this.audioSource);
                this.audioSource = null;
            }
            if (this.audioSourceGeiger) {
                SoundManager.removeSource(this.audioSourceGeiger);
                this.audioSourceGeiger = null;
            }
        };
        NuclearReactor.prototype.getHeat = function () {
            return this.data.heat;
        };
        NuclearReactor.prototype.setHeat = function (heat) {
            this.data.heat = heat;
        };
        NuclearReactor.prototype.addHeat = function (amount) {
            return this.data.heat += amount;
        };
        NuclearReactor.prototype.addEmitHeat = function (heat) {
            // not implemented
        };
        NuclearReactor.prototype.getMaxHeat = function () {
            return this.data.maxHeat;
        };
        NuclearReactor.prototype.setMaxHeat = function (newMaxHeat) {
            this.data.maxHeat = newMaxHeat;
        };
        NuclearReactor.prototype.getHeatEffectModifier = function () {
            return this.data.hem;
        };
        NuclearReactor.prototype.setHeatEffectModifier = function (value) {
            this.data.hem = value;
        };
        NuclearReactor.prototype.getSlotName = function (x, y) {
            return "slot" + (x * 6 + y);
        };
        NuclearReactor.prototype.getItemAt = function (x, y) {
            if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
                return null;
            }
            return this.container.getSlot(this.getSlotName(x, y));
        };
        NuclearReactor.prototype.setItemAt = function (x, y, id, count, data, extra) {
            if (extra === void 0) { extra = null; }
            if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
                return null;
            }
            this.container.setSlot(this.getSlotName(x, y), id, count, data, extra);
        };
        NuclearReactor.prototype.getOutput = function () {
            return this.data.output;
        };
        NuclearReactor.prototype.addOutput = function (energy) {
            return this.data.output += energy;
        };
        NuclearReactor.prototype.isFluidCooled = function () {
            return false;
        };
        NuclearReactor.prototype.destroyBlock = function (coords, player) {
            for (var _i = 0, _a = this.chambers; _i < _a.length; _i++) {
                var chamber = _a[_i];
                this.region.destroyBlock(chamber, true);
            }
        };
        NuclearReactor.prototype.explode = function () {
            var explode = false;
            var boomPower = 10;
            var boomMod = 1;
            for (var i = 0; i < this.getReactorSize() * 6; i++) {
                var slot = this.container.getSlot("slot" + i);
                var component = ReactorItem.getComponent(slot.id);
                if (component) {
                    var f = component.influenceExplosion(slot, this);
                    if (f > 0 && f < 1) {
                        boomMod *= f;
                    }
                    else {
                        if (f >= 1)
                            explode = true;
                        boomPower += f;
                    }
                }
                this.container.setSlot("slot" + i, 0, 0, 0);
            }
            if (explode) {
                boomPower = Math.min(boomPower * this.data.hem * boomMod, IC2Config.getFloat("reactor_explosion_max_power"));
                RadiationAPI.addRadiationSource(this.x + .5, this.y + .5, this.z + .5, this.dimension, boomPower, 600);
                this.region.explode(this.x + .5, this.y + .5, this.z + .5, boomPower, false);
                this.selfDestroy();
            }
        };
        NuclearReactor.prototype.calculateHeatEffects = function () {
            var power = this.data.heat / this.data.maxHeat;
            if (power >= 1) {
                this.explode();
                return true;
            }
            if (power >= 0.85 && Math.random() <= 0.2 * this.data.hem) {
                var coord = this.getRandCoord(2);
                var blockId = this.region.getBlockId(coord);
                var material = ToolAPI.getBlockMaterialName(blockId);
                if (blockId == 0) {
                    this.region.setBlock(coord, 51, 0);
                }
                else if (Block.getDestroyTime(blockId) > 0 && this.region.getTileEntity(coord) == null) {
                    if ((material == "stone" || material == "dirt") && !(blockId == VanillaTileID.ice || ItemRegistry.getVanillaStringID(blockId).endsWith("_ice"))) {
                        this.region.setBlock(coord, 11, 1);
                    }
                    else {
                        this.region.setBlock(coord, 51, 0);
                    }
                }
            }
            if (power >= 0.7 && World.getThreadTime() % 20 == 0) {
                var pos = new Vector3(this.x + .5, this.y + .5, this.z + .5);
                var entities = EntityHelper.getEntitiesInRadius(this.region, pos, 4);
                for (var _i = 0, entities_4 = entities; _i < entities_4.length; _i++) {
                    var ent = entities_4[_i];
                    if (EntityHelper.canTakeDamage(ent, DamageSource.radiation)) {
                        RadiationAPI.addEffect(ent, Math.floor(4 * this.data.hem));
                    }
                }
            }
            if (power >= 0.5 && Math.random() <= this.data.hem) {
                var coord = this.getRandCoord(2);
                var blockId = this.region.getBlockId(coord);
                if (blockId == 8 || blockId == 9) {
                    this.region.setBlock(coord, 0, 0);
                }
            }
            if (power >= 0.4 && Math.random() <= this.data.hem) {
                var coord = this.getRandCoord(2);
                var blockId = this.region.getBlockId(coord);
                var material = ToolAPI.getBlockMaterialName(blockId);
                if (material == "wood" || material == "wool" || material == "fibre" || material == "plant") {
                    for (var i = 0; i < 6; i++) {
                        var coord2 = World.getRelativeCoords(coord.x, coord.y, coord.z, i);
                        if (this.region.getBlockId(coord2) == 0) {
                            this.region.setBlock(coord2, 51, 0);
                            break;
                        }
                    }
                }
            }
            return false;
        };
        NuclearReactor.prototype.getRandCoord = function (rad) {
            return new Vector3(this.x + MathUtil.randomInt(-rad, rad), this.y + MathUtil.randomInt(-rad, rad), this.z + MathUtil.randomInt(-rad, rad));
        };
        NuclearReactor.prototype.setFieldSize = function (container, window, content, data) {
            if (content) {
                for (var y = 0; y < 6; y++) {
                    for (var x = 0; x < 9; x++) {
                        var newX = (x < data.size) ? 400 + 54 * x : 1400;
                        content.elements["slot" + (x * 6 + y)].x = newX;
                    }
                }
            }
        };
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], NuclearReactor.prototype, "setFieldSize", null);
        return NuclearReactor;
    }(Machine.Generator));
    Machine.NuclearReactor = NuclearReactor;
    MachineRegistry.registerPrototype(BlockID.nuclearReactor, new NuclearReactor());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("reactorChamber", [
    { name: "Reactor Chamber", texture: [["machine_bottom", 0], ["machine_top", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0], ["reactor_chamber", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.reactorChamber, "stone", 1);
ItemRegistry.setRarity(BlockID.reactorChamber, EnumRarity.UNCOMMON);
Block.registerPlaceFunction(BlockID.reactorChamber, function (coords, item, block, player, region) {
    var _a = coords.relative, x = _a.x, y = _a.y, z = _a.z;
    var reactorConnect = 0;
    for (var i = 0; i < 6; i++) {
        var c = World.getRelativeCoords(x, y, z, i);
        if (region.getBlockId(c.x, c.y, c.z) == BlockID.nuclearReactor) {
            reactorConnect++;
            if (reactorConnect > 1)
                break;
        }
    }
    if (reactorConnect == 1) {
        region.setBlock(x, y, z, item.id, 0);
        //World.playSound(x, y, z, "dig.stone", 1, 0.8)
        World.addTileEntity(x, y, z, region);
    }
    else {
        item.count++;
    }
});
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.reactorChamber, count: 1, data: 0 }, [
        " x ",
        "x#x",
        " x "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.plateLead, 0]);
});
var Machine;
(function (Machine) {
    var ReactorChamber = /** @class */ (function (_super) {
        __extends(ReactorChamber, _super);
        function ReactorChamber() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                corePos: null,
                signal: 0
            };
            _this.core = null;
            return _this;
        }
        ReactorChamber.prototype.getTier = function () {
            return 5;
        };
        ReactorChamber.prototype.onItemClick = function (id, count, data, coords, player, extra) {
            if (this.core) {
                return this.core.onItemClick(id, count, data, coords, player, extra);
            }
            return false;
        };
        ReactorChamber.prototype.onInit = function () {
            if (this.data.corePos && this.region.getBlockId(this.data.corePos) == BlockID.nuclearReactor) {
                var tileEnt = this.region.getTileEntity(this.data.corePos);
                if (tileEnt) {
                    tileEnt.addChamber(this);
                }
            }
            else
                for (var i = 0; i < 6; i++) {
                    var coords = StorageInterface.getRelativeCoords(this, i);
                    if (this.region.getBlockId(coords) == BlockID.nuclearReactor) {
                        var tileEnt = this.region.getTileEntity(coords);
                        if (tileEnt) {
                            tileEnt.addChamber(this);
                            break;
                        }
                    }
                }
        };
        ReactorChamber.prototype.onRedstoneUpdate = function (signal) {
            this.data.signal = signal;
            if (this.core) {
                this.core.updateSignal();
            }
        };
        ReactorChamber.prototype.destroy = function () {
            if (this.core) {
                this.core.removeChamber(this);
            }
            return false;
        };
        ReactorChamber.prototype.isConductor = function () {
            return true;
        };
        return ReactorChamber;
    }(Machine.Generator));
    Machine.ReactorChamber = ReactorChamber;
    MachineRegistry.registerPrototype(BlockID.reactorChamber, new ReactorChamber());
})(Machine || (Machine = {}));
/// <reference path="../ElectricMachine.ts" />
var Machine;
(function (Machine) {
    var BatteryBlock = /** @class */ (function (_super) {
        __extends(BatteryBlock, _super);
        function BatteryBlock(tier, capacity, defaultDrop, guiScreen) {
            var _this = _super.call(this) || this;
            _this.isTeleporterCompatible = true;
            _this.tier = tier;
            _this.capacity = capacity;
            _this.defaultDrop = defaultDrop;
            _this.guiScreen = guiScreen;
            return _this;
        }
        BatteryBlock.prototype.getScreenByName = function () {
            return this.guiScreen;
        };
        BatteryBlock.prototype.getTier = function () {
            return this.tier;
        };
        BatteryBlock.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setSlotValidatePolicy(this.container, "slot1", function (name, id) {
                return ChargeItemRegistry.isValidItem(id, "Eu", _this.getTier());
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slot2", function (name, id) {
                return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
            });
        };
        BatteryBlock.prototype.canRotate = function () {
            return true;
        };
        BatteryBlock.prototype.setFacing = function (side) {
            if (_super.prototype.setFacing.call(this, side)) {
                this.rebuildGrid();
                return true;
            }
            return false;
        };
        BatteryBlock.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            this.dischargeSlot("slot2");
            this.chargeSlot("slot1");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.setText("textInfo1", Math.floor(this.data.energy) + "/");
            this.container.setText("textInfo2", this.getEnergyStorage());
            this.container.sendChanges();
        };
        BatteryBlock.prototype.energyTick = function (type, src) {
            var output = this.getMaxPacketSize();
            if (this.data.energy >= output) {
                this.data.energy += src.add(output) - output;
            }
        };
        BatteryBlock.prototype.getEnergyStorage = function () {
            return this.capacity;
        };
        BatteryBlock.prototype.canReceiveEnergy = function (side) {
            return side != this.getFacing();
        };
        BatteryBlock.prototype.canExtractEnergy = function (side) {
            return side == this.getFacing();
        };
        BatteryBlock.prototype.adjustDrop = function (item) {
            if (item.id == this.blockID && this.data.energy > 0) {
                var extra = new ItemExtraData();
                item.extra = extra.putInt("energy", this.data.energy);
            }
            return item;
        };
        return BatteryBlock;
    }(Machine.ElectricMachine));
    Machine.BatteryBlock = BatteryBlock;
})(Machine || (Machine = {}));
function BatteryBlockWindow(header) {
    return MachineRegistry.createInventoryWindow(header, {
        drawing: [
            { type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE },
        ],
        elements: {
            "energyScale": { type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE },
            "slot1": { type: "slot", x: 441, y: 75 },
            "slot2": { type: "slot", x: 441, y: 212 },
            "textInfo1": { type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/" },
            "textInfo2": { type: "text", x: 642, y: 172, width: 350, height: 30, text: "40000" }
        }
    });
}
var BatteryBlockInterface = {
    slots: {
        "slot1": { input: true, output: true,
            isValid: function (item, side, tileEntity) {
                return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", tileEntity.getTier());
            },
            canOutput: function (item) {
                return ChargeItemRegistry.getEnergyStored(item) >= ChargeItemRegistry.getMaxCharge(item.id);
            }
        },
        "slot2": { input: true, output: true,
            isValid: function (item, side, tileEntity) {
                return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", tileEntity.getTier());
            },
            canOutput: function (item) {
                return ChargeItemRegistry.getEnergyStored(item) <= 0;
            }
        }
    }
};
/// <reference path="./BatteryBlock.ts" />
BlockRegistry.createBlock("storageBatBox", [
    { name: "BatBox", texture: [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.storageBatBox, "wood");
TileRenderer.setHandAndUiModel(BlockID.storageBatBox, 0, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 0, [["batbox_front", 0], ["batbox_back", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 1, [["batbox_back", 0], ["batbox_front", 0], ["batbox_top", 0], ["batbox_bottom", 0], ["batbox_side", 1], ["batbox_side", 2]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 2, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_front", 0], ["batbox_back", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 3, [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_back", 0], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 4, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_front", 0], ["batbox_back", 0]]);
TileRenderer.setStandardModel(BlockID.storageBatBox, 5, [["batbox_bottom", 0], ["batbox_top", 1], ["batbox_side", 0], ["batbox_side", 0], ["batbox_back", 0], ["batbox_front", 0]]);
ItemName.addStorageBlockTooltip("storageBatBox", 1, "40K");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageBatBox, count: 1, data: 0 }, [
        "xax",
        "bbb",
        "xxx"
    ], ['a', ItemID.cableTin1, 0, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});
var guiBatBox = BatteryBlockWindow("BatBox");
var Machine;
(function (Machine) {
    var BatBox = /** @class */ (function (_super) {
        __extends(BatBox, _super);
        function BatBox() {
            return _super.call(this, 1, 40000, BlockID.storageBatBox, guiBatBox) || this;
        }
        return BatBox;
    }(Machine.BatteryBlock));
    MachineRegistry.registerPrototype(BlockID.storageBatBox, new BatBox());
    MachineRegistry.setStoragePlaceFunction("storageBatBox", true);
    StorageInterface.createInterface(BlockID.storageBatBox, BatteryBlockInterface);
})(Machine || (Machine = {}));
/// <reference path="./BatteryBlock.ts" />
BlockRegistry.createBlock("storageCESU", [
    { name: "CESU", texture: [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.storageCESU, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.storageCESU, 0, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageCESU, 0, [["cesu_front", 0], ["cesu_back", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageCESU, 1, [["cesu_back", 0], ["cesu_front", 0], ["cesu_top", 0], ["cesu_top", 0], ["cesu_side", 1], ["cesu_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageCESU, 2, [["cesu_top", 0], ["cesu_top", 0], ["cesu_back", 0], ["cesu_front", 0], ["cesu_side", 0], ["cesu_side", 0]]);
ItemName.addStorageBlockTooltip("storageCESU", 2, "300K");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageCESU, count: 1, data: 0 }, [
        "bxb",
        "aaa",
        "bbb"
    ], ['x', ItemID.cableCopper1, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.plateBronze, 0]);
});
var guiCESU = BatteryBlockWindow("CESU");
var Machine;
(function (Machine) {
    var CESU = /** @class */ (function (_super) {
        __extends(CESU, _super);
        function CESU() {
            return _super.call(this, 2, 300000, BlockID.storageCESU, guiCESU) || this;
        }
        return CESU;
    }(Machine.BatteryBlock));
    MachineRegistry.registerPrototype(BlockID.storageCESU, new CESU());
    MachineRegistry.setStoragePlaceFunction("storageCESU", true);
    StorageInterface.createInterface(BlockID.storageCESU, BatteryBlockInterface);
})(Machine || (Machine = {}));
/// <reference path="./BatteryBlock.ts" />
BlockRegistry.createBlock("storageMFE", [
    { name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.storageMFE, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.storageMFE, 0, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageMFE, 0, [["mfe_front", 0], ["mfe_back", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageMFE, 1, [["mfe_back", 0], ["mfe_front", 0], ["machine_top", 0], ["machine_top", 0], ["mfe_side", 1], ["mfe_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageMFE, 2, [["machine_top", 0], ["machine_top", 0], ["mfe_back", 0], ["mfe_front", 0], ["mfe_side", 0], ["mfe_side", 0]]);
ItemName.addStorageBlockTooltip("storageMFE", 3, "4M");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageMFE, count: 1, data: 0 }, [
        "bab",
        "axa",
        "bab"
    ], ['x', BlockID.machineBlockBasic, 0, 'a', ItemID.storageCrystal, -1, 'b', ItemID.cableGold2, -1]);
});
var guiMFE = BatteryBlockWindow("MFE");
var Machine;
(function (Machine) {
    var MFE = /** @class */ (function (_super) {
        __extends(MFE, _super);
        function MFE() {
            return _super.call(this, 3, 4000000, BlockID.machineBlockBasic, guiMFE) || this;
        }
        return MFE;
    }(Machine.BatteryBlock));
    MachineRegistry.registerPrototype(BlockID.storageMFE, new MFE());
    MachineRegistry.setStoragePlaceFunction("storageMFE", true);
    StorageInterface.createInterface(BlockID.storageMFE, BatteryBlockInterface);
})(Machine || (Machine = {}));
/// <reference path="./BatteryBlock.ts" />
BlockRegistry.createBlock("storageMFSU", [
    { name: "MFSU", texture: [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.storageMFSU, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.storageMFSU, 0, [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]]);
TileRenderer.setStandardModel(BlockID.storageMFSU, 0, [["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.setStandardModel(BlockID.storageMFSU, 1, [["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 1], ["mfsu_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.storageMFSU, 2, [["mfsu_top", 0], ["mfsu_top", 0], ["mfsu_side", 0], ["mfsu_front", 0], ["mfsu_side", 0], ["mfsu_side", 0]]);
ItemRegistry.setRarity(BlockID.storageMFSU, EnumRarity.UNCOMMON);
ItemName.addStorageBlockTooltip("storageMFSU", 4, "60M");
Item.addCreativeGroup("EUStorages", Translation.translate("Energy Storages"), [
    BlockID.storageBatBox,
    BlockID.storageCESU,
    BlockID.storageMFE,
    BlockID.storageMFSU
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.storageMFSU, count: 1, data: 0 }, [
        "aca",
        "axa",
        "aba"
    ], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});
var guiMFSU = BatteryBlockWindow("MFSU");
var Machine;
(function (Machine) {
    var MFSU = /** @class */ (function (_super) {
        __extends(MFSU, _super);
        function MFSU() {
            return _super.call(this, 4, 6e7, BlockID.machineBlockAdvanced, guiMFSU) || this;
        }
        return MFSU;
    }(Machine.BatteryBlock));
    MachineRegistry.registerPrototype(BlockID.storageMFSU, new MFSU());
    MachineRegistry.setStoragePlaceFunction("storageMFSU", true);
    StorageInterface.createInterface(BlockID.storageMFSU, BatteryBlockInterface);
})(Machine || (Machine = {}));
/// <reference path="../ElectricMachine.ts" />
var Machine;
(function (Machine) {
    var Transformer = /** @class */ (function (_super) {
        __extends(Transformer, _super);
        function Transformer(tier, defaultDrop) {
            var _this = _super.call(this) || this;
            _this.defaultValues = {
                energy: 0,
                increaseMode: false
            };
            _this.tier = tier;
            _this.defaultDrop = defaultDrop;
            return _this;
        }
        Transformer.prototype.getScreenName = function () {
            return null;
        };
        Transformer.prototype.getTier = function () {
            return this.tier;
        };
        Transformer.prototype.getEnergyStorage = function () {
            return this.getMaxPacketSize();
        };
        Transformer.prototype.energyTick = function (type, src) {
            var maxVoltage = this.getMaxPacketSize();
            if (this.data.increaseMode) {
                if (this.data.energy >= maxVoltage) {
                    this.data.energy += src.add(maxVoltage, maxVoltage) - maxVoltage;
                }
            }
            else {
                if (this.data.energy >= maxVoltage / 4) {
                    var output = this.data.energy;
                    this.data.energy += src.add(output, maxVoltage / 4) - output;
                }
            }
        };
        Transformer.prototype.onRedstoneUpdate = function (signal) {
            var newMode = signal > 0;
            if (this.data.increaseMode != newMode) {
                this.data.increaseMode = newMode;
                this.rebuildGrid();
            }
        };
        Transformer.prototype.canReceiveEnergy = function (side) {
            if (side == this.getFacing()) {
                return !this.data.increaseMode;
            }
            return this.data.increaseMode;
        };
        Transformer.prototype.canExtractEnergy = function (side) {
            if (side == this.getFacing()) {
                return this.data.increaseMode;
            }
            return !this.data.increaseMode;
        };
        Transformer.prototype.canRotate = function () {
            return true;
        };
        Transformer.prototype.setFacing = function (side) {
            if (_super.prototype.setFacing.call(this, side)) {
                this.rebuildGrid();
                return true;
            }
            return false;
        };
        return Transformer;
    }(Machine.ElectricMachine));
    Machine.Transformer = Transformer;
})(Machine || (Machine = {}));
/// <reference path="./Transformer.ts" />
BlockRegistry.createBlock("transformerLV", [
    { name: "LV Transformer", texture: [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.transformerLV, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.transformerLV, 0, [["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0], ["lv_transformer_front", 0], ["lv_transformer_side", 0], ["lv_transformer_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.transformerLV, true);
ItemName.addTooltip(BlockID.transformerLV, "Low: 32 EU/t High: 128 EU/t");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerLV, count: 1, data: 0 }, [
        "aba",
        "aoa",
        "aba"
    ], ['o', ItemID.coil, 0, 'a', 5, -1, 'b', ItemID.cableTin1, 0]);
});
MachineRegistry.registerPrototype(BlockID.transformerLV, new Machine.Transformer(2));
/// <reference path="./Transformer.ts" />
BlockRegistry.createBlock("transformerMV", [
    { name: "MV Transformer", texture: [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.transformerMV, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.transformerMV, 0, [["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0], ["mv_transformer_front", 0], ["mv_transformer_side", 0], ["mv_transformer_side", 0]], true);
TileRenderer.setRotationFunction(BlockID.transformerMV, true);
ItemName.addTooltip(BlockID.transformerMV, "Low: 128 EU/t High: 512 EU/t");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerMV, count: 1, data: 0 }, [
        "b",
        "x",
        "b"
    ], ['x', BlockID.machineBlockBasic, 0, 'b', ItemID.cableCopper1, 0]);
});
MachineRegistry.registerPrototype(BlockID.transformerMV, new Machine.Transformer(3, BlockID.machineBlockBasic));
/// <reference path="./Transformer.ts" />
BlockRegistry.createBlock("transformerHV", [
    { name: "HV Transformer", texture: [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.transformerHV, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.transformerHV, 0, [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]]);
TileRenderer.setStandardModel(BlockID.transformerHV, 0, [["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.setStandardModel(BlockID.transformerHV, 1, [["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 1], ["hv_transformer_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.transformerHV, 2, [["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0], ["hv_transformer_front", 0], ["hv_transformer_side", 0], ["hv_transformer_side", 0]]);
TileRenderer.setRotationFunction(BlockID.transformerHV, true);
ItemRegistry.setRarity(BlockID.transformerHV, EnumRarity.UNCOMMON);
ItemName.addTooltip(BlockID.transformerHV, "Low: 512 EU/t High: 2048 EU/t");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerHV, count: 1, data: 0 }, [
        " b ",
        "cxa",
        " b "
    ], ['x', BlockID.transformerMV, 0, 'a', ItemID.storageAdvBattery, -1, 'b', ItemID.cableGold2, -1, 'c', ItemID.circuitBasic, -1]);
});
MachineRegistry.registerPrototype(BlockID.transformerHV, new Machine.Transformer(4, BlockID.machineBlockBasic));
/// <reference path="./Transformer.ts" />
BlockRegistry.createBlock("transformerEV", [
    { name: "EV Transformer", texture: [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.transformerEV, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.transformerEV, 0, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
TileRenderer.setStandardModel(BlockID.transformerEV, 0, [["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.setStandardModel(BlockID.transformerEV, 1, [["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 1], ["ev_transformer_side", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.transformerEV, 2, [["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0], ["ev_transformer_front", 0], ["ev_transformer_side", 0], ["ev_transformer_side", 0]]);
TileRenderer.setRotationFunction(BlockID.transformerEV, true);
ItemRegistry.setRarity(BlockID.transformerEV, EnumRarity.UNCOMMON);
ItemName.addTooltip(BlockID.transformerEV, "Low: 2048 EU/t High: 8192 EU/t");
Item.addCreativeGroup("EUTransformers", Translation.translate("Transformers"), [
    BlockID.transformerLV,
    BlockID.transformerMV,
    BlockID.transformerHV,
    BlockID.transformerEV
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.transformerEV, count: 1, data: 0 }, [
        " b ",
        "cxa",
        " b "
    ], ['x', BlockID.transformerHV, 0, 'a', ItemID.storageLapotronCrystal, -1, 'b', ItemID.cableIron3, 0, 'c', ItemID.circuitAdvanced, 0]);
});
MachineRegistry.registerPrototype(BlockID.transformerEV, new Machine.Transformer(5, BlockID.machineBlockBasic));
/// <reference path="../ElectricMachine.ts" />
var Machine;
(function (Machine) {
    var ProcessingMachine = /** @class */ (function (_super) {
        __extends(ProcessingMachine, _super);
        function ProcessingMachine() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                progress: 0
            };
            _this.defaultDrop = BlockID.machineBlockBasic;
            _this.defaultTier = 1;
            _this.defaultEnergyStorage = 1200;
            return _this;
        }
        ProcessingMachine.prototype.getTier = function () {
            return this.tier;
        };
        ProcessingMachine.prototype.getEnergyStorage = function () {
            return this.energyStorage;
        };
        ProcessingMachine.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
                if (name.startsWith("slotSource"))
                    return !!_this.getRecipeResult(id, data);
                if (name == "slotEnergy")
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
                if (name.startsWith("slotUpgrade"))
                    return UpgradeAPI.isValidUpgrade(id, _this);
                return false;
            });
        };
        ProcessingMachine.prototype.getRecipeResult = function (id, data) {
            return null;
        };
        ProcessingMachine.prototype.useUpgrades = function () {
            var upgrades = UpgradeAPI.useUpgrades(this);
            this.tier = upgrades.getTier(this.defaultTier);
            this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
            this.energyDemand = upgrades.getEnergyDemand(this.defaultEnergyDemand);
            this.processTime = upgrades.getProcessTime(this.defaultProcessTime);
            return upgrades;
        };
        ProcessingMachine.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var newActive = false;
            var sourceSlot = this.container.getSlot("slotSource");
            var result = this.getRecipeResult(sourceSlot.id, sourceSlot.data);
            if (result && (sourceSlot.count >= result.sourceCount || !result.sourceCount)) {
                var resultSlot = this.container.getSlot("slotResult");
                if (resultSlot.id == result.id && (!result.data || resultSlot.data == result.data) && resultSlot.count <= 64 - result.count || resultSlot.id == 0) {
                    if (this.data.energy >= this.energyDemand) {
                        this.data.energy -= this.energyDemand;
                        this.data.progress += 1 / this.processTime;
                        newActive = true;
                    }
                    if (+this.data.progress.toFixed(3) >= 1) {
                        var sourceCount = result.sourceCount || 1;
                        sourceSlot.setSlot(sourceSlot.id, sourceSlot.count - sourceCount, sourceSlot.data);
                        sourceSlot.validate();
                        resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data || 0);
                        this.data.progress = 0;
                    }
                }
            }
            else {
                this.data.progress = 0;
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        ProcessingMachine.prototype.canRotate = function (side) {
            return side > 1;
        };
        return ProcessingMachine;
    }(Machine.ElectricMachine));
    Machine.ProcessingMachine = ProcessingMachine;
})(Machine || (Machine = {}));
BlockRegistry.createBlock("ironFurnace", [
    { name: "Iron Furnace", texture: [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.ironFurnace, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.ironFurnace, 2, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.ironFurnace, 2, [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 1], ["iron_furnace_side", 0], ["iron_furnace_side", 0]]);
TileRenderer.setRotationFunction(BlockID.ironFurnace);
Callback.addCallback("PreLoaded", function () {
    Item.addCreativeGroup("IC2ProcessingMachines", Translation.translate("Processing Machines"), [
        BlockID.ironFurnace,
        BlockID.electricFurnace,
        BlockID.inductionFurnace,
        BlockID.macerator,
        BlockID.compressor,
        BlockID.extractor,
        BlockID.solidCanner,
        BlockID.canner,
        BlockID.recycler,
        BlockID.metalFormer,
        BlockID.oreWasher,
        BlockID.thermalCentrifuge,
        BlockID.blastFurnace,
        BlockID.icFermenter,
        BlockID.massFabricator
    ]);
    Recipes.addShaped({ id: BlockID.ironFurnace, count: 1, data: 0 }, [
        " x ",
        "x x",
        "x#x"
    ], ['#', 61, -1, 'x', ItemID.plateIron, 0]);
});
var guiIronFurnace = MachineRegistry.createInventoryWindow("Iron Furnace", {
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "fire_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("furnace");
                }
            } },
        "burningScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotFuel": { type: "slot", x: 441, y: 218 },
        "slotResult": { type: "slot", x: 625, y: 148 },
    }
});
var Machine;
(function (Machine) {
    var IronFurnace = /** @class */ (function (_super) {
        __extends(IronFurnace, _super);
        function IronFurnace() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                progress: 0,
                burn: 0,
                burnMax: 0
            };
            return _this;
        }
        IronFurnace.prototype.getScreenByName = function () {
            return guiIronFurnace;
        };
        IronFurnace.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setSlotValidatePolicy(this.container, "slotSource", function (name, id, count, data) {
                return !!_this.getRecipeResult(id, data);
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", function (name, id, count, data) {
                return Recipes.getFuelBurnDuration(id, data) > 0;
            });
            this.container.setSlotAddTransferPolicy("slotResult", function () { return 0; });
        };
        IronFurnace.prototype.consumeFuel = function () {
            var fuelSlot = this.container.getSlot("slotFuel");
            if (fuelSlot.id > 0) {
                var burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data);
                if (burn > 0) {
                    if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
                        var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
                        fuelSlot.setSlot(empty.id, 1, empty.data);
                    }
                    else {
                        this.decreaseSlot(fuelSlot, 1);
                    }
                    return burn;
                }
            }
            return 0;
        };
        IronFurnace.prototype.getRecipeResult = function (id, data) {
            return Recipes.getFurnaceRecipeResult(id, data, "iron");
        };
        IronFurnace.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            var sourceSlot = this.container.getSlot("slotSource");
            var resultSlot = this.container.getSlot("slotResult");
            var result = this.getRecipeResult(sourceSlot.id, sourceSlot.data);
            var resetProgress = true;
            if (result && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0)) {
                if (this.data.burn == 0) {
                    this.data.burn = this.data.burnMax = this.consumeFuel();
                }
                if (this.data.burn > 0) {
                    resetProgress = false;
                    if (this.data.progress++ >= 160) {
                        this.decreaseSlot(sourceSlot, 1);
                        resultSlot.setSlot(result.id, resultSlot.count + 1, result.data);
                        this.data.progress = 0;
                    }
                }
            }
            if (resetProgress) {
                this.data.progress = 0;
            }
            if (this.data.burn > 0) {
                this.data.burn--;
                this.setActive(true);
            }
            else {
                this.setActive(false);
            }
            this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
            this.container.setScale("progressScale", this.data.progress / 160);
            this.container.sendChanges();
        };
        IronFurnace.prototype.getOperationSound = function () {
            return "IronFurnaceOp.ogg";
        };
        IronFurnace.prototype.canRotate = function (side) {
            return side > 1;
        };
        return IronFurnace;
    }(Machine.MachineBase));
    Machine.IronFurnace = IronFurnace;
    MachineRegistry.registerPrototype(BlockID.ironFurnace, new IronFurnace());
    StorageInterface.createInterface(BlockID.ironFurnace, {
        slots: {
            "slotSource": { input: true, side: "up", isValid: function (item) {
                    return !!Recipes.getFurnaceRecipeResult(item.id, item.data, "iron");
                } },
            "slotFuel": { input: true, side: "horizontal", isValid: function (item) {
                    return Recipes.getFuelBurnDuration(item.id, item.data) > 0;
                } },
            "slotResult": { output: true }
        }
    });
})(Machine || (Machine = {}));
/// <reference path="ProcessingMachine.ts" />
BlockRegistry.createBlock("electricFurnace", [
    { name: "Electric Furnace", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.electricFurnace, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.electricFurnace, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.electricFurnace, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["electric_furnace", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.electricFurnace);
ItemName.addTierTooltip("electricFurnace", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.electricFurnace, count: 1, data: 0 }, [
        " a ",
        "x#x"
    ], ['#', BlockID.ironFurnace, -1, 'x', 331, 0, 'a', ItemID.circuitBasic, 0]);
});
var guiElectricFurnace = MachineRegistry.createInventoryWindow("Electric Furnace", {
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("furnace");
                }
            } },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotEnergy": { type: "slot", x: 441, y: 218 },
        "slotResult": { type: "slot", x: 625, y: 148 },
        "slotUpgrade1": { type: "slot", x: 820, y: 60 },
        "slotUpgrade2": { type: "slot", x: 820, y: 119 },
        "slotUpgrade3": { type: "slot", x: 820, y: 178 },
        "slotUpgrade4": { type: "slot", x: 820, y: 237 },
    }
});
var Machine;
(function (Machine) {
    var ElectricFurnace = /** @class */ (function (_super) {
        __extends(ElectricFurnace, _super);
        function ElectricFurnace() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultEnergyDemand = 3;
            _this.defaultProcessTime = 130;
            _this.defaultDrop = BlockID.ironFurnace;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];
            return _this;
        }
        ElectricFurnace.prototype.getScreenByName = function () {
            return guiElectricFurnace;
        };
        ElectricFurnace.prototype.getRecipeResult = function (id, data) {
            return Recipes.getFurnaceRecipeResult(id, data, "iron");
        };
        ElectricFurnace.prototype.getStartingSound = function () {
            return "ElectroFurnaceStart.ogg";
        };
        ElectricFurnace.prototype.getOperationSound = function () {
            return "ElectroFurnaceLoop.ogg";
        };
        ElectricFurnace.prototype.getInterruptSound = function () {
            return "ElectroFurnaceStop.ogg";
        };
        return ElectricFurnace;
    }(Machine.ProcessingMachine));
    Machine.ElectricFurnace = ElectricFurnace;
    MachineRegistry.registerPrototype(BlockID.electricFurnace, new ElectricFurnace());
    StorageInterface.createInterface(BlockID.electricFurnace, {
        slots: {
            "slotSource": { input: true },
            "slotResult": { output: true }
        },
        isValidInput: function (item) {
            return !!Recipes.getFurnaceRecipeResult(item.id, item.data, "iron");
        }
    });
})(Machine || (Machine = {}));
/// <reference path="ProcessingMachine.ts" />
BlockRegistry.createBlock("inductionFurnace", [
    { name: "Induction Furnace", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.inductionFurnace, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.inductionFurnace, 2, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.inductionFurnace, 2, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);
TileRenderer.setRotationFunction(BlockID.inductionFurnace);
ItemRegistry.setRarity(BlockID.inductionFurnace, EnumRarity.UNCOMMON);
ItemName.addTierTooltip("inductionFurnace", 2);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.inductionFurnace, count: 1, data: 0 }, [
        "xxx",
        "x#x",
        "xax"
    ], ['#', BlockID.electricFurnace, -1, 'x', ItemID.ingotCopper, 0, 'a', BlockID.machineBlockAdvanced, 0]);
});
var guiInductionFurnace = MachineRegistry.createInventoryWindow("Induction Furnace", {
    drawing: [
        { type: "bitmap", x: 630, y: 146, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 630, y: 146, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("furnace");
                }
            } },
        "energyScale": { type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource1": { type: "slot", x: 511, y: 75 },
        "slotSource2": { type: "slot", x: 571, y: 75 },
        "slotEnergy": { type: "slot", x: 541, y: 212 },
        "slotResult1": { type: "slot", x: 725, y: 142 },
        "slotResult2": { type: "slot", x: 785, y: 142 },
        "slotUpgrade1": { type: "slot", x: 900, y: 80 },
        "slotUpgrade2": { type: "slot", x: 900, y: 144 },
        "slotUpgrade3": { type: "slot", x: 900, y: 208 },
        "textInfo1": { type: "text", x: 402, y: 143, width: 100, height: 30, text: Translation.translate("Heat:") },
        "textInfo2": { type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%" },
    }
});
var Machine;
(function (Machine) {
    var InductionFurnace = /** @class */ (function (_super) {
        __extends(InductionFurnace, _super);
        function InductionFurnace() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                progress: 0,
                heat: 0
            };
            _this.energyDemand = 16;
            _this.defaultTier = 2;
            _this.defaultEnergyStorage = 10000;
            _this.defaultDrop = BlockID.machineBlockAdvanced;
            _this.upgrades = ["transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"];
            _this.isHeating = false;
            return _this;
        }
        InductionFurnace.prototype.getScreenByName = function () {
            return guiInductionFurnace;
        };
        InductionFurnace.prototype.getRecipeResult = function (id, data) {
            return Recipes.getFurnaceRecipeResult(id, data, "iron");
        };
        InductionFurnace.prototype.checkResult = function (result, slot) {
            return result && (slot.id == result.id && slot.data == result.data && slot.count < 64 || slot.id == 0);
        };
        InductionFurnace.prototype.putResult = function (result, sourceSlot, resultSlot) {
            if (this.checkResult(result, resultSlot)) {
                this.decreaseSlot(sourceSlot, 1);
                resultSlot.setSlot(result.id, resultSlot.count + 1, result.data);
            }
        };
        InductionFurnace.prototype.useUpgrades = function () {
            var upgrades = UpgradeAPI.useUpgrades(this);
            this.tier = upgrades.getTier(this.defaultTier);
            this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
            this.isHeating = upgrades.getRedstoneInput(this.isPowered);
            return upgrades;
        };
        InductionFurnace.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var newActive = false;
            var sourceSlot1 = this.container.getSlot("slotSource1");
            var sourceSlot2 = this.container.getSlot("slotSource2");
            var resultSlot1 = this.container.getSlot("slotResult1");
            var resultSlot2 = this.container.getSlot("slotResult2");
            var result1 = this.getRecipeResult(sourceSlot1.id, sourceSlot1.data);
            var result2 = this.getRecipeResult(sourceSlot2.id, sourceSlot2.data);
            if (this.checkResult(result1, resultSlot1) || this.checkResult(result2, resultSlot2)) {
                if (this.data.energy >= this.energyDemand && this.data.progress < 100) {
                    this.data.energy -= this.energyDemand;
                    if (this.data.heat < 10000) {
                        this.data.heat++;
                    }
                    this.data.progress += this.data.heat / 1200;
                    newActive = true;
                }
                if (this.data.progress >= 100) {
                    this.putResult(result1, sourceSlot1, resultSlot1);
                    this.putResult(result2, sourceSlot2, resultSlot2);
                    this.data.progress = 0;
                }
            }
            else {
                this.data.progress = 0;
                if (this.isHeating && this.data.energy > 0) {
                    if (this.data.heat < 10000) {
                        this.data.heat++;
                    }
                    this.data.energy--;
                }
                else {
                    this.data.heat = Math.max(0, this.data.heat - 4);
                }
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            this.container.setScale("progressScale", this.data.progress / 100);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.setText("textInfo2", Math.floor(this.data.heat / 100) + "%");
            this.container.sendChanges();
        };
        InductionFurnace.prototype.onRedstoneUpdate = function (signal) {
            this.isPowered = signal > 0;
        };
        InductionFurnace.prototype.getStartingSound = function () {
            return "InductionStart.ogg";
        };
        InductionFurnace.prototype.getOperationSound = function () {
            return "InductionLoop.ogg";
        };
        InductionFurnace.prototype.getInterruptSound = function () {
            return "InductionStop.ogg";
        };
        return InductionFurnace;
    }(Machine.ProcessingMachine));
    Machine.InductionFurnace = InductionFurnace;
    MachineRegistry.registerPrototype(BlockID.inductionFurnace, new InductionFurnace());
    StorageInterface.createInterface(BlockID.inductionFurnace, {
        slots: {
            "slotSource1": { input: true },
            "slotSource2": { input: true },
            "slotResult1": { output: true },
            "slotResult2": { output: true }
        },
        isValidInput: function (item) {
            return !!Recipes.getFurnaceRecipeResult(item.id, item.data, "iron");
        }
    });
})(Machine || (Machine = {}));
/// <reference path="ProcessingMachine.ts" />
BlockRegistry.createBlock("macerator", [
    { name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.macerator, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.macerator, 2, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.macerator, 2, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["macerator_front", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.macerator);
ItemName.addTierTooltip("macerator", 1);
Callback.addCallback("PreLoaded", function () {
    if (IC2Config.hardRecipes) {
        Recipes.addShaped({ id: BlockID.macerator, count: 1, data: 0 }, [
            "xxx",
            "b#b",
            " a "
        ], ['#', BlockID.machineBlockBasic, -1, 'x', 264, -1, 'b', ItemID.circuitBasic, -1, 'a', ItemID.electricMotor, -1]);
    }
    else {
        Recipes.addShaped({ id: BlockID.macerator, count: 1, data: 0 }, [
            "xxx",
            "b#b",
            " a "
        ], ['#', BlockID.machineBlockBasic, -1, 'x', 318, -1, 'b', 4, -1, 'a', ItemID.circuitBasic, -1]);
    }
    MachineRecipeRegistry.registerRecipesFor("macerator", {
        // ores
        "minecraft:gold_ore": { id: ItemID.crushedGold, count: 2, data: 0 },
        "minecraft:iron_ore": { id: ItemID.crushedIron, count: 2, data: 0 },
        "BlockID.oreCopper": { id: ItemID.crushedCopper, count: 2, data: 0 },
        "BlockID.oreTin": { id: ItemID.crushedTin, count: 2, data: 0 },
        "BlockID.oreLead": { id: ItemID.crushedLead, count: 2, data: 0 },
        "BlockID.oreSilver": { id: ItemID.crushedSilver, count: 2, data: 0 },
        "BlockID.oreUranium": { id: ItemID.crushedUranium, count: 2, data: 0 },
        // ingots
        "minecraft:iron_ingot": { id: ItemID.dustIron, count: 1, data: 0 },
        "minecraft:gold_ingot": { id: ItemID.dustGold, count: 1, data: 0 },
        "ItemID.ingotCopper": { id: ItemID.dustCopper, count: 1, data: 0 },
        "ItemID.ingotTin": { id: ItemID.dustTin, count: 1, data: 0 },
        "ItemID.ingotBronze": { id: ItemID.dustBronze, count: 1, data: 0 },
        "ItemID.ingotSteel": { id: ItemID.dustSteel, count: 1, data: 0 },
        "ItemID.ingotLead": { id: ItemID.dustLead, count: 1, data: 0 },
        "ItemID.ingotSilver": { id: ItemID.dustSilver, count: 1, data: 0 },
        // plates
        "ItemID.plateIron": { id: ItemID.dustIron, count: 1, data: 0 },
        "ItemID.plateGold": { id: ItemID.dustGold, count: 1, data: 0 },
        "ItemID.plateCopper": { id: ItemID.dustCopper, count: 1, data: 0 },
        "ItemID.plateTin": { id: ItemID.dustTin, count: 1, data: 0 },
        "ItemID.plateBronze": { id: ItemID.dustBronze, count: 1, data: 0 },
        "ItemID.plateSteel": { id: ItemID.dustSteel, count: 1, data: 0 },
        "ItemID.plateLead": { id: ItemID.dustLead, count: 1, data: 0 },
        "ItemID.plateLapis": { id: ItemID.dustLapis, count: 1, data: 0 },
        // dense plates
        "ItemID.densePlateIron": { id: ItemID.dustIron, count: 9, data: 0 },
        "ItemID.densePlateGold": { id: ItemID.dustGold, count: 9, data: 0 },
        "ItemID.densePlateCopper": { id: ItemID.dustCopper, count: 9, data: 0 },
        "ItemID.densePlateTin": { id: ItemID.dustTin, count: 9, data: 0 },
        "ItemID.densePlateBronze": { id: ItemID.dustBronze, count: 9, data: 0 },
        "ItemID.densePlateSteel": { id: ItemID.dustSteel, count: 9, data: 0 },
        "ItemID.densePlateLead": { id: ItemID.dustLead, count: 9, data: 0 },
        // other resources
        "minecraft:lapis_block": { id: ItemID.dustLapis, count: 9, data: 0 },
        "minecraft:coal_block": { id: ItemID.dustCoal, count: 9, data: 0 },
        "minecraft:coal:0": { id: ItemID.dustCoal, count: 1, data: 0 },
        "minecraft:diamond": { id: ItemID.dustDiamond, count: 1, data: 0 },
        "minecraft:lapis_lazuli": { id: ItemID.dustLapis, count: 1, data: 0 },
        "minecraft:spider_eye": { id: ItemID.grinPowder, count: 2, data: 0 },
        "minecraft:poisonous_potato": { id: ItemID.grinPowder, count: 1, data: 0 },
        // other materials
        "minecraft:stone:0": { id: 4, count: 1, data: 0 },
        "minecraft:cobblestone": { id: 12, count: 1, data: 0 },
        "minecraft:gravel": { id: 318, count: 1, data: 0 },
        "minecraft:sandstone": { id: 12, count: 2, data: 0 },
        "minecraft:wool": { id: 287, count: 2, data: 0 },
        "minecraft:ice": { id: 332, count: 4, data: 0 },
        "minecraft:glowstone": { id: 348, count: 4, data: 0 },
        "minecraft:redstone_block": { id: 331, count: 9, data: 0 },
        "minecraft:quartz_block": { id: 406, count: 4, data: 0 },
        "minecraft:quartz_stairs": { id: 406, count: 6, data: 0 },
        "minecraft:sandstone_stairs": { id: 12, count: 3, data: 0 },
        "minecraft:red_sandstone": { id: 12, count: 2, data: 1 },
        "minecraft:red_sandstone_stairs": { id: 12, count: 3, data: 1 },
        "minecraft:bone": IDConverter.getStack("bone_meal", 5),
        "minecraft:blaze_rod": { id: 377, count: 5, data: 0 },
        // plants
        "minecraft:planks": { id: ItemID.bioChaff, count: 1, sourceCount: 4 },
        "BlockID.rubberTreeSapling": { id: ItemID.bioChaff, count: 1, sourceCount: 4 },
        "BlockID.rubberTreeLeaves": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:leaves": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:leaves2": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:deadbush": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:cactus": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:pumpkin": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:wheat": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:reeds": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:melon_slice": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:carrot": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:potato": { id: ItemID.bioChaff, count: 1, sourceCount: 8 },
        "minecraft:pumpkin_seeds": { id: ItemID.bioChaff, count: 1, sourceCount: 16 },
        "minecraft:melon_seeds": { id: ItemID.bioChaff, count: 1, sourceCount: 16 },
        "ItemID.weed": { id: ItemID.bioChaff, count: 1, sourceCount: 32 },
        "ItemID.bioChaff": { id: 3, count: 1, data: 0 },
        "ItemID.coffeeBeans": { id: ItemID.coffeePowder, count: 3, data: 0 },
    }, true);
});
var guiMacerator = MachineRegistry.createInventoryWindow("Macerator", {
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "macerator_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, bitmap: "macerator_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_macerator");
                }
            } },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotEnergy": { type: "slot", x: 441, y: 218 },
        "slotResult": { type: "slot", x: 625, y: 148 },
        "slotUpgrade1": { type: "slot", x: 820, y: 60 },
        "slotUpgrade2": { type: "slot", x: 820, y: 119 },
        "slotUpgrade3": { type: "slot", x: 820, y: 178 },
        "slotUpgrade4": { type: "slot", x: 820, y: 237 },
    }
});
var Machine;
(function (Machine) {
    var Macerator = /** @class */ (function (_super) {
        __extends(Macerator, _super);
        function Macerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultEnergyDemand = 2;
            _this.defaultProcessTime = 300;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];
            return _this;
        }
        Macerator.prototype.getScreenByName = function () {
            return guiMacerator;
        };
        Macerator.prototype.getRecipeResult = function (id, data) {
            return MachineRecipeRegistry.getRecipeResult("macerator", id, data);
        };
        Macerator.prototype.getOperationSound = function () {
            return "MaceratorOp.ogg";
        };
        Macerator.prototype.getInterruptSound = function () {
            return "InterruptOne.ogg";
        };
        return Macerator;
    }(Machine.ProcessingMachine));
    Machine.Macerator = Macerator;
    MachineRegistry.registerPrototype(BlockID.macerator, new Macerator());
    StorageInterface.createInterface(BlockID.macerator, {
        slots: {
            "slotSource": { input: true },
            "slotResult": { output: true }
        },
        isValidInput: function (item) {
            return MachineRecipeRegistry.hasRecipeFor("macerator", item.id, item.data);
        }
    });
})(Machine || (Machine = {}));
/// <reference path="ProcessingMachine.ts" />
BlockRegistry.createBlock("compressor", [
    { name: "Compressor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.compressor, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.compressor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.compressor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["compressor", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.compressor);
ItemName.addTierTooltip("compressor", 1);
Callback.addCallback("PreLoaded", function () {
    if (IC2Config.hardRecipes) {
        Recipes.addShaped({ id: BlockID.compressor, count: 1, data: 0 }, [
            "p#p",
            "xax"
        ], ['#', BlockID.machineBlockBasic, -1, 'x', ItemID.circuitBasic, -1, 'a', ItemID.electricMotor, -1, 'p', VanillaBlockID.piston, -1]);
    }
    else {
        Recipes.addShaped({ id: BlockID.compressor, count: 1, data: 0 }, [
            "x x",
            "x#x",
            "xax"
        ], ['#', BlockID.machineBlockBasic, -1, 'x', 1, -1, 'a', ItemID.circuitBasic, -1]);
    }
    MachineRecipeRegistry.registerRecipesFor("compressor", {
        // Blocks
        "minecraft:snow": { id: 79, count: 1, data: 0 },
        "minecraft:sand": { id: 24, count: 1, data: 0, sourceCount: 4 },
        "minecraft:brick": { id: 45, count: 1, data: 0, sourceCount: 4 },
        "minecraft:netherbrick": { id: 112, count: 1, data: 0, sourceCount: 4 },
        "minecraft:glowstone_dust": { id: 89, count: 1, data: 0, sourceCount: 4 },
        "minecraft:quartz": { id: 155, count: 1, data: 0, sourceCount: 4 },
        // Items
        "ItemID.dustEnergium": { id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), sourceCount: 9 },
        "ItemID.ingotAlloy": { id: ItemID.plateAlloy, count: 1, data: 0 },
        "ItemID.carbonMesh": { id: ItemID.carbonPlate, count: 1, data: 0 },
        "ItemID.coalBall": { id: ItemID.coalBlock, count: 1, data: 0 },
        "ItemID.coalChunk": { id: 264, count: 1, data: 0 },
        "ItemID.cellEmpty": { id: ItemID.cellAir, count: 1, data: 0 },
        "ItemID.dustLapis": { id: ItemID.plateLapis, count: 1, data: 0 },
        // Dense Plates
        "ItemID.plateIron": { id: ItemID.densePlateIron, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateGold": { id: ItemID.densePlateGold, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateTin": { id: ItemID.densePlateTin, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateCopper": { id: ItemID.densePlateCopper, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateBronze": { id: ItemID.densePlateBronze, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateSteel": { id: ItemID.densePlateSteel, count: 1, data: 0, sourceCount: 9 },
        "ItemID.plateLead": { id: ItemID.densePlateLead, count: 1, data: 0, sourceCount: 9 },
        // Compact
        "minecraft:redstone": { id: 152, count: 1, data: 0, sourceCount: 9 },
        "minecraft:lapis_lazuli": { id: 22, count: 1, data: 0, sourceCount: 9 },
        "minecraft:diamond": { id: 57, count: 1, data: 0, sourceCount: 9 },
        "minecraft:emerald": { id: 133, count: 1, data: 0, sourceCount: 9 },
        "minecraft:iron_ingot": { id: 42, count: 1, data: 0, sourceCount: 9 },
        "minecraft:gold_ingot": { id: 41, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotCopper": { id: BlockID.blockCopper, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotTin": { id: BlockID.blockTin, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotLead": { id: BlockID.blockLead, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotSteel": { id: BlockID.blockSteel, count: 1, data: 0, sourceCount: 9 },
        "ItemID.ingotBronze": { id: BlockID.blockBronze, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallIron": { id: ItemID.dustIron, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallGold": { id: ItemID.dustGold, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallCopper": { id: ItemID.dustCopper, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallTin": { id: ItemID.dustTin, count: 1, data: 0, sourceCount: 9 },
        "ItemID.dustSmallLead": { id: ItemID.dustLead, count: 1, data: 0, sourceCount: 9 },
        "ItemID.smallUranium235": { id: ItemID.uranium235, count: 1, data: 0, sourceCount: 9 },
        "ItemID.smallPlutonium": { id: ItemID.plutonium, count: 1, data: 0, sourceCount: 9 }
    }, true);
});
var guiCompressor = MachineRegistry.createInventoryWindow("Compressor", {
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "compressor_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE },
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, bitmap: "compressor_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_compressor");
                }
            } },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotEnergy": { type: "slot", x: 441, y: 218 },
        "slotResult": { type: "slot", x: 625, y: 148 },
        "slotUpgrade1": { type: "slot", x: 820, y: 60, },
        "slotUpgrade2": { type: "slot", x: 820, y: 119 },
        "slotUpgrade3": { type: "slot", x: 820, y: 178 },
        "slotUpgrade4": { type: "slot", x: 820, y: 237 },
    }
});
var Machine;
(function (Machine) {
    var Compressor = /** @class */ (function (_super) {
        __extends(Compressor, _super);
        function Compressor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultEnergyDemand = 2;
            _this.defaultProcessTime = 400;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];
            return _this;
        }
        Compressor.prototype.getScreenByName = function () {
            return guiCompressor;
        };
        Compressor.prototype.getRecipeResult = function (id, data) {
            return MachineRecipeRegistry.getRecipeResult("compressor", id, data);
        };
        Compressor.prototype.getOperationSound = function () {
            return "CompressorOp.ogg";
        };
        Compressor.prototype.getInterruptSound = function () {
            return "InterruptOne.ogg";
        };
        return Compressor;
    }(Machine.ProcessingMachine));
    Machine.Compressor = Compressor;
    MachineRegistry.registerPrototype(BlockID.compressor, new Compressor());
    StorageInterface.createInterface(BlockID.compressor, {
        slots: {
            "slotSource": { input: true },
            "slotResult": { output: true }
        },
        isValidInput: function (item) {
            return MachineRecipeRegistry.hasRecipeFor("compressor", item.id, item.data);
        }
    });
})(Machine || (Machine = {}));
/// <reference path="ProcessingMachine.ts" />
BlockRegistry.createBlock("extractor", [
    { name: "Extractor", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.extractor, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.extractor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.extractor, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["extractor_front", 1], ["extractor_side", 1], ["extractor_side", 1]]);
TileRenderer.setRotationFunction(BlockID.extractor);
ItemName.addTierTooltip("extractor", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.extractor, count: 1, data: 0 }, [
        "x#x",
        "xax"
    ], ['#', BlockID.machineBlockBasic, -1, 'x', ItemID.treetap, 0, 'a', ItemID.circuitBasic, -1]);
    MachineRecipeRegistry.registerRecipesFor("extractor", {
        "ItemID.latex": { id: ItemID.rubber, count: 3 },
        "BlockID.rubberTreeSapling": { id: ItemID.rubber, count: 1 },
        "BlockID.rubberTreeLog": { id: ItemID.rubber, count: 1 },
        "minecraft:wool": { id: 35, count: 1 },
        "minecraft:gunpowder": { id: ItemID.dustSulfur, count: 1 },
        "ItemID.tinCanFull": { id: ItemID.tinCanEmpty, count: 1 },
    }, true);
});
var guiExtractor = MachineRegistry.createInventoryWindow("Extractor", {
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "extractor_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, bitmap: "extractor_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_extractor");
                }
            } },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotEnergy": { type: "slot", x: 441, y: 218 },
        "slotResult": { type: "slot", x: 625, y: 148 },
        "slotUpgrade1": { type: "slot", x: 820, y: 60 },
        "slotUpgrade2": { type: "slot", x: 820, y: 119 },
        "slotUpgrade3": { type: "slot", x: 820, y: 178 },
        "slotUpgrade4": { type: "slot", x: 820, y: 237 },
    }
});
var Machine;
(function (Machine) {
    var Extractor = /** @class */ (function (_super) {
        __extends(Extractor, _super);
        function Extractor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultEnergyDemand = 2;
            _this.defaultProcessTime = 400;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];
            return _this;
        }
        Extractor.prototype.getScreenByName = function () {
            return guiExtractor;
        };
        Extractor.prototype.getRecipeResult = function (id) {
            return MachineRecipeRegistry.getRecipeResult("extractor", id);
        };
        Extractor.prototype.getOperationSound = function () {
            return "ExtractorOp.ogg";
        };
        Extractor.prototype.getInterruptSound = function () {
            return "InterruptOne.ogg";
        };
        return Extractor;
    }(Machine.ProcessingMachine));
    Machine.Extractor = Extractor;
    MachineRegistry.registerPrototype(BlockID.extractor, new Extractor());
    StorageInterface.createInterface(BlockID.extractor, {
        slots: {
            "slotSource": { input: true },
            "slotResult": { output: true }
        },
        isValidInput: function (item) {
            return MachineRecipeRegistry.hasRecipeFor("extractor", item.id);
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("solidCanner", [
    { name: "Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.solidCanner, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.solidCanner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["solid_canner", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.solidCanner);
ItemName.addTierTooltip("solidCanner", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.solidCanner, count: 1, data: 0 }, [
        "c#c",
        "cxc",
        "ccc"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingTin, 0]);
    MachineRecipeRegistry.registerRecipesFor("solidCanner", {
        "ItemID.uranium": { can: ItemID.fuelRod, result: { id: ItemID.fuelRodUranium, count: 1, data: 0 } },
        "ItemID.mox": { can: ItemID.fuelRod, result: { id: ItemID.fuelRodMOX, count: 1, data: 0 } },
        "minecraft:cake": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 14, data: 0 } },
        "minecraft:rabbit_stew": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 10, data: 0 } },
        "minecraft:cooked_porkchop": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 8, data: 0 } },
        "minecraft:cooked_beef": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 8, data: 0 } },
        "minecraft:pumpkin_pie": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 8, data: 0 } },
        "minecraft:mushroom_stew": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 6, data: 0 } },
        "minecraft:cooked_chicken": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 6, data: 0 } },
        "minecraft:golden_carrot": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 6, data: 0 } },
        "minecraft:muttoncooked": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 6, data: 0 } },
        "minecraft:beetroot_soup": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 6, data: 0 } },
        "minecraft:cooked_salmon": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 6, data: 0 } },
        "minecraft:bread": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 5, data: 0 } },
        "minecraft:cooked_cod": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 5, data: 0 } },
        "minecraft:baked_potato": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 5, data: 0 } },
        "minecraft:cooked_rabbit": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 5, data: 0 } },
        "minecraft:rotten_flesh": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 4, data: 1 } },
        "minecraft:apple": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 4, data: 0 } },
        "minecraft:porkchop": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 3, data: 0 } },
        "minecraft:beef": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 3, data: 0 } },
        "minecraft:carrot": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 3, data: 0 } },
        "minecraft:rabbit": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 3, data: 0 } },
        "minecraft:cookie": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 0 } },
        "minecraft:melon_slice": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 0 } },
        "minecraft:chicken": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 1 } },
        "minecraft:spider_eye": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 2 } },
        "minecraft:cod": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 0 } },
        "minecraft:poisonous_potato": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 2 } },
        "minecraft:muttonraw": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 0 } },
        "minecraft:salmon": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 2, data: 0 } },
        "minecraft:potato": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 1, data: 0 } },
        "minecraft:beetroot": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 1, data: 0 } },
        "minecraft:tropical_fish": { can: ItemID.tinCanEmpty, result: { id: ItemID.tinCanFull, count: 1, data: 0 } },
    }, true);
});
var guiSolidCanner = MachineRegistry.createInventoryWindow("Solid Canning Machine", {
    drawing: [
        { type: "bitmap", x: 400 + 52 * GUI_SCALE, y: 50 + 33 * GUI_SCALE, bitmap: "solid_canner_arrow", scale: GUI_SCALE },
        { type: "bitmap", x: 400 + 86 * GUI_SCALE, y: 50 + 34 * GUI_SCALE, bitmap: "arrow_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 416, y: 178, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 400 + 86 * GUI_SCALE, y: 50 + 34 * GUI_SCALE, direction: 0, bitmap: "arrow_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_solidCanner");
                }
            } },
        "energyScale": { type: "scale", x: 416, y: 178, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 400 + 3 * GUI_SCALE, y: 50 + 58 * GUI_SCALE },
        "slotSource": { type: "slot", x: 400 + 32 * GUI_SCALE, y: 50 + 32 * GUI_SCALE },
        "slotCan": { type: "slot", x: 400 + 63 * GUI_SCALE, y: 50 + 32 * GUI_SCALE },
        "slotResult": { type: "slot", x: 400 + 111 * GUI_SCALE, y: 50 + 32 * GUI_SCALE },
        "slotUpgrade1": { type: "slot", x: 870, y: 50 + 4 * GUI_SCALE },
        "slotUpgrade2": { type: "slot", x: 870, y: 50 + 22 * GUI_SCALE },
        "slotUpgrade3": { type: "slot", x: 870, y: 50 + 40 * GUI_SCALE },
        "slotUpgrade4": { type: "slot", x: 870, y: 50 + 58 * GUI_SCALE },
    }
});
var Machine;
(function (Machine) {
    var SolidCanner = /** @class */ (function (_super) {
        __extends(SolidCanner, _super);
        function SolidCanner() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultEnergyStorage = 800;
            _this.defaultEnergyDemand = 1;
            _this.defaultProcessTime = 200;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];
            return _this;
        }
        SolidCanner.prototype.getScreenByName = function () {
            return guiSolidCanner;
        };
        SolidCanner.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
                if (name == "slotSource")
                    return !!_this.getRecipeResult(id);
                if (name == "slotEnergy")
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
                if (name == "slotCan") {
                    var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
                    for (var i in recipes) {
                        if (recipes[i].can == id)
                            return true;
                    }
                    return false;
                }
                if (name.startsWith("slotUpgrade"))
                    return UpgradeAPI.isValidUpgrade(id, _this);
                return false;
            });
        };
        SolidCanner.prototype.getRecipeResult = function (id) {
            return MachineRecipeRegistry.getRecipeResult("solidCanner", id);
        };
        SolidCanner.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var sourceSlot = this.container.getSlot("slotSource");
            var resultSlot = this.container.getSlot("slotResult");
            var canSlot = this.container.getSlot("slotCan");
            var newActive = false;
            var recipe = this.getRecipeResult(sourceSlot.id);
            if (recipe) {
                var result = recipe.result;
                if (canSlot.id == recipe.can && canSlot.count >= result.count && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
                    if (this.data.energy >= this.energyDemand) {
                        this.data.energy -= this.energyDemand;
                        this.data.progress += 1 / this.processTime;
                        newActive = true;
                    }
                    if (+this.data.progress.toFixed(3) >= 1) {
                        sourceSlot.setSlot(sourceSlot.id, sourceSlot.count - 1, 0);
                        canSlot.setSlot(canSlot.id, canSlot.count - result.count, 0);
                        resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data);
                        this.container.validateAll();
                        this.data.progress = 0;
                    }
                }
            }
            else {
                this.data.progress = 0;
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        return SolidCanner;
    }(Machine.ProcessingMachine));
    Machine.SolidCanner = SolidCanner;
    MachineRegistry.registerPrototype(BlockID.solidCanner, new SolidCanner());
    StorageInterface.createInterface(BlockID.solidCanner, {
        slots: {
            "slotSource": { input: true, isValid: function (item) {
                    return MachineRecipeRegistry.hasRecipeFor("solidCanner", item.id);
                } },
            "slotCan": { input: true, isValid: function (item) {
                    var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
                    for (var i in recipes) {
                        if (recipes[i].can == item.id)
                            return true;
                    }
                    return false;
                } },
            "slotResult": { output: true }
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("canner", [
    { name: "Fluid/Solid Canning Machine", texture: [["machine_bottom", 0], ["machine_bottom", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.canner, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.canner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 0], ["canner_side", 0], ["canner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.canner, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["canner_front", 1], ["canner_side", 1], ["canner_side", 0]]);
TileRenderer.setRotationFunction(BlockID.canner);
ItemName.addTierTooltip("canner", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.canner, count: 1, data: 0 }, [
        "c#c",
        "cxc",
    ], ['#', BlockID.solidCanner, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.cellEmpty, 0]);
    MachineRecipeRegistry.registerRecipesFor("fluidCanner", [
        { input: ["water", { id: ItemID.bioChaff, count: 1 }], output: "biomass" },
        { input: ["water", { id: ItemID.dustLapis, count: 1 }], output: "coolant" }
    ]);
});
var guiCanner = MachineRegistry.createInventoryWindow("Fluid/Solid Canning Machine", {
    drawing: [
        { type: "bitmap", x: 406, y: 50 + 58 * GUI_SCALE_NEW, bitmap: "energy_small_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 400 + 67 * GUI_SCALE_NEW, y: 50 + 18 * GUI_SCALE_NEW, bitmap: "extractor_bar_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 496, y: 50 + 38 * GUI_SCALE_NEW, bitmap: "liquid_bar", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 730, y: 50 + 38 * GUI_SCALE_NEW, bitmap: "liquid_bar", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "background": { type: "image", x: 400 + 51 * GUI_SCALE_NEW, y: 50 + 12 * GUI_SCALE_NEW, bitmap: "canner_background_0", scale: GUI_SCALE_NEW },
        "liquidInputScale": { type: "scale", x: 496 + 4 * GUI_SCALE_NEW, y: 50 + 42 * GUI_SCALE_NEW, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW },
        "liquidOutputScale": { type: "scale", x: 730 + 4 * GUI_SCALE_NEW, y: 50 + 42 * GUI_SCALE_NEW, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW },
        "progressScale": { type: "scale", x: 400 + 67 * GUI_SCALE_NEW, y: 50 + 18 * GUI_SCALE_NEW, direction: 0, bitmap: "extractor_bar_scale", scale: GUI_SCALE_NEW, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_canner");
                }
            } },
        "energyScale": { type: "scale", x: 406, y: 50 + 58 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW },
        "slotEnergy": { type: "slot", x: 400, y: 50 + 75 * GUI_SCALE_NEW, size: 54 },
        "slotSource": { type: "slot", x: 400 + 72 * GUI_SCALE_NEW, y: 50 + 39 * GUI_SCALE_NEW, size: 54, visual: false, bitmap: "canner_slot_source_0" },
        "slotCan": { type: "slot", x: 400 + 33 * GUI_SCALE_NEW, y: 50 + 12 * GUI_SCALE_NEW, size: 54 },
        "slotResult": { type: "slot", x: 400 + 111 * GUI_SCALE_NEW, y: 50 + 12 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade1": { type: "slot", x: 850, y: 113, size: 54 },
        "slotUpgrade2": { type: "slot", x: 850, y: 167, size: 54 },
        "slotUpgrade3": { type: "slot", x: 850, y: 221, size: 54 },
        "slotUpgrade4": { type: "slot", x: 850, y: 275, size: 54 },
        "buttonSwitch": { type: "button", x: 400 + 70 * GUI_SCALE_NEW, y: 50 + 60 * GUI_SCALE_NEW, bitmap: "canner_switch_button", scale: GUI_SCALE_NEW, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("switchTanks", {});
                }
            } },
        "buttonMode": { type: "button", x: 400 + 54 * GUI_SCALE_NEW, y: 50 + 75 * GUI_SCALE_NEW, bitmap: "canner_mode_0", scale: GUI_SCALE_NEW, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("switchMode", {});
                }
            } }
    }
});
var Machine;
(function (Machine) {
    var Canner = /** @class */ (function (_super) {
        __extends(Canner, _super);
        function Canner() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                progress: 0,
                mode: 0
            };
            _this.defaultEnergyStorage = 1600;
            _this.defaultEnergyDemand = 1;
            _this.defaultProcessTime = 200;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector", "fluidPulling"];
            return _this;
        }
        Canner.prototype.getScreenByName = function () {
            return guiCanner;
        };
        Canner.prototype.isValidSourceItem = function (id, data) {
            if (this.data.mode == 0 && MachineRecipeRegistry.hasRecipeFor("solidCanner", id)) {
                return true;
            }
            if (this.data.mode == 3) {
                var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
                for (var i in recipes) {
                    if (recipes[i].input[1].id == id)
                        return true;
                }
            }
            return false;
        };
        Canner.prototype.isValidCan = function (id, data) {
            switch (this.data.mode) {
                case 0: {
                    var recipes = MachineRecipeRegistry.requireRecipesFor("solidCanner");
                    for (var i in recipes) {
                        if (recipes[i].can == id)
                            return true;
                    }
                    return false;
                }
                case 1:
                case 3:
                    return !!LiquidItemRegistry.getEmptyItem(id, data);
                case 2:
                    return !!LiquidItemRegistry.getFullItem(id, data, "water");
            }
        };
        Canner.prototype.setupContainer = function () {
            var _this = this;
            this.inputTank = this.addLiquidTank("inputTank", 8000);
            this.outputTank = this.addLiquidTank("outputTank", 8000);
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
                if (name == "slotSource")
                    return _this.isValidSourceItem(id, data);
                if (name == "slotCan")
                    return _this.isValidCan(id, data);
                if (name == "slotEnergy")
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
                if (name.startsWith("slotUpgrade"))
                    return UpgradeAPI.isValidUpgrade(id, _this);
                return false;
            });
        };
        Canner.prototype.onTick = function () {
            this.container.sendEvent("updateUI", { mode: this.data.mode });
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var sourceSlot = this.container.getSlot("slotSource");
            var resultSlot = this.container.getSlot("slotResult");
            var canSlot = this.container.getSlot("slotCan");
            var newActive = false;
            switch (this.data.mode) {
                case 0:
                    var recipe = MachineRecipeRegistry.getRecipeResult("solidCanner", sourceSlot.id);
                    if (recipe) {
                        var result = recipe.result;
                        if (canSlot.id == recipe.can && canSlot.count >= result.count && (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
                            if (this.data.energy >= this.energyDemand) {
                                this.data.energy -= this.energyDemand;
                                this.data.progress += 1 / this.processTime;
                                newActive = true;
                            }
                            if (+this.data.progress.toFixed(3) >= 1) {
                                this.decreaseSlot(sourceSlot, 1);
                                this.decreaseSlot(canSlot, result.count);
                                resultSlot.setSlot(result.id, resultSlot.count + result.count, result.data);
                                this.data.progress = 0;
                            }
                        }
                    }
                    else {
                        this.data.progress = 0;
                    }
                    break;
                case 1:
                    var liquid = this.outputTank.getLiquidStored();
                    var empty = LiquidItemRegistry.getEmptyItem(canSlot.id, canSlot.data);
                    if (empty && (!liquid || empty.liquid == liquid) && !this.outputTank.isFull()) {
                        if (this.data.energy >= this.energyDemand && (resultSlot.id == empty.id && resultSlot.data == empty.data && resultSlot.count < Item.getMaxStack(empty.id) || resultSlot.id == 0)) {
                            this.data.energy -= this.energyDemand;
                            this.data.progress += 1 / this.processTime;
                            newActive = true;
                        }
                        if (+this.data.progress.toFixed(3) >= 1) {
                            this.outputTank.getLiquidFromItem(canSlot, resultSlot);
                            this.data.progress = 0;
                        }
                    }
                    else {
                        this.data.progress = 0;
                    }
                    break;
                case 2:
                    var resetProgress = true;
                    liquid = this.inputTank.getLiquidStored();
                    if (liquid) {
                        var full = LiquidItemRegistry.getFullItem(canSlot.id, canSlot.data, liquid);
                        if (full) {
                            resetProgress = false;
                            if (this.data.energy >= this.energyDemand && (resultSlot.id == full.id && resultSlot.data == full.data && resultSlot.count < Item.getMaxStack(full.id) || resultSlot.id == 0)) {
                                this.data.energy -= this.energyDemand;
                                this.data.progress += 1 / this.processTime;
                                newActive = true;
                            }
                            if (+this.data.progress.toFixed(3) >= 1) {
                                this.inputTank.addLiquidToItem(canSlot, resultSlot);
                                this.data.progress = 0;
                            }
                        }
                    }
                    if (resetProgress) {
                        this.data.progress = 0;
                    }
                    break;
                case 3:
                    var recipes = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
                    resetProgress = true;
                    for (var i in recipes) {
                        var recipe_1 = recipes[i];
                        var liquid_1 = recipe_1.input[0];
                        var source = recipe_1.input[1];
                        if (this.inputTank.getAmount(liquid_1) >= 1000 && sourceSlot.id == source.id && sourceSlot.count >= source.count) {
                            resetProgress = false;
                            var outputLiquid = this.outputTank.getLiquidStored();
                            if ((!outputLiquid || recipe_1.output == outputLiquid && this.outputTank.getAmount() <= 7000) && this.data.energy >= this.energyDemand) {
                                this.data.energy -= this.energyDemand;
                                this.data.progress += 1 / this.processTime;
                                newActive = true;
                            }
                            if (+this.data.progress.toFixed(3) >= 1) {
                                this.inputTank.getLiquid(1000);
                                this.decreaseSlot(sourceSlot, source.count);
                                this.outputTank.addLiquid(recipe_1.output, 1000);
                                this.data.progress = 0;
                            }
                            break;
                        }
                    }
                    if (resetProgress) {
                        this.data.progress = 0;
                    }
                    break;
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            this.inputTank.updateUiScale("liquidInputScale");
            this.outputTank.updateUiScale("liquidOutputScale");
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        Canner.prototype.switchMode = function () {
            if (this.data.progress == 0) {
                this.data.mode = (this.data.mode + 1) % 4;
                this.container.sendEvent("updateUI", { mode: this.data.mode });
            }
        };
        Canner.prototype.switchTanks = function () {
            if (this.data.progress == 0) {
                var liquidData = this.inputTank.data;
                this.inputTank.data = this.outputTank.data;
                this.outputTank.data = liquidData;
            }
        };
        Canner.prototype.updateUI = function (container, window, content, data) {
            if (content) {
                var element = content.elements["slotSource"];
                var texture = "canner_slot_source_" + data.mode;
                if (element.bitmap != texture) {
                    content.elements["buttonMode"].bitmap = "canner_mode_" + data.mode;
                    content.elements["background"].bitmap = "canner_background_" + data.mode;
                    element.bitmap = texture;
                    element.visual = data.mode % 3 > 0;
                }
            }
        };
        Canner.prototype.canRotate = function (side) {
            return side > 1;
        };
        __decorate([
            Machine.ContainerEvent(Side.Server)
        ], Canner.prototype, "switchMode", null);
        __decorate([
            Machine.ContainerEvent(Side.Server)
        ], Canner.prototype, "switchTanks", null);
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], Canner.prototype, "updateUI", null);
        return Canner;
    }(Machine.ProcessingMachine));
    Machine.Canner = Canner;
    MachineRegistry.registerPrototype(BlockID.canner, new Canner());
    MachineRegistry.createStorageInterface(BlockID.canner, {
        slots: {
            "slotSource": { input: true,
                isValid: function (item, side, tileEntity) {
                    return tileEntity.isValidSourceItem(item.id, item.data);
                }
            },
            "slotCan": { input: true,
                isValid: function (item, side, tileEntity) {
                    return tileEntity.isValidCan(item.id, item.data);
                }
            },
            "slotResult": { output: true }
        },
        canReceiveLiquid: function () { return true; },
        getInputTank: function () {
            return this.tileEntity.inputTank;
        },
        getOutputTank: function () {
            return this.tileEntity.outputTank;
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("recycler", [
    { name: "Recycler", texture: [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.recycler, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.recycler, 2, [["machine_bottom", 0], ["macerator_top", 0], ["machine_side", 0], ["recycler_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.recycler, 2, [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["recycler_front", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.recycler);
ItemName.addTierTooltip("recycler", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.recycler, count: 1, data: 0 }, [
        " a ",
        "x#x",
        "bxb"
    ], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', ItemID.ingotSteel, 0]);
});
var recyclerBlacklist = [102, 280, 78, 80, 332];
var guiRecycler = MachineRegistry.createInventoryWindow("Recycler", {
    drawing: [
        { type: "bitmap", x: 530, y: 155, bitmap: "recycler_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 155, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotEnergy": { type: "slot", x: 441, y: 218 },
        "slotResult": { type: "slot", x: 625, y: 148 },
        "slotUpgrade1": { type: "slot", x: 820, y: 60 },
        "slotUpgrade2": { type: "slot", x: 820, y: 119 },
        "slotUpgrade3": { type: "slot", x: 820, y: 178 },
        "slotUpgrade4": { type: "slot", x: 820, y: 237 },
    }
});
var Machine;
(function (Machine) {
    var Recycler = /** @class */ (function (_super) {
        __extends(Recycler, _super);
        function Recycler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultEnergyStorage = 800;
            _this.defaultEnergyDemand = 1;
            _this.defaultProcessTime = 45;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];
            return _this;
        }
        Recycler.prototype.getScreenByName = function () {
            return guiRecycler;
        };
        Recycler.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", function (name, id) {
                return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
            });
            this.container.setSlotAddTransferPolicy("slotResult", function () { return 0; });
        };
        Recycler.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var newActive = false;
            var sourceSlot = this.container.getSlot("slotSource");
            var resultSlot = this.container.getSlot("slotResult");
            if (sourceSlot.id != 0 && (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0)) {
                if (this.data.energy >= this.energyDemand) {
                    this.data.energy -= this.energyDemand;
                    this.data.progress += 1 / this.processTime;
                    newActive = true;
                }
                if (+this.data.progress.toFixed(3) >= 1) {
                    this.decreaseSlot(sourceSlot, 1);
                    if (Math.random() < 0.125 && recyclerBlacklist.indexOf(sourceSlot.id) == -1) {
                        resultSlot.setSlot(ItemID.scrap, resultSlot.count + 1, 0);
                    }
                    this.data.progress = 0;
                }
            }
            else {
                this.data.progress = 0;
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        Recycler.prototype.getOperationSound = function () {
            return "RecyclerOp.ogg";
        };
        Recycler.prototype.getInterruptSound = function () {
            return "InterruptOne.ogg";
        };
        return Recycler;
    }(Machine.ProcessingMachine));
    Machine.Recycler = Recycler;
    MachineRegistry.registerPrototype(BlockID.recycler, new Recycler());
    StorageInterface.createInterface(BlockID.recycler, {
        slots: {
            "slotSource": { input: true },
            "slotResult": { output: true }
        }
    });
})(Machine || (Machine = {}));
/// <reference path="ProcessingMachine.ts" />
BlockRegistry.createBlock("metalFormer", [
    { name: "Metal Former", texture: [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.metalFormer, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.metalFormer, 2, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.metalFormer, 2, [["machine_bottom", 0], ["metal_former_top", 1], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.metalFormer);
ItemName.addTierTooltip("metalFormer", 1);
Callback.addCallback("PreLoaded", function () {
    function isToolboxEmpty(slot) {
        var container = BackpackRegistry.containers["d" + slot.data];
        if (container) {
            for (var i = 1; i <= 10; i++) {
                if (container.getSlot("slot" + i).id != 0) {
                    return false;
                }
            }
        }
        return true;
    }
    Recipes.addShaped({ id: BlockID.metalFormer, count: 1, data: 0 }, [
        " x ",
        "b#b",
        "ccc"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, -1, 'c', ItemID.coil, 0], function (api, field, result) {
        if (isToolboxEmpty(field[3]) && isToolboxEmpty(field[5])) {
            for (var i = 0; i < field.length; i++) {
                api.decreaseFieldSlot(i);
            }
        }
        else {
            result.id = result.count = 0;
        }
    });
    // rolling
    MachineRecipeRegistry.registerRecipesFor("metalFormer0", {
        // ingots
        "minecraft:iron_ingot": { id: ItemID.plateIron, count: 1 },
        "minecraft:gold_ingot": { id: ItemID.plateGold, count: 1 },
        "ItemID.ingotCopper": { id: ItemID.plateCopper, count: 1 },
        "ItemID.ingotTin": { id: ItemID.plateTin, count: 1 },
        "ItemID.ingotBronze": { id: ItemID.plateBronze, count: 1 },
        "ItemID.ingotSteel": { id: ItemID.plateSteel, count: 1 },
        "ItemID.ingotLead": { id: ItemID.plateLead, count: 1 },
        // plates
        "ItemID.plateIron": { id: ItemID.casingIron, count: 2 },
        "ItemID.plateGold": { id: ItemID.casingGold, count: 2 },
        "ItemID.plateTin": { id: ItemID.casingTin, count: 2 },
        "ItemID.plateCopper": { id: ItemID.casingCopper, count: 2 },
        "ItemID.plateBronze": { id: ItemID.casingBronze, count: 2 },
        "ItemID.plateSteel": { id: ItemID.casingSteel, count: 2 },
        "ItemID.plateLead": { id: ItemID.casingLead, count: 2 }
    }, true);
    // cutting
    MachineRecipeRegistry.registerRecipesFor("metalFormer1", {
        "ItemID.plateTin": { id: ItemID.cableTin0, count: 3 },
        "ItemID.plateCopper": { id: ItemID.cableCopper0, count: 3 },
        "ItemID.plateGold": { id: ItemID.cableGold0, count: 4 },
        "ItemID.plateIron": { id: ItemID.cableIron0, count: 4 },
    }, true);
    // extruding
    MachineRecipeRegistry.registerRecipesFor("metalFormer2", {
        "ItemID.ingotTin": { id: ItemID.cableTin0, count: 3 },
        "ItemID.ingotCopper": { id: ItemID.cableCopper0, count: 3 },
        "minecraft:iron_ingot": { id: ItemID.cableIron0, count: 4 },
        "minecraft:gold_ingot": { id: ItemID.cableGold0, count: 4 },
        "ItemID.casingTin": { id: ItemID.tinCanEmpty, count: 1 },
        "ItemID.plateIron": { id: ItemID.fuelRod, count: 1 },
    }, true);
});
var guiMetalFormer = MachineRegistry.createInventoryWindow("Metal Former", {
    drawing: [
        { type: "bitmap", x: 530, y: 164, bitmap: "metalformer_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE },
    ],
    elements: {
        "progressScale": { type: "scale", x: 530, y: 164, direction: 0, bitmap: "metalformer_bar_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_metalFormer");
                }
            } },
        "energyScale": { type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotSource": { type: "slot", x: 441, y: 79 },
        "slotEnergy": { type: "slot", x: 441, y: 218 },
        "slotResult": { type: "slot", x: 717, y: 148 },
        "slotUpgrade1": { type: "slot", x: 870, y: 60 },
        "slotUpgrade2": { type: "slot", x: 870, y: 119 },
        "slotUpgrade3": { type: "slot", x: 870, y: 178 },
        "slotUpgrade4": { type: "slot", x: 870, y: 237 },
        "button": { type: "button", x: 572, y: 210, bitmap: "metal_former_button_0", scale: GUI_SCALE, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("switchMode", {});
                }
            } }
    }
});
var Machine;
(function (Machine) {
    var MetalFormer = /** @class */ (function (_super) {
        __extends(MetalFormer, _super);
        function MetalFormer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                progress: 0,
                mode: 0
            };
            _this.defaultEnergyStorage = 4000;
            _this.defaultEnergyDemand = 10;
            _this.defaultProcessTime = 200;
            return _this;
        }
        MetalFormer.prototype.getScreenByName = function () {
            return guiMetalFormer;
        };
        MetalFormer.prototype.getRecipeResult = function (id) {
            return MachineRecipeRegistry.getRecipeResult("metalFormer" + this.data.mode, id);
        };
        MetalFormer.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var newActive = false;
            var sourceSlot = this.container.getSlot("slotSource");
            var resultSlot = this.container.getSlot("slotResult");
            var result = this.getRecipeResult(sourceSlot.id);
            if (result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
                if (this.data.energy >= this.energyDemand) {
                    this.data.energy -= this.energyDemand;
                    this.data.progress += 1 / this.processTime;
                    newActive = true;
                }
                if (+this.data.progress.toFixed(3) >= 1) {
                    this.decreaseSlot(sourceSlot, 1);
                    resultSlot.setSlot(result.id, resultSlot.count + result.count, 0);
                    this.data.progress = 0;
                }
            }
            else {
                this.data.progress = 0;
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendEvent("setModeIcon", { mode: this.data.mode });
            this.container.sendChanges();
        };
        MetalFormer.prototype.switchMode = function () {
            this.data.mode = (this.data.mode + 1) % 3;
        };
        MetalFormer.prototype.setModeIcon = function (container, window, content, data) {
            if (content) {
                content.elements.button.bitmap = "metal_former_button_" + data.mode;
            }
        };
        __decorate([
            Machine.ContainerEvent(Side.Server)
        ], MetalFormer.prototype, "switchMode", null);
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], MetalFormer.prototype, "setModeIcon", null);
        return MetalFormer;
    }(Machine.ProcessingMachine));
    Machine.MetalFormer = MetalFormer;
    MachineRegistry.registerPrototype(BlockID.metalFormer, new MetalFormer());
    StorageInterface.createInterface(BlockID.metalFormer, {
        slots: {
            "slotSource": { input: true },
            "slotResult": { output: true }
        },
        isValidInput: function (item) {
            return MachineRecipeRegistry.hasRecipeFor("metalFormer0", item.id) ||
                MachineRecipeRegistry.hasRecipeFor("metalFormer1", item.id) ||
                MachineRecipeRegistry.hasRecipeFor("metalFormer2", item.id);
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("oreWasher", [
    { name: "Ore Washing Plant", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.oreWasher, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 0], ["ore_washer_side", 0], ["ore_washer_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.oreWasher, 2, [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["ore_washer_front", 1], ["ore_washer_side", 1], ["ore_washer_side", 1]]);
TileRenderer.setRotationFunction(BlockID.oreWasher);
ItemName.addTierTooltip("oreWasher", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.oreWasher, count: 1, data: 0 }, [
        "aaa",
        "b#b",
        "xcx"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 325, 0, 'c', ItemID.circuitBasic, 0]);
    MachineRecipeRegistry.registerRecipesFor("oreWasher", {
        "ItemID.crushedCopper": [ItemID.crushedPurifiedCopper, 1, ItemID.dustSmallCopper, 2, ItemID.dustStone, 1],
        "ItemID.crushedTin": [ItemID.crushedPurifiedTin, 1, ItemID.dustSmallTin, 2, ItemID.dustStone, 1],
        "ItemID.crushedIron": [ItemID.crushedPurifiedIron, 1, ItemID.dustSmallIron, 2, ItemID.dustStone, 1],
        "ItemID.crushedGold": [ItemID.crushedPurifiedGold, 1, ItemID.dustSmallGold, 2, ItemID.dustStone, 1],
        "ItemID.crushedSilver": [ItemID.crushedPurifiedSilver, 1, ItemID.dustSmallSilver, 2, ItemID.dustStone, 1],
        "ItemID.crushedLead": [ItemID.crushedPurifiedLead, 1, ItemID.dustSmallSulfur, 3, ItemID.dustStone, 1],
        "ItemID.crushedUranium": [ItemID.crushedPurifiedUranium, 1, ItemID.dustSmallLead, 2, ItemID.dustStone, 1],
        "minecraft:gravel": [318, 1, ItemID.dustStone, 1]
    }, true);
});
var guiOreWasher = MachineRegistry.createInventoryWindow("Ore Washing Plant", {
    drawing: [
        { type: "bitmap", x: 400, y: 50, bitmap: "ore_washer_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 415, y: 170, bitmap: "energy_small_background", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "progressScale": { type: "scale", x: 400 + 98 * GUI_SCALE_NEW, y: 50 + 35 * GUI_SCALE_NEW, direction: 0, bitmap: "ore_washer_bar_scale", scale: GUI_SCALE_NEW, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_oreWasher");
                }
            } },
        "energyScale": { type: "scale", x: 415, y: 170, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW },
        "liquidScale": { type: "scale", x: 400 + 60 * GUI_SCALE_NEW, y: 50 + 21 * GUI_SCALE_NEW, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE_NEW },
        "slotEnergy": { type: "slot", x: 400 + 3 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54 },
        "slotLiquid1": { type: "slot", x: 400 + 33 * GUI_SCALE_NEW, y: 50 + 13 * GUI_SCALE_NEW, size: 54 },
        "slotLiquid2": { type: "slot", x: 400 + 33 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54 },
        "slotSource": { type: "slot", x: 400 + 99 * GUI_SCALE_NEW, y: 50 + 13 * GUI_SCALE_NEW, size: 54 },
        "slotResult1": { type: "slot", x: 400 + 81 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54 },
        "slotResult2": { type: "slot", x: 400 + 99 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54 },
        "slotResult3": { type: "slot", x: 400 + 117 * GUI_SCALE_NEW, y: 50 + 58 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade1": { type: "slot", x: 860, y: 50 + 3 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade2": { type: "slot", x: 860, y: 50 + 21 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade3": { type: "slot", x: 860, y: 50 + 39 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade4": { type: "slot", x: 860, y: 50 + 57 * GUI_SCALE_NEW, size: 54 },
    }
});
var Machine;
(function (Machine) {
    var OreWasher = /** @class */ (function (_super) {
        __extends(OreWasher, _super);
        function OreWasher() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultEnergyStorage = 10000;
            _this.defaultEnergyDemand = 16;
            _this.defaultProcessTime = 500;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidPulling"];
            return _this;
        }
        OreWasher.prototype.getScreenByName = function () {
            return guiOreWasher;
        };
        OreWasher.prototype.setupContainer = function () {
            var _this = this;
            this.liquidTank = this.addLiquidTank("fluid", 8000, ["water"]);
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
                if (name == "slotSource")
                    return !!_this.getRecipeResult(id);
                if (name == "slotEnergy")
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
                if (name == "slotLiquid1")
                    return LiquidItemRegistry.getItemLiquid(id, data) == "water";
                if (name.startsWith("slotUpgrade"))
                    return UpgradeAPI.isValidUpgrade(id, _this);
                return false;
            });
        };
        OreWasher.prototype.checkResult = function (result) {
            for (var i = 1; i < 4; i++) {
                var id = result[(i - 1) * 2];
                if (!id)
                    return true;
                var count = result[(i - 1) * 2 + 1];
                var resultSlot = this.container.getSlot("slotResult" + i);
                if (resultSlot.id != 0 && (resultSlot.id != id || resultSlot.count + count > 64)) {
                    return false;
                }
            }
            return true;
        };
        OreWasher.prototype.putResult = function (result) {
            this.liquidTank.getLiquid(1000);
            for (var i = 1; i < 4; i++) {
                var id = result[(i - 1) * 2];
                if (!id)
                    break;
                var count = result[(i - 1) * 2 + 1];
                var resultSlot = this.container.getSlot("slotResult" + i);
                resultSlot.setSlot(id, resultSlot.count + count, 0);
            }
        };
        OreWasher.prototype.getRecipeResult = function (id) {
            return MachineRecipeRegistry.getRecipeResult("oreWasher", id);
        };
        OreWasher.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var slot1 = this.container.getSlot("slotLiquid1");
            var slot2 = this.container.getSlot("slotLiquid2");
            this.liquidTank.getLiquidFromItem(slot1, slot2);
            var newActive = false;
            var sourceSlot = this.container.getSlot("slotSource");
            var result = this.getRecipeResult(sourceSlot.id);
            if (result && this.checkResult(result) && this.liquidTank.getAmount("water") >= 1000) {
                if (this.data.energy >= this.energyDemand) {
                    this.data.energy -= this.energyDemand;
                    this.data.progress += 1 / this.processTime;
                    newActive = true;
                }
                if (+this.data.progress.toFixed(3) >= 1) {
                    this.decreaseSlot(sourceSlot, 1);
                    this.putResult(result);
                    this.data.progress = 0;
                }
            }
            else {
                this.data.progress = 0;
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            this.liquidTank.updateUiScale("liquidScale");
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        OreWasher.prototype.onItemUse = function (coords, item, player) {
            if (Entity.getSneaking(player)) {
                if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
                    this.preventClick();
                    return true;
                }
            }
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        return OreWasher;
    }(Machine.ProcessingMachine));
    Machine.OreWasher = OreWasher;
    MachineRegistry.registerPrototype(BlockID.oreWasher, new OreWasher());
    MachineRegistry.createStorageInterface(BlockID.oreWasher, {
        slots: {
            "slotSource": { input: true, isValid: function (item) {
                    return MachineRecipeRegistry.hasRecipeFor("oreWasher", item.id, item.data);
                } },
            "slotLiquid1": { input: true, isValid: function (item) {
                    return LiquidItemRegistry.getItemLiquid(item.id, item.data) == "water";
                } },
            "slotLiquid2": { output: true },
            "slotResult1": { output: true },
            "slotResult2": { output: true },
            "slotResult3": { output: true }
        },
        canTransportLiquid: function () { return false; }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("thermalCentrifuge", [
    { name: "Thermal Centrifuge", texture: [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_back", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.thermalCentrifuge, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.thermalCentrifuge, 2, [["machine_advanced", 0], ["thermal_centrifuge_top", 0], ["machine_side", 0], ["thermal_centrifuge_front", 0], ["thermal_centrifuge_side", 0], ["thermal_centrifuge_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.thermalCentrifuge, 2, [["machine_advanced", 0], ["thermal_centrifuge_top", 1], ["machine_side", 0], ["thermal_centrifuge_front", 1], ["thermal_centrifuge_side", 1], ["thermal_centrifuge_side", 1]]);
TileRenderer.setRotationFunction(BlockID.thermalCentrifuge);
ItemName.addTierTooltip("thermalCentrifuge", 2);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.thermalCentrifuge, count: 1, data: 0 }, [
        "cmc",
        "a#a",
        "axa"
    ], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.electricMotor, 0, 'a', 265, 0, 'm', ItemID.miningLaser, -1, 'c', ItemID.coil, 0]);
    MachineRecipeRegistry.registerRecipesFor("thermalCentrifuge", {
        //"minecraft:cobblestone": {result: [ItemID.dustStone, 1], heat: 100},
        "ItemID.crushedCopper": { result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1, ItemID.dustStone, 1], heat: 500 },
        "ItemID.crushedTin": { result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1, ItemID.dustStone, 1], heat: 1000 },
        "ItemID.crushedIron": { result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1, ItemID.dustStone, 1], heat: 1500 },
        "ItemID.crushedSilver": { result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1, ItemID.dustStone, 1], heat: 2000 },
        "ItemID.crushedGold": { result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1, ItemID.dustStone, 1], heat: 2000 },
        "ItemID.crushedLead": { result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1, ItemID.dustStone, 1], heat: 2000 },
        "ItemID.crushedUranium": { result: [ItemID.smallUranium235, 1, ItemID.uranium238, 4, ItemID.dustStone, 1], heat: 3000 },
        "ItemID.crushedPurifiedCopper": { result: [ItemID.dustSmallTin, 1, ItemID.dustCopper, 1], heat: 500 },
        "ItemID.crushedPurifiedTin": { result: [ItemID.dustSmallIron, 1, ItemID.dustTin, 1], heat: 1000 },
        "ItemID.crushedPurifiedIron": { result: [ItemID.dustSmallGold, 1, ItemID.dustIron, 1], heat: 1500 },
        "ItemID.crushedPurifiedSilver": { result: [ItemID.dustSmallLead, 1, ItemID.dustSilver, 1], heat: 2000 },
        "ItemID.crushedPurifiedGold": { result: [ItemID.dustSmallSilver, 1, ItemID.dustGold, 1], heat: 2000 },
        "ItemID.crushedPurifiedLead": { result: [ItemID.dustSmallSilver, 1, ItemID.dustLead, 1], heat: 2000 },
        "ItemID.crushedPurifiedUranium": { result: [ItemID.smallUranium235, 2, ItemID.uranium238, 5], heat: 3000 },
        "ItemID.slag": { result: [ItemID.dustSmallGold, 1, ItemID.dustCoal, 1], heat: 1500 },
        "ItemID.fuelRodDepletedUranium": { result: [ItemID.smallPlutonium, 1, ItemID.uranium238, 4, ItemID.dustIron, 1], heat: 4000 },
        "ItemID.fuelRodDepletedUranium2": { result: [ItemID.smallPlutonium, 2, ItemID.uranium238, 8, ItemID.dustIron, 3], heat: 4000 },
        "ItemID.fuelRodDepletedUranium4": { result: [ItemID.smallPlutonium, 4, ItemID.uranium238, 16, ItemID.dustIron, 6], heat: 4000 },
        "ItemID.fuelRodDepletedMOX": { result: [ItemID.smallPlutonium, 1, ItemID.plutonium, 3, ItemID.dustIron, 1], heat: 5000 },
        "ItemID.fuelRodDepletedMOX2": { result: [ItemID.smallPlutonium, 2, ItemID.plutonium, 6, ItemID.dustIron, 3], heat: 5000 },
        "ItemID.fuelRodDepletedMOX4": { result: [ItemID.smallPlutonium, 4, ItemID.plutonium, 12, ItemID.dustIron, 6], heat: 5000 },
        "ItemID.rtgPellet": { result: [ItemID.plutonium, 3, ItemID.dustIron, 54], heat: 5000 },
    }, true);
});
var guiCentrifuge = MachineRegistry.createInventoryWindow("Thermal Centrifuge", {
    drawing: [
        { type: "bitmap", x: 400 + 36 * GUI_SCALE_NEW, y: 50 + 15 * GUI_SCALE_NEW, bitmap: "thermal_centrifuge_background", scale: GUI_SCALE_NEW },
        { type: "bitmap", x: 400 + 8 * GUI_SCALE_NEW, y: 50 + 38 * GUI_SCALE_NEW, bitmap: "energy_small_background", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "progressScale": { type: "scale", x: 400 + 80 * GUI_SCALE_NEW, y: 50 + 22 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "thermal_centrifuge_scale", scale: GUI_SCALE_NEW, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_thermalCentrifuge");
                }
            } },
        "heatScale": { type: "scale", x: 400 + 64 * GUI_SCALE_NEW, y: 50 + 63 * GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW },
        "energyScale": { type: "scale", x: 400 + 8 * GUI_SCALE_NEW, y: 50 + 38 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE_NEW },
        "slotEnergy": { type: "slot", x: 400 + 6 * GUI_SCALE_NEW, y: 50 + 56 * GUI_SCALE_NEW, size: 54 },
        "slotSource": { type: "slot", x: 400 + 6 * GUI_SCALE_NEW, y: 50 + 16 * GUI_SCALE_NEW, size: 54 },
        "slotResult1": { type: "slot", x: 400 + 119 * GUI_SCALE_NEW, y: 50 + 13 * GUI_SCALE_NEW, size: 54 },
        "slotResult2": { type: "slot", x: 400 + 119 * GUI_SCALE_NEW, y: 50 + 31 * GUI_SCALE_NEW, size: 54 },
        "slotResult3": { type: "slot", x: 400 + 119 * GUI_SCALE_NEW, y: 50 + 49 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade1": { type: "slot", x: 860, y: 50 + 3 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade2": { type: "slot", x: 860, y: 50 + 21 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade3": { type: "slot", x: 860, y: 50 + 39 * GUI_SCALE_NEW, size: 54 },
        "slotUpgrade4": { type: "slot", x: 860, y: 50 + 57 * GUI_SCALE_NEW, size: 54 },
        "indicator": { type: "image", x: 400 + 88 * GUI_SCALE_NEW, y: 50 + 59 * GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW }
    }
});
var Machine;
(function (Machine) {
    var ThermalCentrifuge = /** @class */ (function (_super) {
        __extends(ThermalCentrifuge, _super);
        function ThermalCentrifuge() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                progress: 0,
                heat: 0,
                maxHeat: 5000
            };
            _this.defaultTier = 2;
            _this.defaultEnergyStorage = 30000;
            _this.defaultEnergyDemand = 48;
            _this.defaultProcessTime = 500;
            _this.defaultDrop = BlockID.machineBlockAdvanced;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"];
            _this.isHeating = false;
            return _this;
        }
        ThermalCentrifuge.prototype.getScreenByName = function () {
            return guiCentrifuge;
        };
        ThermalCentrifuge.prototype.useUpgrades = function () {
            var upgrades = _super.prototype.useUpgrades.call(this);
            this.isHeating = upgrades.getRedstoneInput(this.isPowered);
            return upgrades;
        };
        ThermalCentrifuge.prototype.getRecipeResult = function (id) {
            return MachineRecipeRegistry.getRecipeResult("thermalCentrifuge", id);
        };
        ThermalCentrifuge.prototype.checkResult = function (result) {
            for (var i = 1; i < 4; i++) {
                var id = result[(i - 1) * 2];
                var count = result[(i - 1) * 2 + 1];
                var resultSlot = this.container.getSlot("slotResult" + i);
                if ((resultSlot.id != id || resultSlot.count + count > 64) && resultSlot.id != 0) {
                    return false;
                }
            }
            return true;
        };
        ThermalCentrifuge.prototype.putResult = function (result) {
            for (var i = 1; i < 4; i++) {
                var id = result[(i - 1) * 2];
                var count = result[(i - 1) * 2 + 1];
                var resultSlot = this.container.getSlot("slotResult" + i);
                if (id) {
                    resultSlot.setSlot(id, resultSlot.count + count, 0);
                }
            }
        };
        ThermalCentrifuge.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            if (this.isHeating) {
                this.data.maxHeat = 5000;
            }
            var newActive = false;
            var sourceSlot = this.container.getSlot("slotSource");
            var recipe = this.getRecipeResult(sourceSlot.id);
            if (recipe && this.checkResult(recipe.result) && this.data.energy > 0) {
                this.data.maxHeat = recipe.heat;
                if (this.data.heat < recipe.heat) {
                    this.data.energy--;
                    this.data.heat++;
                }
                else if (this.data.energy >= this.energyDemand) {
                    this.data.energy -= this.energyDemand;
                    this.data.progress += 1 / this.processTime;
                    newActive = true;
                }
                if (+this.data.progress.toFixed(3) >= 1) {
                    this.decreaseSlot(sourceSlot, 1);
                    this.putResult(recipe.result);
                    this.data.progress = 0;
                }
            }
            else {
                this.data.maxHeat = 5000;
                this.data.progress = 0;
                if (this.isHeating && this.data.energy > 1) {
                    if (this.data.heat < 5000) {
                        this.data.heat++;
                    }
                    this.data.energy -= 2;
                }
                else if (this.data.heat > 0) {
                    this.data.heat--;
                }
            }
            this.setActive(newActive);
            this.dischargeSlot("slotEnergy");
            if (this.data.heat >= this.data.maxHeat) {
                this.container.sendEvent("setIndicator", "green");
            }
            else {
                this.container.sendEvent("setIndicator", "red");
            }
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        ThermalCentrifuge.prototype.onRedstoneUpdate = function (signal) {
            this.isPowered = signal > 0;
        };
        ThermalCentrifuge.prototype.setIndicator = function (container, window, content, data) {
            if (content) {
                content.elements["indicator"].bitmap = "indicator_" + data;
            }
        };
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], ThermalCentrifuge.prototype, "setIndicator", null);
        return ThermalCentrifuge;
    }(Machine.ProcessingMachine));
    Machine.ThermalCentrifuge = ThermalCentrifuge;
    MachineRegistry.registerPrototype(BlockID.thermalCentrifuge, new ThermalCentrifuge());
    StorageInterface.createInterface(BlockID.thermalCentrifuge, {
        slots: {
            "slotSource": { input: true },
            "slotResult1": { output: true },
            "slotResult2": { output: true },
            "slotResult3": { output: true }
        },
        isValidInput: function (item) {
            return MachineRecipeRegistry.hasRecipeFor("thermalCentrifuge", item.id);
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("blastFurnace", [
    { name: "Blast Furnace", texture: [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.blastFurnace, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 0], ["machine_back", 0], ["heat_pipe", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.blastFurnace, 0, [["machine_advanced", 0], ["ind_furnace_side", 1], ["machine_back", 0], ["heat_pipe", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.blastFurnace, true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.blastFurnace, count: 1, data: 0 }, [
        "aaa",
        "asa",
        "axa"
    ], ['s', BlockID.machineBlockBasic, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
    MachineRecipeRegistry.registerRecipesFor("blastFurnace", {
        "minecraft:iron_ore": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        "minecraft:iron_ingot": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        "ItemID.dustIron": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        "ItemID.crushedPurifiedIron": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 },
        "ItemID.crushedIron": { result: [ItemID.ingotSteel, 1, ItemID.slag, 1], duration: 6000 }
    }, true);
});
var guiBlastFurnace = MachineRegistry.createInventoryWindow("Blast Furnace", {
    drawing: [
        { type: "bitmap", x: 450, y: 50, bitmap: "blast_furnace_background", scale: GUI_SCALE_NEW }
    ],
    elements: {
        "progressScale": { type: "scale", x: 450 + 50 * GUI_SCALE_NEW, y: 50 + 27 * GUI_SCALE_NEW, direction: 1, value: 0.5, bitmap: "blast_furnace_scale", scale: GUI_SCALE_NEW, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_blastFurnace");
                }
            } },
        "heatScale": { type: "scale", x: 450 + 46 * GUI_SCALE_NEW, y: 50 + 63 * GUI_SCALE_NEW, direction: 0, value: 0.5, bitmap: "heat_scale", scale: GUI_SCALE_NEW },
        "slotSource": { type: "slot", x: 450 + 9 * GUI_SCALE_NEW, y: 50 + 25 * GUI_SCALE_NEW },
        "slotResult1": { type: "slot", x: 450 + 108 * GUI_SCALE_NEW, y: 50 + 48 * GUI_SCALE_NEW, size: 54 },
        "slotResult2": { type: "slot", x: 450 + 126 * GUI_SCALE_NEW, y: 50 + 48 * GUI_SCALE_NEW, size: 54 },
        "slotAir1": { type: "slot", x: 450, y: 50 + 48 * GUI_SCALE_NEW, bitmap: "slot_black", size: 54 },
        "slotAir2": { type: "slot", x: 450 + 18 * GUI_SCALE_NEW, y: 50 + 48 * GUI_SCALE_NEW, bitmap: "slot_black", size: 54 },
        "slotUpgrade1": { type: "slot", x: 450 + 126 * GUI_SCALE_NEW, y: 50, size: 54 },
        "slotUpgrade2": { type: "slot", x: 450 + 126 * GUI_SCALE_NEW, y: 50 + 18 * GUI_SCALE_NEW, size: 54 },
        "indicator": { type: "image", x: 450 + 71 * GUI_SCALE_NEW, y: 50 + 59 * GUI_SCALE_NEW, bitmap: "indicator_red", scale: GUI_SCALE_NEW }
    }
});
var Machine;
(function (Machine) {
    var BlastFurnace = /** @class */ (function (_super) {
        __extends(BlastFurnace, _super);
        function BlastFurnace() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                progress: 0,
                air: 0,
                sourceID: 0,
                heat: 0,
            };
            _this.defaultDrop = BlockID.machineBlockBasic;
            _this.upgrades = ["redstone", "itemEjector", "itemPulling"];
            _this.isHeating = false;
            return _this;
        }
        BlastFurnace.prototype.getScreenByName = function () {
            return guiBlastFurnace;
        };
        BlastFurnace.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, count, data) {
                if (name == "slotSource")
                    return !!_this.getRecipeResult(id);
                if (name == "slotAir1")
                    return id == ItemID.cellAir;
                if (name.startsWith("slotUpgrade"))
                    return UpgradeAPI.isValidUpgrade(id, _this);
                return false;
            });
        };
        BlastFurnace.prototype.canRotate = function () {
            return true;
        };
        BlastFurnace.prototype.getRecipeResult = function (id) {
            return MachineRecipeRegistry.getRecipeResult("blastFurnace", id);
        };
        BlastFurnace.prototype.checkResult = function (result) {
            for (var i = 1; i < 3; i++) {
                var id = result[(i - 1) * 2];
                if (!id)
                    break;
                var count = result[(i - 1) * 2 + 1];
                var resultSlot = this.container.getSlot("slotResult" + i);
                if (resultSlot.id != 0 && (resultSlot.id != id || resultSlot.count + count > 64)) {
                    return false;
                }
            }
            return true;
        };
        BlastFurnace.prototype.putResult = function (result) {
            for (var i = 1; i < 3; i++) {
                var id = result[(i - 1) * 2];
                if (!id)
                    break;
                var count = result[(i - 1) * 2 + 1];
                var resultSlot = this.container.getSlot("slotResult" + i);
                resultSlot.setSlot(id, resultSlot.count + count, 0);
            }
        };
        BlastFurnace.prototype.controlAir = function () {
            var slot1 = this.container.getSlot("slotAir1");
            var slot2 = this.container.getSlot("slotAir2");
            if (this.data.air == 0) {
                if (slot1.id == ItemID.cellAir && (slot2.id == 0 || slot2.id == ItemID.cellEmpty && slot2.count < 64)) {
                    slot1.setSlot(slot1.id, slot1.count - 1, 0);
                    slot1.validate();
                    slot2.setSlot(ItemID.cellEmpty, slot2.count + 1, 0);
                    this.data.air = 1000;
                }
            }
            if (this.data.air > 0) {
                this.data.air--;
                return true;
            }
            return false;
        };
        BlastFurnace.prototype.useUpgrades = function () {
            var upgrades = UpgradeAPI.useUpgrades(this);
            this.isHeating = upgrades.getRedstoneInput(this.isPowered);
        };
        BlastFurnace.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            var maxHeat = this.getMaxHeat();
            this.data.heat = Math.min(this.data.heat, maxHeat);
            this.container.setScale("heatScale", this.data.heat / maxHeat);
            if (this.data.heat >= maxHeat) {
                this.container.sendEvent("setIndicator", "green");
                var sourceSlot = this.container.getSlot("slotSource");
                var source = this.data.sourceID || sourceSlot.id;
                var recipe = this.getRecipeResult(source);
                if (recipe && this.checkResult(recipe.result)) {
                    if (this.controlAir()) {
                        this.container.sendEvent("showAirImage", { show: false });
                        this.data.progress++;
                        this.container.setScale("progressScale", this.data.progress / recipe.duration);
                        this.setActive(true);
                        if (!this.data.sourceID) {
                            this.data.sourceID = source;
                            this.decreaseSlot(sourceSlot, 1);
                        }
                        if (this.data.progress >= recipe.duration) {
                            this.putResult(recipe.result);
                            this.data.progress = 0;
                            this.data.sourceID = 0;
                        }
                    }
                    else {
                        this.container.sendEvent("showAirImage", { show: true });
                    }
                }
            }
            else {
                this.container.sendEvent("setIndicator", "red");
                this.setActive(false);
            }
            if (this.data.heat > 0)
                this.data.heat--;
            if (this.data.sourceID == 0) {
                this.container.setScale("progressScale", 0);
            }
            this.container.sendChanges();
        };
        BlastFurnace.prototype.getMaxHeat = function () {
            return 50000;
        };
        BlastFurnace.prototype.onRedstoneUpdate = function (signal) {
            this.isPowered = signal > 0;
        };
        BlastFurnace.prototype.canReceiveHeat = function (side) {
            return side == this.getFacing();
        };
        BlastFurnace.prototype.receiveHeat = function (amount) {
            var slot = this.container.getSlot("slotSource");
            if (this.data.isHeating || this.data.sourceID > 0 || this.getRecipeResult(slot.id)) {
                amount = Math.min(this.getMaxHeat() - this.data.heat, amount);
                this.data.heat += amount + 1;
                return amount;
            }
            return 0;
        };
        BlastFurnace.prototype.showAirImage = function (container, window, content, data) {
            if (content) {
                if (data.show && !content.elements["indicatorAir"])
                    content.elements["indicatorAir"] = { type: "image", x: 344 + 128 * GUI_SCALE_NEW, y: 53 + 20 * GUI_SCALE_NEW, bitmap: "no_air_image", scale: GUI_SCALE_NEW };
                else
                    content.elements["indicatorAir"] = null;
            }
        };
        BlastFurnace.prototype.setIndicator = function (container, window, content, data) {
            if (content) {
                content.elements["indicator"].bitmap = "indicator_" + data;
            }
        };
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], BlastFurnace.prototype, "showAirImage", null);
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], BlastFurnace.prototype, "setIndicator", null);
        return BlastFurnace;
    }(Machine.MachineBase));
    Machine.BlastFurnace = BlastFurnace;
    MachineRegistry.registerPrototype(BlockID.blastFurnace, new BlastFurnace());
    StorageInterface.createInterface(BlockID.blastFurnace, {
        slots: {
            "slotSource": { input: true, isValid: function (item) {
                    return MachineRecipeRegistry.hasRecipeFor("blastFurnace", item.id);
                } },
            "slotAir1": { input: true, isValid: function (item) { return item.id == ItemID.cellAir; } },
            "slotAir2": { output: true },
            "slotResult1": { output: true },
            "slotResult2": { output: true }
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("icFermenter", [
    { name: "Fermenter", texture: [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.icFermenter, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 0], ["heat_pipe", 0], ["ic_fermenter_side", 0], ["ic_fermenter_side", 0]], true);
TileRenderer.registerModelWithRotation(BlockID.icFermenter, 0, [["machine_bottom", 0], ["machine_top", 0], ["ic_fermenter_back", 1], ["heat_pipe", 1], ["ic_fermenter_side", 1], ["ic_fermenter_side", 1]], true);
TileRenderer.setRotationFunction(BlockID.icFermenter, true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.icFermenter, count: 1, data: 0 }, [
        "aaa",
        "ccc",
        "axa"
    ], ['c', ItemID.cellEmpty, 0, 'a', ItemID.casingIron, 0, 'x', ItemID.heatConductor, 0]);
});
var guiFermenter = MachineRegistry.createInventoryWindow("Fermenter", {
    drawing: [
        { type: "bitmap", x: 390, y: 80, bitmap: "fermenter_background", scale: GUI_SCALE },
        { type: "bitmap", x: 758, y: 95, bitmap: "liquid_bar", scale: GUI_SCALE }
    ],
    elements: {
        "progressScale": { type: "scale", x: 492, y: 150, direction: 0, value: .5, bitmap: "fermenter_progress_scale", scale: GUI_SCALE, clicker: {
                onClick: function () {
                    RV === null || RV === void 0 ? void 0 : RV.RecipeTypeRegistry.openRecipePage("icpe_fermenter");
                }
            } },
        "fertilizerScale": { type: "scale", x: 480, y: 301, direction: 0, value: .5, bitmap: "fertilizer_progress_scale", scale: GUI_SCALE },
        "biogasScale": { type: "scale", x: 771, y: 108, direction: 1, bitmap: "liquid_biogas", scale: GUI_SCALE },
        "biomassScale": { type: "scale", x: 483, y: 179, direction: 1, bitmap: "biomass_scale", scale: GUI_SCALE },
        "slotBiomass0": { type: "slot", x: 400, y: 162 },
        "slotBiomass1": { type: "slot", x: 400, y: 222 },
        "slotFertilizer": { type: "slot", x: 634, y: 282, bitmap: "slot_black" },
        "slotBiogas0": { type: "slot", x: 832, y: 155 },
        "slotBiogas1": { type: "slot", x: 832, y: 215 },
        "slotUpgrade1": { type: "slot", x: 765, y: 290 },
        "slotUpgrade2": { type: "slot", x: 825, y: 290 }
    }
});
var Machine;
(function (Machine) {
    var Fermenter = /** @class */ (function (_super) {
        __extends(Fermenter, _super);
        function Fermenter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                heat: 0,
                progress: 0,
                fertilizer: 0,
            };
            _this.upgrades = ["itemEjector", "itemPulling", "fluidEjector", "fluidPulling"];
            return _this;
        }
        Fermenter.prototype.getScreenByName = function () {
            return guiFermenter;
        };
        Fermenter.prototype.setupContainer = function () {
            var _this = this;
            this.inputTank = this.addLiquidTank("inputTank", 10000, ["biomass"]);
            this.outputTank = this.addLiquidTank("outputTank", 2000, ["biogas"]);
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, count, data) {
                if (name == "slotBiomass0")
                    return LiquidItemRegistry.getItemLiquid(id, data) == "biomass";
                if (name == "slotBiogas0")
                    return !!LiquidItemRegistry.getFullItem(id, data, "biogas");
                if (name.startsWith("slotUpgrade"))
                    return UpgradeAPI.isValidUpgrade(id, _this);
                return false;
            });
        };
        Fermenter.prototype.onTick = function () {
            UpgradeAPI.useUpgrades(this);
            StorageInterface.checkHoppers(this);
            this.setActive(this.data.heat > 0);
            if (this.data.heat > 0) {
                this.data.progress += this.data.heat;
                this.data.heat = 0;
                if (this.data.progress >= 4000) {
                    this.inputTank.getLiquid("biomass", 20);
                    this.outputTank.addLiquid("biogas", 400);
                    this.data.fertilizer++;
                    this.data.progress = 0;
                }
                var outputSlot = this.container.getSlot("slotFertilizer");
                if (this.data.fertilizer >= 25) {
                    this.data.fertilizer = 0;
                    outputSlot.setSlot(ItemID.fertilizer, outputSlot.count + 1, 0);
                }
            }
            var slot1 = this.container.getSlot("slotBiomass0");
            var slot2 = this.container.getSlot("slotBiomass1");
            this.inputTank.getLiquidFromItem(slot1, slot2);
            slot1 = this.container.getSlot("slotBiogas0");
            slot2 = this.container.getSlot("slotBiogas1");
            this.outputTank.addLiquidToItem(slot1, slot2);
            this.inputTank.updateUiScale("biomassScale");
            this.outputTank.updateUiScale("biogasScale");
            this.container.setScale("progressScale", this.data.progress / 4000);
            this.container.setScale("fertilizerScale", this.data.fertilizer / 25);
            this.container.sendChanges();
        };
        Fermenter.prototype.canReceiveHeat = function (side) {
            return side == this.getFacing();
        };
        Fermenter.prototype.receiveHeat = function (amount) {
            var outputSlot = this.container.getSlot("slotFertilizer");
            if (this.inputTank.getAmount("biomass") >= 20 && this.outputTank.getAmount("biogas") <= 1600 && outputSlot.count < 64) {
                this.data.heat = amount;
                return amount;
            }
            return 0;
        };
        Fermenter.prototype.canRotate = function () {
            return true;
        };
        Fermenter.prototype.onItemUse = function (coords, item, player) {
            if (Entity.getSneaking(player)) {
                if (MachineRegistry.fillTankOnClick(this.inputTank, item, player)) {
                    this.preventClick();
                    return true;
                }
            }
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        return Fermenter;
    }(Machine.MachineBase));
    Machine.Fermenter = Fermenter;
    MachineRegistry.registerPrototype(BlockID.icFermenter, new Fermenter());
    MachineRegistry.createStorageInterface(BlockID.icFermenter, {
        slots: {
            "slotBiomass0": { input: true },
            "slotBiomass1": { output: true },
            "slotBiogas0": { input: true },
            "slotBiogas1": { output: true },
            "slotFertilizer": { output: true }
        },
        getInputTank: function () {
            return this.tileEntity.inputTank;
        },
        getOutputTank: function () {
            return this.tileEntity.outputTank;
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("massFabricator", [
    { name: "Mass Fabricator", texture: [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandardModelWithRotation(BlockID.massFabricator, 2, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.massFabricator, 2, [["machine_advanced_bottom", 0], ["machine_advanced", 0], ["machine_advanced_side", 0], ["mass_fab_front", 1], ["machine_advanced_side", 0], ["machine_advanced_side", 0]]);
TileRenderer.setRotationFunction(BlockID.massFabricator);
ItemRegistry.setRarity(BlockID.massFabricator, EnumRarity.RARE);
ItemName.addTierTooltip("massFabricator", 4);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.massFabricator, count: 1, data: 0 }, [
        "xax",
        "b#b",
        "xax"
    ], ['b', BlockID.machineBlockAdvanced, 0, 'x', 348, 0, 'a', ItemID.circuitAdvanced, 0, '#', ItemID.storageLapotronCrystal, -1]);
});
var ENERGY_PER_MATTER = 1000000;
var guiMassFabricator = MachineRegistry.createInventoryWindow("Mass Fabricator", {
    drawing: [
        { type: "bitmap", x: 850, y: 190, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 850, y: 190, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "matterSlot": { type: "slot", x: 821, y: 75, size: 100 },
        "catalyserSlot": { type: "slot", x: 841, y: 252 },
        "textInfo1": { type: "text", x: 542, y: 142, width: 200, height: 30, text: "Progress:" },
        "textInfo2": { type: "text", x: 542, y: 177, width: 200, height: 30, text: "0%" },
        "textInfo3": { type: "text", x: 542, y: 212, width: 200, height: 30, text: " " },
        "textInfo4": { type: "text", x: 542, y: 239, width: 200, height: 30, text: " " },
    }
});
var Machine;
(function (Machine) {
    var MassFabricator = /** @class */ (function (_super) {
        __extends(MassFabricator, _super);
        function MassFabricator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                progress: 0,
                catalyser: 0,
                isEnabled: true
            };
            _this.defaultDrop = BlockID.machineBlockAdvanced;
            return _this;
        }
        MassFabricator.prototype.getTier = function () {
            return 4;
        };
        MassFabricator.prototype.getScreenByName = function () {
            return guiMassFabricator;
        };
        MassFabricator.prototype.setupContainer = function () {
            StorageInterface.setSlotValidatePolicy(this.container, "catalyserSlot", function (name, id) {
                return MachineRecipeRegistry.hasRecipeFor("catalyser", id);
            });
            this.container.setSlotAddTransferPolicy("matterSlot", function () { return 0; });
        };
        MassFabricator.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            if (this.data.isEnabled && this.data.energy > 0) {
                this.setActive(true);
                if (this.data.catalyser < Math.max(1000, this.data.energy)) {
                    var catalyserSlot = this.container.getSlot("catalyserSlot");
                    var catalyserData = MachineRecipeRegistry.getRecipeResult("catalyser", catalyserSlot.id);
                    if (catalyserData) {
                        this.data.catalyser += catalyserData.input;
                        this.decreaseSlot(catalyserSlot, 1);
                    }
                }
                if (this.data.catalyser > 0) {
                    this.container.setText("textInfo3", "Catalyser:");
                    this.container.setText("textInfo4", Math.floor(this.data.catalyser));
                    var transfer_1 = Math.min((ENERGY_PER_MATTER - this.data.progress) / 6, Math.min(this.data.catalyser, this.data.energy));
                    this.data.progress += transfer_1 * 6;
                    this.data.energy -= transfer_1;
                    this.data.catalyser -= transfer_1;
                    if (World.getThreadTime() % 40 == 0 && transfer_1 > 0) {
                        SoundManager.playSoundAtBlock(this, "MassFabScrapSolo.ogg", 1);
                    }
                }
                else {
                    this.container.setText("textInfo3", "");
                    this.container.setText("textInfo4", "");
                }
                var transfer = Math.min(ENERGY_PER_MATTER - this.data.progress, this.data.energy);
                this.data.progress += transfer;
                this.data.energy -= transfer;
            }
            else {
                this.setActive(false);
            }
            if (this.data.progress >= ENERGY_PER_MATTER) {
                var matterSlot = this.container.getSlot("matterSlot");
                if (matterSlot.id == ItemID.matter && matterSlot.count < 64 || matterSlot.id == 0) {
                    matterSlot.setSlot(ItemID.matter, matterSlot.count + 1, 0);
                    this.data.progress = 0;
                }
            }
            var relProgress = this.data.progress / ENERGY_PER_MATTER;
            this.container.setScale("energyScale", relProgress);
            this.container.setText("textInfo2", Math.floor(100 * relProgress) + "%");
            this.container.sendChanges();
        };
        MassFabricator.prototype.onRedstoneUpdate = function (signal) {
            this.data.isEnabled = (signal == 0);
        };
        MassFabricator.prototype.getOperationSound = function () {
            return "MassFabLoop.ogg";
        };
        MassFabricator.prototype.getEnergyStorage = function () {
            return ENERGY_PER_MATTER - this.data.progress;
        };
        MassFabricator.prototype.getExplosionPower = function () {
            return 15;
        };
        MassFabricator.prototype.canRotate = function (side) {
            return side > 1;
        };
        return MassFabricator;
    }(Machine.ElectricMachine));
    Machine.MassFabricator = MassFabricator;
    MachineRegistry.registerPrototype(BlockID.massFabricator, new MassFabricator());
    StorageInterface.createInterface(BlockID.massFabricator, {
        slots: {
            "catalyserSlot": { input: true },
            "matterSlot": { output: true }
        },
        isValidInput: function (item) {
            return MachineRecipeRegistry.hasRecipeFor("catalyser", item.id);
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("pump", [
    { name: "Pump", texture: [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.pump, "stone", 1);
TileRenderer.setStandardModelWithRotation(BlockID.pump, 2, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 0], ["pump_side", 0], ["pump_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.pump, 2, [["pump_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["pump_front", 1], ["pump_side", 1], ["pump_side", 1]]);
TileRenderer.setRotationFunction(BlockID.pump);
ItemName.addTierTooltip("pump", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.pump, count: 1, data: 0 }, [
        "cxc",
        "c#c",
        "bab"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'a', ItemID.treetap, 0, 'b', BlockID.miningPipe, 0, 'c', ItemID.cellEmpty, 0]);
});
var guiPump = MachineRegistry.createInventoryWindow("Pump", {
    drawing: [
        { type: "bitmap", x: 493, y: 149, bitmap: "extractor_bar_background", scale: GUI_SCALE },
        { type: "bitmap", x: 407, y: 127, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 602, y: 88, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 675, y: 152, bitmap: "pump_arrow", scale: GUI_SCALE },
    ],
    elements: {
        "progressScale": { type: "scale", x: 493, y: 149, direction: 0, bitmap: "extractor_bar_scale", scale: GUI_SCALE },
        "energyScale": { type: "scale", x: 407, y: 127, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "liquidScale": { type: "scale", x: 400 + 67 * GUI_SCALE, y: 50 + 16 * GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slotEnergy": { type: "slot", x: 400, y: 50 + 39 * GUI_SCALE },
        "slotLiquid1": { type: "slot", x: 400 + 91 * GUI_SCALE, y: 50 + 12 * GUI_SCALE },
        "slotLiquid2": { type: "slot", x: 400 + 125 * GUI_SCALE, y: 50 + 29 * GUI_SCALE },
        "slotUpgrade1": { type: "slot", x: 880, y: 50 + 2 * GUI_SCALE },
        "slotUpgrade2": { type: "slot", x: 880, y: 50 + 21 * GUI_SCALE },
        "slotUpgrade3": { type: "slot", x: 880, y: 50 + 40 * GUI_SCALE },
        "slotUpgrade4": { type: "slot", x: 880, y: 50 + 59 * GUI_SCALE },
    }
});
var Machine;
(function (Machine) {
    var Pump = /** @class */ (function (_super) {
        __extends(Pump, _super);
        function Pump() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                progress: 0,
                coords: null
            };
            _this.defaultTier = 1;
            _this.defaultEnergyStorage = 800;
            _this.defaultEnergyDemand = 1;
            _this.defaultProcessTime = 20;
            _this.defaultDrop = BlockID.machineBlockBasic;
            _this.upgrades = ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling", "fluidEjector"];
            return _this;
        }
        Pump.prototype.getScreenByName = function () {
            return guiPump;
        };
        Pump.prototype.getTier = function () {
            return this.tier;
        };
        Pump.prototype.getEnergyStorage = function () {
            return this.energyStorage;
        };
        Pump.prototype.setupContainer = function () {
            var _this = this;
            this.liquidTank = this.addLiquidTank("fluid", 8000);
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
                if (name == "slotLiquid1")
                    return !!LiquidItemRegistry.getFullItem(id, data, "water");
                if (name == "slotLiquid2")
                    return false;
                if (name == "slotEnergy")
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
                return UpgradeAPI.isValidUpgrade(id, _this);
            });
        };
        Pump.prototype.useUpgrades = function () {
            var upgrades = UpgradeAPI.useUpgrades(this);
            this.tier = upgrades.getTier(this.defaultTier);
            this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
            this.energyDemand = upgrades.getEnergyDemand(this.defaultEnergyDemand);
            this.processTime = upgrades.getProcessTime(this.defaultProcessTime);
        };
        Pump.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            this.extractLiquid();
            var slot1 = this.container.getSlot("slotLiquid1");
            var slot2 = this.container.getSlot("slotLiquid2");
            this.liquidTank.addLiquidToItem(slot1, slot2);
            this.dischargeSlot("slotEnergy");
            this.liquidTank.updateUiScale("liquidScale");
            this.container.setScale("progressScale", this.data.progress);
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        Pump.prototype.extractLiquid = function () {
            var newActive = false;
            var liquid = this.liquidTank.getLiquidStored();
            if (this.y > 0 && this.liquidTank.getAmount() <= 7000 && this.data.energy >= this.energyDemand) {
                if (this.data.progress == 0) {
                    this.data.coords = this.recursiveSearch(liquid, this.x, this.y - 1, this.z, {});
                }
                if (this.data.coords) {
                    newActive = true;
                    this.data.energy -= this.energyDemand;
                    this.data.progress += 1 / this.processTime;
                    if (+this.data.progress.toFixed(3) >= 1) {
                        var coords = this.data.coords;
                        var block = this.region.getBlock(coords);
                        liquid = this.getLiquidType(liquid, block);
                        if (liquid && block.data == 0) {
                            this.region.setBlock(coords, 0, 0);
                            this.liquidTank.addLiquid(liquid, 1000);
                        }
                        this.data.progress = 0;
                    }
                }
            }
            else {
                this.data.progress = 0;
            }
            this.setActive(newActive);
        };
        Pump.prototype.recursiveSearch = function (liquid, x, y, z, map) {
            var block = this.region.getBlock(x, y, z);
            var coordsKey = x + ':' + y + ':' + z;
            if (!map[coordsKey] && Math.abs(this.x - x) <= 64 && Math.abs(this.z - z) <= 64 && this.getLiquidType(liquid, block)) {
                if (block.data == 0)
                    return new Vector3(x, y, z);
                map[coordsKey] = true;
                return this.recursiveSearch(liquid, x, y + 1, z, map) ||
                    this.recursiveSearch(liquid, x + 1, y, z, map) ||
                    this.recursiveSearch(liquid, x - 1, y, z, map) ||
                    this.recursiveSearch(liquid, x, y, z + 1, map) ||
                    this.recursiveSearch(liquid, x, y, z - 1, map);
            }
            return null;
        };
        Pump.prototype.getLiquidType = function (liquid, block) {
            if ((!liquid || liquid == "water") && (block.id == 8 || block.id == 9)) {
                return "water";
            }
            if ((!liquid || liquid == "lava") && (block.id == 10 || block.id == 11)) {
                return "lava";
            }
            return null;
        };
        Pump.prototype.getOperationSound = function () {
            return "PumpOp.ogg";
        };
        Pump.prototype.canRotate = function (side) {
            return side > 1;
        };
        return Pump;
    }(Machine.ElectricMachine));
    Machine.Pump = Pump;
    MachineRegistry.registerPrototype(BlockID.pump, new Pump());
    MachineRegistry.createStorageInterface(BlockID.pump, {
        slots: {
            "slotLiquid1": { input: true },
            "slotLiquid2": { output: true }
        },
        isValidInput: function (item) { return (!!LiquidItemRegistry.getFullItem(item.id, item.data, "water")); },
        canReceiveLiquid: function () { return false; }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("fluidDistributor", [
    { name: "Fluid Distributor", texture: [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.fluidDistributor, "stone", 1);
TileRenderer.setHandAndUiModel(BlockID.fluidDistributor, 0, [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]]);
TileRenderer.setStandardModelWithRotation(BlockID.fluidDistributor, 0, [["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 1]], true);
TileRenderer.registerModelWithRotation(BlockID.fluidDistributor, 0, [["fluid_distributor", 0], ["fluid_distributor", 0], ["fluid_distributor", 0], ["fluid_distributor", 1], ["fluid_distributor", 0], ["fluid_distributor", 0]], true);
TileRenderer.setRotationFunction("fluidDistributor", true);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.fluidDistributor, count: 1, data: 0 }, [
        "a",
        "#",
        "c"
    ], ['#', BlockID.machineBlockBasic, 0, 'a', ItemID.upgradeFluidPulling, 0, 'c', ItemID.cellEmpty, 0]);
});
var guiFluidDistributor = MachineRegistry.createInventoryWindow("Fluid Distributor", {
    drawing: [
        { type: "bitmap", x: 400 + 3 * GUI_SCALE, y: 146, bitmap: "fluid_distributor_background", scale: GUI_SCALE }
    ],
    elements: {
        "liquidScale": { type: "scale", x: 480, y: 50 + 34 * GUI_SCALE, direction: 1, bitmap: "fluid_dustributor_bar", scale: GUI_SCALE },
        "slot1": { type: "slot", x: 400 + 3 * GUI_SCALE, y: 50 + 47 * GUI_SCALE },
        "slot2": { type: "slot", x: 400 + 3 * GUI_SCALE, y: 50 + 66 * GUI_SCALE },
        "button_switch": { type: "button", x: 400 + 112 * GUI_SCALE, y: 50 + 53 * GUI_SCALE, bitmap: "fluid_distributor_button", scale: GUI_SCALE, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("invertMode", {});
                }
            } },
        "text1": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 400 + 107 * GUI_SCALE, y: 50 + 42 * GUI_SCALE, width: 128, height: 48, text: Translation.translate("Mode:") },
        "text2": { type: "text", font: { size: 24, color: Color.parseColor("#57c4da") }, x: 400 + 92 * GUI_SCALE, y: 50 + 66 * GUI_SCALE, width: 256, height: 48, text: Translation.translate("Distribute") },
    }
});
var Machine;
(function (Machine) {
    var FluidDistributor = /** @class */ (function (_super) {
        __extends(FluidDistributor, _super);
        function FluidDistributor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                inverted: false
            };
            _this.defaultDrop = BlockID.machineBlockBasic;
            return _this;
        }
        FluidDistributor.prototype.getScreenByName = function () {
            return guiFluidDistributor;
        };
        FluidDistributor.prototype.canRotate = function () {
            return true;
        };
        FluidDistributor.prototype.onInit = function () {
            _super.prototype.onInit.call(this);
            this.setActive(this.data.inverted);
        };
        FluidDistributor.prototype.setupContainer = function () {
            this.liquidTank = this.addLiquidTank("fluid", 1000);
            StorageInterface.setSlotValidatePolicy(this.container, "slot1", function (name, id, amount, data) {
                return !!LiquidItemRegistry.getFullItem(id, data, "water");
            });
            this.container.setSlotAddTransferPolicy("slotLiquid2", function () { return 0; });
        };
        FluidDistributor.prototype.onTick = function () {
            if (this.data.inverted) {
                this.container.setText("text2", Translation.translate("Concentrate"));
            }
            else {
                this.container.setText("text2", Translation.translate("Distribute"));
            }
            var slot1 = this.container.getSlot("slot1");
            var slot2 = this.container.getSlot("slot2");
            this.liquidTank.addLiquidToItem(slot1, slot2);
            this.transportLiquid();
            this.liquidTank.updateUiScale("liquidScale");
            this.container.sendChanges();
        };
        FluidDistributor.prototype.transportLiquid = function () {
            var liquid = this.liquidTank.getLiquidStored();
            if (!liquid)
                return;
            var facing = this.getFacing();
            for (var side = 0; side < 6; side++) {
                if (this.data.inverted == (side != facing))
                    continue;
                var storage = StorageInterface.getNeighbourLiquidStorage(this.blockSource, this, side);
                if (storage) {
                    StorageInterface.transportLiquid(liquid, 0.25, this, storage, side);
                }
            }
        };
        FluidDistributor.prototype.invertMode = function () {
            this.data.inverted = !this.data.inverted;
            this.setActive(this.data.inverted);
        };
        __decorate([
            Machine.ContainerEvent(Side.Server)
        ], FluidDistributor.prototype, "invertMode", null);
        return FluidDistributor;
    }(Machine.MachineBase));
    Machine.FluidDistributor = FluidDistributor;
    MachineRegistry.registerPrototype(BlockID.fluidDistributor, new FluidDistributor());
    MachineRegistry.createStorageInterface(BlockID.fluidDistributor, {
        slots: {
            "slot1": { input: true },
            "slot2": { output: true }
        },
        isValidInput: function (item) {
            return !!LiquidItemRegistry.getFullItem(item.id, item.data, "water");
        },
        canReceiveLiquid: function (liquid, side) {
            var data = this.tileEntity.data;
            return (side == this.tileEntity.getFacing()) != data.inverted;
        }
    });
})(Machine || (Machine = {}));
BlockRegistry.createBlock("tank", [
    { name: "Tank", texture: [["machine_bottom", 0], ["machine_top", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0], ["tank_side", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.tank, "stone", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.tank, count: 1, data: 0 }, [
        " c ",
        "c#c",
        " c "
    ], ['#', BlockID.machineBlockBasic, 0, 'c', ItemID.cellEmpty, 0]);
});
var guiTank = MachineRegistry.createInventoryWindow("Tank", {
    drawing: [
        { type: "bitmap", x: 400 + 46 * GUI_SCALE, y: 50 + 12 * GUI_SCALE, bitmap: "liquid_bar", scale: GUI_SCALE },
        { type: "bitmap", x: 400 + 80 * GUI_SCALE, y: 159, bitmap: "liquid_bar_arrow", scale: GUI_SCALE }
    ],
    elements: {
        "liquidScale": { type: "scale", x: 400 + 50 * GUI_SCALE, y: 50 + 16 * GUI_SCALE, direction: 1, bitmap: "gui_water_scale", overlay: "gui_liquid_storage_overlay", scale: GUI_SCALE },
        "slotLiquid1": { type: "slot", x: 400 + 74 * GUI_SCALE, y: 95 },
        "slotLiquid2": { type: "slot", x: 400 + 74 * GUI_SCALE, y: 203 },
        "slotOutput": { type: "slot", x: 400 + 106 * GUI_SCALE, y: 149 },
        "slotUpgrade1": { type: "slot", x: 870, y: 50 + 4 * GUI_SCALE },
        "slotUpgrade2": { type: "slot", x: 870, y: 50 + 22 * GUI_SCALE },
        "slotUpgrade3": { type: "slot", x: 870, y: 50 + 40 * GUI_SCALE },
        "slotUpgrade4": { type: "slot", x: 870, y: 50 + 58 * GUI_SCALE },
    }
});
var Machine;
(function (Machine) {
    var FluidTank = /** @class */ (function (_super) {
        __extends(FluidTank, _super);
        function FluidTank() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.upgrades = ["fluidEjector", "fluidPulling"];
            return _this;
        }
        FluidTank.prototype.getScreenByName = function () {
            return guiTank;
        };
        FluidTank.prototype.setupContainer = function () {
            var _this = this;
            this.liquidTank = this.addLiquidTank("fluid", 16000);
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
                if (name == "slotLiquid1")
                    return !!LiquidItemRegistry.getEmptyItem(id, data);
                if (name == "slotLiquid2")
                    return !!LiquidRegistry.getFullItem(id, data, "water");
                if (name == "slotOutput")
                    return false;
                return UpgradeAPI.isValidUpgrade(id, _this);
            });
        };
        FluidTank.prototype.onItemUse = function (coords, item, player) {
            if (Entity.getSneaking(player)) {
                if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
                    this.preventClick();
                    return true;
                }
            }
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        FluidTank.prototype.onTick = function () {
            UpgradeAPI.useUpgrades(this);
            StorageInterface.checkHoppers(this);
            var slot1 = this.container.getSlot("slotLiquid1");
            var slot2 = this.container.getSlot("slotLiquid2");
            var slotOutput = this.container.getSlot("slotOutput");
            this.liquidTank.getLiquidFromItem(slot1, slotOutput);
            this.liquidTank.addLiquidToItem(slot2, slotOutput);
            this.liquidTank.updateUiScale("liquidScale");
            this.container.sendChanges();
        };
        return FluidTank;
    }(Machine.MachineBase));
    Machine.FluidTank = FluidTank;
    MachineRegistry.registerPrototype(BlockID.tank, new FluidTank());
})(Machine || (Machine = {}));
MachineRegistry.createStorageInterface(BlockID.tank, {
    slots: {
        "slotLiquid1": { input: true, isValid: function (item) {
                return !!LiquidItemRegistry.getEmptyItem(item.id, item.data);
            } },
        "slotLiquid2": { input: true, isValid: function (item) {
                return !!LiquidItemRegistry.getFullItem(item.id, item.data, "water");
            } },
        "slotOutput": { output: true }
    },
    canReceiveLiquid: function () { return true; }
});
BlockRegistry.createBlock("miner", [
    { name: "Miner", texture: [["miner_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandardModelWithRotation(BlockID.miner, 2, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.miner, 2, [["miner_bottom", 1], ["machine_top", 0], ["machine_side", 0], ["miner_front", 1], ["miner_side", 1], ["miner_side", 1]]);
TileRenderer.setRotationFunction(BlockID.miner);
ItemName.addTierTooltip("miner", 2);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.miner, count: 1, data: 0 }, [
        "x#x",
        " b ",
        " b "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', BlockID.miningPipe, 0]);
});
var guiMiner = MachineRegistry.createInventoryWindow("Miner", {
    drawing: [
        { type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: {
        "energyScale": { type: "scale", x: 550, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotDrill": { type: "slot", x: 441, y: 75, bitmap: "slot_drill" },
        "slotPipe": { type: "slot", x: 541, y: 75 },
        "slotScanner": { type: "slot", x: 641, y: 75, bitmap: "slot_scanner" },
        "slotEnergy": { type: "slot", x: 541, y: 212 },
    }
});
var Machine;
(function (Machine) {
    var Miner = /** @class */ (function (_super) {
        __extends(Miner, _super);
        function Miner() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                x: 0,
                y: 0,
                z: 0,
                scanY: 0,
                scanR: 0,
                progress: 0
            };
            _this.defaultDrop = BlockID.machineBlockBasic;
            return _this;
        }
        Miner.prototype.getScreenByName = function () {
            return guiMiner;
        };
        Miner.prototype.getTier = function () {
            return 2;
        };
        Miner.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setSlotValidatePolicy(this.container, "slotDrill", function (name, id) {
                return id == ItemID.drill || id == ItemID.diamondDrill;
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slotPipe", function (name, id) {
                return ItemRegistry.isBlock(id) && !TileEntity.isTileEntityBlock(id);
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slotScanner", function (name, id) {
                return id == ItemID.scanner || id == ItemID.scannerAdvanced;
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", function (name, id) {
                return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
            });
        };
        Miner.prototype.getMiningValues = function (tool) {
            if (tool == ItemID.drill)
                return { energy: 6, time: 100 };
            if (tool == ItemID.diamondDrill)
                return { energy: 20, time: 50 };
            return null;
        };
        Miner.prototype.findOre = function (level) {
            var r = this.data.scanR;
            while (r) {
                if (this.data.x > this.x + r) {
                    this.data.x = this.x - r;
                    this.data.z++;
                }
                if (this.data.z > this.z + r)
                    break;
                var blockID = this.region.getBlockId(this.data.x, this.data.scanY, this.data.z);
                if (ore_blocks.indexOf(blockID) != -1 && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
                    return true;
                }
                this.data.x++;
            }
            return false;
        };
        Miner.prototype.isEmptyBlock = function (block) {
            return block.id == 0 || block.id == 51 || block.id >= 8 && block.id <= 11 && block.data > 0;
        };
        Miner.prototype.canBeDestroyed = function (blockID, level) {
            if (ToolAPI.getBlockMaterialName(blockID) != "unbreaking" && level >= ToolAPI.getBlockDestroyLevel(blockID)) {
                return true;
            }
            return false;
        };
        Miner.prototype.findPath = function (x, y, z, sprc, level) {
            var block = this.region.getBlock(x, y, z);
            if (block.id == BlockID.miningPipe || this.isEmptyBlock(block)) {
                var dx = this.data.x - x;
                var dz = this.data.z - z;
                if (Math.abs(dx) == Math.abs(dz)) {
                    var prc = sprc;
                }
                else if (Math.abs(dx) > Math.abs(dz)) {
                    var prc = 0;
                }
                else {
                    var prc = 1;
                }
                if (prc == 0) {
                    if (dx > 0)
                        x++;
                    else
                        x--;
                }
                else {
                    if (dz > 0)
                        z++;
                    else
                        z--;
                }
                return this.findPath(x, y, z, sprc, level);
            }
            else if (this.canBeDestroyed(block.id, level)) {
                return new Vector3(x, y, z);
            }
            this.data.x++;
            return null;
        };
        Miner.prototype.mineBlock = function (x, y, z, block, item) {
            var result = this.region.breakBlockForResult(x, y, z, -1, new ItemStack(item));
            this.drop(result.items);
            this.data.progress = 0;
        };
        Miner.prototype.setPipe = function (y) {
            if (y < this.y)
                this.region.setBlock(this.x, y, this.z, BlockID.miningPipe, 0);
            this.region.setBlock(this.x, y - 1, this.z, BlockID.miningPipe, 1);
            this.decreaseSlot(this.container.getSlot("slotPipe"), 1);
            this.data.progress = 0;
        };
        Miner.prototype.drop = function (items) {
            var containers = StorageInterface.getNearestContainers(this, this.blockSource);
            StorageInterface.putItems(items, containers);
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item.count > 0) {
                    this.region.dropItem(this.x + .5, this.y + 1, this.z + .5, item);
                }
            }
        };
        Miner.prototype.onTick = function () {
            var region = this.region;
            if (this.data.progress == 0) {
                var y = this.y;
                while (region.getBlockId(this.x, y - 1, this.z) == BlockID.miningPipe) {
                    y--;
                }
                this.data.y = y;
            }
            var newActive = false;
            var drillSlot = this.container.getSlot("slotDrill");
            var pipeSlot = this.container.getSlot("slotPipe");
            var params = this.getMiningValues(drillSlot.id);
            if (params) {
                if (this.data.y < this.y && this.data.scanY != this.data.y) {
                    var radius = 0;
                    var scannerSlot = this.container.getSlot("slotScanner");
                    var energyStored = ChargeItemRegistry.getEnergyStored(scannerSlot);
                    if (scannerSlot.id == ItemID.scanner || scannerSlot.id == ItemID.scannerAdvanced) {
                        var tool = ItemRegistry.getInstanceOf(scannerSlot.id);
                        ChargeItemRegistry.setEnergyStored(scannerSlot, energyStored - tool.getEnergyPerUse());
                        radius = tool.getScanRadius();
                    }
                    this.data.x = this.x - radius;
                    this.data.z = this.z - radius;
                    this.data.scanY = this.data.y;
                    this.data.scanR = radius;
                }
                var level = ToolAPI.getToolLevel(drillSlot.id);
                if (this.data.y < this.y && this.findOre(level)) {
                    var dx = this.data.x - this.x;
                    var dz = this.data.z - this.z;
                    var prc = 0;
                    if (Math.abs(dx) > Math.abs(dz)) {
                        prc = 1;
                    }
                    var coords = this.findPath(this.x, this.data.y, this.z, prc, level);
                    if (coords) {
                        var block = region.getBlock(coords.x, coords.y, coords.z);
                        if (this.data.energy >= params.energy) {
                            this.data.energy -= params.energy;
                            this.data.progress++;
                            newActive = true;
                        }
                        if (this.data.progress >= params.time) {
                            level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block.id);
                            this.mineBlock(coords.x, coords.y, coords.z, block, drillSlot);
                        }
                    }
                }
                else if (this.data.y > 0 && pipeSlot.id == BlockID.miningPipe) {
                    var block = region.getBlock(this.x, this.data.y - 1, this.z);
                    if (this.isEmptyBlock(block)) {
                        if (this.data.energy >= 3) {
                            this.data.energy -= 3;
                            this.data.progress++;
                            newActive = true;
                        }
                        if (this.data.progress >= 20) {
                            this.setPipe(this.data.y);
                        }
                    }
                    else if (this.canBeDestroyed(block.id, level)) {
                        var block_1 = region.getBlock(this.x, this.data.y - 1, this.z);
                        if (this.data.energy >= params.energy) {
                            this.data.energy -= params.energy;
                            this.data.progress++;
                            newActive = true;
                        }
                        if (this.data.progress >= params.time) {
                            level = ToolAPI.getToolLevelViaBlock(drillSlot.id, block_1.id);
                            this.mineBlock(this.x, this.data.y - 1, this.z, block_1, drillSlot);
                            this.setPipe(this.data.y);
                        }
                    }
                }
            }
            else {
                if (region.getBlockId(this.x, this.data.y, this.z) == BlockID.miningPipe) {
                    if (this.data.energy >= 3) {
                        this.data.energy -= 3;
                        this.data.progress++;
                        newActive = true;
                    }
                    if (this.data.progress >= 20) {
                        this.drop([new ItemStack(BlockID.miningPipe, 1, 0)]);
                        var pipeSlot_1 = this.container.getSlot("slotPipe");
                        if (pipeSlot_1.id != 0 && pipeSlot_1.id != BlockID.miningPipe && ItemRegistry.isBlock(pipeSlot_1.id) && !TileEntity.isTileEntityBlock(pipeSlot_1.id)) {
                            var blockId = Block.convertItemToBlockId(pipeSlot_1.id);
                            region.setBlock(this.x, this.data.y, this.z, blockId, pipeSlot_1.data);
                            this.decreaseSlot(pipeSlot_1, 1);
                        }
                        else {
                            region.setBlock(this.x, this.data.y, this.z, 0, 0);
                        }
                        this.data.scanY = 0;
                        this.data.progress = 0;
                    }
                }
            }
            this.setActive(newActive);
            this.chargeSlot("slotDrill");
            this.chargeSlot("slotScanner");
            this.dischargeSlot("slotEnergy");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        Miner.prototype.getOperationSound = function () {
            return "MinerOp.ogg";
        };
        Miner.prototype.getEnergyStorage = function () {
            return 10000;
        };
        Miner.prototype.canRotate = function (side) {
            return side > 1;
        };
        return Miner;
    }(Machine.ElectricMachine));
    Machine.Miner = Miner;
    MachineRegistry.registerPrototype(BlockID.miner, new Miner());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("advancedMiner", [
    { name: "Advanced Miner", texture: [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandardModelWithRotation(BlockID.advancedMiner, 2, [["teleporter_top", 0], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 0], ["miner_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.advancedMiner, 2, [["teleporter_top", 1], ["machine_advanced_top", 0], ["machine_advanced_side", 0], ["machine_advanced_side", 0], ["miner_side", 1], ["miner_side", 1]]);
MachineRegistry.setStoragePlaceFunction("advancedMiner");
ItemRegistry.setRarity(BlockID.advancedMiner, EnumRarity.RARE);
ItemName.addStorageBlockTooltip("advancedMiner", 3, "4M");
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.advancedMiner, count: 1, data: 0 }, [
        "pmp",
        "e#a",
        "pmp"
    ], ['#', BlockID.machineBlockAdvanced, 0, 'a', BlockID.teleporter, 0, 'e', BlockID.storageMFE, -1, 'm', BlockID.miner, -1, 'p', ItemID.plateAlloy, 0]);
});
var guiAdvancedMiner = MachineRegistry.createInventoryWindow("Advanced Miner", {
    drawing: [
        { type: "bitmap", x: 400 + 2 * GUI_SCALE, y: 50 + 49 * GUI_SCALE, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 400 + 28 * GUI_SCALE, y: 50 + 21 * GUI_SCALE, bitmap: "miner_mode", scale: GUI_SCALE },
        { type: "bitmap", x: 400, y: 50 + 98 * GUI_SCALE, bitmap: "miner_info", scale: GUI_SCALE },
    ],
    elements: {
        "energyScale": { type: "scale", x: 400 + 2 * GUI_SCALE, y: 50 + 49 * GUI_SCALE, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_SCALE },
        "slotScanner": { type: "slot", x: 400, y: 50 + 19 * GUI_SCALE, bitmap: "slot_scanner" },
        "slotEnergy": { type: "slot", x: 400, y: 290 },
        "slot1": { type: "slot", x: 400 + 28 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot2": { type: "slot", x: 400 + 47 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot3": { type: "slot", x: 400 + 66 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot4": { type: "slot", x: 400 + 85 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot5": { type: "slot", x: 400 + 104 * GUI_SCALE, y: 50 + 37 * GUI_SCALE },
        "slot6": { type: "slot", x: 400 + 28 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot7": { type: "slot", x: 400 + 47 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot8": { type: "slot", x: 400 + 66 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot9": { type: "slot", x: 400 + 85 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot10": { type: "slot", x: 400 + 104 * GUI_SCALE, y: 50 + 56 * GUI_SCALE },
        "slot11": { type: "slot", x: 400 + 28 * GUI_SCALE, y: 290 },
        "slot12": { type: "slot", x: 400 + 47 * GUI_SCALE, y: 290 },
        "slot13": { type: "slot", x: 400 + 66 * GUI_SCALE, y: 290 },
        "slot14": { type: "slot", x: 400 + 85 * GUI_SCALE, y: 290 },
        "slot15": { type: "slot", x: 400 + 104 * GUI_SCALE, y: 290 },
        "slotUpgrade1": { type: "slot", x: 871, y: 50 + 37 * GUI_SCALE },
        "slotUpgrade2": { type: "slot", x: 871, y: 50 + 56 * GUI_SCALE },
        "button_switch": { type: "button", x: 400 + 116 * GUI_SCALE, y: 50 + 21 * GUI_SCALE, bitmap: "miner_button_switch", scale: GUI_SCALE, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("switchWhitelist", {});
                }
            } },
        "button_restart": { type: "button", x: 400 + 125 * GUI_SCALE, y: 50 + 98 * GUI_SCALE, bitmap: "miner_button_restart", scale: GUI_SCALE, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("restart", {});
                }
            } },
        "button_silk": { type: "button", x: 400 + 126 * GUI_SCALE, y: 50 + 41 * GUI_SCALE, bitmap: "miner_button_silk_0", scale: GUI_SCALE, clicker: {
                onClick: function (_, container) {
                    container.sendEvent("switchSilktouch", {});
                }
            } },
        "textInfoMode": { type: "text", font: { size: 24, color: Color.GREEN }, x: 400 + 32 * GUI_SCALE, y: 50 + 24 * GUI_SCALE, width: 256, height: 42, text: Translation.translate("Mode: Blacklist") },
        "textInfoXYZ": { type: "text", font: { size: 24, color: Color.GREEN }, x: 400 + 4 * GUI_SCALE, y: 50 + 101 * GUI_SCALE, width: 100, height: 42, text: "" },
    }
});
var Machine;
(function (Machine) {
    var AdvancedMiner = /** @class */ (function (_super) {
        __extends(AdvancedMiner, _super);
        function AdvancedMiner() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                x: 0,
                y: 0,
                z: 0,
                whitelist: false,
                silk_touch: false,
                isEnabled: true
            };
            _this.defaultTier = 3;
            _this.defaultDrop = BlockID.machineBlockAdvanced;
            _this.upgrades = ["overclocker", "transformer"];
            return _this;
        }
        AdvancedMiner.prototype.getScreenByName = function () {
            return guiAdvancedMiner;
        };
        AdvancedMiner.prototype.getTier = function () {
            return this.tier;
        };
        AdvancedMiner.prototype.getEnergyStorage = function () {
            return 4000000;
        };
        AdvancedMiner.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setSlotValidatePolicy(this.container, "slotScanner", function (name, id) {
                return id == ItemID.scanner || id == ItemID.scannerAdvanced;
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slotEnergy", function (name, id) {
                return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
            });
            StorageInterface.setSlotValidatePolicy(this.container, "slotUpgrade1", function (name, id) { return UpgradeAPI.isValidUpgrade(id, _this); });
            StorageInterface.setSlotValidatePolicy(this.container, "slotUpgrade2", function (name, id) { return UpgradeAPI.isValidUpgrade(id, _this); });
        };
        AdvancedMiner.prototype.getScanRadius = function (itemID) {
            if (itemID == ItemID.scanner)
                return 16;
            if (itemID == ItemID.scannerAdvanced)
                return 32;
            return 0;
        };
        AdvancedMiner.prototype.setUpgradeStats = function () {
            var upgrades = UpgradeAPI.useUpgrades(this);
            this.tier = upgrades.getTier(this.defaultTier);
            this.maxScanCount = 5 * upgrades.speedModifier;
        };
        AdvancedMiner.prototype.onTick = function () {
            this.setUpgradeStats();
            this.operate();
            this.chargeSlot("slotScanner");
            this.dischargeSlot("slotEnergy");
            this.updateUi();
        };
        AdvancedMiner.prototype.updateUi = function () {
            if (this.data.whitelist) {
                this.container.setText("textInfoMode", Translation.translate("Mode: Whitelist"));
            }
            else {
                this.container.setText("textInfoMode", Translation.translate("Mode: Blacklist"));
            }
            if (this.data.y < 0) {
                this.container.setText("textInfoXYZ", "X: " + this.data.x + ", Y: " + this.data.y + ", Z: " + this.data.z);
            }
            else {
                this.container.setText("textInfoXYZ", "");
            }
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendEvent("setSilktouchIcon", { mode: this.data.silk_touch });
            this.container.sendChanges();
        };
        AdvancedMiner.prototype.operate = function () {
            var newActive = false;
            var data = this.data;
            if (data.isEnabled && this.y + data.y >= 0 && data.energy >= 512) {
                var scanner = this.container.getSlot("slotScanner");
                var scanR = this.getScanRadius(scanner.id);
                var energyStored = ChargeItemRegistry.getEnergyStored(scanner);
                if (scanR > 0 && energyStored >= 64) {
                    newActive = true;
                    if (World.getThreadTime() % 20 == 0) {
                        if (data.y == 0) {
                            data.x = -1 - scanR;
                            data.y = -1;
                            data.z = -scanR;
                        }
                        for (var i = 0; i < this.maxScanCount; i++) {
                            data.x++;
                            if (data.x > scanR) {
                                data.x = -scanR;
                                data.z++;
                            }
                            if (data.z > scanR) {
                                data.z = -scanR;
                                data.y--;
                            }
                            energyStored -= 64;
                            var x = this.x + data.x;
                            var y = this.y + data.y;
                            var z = this.z + data.z;
                            var block = this.region.getBlock(x, y, z);
                            if (this.isValidBlock(block.id, block.data)) {
                                if (this.harvestBlock(x, y, z, block))
                                    break;
                            }
                            if (energyStored < 64)
                                break;
                        }
                        ChargeItemRegistry.setEnergyStored(scanner, energyStored);
                    }
                }
            }
            this.setActive(newActive);
        };
        AdvancedMiner.prototype.isValidBlock = function (id, data) {
            if (id > 0 && ToolAPI.getBlockMaterialName(id) != "unbreaking") {
                return true;
            }
            return false;
        };
        AdvancedMiner.prototype.harvestBlock = function (x, y, z, block) {
            var item = new ItemStack(VanillaItemID.diamond_pickaxe, 1, 0);
            if (this.data.silk_touch) {
                item.addEnchant(EEnchantment.SILK_TOUCH, 1);
            }
            var drop = BlockRegistry.getBlockDrop(x, y, z, block, 100, item, this.blockSource);
            if (this.checkDrop(drop))
                return false;
            this.data.energy -= 512;
            var result = this.region.breakBlockForResult(x, y, z, -1, item);
            this.drop(result.items);
            return true;
        };
        AdvancedMiner.prototype.checkDrop = function (drop) {
            if (drop.length == 0)
                return true;
            for (var _i = 0, drop_3 = drop; _i < drop_3.length; _i++) {
                var item = drop_3[_i];
                for (var i = 0; i < 16; i++) {
                    var slot = this.container.getSlot("slot" + i);
                    if (slot.id == item[0] && slot.data == item[2]) {
                        return !this.data.whitelist;
                    }
                }
            }
            return this.data.whitelist;
        };
        AdvancedMiner.prototype.drop = function (items) {
            var containers = StorageInterface.getNearestContainers(this, this.blockSource);
            StorageInterface.putItems(items, containers);
            for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                var item = items_2[_i];
                if (item.count > 0) {
                    this.region.dropItem(this.x + .5, this.y + 1, this.z + .5, item);
                }
            }
        };
        AdvancedMiner.prototype.adjustDrop = function (item) {
            if (item.id == this.blockID && this.data.energy > 0) {
                var extra = new ItemExtraData();
                item.extra = extra.putInt("energy", this.data.energy);
            }
            return item;
        };
        AdvancedMiner.prototype.onRedstoneUpdate = function (signal) {
            this.data.isEnabled = (signal == 0);
        };
        AdvancedMiner.prototype.switchWhitelist = function () {
            this.data.whitelist = !this.data.whitelist;
        };
        AdvancedMiner.prototype.switchSilktouch = function () {
            this.data.silk_touch = !this.data.silk_touch;
        };
        AdvancedMiner.prototype.restart = function () {
            this.data.x = this.data.y = this.data.z = 0;
        };
        AdvancedMiner.prototype.setSilktouchIcon = function (container, window, content, data) {
            if (content) {
                var iconIndex = data.mode ? 1 : 0;
                content.elements.button_silk.bitmap = "miner_button_silk_" + iconIndex;
            }
        };
        AdvancedMiner.prototype.canRotate = function (side) {
            return side > 1;
        };
        __decorate([
            Machine.ContainerEvent(Side.Server)
        ], AdvancedMiner.prototype, "switchWhitelist", null);
        __decorate([
            Machine.ContainerEvent(Side.Server)
        ], AdvancedMiner.prototype, "switchSilktouch", null);
        __decorate([
            Machine.ContainerEvent(Side.Server)
        ], AdvancedMiner.prototype, "restart", null);
        __decorate([
            Machine.ContainerEvent(Side.Client)
        ], AdvancedMiner.prototype, "setSilktouchIcon", null);
        return AdvancedMiner;
    }(Machine.ElectricMachine));
    Machine.AdvancedMiner = AdvancedMiner;
    MachineRegistry.registerPrototype(BlockID.advancedMiner, new AdvancedMiner());
})(Machine || (Machine = {}));
/// <reference path="./CropHarvesterGUI.ts" />
var Machine;
(function (Machine) {
    var CropHarvester = /** @class */ (function (_super) {
        __extends(CropHarvester, _super);
        function CropHarvester() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                tier: 1,
                energy_storage: 10000,
                scanX: -5,
                scanY: -1,
                scanZ: -5
            };
            _this.defaultTier = 1;
            _this.defaultEnergyStorage = 10000;
            _this.defaultDrop = BlockID.machineBlockBasic;
            _this.upgrades = ["transformer", "energyStorage", "itemEjector"];
            return _this;
        }
        CropHarvester.prototype.getScreenByName = function () {
            return guiCropHarvester;
        };
        CropHarvester.prototype.getTier = function () {
            return this.tier;
        };
        CropHarvester.prototype.getEnergyStorage = function () {
            return this.energyStorage;
        };
        CropHarvester.prototype.useUpgrades = function () {
            var upgrades = UpgradeAPI.useUpgrades(this);
            this.tier = upgrades.getTier(this.defaultTier);
            this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
        };
        CropHarvester.prototype.setupContainer = function () {
            var _this = this;
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, count, data) {
                if (name == "slotEnergy")
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
                return UpgradeAPI.isValidUpgrade(id, _this);
            });
        };
        CropHarvester.prototype.onTick = function () {
            this.useUpgrades();
            StorageInterface.checkHoppers(this);
            if (this.data.energy > 100)
                this.scan();
            this.dischargeSlot("slotEnergy");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        CropHarvester.prototype.scan = function () {
            this.data.scanX++;
            if (this.data.scanX > 5) {
                this.data.scanX = -5;
                this.data.scanZ++;
                if (this.data.scanZ > 5) {
                    this.data.scanZ = -5;
                    this.data.scanY++;
                    if (this.data.scanY > 1) {
                        this.data.scanY = -1;
                    }
                }
            }
            this.data.energy -= 1;
            var cropTile = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
            if (cropTile && cropTile.crop && !this.isInventoryFull()) {
                var drops = null;
                var crop = cropTile.crop;
                if (cropTile.data.currentSize == crop.getOptimalHarvestSize(cropTile)) {
                    drops = cropTile.performHarvest();
                }
                else if (cropTile.data.currentSize == cropTile.crop.getMaxSize()) {
                    drops = cropTile.performHarvest();
                }
                if (drops && drops.length) {
                    for (var _i = 0, drops_1 = drops; _i < drops_1.length; _i++) {
                        var item = drops_1[_i];
                        this.putItem(item);
                        this.data.energy -= 100;
                        if (item.count > 0) {
                            this.region.dropItem(this.x + .5, this.y + 1, this.z + .5, item);
                        }
                    }
                }
            }
        };
        CropHarvester.prototype.putItem = function (item) {
            for (var i = 0; i < 15; i++) {
                var slot = this.container.getSlot("outSlot" + i);
                if (StorageInterface.addItemToSlot(item, slot) > 0) {
                    slot.markDirty();
                }
            }
        };
        CropHarvester.prototype.isInventoryFull = function () {
            for (var i = 0; i < 15; i++) {
                var slot = this.container.getSlot("outSlot" + i);
                var maxStack = Item.getMaxStack(slot.id);
                if (!slot.id || slot.count < maxStack)
                    return false;
            }
            return true;
        };
        return CropHarvester;
    }(Machine.ElectricMachine));
    Machine.CropHarvester = CropHarvester;
})(Machine || (Machine = {}));
/// <reference path="./TileCropHarvester.ts" />
BlockRegistry.createBlock("cropHarvester", [
    { name: "Crop Harvester", texture: [["machine_bottom", 0], ["crop_harvester", 0]], inCreative: true }
], "machine");
ItemName.addTierTooltip("cropHarvester", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.cropHarvester, count: 1, data: 0 }, [
        "zcz",
        "s#s",
        "pap"
    ], ['#', BlockID.machineBlockBasic, 0, 'z', ItemID.circuitBasic, 0, 'c', 54, -1, 'a', ItemID.agriculturalAnalyzer, 0, 'p', ItemID.plateIron, 0, 's', 359, 0]);
});
MachineRegistry.registerPrototype(BlockID.cropHarvester, new Machine.CropHarvester());
StorageInterface.createInterface(BlockID.cropHarvester, {
    slots: {
        "outSlot^0-14": { output: true }
    }
});
var cropHarvesterGuiElements = {
    "energyScale": { type: "scale", x: 409, y: 167, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE },
    "slotEnergy": { type: "slot", x: 400, y: 230 },
    "slotUpgrade0": { type: "slot", x: 880, y: 110 },
    "slotUpgrade1": { type: "slot", x: 880, y: 170 },
    "slotUpgrade2": { type: "slot", x: 880, y: 230 }
};
for (var i = 0; i < 15; i++) {
    var x = i % 5;
    var y = Math.floor(i / 5) + 1;
    cropHarvesterGuiElements["outSlot" + i] = { type: "slot", x: 520 + x * 60, y: 50 + y * 60 };
}
;
var guiCropHarvester = MachineRegistry.createInventoryWindow("Crop Harvester", {
    drawing: [
        { type: "bitmap", x: 409, y: 167, bitmap: "energy_small_background", scale: GUI_SCALE }
    ],
    elements: cropHarvesterGuiElements
});
/// <reference path="./CropMatronGUI.ts" />
var Machine;
(function (Machine) {
    var CropMatron = /** @class */ (function (_super) {
        __extends(CropMatron, _super);
        function CropMatron() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                scanX: -5,
                scanY: -1,
                scanZ: -5
            };
            return _this;
        }
        CropMatron.prototype.getScreenByName = function () {
            return guiCropMatron;
        };
        CropMatron.prototype.setupContainer = function () {
            var _this = this;
            this.liquidTank = this.addLiquidTank("fluid", 2000, ["water"]);
            StorageInterface.setGlobalValidatePolicy(this.container, function (name, id, amount, data) {
                if (name == "slotEnergy")
                    return ChargeItemRegistry.isValidStorage(id, "Eu", _this.getTier());
                if (name == "slotWaterIn")
                    return LiquidItemRegistry.getItemLiquid(id, data) == "water";
                if (name.startsWith("slotFertilizer"))
                    return id == ItemID.fertilizer;
                if (name.startsWith("slotWeedEx"))
                    return id == ItemID.weedEx;
                return false;
            });
        };
        CropMatron.prototype.onItemUse = function (coords, item, player) {
            if (Entity.getSneaking(player)) {
                if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
                    this.preventClick();
                    return true;
                }
            }
            return _super.prototype.onItemUse.call(this, coords, item, player);
        };
        CropMatron.prototype.onTick = function () {
            StorageInterface.checkHoppers(this);
            var slot1 = this.container.getSlot("slotWaterIn");
            var slot2 = this.container.getSlot("slotWaterOut");
            this.liquidTank.getLiquidFromItem(slot1, slot2);
            if (this.data.energy >= 31) {
                this.scan();
                this.setActive(true);
            }
            else {
                this.setActive(false);
            }
            this.dischargeSlot("slotEnergy");
            this.liquidTank.updateUiScale("liquidScale");
            this.container.setScale("energyScale", this.getRelativeEnergy());
            this.container.sendChanges();
        };
        CropMatron.prototype.scan = function () {
            this.data.scanX++;
            if (this.data.scanX > 5) {
                this.data.scanX = -5;
                this.data.scanZ++;
                if (this.data.scanZ > 5) {
                    this.data.scanZ = -5;
                    this.data.scanY++;
                    if (this.data.scanY > 1) {
                        this.data.scanY = -1;
                    }
                }
            }
            this.data.energy -= 1;
            var tileentity = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
            if (tileentity && tileentity.crop) {
                var slotFertilizer = this.getSlot("slotFertilizer");
                var weedExSlot = this.getSlot("slotWeedEx");
                if (slotFertilizer && tileentity.applyFertilizer(false)) {
                    this.decreaseSlot(slotFertilizer, 1);
                    this.data.energy -= 10;
                }
                var liquidAmount = this.liquidTank.getAmount("water");
                if (liquidAmount > 0) {
                    var amount = tileentity.applyHydration(liquidAmount);
                    if (amount > 0) {
                        this.liquidTank.getLiquid(amount);
                    }
                }
                if (weedExSlot && weedExSlot.id && tileentity.applyWeedEx(weedExSlot, false)) {
                    this.data.energy -= 10;
                    if (++weedExSlot.data >= Item.getMaxDamage(weedExSlot.id)) {
                        weedExSlot.clear();
                    }
                    weedExSlot.markDirty();
                }
            }
        };
        CropMatron.prototype.getSlot = function (type) {
            for (var i = 0; i < 7; i++) {
                var slot = this.container.getSlot(type + i);
                if (slot.id)
                    return slot;
            }
            return null;
        };
        CropMatron.prototype.getEnergyStorage = function () {
            return 10000;
        };
        CropMatron.prototype.canRotate = function (side) {
            return side > 1;
        };
        return CropMatron;
    }(Machine.ElectricMachine));
    Machine.CropMatron = CropMatron;
})(Machine || (Machine = {}));
/// <reference path="./TileCropMatron.ts" />
BlockRegistry.createBlock("cropMatron", [
    { name: "Crop Matron", texture: [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], inCreative: true }
], "machine");
TileRenderer.setStandardModelWithRotation(BlockID.cropMatron, 2, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.cropMatron, 2, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 3], ["cropmatron_side", 1], ["cropmatron_side", 2], ["cropmatron_side", 2]]);
TileRenderer.setRotationFunction(BlockID.cropMatron, true);
ItemName.addTierTooltip("cropMatron", 1);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.cropMatron, count: 1, data: 0 }, [
        "cxc",
        "a#a",
        "nnn"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 54, -1, 'c', ItemID.circuitBasic, 0, 'a', ItemID.cellEmpty, 0, 'n', ItemID.cropStick, 0]);
});
MachineRegistry.registerPrototype(BlockID.cropMatron, new Machine.CropMatron());
MachineRegistry.createStorageInterface(BlockID.cropMatron, {
    slots: {
        "slotFertilizer^0-6": { input: true, isValid: function (item) { return item.id == ItemID.fertilizer; } },
        "slotWeedEx^0-6": { input: true, isValid: function (item) { return item.id == ItemID.weedEx; } },
        "slotWaterIn": {
            input: true, isValid: function (item) {
                return LiquidItemRegistry.getItemLiquid(item.id, item.data) == "water";
            }
        },
        "slotWaterOut": { output: true }
    },
    canReceiveLiquid: function (liquid) { return liquid == "water"; }
});
var сropMatronGuiElements = {
    "energyScale": { type: "scale", x: 870, y: 270, direction: 1, value: .5, bitmap: "energy_small_scale", scale: GUI_SCALE },
    "liquidScale": { type: "scale", x: 572, y: 256, direction: 1, bitmap: "water_storage_scale", scale: GUI_SCALE },
    "slotEnergy": { type: "slot", x: 804, y: 265 },
    "slotFertilizer0": { type: "slot", x: 441, y: 75, bitmap: "slot_dust" },
    "slotWeedEx0": { type: "slot", x: 441, y: 155, bitmap: "slot_weedEx" },
    "slotWaterIn": { type: "slot", x: 441, y: 235, bitmap: "slot_cell" },
    "slotWaterOut": { type: "slot", x: 441, y: 295 }
};
for (var i = 1; i < 7; i++) {
    сropMatronGuiElements["slotWeedEx" + i] = { type: "slot", x: 441 + 60 * i, y: 155 };
}
for (var i = 1; i < 7; i++) {
    сropMatronGuiElements["slotFertilizer" + i] = { type: "slot", x: 441 + 60 * i, y: 75 };
}
var guiCropMatron = MachineRegistry.createInventoryWindow("Crop Matron", {
    drawing: [
        { type: "bitmap", x: 870, y: 270, bitmap: "energy_small_background", scale: GUI_SCALE },
        { type: "bitmap", x: 511, y: 243, bitmap: "water_storage_background", scale: GUI_SCALE }
    ],
    elements: сropMatronGuiElements
});
BlockRegistry.createBlock("teslaCoil", [
    { name: "Tesla Coil", texture: [["tesla_coil", 0], ["tesla_coil", 0], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1], ["tesla_coil", 1]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.teslaCoil, "stone", 1);
ItemName.addTierTooltip("teslaCoil", 3);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.teslaCoil, count: 1, data: 0 }, [
        "ror",
        "r#r",
        "cxc"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'c', ItemID.casingIron, 0, 'o', ItemID.coil, 0, 'r', 331, 0]);
});
var Machine;
(function (Machine) {
    var TeslaCoil = /** @class */ (function (_super) {
        __extends(TeslaCoil, _super);
        function TeslaCoil() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                energy: 0,
                isEnabled: false
            };
            return _this;
        }
        TeslaCoil.prototype.getScreenName = function () {
            return null;
        };
        TeslaCoil.prototype.getTier = function () {
            return 3;
        };
        TeslaCoil.prototype.onTick = function () {
            if (this.data.isEnabled && this.data.energy >= 400) {
                this.data.energy--;
                if (World.getThreadTime() % 32 == 0) {
                    var entities = this.region.listEntitiesInAABB(this.x - 4, this.y - 4, this.z - 4, this.x + 5, this.y + 5, this.z + 5);
                    var damage = Math.floor(this.data.energy / 400);
                    for (var _i = 0, entities_5 = entities; _i < entities_5.length; _i++) {
                        var ent = entities_5[_i];
                        if (!EntityHelper.canTakeDamage(ent, DamageSource.electricity))
                            continue;
                        if (damage >= 24) {
                            Entity.setFire(ent, 1, true);
                        }
                        Entity.damageEntity(ent, damage, 6);
                        this.data.energy -= damage * 400;
                        return;
                    }
                }
            }
        };
        TeslaCoil.prototype.onRedstoneUpdate = function (signal) {
            this.data.isEnabled = signal > 0;
        };
        TeslaCoil.prototype.getEnergyStorage = function () {
            return 10000;
        };
        return TeslaCoil;
    }(Machine.ElectricMachine));
    Machine.TeslaCoil = TeslaCoil;
    MachineRegistry.registerPrototype(BlockID.teslaCoil, new TeslaCoil());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("teleporter", [
    { name: "Teleporter", texture: [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]], inCreative: true },
], "machine");
BlockRegistry.setBlockMaterial(BlockID.teleporter, "stone", 1);
ItemRegistry.setRarity(BlockID.teleporter, EnumRarity.RARE);
TileRenderer.setStandardModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0], ["teleporter_side", 0]]);
TileRenderer.registerRenderModel(BlockID.teleporter, 0, [["machine_advanced_bottom", 0], ["teleporter_top", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1], ["teleporter_side", 1]]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.teleporter, count: 1, data: 0 }, [
        "xax",
        "c#c",
        "xdx"
    ], ['#', BlockID.machineBlockAdvanced, 0, 'x', ItemID.circuitAdvanced, 0, 'a', ItemID.freqTransmitter, 0, 'c', ItemID.cableOptic, 0, 'd', 264, 0]);
});
var Machine;
(function (Machine) {
    var Teleporter = /** @class */ (function (_super) {
        __extends(Teleporter, _super);
        function Teleporter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                isActive: false,
                frequency: null
            };
            _this.defaultDrop = BlockID.machineBlockAdvanced;
            return _this;
        }
        Teleporter.prototype.getScreenName = function () {
            return null;
        };
        Teleporter.prototype.getNearestStorages = function () {
            var storages = [];
            for (var side = 0; side < 6; side++) {
                var coords = StorageInterface.getRelativeCoords(this, side);
                var tileEntity = this.region.getTileEntity(coords);
                if (tileEntity && MachineRegistry.isMachine(tileEntity.blockID) && tileEntity.isTeleporterCompatible) {
                    storages.push(tileEntity);
                }
            }
            return storages;
        };
        Teleporter.prototype.getWeight = function (ent) {
            var type = Entity.getType(ent);
            if (type == 1 || type == 63 || type == EntityType.MINECART)
                return 1000;
            if (type == EntityType.ITEM)
                return 100;
            if (EntityHelper.isFriendlyMobType(type))
                return 200;
            if (EntityHelper.isHostileMobType(type))
                return 500;
            return 0;
        };
        Teleporter.prototype.onTick = function () {
            if (World.getThreadTime() % 11 == 0 && this.data.isActive && this.data.frequency) {
                var storages = this.getNearestStorages();
                var energyAvailable = 0;
                for (var i in storages) {
                    energyAvailable += storages[i].data.energy;
                }
                var receive = this.data.frequency;
                if (energyAvailable > receive.energy * 100) {
                    var entities = this.region.listEntitiesInAABB(this.x - 1, this.y, this.z - 1, this.x + 2, this.y + 3, this.z + 2, 63);
                    for (var _i = 0, entities_6 = entities; _i < entities_6.length; _i++) {
                        var ent = entities_6[_i];
                        var weight = this.getWeight(ent);
                        if (!weight)
                            continue;
                        var energyNeed = weight * receive.energy;
                        if (Game.isDeveloperMode)
                            Debug.m(energyNeed);
                        if (energyNeed <= energyAvailable) {
                            for (var i in storages) {
                                var data = storages[i].data;
                                var energyChange = Math.min(energyNeed, data.energy);
                                data.energy -= energyChange;
                                energyNeed -= energyChange;
                                if (energyNeed <= 0)
                                    break;
                            }
                            SoundManager.playSoundAt(this.x + .5, this.y + 1, this.z + .5, "TeleUse.ogg");
                            SoundManager.playSoundAt(receive.x + .5, receive.y + 1, receive.z + .5, "TeleUse.ogg");
                            Entity.setPosition(ent, receive.x + .5, receive.y + 3, receive.z + .5);
                        }
                    }
                }
            }
        };
        Teleporter.prototype.onRedstoneUpdate = function (signal) {
            var isActive = signal > 0;
            this.data.isActive = isActive;
            this.setActive(isActive);
        };
        return Teleporter;
    }(Machine.MachineBase));
    Machine.Teleporter = Teleporter;
    MachineRegistry.registerPrototype(BlockID.teleporter, new Teleporter());
})(Machine || (Machine = {}));
BlockRegistry.createBlock("luminator", [
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "Luminator", texture: [["luminator", 0]], inCreative: true },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false },
    { name: "tile.luminator.name", texture: [["luminator", 0]], inCreative: false }
], { destroyTime: 2, explosionResistance: 0.5, renderLayer: 7 });
Block.setBlockShape(BlockID.luminator, { x: 0, y: 15 / 16, z: 0 }, { x: 1, y: 1, z: 1 }, 0);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 0 }, { x: 1, y: 1 / 16, z: 1 }, 1);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 15 / 16 }, { x: 1, y: 1, z: 1 }, 2);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 / 16 }, 3);
Block.setBlockShape(BlockID.luminator, { x: 15 / 16, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 4);
Block.setBlockShape(BlockID.luminator, { x: 0, y: 0, z: 0 }, { x: 1 / 16, y: 1, z: 1 }, 5);
BlockRegistry.registerDrop("luminator", function (coords, blockID, blockData, level, enchant) {
    return [[blockID, 1, 1]];
});
BlockRegistry.createBlock("luminator_on", [
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false },
    { name: "tile.luminator_on.name", texture: [["luminator", 1]], inCreative: false }
], {
    destroyTime: 2,
    explosionResistance: 0.5,
    lightLevel: 15,
    renderLayer: 7
});
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 15 / 16, z: 0 }, { x: 1, y: 1, z: 1 }, 0);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 0 }, { x: 1, y: 1 / 16, z: 1 }, 1);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 15 / 16 }, { x: 1, y: 1, z: 1 }, 2);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 / 16 }, 3);
Block.setBlockShape(BlockID.luminator_on, { x: 15 / 16, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 4);
Block.setBlockShape(BlockID.luminator_on, { x: 0, y: 0, z: 0 }, { x: 1 / 16, y: 1, z: 1 }, 5);
BlockRegistry.registerDrop("luminator_on", function (coords, blockID, blockData, level, enchant) {
    return [[BlockID.luminator, 1, 1]];
});
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.luminator, count: 8, data: 1 }, [
        "cxc",
        "aba",
        "aaa",
    ], ['a', 20, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.cableTin0, 0, 'c', ItemID.casingIron, 0]);
});
var Machine;
(function (Machine) {
    var Lamp = /** @class */ (function (_super) {
        __extends(Lamp, _super);
        function Lamp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                isActive: false,
                energy: 0
            };
            return _this;
        }
        Lamp.prototype.getEnergyStorage = function () {
            return 100;
        };
        Lamp.prototype.onItemUse = function () {
            this.data.isActive = true;
            return true;
        };
        Lamp.prototype.setBlock = function (blockID) {
            this.selfDestroy();
            var blockData = this.region.getBlockData(this);
            this.region.setBlock(this, blockID, blockData);
            var tile = this.region.addTileEntity(this);
            tile.data = this.data;
        };
        Lamp.prototype.onTick = function () {
            if (this.data.isActive && this.data.energy >= 0.25) {
                this.setBlock(BlockID.luminator_on);
            }
        };
        return Lamp;
    }(Machine.ElectricMachine));
    var LampOn = /** @class */ (function (_super) {
        __extends(LampOn, _super);
        function LampOn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LampOn.prototype.onItemUse = function () {
            this.data.isActive = false;
            this.setBlock(BlockID.luminator);
            return true;
        };
        LampOn.prototype.onTick = function () {
            if (this.data.energy < 0.25) {
                this.setBlock(BlockID.luminator);
            }
            else {
                this.data.energy -= 0.25;
            }
        };
        return LampOn;
    }(Lamp));
    MachineRegistry.registerPrototype(BlockID.luminator, new Lamp());
    MachineRegistry.registerPrototype(BlockID.luminator_on, new LampOn());
})(Machine || (Machine = {}));
Block.registerPlaceFunction("luminator", function (coords, item, block, player, region) {
    var x = coords.relative.x;
    var y = coords.relative.y;
    var z = coords.relative.z;
    var blockID = region.getBlockId(x, y, z);
    if (GenerationUtils.isTransparentBlock(blockID)) {
        region.setBlock(x, y, z, item.id, coords.side);
        //World.playSound(x, y, z, "dig.stone", 1, 0.8)
        World.addTileEntity(x, y, z, region);
    }
});
BlockRegistry.createBlock("nuke", [
    { name: "Nuke", texture: [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]], inCreative: true }
], "machine");
BlockRegistry.setBlockMaterial(BlockID.nuke, "stone", 1);
ItemRegistry.setRarity(BlockID.nuke, EnumRarity.UNCOMMON);
TileRenderer.setStandardModel(BlockID.nuke, 0, [["nuke_bottom", 0], ["nuke_top", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0], ["nuke_sides", 0]]);
TileRenderer.registerRenderModel(BlockID.nuke, 0, [["tnt_active", 0]]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.nuke, count: 1, data: 0 }, [
        "ncn",
        "x#x",
        "ncn"
    ], ['#', 46, -1, 'x', ItemID.uranium235, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
    Recipes.addShaped({ id: BlockID.nuke, count: 1, data: 0 }, [
        "ncn",
        "x#x",
        "ncn"
    ], ['#', 46, -1, 'x', ItemID.plutonium, 0, 'c', ItemID.circuitAdvanced, 0, 'n', ItemID.neutronReflectorThick, 0]);
});
var Machine;
(function (Machine) {
    var Nuke = /** @class */ (function (_super) {
        __extends(Nuke, _super);
        function Nuke() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.defaultValues = {
                activated: false,
                timer: 300
            };
            return _this;
        }
        Nuke.prototype.getScreenName = function () {
            return null;
        };
        Nuke.prototype.explode = function (radius) {
            SoundManager.playSound("NukeExplosion.ogg");
            var damageRad = radius * 1.5;
            var epicenter = new Vector3(this.x + .5, this.y + .5, this.z + .5);
            var entities = EntityHelper.getEntitiesInRadius(this.region, epicenter, damageRad);
            for (var _i = 0, entities_7 = entities; _i < entities_7.length; _i++) {
                var ent = entities_7[_i];
                var dist = Entity.getDistanceBetweenCoords(epicenter, Entity.getPosition(ent));
                var damage = Math.ceil(damageRad * damageRad * 25 / (dist * dist));
                if (damage >= 100) {
                    Entity.damageEntity(ent, damage);
                }
                else {
                    Entity.damageEntity(ent, damage, 11);
                }
            }
            var height = radius / 2;
            for (var dx = -radius; dx <= radius; dx++)
                for (var dy = -height; dy <= height; dy++)
                    for (var dz = -radius; dz <= radius; dz++) {
                        if (Math.sqrt(dx * dx + dy * dy * 4 + dz * dz) <= radius) {
                            var xx = this.x + dx, yy = this.y + dy, zz = this.z + dz;
                            var block = this.blockSource.getBlock(xx, yy, zz);
                            if (block.id > 0 && Block.getExplosionResistance(block.id) < 10000) {
                                if (Math.random() < 0.01) {
                                    var drop = this.blockSource.breakBlockForJsResult(xx, yy, zz, -1, new ItemStack());
                                    for (var _a = 0, _b = drop.items; _a < _b.length; _a++) {
                                        var item = _b[_a];
                                        this.blockSource.spawnDroppedItem(xx + .5, yy + .5, zz + .5, item.id, item.count, item.data, item.extra || null);
                                    }
                                }
                                else {
                                    this.blockSource.setBlock(xx, yy, zz, 0, 0);
                                }
                            }
                        }
                    }
            RadiationAPI.addRadiationSource(epicenter.x, epicenter.y, epicenter.z, this.dimension, radius * 2, 300);
            this.sendPacket("explodeAnimation", { rad: radius });
        };
        Nuke.prototype.onTick = function () {
            if (this.data.activated) {
                if (this.data.timer <= 0) {
                    this.explode(20);
                    this.selfDestroy();
                    return;
                }
                if (this.data.timer % 10 < 5) {
                    this.sendPacket("renderLitModel", { lit: true });
                }
                else {
                    this.sendPacket("renderLitModel", { lit: false });
                }
                this.data.timer--;
            }
        };
        Nuke.prototype.onRedstoneUpdate = function (signal) {
            if (signal > 0) {
                this.data.activated = true;
            }
        };
        Nuke.prototype.destroy = function () {
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
            return false;
        };
        Nuke.prototype.explodeAnimation = function (data) {
            var radius = data.rad;
            var count = radius * radius * radius / 25;
            for (var i = 0; i < count; i++) {
                var dx = MathUtil.randomInt(-radius, radius);
                var dy = MathUtil.randomInt(-radius / 2, radius / 2);
                var dz = MathUtil.randomInt(-radius, radius);
                if (Math.sqrt(dx * dx + dy * dy * 4 + dz * dz) <= radius) {
                    Particles.addParticle(ParticleType.hugeexplosionSeed, this.x + dx, this.y + dy, this.z + dz, 0, 0, 0);
                }
            }
        };
        Nuke.prototype.renderLitModel = function (data) {
            if (data.lit) {
                TileRenderer.mapAtCoords(this.x, this.y, this.z, BlockID.nuke, 0);
            }
            else {
                BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
            }
        };
        __decorate([
            Machine.NetworkEvent(Side.Client)
        ], Nuke.prototype, "explodeAnimation", null);
        __decorate([
            Machine.NetworkEvent(Side.Client)
        ], Nuke.prototype, "renderLitModel", null);
        return Nuke;
    }(TileEntityBase));
    MachineRegistry.registerPrototype(BlockID.nuke, new Nuke());
})(Machine || (Machine = {}));
var ItemElectric = /** @class */ (function (_super) {
    __extends(ItemElectric, _super);
    function ItemElectric(stringID, name, maxCharge, transferLimit, tier, inCreative) {
        var _this = _super.call(this, stringID, name, name, false) || this;
        _this.energy = "Eu";
        _this.canProvideEnergy = false;
        _this.setMaxStack(1);
        _this.setCategory(ItemCategory.EQUIPMENT);
        _this.maxCharge = maxCharge;
        _this.transferLimit = transferLimit;
        _this.tier = tier;
        ChargeItemRegistry.registerItem(_this.id, _this, inCreative);
        return _this;
    }
    ItemElectric.prototype.onNameOverride = function (item, name) {
        return name + "\n\u00A77" + ItemName.getPowerTierText(this.tier) + "\n" + ItemName.getItemStorageText(item);
    };
    return ItemElectric;
}(ItemCommon));
ItemRegistry.createItem("latex", { name: "latex", icon: "latex" });
ItemRegistry.createItem("rubber", { name: "rubber", icon: "rubber" });
Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);
// alternative sticky piston
Recipes.addShaped({ id: 29, count: 1, data: 0 }, [
    "x",
    "p"
], ['x', ItemID.latex, 0, 'p', 33, 0]);
// alternative torch
Recipes.addShaped({ id: 50, count: 4, data: 0 }, [
    "x",
    "#"
], ['x', ItemID.latex, 0, '#', 280, 0]);
// Crushed Ore
ItemRegistry.createItem("crushedCopper", { name: "crushed_copper_ore", icon: "crushed_copper_ore" });
ItemRegistry.createItem("crushedTin", { name: "crushed_tin_ore", icon: "crushed_tin_ore" });
ItemRegistry.createItem("crushedIron", { name: "crushed_iron_ore", icon: "crushed_iron_ore" });
ItemRegistry.createItem("crushedLead", { name: "crushed_lead_ore", icon: "crushed_lead_ore" });
ItemRegistry.createItem("crushedGold", { name: "crushed_gold_ore", icon: "crushed_gold_ore" });
ItemRegistry.createItem("crushedSilver", { name: "crushed_silver_ore", icon: "crushed_silver_ore" });
ItemRegistry.createItem("crushedUranium", { name: "crushed_uranium_ore", icon: "crushed_uranium_ore" });
Item.addCreativeGroup("oreCrushed", Translation.translate("Crushed Ores"), [
    ItemID.crushedCopper,
    ItemID.crushedTin,
    ItemID.crushedIron,
    ItemID.crushedLead,
    ItemID.crushedGold,
    ItemID.crushedSilver,
    ItemID.crushedUranium
]);
// Purified Crushed Ore
ItemRegistry.createItem("crushedPurifiedCopper", { name: "purified_copper_ore", icon: "purified_copper_ore" });
ItemRegistry.createItem("crushedPurifiedTin", { name: "purified_tin_ore", icon: "purified_tin_ore" });
ItemRegistry.createItem("crushedPurifiedIron", { name: "purified_iron_ore", icon: "purified_iron_ore" });
ItemRegistry.createItem("crushedPurifiedLead", { name: "purified_lead_ore", icon: "purified_lead_ore" });
ItemRegistry.createItem("crushedPurifiedGold", { name: "purified_gold_ore", icon: "purified_gold_ore" });
ItemRegistry.createItem("crushedPurifiedSilver", { name: "purified_silver_ore", icon: "purified_silver_ore" });
ItemRegistry.createItem("crushedPurifiedUranium", { name: "purified_uranium_ore", icon: "purified_uranium_ore" });
Item.addCreativeGroup("oreCrushedPurified", Translation.translate("Purified Crushed Ores"), [
    ItemID.crushedPurifiedCopper,
    ItemID.crushedPurifiedTin,
    ItemID.crushedPurifiedIron,
    ItemID.crushedPurifiedLead,
    ItemID.crushedPurifiedGold,
    ItemID.crushedPurifiedSilver,
    ItemID.crushedPurifiedUranium
]);
//Dust
ItemRegistry.createItem("dustCopper", { name: "copper_dust", icon: "dust_copper" });
ItemRegistry.createItem("dustTin", { name: "tin_dust", icon: "dust_tin" });
ItemRegistry.createItem("dustBronze", { name: "bronze_dust", icon: "dust_bronze" });
ItemRegistry.createItem("dustIron", { name: "iron_dust", icon: "dust_iron" });
ItemRegistry.createItem("dustSteel", { name: "steel_dust", icon: "dust_steel" });
ItemRegistry.createItem("dustLead", { name: "lead_dust", icon: "dust_lead" });
ItemRegistry.createItem("dustGold", { name: "gold_dust", icon: "dust_gold" });
ItemRegistry.createItem("dustSilver", { name: "silver_dust", icon: "dust_silver" });
ItemRegistry.createItem("dustStone", { name: "stone_dust", icon: "dust_stone" });
ItemRegistry.createItem("dustCoal", { name: "coal_dust", icon: "dust_coal" });
ItemRegistry.createItem("dustSulfur", { name: "sulfur_dust", icon: "dust_sulfur" });
ItemRegistry.createItem("dustLapis", { name: "lapis_dust", icon: "dust_lapis" });
ItemRegistry.createItem("dustDiamond", { name: "diamond_dust", icon: "dust_diamond" });
ItemRegistry.createItem("dustEnergium", { name: "energium_dust", icon: "dust_energium" });
Item.addCreativeGroup("dust", Translation.translate("Dusts"), [
    ItemID.dustCopper,
    ItemID.dustTin,
    ItemID.dustBronze,
    ItemID.dustIron,
    ItemID.dustSteel,
    ItemID.dustLead,
    ItemID.dustGold,
    ItemID.dustSilver,
    ItemID.dustStone,
    ItemID.dustCoal,
    ItemID.dustSulfur,
    ItemID.dustLapis,
    ItemID.dustDiamond,
    ItemID.dustEnergium
]);
// Small Dust
ItemRegistry.createItem("dustSmallCopper", { name: "small_copper_dust", icon: "dust_copper_small" });
ItemRegistry.createItem("dustSmallTin", { name: "small_tin_dust", icon: "dust_tin_small" });
ItemRegistry.createItem("dustSmallIron", { name: "small_iron_dust", icon: "dust_iron_small" });
ItemRegistry.createItem("dustSmallLead", { name: "small_lead_dust", icon: "dust_lead_small" });
ItemRegistry.createItem("dustSmallGold", { name: "small_gold_dust", icon: "dust_gold_small" });
ItemRegistry.createItem("dustSmallSilver", { name: "small_silver_dust", icon: "dust_silver_small" });
ItemRegistry.createItem("dustSmallSulfur", { name: "small_sulfur_dust", icon: "dust_sulfur_small" });
Item.addCreativeGroup("dustSmall", Translation.translate("Small Dusts"), [
    ItemID.dustSmallCopper,
    ItemID.dustSmallTin,
    ItemID.dustSmallIron,
    ItemID.dustSmallLead,
    ItemID.dustSmallGold,
    ItemID.dustSmallSilver,
    ItemID.dustSmallSulfur
]);
// Recipe
Recipes.addShaped({ id: ItemID.dustEnergium, count: 9, data: 0 }, [
    "xax",
    "axa",
    "xax",
], ['x', 331, 0, 'a', ItemID.dustDiamond, 0]);
Recipes.addShapeless({ id: ItemID.dustBronze, count: 4, data: 0 }, [
    { id: ItemID.crushedCopper, data: 0 },
    { id: ItemID.crushedCopper, data: 0 },
    { id: ItemID.crushedCopper, data: 0 },
    { id: ItemID.crushedTin, data: 0 }
]);
Recipes.addShapeless({ id: ItemID.dustBronze, count: 4, data: 0 }, [
    { id: ItemID.crushedPurifiedCopper, data: 0 },
    { id: ItemID.crushedPurifiedCopper, data: 0 },
    { id: ItemID.crushedPurifiedCopper, data: 0 },
    { id: ItemID.crushedPurifiedTin, data: 0 }
]);
Recipes.addShapeless({ id: ItemID.dustBronze, count: 4, data: 0 }, [
    { id: ItemID.dustCopper, data: 0 },
    { id: ItemID.dustCopper, data: 0 },
    { id: ItemID.dustCopper, data: 0 },
    { id: ItemID.dustTin, data: 0 }
]);
Recipes.addShaped({ id: ItemID.dustCopper, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallCopper, 0]);
Recipes.addShaped({ id: ItemID.dustTin, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallTin, 0]);
Recipes.addShaped({ id: ItemID.dustIron, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallIron, 0]);
Recipes.addShaped({ id: ItemID.dustLead, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallLead, 0]);
Recipes.addShaped({ id: ItemID.dustGold, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallGold, 0]);
Recipes.addShaped({ id: ItemID.dustSilver, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallSilver, 0]);
Recipes.addShaped({ id: ItemID.dustSulfur, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx",
], ['x', ItemID.dustSmallSulfur, 0]);
// alternative
Recipes.addShaped({ id: 348, count: 1, data: 0 }, [
    "xax",
    "axa",
    "xax",
], ['x', 331, 0, 'a', ItemID.dustGold, 0]);
Recipes.addShaped({ id: 289, count: 3, data: 0 }, [
    "xax",
    "axa",
    "xax",
], ['x', 331, 0, 'a', ItemID.dustCoal, 0]);
ItemRegistry.createItem("ingotCopper", { name: "copper_ingot", icon: "ingot_copper" });
ItemRegistry.createItem("ingotTin", { name: "tin_ingot", icon: "ingot_tin" });
ItemRegistry.createItem("ingotBronze", { name: "bronze_ingot", icon: "ingot_bronze" });
ItemRegistry.createItem("ingotSteel", { name: "steel_ingot", icon: "ingot_steel" });
ItemRegistry.createItem("ingotLead", { name: "lead_ingot", icon: "ingot_lead" });
ItemRegistry.createItem("ingotSilver", { name: "silver_ingot", icon: "ingot_silver" });
ItemRegistry.createItem("ingotAlloy", { name: "alloy_ingot", icon: "ingot_alloy" });
Item.addCreativeGroup("ingot", Translation.translate("Ingots"), [
    ItemID.ingotCopper,
    ItemID.ingotTin,
    ItemID.ingotBronze,
    ItemID.ingotSteel,
    ItemID.ingotLead,
    ItemID.ingotSilver,
    ItemID.ingotAlloy
]);
Callback.addCallback("PreLoaded", function () {
    // from ore
    Recipes.addFurnace(BlockID.oreCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(BlockID.oreTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(BlockID.oreLead, ItemID.ingotLead, 0);
    // from crushed ore
    Recipes.addFurnace(ItemID.crushedIron, 265, 0);
    Recipes.addFurnace(ItemID.crushedGold, 266, 0);
    Recipes.addFurnace(ItemID.crushedCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.crushedTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.crushedLead, ItemID.ingotLead, 0);
    Recipes.addFurnace(ItemID.crushedSilver, ItemID.ingotSilver, 0);
    // from purified ore
    Recipes.addFurnace(ItemID.crushedPurifiedIron, 265, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedGold, 266, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedLead, ItemID.ingotLead, 0);
    Recipes.addFurnace(ItemID.crushedPurifiedSilver, ItemID.ingotSilver, 0);
    // from dust
    Recipes.addFurnace(ItemID.dustCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.dustTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
    Recipes.addFurnace(ItemID.dustBronze, ItemID.ingotBronze, 0);
    Recipes.addFurnace(ItemID.dustSteel, ItemID.ingotSteel, 0);
    Recipes.addFurnace(ItemID.dustIron, 265, 0);
    Recipes.addFurnace(ItemID.dustGold, 266, 0);
    Recipes.addFurnace(ItemID.dustSilver, ItemID.ingotSilver, 0);
    // from plates
    Recipes.addFurnace(ItemID.plateCopper, ItemID.ingotCopper, 0);
    Recipes.addFurnace(ItemID.plateTin, ItemID.ingotTin, 0);
    Recipes.addFurnace(ItemID.plateBronze, ItemID.ingotBronze, 0);
    Recipes.addFurnace(ItemID.plateSteel, ItemID.ingotSteel, 0);
    Recipes.addFurnace(ItemID.plateIron, 265, 0);
    Recipes.addFurnace(ItemID.plateGold, 266, 0);
    Recipes.addFurnace(ItemID.plateLead, ItemID.ingotLead, 0);
    var ironPlate = IC2Config.hardRecipes ? ItemID.plateSteel : ItemID.plateIron;
    Recipes.addShaped({ id: ItemID.ingotAlloy, count: 2, data: 0 }, [
        "aaa",
        "bbb",
        "ccc"
    ], ['a', ironPlate, -1, 'b', ItemID.plateBronze, -1, 'c', ItemID.plateTin, -1]);
    // alternative
    Recipes.addShaped({ id: 66, count: 12, data: 0 }, [
        "a a",
        "axa",
        "a a"
    ], ['x', 280, -1, 'a', ItemID.ingotBronze, -1]);
    Recipes.addShaped({ id: 33, count: 1, data: 0 }, [
        "ppp",
        "cbc",
        "cxc"
    ], ['x', 331, -1, 'b', ItemID.ingotBronze, -1, 'c', 4, -1, 'p', 5, -1]);
});
ItemRegistry.createItem("plateCopper", { name: "copper_plate", icon: "plate_copper" });
ItemRegistry.createItem("plateTin", { name: "tin_plate", icon: "plate_tin" });
ItemRegistry.createItem("plateBronze", { name: "bronze_plate", icon: "plate_bronze" });
ItemRegistry.createItem("plateIron", { name: "iron_plate", icon: "plate_iron" });
ItemRegistry.createItem("plateSteel", { name: "steel_plate", icon: "plate_steel" });
ItemRegistry.createItem("plateGold", { name: "gold_plate", icon: "plate_gold" });
ItemRegistry.createItem("plateLead", { name: "lead_plate", icon: "plate_lead" });
ItemRegistry.createItem("plateLapis", { name: "lapis_plate", icon: "plate_lapis" });
Item.addCreativeGroup("plate", Translation.translate("Plates"), [
    ItemID.plateCopper,
    ItemID.plateTin,
    ItemID.plateBronze,
    ItemID.plateIron,
    ItemID.plateSteel,
    ItemID.plateGold,
    ItemID.plateLead,
    ItemID.plateLapis
]);
// recipes
Callback.addCallback("PreLoaded", function () {
    ICTool.addRecipe({ id: ItemID.plateCopper, count: 1, data: 0 }, [{ id: ItemID.ingotCopper, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateTin, count: 1, data: 0 }, [{ id: ItemID.ingotTin, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateBronze, count: 1, data: 0 }, [{ id: ItemID.ingotBronze, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateIron, count: 1, data: 0 }, [{ id: 265, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateGold, count: 1, data: 0 }, [{ id: 266, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.plateLead, count: 1, data: 0 }, [{ id: ItemID.ingotLead, data: 0 }], ItemID.craftingHammer);
});
ItemRegistry.createItem("densePlateCopper", { name: "dense_copper_plate", icon: "dense_plate_copper" });
ItemRegistry.createItem("densePlateTin", { name: "dense_tin_plate", icon: "dense_plate_tin" });
ItemRegistry.createItem("densePlateBronze", { name: "dense_bronze_plate", icon: "dense_plate_bronze" });
ItemRegistry.createItem("densePlateIron", { name: "dense_iron_plate", icon: "dense_plate_iron" });
ItemRegistry.createItem("densePlateSteel", { name: "dense_steel_plate", icon: "dense_plate_steel" });
ItemRegistry.createItem("densePlateGold", { name: "dense_gold_plate", icon: "dense_plate_gold" });
ItemRegistry.createItem("densePlateLead", { name: "dense_lead_plate", icon: "dense_plate_lead" });
Item.addCreativeGroup("plateDense", Translation.translate("Desne Plates"), [
    ItemID.densePlateCopper,
    ItemID.densePlateTin,
    ItemID.densePlateBronze,
    ItemID.densePlateIron,
    ItemID.densePlateSteel,
    ItemID.densePlateGold,
    ItemID.densePlateLead
]);
ItemRegistry.createItem("casingCopper", { name: "copper_casing", icon: "casing_copper" });
ItemRegistry.createItem("casingTin", { name: "tin_casing", icon: "casing_tin" });
ItemRegistry.createItem("casingBronze", { name: "bronze_casing", icon: "casing_bronze" });
ItemRegistry.createItem("casingIron", { name: "iron_casing", icon: "casing_iron" });
ItemRegistry.createItem("casingSteel", { name: "steel_casing", icon: "casing_steel" });
ItemRegistry.createItem("casingGold", { name: "gold_casing", icon: "casing_gold" });
ItemRegistry.createItem("casingLead", { name: "lead_casing", icon: "casing_lead" });
// creative group
Item.addCreativeGroup("casingMetal", Translation.translate("Metal Casings"), [
    ItemID.casingCopper,
    ItemID.casingLead,
    ItemID.casingGold,
    ItemID.casingSteel,
    ItemID.casingIron,
    ItemID.casingBronze,
    ItemID.casingTin
]);
// recipes
Callback.addCallback("PreLoaded", function () {
    ICTool.addRecipe({ id: ItemID.casingCopper, count: 2, data: 0 }, [{ id: ItemID.plateCopper, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingTin, count: 2, data: 0 }, [{ id: ItemID.plateTin, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingBronze, count: 2, data: 0 }, [{ id: ItemID.plateBronze, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingIron, count: 2, data: 0 }, [{ id: ItemID.plateIron, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingGold, count: 2, data: 0 }, [{ id: ItemID.plateGold, data: 0 }], ItemID.craftingHammer);
    ICTool.addRecipe({ id: ItemID.casingLead, count: 2, data: 0 }, [{ id: ItemID.plateLead, data: 0 }], ItemID.craftingHammer);
});
ItemRegistry.createItem("uranium", { name: "enriched_uranium", icon: "uranium" });
RadiationAPI.setRadioactivity(ItemID.uranium, 60);
ItemRegistry.createItem("uranium235", { name: "uranium_235", icon: "uranium235" });
RadiationAPI.setRadioactivity(ItemID.uranium235, 150);
ItemRegistry.createItem("smallUranium235", { name: "small_uranium_235", icon: "small_uranium235" });
RadiationAPI.setRadioactivity(ItemID.smallUranium235, 150);
ItemRegistry.createItem("uranium238", { name: "uranium_238", icon: "uranium238" });
RadiationAPI.setRadioactivity(ItemID.uranium238, 10, true);
ItemRegistry.createItem("smallUranium238", { name: "small_uranium_238", icon: "small_uranium238" });
RadiationAPI.setRadioactivity(ItemID.smallUranium238, 10, true);
ItemRegistry.createItem("plutonium", { name: "plutonium", icon: "plutonium" });
RadiationAPI.setRadioactivity(ItemID.plutonium, 150);
ItemRegistry.createItem("smallPlutonium", { name: "small_plutonium", icon: "small_plutonium" });
RadiationAPI.setRadioactivity(ItemID.smallPlutonium, 150);
ItemRegistry.createItem("mox", { name: "mox_fuel", icon: "mox" });
RadiationAPI.setRadioactivity(ItemID.mox, 300);
ItemRegistry.createItem("rtgPellet", { name: "rtg_pellet", icon: "rtg_pellet", stack: 1 });
RadiationAPI.setRadioactivity(ItemID.rtgPellet, 2, true);
Item.addCreativeGroup("nuclear", Translation.translate("Nuclear"), [
    ItemID.uranium,
    ItemID.uranium235,
    ItemID.smallUranium235,
    ItemID.uranium238,
    ItemID.smallUranium238,
    ItemID.plutonium,
    ItemID.smallPlutonium,
    ItemID.mox,
    ItemID.rtgPellet
]);
Recipes.addShaped({ id: ItemID.uranium, count: 1, data: 0 }, [
    "xxx",
    "aaa",
    "xxx"
], ['x', ItemID.uranium238, 0, 'a', ItemID.smallUranium235, 0]);
Recipes.addShaped({ id: ItemID.uranium235, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx"
], ['x', ItemID.smallUranium235, 0]);
Recipes.addShaped({ id: ItemID.plutonium, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx"
], ['x', ItemID.smallPlutonium, 0]);
Recipes.addShaped({ id: ItemID.mox, count: 1, data: 0 }, [
    "xxx",
    "aaa",
    "xxx"
], ['x', ItemID.smallPlutonium, 0, 'a', ItemID.uranium238, 0]);
Recipes.addShaped({ id: ItemID.rtgPellet, count: 1, data: 0 }, [
    "xxx",
    "aaa",
    "xxx"
], ['x', ItemID.densePlateIron, 0, 'a', ItemID.plutonium, 0]);
Recipes.addShapeless({ id: ItemID.smallUranium235, count: 9, data: 0 }, [{ id: ItemID.uranium235, data: 0 }]);
Recipes.addShapeless({ id: ItemID.smallPlutonium, count: 9, data: 0 }, [{ id: ItemID.plutonium, data: 0 }]);
var SCRAP_BOX_RANDOM_DROP = [
    { chance: 0.1, id: 264, data: 0 },
    { chance: 1.8, id: 15, data: 0 },
    { chance: 1, id: 14, data: 0 },
    { chance: 3, id: 331, data: 0 },
    { chance: 0.8, id: 348, data: 0 },
    __assign({ chance: 5 }, IDConverter.getIDData("bone_meal")),
    { chance: 2, id: 17, data: 0 },
    { chance: 2, id: 6, data: 0 },
    { chance: 2, id: 263, data: 0 },
    { chance: 3, id: 260, data: 0 },
    { chance: 2.1, id: 262, data: 0 },
    { chance: 1, id: 354, data: 0 },
    { chance: 3, id: 296, data: 0 },
    { chance: 5, id: 280, data: 0 },
    { chance: 3.5, id: 287, data: 0 },
    { chance: 10, id: 3, data: 0 },
    { chance: 3, id: 12, data: 0 },
    { chance: 3, id: 13, data: 0 },
    { chance: 4, id: 2, data: 0 },
    { chance: 1.2, id: ItemID.dustCoal, data: 0 },
    { chance: 1.2, id: ItemID.dustCopper, data: 0 },
    { chance: 1.2, id: ItemID.dustTin, data: 0 },
    { chance: 1.2, id: ItemID.dustIron, data: 0 },
    { chance: 0.8, id: ItemID.dustGold, data: 0 },
    { chance: 0.8, id: ItemID.dustLead, data: 0 },
    { chance: 0.6, id: ItemID.dustSilver, data: 0 },
    { chance: 0.4, id: ItemID.dustDiamond, data: 0 },
    { chance: 0.4, id: BlockID.oreUranium, data: 0 },
    { chance: 2, id: BlockID.oreCopper, data: 0 },
    { chance: 1.5, id: BlockID.oreTin, data: 0 },
    { chance: 1, id: BlockID.oreLead, data: 0 },
    { chance: 2, id: ItemID.rubber, data: 0 },
    { chance: 2, id: ItemID.latex, data: 0 },
    { chance: 2.5, id: ItemID.tinCanFull, data: 0 },
];
var ItemScrapBox = /** @class */ (function (_super) {
    __extends(ItemScrapBox, _super);
    function ItemScrapBox() {
        var _this = _super.call(this, "scrapBox", "scrap_box", "scrap_box") || this;
        Recipes.addFurnaceFuel(_this.id, 0, 3150);
        return _this;
    }
    ItemScrapBox.prototype.getDropItem = function () {
        var total = 0;
        for (var i in SCRAP_BOX_RANDOM_DROP) {
            total += SCRAP_BOX_RANDOM_DROP[i].chance;
        }
        var random = Math.random() * total * 1.35;
        var current = 0;
        for (var i in SCRAP_BOX_RANDOM_DROP) {
            var drop = SCRAP_BOX_RANDOM_DROP[i];
            if (current < random && current + drop.chance > random) {
                return drop;
            }
            current += drop.chance;
        }
        return { id: ItemID.scrap, data: 0 };
    };
    ItemScrapBox.prototype.onItemUse = function (coords, item, block, player) {
        var region = WorldRegion.getForActor(player);
        var drop = this.getDropItem();
        var _a = coords.relative, x = _a.x, y = _a.y, z = _a.z;
        region.dropItem(x + .5, y + .1, z + .5, drop.id, 1, drop.data);
        Entity.setCarriedItem(player, item.id, item.count - 1, 0);
    };
    return ItemScrapBox;
}(ItemCommon));
ItemRegistry.createItem("scrap", { name: "scrap", icon: "scrap" });
Recipes.addFurnaceFuel(ItemID.scrap, 0, 350);
ItemRegistry.registerItem(new ItemScrapBox());
Recipes.addShaped({ id: ItemID.scrapBox, count: 1, data: 0 }, [
    "xxx",
    "xxx",
    "xxx"
], ['x', ItemID.scrap, 0]);
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrap, { input: 5000, output: 30000 });
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrapBox, { input: 45000, output: 270000 });
ItemRegistry.createItem("matter", { name: "uu_matter", icon: "uu_matter", rarity: EnumRarity.RARE });
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.iridiumChunk, count: 1, data: 0 }, [
        "xxx",
        " x ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 264, count: 1, data: 0 }, [
        "xxx",
        "xxx",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 17, count: 8, data: 0 }, [
        " x ",
        "   ",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 1, count: 16, data: 0 }, [
        "   ",
        " x ",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 2, count: 16, data: 0 }, [
        "   ",
        "x  ",
        "x  "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 80, count: 4, data: 0 }, [
        "x x",
        "   ",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 8, count: 1, data: 0 }, [
        "   ",
        " x ",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 10, count: 1, data: 0 }, [
        " x ",
        " x ",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 35, count: 12, data: 0 }, [
        "x x",
        "   ",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 106, count: 24, data: 0 }, [
        "x  ",
        "x  ",
        "x  "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 332, count: 24, data: 0 }, [
        "   ",
        "   ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 20, count: 32, data: 0 }, [
        " x ",
        "x x",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 49, count: 12, data: 0 }, [
        "x x",
        "x x",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 288, count: 32, data: 0 }, [
        " x ",
        " x ",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped(IDConverter.getStack("ink_sac", 48), [
        " xx",
        " xx",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped(IDConverter.getStack("cocoa_beans", 32), [
        "xx ",
        "  x",
        "xx "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped(IDConverter.getStack("lapis_lazuli", 9), [
        " x ",
        " x ",
        " xx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 337, count: 48, data: 0 }, [
        "xx ",
        "x  ",
        "xx "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 110, count: 24, data: 0 }, [
        "   ",
        "x x",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 318, count: 32, data: 0 }, [
        " x ",
        "xx ",
        "xx "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 98, count: 48, data: 0 }, [
        "xx ",
        "xx ",
        "x  "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 89, count: 8, data: 0 }, [
        " x ",
        "x x",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 81, count: 48, data: 0 }, [
        " x ",
        "xxx",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 338, count: 48, data: 0 }, [
        "x x",
        "x x",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 289, count: 16, data: 0 }, [
        "xxx",
        "x  ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 263, count: 20, data: 0 }, [
        "  x",
        "x  ",
        "  x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 331, count: 24, data: 0 }, [
        "   ",
        " x ",
        "xxx"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 388, count: 2, data: 0 }, [
        "xxx",
        "xxx",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: ItemID.latex, count: 21, data: 0 }, [
        "x x",
        "   ",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 14, count: 2, data: 0 }, [
        " x ",
        "xxx",
        " x "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: 15, count: 2, data: 0 }, [
        "x x",
        " x ",
        "x x"
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: BlockID.oreCopper, count: 5, data: 0 }, [
        "  x",
        "x x",
        "   "
    ], ['x', ItemID.matter, -1]);
    Recipes.addShaped({ id: BlockID.oreTin, count: 5, data: 0 }, [
        "   ",
        "x x",
        "  x"
    ], ['x', ItemID.matter, -1]);
});
ItemRegistry.createItem("iridiumChunk", { name: "iridium_chunk", icon: "iridium_chunk", rarity: EnumRarity.RARE });
ItemRegistry.createItem("plateReinforcedIridium", { name: "iridium_reinforced_plate", icon: "plate_reinforced_iridium", rarity: EnumRarity.RARE });
ItemRegistry.createItem("plateAlloy", { name: "alloy_plate", icon: "plate_alloy" });
ItemRegistry.createItem("carbonFibre", { name: "carbon_fibre", icon: "carbon_fibre" });
ItemRegistry.createItem("carbonMesh", { name: "carbon_mesh", icon: "carbon_mesh" });
ItemRegistry.createItem("carbonPlate", { name: "carbon_plate", icon: "carbon_plate" });
ItemRegistry.createItem("coalBall", { name: "coal_ball", icon: "coal_ball" });
ItemRegistry.createItem("coalBlock", { name: "coal_block", icon: "coal_block" });
ItemRegistry.createItem("coalChunk", { name: "coal_chunk", icon: "coal_chunk" });
Item.addCreativeGroup("ic2_material", Translation.translate("Materials"), [
    ItemID.iridiumChunk,
    ItemID.plateReinforcedIridium,
    ItemID.plateAlloy,
    ItemID.carbonFibre,
    ItemID.carbonMesh,
    ItemID.carbonPlate,
    ItemID.coalBall,
    ItemID.coalBlock,
    ItemID.coalChunk
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.carbonFibre, count: 1, data: 0 }, [
        "xx",
        "xx"
    ], ['x', ItemID.dustCoal, 0]);
    Recipes.addShaped({ id: ItemID.carbonMesh, count: 1, data: 0 }, [
        "x",
        "x"
    ], ['x', ItemID.carbonFibre, 0]);
    Recipes.addShaped({ id: ItemID.coalBall, count: 1, data: 0 }, [
        "xxx",
        "x#x",
        "xxx"
    ], ['x', ItemID.dustCoal, 0, '#', 318, 0]);
    Recipes.addShaped({ id: ItemID.coalChunk, count: 1, data: 0 }, [
        "xxx",
        "x#x",
        "xxx"
    ], ['x', ItemID.coalBlock, -1, '#', 49, -1]);
    Recipes.addShaped({ id: ItemID.plateReinforcedIridium, count: 1, data: 0 }, [
        "xax",
        "a#a",
        "xax"
    ], ['x', ItemID.iridiumChunk, 0, '#', 264, 0, 'a', ItemID.plateAlloy, 0]);
});
LiquidRegistry.registerLiquid("biomass", "Biomass", ["liquid_biomass", "liquid_biomass_48x30", "liquid_biomass_55x47"]);
LiquidRegistry.registerLiquid("biogas", "Biogas", ["liquid_biogas", "liquid_biogas_55x47"]);
LiquidRegistry.registerLiquid("coolant", "Coolant", ["liquid_coolant", "liquid_coolant_110x94"]);
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_55x47");
LiquidRegistry.getLiquidData("water").uiTextures.push("gui_water_texture_47x24");
LiquidRegistry.getLiquidData("water").uiTextures.push("gui_water_texture_55x47");
var ItemEmptyCell = /** @class */ (function (_super) {
    __extends(ItemEmptyCell, _super);
    function ItemEmptyCell() {
        var _this = _super.call(this, "cellEmpty", "empty_cell", "cell_empty") || this;
        _this.setLiquidClip();
        return _this;
    }
    ItemEmptyCell.prototype.onItemUse = function (coords, item, block, playerUid) {
        if (block.id > 7 && block.id < 12 && block.data == 0) {
            var player = new PlayerEntity(playerUid);
            var region = WorldRegion.getForActor(playerUid);
            region.setBlock(coords, 0, 0);
            if (block.id == 8 || block.id == 9) {
                player.addItemToInventory(ItemID.cellWater, 1, 0);
            }
            else {
                player.addItemToInventory(ItemID.cellLava, 1, 0);
            }
            player.decreaseCarriedItem();
        }
    };
    return ItemEmptyCell;
}(ItemCommon));
var ItemLiquidCell = /** @class */ (function (_super) {
    __extends(ItemLiquidCell, _super);
    function ItemLiquidCell(stringID, liquid) {
        var _this = _super.call(this, stringID, liquid + "_cell", "cell_" + liquid) || this;
        LiquidItemRegistry.registerItem(liquid, ItemID.cellEmpty, _this.id, 1000);
        return _this;
    }
    ItemLiquidCell.prototype.onNameOverride = function (item, name) {
        return name + "\n§7" + (1000 - item.data) + " mB";
    };
    return ItemLiquidCell;
}(ItemCommon));
ItemRegistry.registerItem(new ItemEmptyCell());
ItemRegistry.registerItem(new ItemLiquidCell("cellWater", "water"));
ItemRegistry.registerItem(new ItemLiquidCell("cellLava", "lava"));
ItemRegistry.registerItem(new ItemLiquidCell("cellBiomass", "biomass"));
ItemRegistry.registerItem(new ItemLiquidCell("cellBiogas", "biogas"));
ItemRegistry.registerItem(new ItemLiquidCell("cellCoolant", "coolant"));
//ItemRegistry.registerItem(new ItemLiquidCell("cellMatter", "uu_matter"));
ItemRegistry.createItem("cellAir", { name: "air_cell", icon: "cell_air" });
Item.addCreativeGroup("cells", Translation.translate("Cells"), [
    ItemID.cellEmpty,
    ItemID.cellWater,
    ItemID.cellLava,
    ItemID.cellBiomass,
    ItemID.cellBiogas,
    ItemID.cellCoolant,
    ItemID.cellMatter,
    ItemID.cellAir
]);
Recipes.addShaped({ id: ItemID.cellEmpty, count: 1, data: 0 }, [
    " x ",
    "xgx",
    " x "
], ['x', ItemID.casingTin, 0, 'g', 102, 0]);
Recipes.addShaped({ id: 49, count: 1, data: 0 }, [
    "aa",
    "bb"
], ['a', ItemID.cellLava, 0, 'b', ItemID.cellWater, 0]);
Item.registerUseFunction("cellWater", function (coords, item, block, playerUid) {
    if (item.data > 0 || block.id == BlockID.crop)
        return;
    var player = new PlayerEntity(playerUid);
    var region = WorldRegion.getForActor(playerUid);
    var blockID = region.getBlockId(coords.relative);
    if (blockID == 0 || blockID > 7 && blockID < 12) {
        region.setBlock(coords.relative, 8, 0);
        player.addItemToInventory(ItemID.cellEmpty, 1, 0);
        player.decreaseCarriedItem();
    }
});
Item.registerUseFunction("cellLava", function (coords, item, block, playerUid) {
    if (item.data > 0)
        return;
    var player = new PlayerEntity(playerUid);
    var region = WorldRegion.getForActor(playerUid);
    var blockID = region.getBlockId(coords.relative);
    if (blockID == 0 || blockID > 7 && blockID < 12) {
        region.setBlock(coords.relative, 10, 0);
        player.addItemToInventory(ItemID.cellEmpty, 1, 0);
        player.decreaseCarriedItem();
    }
});
ItemRegistry.createItem("ashes", { name: "ashes", icon: "ashes" });
ItemRegistry.createItem("slag", { name: "slag", icon: "slag" });
ItemRegistry.createItem("bioChaff", { name: "bio_chaff", icon: "bio_chaff" });
ItemRegistry.createItem("rotorWooden", { name: "Wooden rotor", icon: "rotor_wooden" });
ItemRegistry.createItem("rotorIron", { name: "Iron rotor", icon: "rotor_iron" });
ItemRegistry.createItem("rotorSteel", { name: "Steel rotor", icon: "rotor_steel" });
ItemRegistry.createItem("rotorCarbon", { name: "Carbon rotor", icon: "rotor_carbon" });
ItemRegistry.createItem("bladeWooden", { name: "Wooden blade", icon: "rotor_blade_wooden" });
ItemRegistry.createItem("bladeIron", { name: "Iron blade", icon: "rotor_blade_iron" });
ItemRegistry.createItem("bladeSteel", { name: "Steel blade", icon: "rotor_blade_steel" });
ItemRegistry.createItem("bladeCarbon", { name: "Carbon blade", icon: "rotor_blade_carbon" });
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
ItemRegistry.createItem("shaftIron", { name: "Iron shaft", icon: "shaft_iron" });
ItemRegistry.createItem("shaftSteel", { name: "Steel shaft", icon: "shaft_steel" });
Item.addCreativeGroup("shaft", Translation.translate("Shafts"), [
    ItemID.shaftIron,
    ItemID.shaftSteel,
]);
var ItemSeedBag = /** @class */ (function (_super) {
    __extends(ItemSeedBag, _super);
    function ItemSeedBag() {
        var _this = _super.call(this, "cropSeedBag", "crop_seed_bag", "crop_seed_bag", false) || this;
        _this.setMaxStack(1);
        return _this;
    }
    ItemSeedBag.prototype.onNameOverride = function (item, name) {
        var extra = item.extra || new ItemExtraData();
        var scanLvl = extra.getInt("scan");
        var cropClassName = scanLvl > 0 ? Agriculture.CropCardManager.getCropCardByIndex(item.data).getID() : "Unknown";
        var translatedCropName = Translation.translate(cropClassName);
        var newName = name.replace("%s", translatedCropName) + '\n';
        if (scanLvl >= 4) {
            newName += "\u00A72Gr: " + extra.getInt("growth") + " \n";
            newName += "\u00A76Ga: " + extra.getInt("gain") + " \n";
            newName += "\u00A7bRe: " + extra.getInt("resistance");
        }
        if (Game.isDeveloperMode) {
            newName += "\n[DEBUG]scanLevel: " + scanLvl;
        }
        return newName;
    };
    ItemSeedBag.prototype.onItemUse = function (coords, item, block, player) {
        if (block.id == BlockID.crop) {
            var region = WorldRegion.getForActor(player);
            var te = region.getTileEntity(coords);
            if (!te.data.crop) {
                var extra = item.extra;
                var data = {
                    statGrowth: extra.getInt("growth"),
                    statGain: extra.getInt("gain"),
                    statResistance: extra.getInt("resistance"),
                    scanLevel: extra.getInt("scan")
                };
                var isCropPlanted = te.tryPlantIn(item.data, 1, data.statGrowth, data.statGain, data.statResistance, data.scanLevel);
                if (isCropPlanted && Game.isItemSpendingAllowed(player)) {
                    Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra);
                }
            }
        }
    };
    return ItemSeedBag;
}(ItemCommon));
ItemRegistry.registerItem(new ItemSeedBag());
Item.addCreativeGroup("cropSeedBag", Translation.translate("Seed Bags"), [ItemID.cropSeedBag]);
ItemRegistry.createItem("cropStick", { name: "crop_stick", icon: "crop_stick" });
Recipes.addShaped({ id: ItemID.cropStick, count: 2, data: 0 }, [
    "x x",
    "x x"
], ['x', 280, 0]);
Item.registerUseFunction("cropStick", function (coords, item, block, player) {
    if (block.id == 60 && coords.side == 1) {
        var region = WorldRegion.getForActor(player);
        var place = coords.relative;
        var tile = region.getBlock(place);
        if (World.canTileBeReplaced(tile.id, tile.data)) {
            region.setBlock(place, BlockID.crop, 0);
            region.addTileEntity(place);
            Entity.setCarriedItem(player, item.id, item.count - 1, 0);
        }
    }
});
ItemRegistry.createItem("fertilizer", { name: "fertilizer", icon: "fertilizer" });
ItemRegistry.createItem("weedEx", { name: "weed_ex", icon: "weed_ex", stack: 1, maxDamage: 64 });
Callback.addCallback("PreLoaded", function () {
    Recipes.addShapeless({ id: ItemID.fertilizer, count: 2, data: 0 }, [
        { id: ItemID.scrap, data: 0 },
        IDConverter.getIDData("bone_meal")
    ]);
    Recipes.addShapeless({ id: ItemID.fertilizer, count: 2, data: 0 }, [
        { id: ItemID.scrap, data: 0 },
        { id: ItemID.ashes, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.fertilizer, count: 2, data: 0 }, [
        { id: ItemID.scrap, data: 0 },
        { id: ItemID.scrap, data: 0 },
        { id: ItemID.fertilizer, data: 0 }
    ]);
    Recipes.addShaped({ id: ItemID.weedEx, count: 1, data: 0 }, [
        "z",
        "x",
        "c"
    ], ['z', 331, 0, 'x', ItemID.grinPowder, 0, 'c', ItemID.cellEmpty, 0]);
});
ItemRegistry.createItem("grinPowder", { name: "grin_powder", icon: "grin_powder" });
ItemRegistry.createItem("hops", { name: "hops", icon: "hops" });
ItemRegistry.createItem("weed", { name: "weed", icon: "weed" });
ItemRegistry.createItem("coffeeBeans", { name: "coffee_beans", icon: "coffee_beans" });
ItemRegistry.createItem("coffeePowder", { name: "coffee_powder", icon: "coffee_powder" });
Recipes.addShapeless({ id: ItemID.coffeePowder, count: 1, data: 0 }, [{ id: ItemID.coffeeBeans, data: 0 }]);
var negativePotions = [
    PotionEffect.movementSlowdown,
    PotionEffect.digSlowdown,
    PotionEffect.confusion,
    PotionEffect.blindness,
    PotionEffect.hunger,
    PotionEffect.weakness,
    PotionEffect.poison,
    PotionEffect.wither
];
var ItemTerraWart = /** @class */ (function (_super) {
    __extends(ItemTerraWart, _super);
    function ItemTerraWart() {
        var _this = _super.call(this, "terraWart", "terra_wart", "terra_wart", { saturation: "poor", canAlwaysEat: true }) || this;
        _this.setRarity(EnumRarity.RARE);
        return _this;
    }
    ItemTerraWart.prototype.onFoodEaten = function (item, food, saturation, player) {
        RadiationAPI.addRadiation(player, -600);
        for (var i in negativePotions) {
            var potionID = negativePotions[i];
            Entity.clearEffect(player, potionID);
        }
    };
    return ItemTerraWart;
}(ItemFood));
ItemRegistry.registerItem(new ItemTerraWart());
ItemRegistry.createItem("mugEmpty", { name: "stone_mug", icon: "mug_empty", stack: 1 });
Callback.addCallback("PostLoaded", function () {
    Recipes.addShaped({ id: ItemID.mugEmpty, count: 1, data: 0 }, [
        "xx ",
        "xxx",
        "xx ",
    ], ['x', 1, -1]);
});
var ItemTinCanFull = /** @class */ (function (_super) {
    __extends(ItemTinCanFull, _super);
    function ItemTinCanFull() {
        return _super.call(this, "tinCanFull", "tin_can_full", { name: "tin_can", meta: 1 }) || this;
    }
    ItemTinCanFull.prototype.onNameOverride = function (item, name) {
        if (item.data > 0) {
            return name + "\n§7" + Translation.translate("tooltip.tin_can");
        }
        return name;
    };
    ItemTinCanFull.prototype.onNoTargetUse = function (item, playerUid) {
        var player = new PlayerEntity(playerUid);
        var hunger = player.getHunger();
        var saturation = player.getSaturation();
        var count = Math.min(20 - hunger, item.count);
        if (count > 0) {
            player.setHunger(hunger + count);
            player.setSaturation(Math.min(20, saturation + count * 0.6));
            if (item.data == 1 && Math.random() < 0.2 * count) {
                Entity.addEffect(playerUid, PotionEffect.hunger, 1, 600);
            }
            if (item.data == 2) {
                Entity.addEffect(playerUid, PotionEffect.poison, 1, 80);
            }
            item.decrease(count);
            player.setCarriedItem(item);
            player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
            SoundManager.playSoundAtEntity(playerUid, "eat.ogg");
        }
    };
    return ItemTinCanFull;
}(ItemCommon));
ItemRegistry.createItem("tinCanEmpty", { name: "tin_can", icon: "tin_can" });
ItemRegistry.registerItem(new ItemTinCanFull());
var IC2Coffee;
(function (IC2Coffee) {
    var entityEffects = {};
    function amplifyEffect(entity, potionId, maxAmplifier, extraDuration) {
        var effect = entityEffects[entity];
        if (effect) {
            effect.effectTimer += extraDuration;
            if (effect.amplifier < maxAmplifier)
                effect.amplifier++;
            Entity.addEffect(entity, potionId, effect.amplifier, effect.effectTimer);
            return effect.amplifier;
        }
        Entity.addEffect(entity, potionId, 1, 300);
        entityEffects[entity] = {
            amplifier: 1,
            effectTimer: 300
        };
        return 1;
    }
    IC2Coffee.amplifyEffect = amplifyEffect;
    function coffeeEffectTick(player, isPlayerDead) {
        var effect = entityEffects[player];
        if (effect) {
            if (effect.effectTimer > 1) {
                effect.effectTimer--;
            }
            else {
                delete entityEffects[player];
            }
        }
    }
    function onDeath(entity, attacker, damageType) {
        if (EntityHelper.isPlayer(entity) && entityEffects[entity])
            return;
        delete entityEffects[entity];
    }
    function onFoodEaten(food, ratio, player) {
        var maxAmplifier = 0;
        var extraDuration = 0;
        var playerEntity = new PlayerEntity(player);
        var itemId = playerEntity.getCarriedItem().id;
        var effect = entityEffects[player];
        switch (itemId) {
            case ItemID.mugCoffee:
                maxAmplifier = 6;
                extraDuration = 1200;
                break;
            case ItemID.mugColdCoffee:
                maxAmplifier = 1;
                extraDuration = 600;
                break;
            case ItemID.mugDarkCoffee:
                maxAmplifier = 5;
                extraDuration = 1200;
                break;
            case ItemID.terraWart:
                if (effect) {
                    if (effect.amplifier < 3)
                        return;
                    effect.amplifier = 2;
                }
                return;
            case VanillaItemID.bucket:
                if (effect) {
                    delete entityEffects[player];
                }
                break;
            default: return;
        }
        var highest = 0;
        var x = amplifyEffect(player, PotionEffect.movementSpeed, maxAmplifier, extraDuration);
        if (x > highest)
            highest = x;
        x = amplifyEffect(player, PotionEffect.digSpeed, maxAmplifier, extraDuration);
        if (x > highest)
            highest = x;
        if (itemId == ItemID.mugCoffee)
            highest -= 2;
        if (highest >= 3) {
            var badEffectTime = (highest - 2) * 200;
            Entity.addEffect(player, PotionEffect.confusion, 1, badEffectTime);
            // * at this moment effect can be recreated by amplifyEffect
            entityEffects[player].effectTimer = badEffectTime;
            if (highest >= 4) {
                Entity.addEffect(player, PotionEffect.harm, highest - 3, 1);
            }
        }
        playerEntity.addItemToInventory(ItemID.mugEmpty, 1, 0);
    }
    function craftFunction(api, field, result, player) {
        for (var i = 0; i < 9; i++) {
            var item = field[i];
            var emptyItem = LiquidItemRegistry.getEmptyItem(item.id, item.data);
            if (emptyItem) {
                var playerEntity = new PlayerEntity(player);
                playerEntity.addItemToInventory(emptyItem.id, 1, emptyItem.data);
            }
            api.decreaseFieldSlot(i);
        }
    }
    IC2Coffee.craftFunction = craftFunction;
    Callback.addCallback("FoodEaten", onFoodEaten);
    Callback.addCallback("ServerPlayerTick", coffeeEffectTick);
    Callback.addCallback("EntityDeath", onDeath);
})(IC2Coffee || (IC2Coffee = {}));
ItemRegistry.createItem("mugColdCoffee", { type: "food", name: "mug_cold_coffee", icon: "mug_cold_coffee", stack: 1 });
ItemRegistry.createItem("mugDarkCoffee", { type: "food", name: "mug_dark_coffee", icon: "mug_dark_coffee", stack: 1 });
ItemRegistry.createItem("mugCoffee", { type: "food", name: "mug_coffee", icon: "mug_coffee", stack: 1 });
Item.addCreativeGroup("mug_coffee", Translation.translate("Coffee"), [
    ItemID.mugEmpty,
    ItemID.mugColdCoffee,
    ItemID.mugDarkCoffee,
    ItemID.mugCoffee
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.mugColdCoffee, count: 1, data: 0 }, [
        "x",
        "y",
        "z",
    ], ['x', ItemID.coffeePowder, 0, 'y', IDConverter.getID("water_bucket"), IDConverter.getData("water_bucket"), 'z', ItemID.mugEmpty, 0], IC2Coffee.craftFunction);
    Recipes.addShaped({ id: ItemID.mugCoffee, count: 1, data: 0 }, [
        "x",
        "y",
        "z",
    ], ['x', 353, 0, 'y', IDConverter.getID("milk_bucket"), IDConverter.getData("milk_bucket"), 'z', ItemID.mugDarkCoffee, 0], IC2Coffee.craftFunction);
    Recipes.addFurnace(ItemID.mugColdCoffee, ItemID.mugDarkCoffee, 0);
});
var ItemCable = /** @class */ (function (_super) {
    __extends(ItemCable, _super);
    function ItemCable(stringID, name, texture, maxVoltage) {
        var _this = _super.call(this, stringID, name, texture) || this;
        _this.maxVoltage = maxVoltage;
        return _this;
    }
    ItemCable.prototype.onNameOverride = function (item, name) {
        name += "\n§7" + Translation.translate("tooltip.max_voltage").replace("%s", this.maxVoltage.toString());
        return name;
    };
    ItemCable.prototype.onItemUse = function (coords, item, block, player) {
        var region = BlockSource.getDefaultForActor(player);
        var place = coords;
        if (!World.canTileBeReplaced(block.id, block.data)) {
            place = coords.relative;
            block = region.getBlock(place.x, place.y, place.z);
            if (!World.canTileBeReplaced(block.id, block.data))
                return;
        }
        region.setBlock(place.x, place.y, place.z, Block.getNumericId(this.stringID), 0);
        if (Game.isItemSpendingAllowed(player)) {
            Entity.setCarriedItem(player, item.id, item.count - 1, item.data);
        }
        EnergyGridBuilder.onWirePlaced(region, place.x, place.y, place.z);
    };
    ItemCable.createItem = function (stringID, name, texture, maxVoltage) {
        return ItemRegistry.registerItem(new this(stringID, name, texture, maxVoltage));
    };
    return ItemCable;
}(ItemCommon));
ItemCable.createItem("cableTin0", "tin_cable_0", { name: "cable_tin", meta: 0 }, 32);
ItemCable.createItem("cableTin1", "tin_cable_1", { name: "cable_tin", meta: 1 }, 32);
ItemCable.createItem("cableCopper0", "copper_cable_0", { name: "cable_copper", meta: 0 }, 128);
ItemCable.createItem("cableCopper1", "copper_cable_1", { name: "cable_copper", meta: 1 }, 128);
ItemCable.createItem("cableGold0", "gold_cable_0", { name: "cable_gold", meta: 0 }, 512);
ItemCable.createItem("cableGold1", "gold_cable_1", { name: "cable_gold", meta: 1 }, 512);
ItemCable.createItem("cableGold2", "gold_cable_2", { name: "cable_gold", meta: 2 }, 512);
ItemCable.createItem("cableIron0", "iron_cable_0", { name: "cable_iron", meta: 0 }, 2048);
ItemCable.createItem("cableIron1", "iron_cable_1", { name: "cable_iron", meta: 1 }, 2048);
ItemCable.createItem("cableIron2", "iron_cable_2", { name: "cable_iron", meta: 2 }, 2048);
ItemCable.createItem("cableIron3", "iron_cable_3", { name: "cable_iron", meta: 3 }, 2048);
ItemCable.createItem("cableOptic", "glass_cable", "cable_optic", 8192);
Item.addCreativeGroup("cableEU", Translation.translate("Cables"), [
    ItemID.cableTin0,
    ItemID.cableTin1,
    ItemID.cableCopper0,
    ItemID.cableCopper1,
    ItemID.cableGold0,
    ItemID.cableGold1,
    ItemID.cableGold2,
    ItemID.cableIron0,
    ItemID.cableIron1,
    ItemID.cableIron2,
    ItemID.cableIron3,
    ItemID.cableOptic
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.cableOptic, count: 6, data: 0 }, [
        "aaa",
        "x#x",
        "aaa"
    ], ['#', ItemID.dustSilver, 0, 'x', ItemID.dustEnergium, 0, 'a', 20, -1]);
    // cutting recipes
    ICTool.addRecipe({ id: ItemID.cableTin0, count: 2, data: 0 }, [{ id: ItemID.plateTin, data: 0 }], ItemID.cutter);
    ICTool.addRecipe({ id: ItemID.cableCopper0, count: 2, data: 0 }, [{ id: ItemID.plateCopper, data: 0 }], ItemID.cutter);
    ICTool.addRecipe({ id: ItemID.cableGold0, count: 3, data: 0 }, [{ id: ItemID.plateGold, data: 0 }], ItemID.cutter);
    // insulation recipes
    Recipes.addShapeless({ id: ItemID.cableTin1, count: 1, data: 0 }, [
        { id: ItemID.cableTin0, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableCopper1, count: 1, data: 0 }, [
        { id: ItemID.cableCopper0, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    // gold cables
    Recipes.addShapeless({ id: ItemID.cableGold1, count: 1, data: 0 }, [
        { id: ItemID.cableGold0, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableGold2, count: 1, data: 0 }, [
        { id: ItemID.cableGold1, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableGold2, count: 1, data: 0 }, [
        { id: ItemID.cableGold0, data: 0 },
        { id: ItemID.rubber, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    // high voltage cables
    Recipes.addShapeless({ id: ItemID.cableIron1, count: 1, data: 0 }, [
        { id: ItemID.cableIron0, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableIron2, count: 1, data: 0 }, [
        { id: ItemID.cableIron1, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableIron2, count: 1, data: 0 }, [
        { id: ItemID.cableIron0, data: 0 },
        { id: ItemID.rubber, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableIron3, count: 1, data: 0 }, [
        { id: ItemID.cableIron2, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableIron3, count: 1, data: 0 }, [
        { id: ItemID.cableIron1, data: 0 },
        { id: ItemID.rubber, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
    Recipes.addShapeless({ id: ItemID.cableIron3, count: 1, data: 0 }, [
        { id: ItemID.cableIron0, data: 0 },
        { id: ItemID.rubber, data: 0 },
        { id: ItemID.rubber, data: 0 },
        { id: ItemID.rubber, data: 0 }
    ]);
});
ItemRegistry.createItem("circuitBasic", { name: "electronic_circuit", icon: "circuit_basic" });
ItemRegistry.createItem("circuitAdvanced", { name: "advanced_circuit", icon: "circuit_advanced", rarity: EnumRarity.UNCOMMON });
ItemRegistry.createItem("coil", { name: "coil", icon: "coil" });
ItemRegistry.createItem("electricMotor", { name: "electric_motor", icon: "electric_motor" });
ItemRegistry.createItem("powerUnit", { name: "power_unit", icon: "power_unit" });
ItemRegistry.createItem("powerUnitSmall", { name: "small_power_unit", icon: "power_unit_small" });
ItemRegistry.createItem("heatConductor", { name: "heat_conductor", icon: "heat_conductor" });
Item.addCreativeGroup("ic2_component", Translation.translate("Crafting Components"), [
    ItemID.circuitBasic,
    ItemID.circuitAdvanced,
    ItemID.coil,
    ItemID.electricMotor,
    ItemID.powerUnit,
    ItemID.powerUnitSmall,
    ItemID.heatConductor
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.circuitBasic, count: 1, data: 0 }, [
        "xxx",
        "a#a",
        "xxx"
    ], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);
    Recipes.addShaped({ id: ItemID.circuitBasic, count: 1, data: 0 }, [
        "xax",
        "x#x",
        "xax"
    ], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);
    Recipes.addShaped({ id: ItemID.circuitAdvanced, count: 1, data: 0 }, [
        "xbx",
        "a#a",
        "xbx"
    ], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);
    Recipes.addShaped({ id: ItemID.circuitAdvanced, count: 1, data: 0 }, [
        "xax",
        "b#b",
        "xax"
    ], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);
    Recipes.addShaped({ id: ItemID.coil, count: 1, data: 0 }, [
        "aaa",
        "axa",
        "aaa"
    ], ['x', 265, 0, 'a', ItemID.cableCopper0, 0]);
    Recipes.addShaped({ id: ItemID.electricMotor, count: 1, data: 0 }, [
        " b ",
        "axa",
        " b "
    ], ['x', 265, 0, 'a', ItemID.coil, 0, 'b', ItemID.casingTin, 0]);
    Recipes.addShaped({ id: ItemID.powerUnit, count: 1, data: 0 }, [
        "acs",
        "axe",
        "acs"
    ], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0, 'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);
    Recipes.addShaped({ id: ItemID.powerUnitSmall, count: 1, data: 0 }, [
        " cs",
        "axe",
        " cs"
    ], ['x', ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0, 'a', ItemID.storageBattery, -1, 's', ItemID.casingIron, 0, 'c', ItemID.cableCopper0, 0]);
    Recipes.addShaped({ id: ItemID.heatConductor, count: 1, data: 0 }, [
        "aсa",
        "aсa",
        "aсa"
    ], ['с', ItemID.plateCopper, 0, 'a', ItemID.rubber, 0]);
});
/// <reference path="../ItemElectric.ts" />
var ItemBattery = /** @class */ (function (_super) {
    __extends(ItemBattery, _super);
    function ItemBattery(stringID, name, maxCharge, transferLimit, tier) {
        var _this = _super.call(this, stringID, name, maxCharge, transferLimit, tier, false) || this;
        _this.canProvideEnergy = true;
        ChargeItemRegistry.addToCreative(_this.id, 0);
        ChargeItemRegistry.addToCreative(_this.id, maxCharge);
        return _this;
    }
    ItemBattery.prototype.onIconOverride = function (item) {
        var data = MathUtil.setInRange(item.data, 1, 27);
        return { name: this.icon.name, meta: Math.round((27 - data) / 26 * 4) };
    };
    return ItemBattery;
}(ItemElectric));
ItemRegistry.registerItem(new ItemBattery("storageBattery", "re_battery", 10000, 100, 1));
ItemRegistry.registerItem(new ItemBattery("storageAdvBattery", "adv_re_battery", 100000, 256, 2));
ItemRegistry.registerItem(new ItemBattery("storageCrystal", "energy_crystal", 1000000, 2048, 3));
ItemRegistry.registerItem(new ItemBattery("storageLapotronCrystal", "lapotron_crystal", 10000000, 8192, 4));
ItemRegistry.setRarity("storageLapotronCrystal", EnumRarity.UNCOMMON);
Item.addCreativeGroup("batteryEU", Translation.translate("Batteries"), [
    ItemID.storageBattery,
    ItemID.storageAdvBattery,
    ItemID.storageCrystal,
    ItemID.storageLapotronCrystal
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery) }, [
        " x ",
        "c#c",
        "c#c"
    ], ['x', ItemID.cableTin1, 0, 'c', ItemID.casingTin, 0, '#', 331, 0]);
    Recipes.addShaped({ id: ItemID.storageAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.storageAdvBattery) }, [
        "xbx",
        "bab",
        "bcb"
    ], ['x', ItemID.cableCopper1, 0, 'a', ItemID.dustSulfur, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.dustLead, 0]);
    Recipes.addShaped({ id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal) }, [
        "x#x",
        "xax",
        "x#x"
    ], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
});
/// <reference path="battery.ts" />
var ItemBatteryCharging = /** @class */ (function (_super) {
    __extends(ItemBatteryCharging, _super);
    function ItemBatteryCharging() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemBatteryCharging.prototype.readMode = function (extra) {
        if (!extra)
            return 0;
        return extra.getInt("mode");
    };
    ItemBatteryCharging.prototype.onNoTargetUse = function (item, player) {
        var extra = item.extra || new ItemExtraData();
        var mode = (extra.getInt("mode") + 1) % 3;
        extra.putInt("mode", mode);
        Entity.setCarriedItem(player, item.id, 1, item.data, extra);
        var client = Network.getClientForPlayer(player);
        switch (mode) {
            case 0:
                BlockEngine.sendMessage(client, "Mode: %s", "charging.enabled");
                break;
            case 1:
                BlockEngine.sendMessage(client, "Mode: %s", "charging.not_in_hand");
                break;
            case 2:
                BlockEngine.sendMessage(client, "Mode: %s", "charging.disabled");
                break;
        }
    };
    ItemBatteryCharging.prototype.getModeTooltip = function (mode) {
        switch (mode) {
            case 0:
                return Translation.translate("Mode: %s").replace("%s", Translation.translate("charging.enabled"));
            case 1:
                return Translation.translate("Mode: %s").replace("%s", Translation.translate("charging.not_in_hand"));
            case 2:
                return Translation.translate("Mode: %s").replace("%s", Translation.translate("charging.disabled"));
        }
    };
    ItemBatteryCharging.prototype.onNameOverride = function (item, name) {
        var mode = this.readMode(item.extra);
        return _super.prototype.onNameOverride.call(this, item, name) + '\n' + this.getModeTooltip(mode);
    };
    ItemBatteryCharging.prototype.chargeItems = function (player, index, item) {
        var mode = this.readMode(item.extra);
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (mode == 2 || energyStored <= 0)
            return;
        for (var i = 0; i < 9; i++) {
            if (mode == 1 && player.getSelectedSlot() == i)
                continue;
            var stack = player.getInventorySlot(i);
            if (!ChargeItemRegistry.isValidStorage(stack.id, "Eu", 5)) {
                var energyAmount = Math.min(energyStored, this.transferLimit * 20);
                var energyAdd = ChargeItemRegistry.addEnergyTo(stack, "Eu", energyAmount, this.tier, true);
                if (energyAdd > 0) {
                    energyStored -= energyAdd;
                    player.setInventorySlot(i, stack);
                }
            }
        }
        ChargeItemRegistry.setEnergyStored(item, energyStored);
        player.setInventorySlot(index, item);
    };
    ItemBatteryCharging.checkCharging = function (playerUid) {
        var player = new PlayerEntity(playerUid);
        for (var i = 0; i < 36; i++) {
            var slot = player.getInventorySlot(i);
            var itemInstance = slot.getItemInstance();
            if (itemInstance instanceof ItemBatteryCharging) {
                itemInstance.chargeItems(player, i, slot);
            }
        }
    };
    return ItemBatteryCharging;
}(ItemBattery));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingBattery", "charging_re_battery", 40000, 128, 1));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingAdvBattery", "adv_charging_battery", 400000, 1024, 2));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingCrystal", "charging_energy_crystal", 4000000, 8192, 3));
ItemRegistry.registerItem(new ItemBatteryCharging("chargingLapotronCrystal", "charging_lapotron_crystal", 4e7, 32768, 4));
ItemRegistry.setRarity("chargingLapotronCrystal", EnumRarity.UNCOMMON);
Item.addCreativeGroup("chargingBatteryEU", Translation.translate("Charging Batteries"), [
    ItemID.chargingBattery,
    ItemID.chargingAdvBattery,
    ItemID.chargingCrystal,
    ItemID.chargingLapotronCrystal
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.chargingBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingBattery) }, [
        "xbx",
        "b b",
        "xbx"
    ], ['x', ItemID.circuitBasic, 0, 'b', ItemID.storageBattery, -1], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.chargingAdvBattery, count: 1, data: Item.getMaxDamage(ItemID.chargingAdvBattery) }, [
        "xbx",
        "b#b",
        "xbx"
    ], ['#', ItemID.chargingBattery, -1, 'x', ItemID.heatExchanger, 1, 'b', ItemID.storageAdvBattery, -1], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.chargingCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingCrystal) }, [
        "xbx",
        "b#b",
        "xbx"
    ], ['#', ItemID.chargingAdvBattery, -1, 'x', ItemID.heatExchangerComponent, 1, 'b', ItemID.storageCrystal, -1], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.chargingLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.chargingLapotronCrystal) }, [
        "xbx",
        "b#b",
        "xbx"
    ], ['#', ItemID.chargingCrystal, -1, 'x', ItemID.heatExchangerAdv, 1, 'b', ItemID.storageLapotronCrystal, -1], ChargeItemRegistry.transferEnergy);
});
Callback.addCallback("ServerPlayerTick", function (playerUid, isPlayerDead) {
    if (World.getThreadTime() % 20 == 0 && !isPlayerDead) {
        ItemBatteryCharging.checkCharging(playerUid);
    }
});
var UpgradeModule = /** @class */ (function (_super) {
    __extends(UpgradeModule, _super);
    function UpgradeModule(stringID, name, type) {
        var _this = _super.call(this, stringID, name + "_upgrade", "upgrade_" + name) || this;
        if (type)
            _this.type = type;
        UpgradeAPI.registerUpgrade(_this.id, _this);
        return _this;
    }
    return UpgradeModule;
}(ItemCommon));
/// <reference path="UpgradeModule.ts" />
var UpgradeTransporting = /** @class */ (function (_super) {
    __extends(UpgradeTransporting, _super);
    function UpgradeTransporting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpgradeTransporting.prototype.onNameOverride = function (item, name) {
        var sideName = Translation.translate(this.getSideName(item.data - 1));
        var tooltip = Translation.translate(this.getTooltip()).replace("%s", sideName);
        return name + "§7\n" + tooltip;
    };
    UpgradeTransporting.prototype.getSideName = function (side) {
        switch (side) {
            case 0:
                return "ic2.dir.bottom";
            case 1:
                return "ic2.dir.top";
            case 2:
                return "ic2.dir.north";
            case 3:
                return "ic2.dir.south";
            case 4: {
                return "ic2.dir.east";
            }
            case 5: {
                return "ic2.dir.west";
            }
            default: {
                return "tooltip.upgrade.anyside";
            }
        }
    };
    UpgradeTransporting.prototype.getTooltip = function () {
        return "";
    };
    UpgradeTransporting.prototype.onIconOverride = function (item) {
        return { name: this.icon.name, meta: item.data };
    };
    UpgradeTransporting.prototype.onItemUse = function (coords, item, block, player) {
        if (item.data == 0) {
            Entity.setCarriedItem(player, this.id, item.count, coords.side + 1);
        }
        else {
            Entity.setCarriedItem(player, this.id, item.count, 0);
        }
    };
    return UpgradeTransporting;
}(UpgradeModule));
var UpgradeEnergyStorage = /** @class */ (function (_super) {
    __extends(UpgradeEnergyStorage, _super);
    function UpgradeEnergyStorage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "energyStorage";
        return _this;
    }
    UpgradeEnergyStorage.prototype.onNameOverride = function (item, name) {
        var capacity = this.getExtraEnergyStorage(item);
        return name + "§7\n" + Translation.translate("tooltip.upgrade.storage").replace("%s", ItemName.displayEnergy(capacity, false));
    };
    UpgradeEnergyStorage.prototype.getExtraEnergyStorage = function (item) {
        return 10000;
    };
    return UpgradeEnergyStorage;
}(UpgradeModule));
var UpgradeOverclocker = /** @class */ (function (_super) {
    __extends(UpgradeOverclocker, _super);
    function UpgradeOverclocker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "overclocker";
        return _this;
    }
    UpgradeOverclocker.prototype.onNameOverride = function (item, name) {
        var percent = "%%"; // it's one % in name
        if (BlockEngine.getMainGameVersion() == 11)
            percent += "%%";
        if (ToolHUD.currentUIscreen == "in_game_play_screen" || ToolHUD.currentUIscreen == "world_loading_progress_screen - local_world_load") {
            percent += percent; // this game is broken
        }
        var energyDemandPercent = this.getEnergyDemandMultiplier(item) * 100 + percent;
        var powerPercent = this.getProcessTimeMultiplier(item) * 100 + percent;
        var timeTooltip = Translation.translate("tooltip.upgrade.overclocker.time") + energyDemandPercent;
        var powerTooltip = Translation.translate("tooltip.upgrade.overclocker.power") + powerPercent;
        return name + "§7\n" + timeTooltip + "\n" + powerTooltip;
    };
    UpgradeOverclocker.prototype.getSpeedModifier = function (item) {
        return 1;
    };
    UpgradeOverclocker.prototype.getEnergyDemandMultiplier = function (item) {
        return 1.6;
    };
    UpgradeOverclocker.prototype.getProcessTimeMultiplier = function (item) {
        return 0.7;
    };
    return UpgradeOverclocker;
}(UpgradeModule));
/// <reference path="UpgradeTransporting.ts" />
var UpgradeEjector = /** @class */ (function (_super) {
    __extends(UpgradeEjector, _super);
    function UpgradeEjector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "itemEjector";
        return _this;
    }
    UpgradeEjector.prototype.getTooltip = function () {
        return "tooltip.upgrade.ejector";
    };
    UpgradeEjector.prototype.onTick = function (item, machine) {
        var checkSide = item.data - 1;
        var machineStorage = StorageInterface.getInterface(machine);
        for (var side = 0; side < 6; side++) {
            if (checkSide > 0 && checkSide != side)
                continue;
            var storage = StorageInterface.getNeighbourStorage(machine.blockSource, machine, side);
            if (storage)
                StorageInterface.extractItemsFromStorage(storage, machineStorage, side);
        }
    };
    return UpgradeEjector;
}(UpgradeTransporting));
/// <reference path="UpgradeTransporting.ts" />
var UpgradeFluidPulling = /** @class */ (function (_super) {
    __extends(UpgradeFluidPulling, _super);
    function UpgradeFluidPulling() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "fluidPulling";
        return _this;
    }
    UpgradeFluidPulling.prototype.getTooltip = function () {
        return "tooltip.upgrade.pulling";
    };
    UpgradeFluidPulling.prototype.onTick = function (item, machine) {
        var _a;
        var machineStorage = StorageInterface.getInterface(machine);
        var checkSide = item.data - 1;
        for (var side = 0; side < 6; side++) {
            if (checkSide > 0 && checkSide != side)
                continue;
            var liquid = (_a = machineStorage.getInputTank(side)) === null || _a === void 0 ? void 0 : _a.getLiquidStored();
            var storage = StorageInterface.getNeighbourLiquidStorage(machine.blockSource, machine, side);
            if (storage)
                StorageInterface.extractLiquid(liquid, 0.25, machineStorage, storage, side);
        }
    };
    return UpgradeFluidPulling;
}(UpgradeTransporting));
/// <reference path="UpgradeTransporting.ts" />
var UpgradePulling = /** @class */ (function (_super) {
    __extends(UpgradePulling, _super);
    function UpgradePulling() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "itemPulling";
        return _this;
    }
    UpgradePulling.prototype.getTooltip = function () {
        return "tooltip.upgrade.pulling";
    };
    UpgradePulling.prototype.onTick = function (item, machine) {
        if (World.getThreadTime() % 20 == 0) {
            var checkSide = item.data - 1;
            var machineStorage = StorageInterface.getInterface(machine);
            for (var side = 0; side < 6; side++) {
                if (checkSide > 0 && checkSide != side)
                    continue;
                var storage = StorageInterface.getNeighbourStorage(machine.blockSource, machine, side);
                if (storage)
                    StorageInterface.extractItemsFromStorage(machineStorage, storage, side);
            }
        }
    };
    return UpgradePulling;
}(UpgradeTransporting));
var UpgradeTransformer = /** @class */ (function (_super) {
    __extends(UpgradeTransformer, _super);
    function UpgradeTransformer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "transformer";
        return _this;
    }
    UpgradeTransformer.prototype.onNameOverride = function (item, name) {
        return name + "§7\n" + Translation.translate("tooltip.upgrade.transformer");
    };
    UpgradeTransformer.prototype.getExtraTier = function (item) {
        return 1;
    };
    return UpgradeTransformer;
}(UpgradeModule));
/// <reference path="UpgradeTransporting.ts" />
var UpgradeFluidEjector = /** @class */ (function (_super) {
    __extends(UpgradeFluidEjector, _super);
    function UpgradeFluidEjector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "fluidEjector";
        return _this;
    }
    UpgradeFluidEjector.prototype.getTooltip = function () {
        return "tooltip.upgrade.ejector";
    };
    UpgradeFluidEjector.prototype.onTick = function (item, machine) {
        var _a;
        var machineStorage = StorageInterface.getInterface(machine);
        var checkSide = item.data - 1;
        for (var side = 0; side < 6; side++) {
            if (checkSide > 0 && checkSide != side)
                continue;
            var liquid = (_a = machineStorage.getOutputTank(side)) === null || _a === void 0 ? void 0 : _a.getLiquidStored();
            if (!liquid)
                continue;
            var storage = StorageInterface.getNeighbourLiquidStorage(machine.blockSource, machine, side);
            if (storage)
                StorageInterface.transportLiquid(liquid, 0.25, machineStorage, storage, side);
        }
    };
    return UpgradeFluidEjector;
}(UpgradeTransporting));
/// <reference path="UpgradeOverclocker.ts" />
/// <reference path="UpgradeTransformer.ts" />
/// <reference path="UpgradeEnergyStorage.ts" />
/// <reference path="UpgradeEjector.ts" />
/// <reference path="UpgradePulling.ts" />
/// <reference path="UpgradeFluidEjector.ts" />
/// <reference path="UpgradeFluidPulling.ts" />
ItemRegistry.registerItem(new UpgradeOverclocker("upgradeOverclocker", "overclocker"));
ItemRegistry.registerItem(new UpgradeTransformer("upgradeTransformer", "transformer"));
ItemRegistry.registerItem(new UpgradeEnergyStorage("upgradeEnergyStorage", "energy_storage"));
ItemRegistry.registerItem(new UpgradeModule("upgradeRedstone", "redstone_inv", "redstone"));
ItemRegistry.registerItem(new UpgradeEjector("upgradeEjector", "ejector"));
ItemRegistry.registerItem(new UpgradePulling("upgradePulling", "pulling"));
ItemRegistry.registerItem(new UpgradeFluidEjector("upgradeFluidEjector", "fluid_ejector"));
ItemRegistry.registerItem(new UpgradeFluidPulling("upgradeFluidPulling", "fluid_pulling"));
Item.addCreativeGroup("ic2_upgrade", Translation.translate("Machine Upgrades"), [
    ItemID.upgradeOverclocker,
    ItemID.upgradeTransformer,
    ItemID.upgradeEnergyStorage,
    ItemID.upgradeRedstone,
    ItemID.upgradeEjector,
    ItemID.upgradePulling,
    ItemID.upgradeFluidEjector,
    ItemID.upgradeFluidPulling
]);
Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID.upgradeOverclocker, count: 2, data: 0 }, [
        "aaa",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell, 1]);
    Recipes.addShaped({ id: ItemID.upgradeOverclocker, count: 6, data: 0 }, [
        "aaa",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell3, 1]);
    Recipes.addShaped({ id: ItemID.upgradeOverclocker, count: 12, data: 0 }, [
        "aaa",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', ItemID.coolantCell6, 1]);
    Recipes.addShaped({ id: ItemID.upgradeTransformer, count: 1, data: 0 }, [
        "aaa",
        "x#x",
        "aca"
    ], ['#', BlockID.transformerMV, 0, 'x', ItemID.cableGold2, -1, 'a', 20, -1, 'c', ItemID.circuitBasic, -1]);
    Recipes.addShaped({ id: ItemID.upgradeEnergyStorage, count: 1, data: 0 }, [
        "aaa",
        "x#x",
        "aca"
    ], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, -1, 'a', 5, -1, 'c', ItemID.circuitBasic, -1]);
    Recipes.addShaped({ id: ItemID.upgradeRedstone, count: 1, data: 0 }, [
        "x x",
        " # ",
        "x x",
    ], ['x', ItemID.plateTin, -1, '#', 69, -1]);
    Recipes.addShaped({ id: ItemID.upgradeEjector, count: 1, data: 0 }, [
        "aba",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 33, -1, 'b', 410, 0]);
    Recipes.addShaped({ id: ItemID.upgradePulling, count: 1, data: 0 }, [
        "aba",
        "x#x",
    ], ['#', ItemID.circuitBasic, -1, 'x', ItemID.cableCopper1, -1, 'a', 29, -1, 'b', 410, 0]);
    Recipes.addShaped({ id: ItemID.upgradeFluidEjector, count: 1, data: 0 }, [
        "x x",
        " # ",
        "x x",
    ], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1]);
    Recipes.addShaped({ id: ItemID.upgradeFluidPulling, count: 1, data: 0 }, [
        "xcx",
        " # ",
        "x x",
    ], ['x', ItemID.plateTin, -1, '#', ItemID.electricMotor, -1, 'c', ItemID.treetap, 0]);
});
var ReactorItem;
(function (ReactorItem) {
    var reactor_components = {};
    function registerComponent(id, component) {
        if (component instanceof ReactorItem.DamageableReactorComponent) {
            Item.setMaxDamage(id, 27);
        }
        reactor_components[id] = component;
    }
    ReactorItem.registerComponent = registerComponent;
    function getComponent(id) {
        return reactor_components[id];
    }
    ReactorItem.getComponent = getComponent;
    function isReactorItem(id) {
        return !!getComponent(id);
    }
    ReactorItem.isReactorItem = isReactorItem;
    var ReactorSlotCoord = /** @class */ (function () {
        function ReactorSlotCoord(item, x, y) {
            this.item = item;
            this.x = x;
            this.y = y;
        }
        ReactorSlotCoord.prototype.getComponent = function () {
            return getComponent(this.item.id);
        };
        return ReactorSlotCoord;
    }());
    ReactorItem.ReactorSlotCoord = ReactorSlotCoord;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="ReactorItem.ts" />
var ReactorItem;
(function (ReactorItem) {
    var ReactorComponent = /** @class */ (function () {
        function ReactorComponent() {
        }
        ReactorComponent.prototype.processChamber = function (item, reactor, x, y, heatrun) { };
        ReactorComponent.prototype.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            return false;
        };
        ReactorComponent.prototype.canStoreHeat = function (item) {
            return false;
        };
        ReactorComponent.prototype.getMaxHeat = function (item) {
            return 0;
        };
        ReactorComponent.prototype.getCurrentHeat = function (item) {
            return 0;
        };
        ReactorComponent.prototype.alterHeat = function (item, reactor, x, y, heat) {
            return heat;
        };
        ReactorComponent.prototype.influenceExplosion = function (item, reactor) {
            return 0;
        };
        return ReactorComponent;
    }());
    ReactorItem.ReactorComponent = ReactorComponent;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="ReactorComponent.ts" />
var ReactorItem;
(function (ReactorItem) {
    var DamageableReactorComponent = /** @class */ (function (_super) {
        __extends(DamageableReactorComponent, _super);
        function DamageableReactorComponent(durability) {
            var _this = _super.call(this) || this;
            _this.maxDamage = durability;
            return _this;
        }
        DamageableReactorComponent.prototype.getCustomDamage = function (item) {
            return item.extra ? item.extra.getInt("damage") : 0;
        };
        DamageableReactorComponent.prototype.setCustomDamage = function (item, damage) {
            var extra = item.extra || new ItemExtraData();
            extra.putInt("damage", damage);
            var data = 1 + Math.ceil(damage / this.maxDamage * 26);
            item.set(item.id, item.count, data, extra);
        };
        DamageableReactorComponent.prototype.applyCustomDamage = function (item, damage) {
            this.setCustomDamage(item, this.getCustomDamage(item) + damage);
        };
        return DamageableReactorComponent;
    }(ReactorItem.ReactorComponent));
    ReactorItem.DamageableReactorComponent = DamageableReactorComponent;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="DamageableReactorComponent.ts" />
var ReactorItem;
(function (ReactorItem) {
    var Condensator = /** @class */ (function (_super) {
        __extends(Condensator, _super);
        function Condensator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Condensator.prototype.canStoreHeat = function (item) {
            return this.getCurrentHeat(item) < this.maxDamage;
        };
        Condensator.prototype.getMaxHeat = function (item) {
            return this.maxDamage;
        };
        Condensator.prototype.getCurrentHeat = function (item) {
            return this.getCustomDamage(item);
        };
        Condensator.prototype.alterHeat = function (item, reactor, x, y, heat) {
            if (heat < 0) {
                return heat;
            }
            var currentHeat = this.getCurrentHeat(item);
            var amount = Math.min(heat, this.getMaxHeat(item) - currentHeat);
            this.setCustomDamage(item, currentHeat + amount);
            return heat - amount;
        };
        return Condensator;
    }(ReactorItem.DamageableReactorComponent));
    ReactorItem.Condensator = Condensator;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="DamageableReactorComponent.ts" />
var ReactorItem;
(function (ReactorItem) {
    var FuelRod = /** @class */ (function (_super) {
        __extends(FuelRod, _super);
        function FuelRod(cells, durability) {
            var _this = _super.call(this, durability) || this;
            _this.numberOfCells = cells;
            return _this;
        }
        FuelRod.prototype.getDepletedItem = function () {
            switch (this.numberOfCells) {
                case 1: return ItemID.fuelRodDepletedUranium;
                case 2: return ItemID.fuelRodDepletedUranium2;
                case 4: return ItemID.fuelRodDepletedUranium4;
            }
        };
        FuelRod.prototype.processChamber = function (item, reactor, x, y, heatrun) {
            var basePulses = Math.floor(1 + this.numberOfCells / 2);
            for (var i = 0; i < this.numberOfCells; i++) {
                var dheat = 0;
                var pulses = basePulses;
                if (!heatrun) {
                    for (var i_1 = 0; i_1 < pulses; i_1++) {
                        this.acceptUraniumPulse(item, reactor, item, x, y, x, y, heatrun);
                    }
                    pulses += (this.checkPulseable(reactor, x - 1, y, item, x, y, heatrun) +
                        this.checkPulseable(reactor, x + 1, y, item, x, y, heatrun) +
                        this.checkPulseable(reactor, x, y - 1, item, x, y, heatrun) +
                        this.checkPulseable(reactor, x, y + 1, item, x, y, heatrun));
                    continue;
                }
                pulses += (this.checkPulseable(reactor, x - 1, y, item, x, y, heatrun) +
                    this.checkPulseable(reactor, x + 1, y, item, x, y, heatrun) +
                    this.checkPulseable(reactor, x, y - 1, item, x, y, heatrun) +
                    this.checkPulseable(reactor, x, y + 1, item, x, y, heatrun));
                var heat = this.triangularNumber(pulses) * 4;
                var heatAcceptors = [];
                this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
                heat = this.getFinalHeat(item, reactor, x, y, heat);
                for (var j = 0; j < heatAcceptors.length; j++) {
                    heat += dheat;
                    if (heat <= 0)
                        break;
                    dheat = heat / (heatAcceptors.length - j);
                    heat -= dheat;
                    var acceptor = heatAcceptors[j];
                    var component = acceptor.getComponent();
                    dheat = component.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, dheat);
                }
                if (heat <= 0)
                    continue;
                reactor.addHeat(heat);
            }
            if (!heatrun && this.getCustomDamage(item) + 1 >= this.maxDamage) {
                reactor.setItemAt(x, y, this.getDepletedItem(), 1, 0);
            }
            else if (!heatrun) {
                this.applyCustomDamage(item, 1);
            }
        };
        FuelRod.prototype.checkPulseable = function (reactor, x, y, slot, meX, meY, heatrun) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorItem.getComponent(item.id);
                if (component && component.acceptUraniumPulse(item, reactor, slot, x, y, meX, meY, heatrun)) {
                    return 1;
                }
            }
            return 0;
        };
        FuelRod.prototype.triangularNumber = function (x) {
            return (x * x + x) / 2;
        };
        FuelRod.prototype.checkHeatAcceptor = function (reactor, x, y, heatAcceptors) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorItem.getComponent(item.id);
                if (component && component.canStoreHeat(item)) {
                    var acceptor = new ReactorItem.ReactorSlotCoord(item, x, y);
                    heatAcceptors.push(acceptor);
                }
            }
        };
        FuelRod.prototype.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                reactor.addOutput(1);
            }
            return true;
        };
        FuelRod.prototype.getFinalHeat = function (item, reactor, x, y, heat) {
            return heat;
        };
        FuelRod.prototype.influenceExplosion = function (item, reactor) {
            return 2 * this.numberOfCells;
        };
        return FuelRod;
    }(ReactorItem.DamageableReactorComponent));
    ReactorItem.FuelRod = FuelRod;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="FuelRod.ts" />
var ReactorItem;
(function (ReactorItem) {
    var FuelRodMOX = /** @class */ (function (_super) {
        __extends(FuelRodMOX, _super);
        function FuelRodMOX() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FuelRodMOX.prototype.getDepletedItem = function () {
            switch (this.numberOfCells) {
                case 1: return ItemID.fuelRodDepletedMOX;
                case 2: return ItemID.fuelRodDepletedMOX2;
                case 4: return ItemID.fuelRodDepletedMOX4;
            }
        };
        FuelRodMOX.prototype.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var effectiveness = reactor.getHeat() / reactor.getMaxHeat();
                var output = 4 * effectiveness + 1;
                reactor.addOutput(output);
            }
            return true;
        };
        FuelRodMOX.prototype.getFinalHeat = function (item, reactor, x, y, heat) {
            if (reactor.isFluidCooled() && reactor.getHeat() / reactor.getMaxHeat() > 0.5) {
                heat *= 2;
            }
            return heat;
        };
        return FuelRodMOX;
    }(ReactorItem.FuelRod));
    ReactorItem.FuelRodMOX = FuelRodMOX;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="DamageableReactorComponent.ts" />
var ReactorItem;
(function (ReactorItem) {
    var HeatStorage = /** @class */ (function (_super) {
        __extends(HeatStorage, _super);
        function HeatStorage(heatStorage) {
            return _super.call(this, heatStorage) || this;
        }
        HeatStorage.prototype.canStoreHeat = function (item) {
            return true;
        };
        HeatStorage.prototype.getMaxHeat = function (item) {
            return this.maxDamage;
        };
        HeatStorage.prototype.getCurrentHeat = function (item) {
            return this.getCustomDamage(item);
        };
        HeatStorage.prototype.alterHeat = function (item, reactor, x, y, heat) {
            var myHeat = this.getCurrentHeat(item);
            var max = this.getMaxHeat(item);
            if ((myHeat += heat) > max) {
                reactor.setItemAt(x, y, 0, 0, 0);
                heat = max - myHeat + 1;
            }
            else {
                if (myHeat < 0) {
                    heat = myHeat;
                    myHeat = 0;
                }
                else {
                    heat = 0;
                }
                this.setCustomDamage(item, myHeat);
            }
            return heat;
        };
        return HeatStorage;
    }(ReactorItem.DamageableReactorComponent));
    ReactorItem.HeatStorage = HeatStorage;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="HeatStorage.ts" />
var ReactorItem;
(function (ReactorItem) {
    var HeatExchanger = /** @class */ (function (_super) {
        __extends(HeatExchanger, _super);
        function HeatExchanger(heatStorage, switchSide, switchReactor) {
            var _this = _super.call(this, heatStorage) || this;
            _this.switchSide = switchSide;
            _this.switchReactor = switchReactor;
            return _this;
        }
        HeatExchanger.prototype.processChamber = function (item, reactor, x, y, heatrun) {
            if (!heatrun) {
                return;
            }
            var myHeat = 0;
            var heatAcceptors = [];
            if (this.switchSide > 0) {
                this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
                for (var i in heatAcceptors) {
                    var acceptor = heatAcceptors[i];
                    var heatable = acceptor.getComponent();
                    var mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
                    var heatablemed = heatable.getCurrentHeat(acceptor.item) * 100 / heatable.getMaxHeat(acceptor.item);
                    var add = Math.floor(heatable.getMaxHeat(acceptor.item) / 100 * (heatablemed + mymed / 2));
                    if (add > this.switchSide) {
                        add = this.switchSide;
                    }
                    if (heatablemed + mymed / 2 < 1) {
                        add = this.switchSide / 2;
                    }
                    if (heatablemed + mymed / 2 < 0.75) {
                        add = this.switchSide / 4;
                    }
                    if (heatablemed + mymed / 2 < 0.5) {
                        add = this.switchSide / 8;
                    }
                    if (heatablemed + mymed / 2 < 0.25) {
                        add = 1;
                    }
                    if (Math.round(heatablemed * 10) / 10 > Math.round(mymed * 10) / 10) {
                        add -= 2 * add;
                    }
                    else if (Math.round(heatablemed * 10) / 10 == Math.round(mymed * 10) / 10) {
                        add = 0;
                    }
                    myHeat -= add;
                    add = heatable.alterHeat(acceptor.item, reactor, acceptor.x, acceptor.y, add);
                    myHeat += add;
                }
            }
            if (this.switchReactor > 0) {
                var mymed = this.getCurrentHeat(item) * 100 / this.getMaxHeat(item);
                var Reactormed = reactor.getHeat() * 100 / reactor.getMaxHeat();
                var add = Math.round(reactor.getMaxHeat() / 100 * (Reactormed + mymed / 2));
                if (add > this.switchReactor) {
                    add = this.switchReactor;
                }
                if (Reactormed + mymed / 2 < 1) {
                    add = this.switchSide / 2;
                }
                if (Reactormed + mymed / 2 < 0.75) {
                    add = this.switchSide / 4;
                }
                if (Reactormed + mymed / 2 < 0.5) {
                    add = this.switchSide / 8;
                }
                if (Reactormed + mymed / 2 < 0.25) {
                    add = 1;
                }
                if (Math.round(Reactormed * 10) / 10 > Math.round(mymed * 10) / 10) {
                    add -= 2 * add;
                }
                else if (Math.round(Reactormed * 10) / 10 == Math.round(mymed * 10) / 10) {
                    add = 0;
                }
                myHeat -= add;
                reactor.setHeat(reactor.getHeat() + add);
            }
            this.alterHeat(item, reactor, x, y, myHeat);
        };
        HeatExchanger.prototype.checkHeatAcceptor = function (reactor, x, y, heatAcceptors) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorItem.getComponent(item.id);
                if (component && component.canStoreHeat(item)) {
                    var acceptor = new ReactorItem.ReactorSlotCoord(item, x, y);
                    heatAcceptors.push(acceptor);
                }
            }
        };
        return HeatExchanger;
    }(ReactorItem.HeatStorage));
    ReactorItem.HeatExchanger = HeatExchanger;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="HeatStorage.ts" />
var ReactorItem;
(function (ReactorItem) {
    var HeatVent = /** @class */ (function (_super) {
        __extends(HeatVent, _super);
        function HeatVent(heatStorage, selfVent, reactorVent) {
            var _this = _super.call(this, heatStorage) || this;
            _this.selfVent = selfVent;
            _this.reactorVent = reactorVent;
            return _this;
        }
        HeatVent.prototype.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                if (this.reactorVent > 0) {
                    var rheat = reactor.getHeat();
                    var reactorDrain = rheat;
                    if (reactorDrain > this.reactorVent) {
                        reactorDrain = this.reactorVent;
                    }
                    rheat -= reactorDrain;
                    if ((reactorDrain = this.alterHeat(item, reactor, x, y, reactorDrain)) > 0) {
                        return;
                    }
                    reactor.setHeat(rheat);
                }
                var self = this.alterHeat(item, reactor, x, y, -this.selfVent);
                if (self <= 0) {
                    reactor.addEmitHeat(self + this.selfVent);
                }
            }
        };
        return HeatVent;
    }(ReactorItem.HeatStorage));
    ReactorItem.HeatVent = HeatVent;
    var HeatVentSpread = /** @class */ (function (_super) {
        __extends(HeatVentSpread, _super);
        function HeatVentSpread(sideVent) {
            var _this = _super.call(this) || this;
            _this.sideVent = sideVent;
            return _this;
        }
        HeatVentSpread.prototype.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                this.cool(reactor, x - 1, y);
                this.cool(reactor, x + 1, y);
                this.cool(reactor, x, y - 1);
                this.cool(reactor, x, y + 1);
            }
        };
        HeatVentSpread.prototype.cool = function (reactor, x, y) {
            var item = reactor.getItemAt(x, y);
            if (item) {
                var component = ReactorItem.getComponent(item.id);
                if (component && component.canStoreHeat(item)) {
                    var self = component.alterHeat(item, reactor, x, y, -this.sideVent);
                    reactor.addEmitHeat(self + this.sideVent);
                }
            }
        };
        return HeatVentSpread;
    }(ReactorItem.ReactorComponent));
    ReactorItem.HeatVentSpread = HeatVentSpread;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="DamageableReactorComponent.ts" />
var ReactorItem;
(function (ReactorItem) {
    var Reflector = /** @class */ (function (_super) {
        __extends(Reflector, _super);
        function Reflector() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Reflector.prototype.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var source = ReactorItem.getComponent(pulsingItem.id);
                source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
            }
            else if (this.getCustomDamage(item) + 1 >= this.maxDamage) {
                reactor.setItemAt(youX, youY, 0, 0, 0);
            }
            else {
                this.applyCustomDamage(item, 1);
            }
            return true;
        };
        Reflector.prototype.influenceExplosion = function (item, reactor) {
            return -1;
        };
        return Reflector;
    }(ReactorItem.DamageableReactorComponent));
    ReactorItem.Reflector = Reflector;
    var ReflectorIridium = /** @class */ (function (_super) {
        __extends(ReflectorIridium, _super);
        function ReflectorIridium() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ReflectorIridium.prototype.acceptUraniumPulse = function (item, reactor, pulsingItem, youX, youY, pulseX, pulseY, heatrun) {
            if (!heatrun) {
                var source = ReactorItem.getComponent(pulsingItem.id);
                source.acceptUraniumPulse(pulsingItem, reactor, item, pulseX, pulseY, youX, youY, heatrun);
            }
            return true;
        };
        ReflectorIridium.prototype.influenceExplosion = function (item, reactor) {
            return -1;
        };
        return ReflectorIridium;
    }(ReactorItem.ReactorComponent));
    ReactorItem.ReflectorIridium = ReflectorIridium;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="ReactorComponent.ts" />
var ReactorItem;
(function (ReactorItem) {
    var Plating = /** @class */ (function (_super) {
        __extends(Plating, _super);
        function Plating(maxHeatAdd, effectModifier) {
            var _this = _super.call(this) || this;
            _this.maxHeatAdd = maxHeatAdd;
            _this.effectModifier = effectModifier;
            return _this;
        }
        Plating.prototype.processChamber = function (item, reactor, x, y, heatrun) {
            if (heatrun) {
                reactor.setMaxHeat(reactor.getMaxHeat() + this.maxHeatAdd);
                reactor.setHeatEffectModifier(reactor.getHeatEffectModifier() * this.effectModifier);
            }
        };
        Plating.prototype.influenceExplosion = function (item, reactor) {
            if (this.effectModifier >= 1) {
                return 0;
            }
            return this.effectModifier;
        };
        return Plating;
    }(ReactorItem.ReactorComponent));
    ReactorItem.Plating = Plating;
})(ReactorItem || (ReactorItem = {}));
/// <reference path="api/FuelRod.ts" />
/// <reference path="api/FuelRodMox.ts" />
ItemRegistry.createItem("fuelRod", { name: "fuel_rod", icon: "fuel_rod" });
ItemRegistry.createItem("fuelRodUranium", { name: "uranium_fuel_rod", icon: { name: "fuel_rod_uranium", meta: 0 } });
ItemRegistry.createItem("fuelRodUranium2", { name: "dual_uranium_fuel_rod", icon: { name: "fuel_rod_uranium", meta: 1 }, stack: 32 });
ItemRegistry.createItem("fuelRodUranium4", { name: "quad_uranium_fuel_rod", icon: { name: "fuel_rod_uranium", meta: 2 }, stack: 16 });
ReactorItem.registerComponent(ItemID.fuelRodUranium, new ReactorItem.FuelRod(1, 20000));
ReactorItem.registerComponent(ItemID.fuelRodUranium2, new ReactorItem.FuelRod(2, 20000));
ReactorItem.registerComponent(ItemID.fuelRodUranium4, new ReactorItem.FuelRod(4, 20000));
RadiationAPI.setRadioactivity(ItemID.fuelRodUranium, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodUranium2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodUranium4, 10);
ItemRegistry.createItem("fuelRodMOX", { name: "mox_fuel_rod", icon: { name: "fuel_rod_mox", meta: 0 } });
ItemRegistry.createItem("fuelRodMOX2", { name: "dual_mox_fuel_rod", icon: { name: "fuel_rod_mox", meta: 1 }, stack: 32 });
ItemRegistry.createItem("fuelRodMOX4", { name: "quad_mox_fuel_rod", icon: { name: "fuel_rod_mox", meta: 2 }, stack: 16 });
ReactorItem.registerComponent(ItemID.fuelRodMOX, new ReactorItem.FuelRodMOX(1, 10000));
ReactorItem.registerComponent(ItemID.fuelRodMOX2, new ReactorItem.FuelRodMOX(2, 10000));
ReactorItem.registerComponent(ItemID.fuelRodMOX4, new ReactorItem.FuelRodMOX(4, 10000));
RadiationAPI.setRadioactivity(ItemID.fuelRodMOX, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodMOX2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodMOX4, 10);
ItemRegistry.createItem("fuelRodDepletedUranium", { name: "depleted_uranium_fuel_rod", icon: { name: "fuel_rod_depleted_uranium", meta: 0 } });
ItemRegistry.createItem("fuelRodDepletedUranium2", { name: "depleted_dual_uranium_fuel_rod", icon: { name: "fuel_rod_depleted_uranium", meta: 1 }, stack: 32 });
ItemRegistry.createItem("fuelRodDepletedUranium4", { name: "depleted_quad_uranium_fuel_rod", icon: { name: "fuel_rod_depleted_uranium", meta: 2 }, stack: 16 });
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedUranium, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedUranium2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedUranium4, 10);
ItemRegistry.createItem("fuelRodDepletedMOX", { name: "depleted_mox_fuel_rod", icon: { name: "fuel_rod_depleted_mox", meta: 0 } });
ItemRegistry.createItem("fuelRodDepletedMOX2", { name: "depleted_dual_mox_fuel_rod", icon: { name: "fuel_rod_depleted_mox", meta: 1 }, stack: 32 });
ItemRegistry.createItem("fuelRodDepletedMOX4", { name: "depleted_quad_mox_fuel_rod", icon: { name: "fuel_rod_depleted_mox", meta: 2 }, stack: 16 });
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedMOX, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedMOX2, 10);
RadiationAPI.setRadioactivity(ItemID.fuelRodDepletedMOX4, 10);
Item.addCreativeGroup("ic2_fuelRod", Translation.translate("Nuclear Fuel Rods"), [
    ItemID.fuelRod,
    ItemID.fuelRodUranium,
    ItemID.fuelRodUranium2,
    ItemID.fuelRodUranium4,
    ItemID.fuelRodMOX,
    ItemID.fuelRodMOX2,
    ItemID.fuelRodMOX4,
    ItemID.fuelRodDepletedUranium,
    ItemID.fuelRodDepletedUranium2,
    ItemID.fuelRodDepletedUranium4,
    ItemID.fuelRodDepletedMOX,
    ItemID.fuelRodDepletedMOX2,
    ItemID.fuelRodDepletedMOX4
]);
Recipes.addShaped({ id: ItemID.fuelRodUranium2, count: 1, data: 0 }, [
    "fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodUranium, 0]);
Recipes.addShaped({ id: ItemID.fuelRodUranium4, count: 1, data: 0 }, [
    " f ",
    "bab",
    " f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium2, 0]);
Recipes.addShaped({ id: ItemID.fuelRodUranium4, count: 1, data: 0 }, [
    "faf",
    "bab",
    "faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium, 0]);
Recipes.addShaped({ id: ItemID.fuelRodMOX2, count: 1, data: 0 }, [
    "fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodMOX, 0]);
Recipes.addShaped({ id: ItemID.fuelRodMOX4, count: 1, data: 0 }, [
    " f ",
    "bab",
    " f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX2, 0]);
Recipes.addShaped({ id: ItemID.fuelRodMOX4, count: 1, data: 0 }, [
    "faf",
    "bab",
    "faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX, 0]);
/// <reference path="api/Plating.ts" />
ItemRegistry.createItem("reactorPlating", { name: "reactor_plating", icon: "reactor_plating" });
ItemRegistry.createItem("reactorPlatingContainment", { name: "containment_reactor_plating", icon: "containment_reactor_plating" });
ItemRegistry.createItem("reactorPlatingHeat", { name: "heat_reactor_plating", icon: "heat_reactor_plating" });
ReactorItem.registerComponent(ItemID.reactorPlating, new ReactorItem.Plating(1000, 0.95));
ReactorItem.registerComponent(ItemID.reactorPlatingContainment, new ReactorItem.Plating(500, 0.9));
ReactorItem.registerComponent(ItemID.reactorPlatingHeat, new ReactorItem.Plating(2000, 0.99));
Item.addCreativeGroup("ic2_reactorPlating", Translation.translate("Reactor Platings"), [
    ItemID.reactorPlating,
    ItemID.reactorPlatingContainment,
    ItemID.reactorPlatingHeat
]);
Recipes.addShapeless({ id: ItemID.reactorPlating, count: 1, data: 0 }, [
    { id: ItemID.plateAlloy, data: 0 },
    { id: ItemID.plateLead, data: 0 }
]);
Recipes.addShapeless({ id: ItemID.reactorPlatingContainment, count: 1, data: 0 }, [
    { id: ItemID.reactorPlating, data: 0 },
    { id: ItemID.plateAlloy, data: 0 },
    { id: ItemID.plateAlloy, data: 0 }
]);
Recipes.addShaped({ id: ItemID.reactorPlatingHeat, count: 1, data: 0 }, [
    "aaa",
    "axa",
    "aaa"
], ['x', ItemID.reactorPlating, 0, 'a', ItemID.plateCopper, 0]);
/// <reference path="api/Reflector.ts" />
ItemRegistry.createItem("neutronReflector", { name: "neutron_reflector", icon: { name: "neutron_reflector", meta: 0 } });
ItemRegistry.createItem("neutronReflectorThick", { name: "thick_neutron_reflector", icon: { name: "neutron_reflector", meta: 1 } });
ItemRegistry.createItem("neutronReflectorIridium", { name: "iridium_neutron_reflector", icon: { name: "neutron_reflector", meta: 2 } });
ReactorItem.registerComponent(ItemID.neutronReflector, new ReactorItem.Reflector(30000));
ReactorItem.registerComponent(ItemID.neutronReflectorThick, new ReactorItem.Reflector(120000));
ReactorItem.registerComponent(ItemID.neutronReflectorIridium, new ReactorItem.ReflectorIridium());
Item.addCreativeGroup("ic2_reactorNeutronReflector", Translation.translate("Neutron Reflectors"), [
    ItemID.neutronReflector,
    ItemID.neutronReflectorThick,
    ItemID.neutronReflectorIridium
]);
Recipes.addShaped({ id: ItemID.neutronReflector, count: 1, data: 0 }, [
    "bab",
    "axa",
    "bab"
], ["x", ItemID.plateCopper, 0, 'a', ItemID.dustCoal, 0, 'b', ItemID.dustTin, 0]);
Recipes.addShaped({ id: ItemID.neutronReflectorThick, count: 1, data: 0 }, [
    "axa",
    "xax",
    "axa"
], ["x", ItemID.neutronReflector, 0, 'a', ItemID.plateCopper, 0]);
Recipes.addShaped({ id: ItemID.neutronReflectorIridium, count: 1, data: 0 }, [
    "aaa",
    "bxb",
    "aaa"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.densePlateCopper, 0]);
Recipes.addShaped({ id: ItemID.neutronReflectorIridium, count: 1, data: 0 }, [
    "aba",
    "axa",
    "aba"
], ["x", ItemID.plateReinforcedIridium, 0, 'a', ItemID.neutronReflectorThick, 0, 'b', ItemID.densePlateCopper, 0]);
/// <reference path="api/HeatStorage.ts" />
ItemRegistry.createItem("coolantCell", { name: "heat_storage", icon: { name: "heat_storage", meta: 0 }, inCreative: false });
ItemRegistry.createItem("coolantCell3", { name: "tri_heat_storage", icon: { name: "heat_storage", meta: 1 }, inCreative: false });
ItemRegistry.createItem("coolantCell6", { name: "six_heat_storage", icon: { name: "heat_storage", meta: 2 }, inCreative: false });
Item.addToCreative(ItemID.coolantCell, 1, 1);
Item.addToCreative(ItemID.coolantCell3, 1, 1);
Item.addToCreative(ItemID.coolantCell6, 1, 1);
ReactorItem.registerComponent(ItemID.coolantCell, new ReactorItem.HeatStorage(10000));
ReactorItem.registerComponent(ItemID.coolantCell3, new ReactorItem.HeatStorage(30000));
ReactorItem.registerComponent(ItemID.coolantCell6, new ReactorItem.HeatStorage(60000));
Item.addCreativeGroup("ic2_reactorCoolant", Translation.translate("Reactor Coolants"), [
    ItemID.coolantCell,
    ItemID.coolantCell3,
    ItemID.coolantCell6
]);
Recipes.addShaped({ id: ItemID.coolantCell, count: 1, data: 1 }, [
    " a ",
    "axa",
    " a ",
], ['x', ItemID.cellCoolant, 0, 'a', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.coolantCell3, count: 1, data: 1 }, [
    "aaa",
    "xxx",
    "aaa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.coolantCell3, count: 1, data: 1 }, [
    "axa",
    "axa",
    "axa",
], ['x', ItemID.coolantCell, 1, 'a', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.coolantCell6, count: 1, data: 1 }, [
    "aaa",
    "xbx",
    "aaa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);
Recipes.addShaped({ id: ItemID.coolantCell6, count: 1, data: 1 }, [
    "axa",
    "aba",
    "axa",
], ['x', ItemID.coolantCell3, 1, 'a', ItemID.plateTin, 0, 'b', ItemID.plateIron, 0]);
/// <reference path="api/HeatExchanger.ts" />
ItemRegistry.createItem("heatExchanger", { name: "heat_exchanger", icon: "heat_exchanger", inCreative: false });
ItemRegistry.createItem("heatExchangerReactor", { name: "reactor_heat_exchanger", icon: "reactor_heat_exchanger", inCreative: false });
ItemRegistry.createItem("heatExchangerComponent", { name: "component_heat_exchanger", icon: "component_heat_exchanger", inCreative: false });
ItemRegistry.createItem("heatExchangerAdv", { name: "advanced_heat_exchanger", icon: "advanced_heat_exchanger", inCreative: false });
Item.addToCreative(ItemID.heatExchanger, 1, 1);
Item.addToCreative(ItemID.heatExchangerReactor, 1, 1);
Item.addToCreative(ItemID.heatExchangerComponent, 1, 1);
Item.addToCreative(ItemID.heatExchangerAdv, 1, 1);
ReactorItem.registerComponent(ItemID.heatExchanger, new ReactorItem.HeatExchanger(2500, 12, 4));
ReactorItem.registerComponent(ItemID.heatExchangerReactor, new ReactorItem.HeatExchanger(5000, 0, 72));
ReactorItem.registerComponent(ItemID.heatExchangerComponent, new ReactorItem.HeatExchanger(5000, 36, 0));
ReactorItem.registerComponent(ItemID.heatExchangerAdv, new ReactorItem.HeatExchanger(10000, 24, 8));
Item.addCreativeGroup("ic2_reactorHeatExchanger", Translation.translate("Reactor Heat Exchangers"), [
    ItemID.heatExchanger,
    ItemID.heatExchangerReactor,
    ItemID.heatExchangerComponent,
    ItemID.heatExchangerAdv
]);
Recipes.addShaped({ id: ItemID.heatExchanger, count: 1, data: 1 }, [
    "aca",
    "bab",
    "aba"
], ['c', ItemID.circuitBasic, 0, 'a', ItemID.plateCopper, 0, 'b', ItemID.plateTin, 0]);
Recipes.addShaped({ id: ItemID.heatExchangerReactor, count: 1, data: 1 }, [
    "aaa",
    "axa",
    "aaa"
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateCopper, 0]);
Recipes.addShaped({ id: ItemID.heatExchangerComponent, count: 1, data: 1 }, [
    " a ",
    "axa",
    " a "
], ['x', ItemID.heatExchanger, 1, 'a', ItemID.plateGold, 0]);
Recipes.addShaped({ id: ItemID.heatExchangerAdv, count: 1, data: 1 }, [
    "pcp",
    "xdx",
    "pcp"
], ['x', ItemID.heatExchanger, 1, 'c', ItemID.circuitBasic, 0, 'd', ItemID.densePlateCopper, 0, 'p', ItemID.plateLapis, 0]);
/// <reference path="api/HeatVent.ts" />
ItemRegistry.createItem("heatVent", { name: "heat_vent", icon: "heat_vent", inCreative: false });
ItemRegistry.createItem("heatVentReactor", { name: "reactor_heat_vent", icon: "reactor_heat_vent", inCreative: false });
ItemRegistry.createItem("heatVentComponent", { name: "component_heat_vent", icon: "component_heat_vent", inCreative: false });
ItemRegistry.createItem("heatVentAdv", { name: "advanced_heat_vent", icon: "advanced_heat_vent", inCreative: false });
ItemRegistry.createItem("heatVentOverclocked", { name: "overclocked_heat_vent", icon: "overclocked_heat_vent", inCreative: false });
Item.addToCreative(ItemID.heatVent, 1, 1);
Item.addToCreative(ItemID.heatVentReactor, 1, 1);
Item.addToCreative(ItemID.heatVentComponent, 1, 1);
Item.addToCreative(ItemID.heatVentAdv, 1, 1);
Item.addToCreative(ItemID.heatVentOverclocked, 1, 1);
ReactorItem.registerComponent(ItemID.heatVent, new ReactorItem.HeatVent(1000, 6, 0));
ReactorItem.registerComponent(ItemID.heatVentReactor, new ReactorItem.HeatVent(1000, 5, 5));
ReactorItem.registerComponent(ItemID.heatVentComponent, new ReactorItem.HeatVentSpread(4));
ReactorItem.registerComponent(ItemID.heatVentAdv, new ReactorItem.HeatVent(1000, 12, 0));
ReactorItem.registerComponent(ItemID.heatVentOverclocked, new ReactorItem.HeatVent(1000, 20, 36));
Item.addCreativeGroup("ic2_reactorHeatVent", Translation.translate("Reactor Heat Vents"), [
    ItemID.heatVent,
    ItemID.heatVentReactor,
    ItemID.heatVentComponent,
    ItemID.heatVentAdv,
    ItemID.heatVentOverclocked
]);
Recipes.addShaped({ id: ItemID.heatVent, count: 1, data: 1 }, [
    "bab",
    "axa",
    "bab"
], ['x', ItemID.electricMotor, 0, 'a', ItemID.plateIron, 0, 'b', 101, -1]);
Recipes.addShaped({ id: ItemID.heatVentReactor, count: 1, data: 1 }, [
    "a",
    "x",
    "a"
], ['x', ItemID.heatVent, 1, 'a', ItemID.densePlateCopper, 0]);
Recipes.addShaped({ id: ItemID.heatVentComponent, count: 1, data: 0 }, [
    "bab",
    "axa",
    "bab"
], ['x', ItemID.heatVent, 1, 'a', ItemID.plateTin, 0, 'b', 101, -1]);
Recipes.addShaped({ id: ItemID.heatVentAdv, count: 1, data: 1 }, [
    "bxb",
    "bdb",
    "bxb"
], ['x', ItemID.heatVent, 1, 'd', 264, 0, 'b', 101, -1]);
Recipes.addShaped({ id: ItemID.heatVentOverclocked, count: 1, data: 1 }, [
    "a",
    'x',
    "a"
], ['x', ItemID.heatVentReactor, 1, 'a', ItemID.plateGold, 0]);
/// <reference path="api/Condensator.ts" />
ItemRegistry.createItem("rshCondensator", { name: "rsh_condensator", icon: "rsh_condensator", inCreative: false });
ItemRegistry.createItem("lzhCondensator", { name: "lzh_condensator", icon: "lzh_condensator", inCreative: false });
Item.addToCreative(ItemID.rshCondensator, 1, 1);
Item.addToCreative(ItemID.lzhCondensator, 1, 1);
ReactorItem.registerComponent(ItemID.rshCondensator, new ReactorItem.Condensator(20000));
ReactorItem.registerComponent(ItemID.lzhCondensator, new ReactorItem.Condensator(100000));
Recipes.addShaped({ id: ItemID.rshCondensator, count: 1, data: 1 }, [
    "rrr",
    "rar",
    "rxr"
], ['a', ItemID.heatVent, 1, 'x', ItemID.heatExchanger, 1, 'r', 331, 0]);
Recipes.addShaped({ id: ItemID.lzhCondensator, count: 1, data: 1 }, [
    "rar",
    "cbc",
    "rxr"
], ['a', ItemID.heatVentReactor, 1, 'b', 22, -1, 'c', ItemID.rshCondensator, -1, 'x', ItemID.heatExchangerReactor, 1, 'r', 331, 0]);
Recipes.addShapeless({ id: ItemID.rshCondensator, count: 1, data: 1 }, [{ id: ItemID.rshCondensator, data: -1 }, { id: 331, data: 0 }], function (api, field, result) {
    var index = 0;
    var canBeRepaired = false;
    for (var i = 0; i < field.length; i++) {
        var slot = field[i];
        if (slot.id == ItemID.rshCondensator) {
            if (slot.data <= 1)
                break;
            canBeRepaired = true;
            slot.data = Math.max(Math.floor(slot.data - 10000 / slot.count), 1);
        }
        else if (slot.id != 0) {
            index = i;
        }
    }
    if (canBeRepaired) {
        api.decreaseFieldSlot(index);
    }
    result.id = result.count = 0;
});
Recipes.addShapeless({ id: ItemID.lzhCondensator, count: 1, data: 1 }, [{ id: ItemID.lzhCondensator, data: -1 }, { id: 331, data: 0 }], function (api, field, result) {
    var index = 0;
    var canBeRepaired = false;
    for (var i = 0; i < field.length; i++) {
        var slot = field[i];
        if (slot.id == ItemID.lzhCondensator) {
            if (slot.data <= 1)
                break;
            canBeRepaired = true;
            slot.data = Math.max(Math.floor(slot.data - 10000 / slot.count), 1);
        }
        else if (slot.id != 0) {
            index = i;
        }
    }
    if (canBeRepaired) {
        api.decreaseFieldSlot(index);
    }
    result.id = result.count = 0;
});
Recipes.addShapeless({ id: ItemID.lzhCondensator, count: 1, data: 1 }, [{ id: ItemID.lzhCondensator, data: -1 }, IDConverter.getIDData("lapis_lazuli")], function (api, field, result) {
    var index = 0;
    var canBeRepaired = false;
    for (var i = 0; i < field.length; i++) {
        var slot = field[i];
        if (slot.id == ItemID.lzhCondensator) {
            if (slot.data <= 1)
                break;
            canBeRepaired = true;
            slot.data = Math.max(Math.floor(slot.data - 40000 / slot.count), 1);
        }
        else if (slot.id != 0) {
            index = i;
        }
    }
    if (canBeRepaired) {
        api.decreaseFieldSlot(index);
    }
    result.id = result.count = 0;
});
var ArmorIC2 = /** @class */ (function (_super) {
    __extends(ArmorIC2, _super);
    function ArmorIC2(stringID, name, params, inCreative) {
        return _super.call(this, stringID, name, name, params, inCreative) || this;
    }
    ArmorIC2.prototype.setArmorTexture = function (name) {
        var index = (this.armorType == "leggings") ? 2 : 1;
        this.texture = "armor/" + name + "_" + index + ".png";
    };
    return ArmorIC2;
}(ItemArmor));
/// <reference path="./ArmorIC2.ts" />
var ArmorElectric = /** @class */ (function (_super) {
    __extends(ArmorElectric, _super);
    function ArmorElectric(stringID, name, params, maxCharge, transferLimit, tier, inCreative) {
        var _this = _super.call(this, stringID, name, params, false) || this;
        _this.energy = "Eu";
        _this.canProvideEnergy = false;
        _this.preventDamaging();
        _this.maxCharge = maxCharge;
        _this.transferLimit = transferLimit;
        _this.tier = tier;
        ChargeItemRegistry.registerItem(_this.id, _this, inCreative);
        return _this;
    }
    ArmorElectric.prototype.onNameOverride = function (item, name) {
        return name + "\n\u00A77" + ItemName.getPowerTierText(this.tier) + "\n" + ItemName.getItemStorageText(item);
    };
    ArmorElectric.prototype.onHurt = function (params, item, index, playerUid) {
        return item;
    };
    ArmorElectric.prototype.onTick = function (item, index, playerUid) {
        return null;
    };
    return ArmorElectric;
}(ArmorIC2));
/// <reference path="./ArmorElectric.ts" />
var ArmorBatpack = /** @class */ (function (_super) {
    __extends(ArmorBatpack, _super);
    function ArmorBatpack(stringID, name, maxCharge, transferLimit, tier) {
        var _this = _super.call(this, stringID, name, { type: "chestplate", defence: 3, texture: name }, maxCharge, transferLimit, tier) || this;
        _this.canProvideEnergy = true;
        return _this;
    }
    ArmorBatpack.prototype.onTick = function (item, index, playerUid) {
        return ArmorBatpack.chargeCarriedItem(this, item, playerUid);
    };
    ArmorBatpack.chargeCarriedItem = function (itemData, stack, playerUid) {
        var tickDelay = 20;
        if (World.getThreadTime() % tickDelay == 0) {
            var carried = Entity.getCarriedItem(playerUid);
            var carriedData = ChargeItemRegistry.getItemData(carried.id);
            if (carriedData && carriedData.transferLimit > 0 && carriedData.energy == itemData.energy && carriedData.tier <= itemData.tier) {
                var energyStored = ChargeItemRegistry.getEnergyStored(stack);
                var energyAmount = Math.min(energyStored, itemData.transferLimit * tickDelay);
                var energyAdded = ChargeItemRegistry.addEnergyTo(carried, itemData.energy, energyAmount, itemData.tier, true);
                if (energyAdded > 0) {
                    ChargeItemRegistry.setEnergyStored(stack, energyStored - energyAdded);
                    Entity.setCarriedItem(playerUid, carried.id, 1, carried.data, carried.extra);
                    return stack;
                }
            }
        }
        return null;
    };
    return ArmorBatpack;
}(ArmorElectric));
/// <reference path="./ArmorIC2.ts" />
var ArmorHazmat = /** @class */ (function (_super) {
    __extends(ArmorHazmat, _super);
    function ArmorHazmat(stringID, name, params) {
        var _this = _super.call(this, stringID, name, params) || this;
        _this.setMaxDamage(64);
        RadiationAPI.registerHazmatArmor(_this.id);
        return _this;
    }
    ArmorHazmat.prototype.onHurt = function (params, item, index, playerUid) {
        if (params.type == 9 && index == 0) {
            var player = new PlayerEntity(playerUid);
            for (var i = 0; i < 36; i++) {
                var stack = player.getInventorySlot(i);
                if (stack.id == ItemID.cellAir) {
                    Game.prevent();
                    Entity.addEffect(playerUid, PotionEffect.waterBreathing, 1, 60);
                    stack.decrease(1);
                    player.setInventorySlot(i, stack);
                    player.addItemToInventory(ItemID.cellEmpty, 1, 0);
                    break;
                }
            }
        }
        if (params.type == 5 && index == 3) {
            var Dp = Math.floor(params.damage / 8);
            var Db = Math.floor(params.damage * 7 / 16);
            if (Dp < 1) {
                Game.prevent();
            }
            else {
                Entity.setHealth(playerUid, Entity.getHealth(playerUid) + params.damage - Dp);
            }
            item.data += Db;
            if (item.data >= Item.getMaxDamage(this.id)) {
                item.id = item.count = 0;
            }
            return item;
        }
        return null;
    };
    ArmorHazmat.prototype.onTick = function (item, index, playerUid) {
        var player = new PlayerActor(playerUid);
        if (index == 0
            && player.getArmor(1).id == ItemID.hazmatChestplate
            && player.getArmor(2).id == ItemID.hazmatLeggings
            && player.getArmor(3).id == ItemID.rubberBoots) {
            if (RadiationAPI.getRadiation(playerUid) <= 0) {
                Entity.clearEffect(playerUid, PotionEffect.poison);
            }
            Entity.clearEffect(playerUid, PotionEffect.wither);
        }
    };
    return ArmorHazmat;
}(ArmorIC2));
/// <reference path="./ArmorElectric.ts" />
/// <reference path="./JetpackProvider.ts" />
var ArmorJetpackElectric = /** @class */ (function (_super) {
    __extends(ArmorJetpackElectric, _super);
    function ArmorJetpackElectric() {
        var _this = _super.call(this, "jetpack", "electric_jetpack", { type: "chestplate", defence: 3, texture: "electric_jetpack" }, 30000, 100, 1) || this;
        ToolHUD.setButtonFor(_this.id, "button_fly");
        ToolHUD.setButtonFor(_this.id, "button_hover");
        return _this;
    }
    ArmorJetpackElectric.prototype.onHurt = function (params, item, index, playerUid) {
        if (BlockEngine.getMainGameVersion() >= 16 && params.type == 5 && !EntityHelper.isOnGround(playerUid)) {
            Game.prevent();
        }
        return item;
    };
    ArmorJetpackElectric.prototype.onTick = function (item, index, playerUid) {
        return JetpackProvider.onTick(item, playerUid);
    };
    return ArmorJetpackElectric;
}(ArmorElectric));
/// <reference path="./ArmorElectric.ts" />
var ArmorNightvisionGoggles = /** @class */ (function (_super) {
    __extends(ArmorNightvisionGoggles, _super);
    function ArmorNightvisionGoggles() {
        var _this = _super.call(this, "nightvisionGoggles", "nightvision_goggles", { type: "helmet", defence: 1, texture: "nightvision" }, 100000, 256, 2) || this;
        ToolHUD.setButtonFor(_this.id, "button_nightvision");
        return _this;
    }
    ArmorNightvisionGoggles.prototype.onTick = function (item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
            var pos = Entity.getPosition(playerUid);
            var time = World.getWorldTime() % 24000;
            var region = WorldRegion.getForActor(playerUid);
            if (region.getLightLevel(pos) > 13 && time <= 12000) {
                Entity.clearEffect(playerUid, PotionEffect.nightVision);
                Entity.addEffect(playerUid, PotionEffect.blindness, 1, 25);
            }
            else {
                Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
            }
            if (World.getThreadTime() % 20 == 0) {
                ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
                return item;
            }
        }
        return null;
    };
    return ArmorNightvisionGoggles;
}(ArmorElectric));
/// <reference path="./ArmorIC2.ts" />
var ArmorSolarHelmet = /** @class */ (function (_super) {
    __extends(ArmorSolarHelmet, _super);
    function ArmorSolarHelmet(stringID, name, params) {
        var _this = _super.call(this, stringID, name, params) || this;
        _this.preventDamaging();
        return _this;
    }
    ArmorSolarHelmet.prototype.onTick = function (item, index, playerUid) {
        var time = World.getWorldTime() % 24000;
        if (World.getThreadTime() % 20 == 0 && time >= 23500 || time < 12550) {
            var pos = Entity.getPosition(playerUid);
            var region = WorldRegion.getForActor(playerUid);
            if (region.canSeeSky(pos) && (!World.getWeather().rain || region.getLightLevel(pos) > 14)) {
                for (var i = 1; i < 4; i++) {
                    var energy = 20;
                    var armor = Entity.getArmorSlot(playerUid, i);
                    var energyAdd = ChargeItemRegistry.addEnergyTo(armor, "Eu", energy, 4);
                    if (energyAdd > 0) {
                        energy -= energyAdd;
                        Entity.setArmorSlot(playerUid, i, armor.id, 1, armor.data, armor.extra);
                        if (energy <= 0)
                            break;
                    }
                }
            }
        }
    };
    return ArmorSolarHelmet;
}(ArmorIC2));
/// <reference path="./ArmorElectric.ts" />
var ArmorNanoSuit = /** @class */ (function (_super) {
    __extends(ArmorNanoSuit, _super);
    function ArmorNanoSuit(stringID, name, params, inCreative) {
        var _this = _super.call(this, stringID, name, params, 1000000, 2048, 3, inCreative) || this;
        _this.setRarity(EnumRarity.UNCOMMON);
        return _this;
    }
    ArmorNanoSuit.prototype.getEnergyPerDamage = function () {
        return 4000;
    };
    ArmorNanoSuit.prototype.getExtraDefence = function () {
        return 4;
    };
    ArmorNanoSuit.prototype.onHurt = function (params, item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        var energyPerDamage = this.getEnergyPerDamage();
        var type = params.type;
        if (energyStored >= energyPerDamage && (type == 2 || type == 3 || type == 11)) {
            var energy = params.damage * energyPerDamage;
            ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
            return item;
        }
        return null;
    };
    return ArmorNanoSuit;
}(ArmorElectric));
var ArmorNanoHelmet = /** @class */ (function (_super) {
    __extends(ArmorNanoHelmet, _super);
    function ArmorNanoHelmet(stringID, name, texture) {
        var _this = _super.call(this, stringID, name, { type: "helmet", defence: 3, texture: texture }) || this;
        ToolHUD.setButtonFor(_this.id, "button_nightvision");
        return _this;
    }
    ArmorNanoHelmet.prototype.onTick = function (item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (energyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
            var pos = Entity.getPosition(playerUid);
            var time = World.getWorldTime() % 24000;
            var region = WorldRegion.getForActor(playerUid);
            if (region.getLightLevel(pos) > 13 && time <= 12000) {
                Entity.addEffect(playerUid, PotionEffect.blindness, 1, 25);
                Entity.clearEffect(playerUid, PotionEffect.nightVision);
            }
            else {
                Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
            }
            Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
            if (World.getThreadTime() % 20 == 0) {
                ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - 20, 0));
                return item;
            }
        }
        return null;
    };
    return ArmorNanoHelmet;
}(ArmorNanoSuit));
var ArmorNanoChestplate = /** @class */ (function (_super) {
    __extends(ArmorNanoChestplate, _super);
    function ArmorNanoChestplate(stringID, name, texture) {
        return _super.call(this, stringID, name, { type: "chestplate", defence: 8, texture: texture }) || this;
    }
    return ArmorNanoChestplate;
}(ArmorNanoSuit));
var ArmorNanoLeggings = /** @class */ (function (_super) {
    __extends(ArmorNanoLeggings, _super);
    function ArmorNanoLeggings(stringID, name, texture) {
        return _super.call(this, stringID, name, { type: "leggings", defence: 6, texture: texture }) || this;
    }
    return ArmorNanoLeggings;
}(ArmorNanoSuit));
var ArmorNanoBoots = /** @class */ (function (_super) {
    __extends(ArmorNanoBoots, _super);
    function ArmorNanoBoots(stringID, name, texture) {
        return _super.call(this, stringID, name, { type: "boots", defence: 3, texture: texture }) || this;
    }
    ArmorNanoBoots.prototype.onHurt = function (params, item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        var energyPerDamage = this.getEnergyPerDamage();
        if (params.type == 5 && energyStored >= energyPerDamage) {
            var damageReduce = Math.min(Math.min(9, params.damage), Math.floor(energyStored / energyPerDamage));
            var damageTaken = params.damage - damageReduce;
            if (damageTaken > 0) {
                Entity.setHealth(playerUid, Entity.getHealth(playerUid) + params.damage - damageTaken);
            }
            else {
                Game.prevent();
            }
            ChargeItemRegistry.setEnergyStored(item, energyStored - damageReduce * energyPerDamage);
            return item;
        }
        return _super.prototype.onHurt.call(this, params, item, index, playerUid);
    };
    return ArmorNanoBoots;
}(ArmorNanoSuit));
/** @deprecated */
var NANO_ARMOR_FUNCS = {
    hurt: function (params, item, index) {
        return !!ArmorNanoSuit.prototype.onHurt(params, item, index, Player.get());
    },
    tick: function (item, index) {
        return !!ArmorNanoSuit.prototype.onTick(item, index, Player.get());
    }
};
/// <reference path="./ArmorElectric.ts" />
/// <reference path="./JetpackProvider.ts" />
var ArmorQuantumSuit = /** @class */ (function (_super) {
    __extends(ArmorQuantumSuit, _super);
    function ArmorQuantumSuit(stringID, name, params, inCreative) {
        var _this = _super.call(this, stringID, name, params, 1e7, 12000, 4, inCreative) || this;
        _this.setRarity(EnumRarity.RARE);
        RadiationAPI.registerHazmatArmor(_this.id);
        return _this;
    }
    ArmorQuantumSuit.prototype.getEnergyPerDamage = function () {
        return 10000;
    };
    ArmorQuantumSuit.prototype.getExtraDefence = function () {
        return 5;
    };
    ArmorQuantumSuit.prototype.onHurt = function (params, item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        var energyPerDamage = this.getEnergyPerDamage();
        var type = params.type;
        if (energyStored >= energyPerDamage && (type == 2 || type == 3 || type == 11)) {
            var energy = params.damage * energyPerDamage;
            ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - energy, 0));
            return item;
        }
        return null;
    };
    return ArmorQuantumSuit;
}(ArmorElectric));
var ArmorQuantumHelmet = /** @class */ (function (_super) {
    __extends(ArmorQuantumHelmet, _super);
    function ArmorQuantumHelmet(stringID, name, texture) {
        var _this = _super.call(this, stringID, name, { type: "helmet", defence: 3, texture: texture }) || this;
        ToolHUD.setButtonFor(_this.id, "button_nightvision");
        return _this;
    }
    ArmorQuantumHelmet.prototype.onHurt = function (params, item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (params.type == 9 && energyStored >= 500) {
            Game.prevent();
            Entity.addEffect(playerUid, PotionEffect.waterBreathing, 1, 60);
            ChargeItemRegistry.setEnergyStored(item, energyStored - 500);
        }
        return _super.prototype.onHurt.call(this, params, item, index, playerUid);
    };
    ArmorQuantumHelmet.prototype.onTick = function (item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (energyStored <= 0)
            return null;
        Entity.clearEffect(playerUid, PotionEffect.poison);
        Entity.clearEffect(playerUid, PotionEffect.wither);
        var newEnergyStored = energyStored;
        if (RadiationAPI.getRadiation(playerUid) > 0 && energyStored >= 100000) {
            RadiationAPI.setRadiation(playerUid, 0);
            newEnergyStored -= 100000;
        }
        var player = new PlayerEntity(playerUid);
        var hunger = player.getHunger();
        if (hunger < 20 && newEnergyStored >= 500) {
            var i = World.getThreadTime() % 36;
            var stack = player.getInventorySlot(i);
            if (stack.id == ItemID.tinCanFull) {
                var count = Math.min(20 - hunger, stack.count);
                player.setHunger(hunger + count);
                stack.decrease(count);
                player.setInventorySlot(i, stack);
                player.addItemToInventory(ItemID.tinCanEmpty, count, 0);
                newEnergyStored -= 500;
            }
        }
        // night vision
        if (newEnergyStored > 0 && item.extra && item.extra.getBoolean("nv")) {
            var coords = Entity.getPosition(playerUid);
            var time = World.getWorldTime() % 24000;
            var region = WorldRegion.getForActor(playerUid);
            if (region.getLightLevel(coords.x, coords.y, coords.z) > 13 && time <= 12000) {
                Entity.addEffect(playerUid, PotionEffect.blindness, 1, 25);
                Entity.clearEffect(playerUid, PotionEffect.nightVision);
            }
            else {
                Entity.addEffect(playerUid, PotionEffect.nightVision, 1, 225);
            }
            if (World.getThreadTime() % 20 == 0) {
                newEnergyStored = Math.max(newEnergyStored - 20, 0);
            }
        }
        if (energyStored != newEnergyStored) {
            ChargeItemRegistry.setEnergyStored(item, newEnergyStored);
            return item;
        }
        return null;
    };
    return ArmorQuantumHelmet;
}(ArmorQuantumSuit));
var ArmorQuantumChestplate = /** @class */ (function (_super) {
    __extends(ArmorQuantumChestplate, _super);
    function ArmorQuantumChestplate(stringID, name, texture) {
        var _this = _super.call(this, stringID, name, { type: "chestplate", defence: 8, texture: texture }) || this;
        ToolHUD.setButtonFor(_this.id, "button_fly");
        ToolHUD.setButtonFor(_this.id, "button_hover");
        return _this;
    }
    ArmorQuantumChestplate.prototype.onHurt = function (params, item, index, playerUid) {
        if (BlockEngine.getMainGameVersion() >= 16 && params.type == 5 && !EntityHelper.isOnGround(playerUid)) {
            Game.prevent();
        }
        return _super.prototype.onHurt.call(this, params, item, index, playerUid);
    };
    ArmorQuantumChestplate.prototype.onTick = function (item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (energyStored > this.getEnergyPerDamage()) {
            Entity.setFire(playerUid, 0, true);
        }
        return JetpackProvider.onTick(item, playerUid);
        ;
    };
    return ArmorQuantumChestplate;
}(ArmorQuantumSuit));
var ArmorQuantumLeggings = /** @class */ (function (_super) {
    __extends(ArmorQuantumLeggings, _super);
    function ArmorQuantumLeggings(stringID, name, texture) {
        return _super.call(this, stringID, name, { type: "leggings", defence: 6, texture: texture }) || this;
    }
    ArmorQuantumLeggings.prototype.onTick = function (item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (energyStored <= 0)
            return null;
        var vel = Entity.getVelocity(playerUid);
        var horizontalVel = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
        // Game.tipMessage(horizontalVel);
        if (horizontalVel <= 0.15) {
            this.runTime = 0;
        }
        else if (EntityHelper.isOnGround(playerUid)) {
            this.runTime++;
        }
        if (this.runTime > 2 && !Player.getFlying()) {
            Entity.addEffect(playerUid, PotionEffect.movementSpeed, 6, 5);
            if (World.getThreadTime() % 5 == 0) {
                ChargeItemRegistry.setEnergyStored(item, Math.max(energyStored - Math.floor(horizontalVel * 600)));
                return item;
            }
        }
        return null;
    };
    return ArmorQuantumLeggings;
}(ArmorQuantumSuit));
var ArmorQuantumBoots = /** @class */ (function (_super) {
    __extends(ArmorQuantumBoots, _super);
    function ArmorQuantumBoots(stringID, name, texture) {
        var _this = _super.call(this, stringID, name, { type: "boots", defence: 3, texture: texture }) || this;
        ToolHUD.setButtonFor(_this.id, "button_jump");
        return _this;
    }
    ArmorQuantumBoots.prototype.onHurt = function (params, item, index, playerUid) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        var energyPerDamage = this.getEnergyPerDamage();
        if (params.type == 5) {
            var damageReduce = Math.min(params.damage, Math.floor(energyStored / energyPerDamage));
            var damageTaken = params.damage - damageReduce;
            if (damageTaken > 0) {
                Entity.setHealth(playerUid, Entity.getHealth(playerUid) + params.damage - damageTaken);
            }
            else {
                Game.prevent();
            }
            ChargeItemRegistry.setEnergyStored(item, energyStored - damageReduce * energyPerDamage);
        }
        if (params.type == 22) {
            Game.prevent();
            ChargeItemRegistry.setEnergyStored(item, energyStored - energyPerDamage);
        }
        return _super.prototype.onHurt.call(this, params, item, index, playerUid);
    };
    return ArmorQuantumBoots;
}(ArmorQuantumSuit));
Callback.addCallback("EntityHurt", function (attacker, victim, damage, type) {
    if (damage > 0 && EntityHelper.isPlayer(victim) && (type == 2 || type == 3 || type == 11)) {
        var defencePoints = 0;
        for (var i = 0; i < 4; i++) {
            var item = Entity.getArmorSlot(victim, i);
            var armor = ItemRegistry.getInstanceOf(item.id);
            if (armor instanceof ArmorNanoSuit || armor instanceof ArmorQuantumSuit) {
                if (ChargeItemRegistry.getEnergyStored(item) >= armor.getEnergyPerDamage() * damage) {
                    defencePoints += armor.getExtraDefence();
                }
            }
        }
        if (defencePoints > 0) {
            var damageGot = damage / 5;
            var damageReceived = damageGot * (20 - defencePoints) / 20;
            if (damageGot > 1)
                damageGot = Math.floor(damageGot);
            var damageAbsorbed = Math.ceil(damageGot - Math.floor(damageReceived));
            var health_1 = Math.min(Entity.getMaxHealth(victim), Entity.getHealth(victim));
            if (damageReceived < 1) {
                if (damageGot < 1) {
                    if (Math.random() >= damageReceived / damageGot) {
                        runOnMainThread(function () {
                            var curHealth = Entity.getHealth(victim);
                            if (curHealth < health_1) {
                                Entity.setHealth(victim, curHealth + 1);
                            }
                        });
                    }
                    return;
                }
                else if (Math.random() < damageReceived) {
                    damageAbsorbed--;
                }
            }
            if (damageAbsorbed > 0) {
                Entity.setHealth(victim, health_1 + damageAbsorbed);
            }
        }
    }
});
/** @deprecated */
var QUANTUM_ARMOR_FUNCS = {
    hurt: function (params, item, index) {
        return !!ArmorQuantumSuit.prototype.onHurt(params, item, index, Player.get());
    },
    tick: function (item, index) {
        return !!ArmorQuantumSuit.prototype.onTick(item, index, Player.get());
    }
};
/// <reference path="ArmorIC2.ts" />
/// <reference path="ArmorHazmat.ts" />
/// <reference path="ArmorJetpackElectric.ts" />
/// <reference path="ArmorBatpack.ts" />
/// <reference path="ArmorNightvisionGoggles.ts" />
/// <reference path="ArmorNanoSuit.ts" />
/// <reference path="ArmorQuantumSuit.ts" />
/// <reference path="ArmorSolarHelmet.ts" />
ItemRegistry.addArmorMaterial("bronze", { durabilityFactor: 14, enchantability: 10, repairMaterial: ItemID.ingotBronze });
ItemRegistry.registerItem(new ArmorIC2("bronzeHelmet", "bronze_helmet", { type: "helmet", defence: 2, texture: "bronze", material: "bronze" }));
ItemRegistry.registerItem(new ArmorIC2("bronzeChestplate", "bronze_chestplate", { type: "chestplate", defence: 6, texture: "bronze", material: "bronze" }));
ItemRegistry.registerItem(new ArmorIC2("bronzeLeggings", "bronze_leggings", { type: "leggings", defence: 6, texture: "bronze", material: "bronze" }));
ItemRegistry.registerItem(new ArmorIC2("bronzeBoots", "bronze_boots", { type: "boots", defence: 6, texture: "bronze", material: "bronze" }));
ItemRegistry.addArmorMaterial("composite", { durabilityFactor: 50, enchantability: 8, repairMaterial: ItemID.plateAlloy });
ItemRegistry.registerItem(new ArmorIC2("compositeHelmet", "composite_helmet", { type: "helmet", defence: 3, texture: "composite", material: "composite" }));
ItemRegistry.registerItem(new ArmorIC2("compositeChestplate", "composite_chestplate", { type: "chestplate", defence: 8, texture: "composite", material: "composite" }));
ItemRegistry.registerItem(new ArmorIC2("compositeLeggings", "composite_leggings", { type: "leggings", defence: 6, texture: "composite", material: "composite" }));
ItemRegistry.registerItem(new ArmorIC2("compositeBoots", "composite_boots", { type: "boots", defence: 3, texture: "composite", material: "composite" }));
ItemRegistry.registerItem(new ArmorHazmat("hazmatHelmet", "hazmat_helmet", { type: "helmet", defence: 1, texture: "hazmat" }));
ItemRegistry.registerItem(new ArmorHazmat("hazmatChestplate", "hazmat_chestplate", { type: "chestplate", defence: 1, texture: "hazmat" }));
ItemRegistry.registerItem(new ArmorHazmat("hazmatLeggings", "hazmat_leggings", { type: "leggings", defence: 1, texture: "hazmat" }));
ItemRegistry.registerItem(new ArmorHazmat("rubberBoots", "rubber_boots", { type: "boots", defence: 1, texture: "rubber" }));
ItemRegistry.registerItem(new ArmorJetpackElectric());
ItemRegistry.registerItem(new ArmorBatpack("batpack", "batpack", 60000, 100, 1));
ItemRegistry.registerItem(new ArmorBatpack("advBatpack", "advanced_batpack", 600000, 512, 2));
ItemRegistry.registerItem(new ArmorBatpack("energypack", "energypack", 2000000, 2048, 3));
ItemRegistry.registerItem(new ArmorBatpack("lappack", "lappack", 10000000, 8192, 4));
ItemRegistry.setRarity("lappack", EnumRarity.UNCOMMON);
Item.addCreativeGroup("batteryPack", Translation.translate("Battery Packs"), [
    ItemID.batpack,
    ItemID.advBatpack,
    ItemID.energypack,
    ItemID.lappack
]);
ItemRegistry.registerItem(new ArmorNightvisionGoggles());
ItemRegistry.registerItem(new ArmorNanoHelmet("nanoHelmet", "nano_helmet", "nano"));
ItemRegistry.registerItem(new ArmorNanoChestplate("nanoChestplate", "nano_chestplate", "nano"));
ItemRegistry.registerItem(new ArmorNanoLeggings("nanoLeggings", "nano_leggings", "nano"));
ItemRegistry.registerItem(new ArmorNanoBoots("nanoBoots", "nano_boots", "nano"));
ItemRegistry.registerItem(new ArmorQuantumHelmet("quantumHelmet", "quantum_helmet", "quantum"));
ItemRegistry.registerItem(new ArmorQuantumChestplate("quantumChestplate", "quantum_chestplate", "quantum"));
ItemRegistry.registerItem(new ArmorQuantumLeggings("quantumLeggings", "quantum_leggings", "quantum"));
ItemRegistry.registerItem(new ArmorQuantumBoots("quantumBoots", "quantum_boots", "quantum"));
ItemRegistry.registerItem(new ArmorSolarHelmet("solarHelmet", "solar_helmet", { type: "helmet", defence: 2, texture: "solar" }));
/// <reference path="init.ts" />
// Bronze
Recipes.addShaped({ id: ItemID.bronzeHelmet, count: 1, data: 0 }, [
    "xxx",
    "x x"
], ['x', ItemID.ingotBronze, 0]);
Recipes.addShaped({ id: ItemID.bronzeChestplate, count: 1, data: 0 }, [
    "x x",
    "xxx",
    "xxx"
], ['x', ItemID.ingotBronze, 0]);
Recipes.addShaped({ id: ItemID.bronzeLeggings, count: 1, data: 0 }, [
    "xxx",
    "x x",
    "x x"
], ['x', ItemID.ingotBronze, 0]);
Recipes.addShaped({ id: ItemID.bronzeBoots, count: 1, data: 0 }, [
    "x x",
    "x x"
], ['x', ItemID.ingotBronze, 0]);
// Composite
Recipes.addShaped({ id: ItemID.compositeHelmet, count: 1, data: 0 }, [
    "xax",
    "x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_helmet, 0]);
Recipes.addShaped({ id: ItemID.compositeChestplate, count: 1, data: 0 }, [
    "x x",
    "xax",
    "xxx"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_chestplate, 0]);
Recipes.addShaped({ id: ItemID.compositeLeggings, count: 1, data: 0 }, [
    "xax",
    "x x",
    "x x"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_leggings, 0]);
Recipes.addShaped({ id: ItemID.compositeBoots, count: 1, data: 0 }, [
    "x x",
    "xax"
], ['x', ItemID.plateAlloy, 0, 'a', VanillaItemID.iron_boots, 0]);
// Hazmat
if (BlockEngine.getMainGameVersion() == 11) {
    Recipes.addShaped({ id: ItemID.hazmatHelmet, count: 1, data: 0 }, [
        " d ",
        "xax",
        "x#x"
    ], ['x', ItemID.rubber, 0, 'a', 20, -1, 'd', 351, 14, '#', 101, -1]);
    Recipes.addShaped({ id: ItemID.hazmatChestplate, count: 1, data: 0 }, [
        "x x",
        "xdx",
        "xdx"
    ], ['x', ItemID.rubber, 0, 'd', 351, 14]);
    Recipes.addShaped({ id: ItemID.hazmatLeggings, count: 1, data: 0 }, [
        "xdx",
        "x x",
        "x x"
    ], ['x', ItemID.rubber, 0, 'd', 351, 14]);
}
else {
    Recipes.addShaped({ id: ItemID.hazmatHelmet, count: 1, data: 0 }, [
        " d ",
        "xax",
        "x#x"
    ], ['x', ItemID.rubber, 0, 'a', 20, -1, 'd', VanillaItemID.orange_dye, 0, '#', 101, -1]);
    Recipes.addShaped({ id: ItemID.hazmatChestplate, count: 1, data: 0 }, [
        "x x",
        "xdx",
        "xdx"
    ], ['x', ItemID.rubber, 0, 'd', VanillaItemID.orange_dye, 0]);
    Recipes.addShaped({ id: ItemID.hazmatLeggings, count: 1, data: 0 }, [
        "xdx",
        "x x",
        "x x"
    ], ['x', ItemID.rubber, 0, 'd', VanillaItemID.orange_dye, 0]);
}
Recipes.addShaped({ id: ItemID.rubberBoots, count: 1, data: 0 }, [
    "x x",
    "x x",
    "xwx"
], ['x', ItemID.rubber, 0, 'w', 35, -1]);
// Jetpack
Recipes.addShaped({ id: ItemID.jetpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bcb",
    "bab",
    "d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, 'd', 348, 0]);
// Batpacks
Recipes.addShaped({ id: ItemID.batpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bcb",
    "bab",
    "b b"
], ['a', 5, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.advBatpack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bcb",
    "bab",
    "b b"
], ['a', ItemID.plateBronze, 0, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitBasic, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.energypack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "cbc",
    "aba",
    "b b"
], ['a', ItemID.storageCrystal, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.lappack, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "e",
    "c",
    "a"
], ['e', ItemID.energypack, -1, 'a', ItemID.storageLapotronCrystal, -1, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
// Nightvision Goggles
Recipes.addShaped({ id: ItemID.nightvisionGoggles, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "xbx",
    "aga",
    "rcr"
], ['a', BlockID.luminator, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, 0, 'x', ItemID.heatExchangerAdv, 1, 'g', 20, 0, 'r', ItemID.rubber, 0], ChargeItemRegistry.transferEnergy);
// Nano Suit
Recipes.addShaped({ id: ItemID.nanoHelmet, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x#x",
    "xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.nanoChestplate, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x x",
    "x#x",
    "xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.nanoLeggings, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x#x",
    "x x",
    "x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.nanoBoots, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "x x",
    "x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], ChargeItemRegistry.transferEnergy);
// Quantum Suit
Recipes.addShaped({ id: ItemID.quantumHelmet, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "a#a",
    "bxb",
    "cqc"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'q', ItemID.hazmatHelmet, 0, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0, 'c', ItemID.circuitAdvanced, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.quantumChestplate, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "bxb",
    "a#a",
    "aca"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.quantumLeggings, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "m#m",
    "axa",
    "c c"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], ChargeItemRegistry.transferEnergy);
Recipes.addShaped({ id: ItemID.quantumBoots, count: 1, data: ELECTRIC_ITEM_MAX_DAMAGE }, [
    "axa",
    "b#b"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.rubberBoots, 0], ChargeItemRegistry.transferEnergy);
// Solar Helmet
Recipes.addShaped({ id: ItemID.solarHelmet, count: 1, data: 0 }, [
    "aaa",
    "axa",
    "ccc"
], ['x', BlockID.solarPanel, -1, 'a', VanillaItemID.iron_ingot, 0, 'c', ItemID.cableCopper1, 0]);
Recipes.addShaped({ id: ItemID.solarHelmet, count: 1, data: 0 }, [
    " a ",
    " x ",
    "ccc"
], ['x', BlockID.solarPanel, -1, 'a', VanillaItemID.iron_helmet, 0, 'c', ItemID.cableCopper1, 0]);
var ElectricTool = /** @class */ (function (_super) {
    __extends(ElectricTool, _super);
    function ElectricTool(stringID, name, maxCharge, transferLimit, tier) {
        var _this = _super.call(this, stringID, name, maxCharge, transferLimit, tier) || this;
        _this.damage = 0;
        _this.setHandEquipped(true);
        return _this;
    }
    ElectricTool.prototype.setToolParams = function (toolData) {
        this.energyPerUse = toolData.energyPerUse;
        var toolMaterial = {
            level: toolData.level,
            efficiency: toolData.efficiency,
            damage: toolData.damage || 0,
            durability: Item.getMaxDamage(this.id)
        };
        ToolAPI.registerTool(this.id, toolMaterial, toolData.blockMaterials || [], this);
    };
    ElectricTool.prototype.getEnergyPerUse = function (item) {
        return this.energyPerUse;
    };
    ElectricTool.prototype.onBroke = function () {
        return true;
    };
    ElectricTool.prototype.onAttack = function (item, victim, attacker) {
        ICTool.dischargeItem(item, this.getEnergyPerUse(item), attacker);
        return true;
    };
    ElectricTool.prototype.onDestroy = function (item, coords, block, player) {
        if (Block.getDestroyTime(block.id) > 0) {
            ICTool.dischargeItem(item, this.getEnergyPerUse(item), player);
        }
        return true;
    };
    ElectricTool.prototype.calcDestroyTime = function (item, coords, block, params, destroyTime) {
        if (ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerUse(item)) {
            return destroyTime;
        }
        return params.base;
    };
    return ElectricTool;
}(ItemElectric));
ItemRegistry.createItem("craftingHammer", { name: "forge_hammer", icon: "crafting_hammer", stack: 1, maxDamage: 80, category: ItemCategory.EQUIPMENT });
ItemRegistry.createItem("cutter", { name: "cutter", icon: "cutter", stack: 1, maxDamage: 60, category: ItemCategory.EQUIPMENT });
Item.registerUseFunction("cutter", function (coords, item, block, playerUid) {
    var cableData = CableRegistry.getCableData(block.id);
    if (cableData && cableData.insulation < cableData.maxInsulation) {
        var player = new PlayerEntity(playerUid);
        for (var i = 0; i < 36; i++) {
            var stack = player.getInventorySlot(i);
            if (stack.id == ItemID.rubber) {
                var blockID = CableRegistry.getBlockID(cableData.name, cableData.insulation + 1);
                var region = BlockSource.getDefaultForActor(playerUid);
                region.setBlock(coords.x, coords.y, coords.z, blockID, 0);
                stack.decrease(1);
                player.setInventorySlot(i, stack);
                if (block.data > 0) {
                    EnergyGridBuilder.rebuildWireGrid(region, coords.x, coords.y, coords.z);
                }
                break;
            }
        }
    }
});
Callback.addCallback("DestroyBlockStart", function (coords, block, playerUid) {
    var item = Entity.getCarriedItem(playerUid);
    var cableData = CableRegistry.getCableData(block.id);
    if (item.id == ItemID.cutter && cableData && cableData.insulation > 0) {
        Game.prevent();
        Network.sendToServer("icpe.cutterLongClick", { x: coords.x, y: coords.y, z: coords.z });
    }
});
Network.addServerPacket("icpe.cutterLongClick", function (client, coords) {
    var playerUid = client.getPlayerUid();
    var player = new PlayerEntity(playerUid);
    var item = player.getCarriedItem();
    var region = BlockSource.getDefaultForActor(playerUid);
    var block = region.getBlock(coords.x, coords.y, coords.z);
    var cableData = CableRegistry.getCableData(block.id);
    if (item.id == ItemID.cutter && cableData && cableData.insulation > 0) {
        item.applyDamage(1);
        player.setCarriedItem(item);
        SoundManager.playSoundAtBlock(coords, "InsulationCutters.ogg", 1);
        var blockID = CableRegistry.getBlockID(cableData.name, cableData.insulation - 1);
        region.setBlock(coords.x, coords.y, coords.z, blockID, 0);
        region.spawnDroppedItem(coords.x + .5, coords.y + 1, coords.z + .5, ItemID.rubber, 1, 0);
        if (block.data > 0) {
            EnergyGridBuilder.rebuildWireGrid(region, coords.x, coords.y, coords.z);
        }
    }
});
/// <reference path="ElectricTool.ts" />
var ElectricChainsaw = /** @class */ (function (_super) {
    __extends(ElectricChainsaw, _super);
    function ElectricChainsaw(stringID, name, toolData, maxCharge, transferLimit, tier) {
        var _this = _super.call(this, stringID, name, maxCharge, transferLimit, tier) || this;
        _this.damage = 4;
        toolData.blockMaterials = ["wood", "wool", "fibre", "plant"];
        _this.setToolParams(toolData);
        _this.extraDamage = toolData.damage;
        ICTool.setOnHandSound(_this.id, "ChainsawIdle.ogg", "ChainsawStop.ogg");
        return _this;
    }
    ElectricChainsaw.prototype.modifyEnchants = function (enchantData, item, coords, block) {
        if (block && ToolAPI.getBlockMaterialName(block.id) == "plant") {
            enchantData.silk = true;
        }
    };
    ElectricChainsaw.prototype.onDestroy = function (item, coords, block, player) {
        if (Block.getDestroyTime(block.id) > 0) {
            if (ICTool.dischargeItem(item, this.getEnergyPerUse(item), player) && (block.id == 18 || block.id == 161)) {
                var region = WorldRegion.getForActor(player);
                region.destroyBlock(coords);
                region.dropAtBlock(coords.x, coords.y, coords.z, block.id, 1, block.data);
            }
        }
        return true;
    };
    ElectricChainsaw.prototype.onAttack = function (item, victim, attacker) {
        if (ICTool.dischargeItem(item, this.getEnergyPerUse(item), attacker)) {
            this.toolMaterial.damage = this.extraDamage;
        }
        else {
            this.toolMaterial.damage = 0;
        }
        return true;
    };
    return ElectricChainsaw;
}(ElectricTool));
var CropAnalyser = /** @class */ (function (_super) {
    __extends(CropAnalyser, _super);
    function CropAnalyser() {
        var _this = _super.call(this, "agriculturalAnalyzer", "crop_analyzer", "cropnalyzer") || this;
        _this.setMaxStack(1);
        _this.setCategory(ItemCategory.EQUIPMENT);
        ItemContainer.registerScreenFactory("crop_analyser.ui", function (container, name) {
            return CropAnalyser.gui;
        });
        return _this;
    }
    CropAnalyser.prototype.onItemUse = function (coords, item, block, player) {
        if (block.id == BlockID.crop) {
            var region = WorldRegion.getForActor(player);
            var tileEntity = region.getTileEntity(coords.x, coords.y, coords.z);
            if (!tileEntity.crop)
                return;
            this.showCropValues(tileEntity, player);
        }
        else {
            this.onNoTargetUse(item, player);
        }
    };
    CropAnalyser.prototype.onNoTargetUse = function (item, player) {
        var client = Network.getClientForPlayer(player);
        if (!client) {
            return;
        }
        var container = new ItemContainer();
        container.setParent(this);
        if (!container.getClientContainerTypeName()) {
            this.setupContainer(container);
        }
        container.addServerCloseListener(function (container, client) {
            var player = client.getPlayerUid();
            var _a = Entity.getPosition(player), x = _a.x, y = _a.y, z = _a.z;
            container.dropAt(BlockSource.getDefaultForActor(player), x, y, z);
        });
        container.addServerOpenListener(function (container, client) {
            CropAnalyser.clearInfo(container);
        });
        container.openFor(client, "crop_analyser.ui");
    };
    CropAnalyser.prototype.showCropValues = function (tileEntity, player) {
        var client = Network.getClientForPlayer(player);
        switch (tileEntity.data.scanLevel) {
            case 4:
                client.sendMessage("Growth: " + tileEntity.data.statGrowth);
                client.sendMessage("Gain: " + tileEntity.data.statGain);
                client.sendMessage("Resistance: " + tileEntity.data.statResistance);
            case 2:
                client.sendMessage("Tier: " + tileEntity.crop.getProperties().tier);
                client.sendMessage("Discovered by: " + tileEntity.crop.getDiscoveredBy());
            case 1:
                BlockEngine.sendMessage(client, tileEntity.crop.getID());
        }
    };
    CropAnalyser.prototype.setupContainer = function (container) {
        container.setClientContainerTypeName("crop_analyser.ui");
        container.setSlotAddTransferPolicy("slotSeedOut", function () { return 0; });
        container.setSlotAddTransferPolicy("slotEnergy", function (container, name, id, amount, data, extra, playerUid) {
            if (ChargeItemRegistry.isValidStorage(id, "Eu", 4)) {
                var slotBagIn_1 = container.getSlot("slotSeedIn");
                if (slotBagIn_1.id == ItemID.cropSeedBag) {
                    var slotBagOut_1 = container.getSlot("slotSeedOut");
                    if (slotBagOut_1.isEmpty()) {
                        runOnMainThread(function () {
                            var slotEnergy = container.getSlot("slotEnergy");
                            CropAnalyser.scanBag(slotBagIn_1, slotEnergy, playerUid);
                            CropAnalyser.moveBag(slotBagIn_1, slotBagOut_1);
                            CropAnalyser.showAllValues(container, slotBagOut_1);
                        });
                    }
                }
                return amount;
            }
            return 0;
        });
        container.setSlotAddTransferPolicy("slotSeedIn", function (container, name, id, amount, data, extra, playerUid) {
            if (id == ItemID.cropSeedBag) {
                var slotBagOut_2 = container.getSlot("slotSeedOut");
                var slotEnergy = container.getSlot("slotEnergy");
                if (slotBagOut_2.isEmpty() && ChargeItemRegistry.isValidStorage(slotEnergy.id, "Eu", 4)) {
                    CropAnalyser.scanBag({ id: id, count: amount, data: data, extra: extra }, slotEnergy, playerUid);
                    runOnMainThread(function () {
                        var slotBagIn = container.getSlot("slotSeedIn");
                        CropAnalyser.moveBag(slotBagIn, slotBagOut_2);
                        CropAnalyser.showAllValues(container, { id: id, count: amount, data: data, extra: extra });
                    });
                }
                return amount;
            }
            return 0;
        });
        container.setSlotGetTransferPolicy("slotSeedOut", function (container, name, id, amount, data, extra, playerUid) {
            CropAnalyser.clearInfo(container);
            var slotBagIn = container.getSlot("slotSeedIn");
            if (!slotBagIn.isEmpty()) {
                var slotEnergy_1 = container.getSlot("slotEnergy");
                if (ChargeItemRegistry.isValidStorage(slotEnergy_1.id, "Eu", 4)) {
                    runOnMainThread(function () {
                        var slotBagOut = container.getSlot("slotSeedOut");
                        CropAnalyser.scanBag({ id: id, count: amount, data: data, extra: extra }, slotEnergy_1, playerUid);
                        CropAnalyser.moveBag(slotBagIn, slotBagOut);
                        CropAnalyser.showAllValues(container, { id: id, count: amount, data: data, extra: extra });
                    });
                }
            }
            return amount;
        });
    };
    CropAnalyser.clearInfo = function (container) {
        container.setText("growthText", "");
        container.setText("gainText", "");
        container.setText("resistText", "");
        container.setText("growth", "");
        container.setText("gain", "");
        container.setText("resist", "");
        container.setText("attributes0", "");
        container.setText("attributes1", "");
        container.setText("attributes2", "");
        container.setText("textTier", "");
        container.setText("discoveredByText", "");
        container.setText("discoveredBy", "");
        container.setText("cropName", "");
        container.sendChanges();
    };
    CropAnalyser.moveBag = function (slotBagIn, slotBagOut) {
        slotBagOut.id = slotBagIn.id;
        slotBagOut.count = slotBagIn.count;
        slotBagOut.data = slotBagIn.data;
        slotBagOut.extra = slotBagIn.extra;
        slotBagIn.clear();
    };
    CropAnalyser.scanBag = function (slotBag, slotEnergy, playerUid) {
        var level = slotBag.extra.getInt("scan");
        if (level < 4) {
            var needEnergy = CropAnalyser.energyForLevel(level);
            var currentEnergy = ChargeItemRegistry.getEnergyStored(slotEnergy, "Eu");
            if (currentEnergy > needEnergy) {
                ICTool.dischargeItem(slotEnergy, needEnergy, playerUid);
                slotBag.extra.putInt("scan", level + 1);
            }
        }
    };
    CropAnalyser.showAllValues = function (container, seedBagSlot) {
        var level = seedBagSlot.extra.getInt("scan");
        var crop = Agriculture.CropCardManager.getCropCardByIndex(seedBagSlot.data);
        switch (level) {
            case 4:
                container.setText("growthText", "Growth: ");
                container.setText("gainText", "Gain: ");
                container.setText("resistText", "Resistance: ");
                container.setText("growth", seedBagSlot.extra.getInt("growth").toString());
                container.setText("gain", seedBagSlot.extra.getInt("gain").toString());
                container.setText("resist", seedBagSlot.extra.getInt("resistance").toString());
            case 3:
                var attributes = crop.getAttributes();
                for (var i in attributes) {
                    container.setText("attributes" + (+i % 3), attributes[i]);
                }
            case 2:
                container.setText("textTier", CropAnalyser.getStringTier(crop.getProperties().tier));
                container.setText("discoveredByText", "Discovered by: ");
                container.setText("discoveredBy", crop.getDiscoveredBy());
            case 1:
                container.setText("cropName", CropAnalyser.getSeedName(crop.getID()));
        }
        container.setSlot("slotSeedOut", seedBagSlot.id, seedBagSlot.count, seedBagSlot.data, seedBagSlot.extra);
        container.clearSlot("slotSeedIn");
        container.sendChanges();
    };
    CropAnalyser.getSeedName = function (name) {
        return Translation.translate(name);
    };
    CropAnalyser.energyForLevel = function (level) {
        switch (level) {
            default: {
                return 10;
            }
            case 1: {
                return 90;
            }
            case 2: {
                return 900;
            }
            case 3: {
                return 9000;
            }
        }
    };
    CropAnalyser.getStringTier = function (tier) {
        switch (tier) {
            default: {
                return "0";
            }
            case 1: {
                return "I";
            }
            case 2: {
                return "II";
            }
            case 3: {
                return "III";
            }
            case 4: {
                return "IV";
            }
            case 5: {
                return "V";
            }
            case 6: {
                return "VI";
            }
            case 7: {
                return "VII";
            }
            case 8: {
                return "VIII";
            }
            case 9: {
                return "IX";
            }
            case 10: {
                return "X";
            }
            case 11: {
                return "XI";
            }
            case 12: {
                return "XII";
            }
            case 13: {
                return "XIII";
            }
            case 14: {
                return "XIV";
            }
            case 15: {
                return "XV";
            }
            case 16: {
                return "XVI";
            }
        }
    };
    return CropAnalyser;
}(ItemCommon));
var CropAnalyserGUI;
(function (CropAnalyserGUI) {
    var guiAddConst = 16;
    var guiAnalyserObject = {
        location: {
            x: 0,
            y: 0,
            width: 1000,
            height: 1000
        },
        drawing: [
            { type: "background", color: 0 },
            { type: "bitmap", x: 250, y: 27, bitmap: "agricultural_analyser", scale: GUI_SCALE / 2.3 },
        ],
        elements: {
            "closeButton": { type: "closeButton", x: 672, y: 47, bitmap: "close_button_small", scale: GUI_SCALE },
            "textName": { type: "text", font: { size: 18 }, x: 424, y: 59, width: 256, height: 42, text: Translation.translate("Crop Analyzer") },
            "slotSeedIn": { type: "slot", x: 265, y: 45, size: GUI_SCALE * 16 },
            "slotSeedOut": { type: "slot", x: 360, y: 45, size: GUI_SCALE * 16 },
            "slotEnergy": { type: "slot", x: 615, y: 45, size: GUI_SCALE * 16 },
            "cropName": { type: "text", font: { size: 18, color: Color.WHITE }, x: 280, y: 135, width: 256, height: 42, text: "" },
            "discoveredByText": { type: "text", font: { size: 18, color: Color.WHITE }, x: 280, y: 215, width: 256, height: 42, text: "" },
            "discoveredBy": { type: "text", font: { size: 18, color: Color.WHITE }, x: 280, y: 255, width: 256, height: 42, text: "" },
            "textTier": { type: "text", font: { size: 18, color: Color.WHITE }, x: 280, y: 175, width: 256, height: 42, text: "" },
            "attributes0": { type: "text", font: { size: 18, color: Color.WHITE }, x: 280, y: 295, width: 256, height: 42, text: "" },
            "attributes1": { type: "text", font: { size: 18, color: Color.WHITE }, x: 280, y: 335, width: 256, height: 42, text: "" },
            "attributes2": { type: "text", font: { size: 18, color: Color.WHITE }, x: 280, y: 375, width: 256, height: 42, text: "" },
            "growthText": { type: "text", font: { size: 18, color: Color.rgb(0, 128, 0) }, x: 560, y: 135, width: 256, height: 42, text: "" },
            "growth": { type: "text", font: { size: 18, color: Color.rgb(0, 128, 0) }, x: 560, y: 175, width: 256, height: 42, text: "" },
            "gainText": { type: "text", font: { size: 18, color: Color.rgb(255, 255, 0) }, x: 560, y: 215, width: 256, height: 42, text: "" },
            "gain": { type: "text", font: { size: 18, color: Color.rgb(255, 255, 0) }, x: 560, y: 255, width: 256, height: 42, text: "" },
            "resistText": { type: "text", font: { size: 18, color: Color.rgb(0, 255, 255) }, x: 560, y: 295, width: 256, height: 42, text: "" },
            "resist": { type: "text", font: { size: 18, color: Color.rgb(0, 255, 255) }, x: 560, y: 335, width: 256, height: 42, text: "" }
        }
    };
    for (var i = 0; i < 9; i++) {
        guiAnalyserObject.elements["slot" + i] = { type: "invSlot", x: 270 + i * 50, y: 425, size: GUI_SCALE * guiAddConst, index: i };
    }
    CropAnalyser.gui = new UI.Window(guiAnalyserObject);
    CropAnalyser.gui.setInventoryNeeded(true);
    Callback.addCallback("LevelLoaded", function () {
        var content = CropAnalyser.gui.getContent();
        var element = content.elements.textName;
        element.text = Translation.translate("crop_analyzer");
    });
})(CropAnalyserGUI || (CropAnalyserGUI = {}));
/// <reference path="ElectricTool.ts" />
var ToolDrill = /** @class */ (function (_super) {
    __extends(ToolDrill, _super);
    function ToolDrill(stringID, name, toolData, maxCharge, transferLimit, tier) {
        var _this = _super.call(this, stringID, name, maxCharge, transferLimit, tier) || this;
        toolData.blockMaterials = ["stone", "dirt"];
        _this.setToolParams(toolData);
        return _this;
    }
    ToolDrill.prototype.onDestroy = function (item, coords, block, player) {
        if (Block.getDestroyTime(block.id) > 0) {
            ICTool.dischargeItem(item, this.getEnergyPerUse(item), player);
            this.playDestroySound(item, block, player);
        }
        return true;
    };
    ToolDrill.prototype.onItemUse = function (coords, item, block, playerUid) {
        var region = WorldRegion.getForActor(playerUid);
        var place = coords;
        if (!World.canTileBeReplaced(block.id, block.data)) {
            place = coords.relative;
            var block2 = region.getBlock(place);
            if (!World.canTileBeReplaced(block2.id, block2.data)) {
                return;
            }
        }
        var player = new PlayerEntity(playerUid);
        for (var i = 0; i < 36; i++) {
            var stack = player.getInventorySlot(i);
            if (stack.id != 50)
                continue;
            if (Block.isSolid(block.id)) {
                region.setBlock(place, 50, (6 - coords.side) % 6);
            }
            else {
                var blockID = region.getBlockId(place.x, place.y - 1, place.z);
                if (Block.isSolid(blockID)) {
                    region.setBlock(place, 50, 5);
                }
                else {
                    break;
                }
            }
            stack.decrease(1);
            player.setInventorySlot(i, stack);
            break;
        }
    };
    ToolDrill.prototype.continueDestroyBlock = function (item, coords, block, progress) {
        if (progress > 0) {
            this.playDestroySound(item, block, Player.get());
        }
    };
    ToolDrill.prototype.playDestroySound = function (item, block, player) {
        if (IC2Config.soundEnabled && ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerUse(item)) {
            var hardness = Block.getDestroyTime(block.id);
            if (hardness > 1 || hardness < 0) {
                SoundManager.startPlaySound(SourceType.ENTITY, player, "DrillHard.ogg");
            }
            else if (hardness > 0) {
                SoundManager.startPlaySound(SourceType.ENTITY, player, "DrillSoft.ogg");
            }
        }
    };
    return ToolDrill;
}(ElectricTool));
var ElectricTreetap = /** @class */ (function (_super) {
    __extends(ElectricTreetap, _super);
    function ElectricTreetap() {
        var _this = _super.call(this, "electricTreetap", "electric_treetap", 10000, 100, 1) || this;
        _this.energyPerUse = 50;
        return _this;
    }
    ElectricTreetap.prototype.onItemUse = function (coords, item, block, player) {
        if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2 && ICTool.useElectricItem(item, this.energyPerUse, player)) {
            var region = WorldRegion.getForActor(player);
            SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
            region.setBlock(coords, BlockID.rubberTreeLogLatex, block.data - 4);
            var entity = region.dropAtBlock(coords.relative.x, coords.relative.y, coords.relative.z, ItemID.latex, MathUtil.randomInt(1, 3), 0);
            Entity.setVelocity(entity, (coords.relative.x - coords.x) * 0.25, (coords.relative.y - coords.y) * 0.25, (coords.relative.z - coords.z) * 0.25);
        }
    };
    return ElectricTreetap;
}(ItemElectric));
var ItemPainter = /** @class */ (function (_super) {
    __extends(ItemPainter, _super);
    function ItemPainter(colorIndex) {
        var _this = this;
        var itemIndex = colorIndex + 1;
        var color = INDEX_TO_COLOR[colorIndex];
        _this = _super.call(this, "icPainter" + itemIndex, "painter." + color, { name: "ic_painter", meta: itemIndex }) || this;
        _this.setMaxStack(1);
        _this.setMaxDamage(16);
        _this.setCategory(ItemCategory.EQUIPMENT);
        _this.color = colorIndex;
        return _this;
    }
    ItemPainter.prototype.onItemUse = function (coords, item, block, player) {
        if (CableRegistry.canBePainted(block.id) && block.data != this.color) {
            var region = BlockSource.getDefaultForActor(player);
            region.setBlock(coords.x, coords.y, coords.z, 0, 0);
            region.setBlock(coords.x, coords.y, coords.z, block.id, this.color);
            var node = EnergyNet.getNodeOnCoords(region, coords.x, coords.y, coords.z);
            if (node) {
                node.destroy();
                EnergyGridBuilder.rebuildForWire(region, coords.x, coords.y, coords.z, block.id);
            }
            if (Game.isItemSpendingAllowed(player)) {
                if (++item.data >= Item.getMaxDamage(item.id))
                    item.id = ItemID.icPainter;
                Entity.setCarriedItem(player, item.id, 1, item.data);
            }
            SoundManager.playSoundAt(coords.x + .5, coords.y + .5, coords.z + .5, "Painters.ogg");
        }
    };
    return ItemPainter;
}(ItemCommon));
ItemRegistry.createItem("toolbox", { name: "tool_box", icon: "tool_box", stack: 1, category: ItemCategory.EQUIPMENT });
var toolboxItems = [
    ItemID.treetap, ItemID.craftingHammer, ItemID.cutter, ItemID.electricHoe, ItemID.electricTreetap, ItemID.EUMeter,
    ItemID.cableTin0, ItemID.cableTin1, ItemID.cableCopper0, ItemID.cableCopper1,
    ItemID.cableGold0, ItemID.cableGold1, ItemID.cableGold2,
    ItemID.cableIron0, ItemID.cableIron1, ItemID.cableIron2, ItemID.cableIron3, ItemID.cableOptic
];
BackpackRegistry.register(ItemID.toolbox, {
    title: "Tool Box",
    slots: 10,
    inRow: 5,
    slotsCenter: true,
    isValidItem: function (id, count, data) {
        if (toolboxItems.indexOf(id) != -1)
            return true;
        if (ToolAPI.getToolData(id) || ICTool.getWrenchData(id))
            return true;
        return false;
    }
});
var UpgradeMFSU = /** @class */ (function (_super) {
    __extends(UpgradeMFSU, _super);
    function UpgradeMFSU() {
        var _this = _super.call(this, "upgradeMFSU", "mfsu_upgrade", "mfsu_upgrade") || this;
        _this.setCategory(ItemCategory.EQUIPMENT);
        return _this;
    }
    UpgradeMFSU.prototype.onItemUse = function (coords, item, block, player) {
        if (block.id == BlockID.storageMFE) {
            var region = WorldRegion.getForActor(player);
            var tile = region.getTileEntity(coords);
            tile.selfDestroy();
            region.setBlock(coords, BlockID.storageMFSU, tile.getFacing());
            var newTile = region.addTileEntity(coords);
            newTile.data = tile.data;
            Entity.setCarriedItem(player, item.id, item.count - 1, 0);
        }
    };
    return UpgradeMFSU;
}(ItemCommon));
var ToolWrench = /** @class */ (function (_super) {
    __extends(ToolWrench, _super);
    function ToolWrench(stringID, name, icon) {
        var _this = _super.call(this, stringID, name, icon) || this;
        _this.setMaxStack(1);
        _this.setMaxDamage(161);
        _this.setCategory(ItemCategory.EQUIPMENT);
        ICTool.registerWrench(_this.id, _this);
        return _this;
    }
    ToolWrench.prototype.isUseable = function (item, damage) {
        return true;
    };
    ToolWrench.prototype.useItem = function (item, damage, player) {
        item.applyDamage(damage);
        Entity.setCarriedItem(player, item.id, 1, item.data, item.extra);
        if (item.id == 0) {
            var region = WorldRegion.getForActor(player);
            region.playSoundAtEntity(player, "random.break");
        }
    };
    return ToolWrench;
}(ItemCommon));
ItemRegistry.createItem("containmentBox", { name: "containment_box", icon: "containment_box", stack: 1, category: ItemCategory.EQUIPMENT });
var guiContainmentBox = new UI.StandartWindow({
    standard: {
        header: { text: { text: Translation.translate("Containment Box") } },
        inventory: { standard: true },
        background: { standard: true }
    },
    drawing: [
        { type: "background", color: Color.parseColor("#d5d9b9") },
        { type: "bitmap", x: 415, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE },
        { type: "bitmap", x: 805, y: 112, bitmap: "containment_box_image", scale: GUI_SCALE },
        { type: "bitmap", x: 415, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE },
        { type: "bitmap", x: 805, y: 232, bitmap: "containment_box_image", scale: GUI_SCALE },
    ],
    elements: {
        "slot0": { type: "slot", x: 530, y: 120 },
        "slot1": { type: "slot", x: 590, y: 120 },
        "slot2": { type: "slot", x: 650, y: 120 },
        "slot3": { type: "slot", x: 710, y: 120 },
        "slot4": { type: "slot", x: 530, y: 180 },
        "slot5": { type: "slot", x: 590, y: 180 },
        "slot6": { type: "slot", x: 650, y: 180 },
        "slot7": { type: "slot", x: 710, y: 180 },
        "slot8": { type: "slot", x: 530, y: 240 },
        "slot9": { type: "slot", x: 590, y: 240 },
        "slot10": { type: "slot", x: 650, y: 240 },
        "slot11": { type: "slot", x: 710, y: 240 },
    }
});
BackpackRegistry.register(ItemID.containmentBox, {
    title: "Containment Box",
    gui: guiContainmentBox,
    isValidItem: function (id, count, data) {
        return RadiationAPI.isRadioactiveItem(id);
    }
});
var DebugItem = /** @class */ (function (_super) {
    __extends(DebugItem, _super);
    function DebugItem() {
        var _this = _super.call(this, "debugItem", "debug_item", -1, -1, 0, false) || this;
        _this.canProvideEnergy = true;
        if (Game.isDeveloperMode)
            Item.addToCreative(_this.id, 1, 0);
        return _this;
    }
    DebugItem.prototype.onCharge = function (item, amount, tier, addAll) {
        return amount;
    };
    DebugItem.prototype.onDischarge = function (item, amount, tier, getAll) {
        return amount;
    };
    DebugItem.prototype.onNameOverride = function (item, name) {
        return name + "\n§7" + "Infinite EU";
    };
    DebugItem.prototype.onItemUse = function (coords, item, block, player) {
        var _a;
        var client = Network.getClientForPlayer(player);
        if (!client)
            return;
        client.sendMessage(block.id + ":" + block.data);
        var region = WorldRegion.getForActor(player);
        var tile = region.getTileEntity(coords);
        if (tile) {
            var liquid = (_a = tile.liquidStorage) === null || _a === void 0 ? void 0 : _a.getLiquidStored();
            if (liquid) {
                client.sendMessage(liquid + " - " + tile.liquidStorage.getAmount(liquid) * 1000 + " mB");
            }
            for (var key in tile.data) {
                var value = tile.data[key];
                if (key == "energy") {
                    client.sendMessage("energy: " + value + "/" + tile.getEnergyStorage());
                }
                else
                    try {
                        if (typeof value == "object") {
                            client.sendMessage(key + ": " + JSON.stringify(value));
                        }
                        else {
                            client.sendMessage(key + ": " + value);
                        }
                    }
                    catch (e) {
                        client.sendMessage(key);
                    }
            }
        }
        var node = EnergyNet.getNodeOnCoords(region.blockSource, coords.x, coords.y, coords.z);
        if (node)
            client.sendMessage(node.toString());
    };
    return DebugItem;
}(ItemElectric));
/// <reference path="ElectricTool.ts" />
var ElectricHoe = /** @class */ (function (_super) {
    __extends(ElectricHoe, _super);
    function ElectricHoe() {
        var _this = _super.call(this, "electricHoe", "electric_hoe", 10000, 100, 1) || this;
        _this.energyPerUse = 50;
        _this.setToolParams({ energyPerUse: 50, level: 3, efficiency: 12, damage: 4, blockMaterials: ["plant"] });
        return _this;
    }
    ElectricHoe.prototype.onItemUse = function (coords, item, block, player) {
        if ((block.id == 2 || block.id == 3 || block.id == 110 || block.id == 243) && coords.side != 0 && ICTool.useElectricItem(item, this.energyPerUse, player)) {
            var region = WorldRegion.getForActor(player);
            region.setBlock(coords, 60, 0);
            region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
        }
    };
    return ElectricHoe;
}(ElectricTool));
var ElectricWrench = /** @class */ (function (_super) {
    __extends(ElectricWrench, _super);
    function ElectricWrench() {
        var _this = _super.call(this, "electricWrench", "electric_wrench", 10000, 100, 1) || this;
        _this.energyPerUse = 100;
        ICTool.registerWrench(_this.id, _this);
        return _this;
    }
    ElectricWrench.prototype.isUseable = function (item, damage) {
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        return energyStored >= this.energyPerUse * damage;
    };
    ElectricWrench.prototype.useItem = function (item, damage, player) {
        ICTool.useElectricItem(item, this.energyPerUse * damage, player);
    };
    return ElectricWrench;
}(ItemElectric));
var ItemMiningLaser = /** @class */ (function (_super) {
    __extends(ItemMiningLaser, _super);
    function ItemMiningLaser() {
        var _this = _super.call(this, "miningLaser", "mining_laser", 1000000, 2048, 3) || this;
        _this.modes = {
            0: { name: "mining", energy: 1250, power: 6 },
            1: { name: "low_focus", energy: 100, range: 4, power: 6, blockBreaks: 1, dropChance: 1, sound: "MiningLaserLowFocus.ogg" },
            2: { name: "long_range", energy: 5000, power: 20, sound: "MiningLaserLongRange.ogg" },
            3: { name: "horizontal", energy: 1250, power: 6 },
            4: { name: "super_heat", energy: 2500, power: 8, smelt: true },
            5: { name: "scatter", energy: 10000, power: 12, blockBreaks: 16, sound: "MiningLaserScatter.ogg" },
            6: { name: "3x3", energy: 10000, power: 6 }
        };
        _this.setHandEquipped(true);
        _this.setRarity(EnumRarity.UNCOMMON);
        ToolHUD.setButtonFor(_this.id, "button_switch");
        return _this;
    }
    ItemMiningLaser.prototype.readMode = function (extra) {
        if (!extra)
            return 0;
        return extra.getInt("mode");
    };
    ItemMiningLaser.prototype.getModeProperties = function (mode) {
        return this.modes[mode];
    };
    ItemMiningLaser.prototype.getModeName = function (mode) {
        return "mining_laser." + this.getModeProperties(mode).name;
    };
    ItemMiningLaser.prototype.onNameOverride = function (item, name) {
        name = _super.prototype.onNameOverride.call(this, item, name);
        var mode = this.readMode(item.extra);
        name += "\n" + Translation.translate("Mode: %s").replace("%s", Translation.translate(this.getModeName(mode)));
        return name;
    };
    ItemMiningLaser.prototype.onModeSwitch = function (item, player) {
        var extra = item.extra || new ItemExtraData();
        var mode = (extra.getInt("mode") + 1) % 7;
        extra.putInt("mode", mode);
        Entity.setCarriedItem(player, item.id, 1, item.data, extra);
        var client = Network.getClientForPlayer(player);
        BlockEngine.sendMessage(client, "Mode: %s", this.getModeName(mode));
    };
    ItemMiningLaser.prototype.makeShot = function (item, player) {
        var laserSetting = this.readMode(item.extra);
        if (laserSetting == 3 || laserSetting == 6)
            return;
        var mode = this.getModeProperties(laserSetting);
        if (ICTool.useElectricItem(item, mode.energy, player)) {
            SoundManager.playSoundAtEntity(player, mode.sound || "MiningLaser.ogg");
            var pos = Entity.getPosition(player);
            var angle = Entity.getLookAngle(player);
            var dir = new Vector3(Entity.getLookVectorByAngle(angle));
            if (laserSetting == 5) {
                var look = dir;
                var right = look.copy().cross(Vector3.UP);
                if (right.lengthSquared() < 1e-4) {
                    right.set(Math.sin(angle.yaw), 0.0, -Math.cos(angle.yaw));
                }
                else {
                    right.normalize();
                }
                var up = right.copy().cross(look);
                look.scale(8.0);
                for (var r = -2; r <= 2; r++) {
                    for (var u = -2; u <= 2; u++) {
                        dir = look.copy().addScaled(right, r).addScaled(up, u).normalize();
                        LaserShotProvider.shootLaser(player, pos, dir, mode);
                    }
                }
            }
            else {
                LaserShotProvider.shootLaser(player, pos, dir, mode);
            }
        }
    };
    ItemMiningLaser.prototype.onNoTargetUse = function (item, player) {
        this.makeShot(item, player);
    };
    ItemMiningLaser.prototype.onItemUse = function (coords, item, block, player) {
        var laserSetting = this.readMode(item.extra);
        if (laserSetting != 3 && laserSetting != 6) {
            this.makeShot(item, player);
            return;
        }
        var mode = this.getModeProperties(laserSetting);
        if (ICTool.useElectricItem(item, mode.energy, player)) {
            SoundManager.playSoundAtEntity(player, mode.sound || "MiningLaser.ogg");
            var pos = Entity.getPosition(player);
            var angle = Entity.getLookAngle(player);
            var dir = new Vector3(Entity.getLookVectorByAngle(angle));
            if (Math.abs(angle.pitch) < 1 / Math.sqrt(2)) {
                dir.y = 0;
                dir.normalize();
                var start = { x: pos.x, y: coords.y + 0.5, z: pos.z };
                if (laserSetting == 6) {
                    var playerRotation = TileRenderer.getBlockRotation(player);
                    if (playerRotation <= 1) {
                        for (var y = start.y - 1; y <= start.y + 1; y++) {
                            for (var x = start.x - 1; x <= start.x + 1; x++) {
                                LaserShotProvider.shootLaser(player, { x: x, y: y, z: start.z }, dir, mode);
                            }
                        }
                    }
                    else {
                        for (var y = start.y - 1; y <= start.y + 1; y++) {
                            for (var z = start.z - 1; z <= start.z + 1; z++) {
                                LaserShotProvider.shootLaser(player, { x: start.x, y: y, z: z }, dir, mode);
                            }
                        }
                    }
                }
                else {
                    LaserShotProvider.shootLaser(player, start, dir, mode);
                }
            }
            else if (laserSetting == 6) {
                dir.x = 0.0;
                dir.z = 0.0;
                dir.normalize();
                var start = { x: coords.x + 0.5, y: pos.y, z: coords.z + 0.5 };
                for (var x = start.x - 1; x <= start.x + 1; x++) {
                    for (var z = start.z - 1; z <= start.z + 1; z++) {
                        LaserShotProvider.shootLaser(player, { x: x, y: start.y, z: z }, dir, mode);
                    }
                }
            }
            else {
                var client = Network.getClientForPlayer(player);
                BlockEngine.sendMessage(client, "message.mining_laser.aiming");
            }
        }
    };
    return ItemMiningLaser;
}(ItemElectric));
var ItemTransmitter = /** @class */ (function (_super) {
    __extends(ItemTransmitter, _super);
    function ItemTransmitter() {
        var _this = _super.call(this, "freqTransmitter", "frequency_transmitter", "frequency_transmitter") || this;
        _this.setMaxStack(1);
        _this.setCategory(ItemCategory.EQUIPMENT);
        return _this;
    }
    ItemTransmitter.prototype.onNameOverride = function (item, name) {
        var extra = item.extra;
        if (extra) {
            name += "\n\u00A77x: " + extra.getInt("x") + ", y: " + extra.getInt("y") + ", z: " + extra.getInt("z");
        }
        return name;
    };
    ItemTransmitter.prototype.onItemUse = function (coords, item, block, player) {
        var client = Network.getClientForPlayer(player);
        if (!client)
            return;
        var receiveCoords;
        var dimension = Entity.getDimension(player);
        var extra = item.extra;
        if (extra) {
            receiveCoords = { x: extra.getInt("x"), y: extra.getInt("y"), z: extra.getInt("z") };
        }
        else {
            extra = new ItemExtraData();
        }
        if (block.id == BlockID.teleporter) {
            if (!receiveCoords) {
                extra.putInt("x", coords.x);
                extra.putInt("y", coords.y);
                extra.putInt("z", coords.z);
                extra.putInt("dimension", dimension);
                Entity.setCarriedItem(player, item.id, 1, item.data, extra);
                BlockEngine.sendMessage(client, "message.freq_transmitter.linked");
            }
            else {
                if (dimension != extra.getInt("dimension"))
                    return;
                if (receiveCoords.x == coords.x && receiveCoords.y == coords.y && receiveCoords.z == coords.z) {
                    BlockEngine.sendMessage(client, "message.freq_transmitter.notlinked");
                }
                else {
                    var region = WorldRegion.getForActor(player);
                    var data = region.getTileEntity(coords).data;
                    var distance = Entity.getDistanceBetweenCoords(coords, receiveCoords);
                    var basicTeleportCost = Math.floor(5 * Math.pow((distance + 10), 0.7));
                    var receiver = region.getTileEntity(receiveCoords);
                    if (receiver) {
                        data.frequency = receiveCoords;
                        data.frequency.energy = basicTeleportCost;
                        data = receiver.data;
                        data.frequency = coords;
                        data.frequency.energy = basicTeleportCost;
                        BlockEngine.sendMessage(client, "message.freq_transmitter.established");
                    }
                }
            }
        }
        else if (receiveCoords) {
            Entity.setCarriedItem(player, item.id, 1, item.data);
            BlockEngine.sendMessage(client, "message.freq_transmitter.unlinked");
        }
    };
    return ItemTransmitter;
}(ItemCommon));
var ItemWeedingTrowel = /** @class */ (function (_super) {
    __extends(ItemWeedingTrowel, _super);
    function ItemWeedingTrowel() {
        var _this = _super.call(this, "weedingTrowel", "weeding_trowel", "weeding_trowel") || this;
        _this.setMaxStack(1);
        _this.setCategory(ItemCategory.EQUIPMENT);
        return _this;
    }
    ItemWeedingTrowel.prototype.onItemUse = function (coords, item, block, player) {
        var region = WorldRegion.getForActor(player);
        var te = region.getTileEntity(coords);
        if (block.id == BlockID.crop && te.crop && te.crop.getID() == "weed") {
            region.dropAtBlock(coords.x, coords.y, coords.z, ItemID.weed, te.data.currentSize, 0);
            te.reset();
            te.updateRender();
        }
    };
    return ItemWeedingTrowel;
}(ItemCommon));
/// <reference path="Drill.ts" />
var ToolDrillIridium = /** @class */ (function (_super) {
    __extends(ToolDrillIridium, _super);
    function ToolDrillIridium() {
        var _this = _super.call(this, "iridiumDrill", "iridium_drill", { energyPerUse: 800, level: 100, efficiency: 24, damage: 5 }, 1000000, 2048, 3) || this;
        _this.setGlint(true);
        _this.setRarity(EnumRarity.RARE);
        ToolHUD.setButtonFor(_this.id, "button_switch");
        return _this;
    }
    ToolDrillIridium.prototype.readMode = function (extra) {
        if (!extra)
            return 0;
        return extra.getInt("mode");
    };
    ToolDrillIridium.prototype.getModeName = function (mode) {
        switch (mode) {
            case 0:
                return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.fortune"));
            case 1:
                return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.silk_touch"));
            case 2:
                return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.fortune_3x3"));
            case 3:
                return Translation.translate("Mode: %s").replace("%s", Translation.translate("iridium_drill.silk_touch_3x3"));
        }
    };
    ToolDrillIridium.prototype.onNameOverride = function (item, name) {
        name = _super.prototype.onNameOverride.call(this, item, name);
        var mode = this.readMode(item.extra);
        return name + "\n" + this.getModeName(mode);
    };
    ToolDrillIridium.prototype.onModeSwitch = function (item, player) {
        var extra = item.extra || new ItemExtraData();
        var mode = (extra.getInt("mode") + 1) % 4;
        extra.putInt("mode", mode);
        Entity.setCarriedItem(player, item.id, 1, item.data, extra);
        var client = Network.getClientForPlayer(player);
        switch (mode) {
            case 0:
                BlockEngine.sendMessage(client, "§e", "Mode: %s", "iridium_drill.fortune");
                break;
            case 1:
                BlockEngine.sendMessage(client, "§9", "Mode: %s", "iridium_drill.silk_touch");
                break;
            case 2:
                BlockEngine.sendMessage(client, "§c", "Mode: %s", "iridium_drill.fortune_3x3");
                break;
            case 3:
                BlockEngine.sendMessage(client, "§2", "Mode: %s", "iridium_drill.silk_touch_3x3");
                break;
        }
    };
    ToolDrillIridium.prototype.modifyEnchant = function (enchant, item) {
        var mode = this.readMode(item.extra);
        if (mode % 2 == 0) {
            enchant.fortune = 3;
        }
        else {
            enchant.silk = true;
        }
    };
    ToolDrillIridium.prototype.getOperationRadius = function (side) {
        var rad = { x: 1, y: 1, z: 1 };
        if (side == BlockSide.EAST || side == BlockSide.WEST)
            rad.x = 0;
        if (side == BlockSide.UP || side == BlockSide.DOWN)
            rad.y = 0;
        if (side == BlockSide.NORTH || side == BlockSide.SOUTH)
            rad.z = 0;
        return rad;
    };
    ToolDrillIridium.prototype.calcDestroyTime = function (item, coords, block, params, destroyTime) {
        if (ChargeItemRegistry.getEnergyStored(item) >= this.getEnergyPerUse(item)) {
            var mode = this.readMode(item.extra);
            var material = ToolAPI.getBlockMaterialName(block.id);
            if (mode >= 2 && (material == "dirt" || material == "stone")) {
                destroyTime = 0;
                var rad = this.getOperationRadius(coords.side);
                for (var xx = coords.x - rad.x; xx <= coords.x + rad.x; xx++)
                    for (var yy = coords.y - rad.y; yy <= coords.y + rad.y; yy++)
                        for (var zz = coords.z - rad.z; zz <= coords.z + rad.z; zz++) {
                            var blockID = World.getBlockID(xx, yy, zz);
                            var material_1 = ToolAPI.getBlockMaterial(blockID);
                            if (material_1 && (material_1.name == "dirt" || material_1.name == "stone")) {
                                destroyTime = Math.max(destroyTime, Block.getDestroyTime(blockID) / material_1.multiplier / this.toolMaterial.efficiency);
                            }
                        }
            }
            return destroyTime;
        }
        return params.base;
    };
    ToolDrillIridium.prototype.onDestroy = function (item, coords, block, player) {
        this.playDestroySound(item, block, player);
        var mode = this.readMode(item.extra);
        var material = ToolAPI.getBlockMaterialName(block.id);
        var energyStored = ChargeItemRegistry.getEnergyStored(item);
        if (mode >= 2 && (material == "dirt" || material == "stone") && energyStored >= this.energyPerUse * 2) {
            var consume = this.destroy3x3Area(coords, player, energyStored);
            if (consume > 0) {
                ICTool.dischargeItem(item, consume, player);
            }
        }
        else if (Block.getDestroyTime(block.id) > 0) {
            ICTool.dischargeItem(item, this.energyPerUse, player);
        }
        return true;
    };
    ToolDrillIridium.prototype.destroy3x3Area = function (coords, player, energyStored) {
        var region = WorldRegion.getForActor(player);
        var consume = this.energyPerUse;
        var rad = this.getOperationRadius(coords.side);
        for (var xx = coords.x - rad.x; xx <= coords.x + rad.x; xx++)
            for (var yy = coords.y - rad.y; yy <= coords.y + rad.y; yy++)
                for (var zz = coords.z - rad.z; zz <= coords.z + rad.z; zz++) {
                    if (xx == coords.x && yy == coords.y && zz == coords.z) {
                        continue;
                    }
                    var blockID = region.getBlockId(xx, yy, zz);
                    var material = ToolAPI.getBlockMaterialName(blockID);
                    if (material == "dirt" || material == "stone") {
                        consume += this.energyPerUse;
                        region.destroyBlock(xx, yy, zz, true, player);
                        if (energyStored < consume + this.energyPerUse) {
                            return consume;
                        }
                    }
                }
        return consume;
    };
    return ToolDrillIridium;
}(ToolDrill));
var ItemNanoSaber = /** @class */ (function (_super) {
    __extends(ItemNanoSaber, _super);
    function ItemNanoSaber() {
        var _this = _super.call(this, "nanoSaber", "nano_saber", 1000000, 2048, 3) || this;
        _this.damage = 4;
        _this.setToolParams({ energyPerUse: 64, level: 0, damage: 16, efficiency: 4 });
        _this.setRarity(EnumRarity.UNCOMMON);
        return _this;
        //ICTool.setOnHandSound(this.id, "NanosaberIdle.ogg");
    }
    ItemNanoSaber.prototype.onIconOverride = function (item) {
        if (item.extra && item.extra.getBoolean("active")) {
            return { name: this.icon.name, meta: 1 + World.getThreadTime() % 2 };
        }
        return { name: this.icon.name, meta: 0 };
    };
    ItemNanoSaber.prototype.onAttack = function (item, victim, attacker) {
        if (item.extra && item.extra.getBoolean("active")) {
            this.toolMaterial.damage = 16;
            SoundManager.playSoundAtEntity(attacker, "NanosaberSwing.ogg");
        }
        else {
            this.toolMaterial.damage = 0;
        }
        return true;
    };
    ItemNanoSaber.prototype.onNoTargetUse = function (item, player) {
        var extra = item.extra || new ItemExtraData();
        if (extra.getBoolean("active")) {
            extra.putBoolean("active", false);
            Entity.setCarriedItem(player, item.id, 1, item.data, extra);
        }
        else if (ChargeItemRegistry.getEnergyStored(item) >= 64) {
            extra.putBoolean("active", true);
            Entity.setCarriedItem(player, item.id, 1, item.data, extra);
            SoundManager.playSoundAtEntity(player, "NanosaberPowerup.ogg");
        }
    };
    /** KEX compatibility for dynamic Nano Saber damage */
    ItemNanoSaber.prototype.getAttackDamageBonus = function (item) {
        return item.extra && item.extra.getBoolean("active") ? 16 : 0;
    };
    ItemNanoSaber.onTick = function (playerUid) {
        if (World.getThreadTime() % 20 == 0) {
            var player = new PlayerActor(playerUid);
            for (var i = 0; i < 36; i++) {
                var item = player.getInventorySlot(i);
                if (item.id == ItemID.nanoSaber && item.extra && item.extra.getBoolean("active")) {
                    var energyStored = Math.max(ChargeItemRegistry.getEnergyStored(item) - 1280, 0);
                    if (energyStored < 64) {
                        item.extra.putBoolean("active", false);
                    }
                    ChargeItemRegistry.setEnergyStored(item, energyStored);
                    player.setInventorySlot(i, item.id, 1, item.data, item.extra);
                }
            }
        }
    };
    return ItemNanoSaber;
}(ElectricTool));
Callback.addCallback("ServerPlayerTick", function (playerUid, isPlayerDead) {
    ItemNanoSaber.onTick(playerUid);
});
var ore_blocks = [14, 15, 16, 21, 73, 74, 56, 129, 153];
if (BlockEngine.getMainGameVersion() >= 16) {
    ore_blocks.push(VanillaTileID.nether_gold_ore, VanillaTileID.gilded_blackstone, VanillaTileID.ancient_debris);
}
Callback.addCallback("PreLoaded", function () {
    for (var id in BlockID) {
        if (id.startsWith("ore") && !TileEntity.isTileEntityBlock(BlockID[id])) {
            ore_blocks.push(BlockID[id]);
        }
    }
});
var ItemScanner = /** @class */ (function (_super) {
    __extends(ItemScanner, _super);
    function ItemScanner(stringID, name, maxCharge, transferLimit, tier) {
        return _super.call(this, stringID, name, maxCharge, transferLimit, tier) || this;
    }
    ItemScanner.prototype.getScanRadius = function () {
        return this.tier == 1 ? 3 : 6;
    };
    ItemScanner.prototype.getEnergyPerUse = function () {
        return this.tier == 1 ? 50 : 250;
    };
    ItemScanner.prototype.onItemUse = function (coords, item, block, player) {
        var client = Network.getClientForPlayer(player);
        if (client && ICTool.useElectricItem(item, this.getEnergyPerUse(), player)) {
            SoundManager.playSoundAtEntity(player, "ODScanner.ogg");
            BlockEngine.sendMessage(client, "message.scan_result", coords.x + ", " + coords.y + ", " + coords.z);
            var ores = {};
            var radius = this.getScanRadius();
            var region = BlockSource.getDefaultForActor(player);
            for (var x = coords.x - radius; x <= coords.x + radius; x++) {
                for (var y = coords.y - radius; y <= coords.y + radius; y++) {
                    for (var z = coords.z - radius; z <= coords.z + radius; z++) {
                        var blockID = region.getBlockId(x, y, z);
                        if (ore_blocks.indexOf(blockID) != -1) {
                            if (!ores[blockID])
                                ores[blockID] = 0;
                            ores[blockID]++;
                        }
                    }
                }
            }
            for (var id in ores) {
                var itemID = Block.convertBlockToItemId(parseInt(id));
                client.sendMessage(Item.getName(itemID, 0) + " - " + ores[id]);
            }
        }
    };
    return ItemScanner;
}(ItemElectric));
var ItemTreetap = /** @class */ (function (_super) {
    __extends(ItemTreetap, _super);
    function ItemTreetap() {
        var _this = _super.call(this, "treetap", "treetap", "treetap") || this;
        _this.setMaxStack(1);
        _this.setMaxDamage(17);
        _this.setCategory(ItemCategory.EQUIPMENT);
        return _this;
    }
    ItemTreetap.prototype.onItemUse = function (coords, item, block, player) {
        if (block.id == BlockID.rubberTreeLogLatex && block.data >= 4 && block.data == coords.side + 2) {
            var region = WorldRegion.getForActor(player);
            SoundManager.playSoundAt(coords.vec.x, coords.vec.y, coords.vec.z, "Treetap.ogg");
            region.setBlock(coords, BlockID.rubberTreeLogLatex, block.data - 4);
            Entity.setCarriedItem(player, item.id, ++item.data < 17 ? item.count : 0, item.data);
            var entity = region.dropAtBlock(coords.relative.x, coords.relative.y, coords.relative.z, ItemID.latex, MathUtil.randomInt(1, 3), 0);
            Entity.setVelocity(entity, (coords.relative.x - coords.x) * 0.25, (coords.relative.y - coords.y) * 0.25, (coords.relative.z - coords.z) * 0.25);
        }
    };
    return ItemTreetap;
}(ItemCommon));
var ItemWindMeter = /** @class */ (function (_super) {
    __extends(ItemWindMeter, _super);
    function ItemWindMeter() {
        var _this = _super.call(this, "windMeter", "wind_meter", 10000, 100, 1) || this;
        _this.energyPerUse = 50;
        return _this;
    }
    ItemWindMeter.prototype.onNoTargetUse = function (item, player) {
        var client = Network.getClientForPlayer(player);
        if (client && ICTool.useElectricItem(item, this.energyPerUse, player)) {
            var height = Entity.getPosition(player).y;
            var windStrength = Math.round(WindSim.getWindAt(height) * 100) / 100;
            client.sendMessage("Wind Strength: " + windStrength + " MCW");
        }
    };
    return ItemWindMeter;
}(ItemElectric));
/// <reference path="EUMeterUpdatable.ts" />
var EUMeter = /** @class */ (function (_super) {
    __extends(EUMeter, _super);
    function EUMeter() {
        var _this = _super.call(this, "EUMeter", "eu_meter", "eu_meter") || this;
        _this.setMaxStack(1);
        _this.setCategory(ItemCategory.EQUIPMENT);
        ItemContainer.registerScreenFactory("eu_meter.ui", function (container, name) {
            var gui = EUMeter.gui;
            var elements = gui.getContent().elements;
            elements.arrow.bitmap = "eu_meter_arrow_0";
            elements.textMode2.text = Translation.translate("EnergyIn");
            return gui;
        });
        return _this;
    }
    EUMeter.prototype.onItemUse = function (coords, item, block, player) {
        var client = Network.getClientForPlayer(player);
        if (!client)
            return;
        var region = BlockSource.getDefaultForActor(player);
        var node = EnergyNet.getNodeOnCoords(region, coords.x, coords.y, coords.z);
        if (node) {
            var updatable = new EUMeterUpdatable(node);
            Updatable.addUpdatable(updatable);
            updatable.openGuiFor(client);
        }
    };
    EUMeter.gui = new UI.Window({
        location: {
            x: 0,
            y: 0,
            width: 1000,
            height: 750
        },
        drawing: [
            { type: "background", color: 0 },
            { type: "bitmap", x: 218, y: 30, bitmap: "eu_meter_background", scale: GUI_SCALE },
        ],
        elements: {
            "arrow": { type: "image", x: 576, y: 206, bitmap: "eu_meter_arrow_0", scale: GUI_SCALE },
            "textName": { type: "text", font: { size: 32 }, x: 378, y: 48, width: 256, height: 42, text: Translation.translate("eu_meter") },
            "textAvg": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 164, width: 256, height: 42, text: Translation.translate("Avg:") },
            "textAvgValue": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 194, width: 256, height: 42, text: "0 EU/t" },
            "textMaxMin": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 240, width: 256, height: 42, text: Translation.translate("Max/Min") },
            "textMaxValue": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 270, width: 256, height: 42, text: "0 EU/t" },
            "textMinValue": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 300, width: 256, height: 42, text: "0 EU/t" },
            "textMode1": { type: "text", font: { size: 22, color: Color.GREEN }, x: 554, y: 164, width: 100, height: 42, text: Translation.translate("Mode:") },
            "textMode2": { type: "text", font: { size: 22, color: Color.GREEN }, x: 554, y: 348, width: 256, height: 42, text: Translation.translate("EnergyIn") },
            "textTime": { type: "text", font: { size: 22, color: Color.GREEN }, x: 266, y: 348, width: 256, height: 42, text: "Cycle: 0 sec" },
            "textReset": { type: "text", font: { size: 22, color: Color.GREEN }, x: 330, y: 392, width: 256, height: 42, text: Translation.translate("Reset") },
            "closeButton": { type: "button", x: 727, y: 40, bitmap: "close_button_small", scale: GUI_SCALE, clicker: {
                    onClick: function (_, container) {
                        container.close();
                    }
                } },
            "resetButton": { type: "button", x: 298, y: 385, bitmap: "eu_meter_reset_button", scale: GUI_SCALE, clicker: {
                    onClick: function (_, container) {
                        container.sendEvent("reset", {});
                    }
                } },
            "arrowButton0": { type: "button", x: 576, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                    onClick: function (pos, container) {
                        container.sendEvent("setMode", { mode: 0 });
                        //@ts-ignore
                        var elements = container.getWindow().getContent().elements;
                        elements.arrow.bitmap = "eu_meter_arrow_0";
                        elements.textMode2.text = Translation.translate("EnergyIn");
                    }
                } },
            "arrowButton1": { type: "button", x: 640, y: 206, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                    onClick: function (pos, container) {
                        container.sendEvent("setMode", { mode: 1 });
                        //@ts-ignore
                        var elements = container.getWindow().getContent().elements;
                        elements.arrow.bitmap = "eu_meter_arrow_1";
                        elements.textMode2.text = Translation.translate("EnergyOut");
                    }
                } },
            "arrowButton2": { type: "button", x: 576, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                    onClick: function (pos, container) {
                        container.sendEvent("setMode", { mode: 2 });
                        //@ts-ignore
                        var elements = container.getWindow().getContent().elements;
                        elements.arrow.bitmap = "eu_meter_arrow_2";
                        elements.textMode2.text = Translation.translate("EnergyGain");
                    }
                } },
            "arrowButton3": { type: "button", x: 640, y: 270, bitmap: "eu_meter_switch_button", scale: GUI_SCALE, clicker: {
                    onClick: function (pos, container) {
                        container.sendEvent("setMode", { mode: 3 });
                        //@ts-ignore
                        var elements = container.getWindow().getContent().elements;
                        elements.arrow.bitmap = "eu_meter_arrow_3";
                        elements.textMode2.text = Translation.translate("Voltage");
                    }
                } },
        }
    });
    return EUMeter;
}(ItemCommon));
Callback.addCallback("LevelLoaded", function () {
    var content = EUMeter.gui.getContent();
    var element = content.elements.textName;
    element.text = Translation.translate("eu_meter");
});
var EUMeterUpdatable = /** @class */ (function () {
    function EUMeterUpdatable(node) {
        var _this = this;
        this.node = node;
        this.mode = 0;
        var container = new ItemContainer();
        this.setupContainer(container);
        this.container = container;
        this.resetValues();
        this.update = function () { return _this.tick(); };
    }
    EUMeterUpdatable.prototype.setupContainer = function (container) {
        var _this = this;
        container.setClientContainerTypeName("eu_meter.ui");
        container.addServerCloseListener(function () {
            _this.destroy();
        });
        container.addServerEventListener("reset", function () { return _this.resetValues(); });
        container.addServerEventListener("setMode", function (container, client, data) {
            _this.mode = data.mode;
            _this.resetValues();
        });
    };
    EUMeterUpdatable.prototype.openGuiFor = function (client) {
        this.container.openFor(client, "eu_meter.ui");
    };
    EUMeterUpdatable.prototype.resetValues = function () {
        this.time = 0;
        this.sum = 0;
        this.minValue = 2e9;
        this.maxValue = -2e9;
    };
    EUMeterUpdatable.prototype.tick = function () {
        if (this.node.removed) {
            this.destroy();
            this.container.close();
            return;
        }
        this.time++;
        var value = this.getValue();
        this.minValue = Math.min(this.minValue, value);
        this.maxValue = Math.max(this.maxValue, value);
        this.sum += value;
        this.container.setText("textMinValue", this.displayValue(this.minValue));
        this.container.setText("textMaxValue", this.displayValue(this.maxValue));
        this.container.setText("textAvgValue", this.displayValue(this.sum / this.time));
        this.container.setText("textTime", Translation.translate("Cycle: ") + Math.floor(this.time / 20) + " " + Translation.translate("sec"));
        this.container.sendChanges();
    };
    EUMeterUpdatable.prototype.getUnit = function () {
        return (this.mode < 3) ? "EU/t" : "V";
    };
    EUMeterUpdatable.prototype.getValue = function () {
        switch (this.mode) {
            case 0:
                return this.node.energyIn;
            case 1:
                return this.node.energyOut;
            case 2:
                return this.node.energyIn - this.node.energyOut;
            case 3:
                return this.node.energyPower;
        }
    };
    EUMeterUpdatable.prototype.displayValue = function (value) {
        return Math.round(value * 100) / 100 + " " + this.getUnit();
    };
    EUMeterUpdatable.prototype.destroy = function () {
        this.remove = true;
    };
    return EUMeterUpdatable;
}());
/// <reference path="ToolBox.ts" />
/// <reference path="ContainmentBox.ts" />
/// <reference path="DebugItem.ts" />
/// <reference path="EUMeter/EUMeter.ts" />
/// <reference path="Transmitter.ts" />
/// <reference path="Scanner.ts" />
/// <reference path="WindMeter.ts" />
/// <reference path="Treetap.ts" />
/// <reference path="crafting.ts" />
/// <reference path="Wrench.ts" />
/// <reference path="ElectricWrench.ts" />
/// <reference path="ElectricTreetap.ts" />
/// <reference path="ElectricHoe.ts" />
/// <reference path="Chainsaw.ts" />
/// <reference path="Drill.ts" />
/// <reference path="DrillIridium.ts" />
/// <reference path="NanoSaber.ts" />
/// <reference path="MiningLaser.ts" />
/// <reference path="CropAnalyser.ts" />
/// <reference path="WeedingTrovel.ts" />
/// <reference path="Painter.ts" />
/// <reference path="UpgradeMFSU.ts" />
ItemRegistry.addToolMaterial("bronze", {
    durability: 225,
    level: 3,
    efficiency: 6,
    damage: 2,
    enchantability: 15,
    repairMaterial: ItemID.ingotBronze
});
ItemRegistry.createTool("bronzeSword", { name: "bronze_sword", icon: "bronze_sword", material: "bronze" }, ToolType.SWORD);
ItemRegistry.createTool("bronzeShovel", { name: "bronze_shovel", icon: "bronze_shovel", material: "bronze" }, ToolType.SHOVEL);
ItemRegistry.createTool("bronzePickaxe", { name: "bronze_pickaxe", icon: "bronze_pickaxe", material: "bronze" }, ToolType.PICKAXE);
ItemRegistry.createTool("bronzeAxe", { name: "bronze_axe", icon: "bronze_axe", material: "bronze" }, ToolType.AXE);
ItemRegistry.createTool("bronzeHoe", { name: "bronze_hoe", icon: "bronze_hoe", material: "bronze" }, ToolType.HOE);
ItemRegistry.registerItem(new DebugItem());
ItemRegistry.registerItem(new ItemTransmitter());
ItemRegistry.registerItem(new ItemScanner("scanner", "scanner", 10000, 100, 1));
ItemRegistry.registerItem(new ItemScanner("scannerAdvanced", "scanner_advanced", 100000, 256, 2));
ItemRegistry.registerItem(new ItemWindMeter());
ItemRegistry.registerItem(new ItemTreetap());
ItemRegistry.registerItem(new ToolWrench("bronzeWrench", "wrench", "bronze_wrench"));
ItemRegistry.registerItem(new ElectricWrench());
ItemRegistry.registerItem(new ElectricTreetap());
ItemRegistry.registerItem(new ElectricHoe());
ItemRegistry.registerItem(new CropAnalyser());
ItemRegistry.registerItem(new EUMeter());
ItemRegistry.registerItem(new ElectricChainsaw("chainsaw", "chainsaw", { energyPerUse: 100, level: 3, efficiency: 12, damage: 6 }, 30000, 100, 1));
ItemRegistry.registerItem(new ToolDrill("drill", "drill", { energyPerUse: 50, level: 3, efficiency: 8, damage: 3 }, 30000, 100, 1));
ItemRegistry.registerItem(new ToolDrill("diamondDrill", "diamond_drill", { energyPerUse: 80, level: 4, efficiency: 16, damage: 4 }, 30000, 100, 1));
ItemRegistry.registerItem(new ToolDrillIridium());
Item.addCreativeGroup("ic2_drills", Translation.translate("Mining Drills"), [
    ItemID.drill,
    ItemID.diamondDrill,
    ItemID.iridiumDrill
]);
ItemRegistry.registerItem(new ItemNanoSaber());
ItemRegistry.registerItem(new ItemMiningLaser());
ItemRegistry.registerItem(new ItemWeedingTrowel());
// Painters
ItemRegistry.createItem("icPainter", { name: "painter", icon: "ic_painter", stack: 1, category: ItemCategory.EQUIPMENT });
{
    var painterCreativeGroup = [ItemID.icPainter];
    for (var i = 0; i < 16; i++) {
        var item = ItemRegistry.registerItem(new ItemPainter(i));
        painterCreativeGroup.push(item.id);
    }
    Item.addCreativeGroup("ic2_painter", Translation.translate("Painters"), painterCreativeGroup);
}
ItemRegistry.registerItem(new UpgradeMFSU());
/// <reference path="init.ts" />
Callback.addCallback("PreLoaded", function () {
    // Tool Box
    Recipes.addShaped({ id: ItemID.toolbox, count: 1, data: 0 }, [
        "axa",
        "aaa",
    ], ['x', 54, -1, 'a', ItemID.casingBronze, 0]);
    // Containment Box
    Recipes.addShaped({ id: ItemID.containmentBox, count: 1, data: 0 }, [
        "aaa",
        "axa",
        "aaa",
    ], ['x', 54, -1, 'a', ItemID.casingLead, 0]);
    // Crafting tools
    Recipes.addShaped({ id: ItemID.craftingHammer, count: 1, data: 0 }, [
        "xx ",
        "x##",
        "xx "
    ], ['x', 265, 0, '#', 280, 0]);
    Recipes.addShaped({ id: ItemID.cutter, count: 1, data: 0 }, [
        "x x",
        " x ",
        "a a"
    ], ['a', 265, 0, 'x', ItemID.plateIron, 0]);
    // Bronze tools
    Recipes.addShaped({ id: ItemID.bronzeSword, count: 1, data: 0 }, [
        "a",
        "a",
        "b"
    ], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
    Recipes.addShaped({ id: ItemID.bronzeShovel, count: 1, data: 0 }, [
        "a",
        "b",
        "b"
    ], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
    Recipes.addShaped({ id: ItemID.bronzePickaxe, count: 1, data: 0 }, [
        "aaa",
        " b ",
        " b "
    ], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
    Recipes.addShaped({ id: ItemID.bronzeAxe, count: 1, data: 0 }, [
        "aa",
        "ab",
        " b"
    ], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
    Recipes.addShaped({ id: ItemID.bronzeHoe, count: 1, data: 0 }, [
        "aa",
        " b",
        " b"
    ], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);
    // EU Meter
    Recipes.addShaped({ id: ItemID.EUMeter, count: 1, data: 0 }, [
        " g ",
        "xcx",
        "x x"
    ], ['c', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'g', 348, -1]);
    // Frequency Transmitter
    Recipes.addShaped({ id: ItemID.freqTransmitter, count: 1, data: 0 }, [
        "x",
        "#",
        "b"
    ], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'b', ItemID.casingIron, 0]);
    // Scanners
    Recipes.addShaped({ id: ItemID.scanner, count: 1, data: 27 }, [
        "gdg",
        "cbc",
        "xxx"
    ], ['x', ItemID.cableCopper1, -1, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.scannerAdvanced, count: 1, data: 27 }, [
        "gbg",
        "dcd",
        "xsx"
    ], ['x', ItemID.cableGold2, -1, 's', ItemID.scanner, -1, 'b', ItemID.storageAdvBattery, -1, 'c', ItemID.circuitAdvanced, -1, 'd', 348, 0, 'g', ItemID.casingGold, -1], ChargeItemRegistry.transferEnergy);
    // Windmeter
    Recipes.addShaped({ id: ItemID.windMeter, count: 1, data: 27 }, [
        " c",
        "cbc",
        " cx"
    ], ['x', ItemID.powerUnitSmall, 0, 'b', ItemID.casingBronze, 0, 'c', ItemID.casingTin, 0]);
    // Treetap
    Recipes.addShaped({ id: ItemID.treetap, count: 1, data: 0 }, [
        " x ",
        "xxx",
        "x  "
    ], ['x', 5, -1]);
    // Wrenches
    Recipes.addShaped({ id: ItemID.bronzeWrench, count: 1, data: 0 }, [
        "a a",
        "aaa",
        " a "
    ], ['a', ItemID.ingotBronze, 0]);
    Recipes.addShapeless({ id: ItemID.electricWrench, count: 1, data: 27 }, [
        { id: ItemID.bronzeWrench, data: 0 }, { id: ItemID.powerUnitSmall, data: 0 }
    ]);
    // Electric Treetap
    Recipes.addShapeless({ id: ItemID.electricTreetap, count: 1, data: 27 }, [
        { id: ItemID.powerUnitSmall, data: 0 }, { id: ItemID.treetap, data: 0 }
    ]);
    var ironPlate = IC2Config.hardRecipes ? ItemID.plateSteel : ItemID.plateIron;
    // Electric Hoe
    Recipes.addShaped({ id: ItemID.electricHoe, count: 1, data: 27 }, [
        "pp",
        " p",
        " x"
    ], ['x', ItemID.powerUnitSmall, 0, 'p', ironPlate, 0]);
    // Chainsaw
    Recipes.addShaped({ id: ItemID.chainsaw, count: 1, data: 27 }, [
        " pp",
        "ppp",
        "xp "
    ], ['x', ItemID.powerUnit, 0, 'p', ironPlate, 0]);
    // Drills
    Recipes.addShaped({ id: ItemID.drill, count: 1, data: 27 }, [
        " p ",
        "ppp",
        "pxp"
    ], ['x', ItemID.powerUnit, 0, 'p', ironPlate, 0]);
    Recipes.addShaped({ id: ItemID.diamondDrill, count: 1, data: 27 }, [
        " a ",
        "ada"
    ], ['d', ItemID.drill, -1, 'a', 264, 0], ChargeItemRegistry.transferEnergy);
    Recipes.addShaped({ id: ItemID.iridiumDrill, count: 1, data: 27 }, [
        " a ",
        "ada",
        " e "
    ], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], ChargeItemRegistry.transferEnergy);
    // Nano Saber
    Recipes.addShaped({ id: ItemID.nanoSaber, count: 1, data: 27 }, [
        "ca ",
        "ca ",
        "bxb"
    ], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], ChargeItemRegistry.transferEnergy);
    // Mining Laser
    Recipes.addShaped({ id: ItemID.miningLaser, count: 1, data: 27 }, [
        "ccx",
        "aa#",
        " aa"
    ], ['#', ItemID.circuitAdvanced, 0, 'x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, "c", 331, 0], ChargeItemRegistry.transferEnergy);
    // Crop Analyzer
    Recipes.addShaped({ id: ItemID.agriculturalAnalyzer, count: 1, data: 0 }, [
        "xx ",
        "rgr",
        "rcr"
    ], ['x', ItemID.cableCopper1, 0, 'r', 331, 0, 'g', 20, 0, "c", ItemID.circuitBasic, 0]);
    // Weeding Trovel
    Recipes.addShaped({ id: ItemID.weedingTrowel, count: 1, data: 0 }, [
        "c c",
        " c ",
        "zcz"
    ], ['c', 265, 0, 'z', ItemID.rubber, 0]);
    // Painters
    Recipes.addShaped({ id: ItemID.icPainter, count: 1, data: 0 }, [
        " aa",
        " xa",
        "x  "
    ], ['x', 265, -1, 'a', 35, 0]);
    for (var i = 1; i <= 16; i++) {
        var color = INDEX_TO_COLOR[i - 1];
        var dye = IDConverter.getIDData(color + "_dye");
        Recipes.addShapeless({ id: ItemID["icPainter" + i], count: 1, data: 0 }, [{ id: ItemID.icPainter, data: 0 }, { id: dye.id, data: dye.data }]);
    }
    // MFSU Upgrade Kit
    Recipes.addShaped({ id: ItemID.upgradeMFSU, count: 1, data: 0 }, [
        "aca",
        "axa",
        "aba"
    ], ['b', ItemID.bronzeWrench, 0, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, -1]);
});
ModAPI.addAPICallback("RedCore", function (api) {
    api.Integration.addDeployerItem(ItemID.cableTin0);
    api.Integration.addDeployerItem(ItemID.cableTin1);
    api.Integration.addDeployerItem(ItemID.cableCopper0);
    api.Integration.addDeployerItem(ItemID.cableCopper1);
    api.Integration.addDeployerItem(ItemID.cableGold0);
    api.Integration.addDeployerItem(ItemID.cableGold1);
    api.Integration.addDeployerItem(ItemID.cableGold2);
    api.Integration.addDeployerItem(ItemID.cableIron0);
    api.Integration.addDeployerItem(ItemID.cableIron1);
    api.Integration.addDeployerItem(ItemID.cableIron2);
    api.Integration.addDeployerItem(ItemID.cableIron3);
    api.Integration.addDeployerItem(ItemID.cableOptic);
});
ModAPI.addAPICallback("TreeCapitator", function (api) {
    api.registerTree([[BlockID.rubberTreeLog, -1], [BlockID.rubberTreeLogLatex, -1]], [BlockID.rubberTreeLeaves, -1]);
});
var RV;
ModAPI.addAPICallback("RecipeViewer", function (api) {
    RV = api;
    var Bitmap = android.graphics.Bitmap;
    var RecipeTypeForICPE = /** @class */ (function (_super) {
        __extends(RecipeTypeForICPE, _super);
        function RecipeTypeForICPE(name, icon, content) {
            var _a, _b;
            var _this = this;
            (_a = content.params) !== null && _a !== void 0 ? _a : (content.params = {});
            (_b = content.drawing) !== null && _b !== void 0 ? _b : (content.drawing = []);
            content.params.slot = "classic_slot";
            content.drawing.unshift({ type: "frame", x: 0, y: 0, width: 1000, height: 540, bitmap: "classic_frame_bg_light", scale: 2 });
            _this = _super.call(this, Translation.translate(name), icon, content) || this;
            return _this;
        }
        return RecipeTypeForICPE;
    }(api.RecipeType));
    var BasicMachineRecipe = /** @class */ (function (_super) {
        __extends(BasicMachineRecipe, _super);
        function BasicMachineRecipe(recipeKey, name, icon, scaleBmp) {
            var _this = _super.call(this, name, icon, {
                drawing: [
                    { type: "bitmap", x: 430, y: 200, scale: 6, bitmap: scaleBmp }
                ],
                elements: {
                    input0: { x: 280, y: 190, size: 120 },
                    output0: { x: 600, y: 190, size: 120 }
                }
            }) || this;
            _this.recipeKey = recipeKey;
            return _this;
        }
        BasicMachineRecipe.prototype.getAllList = function () {
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor(this.recipeKey);
            var input;
            for (var key in recipe) {
                input = key.split(":");
                list.push({
                    input: [{ id: +input[0], count: recipe[key].sourceCount || 1, data: +input[1] || 0 }],
                    output: [{ id: recipe[key].id, count: recipe[key].count || 0, data: recipe[key].data || 0 }]
                });
            }
            return list;
        };
        return BasicMachineRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_macerator", new BasicMachineRecipe("macerator", "Macerator", BlockID.macerator, "macerator_bar_scale"));
    api.RecipeTypeRegistry.register("icpe_compressor", new BasicMachineRecipe("compressor", "Compressor", BlockID.compressor, "compressor_bar_scale"));
    api.RecipeTypeRegistry.register("icpe_extractor", new BasicMachineRecipe("extractor", "Extractor", BlockID.extractor, "extractor_bar_scale"));
    var SolidCannerRecipe = /** @class */ (function (_super) {
        __extends(SolidCannerRecipe, _super);
        function SolidCannerRecipe() {
            return _super.call(this, "Solid Canning", BlockID.solidCanner, {
                drawing: [
                    { type: "bitmap", x: 209 + 20 * 6, y: 200 + 1 * 6, scale: 6, bitmap: "solid_canner_arrow" },
                    { type: "bitmap", x: 209 + 54 * 6, y: 200 + 2 * 6, scale: 6, bitmap: "arrow_bar_scale" }
                ],
                elements: {
                    input0: { x: 209, y: 200, size: 18 * 6 },
                    input1: { x: 209 + 31 * 6, y: 200, size: 18 * 6 },
                    output0: { x: 209 + 79 * 6, y: 200, size: 18 * 6 }
                }
            }) || this;
        }
        SolidCannerRecipe.prototype.getAllList = function () {
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
            var input;
            for (var key in recipe) {
                input = key.split(":");
                list.push({
                    input: [
                        { id: +input[0], count: 1, data: +input[1] || 0 },
                        { id: recipe[key].can, count: 1, data: 0 }
                    ],
                    output: [recipe[key].result]
                });
            }
            return list;
        };
        return SolidCannerRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_solidCanner", new SolidCannerRecipe());
    var CannerRecipe = /** @class */ (function (_super) {
        __extends(CannerRecipe, _super);
        function CannerRecipe() {
            var _this = _super.call(this, "Canning", BlockID.canner, {
                drawing: [
                    { type: "bitmap", x: 212 + 34 * 6, y: 20 + 6 * 6, scale: 6, bitmap: "extractor_bar_scale" },
                    { type: "bitmap", x: 212 - 1 * 6, y: 20 + 26 * 6, scale: 6, bitmap: "liquid_bar" },
                    { type: "bitmap", x: 212 + 77 * 6, y: 20 + 26 * 6, scale: 6, bitmap: "liquid_bar" },
                ],
                elements: {
                    input0: { x: 212, y: 20, size: 18 * 6 },
                    input1: { x: 212 + 39 * 6, y: 20 + 27 * 6, z: 2, size: 18 * 6, bitmap: "_default_slot_empty" },
                    output0: { x: 212 + 78 * 6, y: 20, size: 18 * 6 },
                    inputLiq0: { x: 212 + 3 * 6, y: 20 + 30 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay" },
                    outputLiq0: { x: 212 + 81 * 6, y: 20 + 30 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay" },
                    background: { type: "scale", x: 212 + 18 * 6, y: 20, scale: 6, bitmap: "canner_background_0", value: 1 },
                    slotBack: { type: "scale", x: 212 + 39 * 6, y: 20 + 27 * 6, z: 1, scale: 6, bitmap: "canner_slot_source_0", value: 1 },
                    mode: { type: "scale", x: 212 + 21 * 6, y: 20 + 63 * 6, scale: 6, bitmap: "canner_mode_0", value: 1 }
                }
            }) || this;
            _this.setTankLimit(8000);
            return _this;
        }
        CannerRecipe.prototype.getAllList = function () {
            var list = [];
            var solidRecipe = MachineRecipeRegistry.requireRecipesFor("solidCanner");
            var item;
            for (var key in solidRecipe) {
                item = key.split(":");
                list.push({
                    input: [
                        { id: solidRecipe[key].can, count: 1, data: 0 },
                        { id: +item[0], count: 1, data: +item[1] || 0 }
                    ],
                    output: [solidRecipe[key].result],
                    mode: 0
                });
            }
            var fluidRecipe = MachineRecipeRegistry.requireRecipesFor("fluidCanner");
            for (var i = 0; i < fluidRecipe.length; i++) {
                list.push({
                    input: [
                        null,
                        { id: fluidRecipe[i].input[1].id, count: fluidRecipe[i].input[1].count, data: 0 }
                    ],
                    inputLiq: [{ liquid: fluidRecipe[i].input[0], amount: 1000 }],
                    outputLiq: [{ liquid: fluidRecipe[i].output, amount: 1000 }],
                    mode: 3
                });
            }
            var full;
            var empty;
            for (var key in LiquidRegistry.EmptyByFull) {
                item = key.split(":");
                full = { id: +item[0], count: 1, data: +item[1] || 0 };
                empty = { id: LiquidRegistry.EmptyByFull[key].id, count: 1, data: LiquidRegistry.EmptyByFull[key].data || 0 };
                list.push({
                    input: [full],
                    output: [empty],
                    outputLiq: [{ liquid: LiquidRegistry.EmptyByFull[key].liquid, amount: 1000 }],
                    mode: 1
                });
                list.push({
                    input: [empty],
                    output: [full],
                    inputLiq: [{ liquid: LiquidRegistry.EmptyByFull[key].liquid, amount: 1000 }],
                    mode: 2
                });
            }
            return list;
        };
        CannerRecipe.prototype.onOpen = function (elements, recipe) {
            elements.get("background").setBinding("texture", "canner_background_" + recipe.mode);
            elements.get("slotBack").setBinding("texture", "canner_slot_source_" + recipe.mode);
            elements.get("mode").setBinding("texture", "canner_mode_" + recipe.mode);
        };
        return CannerRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_canner", new CannerRecipe());
    var MetalFormerRecipe = /** @class */ (function (_super) {
        __extends(MetalFormerRecipe, _super);
        function MetalFormerRecipe() {
            return _super.call(this, "Metal Former", BlockID.metalFormer, {
                drawing: [
                    { type: "bitmap", x: 360, y: 220, scale: 6, bitmap: "metalformer_bar_scale" }
                ],
                elements: {
                    mode: { type: "scale", x: 445, y: 320, bitmap: "metal_former_button_0", scale: 6, value: 1 },
                    input0: { x: 220, y: 190, size: 120 },
                    output0: { x: 660, y: 190, size: 120 }
                }
            }) || this;
        }
        MetalFormerRecipe.prototype.getAllList = function () {
            var list = [];
            var recipe;
            var input;
            for (var mode = 0; mode < 3; mode++) {
                recipe = MachineRecipeRegistry.requireRecipesFor("metalFormer" + mode);
                for (var key in recipe) {
                    input = key.split(":");
                    list.push({
                        input: [{ id: +input[0], count: recipe[key].sourceCount || 1, data: +input[1] || 0 }],
                        output: [{ id: recipe[key].id, count: recipe[key].count || 0, data: recipe[key].data || 0 }],
                        mode: mode
                    });
                }
            }
            return list;
        };
        MetalFormerRecipe.prototype.onOpen = function (elements, recipe) {
            elements.get("mode").setBinding("texture", "metal_former_button_" + recipe.mode);
        };
        return MetalFormerRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_metalFormer", new MetalFormerRecipe());
    var numArray2Output = function (arr) {
        var output = [];
        for (var i = 0; i < arr.length; i += 2) {
            output.push({ id: arr[i], count: arr[i + 1], data: 0 });
        }
        return output;
    };
    UI.TextureSource.put("ore_washer_background_trim", Bitmap.createBitmap(UI.TextureSource.get("ore_washer_background"), 56, 17, 63, 55, null, true));
    var OreWasherRecipe = /** @class */ (function (_super) {
        __extends(OreWasherRecipe, _super);
        function OreWasherRecipe() {
            var _this = _super.call(this, "Ore Washing", BlockID.oreWasher, {
                drawing: [
                    { type: "bitmap", x: 263, y: 110, scale: 6, bitmap: "ore_washer_background_trim" },
                    { type: "bitmap", x: 263 + 42 * 6, y: 110 + 18 * 6, scale: 6, bitmap: "ore_washer_bar_scale" }
                ],
                elements: {
                    inputLiq0: { x: 263 + 4 * 6, y: 110 + 4 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay" },
                    input0: { x: 263 + 43 * 6, y: 110 - 4 * 6, size: 18 * 6 },
                    output0: { x: 263 + 25 * 6, y: 110 + 41 * 6, size: 18 * 6 },
                    output1: { x: 263 + 43 * 6, y: 110 + 41 * 6, size: 18 * 6 },
                    output2: { x: 263 + 61 * 6, y: 110 + 41 * 6, size: 18 * 6 }
                }
            }) || this;
            _this.setTankLimit(8000);
            return _this;
        }
        OreWasherRecipe.prototype.getAllList = function () {
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("oreWasher");
            var input;
            for (var key in recipe) {
                input = key.split(":");
                list.push({
                    input: [{ id: +input[0], count: 1, data: +input[1] || 0 }],
                    output: numArray2Output(recipe[key]),
                    inputLiq: [{ liquid: "water", amount: 1000 }]
                });
            }
            return list;
        };
        return OreWasherRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_oreWasher", new OreWasherRecipe());
    var ThermalCentrifugeRecipe = /** @class */ (function (_super) {
        __extends(ThermalCentrifugeRecipe, _super);
        function ThermalCentrifugeRecipe() {
            return _super.call(this, "Thermal Centrifuge", BlockID.thermalCentrifuge, {
                drawing: [
                    { type: "bitmap", x: 314, y: 100, scale: 6, bitmap: "thermal_centrifuge_background" },
                    { type: "bitmap", x: 314 + 44 * 6, y: 100 + 7 * 6, scale: 6, bitmap: "thermal_centrifuge_scale" },
                    { type: "bitmap", x: 314 + 28 * 6, y: 100 + 48 * 6, scale: 6, bitmap: "heat_scale" },
                    { type: "bitmap", x: 314 + 52 * 6, y: 100 + 44 * 6, scale: 6, bitmap: "indicator_green" }
                ],
                elements: {
                    input0: { type: "slot", x: 314 - 20 * 6, y: 100 + 2 * 6, size: 18 * 6 },
                    output0: { type: "slot", x: 314 + 82 * 6, y: 100 + 2 * 6, size: 18 * 6 },
                    output1: { type: "slot", x: 314 + 82 * 6, y: 100 + 20 * 6, size: 18 * 6 },
                    output2: { type: "slot", x: 314 + 82 * 6, y: 100 + 38 * 6, size: 18 * 6 },
                    textHeat: { type: "text", x: 314 + 26 * 6, y: 100 + 62 * 6, font: { size: 40, color: Color.WHITE, shadow: 0.5 } }
                }
            }) || this;
        }
        ThermalCentrifugeRecipe.prototype.getAllList = function () {
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("thermalCentrifuge");
            var input;
            for (var key in recipe) {
                input = key.split(":");
                list.push({
                    input: [{ id: +input[0], count: 1, data: +input[1] || 0 }],
                    output: numArray2Output(recipe[key].result),
                    heat: recipe[key].heat
                });
            }
            return list;
        };
        ThermalCentrifugeRecipe.prototype.onOpen = function (elements, recipe) {
            elements.get("textHeat").setBinding("text", Translation.translate("Heat: ") + recipe.heat);
        };
        return ThermalCentrifugeRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_thermalCentrifuge", new ThermalCentrifugeRecipe());
    var BlastFurnaceRecipe = /** @class */ (function (_super) {
        __extends(BlastFurnaceRecipe, _super);
        function BlastFurnaceRecipe() {
            return _super.call(this, "Blast Furnace", BlockID.blastFurnace, {
                drawing: [
                    { type: "bitmap", x: 200, y: 100 - 11 * 5, scale: 5, bitmap: "blast_furnace_background" },
                    { type: "bitmap", x: 200 + 50 * 5, y: 100 + 16 * 5, scale: 5, bitmap: "blast_furnace_scale" },
                    { type: "bitmap", x: 200 + 46 * 5, y: 100 + 52 * 5, scale: 5, bitmap: "heat_scale" },
                    { type: "bitmap", x: 200 + 70 * 5, y: 100 + 48 * 5, scale: 5, bitmap: "indicator_green" }
                ],
                elements: {
                    input0: { type: "slot", x: 200 + 8 * 5, y: 100 + 12 * 5, size: 18 * 5 },
                    input1: { type: "slot", x: 200, y: 200 + 17 * 5, size: 18 * 5, bitmap: "_default_slot_empty" },
                    output0: { type: "slot", x: 200 + 106 * 5, y: 100 + 17 * 5, size: 18 * 5 },
                    output1: { type: "slot", x: 200 + 124 * 5, y: 100 + 17 * 5, size: 18 * 5 }
                }
            }) || this;
        }
        BlastFurnaceRecipe.prototype.getAllList = function () {
            var list = [];
            var recipe = MachineRecipeRegistry.requireRecipesFor("blastFurnace");
            var input;
            for (var key in recipe) {
                input = key.split(":");
                list.push({
                    input: [
                        { id: +input[0], count: 1, data: +input[1] || 0 },
                        { id: ItemID.cellAir, count: 1, data: 0 }
                    ],
                    output: numArray2Output(recipe[key].result),
                });
            }
            return list;
        };
        return BlastFurnaceRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_blastFurnace", new BlastFurnaceRecipe());
    var FermenterRecipe = /** @class */ (function (_super) {
        __extends(FermenterRecipe, _super);
        function FermenterRecipe() {
            var _this = _super.call(this, "Fermenter", BlockID.icFermenter, {
                drawing: [
                    { type: "bitmap", x: 20, y: 20, scale: 6, bitmap: "fermenter_background" },
                    { type: "bitmap", x: 20 + 118 * 6, y: 20 + 4 * 6, scale: 6, bitmap: "liquid_bar" }
                ],
                elements: {
                    output0: { x: 20 + 78 * 6, y: 20 + 63 * 6, size: 18 * 6, bitmap: "slot_black" },
                    inputLiq0: { x: 20 + 29 * 6, y: 20 + 31 * 6, width: 48 * 6, height: 30 * 6, scale: 6 },
                    outputLiq0: { x: 20 + 122 * 6, y: 20 + 8 * 6, width: 12 * 6, height: 47 * 6, scale: 6, overlay: "gui_liquid_storage_overlay" }
                }
            }) || this;
            _this.setTankLimit(1000);
            return _this;
        }
        FermenterRecipe.prototype.getAllList = function () {
            return [{
                    output: [{ id: ItemID.fertilizer, count: 1, data: 0 }],
                    inputLiq: [{ liquid: "biomass", amount: 500 }],
                    outputLiq: [{ liquid: "biogas", amount: 500 }]
                }];
        };
        return FermenterRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_fermenter", new FermenterRecipe());
    var FluidFuelRecipe = /** @class */ (function (_super) {
        __extends(FluidFuelRecipe, _super);
        function FluidFuelRecipe() {
            var _this = _super.call(this, "Fluid Fuel", ItemID.cellEmpty, {
                drawing: [
                    { type: "bitmap", x: 290, y: 140, scale: 8, bitmap: "furnace_burn" },
                    { type: "bitmap", x: 280, y: 260, scale: 8, bitmap: "classic_slot" }
                ],
                elements: {
                    inputLiq0: { x: 288, y: 268, width: 16 * 8, height: 16 * 8 },
                    text: { type: "text", x: 450, y: 320, font: { size: 40, color: Color.WHITE, shadow: 0.5 } }
                }
            }) || this;
            _this.setDescription("Fuel");
            _this.setTankLimit(100);
            return _this;
        }
        FluidFuelRecipe.prototype.getAllList = function () {
            var list = [];
            var recipe = MachineRecipeRegistry.requireFluidRecipes("fluidFuel");
            for (var liq in recipe) {
                list.push({
                    inputLiq: [{ liquid: liq, amount: recipe[liq].amount }],
                    power: recipe[liq].power
                });
            }
            return list;
        };
        FluidFuelRecipe.prototype.onOpen = function (elements, recipe) {
            elements.get("text").setBinding("text", recipe.power + "EU / tick");
        };
        return FluidFuelRecipe;
    }(RecipeTypeForICPE));
    api.RecipeTypeRegistry.register("icpe_fluidFuel", new FluidFuelRecipe());
});
ModAPI.addAPICallback("BetterFoliageLeaves", function (BetterFoliage) {
    BetterFoliage.setupLeavesModel(BlockID.rubberTreeLeaves, -1, ["rubber_tree_leaves", 0]);
});
var ICore = {
    Machine: MachineRegistry,
    Recipe: MachineRecipeRegistry,
    Render: TileRenderer,
    ChargeRegistry: ChargeItemRegistry,
    Cable: CableRegistry,
    Upgrade: UpgradeAPI,
    ReactorItem: ReactorItem,
    Radiation: RadiationAPI,
    Tool: ICTool,
    Sound: SoundManager,
    Agriculture: Agriculture,
    ItemName: ItemName,
    UI: ToolHUD,
    Config: IC2Config,
    Ore: OreGenerator,
    Integration: IntegrationAPI,
    WindSim: WindSim,
    requireGlobal: function (command) {
        return eval(command);
    }
};
Logger.Log("IndustrialCraft2 loading finished in " + (Debug.sysTime() - startTime) + " ms", "INFO");
ModAPI.registerAPI("ICore", ICore);
Logger.Log("Industrial Core API shared with name ICore.", "API");
