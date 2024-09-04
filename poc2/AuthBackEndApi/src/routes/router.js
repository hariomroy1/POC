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

router.get("/getAllOrganization",authorize(["admin","superadmin","user","other"]),(req,res) => {
  organizationController.getAllOrganizations(req,res);
})

// Routes for role operations
router.post("/createRoles", authorize(["admin"]), (req, res) => {
  const roleController = factory.create("role");
  roleController.createRole(req, res);
});

//-------------------------------------***------------------------------------------------------
// for forms
// Routes for form operations
const formController = factory.create("forms");
const authenticateAndAuthorize = require('../middleware/formPermission.js');
const stepController = require("../controllers/steps/step.js");
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

//to fetch all steps
router.get("/getAllSteps/:id",authenticateAndAuthorize(['get']),(req,res) => {
  stepController.getStepsByOrgId(req,res);
})

router.get("/getUserName/:id",authenticateAndAuthorize(['get']),(req,res) => {
  stepController.getUserIdByOrgId(req,res);
})

router.get("/getUserNameByOrgId/:id",authenticateAndAuthorize(['get']),(req,res) => {
  stepController.getUserNameByOrgId(req,res)
})

router.post("/submitData",authenticateAndAuthorize(['create']),(req,res) => {
  stepController.submitData(req,res)
})

//route to create step
// const stepController = factory.create("steps");
router.post("/createStep", authenticateAndAuthorize(['create']), (req, res) => {
  stepController.createStep(req, res);
});

//get steps name with username route
router.get("/getStepsNameWithUserName/:username",authenticateAndAuthorize(['get']),(req,res) => {
  stepController.getStepsByUsername(req,res);
})

//router.post('/createStep', stepController.createStep);




module.exports = router;
