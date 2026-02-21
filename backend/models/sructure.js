import mongoose from 'mongoose';

const structureSchema = new mongoose.Schema({
    course: { 
        type: String, 
        required: true,
        trim: true 
    },
    year: { 
        type: String, 
        required: true,
        trim: true 
    },
    branch: { 
        type: String, 
        required: true,
        trim: true 
    },
    subject: { 
        type: String, 
        required: true,
        trim: true 
    }
}, { timestamps: true });


structureSchema.index({ 
    course: 1, 
    year: 1, 
    branch: 1, 
    subject: 1 
}, { unique: true });

const Structure = mongoose.model('Structure', structureSchema);

export default Structure;