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

// Controller function to retrieve a user from the database using their Clerk ID
exports.getUserFromClerk = async (req, res) => {
  // Extract the `clerkId` from the request query parameters
  const { clerkId } = req.query;

  try {
    // Query the database to find a user with the matching Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    // If no user is found, return a 404 Not Found response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the user is found, return the user object as JSON
    // You can limit the response to just { id: user.id } if needed
    res.json(user);
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Return a 500 Internal Server Error response if something goes wrong
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};
