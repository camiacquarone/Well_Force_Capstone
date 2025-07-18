const prisma = require("../models/prisma-client");

exports.createUser = async (req, res) => {

    try {
            const { clerkId, email, image_url, name, dietary_pref, goals, role, recommendations, caloric_goal, daysOfWeek} = req.body;

            const newUser = await prisma.user.create({
            data: {
                clerkId: clerkId,
                email: email,
                image_url: image_url,
                name: name,
                dietary_pref: dietary_pref,
                goals: goals,
                role: role,
                recommendations: recommendations,
                caloric_goal: caloric_goal,
                daysOfWeek: daysOfWeek
            }
        });


        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};
 
exports.getUserById = async (req, res) => {
    try {
        const clerkIdFromAuth = req.auth.userId;
        const user_id = Number(req.params.id);
        const user = await prisma.user.findUnique({where: {user_id}});

        if(!user) {
            return res.status(404).json({error:" ERROR: user not found"});
        } else if (user.clerkId !== clerkIdFromAuth) {
            return res.status(403).json({error: "Forbidden: You can only access your own account."})
        }

        res.json(user);
    } catch(error) {
        res.status(400).json({error: "Could not find user."});
    }
    
};