const prisma = require("../models/prisma-client")

exports.createUser = async (req, res) => {
    const {image_url, name, dietary_pref, goals, role, recommendations} = req.body;
    const newUser = prisma.user.create ({
        data: {
            image_url, 
            name, 
            dietary_pref, 
            goals, 
            role, 
            recommendations
        }
    })

    res.status(201).json(user);
}