const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

class AuthController {
    // @desc    Register new user
    // @route   POST /api/auth/register
    // @access  Public
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if user exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists',
                });
            }

            // Create user
            const user = await User.create({
                username,
                email,
                password,
            });

            if (user) {
                logger.info(`New user registered: ${user._id}`);
                res.status(201).json({
                    success: true,
                    data: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        token: generateToken(user._id),
                    },
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user data',
                });
            }
        } catch (err) {
            logger.error(`Register Error: ${err.message}`);
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }

    // @desc    Authenticate a user
    // @route   POST /api/auth/login
    // @access  Public
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Check for user email
            const user = await User.findOne({ email }).select('+password');

            if (user && (await user.matchPassword(password))) {
                logger.info(`User logged in: ${user._id}`);
                res.json({
                    success: true,
                    data: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        token: generateToken(user._id),
                    },
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }
        } catch (err) {
            logger.error(`Login Error: ${err.message}`);
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }

    // @desc    Get user data
    // @route   GET /api/auth/me
    // @access  Private
    async getMe(req, res) {
        try {
            const user = await User.findById(req.user.id);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (err) {
            logger.error(`GetMe Error: ${err.message}`);
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
}

module.exports = new AuthController();
