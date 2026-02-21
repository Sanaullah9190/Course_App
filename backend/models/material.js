import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    course: { 
        type: String, 
        required: true 
    },
    year: { 
        type: String, 
        required: true 
    },
    branch: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Notes', 'PYP'] 
    },
    fileUrl: { 
        type: String, 
        required: true 
    },
    publicId: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Material = mongoose.model('Material', materialSchema);

export default Material;