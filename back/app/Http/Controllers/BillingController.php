<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PDF;

class BillingController extends Controller
{
    public function index()
    {
        $billings = Billing::with(['patient'])->get();
        return response()->json($billings);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'invoice_number' => 'required|string|unique:billings',
            'amount' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,overdue,cancelled',
            'due_date' => 'required|date',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $billing = Billing::create($request->all());
        return response()->json($billing, 201);
    }

    public function show(Billing $billing)
    {
        return response()->json($billing->load('patient'));
    }

    public function update(Request $request, Billing $billing)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'exists:patients,id',
            'invoice_number' => 'string|unique:billings,invoice_number,' . $billing->id,
            'amount' => 'numeric|min:0',
            'items' => 'array',
            'items.*.description' => 'string',
            'items.*.quantity' => 'integer|min:1',
            'items.*.unit_price' => 'numeric|min:0',
            'status' => 'in:pending,paid,overdue,cancelled',
            'due_date' => 'date',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $billing->update($request->all());
        return response()->json($billing);
    }

    public function destroy(Billing $billing)
    {
        $billing->delete();
        return response()->json(null, 204);
    }

    public function download(Billing $billing)
    {
        $pdf = PDF::loadView('billing.pdf', ['billing' => $billing->load('patient')]);
        return $pdf->download('invoice-' . $billing->invoice_number . '.pdf');
    }
} 