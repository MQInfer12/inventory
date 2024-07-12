<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RenewTokenExpiration
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        return $response;
    }
}
