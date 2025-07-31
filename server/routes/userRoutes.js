import express from "express";
import { auth } from "../middlewares/auth.js";
import { deleteCreation, getPublishedCreations, getUserCreations, toggleLikeCreations } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations);
userRouter.get('/get-published-creations',auth,getPublishedCreations);
userRouter.post('/toggle-like-creation',auth,toggleLikeCreations);
userRouter.delete("/delete-creation/:id", auth, deleteCreation);

export default userRouter;