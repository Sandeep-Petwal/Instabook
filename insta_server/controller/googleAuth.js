var jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const validate = require("../util/validator");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { Users, Session } = require("../model/index.js");
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.googleAuth = async (req, res) => {
    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        let user = await Users.findOne({ where: { [Op.or]: [{ googleId: payload.sub }, { email: payload.email }] } });

        if (!user) {
            console.log("Creating new user");
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await Users.create({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                username: payload.name.replace(/\s+/g, '_') + '_' + Math.floor(Date.now() / 1000),
                profile_img: payload.picture,
                password: hashedPassword
            });
        }

        user.login_count += 1;
        await user.save();

        // Creating a session
        const session_id = uuidv4();
        await Session.create({
            session_id,
            user_id: user.user_id,
            userAgent: req.headers['user-agent'] || 'unknown',
            ip: req.ip || req.connection.remoteAddress
        });


        const { user_id, name, username } = user;
        const token = jwt.sign(
            { user_id, name, email: user.email, username, session_id },
            secret,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            two_factor_enabled: false,
        });

    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(400).json({ error: 'Invalid token' });
    }
};
