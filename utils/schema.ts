import {Schema, model, models} from 'mongoose';
  // OUR TODO SCHEMA
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required:true
    }
})
// OUR TODO MODEL
const Product = models.Product || model("Product", ProductSchema)

export {Product}

const UserSchema=new Schema({

    name: {
        type:String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items:[
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }

            }
        ]
    },
    dAddress: {
        firstName: {
            type: String,
            required: false
        },
        surname: {
            type: String,
            required: false
        },
        firstLine: {
            type: String,
            required: false
        },
        secondLine: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        postcode: {
            type: String,
            required: false
        }
    },
    bAddress: {
        firstName: {
            type: String,
            required: false
        },
        surname: {
            type: String,
            required: false
        },
        firstLine: {
            type: String,
            required: false
        },
        secondLine: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        postcode: {
            type: String,
            required: false
        }
    },
    updates: {
        type: Boolean,
        required: true
    }
})

const User = models.User || model("User", UserSchema)

export {User}