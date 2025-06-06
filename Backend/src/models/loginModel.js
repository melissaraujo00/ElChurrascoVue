import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const loginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        min: 8,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    roles: {
        type: [String], 
        enum: ['user', 'admin'], 
        default: 'user'
    }
});


loginSchema.statics.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};


loginSchema.statics.comparePassword = async function(password, receivedPassword) {
    return await bcrypt.compare(password, receivedPassword);
};

// Creación del modelo
const Login = mongoose.model('login', loginSchema);

export default Login;