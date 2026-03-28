import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, catchError, debounceTime, map, of, switchMap, takeUntil } from 'rxjs';
import { Product } from '../interfaces/product';
import { ProductService } from '../services/product.service';

function releaseDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const release = new Date(control.value + 'T00:00:00');
  return release >= today ? null : { releaseDate: true };
}

function revisionDateValidator(releaseControlName: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !control.parent) return null;
    const releaseValue = control.parent.get(releaseControlName)?.value;
    if (!releaseValue) return null;
    const release = new Date(releaseValue + 'T00:00:00');
    const revision = new Date(control.value + 'T00:00:00');
    const expected = new Date(release);
    expected.setFullYear(expected.getFullYear() + 1);
    const diff = Math.abs(revision.getTime() - expected.getTime());
    return diff < 86400000 ? null : { revisionDate: true };
  };
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isEditMode = false;
  editId = '';
  submitting = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.editId = id;
        const nav = this.router.getCurrentNavigation();
        const state = nav?.extras?.state as { product: Product } | undefined;
        const product: Product | undefined = state?.product || (window.history.state as any)?.product;
        if (product) {
          this.populateForm(product);
        }
        this.form.get('id')!.disable();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      id: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [this.idExistsValidator()],
        updateOn: 'blur'
      }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, releaseDateValidator]],
      date_revision: ['', [Validators.required]]
    });

    this.form.get('date_revision')!.addValidators(revisionDateValidator('date_release'));

    this.form.get('date_release')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.get('date_revision')!.updateValueAndValidity();
      });
  }

  private populateForm(product: Product): void {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release?.toString().substring(0, 10),
      date_revision: product.date_revision?.toString().substring(0, 10)
    });
  }

  private idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(id =>
          this.productService.verifyId(id).pipe(
            map(exists => exists ? { idExists: true } : null),
            catchError(() => of(null))
          )
        )
      );
    };
  }

  getError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl || !ctrl.touched || ctrl.valid) return '';
    const e = ctrl.errors;
    if (!e) return '';
    if (e['required']) return 'Este campo es requerido';
    if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres`;
    if (e['idExists']) return 'El ID ya existe, ingrese uno diferente';
    if (e['releaseDate']) return 'La fecha debe ser igual o mayor a la fecha actual';
    if (e['revisionDate']) return 'La fecha debe ser exactamente un año posterior a la liberación';
    return 'Campo inválido';
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  }

  onReset(): void {
    if (this.isEditMode) {
      this.form.reset();
    } else {
      this.form.reset();
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.submitError = '';

    const value = { ...this.form.getRawValue() };

    const request$ = this.isEditMode
      ? this.productService.update(this.editId, value)
      : this.productService.create(value);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.submitting = false;
        this.submitError = err?.error?.message || 'Error al guardar el producto';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
