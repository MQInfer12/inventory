<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;

class UsuarioController extends Controller
{
    public function index()
    {
        $users = Usuario::all();
        return response()->json([
            "status" => 200,
            "message" => "Usuarios obtenidos correctamente",
            "data" => $users
        ]);
    }

    public function registro(Request $request)
    {
        $loggedUser = auth()->user();

        if(!$loggedUser->superadmin) {
            return response()->json([
                "status" => 401,
                "message" => "No tienes permisos para hacer esto",
                "data" => null
            ]);
        }

        $error = "";
        if(!$request->usuario) $error = "El usuario es obligatorio";
        if(!$request->password) $error = "La contraseña es obligatoria";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $user = new Usuario();
        $user->usuario = $request->usuario;
        $user->password = bcrypt($request->password);
        $user->superadmin = false;
        $user->save();
    
        return response()->json([
            "status" => 200,
            "message" => "Registro exitoso",
            "data" => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $loggedUser = auth()->user();

        if(!$loggedUser->superadmin) {
            return response()->json([
                "status" => 401,
                "message" => "No tienes permisos para hacer esto",
                "data" => null
            ]);
        }

        $request->validate([
            'usuario' => 'required',
        ], [
            'usuario.required' => 'El campo usuario es obligatorio.',
        ]);

        $user = Usuario::find($id);
        $user->usuario = $request->usuario;
        if($request->password != "") {
            $user->password = bcrypt($request->password);
        }

        $user->save();
        return response()->json([
            "status" => 200,
            "message" => "Usuario actualizado correctamente",
            "data" => $user
        ]);
    }

    public function show($id)
    {
        $user = Usuario::find($id);
        if ($user) {
            return response()->json([
                'status' => 200,
                'message' => "Usuario encontrado",
                "data" => $user
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => "Usuario no encontrado"
            ]);
        }
    }

    public function destroy($id)
    {
        $loggedUser = auth()->user();

        if(!$loggedUser->superadmin) {
            return response()->json([
                "status" => 401,
                "message" => "No tienes permisos para hacer esto",
                "data" => null
            ]);
        }

        $user = Usuario::destroy($id);
        return response()->json([
            "status" => 200,
            "message" => "Usuario eliminado correctamente",
            "data" => $user
        ]);
    }

    public function login(Request $request)
    {
        $error = "";
        if(!$request->usuario) $error = "El usuario es obligatorio";
        if(!$request->password) $error = "La contraseña es obligatoria";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $user = Usuario::where("usuario", "=", $request->usuario)->first();

        if(!isset($user->id)) {
            return response()->json([
                "status" => 404,
                "message" => "Usuario no encontrado",
                "data" => null
            ]);
        }

        if(!Hash::check($request->password, $user->password)) {
            return response()->json([
                "status" => 401,
                "message" => "Contraseña incorrecta",
                "data" => null
            ]);
        }

        $userData = $user;
        $token = $user->createToken("auth_token")->plainTextToken;
        return response()->json([
            "status" => 200,
            "message" => "Inicio de sesión correcto",
            "data" => [
                "access_token" => $token,
                "user" => $userData,
            ]
        ]);
    }

    public function Logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            "status" => 200,
            "message" => "Cierre de sesión correcto",
            "data" => null
        ]);
    }

    public function perfil()
    {
        return response()->json([
            "status" => 200,
            "message" => "Usuario recuperado correctamente",
            "data" => auth()->user()
        ]);
    }

    public function password($id, Request $request)
    {
        $error = "";
        if(!$request->oldPassword) $error = "La contraseña anterior es obligatoria";
        if(!$request->newPassword) $error = "La contraseña nueva es obligatoria";
        if(!$request->newPasswordRepeat) $error = "La confirmación es obligatoria";
        if($error != "") {
            return response()->json([
                "status" => 500,
                "message" => $error,
                "data" => null
            ]);
        }

        $loggedUser = auth()->user();
        if($loggedUser->id != $id && !$loggedUser->superadmin) {
            return response()->json([
                'status' => 401,
                'message' => "No estas autorizado para hacer esto",
                'data' => null
            ]);
        }
        $user = Usuario::find($id);
        if ($user == null) {
            return response()->json([
                'status' => 404,
                'message' => "Usuario no encontrado",
                'data' => null
            ]);
        } 
        if (!Hash::check($request->oldPassword, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => "La contraseña anterior es incorrecta",
                'data' => null
            ]);
        }
        if($request->newPassword != $request->newPasswordRepeat) {
            return response()->json([
                'status' => 500,
                'message' => "La contraseñas no coinciden",
                'data' => null
            ]);
        }
        $user->password = bcrypt($request->newPassword);
        $user->save();
        return response()->json([
            'status' => 200,
            'message' => "Contraseña cambiada correctamente",
            'data' => null
        ]);
    }
}
