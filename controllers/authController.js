import User from '../models/User.js';
import { sendEmailVerification, sendEmailPasswordReset } from '../emails/authEmailService.js';
import { generateJWT, uniqueId } from '../utils/index.js';

const register = async (req, res) => {

    //Valida todos los campos
    if (Object.values(req.body).includes('')) {
        const error = new Error('Por favor, llena todos los campos.');

        return res.status(400).json({
            msg: error.message
        })
    }

    const { email, password, name } = req.body;

    //Evitar registros con email duplicados
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('Email ya registrado.');

        return res.status(400).json({
            msg: error.message
        })
    }

    //Validar contraseña
    const MIN_PASSWORD_LENGTH = 8;
    if (password.trim().length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);

        return res.status(400).json({
            msg: error.message
        })
    }

    try {
        const user = new User(req.body);
        const result = await user.save();

        const { name, email, token } = result;
        sendEmailVerification({ name, email, token });

        res.json({
            msg: 'Usuario creado correctamente. Revisa tu email para verificar tu cuenta.',
        })
    } catch (error) {
        console.log(error);
    }
};

const verifyAccount = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ token });
    if (!user) {
        const error = new Error('El token no es válido o ya ha sido utilizado.');

        return res.status(401).json({
            msg: error.message
        })
    }

    //Si el token es válido, verificar la cuenta
    try {
        user.verified = true;
        user.token = '',
        await user.save();

        res.json({
            msg: 'Usuario verificado correctamente.',
        })
    } catch (error) {
        console.log(error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    //Revisar que el susuario exista
    const user = await User.findOne({ email });

    if(!user) {
        const error = new Error('Las credenciales no son correctas.');

        return res.status(401).json({
            msg: error.message
        })
    }

    //Revisar si el usuario está verificado
    if (!user.verified) {
        const error = new Error('Por favor, verifica tu cuenta antes de iniciar sesión.');

        return res.status(401).json({
            msg: error.message
        })
    }

    //Comprobar la contraseña
    if (await user.checkPassword(password)) {
        const token = generateJWT(user._id);
        res.json({
            token,
        })
    } else {
        const error = new Error('Las credenciales no son correctas.');

        return res.status(401).json({
            msg: error.message
        })
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    //Revisar que el susuario exista
    const user = await User.findOne({ email });

    if(!user) {
        const error = new Error('El usuario no existe.');

        return res.status(404).json({
            msg: error.message
        })
    }

    try {
        user.token = uniqueId();
        const result = await user.save();

        await sendEmailPasswordReset({ 
            name: result.name, 
            email: result.email, 
            token: result.token 
        });

        res.json({
            msg: 'Se ha enviado un email para restablecer tu contraseña.',
        })
    } catch (error) {
        console.log(error);
    }
};

const verifyPasswordResetToken = async (req, res) => {
    const { token } = req.params;

    const isValidToken = await User.findOne({ token });
    if (!isValidToken) {
        const error = new Error('El token no es válido o ya ha sido utilizado.');

        return res.status(400).json({
            msg: error.message
        })

    }

    res.json({
        msg: 'Token válido.',
    })
}

const updatePassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({ token });
    if (!user) {
        const error = new Error('El token no es válido o ya ha sido utilizado.');

        return res.status(400).json({
            msg: error.message
        })

    }
    
    try {
        user.token = '';
        user.password = password;
        await user.save();
        res.json({
            msg: 'Contraseña actualizada correctamente.',
        })
    } catch (error) {
        console.log(error);
    }
}

const user = async (req, res) => {
    const { user } = req;
    res.json(user)
}

const admin = async (req, res) => {
    const { user } = req;
    if (!user.admin) {
        const error = new Error('Acción no válida.');

        return res.status(403).json({
            msg: error.message
        })
    }
    res.json(user)
}

export {
    register,
    verifyAccount,
    login,
    user,
    admin,
    forgotPassword,
    verifyPasswordResetToken,
    updatePassword,
}