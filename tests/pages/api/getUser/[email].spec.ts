import getUser from '../../../../pages/api/getUser/[email]';
import {createMocks} from 'node-mocks-http'
import * as nextauth from 'next-auth/react'
import connect from '../../../../utils/connection'
import {User} from '../../../../utils/schema'
import { expect } from '@jest/globals';
jest.mock('next-auth/react');
jest.mock('../../../../utils/schema')
jest.mock('../../../../utils/connection');
afterEach(()=>{
    jest.clearAllMocks()

    jest.restoreAllMocks()
})

describe("1) Throw error for non post requests. 2) Throw error for no csrf header 3) Throw error for csrf key incorrect 4) Duplicate user creation attempted",()=>{
    test("1) Wrong request error",async()=>{

        const {req,res}:{req:any,res:any} = createMocks({
            method: "POST",
            url: "/api/getUser"
        })
        // jest.spyOn(User.prototype,"save")
        await getUser(req,res)
        console.log(Object.getOwnPropertyNames(res))
        console.log(res._getStatusCode())
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
       
        expect(jsonReceived).toEqual("Not GET request.")
    })
    test("2 req.url error",async()=>{
        const {req,res}:{req:any,res:any} = createMocks({
            method: "GET",
        })
        await getUser(req,res)
        console.log(Object.getOwnPropertyNames(res))
        console.log(res._getStatusCode())
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
       
        expect(jsonReceived).toEqual("No req url.")

    })
    test("3) req.url split error",async()=>{
        const mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            return "Hello"
        } as any)
        const {req,res}:{req:any,res:any} = createMocks({
            method: "GET",
            url: "/api/getUser"
        })
        // jest.spyOn(User.prototype,"save")
        await getUser(req,res)
        console.log(Object.getOwnPropertyNames(res))
        console.log(res._getStatusCode())
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
       
        expect(jsonReceived).toEqual("Url split error.")
    })
    test("3) If user is edited return 200 and update complete message",async()=>{
        var mockConnect = jest.mocked(connect);
        // console.log(User.findOne)
        var mockUser = jest.mocked(User)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockUser.mockImplementation(function(){
            class User{
                static findOne(username:{
                    username: string
                }){
                    return {
                        username:username.username
                    }
                }
            }
            return User
            
        }as any)
        const {req,res}: {req:any,res:any} = createMocks({
            method:"GET",
            url: "/api/getUser/email@email"
        })
        await getUser(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).user
        console.log(jsonReceived)
        expect(jsonReceived).toEqual({
            username:"email@email"
        })
    })
})