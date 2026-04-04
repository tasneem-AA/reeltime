<?php

namespace App\Http\Controllers\Api;

use App\Models\HeroBanner;
use Illuminate\Http\Request;

class HeroBannerController extends Controller
{
    /**
     * Get all hero banners
     */
    public function index()
    {
        $banners = HeroBanner::orderBy('position')->get();
        
        return response()->json([
            'data' => $banners,
            'count' => $banners->count()
        ]);
    }
}
