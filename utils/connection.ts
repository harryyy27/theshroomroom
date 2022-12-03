import mongoose, { Model } from "mongoose"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { DB_URL } = process.env

// connection function
export default async function connect() {
  if(process.env.NODE_ENV!=='test'){
    const conn = await mongoose
      .connect(DB_URL as string)
      .catch(err => console.log(err))
    return conn

  }
}