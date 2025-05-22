<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $reports = Report::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:medical,administrative,technical',
            'status' => 'required|string|in:draft,published,archived'
        ]);

        $report = Report::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'status' => $validated['status']
        ]);

        return response()->json($report, 201);
    }

    public function show(Request $request, Report $report)
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($report);
    }

    public function update(Request $request, Report $report)
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|in:medical,administrative,technical',
            'status' => 'sometimes|required|string|in:draft,published,archived'
        ]);

        $report->update($validated);
        return response()->json($report);
    }

    public function destroy(Request $request, Report $report)
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report->delete();
        return response()->json(['message' => 'Report deleted successfully']);
    }
} 