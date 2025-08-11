import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../../../../common/services/trip.service';
import { ExpenseService } from '../../../../../common/services/expense.service';
import { AuthService } from '../../../../../common/services/auth.service';
import { Popup } from '../../../../../common/components/popup/popup';
import { TripDto } from '../../../../../common/DTOs/Trip/TripDto'; // adjust if path differs

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

  // Access control
  isOwner: boolean = false;
  hasEditAccess: boolean = false;
  accessChecked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tripService: TripService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    const tripIdParam = this.route.snapshot.paramMap.get('id');
    if (!tripIdParam || isNaN(+tripIdParam)) return;

    this.tripId = +tripIdParam;
    this.userId = this.authService.getUserId();

    this.initForm();
    this.loadTripAccess();
    this.loadExpenses();
  }

  private loadTripAccess(): void {
    this.tripService.getTrips().subscribe({
      next: (trips: TripDto[]) => {
        const trip = trips.find(t => t.id === this.tripId);
        if (trip) {
          this.isOwner = trip.userId === this.userId;
          this.hasEditAccess = (trip as any).accessLevel === 'Edit';
        } else {
          this.isOwner = false;
          this.hasEditAccess = false;
        }
        this.accessChecked = true;
      },
      error: (err: any) => {
        console.error('Failed to load trips for access check', err);
        this.isOwner = false;
        this.hasEditAccess = false;
        this.accessChecked = true;
      }
    });
  }

  private canEdit(): boolean {
    if (!this.accessChecked) {
      this.showToast('Checking permissions — please wait.');
      return false;
    }

    if (this.isOwner || this.hasEditAccess) {
      return true;
    }

    this.showToast('You do not have permission to modify expenses.');
    return false;
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
        this.total = expenses.reduce((acc: number, e: any) => acc + e.amount, 0);
        this.summary = [];
      },
      error: err => console.error('Error loading expenses:', err)
    });
  }

  showToast(message: string) {
    if (!this.toastContainer) {
      console.warn('toastContainer not ready');
      return;
    }
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
    if (!this.canEdit()) return;

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

    action.subscribe({
      next: result => {
        if (!result) {
          this.showToast('Access denied or failed to process the expense.');
          return;
        }
        this.resetForm();
        this.loadExpenses();
      },
      error: err => {
        console.error('Error saving expense', err);
        this.showToast('Failed to save expense. Try again later.');
      }
    });
  }

  editExpense(expense: any) {
    if (!this.canEdit()) return;
    this.expenseForm.patchValue({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: expense.date.substring(0, 16),
    });
    this.editingExpense = expense;
  }

  deleteExpense(id: number) {
    if (!this.canEdit()) return;
    this.expenseService.deleteExpense(this.tripId, id).subscribe({
      next: () => this.loadExpenses(),
      error: err => {
        console.error('Error deleting expense', err);
        this.showToast('Failed to delete expense.');
      }
    });
  }
}
