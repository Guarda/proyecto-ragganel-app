import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../../services/shared.service';

@Component({
    selector: 'app-image-upload-insumo',
    imports: [CommonModule],
    templateUrl: './image-upload-insumo.component.html',
    styleUrl: './image-upload-insumo.component.css'
})
export class ImageUploadInsumoComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadSuccess: boolean = false;
  isDragOver: boolean = false;

  constructor(private http: HttpClient,
    private sharedService: SharedService
  ) {}

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

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onUpload(event: Event): void {
    event.preventDefault(); // Prevents any form-like behavior
    if (!this.selectedFile) {
      console.error('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<{ message: string, filename: string }>('http://localhost:3000/upload-imagen-insumos', formData).subscribe({
      next: (response) => {
        console.log('Upload successful:', response.message);
        this.uploadSuccess = true;

        // Save the uploaded file name into SharedService
        // this.sharedService.nombreImagen(this.selectedFile!.name);
        this.sharedService.nombreImagenInsumo(response.filename);
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.uploadSuccess = false;
      }
    });
  }
}
