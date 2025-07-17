const prisma = require("../models/prisma-client");

exports.createUser = async (req, res) => {
    try {
            const {clerkId, email, image_url, name, dietary_pref, goals, role, recommendations} = req.body;
            const newUser = await prisma.user.create({
            data: {
                clerkId,
                email,
                image_url,
                name,
                dietary_pref,
                goals,
                role,
                recommendations
            }
        });

        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};
 
exports.getUserById = async (req, res) => {
    try {
        const user_id = Number(req.params.id);
        const user = await prisma.user.findUnique({where: {id}});

        if(!user) {
            return res.status(404).json({error:" ERROR: user not found"});
        }
        res.json(user);
    } catch(error) {
        res.status(400).json({error: "Could not find user."});
    }
    
};