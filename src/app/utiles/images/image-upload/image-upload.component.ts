import { Component, Input, OnInit } from '@angular/core'; // 1. Importar Input
import { ImageUploadService } from '../../../services/image-upload.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { environment } from '../../../../enviroments/enviroments';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  // 2. NUEVO: Propiedad para recibir la imagen inicial desde el componente padre
  @Input() initialImageName: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadSuccess: boolean = false;
  isDragOver: boolean = false;

  existingImages: string[] = [];
  isLoadingImages: boolean = true;
  readonly imagePath = `${environment.apiUrl}/img-consolas/`;

  constructor(
    private sharedService: SharedService,
    private imageUploadService: ImageUploadService
  ) { }

  ngOnInit(): void {
    this.loadExistingImages();

    // 3. LÓGICA AÑADIDA: Si recibimos una imagen inicial, la mostramos.
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
    this.uploadSuccess = false; // Reiniciar el estado de éxito al cambiar de archivo

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  loadExistingImages(): void {
    this.isLoadingImages = true;
    this.imageUploadService.getExistingImages().subscribe((images: string[]) => {
      this.existingImages = images;
      this.isLoadingImages = false;
    });
  }

  selectExistingImage(filename: string): void {
    this.selectedFile = null;
    this.previewUrl = this.imagePath + filename;
    this.sharedService.nombreImagen(filename);
    this.uploadSuccess = true;
  }

  onUpload(event: Event): void {
    event.preventDefault();
    if (!this.selectedFile) {
      return;
    }

    this.imageUploadService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload successful:', response.message);
        this.uploadSuccess = true;
        this.sharedService.nombreImagen(response.filename);
        this.loadExistingImages();
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.uploadSuccess = false;
      }
    });
  }
}