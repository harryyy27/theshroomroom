export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
  }
  
  export interface SignIn {
    _id?: Number;
    username: String;
    password: String;
  }

export interface Credentials {
  username: String;
  password: String;
  redirect: Boolean;
}
export interface Product {
  _id: String,
  price: number,
  fresh: boolean,
  size: string,
  quantity: number,
  name: string,
  stripeProductId:string,
}

export interface UserSchema {

  name: String,
  username: any,
  email: String|undefined,
  password: string|undefined,
  cart: {
      items:Product[]
  },
  dAddress: {
      firstName: String,
      surname: String,
      firstLine: String,
      secondLine: String,
      city: String,
      postcode: String,
  },
  bAddress: {
      firstName: String,
      surname: String,
      firstLine: String,
      secondLine:String,
      city: String,
      postcode: String,
  },
  updates: Boolean|false,
}

export interface UserSession {
    /** The user's postal address. */
    id: string|null|undefined,
    cart: {
        items: Product[]
    },
    email: string,

}
