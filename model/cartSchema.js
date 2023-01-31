// productschema of products
const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  
    productname: {
        type: String

    },
    description:
    {
        type: String

    },
    category:
    {
        type: String

    },
    price:
    {
        type: Number

    },
    imageurl:
    {
        type: String

    },

    active: Boolean,

    date:
    {
        type: Date,
        default: Date.now

    }


});



const Cart = new mongoose.model("CartDetails", cartSchema);



module.exports = Cart;