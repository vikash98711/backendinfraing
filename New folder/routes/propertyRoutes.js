import { Router } from "express";
import { createProject, getAllProjects, deleteProject, updateProject, getProject } from "../controller/projectController.js";
import upload from '../config/multerConfig.js';

const propertyRouter = Router();


propertyRouter.post('/add',upload.fields([{ name: 'propertyImage', maxCount: 1 }, { name: 'descriptionImage', maxCount: 1 }]), createProject);
propertyRouter.get('/get/all', getAllProjects);
propertyRouter.delete('/delete/:projectId', deleteProject);
propertyRouter.get('/:projectId', getProject);
propertyRouter.patch(
    '/update/:projectId',
    upload.fields([{ name: 'propertyImage', maxCount: 1 }, { name: 'descriptionImage', maxCount: 1 }]),
    updateProject
);


export default propertyRouter