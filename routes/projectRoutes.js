import { Router } from "express";
import { createProject, getAllProjects, deleteProject, updateProject, getProject, project } from "../controller/projectController.js";
import upload from '../config/multerConfig.js';

const propertyRouter = Router();


propertyRouter.post('/add',upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'propertyImageOne', maxCount: 1 },
    { name: 'propertyImageTwo', maxCount: 1 },
    { name: 'propertyImageThree', maxCount: 1 },
    { name: 'propertyImageFour', maxCount: 1 },
    { name: 'descriptionImage', maxCount: 1 }
]), createProject);
propertyRouter.get('/get/all', getAllProjects);
propertyRouter.delete('/delete/:projectId', deleteProject);
propertyRouter.get('/:projectId', getProject);
propertyRouter.get('/get/:projectId', project);
propertyRouter.patch(
    '/update/:projectId',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'propertyImageOne', maxCount: 1 },
        { name: 'propertyImageTwo', maxCount: 1 },
        { name: 'propertyImageThree', maxCount: 1 },
        { name: 'propertyImageFour', maxCount: 1 },
        { name: 'descriptionImage', maxCount: 1 }
    ]),
    updateProject
);


export default propertyRouter