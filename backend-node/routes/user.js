
import express from "express";
import { deleteuserbyId, getAllStudent, getuserbyId, updateUser, } from "../controllers/userController.js";
import axios from "axios";
const router = express.Router();
router.get("/getAll", getAllStudent);
router.get("/:userID", getuserbyId);
router.delete("/:userID",deleteuserbyId);
router.put("/:userID", updateUser); 


export default router;
// module.exports = router;
