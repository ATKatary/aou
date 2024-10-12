import pymeshlab

class Mesh():
    def __init__(self, mesh_path):
        self.mesh_path = mesh_path
        self.ms = pymeshlab.MeshSet()

        self.ms.load_new_mesh(self.mesh_path)
    
    def clean(self):
        self.ms.generate_splitting_by_connected_components()
        n = len(self.ms)

        k, num_faces = 0, 0
        for i in range(1, n):
            if self.ms[i].face_matrix().shape[0] > num_faces:
                k = i
                num_faces = self.ms[i].face_matrix().shape[0]
        
        self.ms.set_current_mesh(k)
        return self.remesh(save_path=self.mesh_path)

    def remesh(self, save_path = None):
        """
        Resmeshes a mesh to force all faces to become polygons

        Inputs
            :mesh: <pymeshlab.Mesh> mesh to be remeshed

        Throws
            <ValueError> if the number of verticies > number of vertex normals
        """
        # self.ms.meshing_isotropic_explicit_remeshing(iterations=3)
        # self.ms.meshing_isotropic_explicit_remeshing(iterations=3, targetlen=pymeshlab.Percentage(1.5))

        self.ms.compute_matrix_from_scaling_or_normalization(scalecenter='origin', unitflag=True, uniformflag=True)
        targetlen_given = 1.5

        attempts = 20
        while attempts > 0:
            self.ms.meshing_isotropic_explicit_remeshing(iterations=3, targetlen=pymeshlab.PercentageValue(targetlen_given))
            if (self.ms.current_mesh().face_matrix().shape[0] < 20000):
                print(f"[remesh] >> Optimizing resolution  {self.ms.current_mesh().face_matrix().shape[0]}...")
                targetlen_given -= 0.1
            elif (self.ms.current_mesh().face_matrix().shape[0] > 30000):
                print(f"[remesh] >> Optimizing resolution  {self.ms.current_mesh().face_matrix().shape[0]}...")
                targetlen_given += 0.1
            else:
                print(f"[remesh] >> Optimization completed. Current resolution: {self.ms.current_mesh().face_matrix().shape[0]}... ")
                break
            attempts -= 1

        for i in self.ms: pass
        if save_path is not None: 
            mesh = pymeshlab.Mesh(self.ms.current_mesh().vertex_matrix(), self.ms.current_mesh().face_matrix())
            self.ms.add_mesh(mesh)
            self.ms.save_current_mesh(save_path)
        return self.ms.current_mesh()