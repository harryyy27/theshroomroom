import deleteaccount from '../../../pages/api/deleteaccount';
import {createMocks} from 'node-mocks-http'
import * as nextauth from 'next-auth/react'
import connect from '../../../utils/connection'
import {User} from '../../../utils/schema';
import errorHandler from '../../../utils/errorHandler';
import { expect } from '@jest/globals';
jest.mock('next-auth/react');
jest.mock('../../../utils/schema')
jest.mock('../../../utils/errorHandler')
jest.mock('../../../utils/connection');
afterEach(()=>{
    jest.clearAllMocks()

    jest.restoreAllMocks()
})
describe("1) Throw error for non post requests. 2) Throw error for no csrf header 3) Throw error for csrf key incorrect 4) Duplicate user creation attempted",()=>{
    test("1) deleteaccount user fail on get request",async()=>{
        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)
        const {req,res}:{req:any,res:any} = createMocks({
            method: "POST",
            url: "/api/deleteaccount"
        })
        const mockConnectValue: string = 'connected';
        // jest.spyOn(User.prototype,"save")
        await deleteaccount(req,res)
        console.log(Object.getOwnPropertyNames(res))
        console.log(res._getStatusCode())
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
        console.log(jsonReceived)
       
        expect(jsonReceived).toEqual("Not delete request.")
    })
    test("2) Throw error for no csrf header", async()=>{
        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)

        const mockCsrf: string ='yeye';
        (nextauth.getCsrfToken as jest.MockedFn<typeof nextauth.getCsrfToken>).mockResolvedValue(mockCsrf);
        const {req,res}:{req:any,res:any} = createMocks({
            method: "DELETE",
            url: "/api/deleteaccount",
            body: {
                user:"blabla"
            }
        })
        await deleteaccount(req,res)
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
            method:"DELETE",
            headers: {
                csrftoken:"aye chucky"
            },
            body: {
                bodyerrr:"bodyyyy"
            }
            
        })
        await deleteaccount(req,res)
        console.log(res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toEqual('CSRF authentication failed.')
    })
    test("4) Delete user succeeded",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockConnect = jest.mocked(connect);
        mockConnect.mockImplementation(function(){
            return "Hello"
        }as any)
        var mockUser = jest.mocked(User)
        mockUser.mockImplementation(function(){
            class User{
                constructor(){

                }
                static deleteOne(username:string){
                    return username
                }
            }
            return User
            
        }as any)
        const body:any = JSON.stringify({
            username:"username"
        })
        const {req,res}:{req:any,res:any}=createMocks({
            method:"DELETE",
            headers: {
                csrftoken:"yeye"
            },
            body: body
            
        })
        await deleteaccount(req,res);
        expect(res._getStatusCode()).toBe(200);
        const received= res._getData();
        const jsonReceived=JSON.parse(received).message
        expect(jsonReceived).toBe("Successfully deleted account")

    })
})