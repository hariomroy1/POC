const nodemailer = require('nodemailer');

// Import Organization related modules
const OrganizationRepository = require('../DataLayer/Repository/organization/organizationalRepository.js');
const OrganizationService = require('../Services/organization/OrganizationService.js');
const OrganizationController = require('../controllers/organization/organizationController.js');

// Import Role related modules
const RoleRepository = require("../DataLayer/Repository/role/RoleRepository.js");
const RoleService = require("../Services/roles/createRoles.js");
const RoleController = require('../controllers/roles/rolesController.js');

// Import User related modules
const UserRepository = require('../DataLayer/Repository/user/UserRepository.js');
const RolesRepository = require('../DataLayer/Repository/user/RoleRepository.js');
const AuthService = require('../Services/user/AuthService.js');
const UserService = require('../Services/user/UserService.js');
const RolesService = require('../Services/user/RoleService.js');
const UserController = require('../controllers/user/UserController.js');

// Initialize OTP store
const otpStore = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'corporatehariom@gmail.com',
    pass: 'ywlf lkac sdfo nqic',
  },
});

class Factory {
  constructor() {
    this.authService = new AuthService(new UserRepository(), otpStore, transporter);
  }

  //create a common function to manage controller and repo
  create(type) {
    const serviceCreators = {
      organization: () => {
        const repo = new OrganizationRepository();
        return new OrganizationService(repo);
      },
      role: () => {
        const repo = new RoleRepository();
        return new RoleService(repo);
      },
      user: () => {
        const repo = new UserRepository();
        return new UserService(repo);
      },
      roles: () => {
        const repo = new RolesRepository();
        return new RolesService(repo);
      }
    };

    const controllerCreators = {
      organization: () => {
        const service = serviceCreators['organization']();
        return new OrganizationController(service);
      },
      role: () => {
        const service = serviceCreators['role']();
        return new RoleController(service);
      },
      user: () => {
        const userService = serviceCreators['user']();
        const rolesService = serviceCreators['roles']();
        return new UserController(this.authService, userService, rolesService);
      },
      roles: () => {
        const service = serviceCreators['roles']();
        return new RolesService(service);
      }
    };

    if (!controllerCreators[type]) {
      throw new Error(`Invalid type ${type}.`);
    }

    return controllerCreators[type]();
  }
}

module.exports = Factory;
