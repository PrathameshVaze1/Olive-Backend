import { Head, router, Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { store, destroy } from '@/actions/App/Http/Controllers/ExpenseController';
import AppLayout from '@/layouts/app-layout';
import { type SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { index } from '@/routes/expenses';

interface Category {
    id: number;
    name: string;
}

interface Expense {
    id: number;
    name: string;
    amount: string;
    date: string;
    category: Category | null;
}

interface IndexProps {
    expenses: Expense[];
    categories: Category[];
    flash?: {
        success?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Expenses',
        href: index().url,
    },
];

export default function Index({ expenses, categories, flash }: IndexProps) {
    const { auth } = usePage<SharedData>().props;
    const [showForm, setShowForm] = useState(false);
    const [categoryId, setCategoryId] = useState<string>(
        categories.length > 0 ? categories[0].id.toString() : ''
    );

    const totalAmount = expenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expenses" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title="Expenses"
                        description="Track and manage your expenses"
                    />
                    <Button
                        onClick={() => {
                            setShowForm(!showForm);
                            if (showForm && categories.length > 0) {
                                setCategoryId(categories[0].id.toString());
                            }
                        }}
                        variant={showForm ? 'outline' : 'default'}
                    >
                        {showForm ? 'Cancel' : 'Add Expense'}
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                        {flash.success}
                    </div>
                )}

                {showForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Expense</CardTitle>
                            <CardDescription>
                                Enter the details of your expense
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...store.form()}
                                className="space-y-6"
                                onSuccess={() => {
                                    setShowForm(false);
                                    if (categories.length > 0) {
                                        setCategoryId(
                                            categories[0].id.toString()
                                        );
                                    }
                                }}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">
                                                    Expense Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    placeholder="e.g., Groceries"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="amount">
                                                    Amount
                                                </Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        ₹
                                                    </span>
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        name="amount"
                                                        className="pl-7"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.amount}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="date">Date</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    name="date"
                                                    defaultValue={new Date()
                                                        .toISOString()
                                                        .split('T')[0]}
                                                    required
                                                />
                                                <InputError
                                                    message={errors.date}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="category">
                                                    Category
                                                </Label>
                                                <Select
                                                    value={categoryId}
                                                    onValueChange={setCategoryId}
                                                >
                                                    <SelectTrigger id="category">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={category.id.toString()}
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <input
                                                    type="hidden"
                                                    name="category_id"
                                                    value={categoryId}
                                                />
                                                <InputError
                                                    message={errors.category_id}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Saving...'
                                                    : 'Save Expense'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowForm(false);
                                                    if (categories.length > 0) {
                                                        setCategoryId(
                                                            categories[0].id.toString()
                                                        );
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-0">
                        {expenses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-muted-foreground">
                                    No expenses yet. Add your first expense by
                                    clicking the "Add Expense" button.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Amount
                                            </th>
                                            <th className="relative px-6 py-3">
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((expense) => (
                                            <tr
                                                key={expense.id}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium">
                                                        {expense.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge variant="secondary">
                                                        {expense.category?.name ?? 'Uncategorized'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                    {new Date(
                                                        expense.date
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    ₹
                                                    {parseFloat(
                                                        expense.amount
                                                    ).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    'Are you sure you want to delete this expense?'
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    destroy(
                                                                        expense.id
                                                                    ).url
                                                                );
                                                            }
                                                        }}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t bg-muted/50">
                                            <td
                                                colSpan={3}
                                                className="px-6 py-3 text-right text-sm font-medium"
                                            >
                                                Total:
                                            </td>
                                            <td className="px-6 py-3 text-right text-sm font-medium">
                                                ₹{totalAmount.toFixed(2)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
