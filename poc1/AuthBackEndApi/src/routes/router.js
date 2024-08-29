const express = require("express");
const Factory = require("../factory/factory.js");
const authorize = require("../middleware/authorize");

const router = express.Router();
const factory = new Factory();

// Routes for user operations
const userController = factory.create("user");
router.post("/signup", (req, res) => {
  userController.createUser(req, res);
});
router.post("/login", (req, res) => {
  userController.login(req, res);
});
router.post("/verifyOtp", (req, res) => {
  userController.verifyOtp(req, res);
});
router.post("/createUserRole", authorize(["admin"]), (req, res) => {
  userController.createUserRole(req, res);
});

// Routes for organization operations
const organizationController = factory.create("organization");

router.post("/createOrganizations", authorize(["admin"]), (req, res) => {
  organizationController.createOrganization(req, res);
});


router.delete("/deleteOrganizations/:id", authorize(["admin"]), (req, res) => {
  organizationController.deleteOrganization(req, res);
});
router.put("/updateOrganizations/:id", authorize(["admin"]), (req, res) => {
  organizationController.updateOrganization(req, res);
});

// Routes for role operations
router.post("/createRoles", authorize(["admin"]), (req, res) => {
  const roleController = factory.create("role");
  roleController.createRole(req, res);
});

module.exports = router;
