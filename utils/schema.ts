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
    },
    productType: {
        type: String,
        required:false
    },

    price_dry_100g: {

        type: Number,
        required:false
    },
    price_dry_10g:{

        type: Number,
        required:false
    },
    price_dry_25g:{

        type: Number,
        required:false
    },
    price_dry_50g:{

        type: Number,
        required:false
    },
    price_fresh_100g:{

        type: Number,
        required:false
    },
    price_fresh_1kg:{

        type: Number,
        required:false
    },
    price_fresh_250g:{

        type: Number,
        required:false
    },
    price_fresh_500g:{

        type: Number,
        required:false
    },
})
// OUR TODO MODEL
const Product = function(){
    return models.Product || model("Product", ProductSchema)
}
const SubscriptionSchema= new Schema({
    email: {
        type:String,
        required:true
    }
})
const Subscription = function(){
    return models.Subscription || model("Subscription", SubscriptionSchema)
}
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
                },
                size: {
                    type:String,
                    required:true
                },
                fresh:{
                    type:Boolean,
                    required:true
                }

            }
        ]
    },
    dAddress: {
        firstName: {
            type: String,
            required: false,
            default: ''
        },
        surname: {
            type: String,
            required: false
        },
        firstLine: {
            type: String,
            required: false,
            default: ''
        },
        secondLine: {
            type: String,
            required: false,
            default: ''
        },
        city: {
            type: String,
            required: false,
            default: ''
        },
        postcode: {
            type: String,
            required: false,
            default: ''
        }
    },
    bAddress: {
        firstName: {
            type: String,
            required: false,
            default: ''
        },
        surname: {
            type: String,
            required: false,
            default: ''
        },
        firstLine: {
            type: String,
            required: false,
            default: ''
        },
        secondLine: {
            type: String,
            required: false,
            default: ''
        },
        city: {
            type: String,
            required: false,
            default: ''
        },
        postcode: {
            type: String,
            required: false,
            default: ''
        }
    },
    updates: {
        type: Boolean,
        default:false,
        required: true
    }
})
const User = function(){
    return models.User || model("User", UserSchema)
}
const OrderSchema=new Schema({
    userId: {
        type:String,
        required: false
    },
    email: {
        type:String,
        required:true
    },
    guestCheckout: {
        type:Boolean,
        required: false
    },
    dAddress: {
        firstName: {
            type:String,
            required: true
        },
        surname: {
            type:String,
            required:true
        },
        firstLine: {
            type:String,
            required: true
        },
        secondLine: {
            type:String,
            required:false
        },
        city: {
            type:String,
            required:true
        },
        postcode: {
            type:String,
            required:true
        }
    },
    bAddress: {
        firstName: {
            type:String,
            required:true
        },
        surname: {
            type:String,
            required:true
        },
        firstLine: {
            type:String,
            required:true
        },
        secondLine: {
            type:String,
            required:false
        },
        city: {
            type:String,
            required:true
        },
        postcode: {
            type:String,
            required:true
        }
    },
    products: {
        items: [{
            _id: {
                type:String,
                required:true
            },
            quantity: {
                type:Number,
                required:true
            },
            name: {
                type:String,
                required:true
            },
            price: {
                type:Number,
                required:true
            },
            size: {
                type:String,
                required:true
            },
            fresh:{
                type:Boolean,
                required:true
            }
        }]
    },
    paymentIntentId: {
        type:String,
        required:true
    },
    dateOfPurchase: {
        type:Date,
        required:true
    },
    shippingMethod: {
        type:String,
        required:true
    },
    shippingCost: {
        type:Number,
        required:true
    },
    subtotal: {
        type:Number,
        required:true
    },
    total: {
        type:Number,
        required:true
    },
    error: {
        type:String,
        required: true
    },
    status:{
        type:String,
        required:true
    }
})
const Order = function(){
    return models.Order || model("Order", OrderSchema)
}
const PasswordReset = new Schema({
    passwordResetToken: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '60m' },
    },
})
const PasswordResetToken = function(){
    return models.PasswordReset || model("PasswordReset",PasswordReset)
}
const ErrorSchema= new Schema({
    reqHeaders: {
        type: String,
        required: true
    },
    reqBody: {
        type: String,
        required: true
    },
    reqMethod: {
        type: String,
        required: true
    },
    errorMessage: {
        type:String,
        required:true
    },
    callStack: {
        type:String,
        required: true
    },
    timestamp: {
        type:Date,
        required: true
    }
})
const Errors = function(){
    return models.Errors || model("Errors",ErrorSchema)
}
export {User,Order,Product,Subscription,Errors,PasswordResetToken}