namespace RotorRegistry {
	newRotorBladeMesh(length: number);
	newRotorBladeMesh(length: number, angle: Vector3);
	newRotorBladeMesh(length: number, angle?: Vector3): RenderMesh {
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
	
	newRotorModelWithSize(count: number, size: Vector2): BlockRenderer.Model {
		let model = new BlockRenderer.Model();
		//let meshes = [];
		for(let i = 0; i < count; i++) {
			//meshes.push();
			model.addMesh(newRotorBladeMesh(360 / cont * i, size.x / 2));
		}
		return model;
	}

	newRotorModel(count: number, mesh: RenderMesh)
	newRotorModel(count: number, mesh: RenderMesh, angle: Vector3)
	newRotorModel(count: number, mesh: RenderMesh, angle?: Vector3): BlockRenderer.Model {
		let model = new BlockRenderer.Model();
		for(let i = 0; i < count; i++) {
			mesh_clone = mesh.clone();

			mesh_clone.rotate(0, 0, 0, angle.x, angle.y, angle.z);
			
			model.addMesh(mesh_clone);
		}
		return model;
	}
}
