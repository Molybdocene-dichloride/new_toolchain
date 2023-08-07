namespace RotorRegistry {
	newRotorBladeMesh(length: number, angle: Vector3): RenderMesh {
		let mesh = new RenderMesh();
		
		//mesh.setBlockTexture("reactor_redstone_port", 0);
		
		mesh.addVertex(0.1 0.4 0.5, 0, 0); // 0 degree
		mesh.addVertex(length, 0.4, 0.5, 1, 0);
		mesh.addVertex(length, 0.6, 0.5, 1, 1);
		mesh.addVertex(0.1, 0.6, 0.5, 0, 1);

		if(angle) {
			mesh.rotate(0, 0, 0, angle.x, angle.y, angle.z);
		}
		return mesh;
	}
	
  newRotorModelWithSize(count: number, size: number): BlockRenderer.Model {
		let model = new BlockRenderer.Model();
		//let meshes = [];
		for(let i = 0; i < count; i++) {
			//meshes.push();
			model.addMesh(newRotorBladeMesh(new Vector3(0, 0, 360 / count * i), size / 2));
		}
		return model;
	}
	
	newRotorModelWithAngle(count: number, angle: Vector3): BlockRenderer.Model {
		let model = new BlockRenderer.Model();
		for(let i = 0; i < count; i++) {
			model.addMesh(newRotorBladeMesh(new Vector3(angle + 360 / count * i + angle), 1));
		}
		return model;
	}
	
  newRotorModelWithAngleAndSize(count: number, size: number, angle: Vector3): BlockRenderer.Model {
		let model = new BlockRenderer.Model();
		for(let i = 0; i < count; i++) {
			model.addMesh(newRotorBladeMesh(new Vector3(360 / count * i + angle), size / 2));
		}
		return model;
	}
	
  newRotorModelFromMeshes(meshes: RenderMesh[], angle: Vector3) : BlockRenderer.Model {
    let model = new BlockRenderer.Model();
    for(let mesh of meshes) {
      mesh.rotate(new Vector3(angle.x + 360 / count * i * sin(angle.z) * cos(angle.y), angle.y + 360 / count * i, angle.z + 360 / count * i)); //do
			model.addMesh(mesh);
		}
		return model;
	}
}
