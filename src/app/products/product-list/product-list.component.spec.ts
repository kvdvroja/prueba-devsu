import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { Product } from '../interfaces/product';

const mockProducts: Product[] = [
  { id: 'p1', name: 'Producto Uno', description: 'Descripción del producto uno', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
  { id: 'p2', name: 'Producto Dos', description: 'Descripción del producto dos', logo: '', date_release: '2025-02-01', date_revision: '2026-02-01' },
  { id: 'p3', name: 'Tarjeta Crédito', description: 'Tarjeta de consumo crédito', logo: '', date_release: '2025-03-01', date_revision: '2026-03-01' },
];

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: any;

  beforeEach(async () => {
    const spy = {
      getAll: jest.fn(),
      delete: jest.fn()
    };
    spy.getAll.mockReturnValue(of({ data: mockProducts }));

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent, DeleteModalComponent],
      imports: [RouterTestingModule, FormsModule],
      providers: [{ provide: ProductService, useValue: spy }]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService);
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getAll).toHaveBeenCalled();
    expect(component.allProducts.length).toBe(3);
  });

  it('should display paginated products limited by pageSize', () => {
    component.pageSize = 2;
    component.updatePagination();
    expect(component.paginatedProducts.length).toBe(2);
  });

  it('should filter products by search text', () => {
    component.searchText = 'Tarjeta';
    component.applyFilters();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe('p3');
  });

  it('should show all products when search is cleared', () => {
    component.searchText = '';
    component.applyFilters();
    expect(component.filteredProducts.length).toBe(3);
  });

  it('should show empty state when no products match search', () => {
    component.searchText = 'zzznomatch';
    component.applyFilters();
    expect(component.filteredProducts.length).toBe(0);
    expect(component.paginatedProducts.length).toBe(0);
  });

  it('should toggle dropdown menu', () => {
    const event = new MouseEvent('click');
    component.toggleMenu('p1', event);
    expect(component.openMenuId).toBe('p1');
    component.toggleMenu('p1', event);
    expect(component.openMenuId).toBeNull();
  });

  it('should close all menus on closeMenus()', () => {
    component.openMenuId = 'p1';
    component.closeMenus();
    expect(component.openMenuId).toBeNull();
  });

  it('should open delete modal when onDeleteRequest is called', () => {
    component.onDeleteRequest(mockProducts[0]);
    expect(component.showDeleteModal).toBe(true);
    expect(component.selectedProduct).toEqual(mockProducts[0]);
  });

  it('should close modal and reload on delete confirm', () => {
    productServiceSpy.delete.mockReturnValue(of({ message: 'Product removed successfully' }));
    component.selectedProduct = mockProducts[0];
    component.showDeleteModal = true;
    component.onDeleteConfirm();
    expect(productServiceSpy.delete).toHaveBeenCalledWith('p1');
    expect(component.showDeleteModal).toBe(false);
    expect(component.selectedProduct).toBeNull();
  });

  it('should cancel delete and close modal', () => {
    component.selectedProduct = mockProducts[0];
    component.showDeleteModal = true;
    component.onDeleteCancel();
    expect(component.showDeleteModal).toBe(false);
    expect(component.selectedProduct).toBeNull();
  });

  it('should show error on load failure', () => {
    productServiceSpy.getAll.mockReturnValue(throwError(() => new Error('Network error')));
    component.loadProducts();
    expect(component.errorMessage).toBeTruthy();
  });
});
