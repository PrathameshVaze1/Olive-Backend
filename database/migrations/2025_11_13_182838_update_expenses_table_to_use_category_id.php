<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add category_id column
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('date')->constrained()->onDelete('restrict');
        });

        // Migrate existing category strings to category_id
        $categoryMap = DB::table('categories')->pluck('id', 'name');

        foreach ($categoryMap as $name => $id) {
            DB::table('expenses')
                ->where('category', $name)
                ->whereNull('category_id')
                ->update(['category_id' => $id]);
        }

        // For any expenses with categories that don't match, set to "Other" category if it exists
        $otherCategoryId = DB::table('categories')
            ->where('name', 'Other')
            ->value('id');

        if ($otherCategoryId) {
            DB::table('expenses')
                ->whereNull('category_id')
                ->whereNotNull('category')
                ->update(['category_id' => $otherCategoryId]);
        }

        // Remove old category column
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('category')->after('date');
        });

        // Migrate category_id back to category string
        $categoryMap = DB::table('categories')->pluck('name', 'id');

        foreach ($categoryMap as $id => $name) {
            DB::table('expenses')
                ->where('category_id', $id)
                ->update(['category' => $name]);
        }

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
