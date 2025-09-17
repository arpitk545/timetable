const express =require('express');
const router =express.Router();
const{register,login,logout} =require("../controller/auth")


router.post("/auth/register",register);
router.post("/auth/login",login);
router.post("/logout",logout)

module.exports =router;
