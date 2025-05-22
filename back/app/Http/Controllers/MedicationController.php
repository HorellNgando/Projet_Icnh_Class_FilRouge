<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use Illuminate\Http\Request;

class MedicationController extends Controller
{
    public function index(Request $request)
    {
        $medications = Medication::orderBy('name', 'asc')->get();
        return response()->json($medications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'dosage' => 'required|string|max:255',
            'frequency' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'stock' => 'required|integer|min:0'
        ]);

        $medication = Medication::create($validated);
        return response()->json($medication, 201);
    }

    public function show(Medication $medication)
    {
        return response()->json($medication);
    }

    public function update(Request $request, Medication $medication)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'dosage' => 'sometimes|required|string|max:255',
            'frequency' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'stock' => 'sometimes|required|integer|min:0'
        ]);

        $medication->update($validated);
        return response()->json($medication);
    }

    public function destroy(Medication $medication)
    {
        $medication->delete();
        return response()->json(['message' => 'Medication deleted successfully']);
    }
} 