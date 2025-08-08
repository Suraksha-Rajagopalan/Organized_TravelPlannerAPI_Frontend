import { Component, inject, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../../../../common/services/trip.service';
import { ExpenseService } from '../../../../../common/services/expense.service';
import { AuthService } from '../../../../../common/services/auth.service';
import { Popup } from '../../../../../common/components/popup/popup';

@Component({
  standalone: false,
  selector: 'app-trip-expenses',
  templateUrl: './expenses.html',
})
export class Expenses implements OnInit {
  private authService = inject(AuthService);
  @ViewChild('toastContainer', { read: ViewContainerRef }) toastContainer!: ViewContainerRef;

  userId!: number;
  tripId!: number;
  expenseForm!: FormGroup;
  expenses: any[] = [];
  summary: any[] = [];
  total: number = 0;
  editingExpense: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tripService: TripService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    const tripIdParam = this.route.snapshot.paramMap.get('id');
    if (!tripIdParam || isNaN(+tripIdParam)) return;

    this.tripId = +tripIdParam;
    this.userId = this.authService.getUserId();

    this.initForm();
    this.loadExpenses();
  }

  initForm() {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      description: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().substring(0, 16), Validators.required],
    });
  }

  loadExpenses() {
    this.expenseService.getExpenses(this.tripId).subscribe({
      next: expenses => {
        this.expenses = expenses;
        this.total = expenses.reduce((acc, e) => acc + e.amount, 0);
        this.summary = [];
      },
      error: err => console.error('Error loading expenses:', err)
    });
  }

  showToast(message: string) {
    const toastRef: ComponentRef<Popup> = this.toastContainer.createComponent(Popup);
    toastRef.instance.message = message;
  }

  resetForm() {
    this.expenseForm.reset({
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().substring(0, 16),
    });
    this.editingExpense = null;
  }

  addExpense() {
    if (this.expenseForm.invalid) return;

    const raw = this.expenseForm.value;
    const expense = {
      category: raw.category,
      description: raw.description,
      amount: raw.amount,
      date: new Date(raw.date).toISOString(),
      tripId: this.tripId,
      id: this.editingExpense?.id ?? 0,
    };

    const action = this.editingExpense
      ? this.expenseService.updateExpense(this.tripId, this.editingExpense.id, expense)
      : this.expenseService.addExpense(this.tripId, expense);

    action.subscribe(result => {
      if (!result) {
        this.showToast('Access denied or failed to process the expense.');
        return;
      }
      this.resetForm();
      this.loadExpenses();
    });
  }

  editExpense(expense: any) {
    this.expenseForm.patchValue({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: expense.date.substring(0, 16),
    });
    this.editingExpense = expense;
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(this.tripId, id).subscribe(success => {
      this.loadExpenses();
    });
  }
}
