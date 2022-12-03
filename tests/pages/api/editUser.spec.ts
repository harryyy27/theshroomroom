import editUser from '../../../pages/api/editUser';
import {createMocks} from 'node-mocks-http'
import * as nextauth from 'next-auth/react'
import connect from '../../../utils/connection'
import {User} from '../../../utils/schema'
import { expect } from '@jest/globals';
import errorHandler from '../../../utils/errorHandler';
jest.mock('../../../utils/errorHandler')
jest.mock('next-auth/react');
jest.mock('../../../utils/schema')
jest.mock('../../../utils/connection');
afterEach(()=>{
    jest.clearAllMocks()

    jest.restoreAllMocks()
})
describe("1) Throw error for non post requests. 2) Throw error for no csrf header 3) Throw error for csrf key incorrect 4) Duplicate user creation attempted",()=>{
    test("1) editUser user fail on get request",async()=>{
        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)

        const {req,res}:{req:any,res:any} = createMocks({
            method: "POST",
            url: "/api/editUser"
        })
        await editUser(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
        console.log(jsonReceived)
       
        expect(jsonReceived).toEqual("Not put request.")
    })
    test("2) Throw error for no csrf header", async()=>{
        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)

        const mockCsrf: string ='yeye';
        (nextauth.getCsrfToken as jest.MockedFn<typeof nextauth.getCsrfToken>).mockResolvedValue(mockCsrf);
        const {req,res} :{req:any,res:any}= createMocks({
            method: "PUT",
            url: "/api/editUser",
            body: {
                user:"blabla"
            }
        })
        await editUser(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received = res._getData()
        console.log(Object.getOwnPropertyNames(received))
        const jsonReceived = JSON.parse(received).error
        expect(jsonReceived).toEqual("No csrf header found.")

    })
    test("3) Throw error if csrf not correct",async()=>{

        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)
    var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        const {req,res}:{req:any,res:any}=createMocks({
            method:"PUT",
            headers: {
                csrftoken:"aye chucky"
            },
            body: {
                bodyerrr:"bodyyyy"
            }
            
        })
        await editUser(req,res)
        console.log(res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toEqual('CSRF authentication failed.')
    })
    test("4) If user is edited return 200 and update complete message",async()=>{
        const mockCsrf:string="yeye";
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        var mockConnect = jest.mocked(connect);
        // console.log(User.findOne)
        var mockUser = jest.mocked(User)
        mockGetCsrf.mockResolvedValue(mockCsrf);
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockUser.mockImplementation(function(){
            class User{
                username;
                password='unset';
                constructor(username:string){
                    this.username=username;
                }
                static findOneAndUpdate(username:string){
                    return undefined
                }
            }
            return User
            
        }as any)
        // const returnObject:any={
        //     findOne: ()=>{}
        // }
        const body:any = JSON.stringify({
            username:"username"
        })
        // mockUser.mockResolvedValue(returnObject)
        const {req,res}:{req:any,res:any} = createMocks({
            method:"PUT",
            headers: {
                csrftoken:"yeye"
            },
            body:body
        })
        await editUser(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).message
        console.log(jsonReceived)
        expect(jsonReceived).toBe("User successfully updated")
    })
})