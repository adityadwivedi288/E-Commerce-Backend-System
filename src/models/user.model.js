import mongoose from 'mongoose'; 
const userSchema = new mongoose.Schema({
  name: {
    type: String,         
    required: true,       
    trim: true            
  },
  email: {
    type: String,
    required: true,
    unique: true,         
    lowercase: true       
  },
  password: {
    type: String,
    required: true,
    minlength: 6         
  },
  role: {
    type: String,
    enum: ["user", "vendor", "admin"], // sirf allowed roles hi valid honge
    default: "user"                    // agar koi role na de to customer hoga
  },
  isBlocked:{
    type:Boolean,
    default:false
  }
}, { timestamps: true }); 
const User = mongoose.model("User", userSchema);

export default User; 
