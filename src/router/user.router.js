const express = require('express')
const userController = require('../controller/user.controller')
const router = express.Router()
const validation = require('../validation/index')
const userSchemaValidation = require('../validation/userSchema')
const authMiddleware = require('../middleware/auth.middleware')

router.post("/admin/create-user",authMiddleware.verifyToken, authMiddleware.roleCheck("admin"),validation.validate(userSchemaValidation.register), userController.createUser)


router.post("/login", validation.validate(userSchemaValidation.login), userController.login)
router.post("/logout",authMiddleware.verifyToken, userController.logout)


router.get("/admin/users", authMiddleware.verifyToken, authMiddleware.roleCheck("admin"), userController.getAllUsers)
router.get("/admin/users/stats", authMiddleware.verifyToken, authMiddleware.roleCheck("admin"), userController.getUserStats)
router.get("/admin/users/:id", authMiddleware.verifyToken, authMiddleware.roleCheck("admin"), userController.getSingleUser)
router.put("/admin/users/:id/update", authMiddleware.verifyToken, authMiddleware.roleCheck("admin"), userController.updateUser)
router.delete("/admin/users/:id/delete", authMiddleware.verifyToken, authMiddleware.roleCheck("admin"), userController.deleteUser)
router.patch("/admin/users/:id/status", authMiddleware.verifyToken, authMiddleware.roleCheck("admin"), userController.changeStatus)
router.put("/admin/users/:id/reset-password", authMiddleware.verifyToken, authMiddleware.roleCheck("admin"), userController.resetPassword)

router.post("/refresh-token",userController.refreshToken)


router.get("/profile", authMiddleware.verifyToken, userController.getProfile)
router.put("/user/profile/update", authMiddleware.verifyToken, userController.updateUser)
router.put("/user/update-password", authMiddleware.verifyToken, userController.updatePassword)


module.exports = router