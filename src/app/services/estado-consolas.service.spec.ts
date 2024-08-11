import { TestBed } from '@angular/core/testing';

import { EstadoConsolasService } from './estado-consolas.service';

describe('EstadoConsolasService', () => {
  let service: EstadoConsolasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoConsolasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
