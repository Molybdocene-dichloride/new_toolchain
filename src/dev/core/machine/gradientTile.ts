namespace RotorRegistry {
	class WindStrengthRange {
		min: number;
		max: number;
	}

	class RotorTile {
	  //general
    private count: number;
		private size: number;
		
		private mechanicalEfficiency: number; //КПД
		private durability: number;
		private strengthWind: WindStrengthRange;
		//concrete
		private position: Vector3;
		private angle: Vector3;
		
		static newTile(RotorTile self): RotorTile {
			RotorTile tile = new RotorTile(self.angle, self.size, self.mechanicalEfficiency, self.durability, self.strengthWind);
			
			return tile;
		}
		
		constructor(angle: number, size: number, mechanicalEfficiency: number, durability: number, strengthWind: WindStrengthRange) {
			this.angle = angle;
			this.mechanicalEfficiency = mechanicalEfficiency;
			this.size = size;
			this.durability = durability;
			this.strengthWind = strengthWind;
		}
		
		getSize(): number {
			return size;
		}
		setSize(size: number): void {
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
	
		getOptimalStrengthWind(): WindStrengthRange {
			return strengthWind;
		}
		setOptimalStrengthWind(strengthWind: WindStrengthRange): void {
			this.strengthWind = strengthWind;
		}

		init(position: Vector3, angle: Vector3) {
			this.position = position;
			this.angle = angle;
		}
		public client = {
			private position: Vector3;
			private angle: Vector3;
			private size: number;
      private count: number;
		
			private model: BlockRenderer.Model;
      private mesh: RenderMesh;
      private meshes: RenderMesh[];
			private texture: Texture;

      initProto(size: number): void {
  			  mesh = newRotorBladeMesh(0, size / 2);
      }
      
			initWithNewMesh(size: number, count: number, angle: Vector3): void {
			  mesh = newRotorBladeMesh(0, size / 2);
			  
        for(let i = 0; i < count; i++) {
          meshes[i] = mesh.clone();
          meshes[i].rotate(360 / count * i + angle);
        }
        
				model = newRotorModelWithMeshes(4, mesh);
				
			}
			
			init(mesh: RenderMesh, count: number, angle: Vector3): void {
			  this.mesh = mesh;
        for(let i = 0; i < count; i++) {
          meshes[i] = mesh.clone();
          meshes[i].rotate(360 / count * i + angle);
        }
        
				model = newRotorModelWithMeshes(4, mesh);
				
			}
			
			setClient(other: RotorTile.client): void {
				this.mesh = other.mesh.clone();
				this.texture = other.texture.clone();
			}

			getTexture() {
			  return texture;
			}
			
			setTexture(texture): void {
        this.texture = texture;
			}
			
      getMesh(): RenderMesh {
			  return mesh;
			}
			
			setMesh(mesh: RenderMesh): void {
        this.mesh = mesh;
			}
			
			update(angle: Vector3, increment = true: boolean): void {
				if(increment) {
					this.angle.add(angle);
				} else {
					this.angle = angle;
				}
				
        for(let i = 0; i < count; i++) {
          mesh.rotate(360 / count * i + angle);
        }
				
				model = newRotorModelFromMeshes(count, meshes, angle);
				
				//BlockRenderer.mapAtCoords;
			}
		}
	}
}
