import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product';

const mockProduct: Product = {
  id: 'trj-cr',
  name: 'Tarjeta de Crédito',
  description: 'Tarjeta de consumo bajo la modalidad de crédito',
  logo: 'https://example.com/logo.png',
  date_release: '2025-01-01',
  date_revision: '2026-01-01'
};

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3002/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should GET all products', () => {
    const mockResponse = { data: [mockProduct] };
    service.getAll().subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].id).toBe('trj-cr');
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('create() should POST a product', () => {
    const mockRes = { message: 'Product added successfully', data: mockProduct };
    service.create(mockProduct).subscribe(res => {
      expect(res.message).toBe('Product added successfully');
      expect(res.data.id).toBe('trj-cr');
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockRes);
  });

  it('update() should PUT a product by id', () => {
    const updated = { name: 'Nuevo Nombre' };
    const mockRes = { message: 'Product updated successfully', data: { ...mockProduct, ...updated } };
    service.update('trj-cr', updated).subscribe(res => {
      expect(res.message).toBe('Product updated successfully');
    });
    const req = httpMock.expectOne(`${apiUrl}/trj-cr`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockRes);
  });

  it('delete() should DELETE a product by id', () => {
    service.delete('trj-cr').subscribe(res => {
      expect(res.message).toBe('Product removed successfully');
    });
    const req = httpMock.expectOne(`${apiUrl}/trj-cr`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });
  });

  it('verifyId() should GET verification endpoint', () => {
    service.verifyId('trj-cr').subscribe(exists => {
      expect(exists).toBe(true);
    });
    const req = httpMock.expectOne(`${apiUrl}/verification/trj-cr`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('verifyId() should return false for non-existent id', () => {
    service.verifyId('no-existe').subscribe(exists => {
      expect(exists).toBe(false);
    });
    const req = httpMock.expectOne(`${apiUrl}/verification/no-existe`);
    req.flush(false);
  });
});
