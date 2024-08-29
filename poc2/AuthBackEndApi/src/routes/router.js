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

//-------------------------------------***------------------------------------------------------
// for forms
// Routes for form operations
const formController = factory.create("forms");
const authenticateAndAuthorize = require('../middleware/formPermission.js')
// Route to create a new form
router.post("/createForm", authenticateAndAuthorize(['create']), (req, res) => {
  formController.createForm(req, res);
});

// Route to get a form by ID
router.get("/getForm/:id", authenticateAndAuthorize(['get']), (req, res) => {
  formController.getFormById(req, res);
});

// Route to get all forms
router.get("/getAllForms", authenticateAndAuthorize(['get']), (req, res) => {
  formController.getAllForms(req, res);
});

// Route to update a form by ID
router.put("/updateForm/:id", authenticateAndAuthorize(['put']), (req, res) => {
  formController.updateForm(req, res);
});

// Route to delete a form by ID
router.delete("/deleteForm/:id", authenticateAndAuthorize(['delete']), (req, res) => {
  formController.deleteForm(req, res);
});


module.exports = router;
