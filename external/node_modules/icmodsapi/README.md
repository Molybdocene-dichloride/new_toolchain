# ICModsAPI
[![license](https://img.shields.io/github/license/80LK/ICModsAPI?logo=github&style=flat-square)](https://github.com/80LK/ICModsAPI)
[![npm downloads](https://img.shields.io/npm/dw/icmodsapi?style=flat-square)](https://www.npmjs.com/package/icmodsapi)
[![npm version](https://img.shields.io/npm/v/icmodsapi?style=flat-square)](https://www.npmjs.com/package/icmodsapi)

Simple Node.js module that allows you to interact with the ICMods API.

## Installation
```
npm i --save icmodsapi
```

## Usage API
Get full description for mod
```js
import ICModsAPI from 'icmodsapi';

(async () => {
	const mod = await ICModsAPI.getModInfo(22);
	// or ICModsAPI.description
	console.log(mod);
})();
```

Get List Mods
```js
const mods = await ICModsAPI.list(ICModsAPI.Sort.POPULAR, 0, 20);
console.log(mods);
```

```js
const mods = await ICModsAPI.listForIds([22, 299]);
console.log(mods);
```

Search mods
```js
const mods = await ICModsAPI.searchMods("industrial");
console.log(mods);

const mods = await ICModsAPI.searchModsAtTag("global");
console.log(mods);

const mods = await ICModsAPI.searchModsFromAuthor(2);
console.log(mods);
```

Get Image
```js
import { writeFileSync } from "fs";

//...

const mod = await ICModsAPI.getModInfo(22);
writeFileSync("fileName.png", await ICModsAPI.getImage(mod.icon), { encoding: "binary" });
```

## License(MIT)
See the [LICENSE file](https://github.com/80LK/ICModsAPI/blob/main/LICENSE) for details.
