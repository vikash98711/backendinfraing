import Project from "../models/projectSchema.js";
import cloudinary from '../config/cloudinaryConfig.js';

// Function to upload an image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('File buffer is missing');
    }

    // Use Cloudinary's `upload_stream` method for direct buffer uploads
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'projects' }, // Set the folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            // console.log('Cloudinary upload result:', result);
            resolve(result.secure_url); // Return the secure URL
          }
        }
      );

      // Stream the file buffer to Cloudinary
      upload.end(file.buffer);
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error uploading image');
  }
};


// Function to delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract the public ID from the Cloudinary URL
    const imageId = imageUrl.split('/').slice(-2).join('/').split('.')[0];  // Extract image ID

    // Delete the image from Cloudinary using the imageId
    await cloudinary.uploader.destroy(imageId);

    console.log(`Image with ID ${imageId} deleted from Cloudinary.`);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Error deleting image');
  }
};

const createProject = async (req, res) => {
  try {
    const { sellerName, city, category, type, status, price, projectName, description, role  } = req.body;
    
    if (role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!req.files || !req.files.propertyImage || req.files.propertyImage.length === 0) {
      return res.status(400).json({ message: 'Property image file is required' });
    }
    const propertyImageUrl = await uploadImageToCloudinary(req.files.propertyImage[0]);

    let descriptionImageUrl = null;
    if (req.files.descriptionImage && req.files.descriptionImage.length > 0) {
      descriptionImageUrl = await uploadImageToCloudinary(req.files.descriptionImage[0]);
    }

    const project = await Project.create({
      sellerName,
      city,
      category,
      type,
      status,
      price,
      projectName,
      propertyImage: propertyImageUrl,
      descriptionImage: descriptionImageUrl,
      description,
    });

    return res.status(201).json({ message: 'Project uploaded successfully', project});
  } catch (error) {
    console.error('Error uploading Property:', error);
    return res.status(500).json({ message: 'Error uploading Project', error: error.message });
  }
}

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
}

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.propertyImage) {
      await deleteImageFromCloudinary(project.propertyImage);
    }
    if (project.descriptionImage) {
      await deleteImageFromCloudinary(project.descriptionImage);
    }

    await Project.findByIdAndDelete(projectId);
    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
}

const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
}

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sellerName, city, category, type, status, price, projectName, description } = req.body;
    const value = {sellerName, city, category, type, status, price, projectName, description}
    const project = await Project.findById(projectId);
      
    if (req.files.propertyImage){
      const propertyImageUrl = await uploadImageToCloudinary(req.files.propertyImage[0])
      if (propertyImageUrl){
        await deleteImageFromCloudinary(project.propertyImage)
        project.propertyImage = propertyImageUrl
      }
    }
    if (req.files.descriptionImage){
      const descriptionImageUrl = await uploadImageToCloudinary(req.files.descriptionImage[0])
      if (descriptionImageUrl){
        deleteImageFromCloudinary(project.descriptionImage)
        project.descriptionImage = descriptionImageUrl
      }
    }
    const fieldsToUpdate = [
      "sellerName",
      "city",
      "category",
      "type",
      "status",
      "price",
      "projectName",
      "description",
    ]

    let hasUpdates = false;

    
    fieldsToUpdate.forEach((field) => {
      if (value[field] !== undefined && value[field] !== project[field]) {
        project[field] = value[field];
        hasUpdates = true;
      }
    });
    
    if (!hasUpdates && !req.files.propertyImage && !req.files.descriptionImage) {
      return res
        .status(400)
        .json({message: "No fields to update"});
    }

    const updatedProject = await project.save({ validateBeforeSave: false });

    return res.status(200).json({message: "Project updated successful", projectId: updatedProject._id })

  } catch(error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ message: 'Error updating project', error: error.message });
  }
}

export { createProject, getAllProjects, deleteProject, getProject, updateProject };
