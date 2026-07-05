const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

const sendVerificationEmail = async (email, username, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: `"AutoDealer" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Verify your AutoDealer account",
        html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <div style="background:#111827;padding:28px 32px;">
                <span style="font-size:1.4rem;font-weight:700;color:#fff;">Auto<span style="color:#d4a853;">Dealer</span></span>
            </div>
            <div style="padding:32px;">
                <h2 style="margin:0 0 8px;color:#111827;font-size:1.2rem;">Hi ${username}, welcome aboard!</h2>
                <p style="color:#6b7280;margin:0 0 28px;line-height:1.6;">
                    Please verify your email address to activate your account and start browsing our inventory.
                </p>
                <a href="${verifyUrl}"
                   style="display:inline-block;background:#d4a853;color:#111827;font-weight:700;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:0.95rem;">
                    Verify My Email
                </a>
                <p style="color:#9ca3af;font-size:0.82rem;margin:24px 0 0;">
                    This link expires in 24 hours. If you didn't create an account, you can ignore this email.
                </p>
            </div>
        </div>
        `,
    });
};

// Register
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const skipVerification = process.env.SKIP_EMAIL_VERIFICATION === "true";

        if (skipVerification) {
            await User.create({
                username,
                email,
                password: hashedPassword,
                role: "client",
                isVerified: true,
            });

            return res.status(201).json({
                message: "Account created successfully! You can now log in.",
            });
        }

        const verifyToken = crypto.randomBytes(32).toString("hex");
        const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: "client",
            isVerified: false,
            verifyToken,
            verifyTokenExpiry,
        });

        await sendVerificationEmail(email, username, verifyToken);

        res.status(201).json({
            message: "Account created! Please check your email to verify your account.",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                code: "EMAIL_NOT_VERIFIED",
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify email via token link
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: "Verification token is required." });
        }

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification link." });
        }

        user.isVerified = true;
        user.verifyToken = null;
        user.verifyTokenExpiry = null;
        await user.save();

        res.json({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resend verification email
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        // Always respond with success so we don't expose whether an email exists
        if (!user || user.isVerified) {
            return res.json({ message: "If that email exists and is unverified, a new link has been sent." });
        }

        const verifyToken = crypto.randomBytes(32).toString("hex");
        user.verifyToken = verifyToken;
        user.verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        await sendVerificationEmail(email, user.username, verifyToken);

        res.json({ message: "If that email exists and is unverified, a new link has been sent." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, verifyEmail, resendVerification };
