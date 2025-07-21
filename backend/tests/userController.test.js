
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: { 
      findUnique: jest.fn(), 
      create: jest.fn(), 
    },
  })),
}));


jest.mock("../controllers/user-controller.js", () => ({
getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
}));


const request = require("supertest");
const express = require("express");

const userController = require("../controllers/user-controller.js");


const app = express();
app.use(express.json());
app.use("/users", require("../routes/user-routes.js"));


describe("User Controller", () => {

  // clear mocks before running
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /users/:id", () => {
    it("should return a user if they exist", async () => {
      const mockUser = {
        id: 1,
        clerkId: "clerkID",
        email: "temp@gmail.com",
        image_url: "img.png",
        name: "testname",
        dietary_pref: [],
        goals: [],
        role: "intern",
        recommendations: [],
      };

      userController.getUserById.mockImplementation(async (req, res) => {
        res.status(200).json(mockUser);
      });

      const response = await request(app).get("/users/clerkID");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      
    });

    it("should return 404 if user is not found", async () => {
      userController.getUserById.mockImplementation(async (req, res) => {
        res.status(404).json({ error: "User not found" }); 
      });

      const response = await request(app).get("/users/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
      expect(userController.getUserById).toHaveBeenCalledTimes(1);
    });
  });
});