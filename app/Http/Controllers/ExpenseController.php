<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Models\Category;
use App\Models\Expense;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Auth::user()->expenses()
            ->with('category')
            ->latest('date')
            ->get()
            ->map(function ($expense) {
                return [
                    'id' => $expense->id,
                    'name' => $expense->name,
                    'amount' => $expense->amount,
                    'date' => $expense->date->toDateString(),
                    'category' => $expense->category ? [
                        'id' => $expense->category->id,
                        'name' => $expense->category->name,
                    ] : null,
                ];
            });

        $categories = Category::orderBy('name')->get();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpenseRequest $request)
    {
        $expense = Auth::user()->expenses()->create($request->validated());

        return redirect()
            ->route('expenses.index')
            ->with('success', 'Expense added successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return redirect()
            ->route('expenses.index')
            ->with('success', 'Expense deleted successfully.');
    }
}
