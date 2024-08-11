import { TestBed } from '@angular/core/testing';

import { CategoriasConsolasService } from './categorias-consolas.service';

describe('CategoriasConsolasService', () => {
  let service: CategoriasConsolasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriasConsolasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
