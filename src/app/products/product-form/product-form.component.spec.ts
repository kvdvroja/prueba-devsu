import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../services/product.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: any;

  beforeEach(async () => {
    const spy = {
      create: jest.fn(),
      update: jest.fn(),
      verifyId: jest.fn()
    };
    spy.verifyId.mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: ProductService, useValue: spy }]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService);
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should validate id minLength (3)', () => {
    const idCtrl = component.form.get('id')!;
    idCtrl.setValue('ab');
    idCtrl.markAsTouched();
    expect(idCtrl.hasError('minlength')).toBe(true);
  });

  it('should validate id maxLength (10)', () => {
    const idCtrl = component.form.get('id')!;
    idCtrl.setValue('abcdefghijk');
    idCtrl.markAsTouched();
    expect(idCtrl.hasError('maxlength')).toBe(true);
  });

  it('should validate name minLength (5)', () => {
    const ctrl = component.form.get('name')!;
    ctrl.setValue('ab');
    ctrl.markAsTouched();
    expect(ctrl.hasError('minlength')).toBe(true);
  });

  it('should validate description minLength (10)', () => {
    const ctrl = component.form.get('description')!;
    ctrl.setValue('short');
    ctrl.markAsTouched();
    expect(ctrl.hasError('minlength')).toBe(true);
  });

  it('should validate date_release must be >= today', () => {
    const ctrl = component.form.get('date_release')!;
    ctrl.setValue('2000-01-01');
    ctrl.markAsTouched();
    expect(ctrl.hasError('releaseDate')).toBe(true);
  });

  it('should accept valid date_release (today)', () => {
    const today = new Date().toISOString().substring(0, 10);
    const ctrl = component.form.get('date_release')!;
    ctrl.setValue(today);
    ctrl.markAsTouched();
    expect(ctrl.hasError('releaseDate')).toBe(false);
  });

  it('should validate date_revision is exactly 1 year after release', () => {
    const release = '2026-03-28';
    const wrongRevision = '2026-06-28';
    component.form.get('date_release')!.setValue(release);
    const revCtrl = component.form.get('date_revision')!;
    revCtrl.setValue(wrongRevision);
    revCtrl.markAsTouched();
    revCtrl.updateValueAndValidity();
    expect(revCtrl.hasError('revisionDate')).toBe(true);
  });

  it('should accept date_revision exactly 1 year after release', () => {
    const release = '2026-03-28';
    const correctRevision = '2027-03-28';
    component.form.get('date_release')!.setValue(release);
    const revCtrl = component.form.get('date_revision')!;
    revCtrl.setValue(correctRevision);
    revCtrl.updateValueAndValidity();
    expect(revCtrl.hasError('revisionDate')).toBe(false);
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(productServiceSpy.create).not.toHaveBeenCalled();
  });

  it('getError() should return required message for empty required field', () => {
    component.form.get('name')!.markAsTouched();
    const error = component.getError('name');
    expect(error).toBe('Este campo es requerido');
  });

  it('isInvalid() should return true for touched invalid field', () => {
    component.form.get('name')!.markAsTouched();
    expect(component.isInvalid('name')).toBe(true);
  });

  it('isInvalid() should return false for untouched field', () => {
    expect(component.isInvalid('name')).toBe(false);
  });

  it('onReset() should clear form', () => {
    component.form.get('name')!.setValue('Test');
    component.onReset();
    expect(component.form.get('name')!.value).toBeNull();
  });
});
