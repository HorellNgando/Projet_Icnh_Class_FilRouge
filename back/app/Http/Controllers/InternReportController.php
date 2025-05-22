<?php

namespace App\Http\Controllers;

use App\Models\InternReport;
use Illuminate\Http\Request;

class InternReportController extends Controller
{
    public function index(Request $request)
    {
        $reports = InternReport::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'department' => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'status' => 'required|string|in:draft,submitted,approved,rejected'
        ]);

        $report = InternReport::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'department' => $validated['department'],
            'supervisor' => $validated['supervisor'],
            'status' => $validated['status']
        ]);

        return response()->json($report, 201);
    }

    public function show(Request $request, InternReport $internReport)
    {
        if ($internReport->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($internReport);
    }

    public function update(Request $request, InternReport $internReport)
    {
        if ($internReport->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'department' => 'sometimes|required|string|max:255',
            'supervisor' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string|in:draft,submitted,approved,rejected'
        ]);

        $internReport->update($validated);
        return response()->json($internReport);
    }

    public function destroy(Request $request, InternReport $internReport)
    {
        if ($internReport->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $internReport->delete();
        return response()->json(['message' => 'Intern report deleted successfully']);
    }
} 