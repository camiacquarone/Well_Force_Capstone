const prisma = require("../models/prisma-client");

exports.createUser = async (req, res) => {

    try {
        
        const clerkId = req.auth.userId;
        const email = req.clerkUser?.primaryEmailAddress?.emailAddress || req.clerkUser?.emailAddresses[0]?.emailAddress;
        
        const { image_url, name, dietary_pref, goals, role, recommendations, caloric_goal, daysOfWeek, allergies} = req.body;

            const newUser = await prisma.user.create({
            data: {
                clerkId: clerkId,
                email: email,
                allergies: allergies, 
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
        const authClerkId = req.auth.userId;
        const userIdParams = req.params.clerkId;

        const user = await prisma.user.findUnique({where: {clerkId: userIdParams}});

         if(!user) {
            return res.status(404).json({error:" ERROR: user not found"});
        } else if (authClerkId !== userIdParams) {
            return res.status(403).json({error: "Forbidden: You can only access your own account."})
        }

        res.json(user);
    } catch(error) {
        res.status(400).json({error: "Could not find user."});
    }
};

exports.updateUser = async (req, res) => {
    const clerkId = req.auth.userId;

    const {email,
                image_url,
                 name,
                 allergies,
                 dietary_pref,
                 goals,
                 role,
                 recommendations,
                 caloric_goal,
               daysOfWeek} = req.body;

    const updatedUser = await prisma.user.update ({
        where:{clerkId},
        data:{email,
                image_url,
                 name,
                 allergies,
                 dietary_pref,
                 goals,
                 role,
                 recommendations,
                 caloric_goal,
               daysOfWeek}
    });

    res.json(updatedUser);


}


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