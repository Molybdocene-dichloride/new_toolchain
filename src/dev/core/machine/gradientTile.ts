namespace RotorRegistry {
	class WindStrengthRange {
		min: number;
		max: number;
	}

	class RotorTile {
		private size: Vector2;
		private mechanicalEfficiency: number; //КПД
		private durability: number;
		private strengthWind: WindStrengthRange;
		
		private position: Vector3;
		private angle: Vector3;
		
		static newTile(RotorTile self): RotorTile {
			RotorTile tile = new RotorTile(self.angle, self.size, self.mechanicalEfficiency, self.durability, self.strengthWind);
			
			return tile;
		}
		
		constructor(angle: number, size: Vector2, mechanicalEfficiency: number, durability: number, strengthWind: WindStrengthRange) {
			this.angle = angle;
			this.mechanicalEfficiency = mechanicalEfficiency;
			this.size = size;
			this.durability = durability;
			this.strengthWind = strengthWind;
		}
		
		getSize(): Vector2 {
			return size;
		}
		setSize(size: Vector2): void {
			this.size = size;
		}

		getMechanicalEfficiency(): number {
			return mechanicalEfficiency;
		}
		setMechanicalEfficiency(mechanicalEfficiency: number): void {
			this.mechanicalEfficiency = mechanicalEfficiency;
		}
	
		getDurability(): number {
			return durability;
		}
		setDurability(): number {
			this.durability = durability;
		}
	
		getStrengthWind(): WindStrengthRange {
			return strengthWind;
		}
		setStrengthWind(strengthWind: WindStrengthRange): void {
			this.strengthWind = strengthWind;
		}

		init(position: Vector3, angle: Vector3) {
			this.position = position;
			this.angle = angle;
		}
		public client = {
			private position: Vector3;
			private angle: Vector3;
			private size: Vector2;
		
			private model: BlockRenderer.Model;
			private mesh: RenderMesh;
			private texture: Texture;

			init(size, angle) {
				mesh = newRotorBladeMesh(size.x, angle);
				model = newRotorBladeModel(4, mesh);
			}
			
			setClient(self: RenderMesh.client) {
				tile.mesh = self.mesh.clone();
				tile.texture = self.texture.clone();
			}

			//getTexture setTexture
			//getMesh setMesh() {}
			
			update(angle: Vector3, increment = true: boolean): void {
				//do rotor changes
				if(increment) {
					this.angle.add(angle);
				} else {
					this.angle = angle;
				}
				model = newRotorModel(count, mesh, this.angle);
				
				//mapAtCoords;
			}
		}
	}
}
