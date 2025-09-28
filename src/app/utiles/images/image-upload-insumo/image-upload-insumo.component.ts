import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { ImageUploadInsumoService } from '../../../services/image-upload-insumo.service'; // 1. Importar el nuevo servicio

@Component({
  selector: 'app-image-upload-insumo',
  standalone: true, // 2. Convertir a standalone para consistencia
  imports: [CommonModule],
  templateUrl: './image-upload-insumo.component.html',
  styleUrls: ['./image-upload-insumo.component.css']
})
export class ImageUploadInsumoComponent implements OnInit {
  // 3. Añadir Input para el modo de edición
  @Input() initialImageName: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadSuccess: boolean = false;
  isDragOver: boolean = false;

  // 4. Propiedades para la galería
  existingImages: string[] = [];
  isLoadingImages: boolean = true;
  readonly imagePath = 'http://localhost:3000/img-insumos/'; // 5. Ruta a las imágenes de insumos

  constructor(
    private sharedService: SharedService,
    private imageUploadInsumoService: ImageUploadInsumoService // 6. Inyectar el nuevo servicio
  ) { }

  ngOnInit(): void {
    this.loadExistingImages();

    // Lógica para mostrar la imagen inicial en modo "edición"
    if (this.initialImageName) {
      this.previewUrl = this.imagePath + this.initialImageName;
      // Opcional: comunicar al servicio compartido si es necesario al iniciar
      // this.sharedService.nombreImagenInsumo(this.initialImageName);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.setFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.setFile(file);
      event.dataTransfer.clearData();
    }
  }

  setFile(file: File): void {
    this.selectedFile = file;
    this.uploadSuccess = false; // Reiniciar el estado al seleccionar un nuevo archivo

    // Generar previsualización
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 7. Nuevos métodos para la galería
  loadExistingImages(): void {
    this.isLoadingImages = true;
    this.imageUploadInsumoService.getExistingImages().subscribe({
      next: (images) => {
        this.existingImages = images;
        this.isLoadingImages = false;
      },
      error: (error) => {
        console.error('Error loading existing images:', error);
        this.isLoadingImages = false;
        // Opcional: mostrar un mensaje de error en la UI
      }
    });
  }

  selectExistingImage(filename: string): void {
    this.selectedFile = null; // Limpiar cualquier archivo seleccionado
    this.previewUrl = this.imagePath + filename;
    this.sharedService.nombreImagenInsumo(filename);
    this.uploadSuccess = true; // Indicar que una imagen ha sido seleccionada con éxito
  }

  onUpload(event: Event): void {
    event.preventDefault();
    if (!this.selectedFile) {
      return;
    }

    this.imageUploadInsumoService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload successful:', response.message);
        this.uploadSuccess = true;
        this.sharedService.nombreImagenInsumo(response.filename);
        
        // Actualizar la galería con la nueva imagen
        this.loadExistingImages();
        
        // Limpiar el archivo seleccionado para evitar re-subidas accidentales
        this.selectedFile = null;
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.uploadSuccess = false;
        // Opcional: mostrar un mensaje de error en la UI
      }
    });
  }
}