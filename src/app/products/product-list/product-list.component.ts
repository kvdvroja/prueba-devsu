import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  searchText = '';
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];

  selectedProduct: Product | null = null;
  showDeleteModal = false;
  openMenuId: string | null = null;

  loading = false;
  errorMessage = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.allProducts = res.data;
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Error al cargar los productos.';
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    const term = this.searchText.toLowerCase().trim();
    this.filteredProducts = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term)
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.paginatedProducts = this.filteredProducts.slice(0, this.pageSize);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onPageSizeChange(): void {
    this.updatePagination();
  }

  onAdd(): void {
    this.router.navigate(['/add']);
  }

  onEdit(product: Product): void {
    this.openMenuId = null;
    this.router.navigate(['/edit', product.id], { state: { product } });
  }

  onDeleteRequest(product: Product): void {
    this.openMenuId = null;
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    if (!this.selectedProduct) return;
    this.productService.delete(this.selectedProduct.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.selectedProduct = null;
          this.loadProducts();
        },
        error: () => {
          this.errorMessage = 'Error al eliminar el producto.';
          this.showDeleteModal = false;
        }
      });
  }

  onDeleteCancel(): void {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }

  toggleMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenus(): void {
    this.openMenuId = null;
  }
}
