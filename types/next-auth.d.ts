
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
      },
      bAddress: {
          firstName: String,
          surname: String,
          firstLine: String,
          secondLine:String,
          city: String,
          postcode: String,
      },
      updates:boolean,
      stripeCustomerId:String,
      subscriptionId:String,
      isActive:boolean

    }
  }
}