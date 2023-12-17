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
    product_type: {
        type: String,
        required:false
    },
    stock_available: {

        type: Number,
        required:true,
        min:0
    },
    
    mass: {
        type:String,
        required:true,
    },
    price: {

        type: Number,
        required:true
    },
    fresh: {
        type:Boolean,
        required:true
    },
    stripe_product_id: {

        type: String,
        required:true
    },
    
})
// OUR TODO MODEL
const Product = function(){
    return models.Product || model("Product", ProductSchema)
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
                },
                stripeProductId: {
                    type:String,
                    required:true
                },
                stockAvailable: {
                    type:Number,
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
    },
    stripeCustomerId:{
        type:String,
        default:'',
        required:false
    },
    subscriptions: [
        {
        subscriptionId: {
            type:String,
            required:true
        }
    }],
    isActive: {
        type:Boolean,
        default:false,
        required:false
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
            },
            stripeProductId: {
                type:String,
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
    },
    subscriptionId:{
        type:String,
        required:false
    },
    stripeCustomerId:{
        type:String,
        required:false
    },
    invoiceId:{
        type:String,
        required:false
    }
})
const Order = function(){
    return models.Order || model("Order", OrderSchema)
}
const SubscriptionSchema=new Schema({
    userId: {
        type:String,
        required: false
    },
    email: {
        type:String,
        required:true
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
            },
            stripeProductId: {
                type:String,
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
    dateLastPaid:{
        type:Date,
        required:true
    },
    dateCancelled:{
        type:Date,
        required:false
    },
    dateRenewal:{
        type:Date,
        required:false

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
    },
    subscriptionId:{
        type:String,
        required:true
    },
    stripeCustomerId:{
        type:String,
        required:true
    },
    interval:{
        type:String,
        required:true
    }
})
const Subscription = function(){
    return models.Subscription || model("Subscription", SubscriptionSchema)
}
const ReceiveUpdatesSchema=new Schema({
    
    email: {
        type:String,
        required:true
    },
    
})
const ReceiveUpdates = function(){
    return models.ReceiveUpdates || model("ReceiveUpdates", ReceiveUpdatesSchema)
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
    timestamp: {
        type:Date,
        required: true
    }
})
const Errors = function(){
    return models.Errors || model("Errors",ErrorSchema)
}
const DisputeSchema= new Schema({
    disputeId:{
        type:String,
        required:true
    },
    paymentIntentId:{
        type:String,
        required:true
    },
    dateReceived:{
        type:Date,
        required:true
    },
    reason: {
        type:String,
        required:true
    },
    status: {
        type:String,
        required:true
    }
})
const Dispute = function(){
    return models.Disputes || model("Disputes",DisputeSchema)
}
export {User,Order,Product,Subscription,Errors,PasswordResetToken,ReceiveUpdates,Dispute}