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
            },
            include: {
                dietary_pref: true,
                goals: true,
                recommendations: true
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
        console.log("Controller: getUserById - authClerkId:", authClerkId);
        console.log("Controller: getUserById - userIdParams:", userIdParams);
        const user = await prisma.user.findUnique({where: {clerkId: userIdParams},  include: {
        dietary_pref: true,
        goals: true,
        recommendations: true
    }});

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


  try {
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

      console.log("this is the user dietary pref", dietary_pref);


    const updatedUser = await prisma.user.update ({
        where:{clerkId},
        data:{email,
                image_url,
                 name,
                 allergies,
                 dietary_pref: {
                    set: dietary_pref.connect
                },
                 goals,
                 role,
                 recommendations,
                 caloric_goal,
               daysOfWeek},
               include : {
                dietary_pref: true,
                goals: true,
                recommendations: true,
               }
    });

    res.json(updatedUser);
  }catch (error) {
      res.json(400).json({error: error.message});
  }
   
}


exports.getUserFromClerk = async (req, res) => {
  const { clerkId } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Failed to retrieve user" });
  }
};


exports.getCurrentUser = async (req, res) => {
  console.log("🔥 /current_user_snack route hit");
  try {
    const clerkId = req.auth.userId;

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized: No Clerk ID found" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        dietary_pref: true,
        goals: true,
        recommendations: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      allergies: user.allergies, 
      dietary_pref: user.dietary_pref,
      goals: user.goals,
    });

  } catch (err) {
    console.error("Error getting current user:", err);
    res.status(500).json({ error: "Failed to get current user" });
  }
};

exports.getUserPreferences = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        caloric_goal: true,
        dietary_pref: true,
        allergies: true,
        goals: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Failed to fetch preferences:", error);
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
};
