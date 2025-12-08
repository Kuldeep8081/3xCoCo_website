import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // Customer Details
  customerName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },

  mobile: { type: String },
  
  // Payment & Total
  totalAmount: { 
    type: Number, 
    required: true 
  },
  isPaid: { 
    type: Boolean, 
    default: false 
  },
  
  // Order Status (Dropdown in Admin Panel)
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'] 
  },

  // List of products they bought
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    }
  ]
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// This line prevents "OverwriteModelError" in Next.js hot-reloading
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);