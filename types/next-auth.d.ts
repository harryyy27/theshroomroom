
import NextAuth from "next-auth"
import {Product} from '../utils/types'
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string|null|undefined,
      cart: {
          items: Product[]
      },
      name: string,
      email: string,
      dAddress: {
          firstName: String,
          surname: String,
          firstLine: String,
          secondLine: String,
          city: String,
          postcode: String,
          phoneNumber:String
      },
      bAddress: {
          firstName: String,
          surname: String,
          firstLine: String,
          secondLine:String,
          city: String,
          postcode: String,
          phoneNumber:String
      },
      updates:boolean,
      stripeCustomerId:String,
      subscriptions:{
        subscriptionId:String
      }[],
      isActive:boolean

    }
  }
}