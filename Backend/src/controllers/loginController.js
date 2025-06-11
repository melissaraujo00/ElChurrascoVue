import authMiddleware from '../middleware/authMiddleware.js';
import Login from '../models/loginModel.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import validateLogin from '../validations/userValidation.js';
import mongoose from 'mongoose';


cookieParser();
dotenv.config();

/**
 * @description get all user
 * @route GET /login
 */

export const listaUsuarios = [authMiddleware, async (req, res) => {
    try {
        const modulos = await Login.find({}, { password: 0 }); // Excluye el campo password
        res.json(modulos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los usuarios.' });
    }
}];

/**
 * @description get a user
 * @route GET /login/:id
 */



export const usuarioId = [authMiddleware, async (req, res) => {
    const id = req.params.id;

    // Verifica si el id es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID no válido' });
    }

    try {
        const usuario = await Login.findById(id, { password: 0 }); // Excluye el campo password
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
}];


/**
 * @description store module
 * @route POST /login/register
 */

export const resgistrarUsuario = [validateLogin, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, lastName, user, email, phone, password, roles = ['user'] } = req.body; // Asigna "user" si no hay roles

    try {
        let userExists = await Login.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await Login.encryptPassword(password);

        await Login.create({
            name,
            lastName,
            user,
            email,
            phone,
            password: hashedPassword,
            roles
        });

        res.status(200).json({ msg: 'User registered successfully' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}];

/**
 * @description user login
 * @route POST /login/signin
 */


const loginLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts from this IP, please try again later.'
});

export const inicioSesion = [async (req, res) => {
    try {
        const userFound = await Login.findOne({ email: req.body.email });
        if (!userFound) return res.status(400).json({ message: "User not found" });

        const matchPassword = await Login.comparePassword(req.body.password, userFound.password);
        if (!matchPassword) return res.status(401).json({ token: null, message: 'Invalid password' });

        const payload = {
            user: {
                id_user: userFound._id,
                name: userFound.name,
                roles: userFound.roles
            }
        };
        console.log(userFound);


        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 * 24000 },
            (err, token) => {
                if (err) throw err;

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' para producción, 'Lax' en local
                    maxAge: 3600 * 24000 // 24 horas
                });

                res.json({ message: 'Signed in successfully' });
            }
        );
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}];


/**
 * @description user logout
 * @route POST /login/logout
 */

export const cierreSesion = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' para producción, 'Lax' en local
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al cerrar sesión' });
    }
};

/**
 * @description keep logged in
 * @route GET /login/profile
 */

export const mantenerPerfil = [authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id_user;

        const user = await Login.findById(userId, { password: 0 });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
    }
}];

/**
 * @description update user
 * @route PUT /login/usuario/:id
 */

export const actulizarUsuario = [authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        let usuario = await Login.findById(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (req.body.name != null) {
            usuario.name = req.body.name;
        }
        if (req.body.lastName != null) {
            usuario.lastName = req.body.lastName;
        }

        if (req.body.user != null) {
            usuario.user = req.body.user;
        }
        if (req.body.email != null) {
            usuario.email = req.body.email;
        }
        if (req.body.phone != null) {
            usuario.phone = req.body.phone;
        }
        if (req.body.password != null) {
            usuario.password = await Login.encryptPassword(req.body.password);
        }
        if (req.body.roles != null) {
            usuario.roles = req.body.roles;
        }

        usuario = await usuario.save();

        res.json(usuario);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error al actualizar el usuario' });
    }
}];

/**
 * @description Update logged-in user info
 * @route PUT /login/update
 * @access Private
 */

export const actualizarUsuarioLogeado = [authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id_user;

        const usuario = await Login.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { name, lastName, user, email, phone, password } = req.body;

        if (name) usuario.name = name;
        if (lastName) usuario.lastName = lastName;
        if (user) usuario.user = user;
        if (email) usuario.email = email;
        if (phone) usuario.phone = phone;
        if (password) usuario.password = await Login.encryptPassword(password);

        await usuario.save();

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
}];

/**
 * @description delete user
 * @route PUT /login/usuario/:id
 */

export const eliminarUsuario = [authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await Login.findById(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await Login.deleteOne({ _id: id });

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
}];

/**
 * @description Delete logged-in user account
 * @route DELETE /login/delete
 * @access Private
 */

export const eliminarUsuarioLogeado = [authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id_user;

        const usuario = await Login.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await Login.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
}];
