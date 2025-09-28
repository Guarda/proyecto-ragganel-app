import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { ImageUploadAccesorioService } from '../../../services/image-upload-accesorio.service'; // 1. Importar el nuevo servicio

@Component({
  selector: 'app-image-upload-accesorio',
  standalone: true, // 2. Asegurarse de que sea standalone
  imports: [CommonModule],
  templateUrl: './image-upload-accesorio.component.html',
  styleUrls: ['./image-upload-accesorio.component.css']
})
export class ImageUploadAccesorioComponent implements OnInit {
  // 3. Añadir Input para el modo de edición
  @Input() initialImageName: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadSuccess: boolean = false;
  isDragOver: boolean = false;

  // 4. Propiedades para la galería
  existingImages: string[] = [];
  isLoadingImages: boolean = true;
  readonly imagePath = 'http://localhost:3000/img-accesorios/'; // 5. Ruta a las imágenes de accesorios

  constructor(
    private sharedService: SharedService,
    private imageUploadAccesorioService: ImageUploadAccesorioService // 6. Inyectar el nuevo servicio
  ) { }

  ngOnInit(): void {
    this.loadExistingImages();

    // Lógica para mostrar la imagen inicial en modo "edición"
    if (this.initialImageName) {
      this.previewUrl = this.imagePath + this.initialImageName;
    }
  }

  onFileSelected(event: any): void {
    this.setFile(event.target.files[0]);
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
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.setFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  setFile(file: File): void {
    this.selectedFile = file;
    this.uploadSuccess = false;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 7. Nuevos métodos para la galería
  loadExistingImages(): void {
    this.isLoadingImages = true;
    this.imageUploadAccesorioService.getExistingImages().subscribe((images: string[]) => {
      this.existingImages = images;
      this.isLoadingImages = false;
    });
  }

  selectExistingImage(filename: string): void {
    this.selectedFile = null;
    this.previewUrl = this.imagePath + filename;
    this.sharedService.nombreImagenAccesorio(filename); // Usar el método específico
    this.uploadSuccess = true;
  }

  onUpload(event: Event): void {
    event.preventDefault();
    if (!this.selectedFile) {
      return;
    }

    this.imageUploadAccesorioService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload successful:', response.message);
        this.uploadSuccess = true;
        this.sharedService.nombreImagenAccesorio(response.filename); // Usar el método específico
        this.loadExistingImages();
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.uploadSuccess = false;
      }
    });
  }
}