
// import { TextEncoder, TextDecoder } from 'util'
// (global as any).TextEncoder = TextEncoder;
// (global as any).TextDecoder = TextDecoder;
import register from '../../../pages/api/register';
import {createMocks} from 'node-mocks-http'
import * as nextauth from 'next-auth/react'
import connect from '../../../utils/connection'
import {User} from '../../../utils/schema'
import bcrypt from 'bcrypt'
import { expect } from '@jest/globals';
import {errorHandler} from '../../../utils/errorHandler';
jest.mock('../../../utils/errorHandler')
jest.mock('next-auth/react');
jest.mock('../../../utils/schema')
jest.mock('../../../utils/connection');
jest.mock('bcrypt')
afterEach(()=>{
    jest.clearAllMocks()

    jest.restoreAllMocks()
})
// function add(num1:number,num2:number){
//     return num1+num2
// }
// describe('1+1=2',()=>{
//     test('jest test',()=>{
//         expect(add(1,2)).toBe(3)
//     })
// })
describe("1) Throw error for non post requests. 2) Throw error for no csrf header 3) Throw error for csrf key incorrect 4) Duplicate user creation attempted",()=>{
    test("1) Register user fail on get request",async()=>{
        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)

        const {req,res}:{req:any,res:any} = createMocks({
            method: "GET",
            url: "/api/register"
        })
        const mockConnectValue: string = 'connected';
        // jest.spyOn(User.prototype,"save")
        await register(req,res)
        console.log(Object.getOwnPropertyNames(res))
        console.log(res._getStatusCode())
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
        console.log(jsonReceived)
       
        expect(jsonReceived).toEqual("Only post requests for this route")
    })
    test("2) Throw error for no csrf header", async()=>{

        const mockCsrf: string ='yeye';
        (nextauth.getCsrfToken as jest.MockedFn<typeof nextauth.getCsrfToken>).mockResolvedValue(mockCsrf);
        const {req,res}:{req:any,res:any} = createMocks({
            method: "POST",
            url: "/api/register",
            body: {
                user:"blabla"
            }
        })
        await register(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received = res._getData()
        console.log(Object.getOwnPropertyNames(received))
        const jsonReceived = JSON.parse(received).error
        expect(jsonReceived).toEqual("No csrf header found.")

    })
    test("3) Throw error if csrf not correct",async()=>{

    var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        const {req,res}:{req:any,res:any}=createMocks({
            method:"POST",
            headers: {
                csrftoken:"aye chucky"
            },
            body: {
                bodyerrr:"bodyyyy"
            }
            
        })
        await register(req,res)
        console.log(res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toEqual('CSRF authentication failed.')
    })

    test("4) If user is found return 500 and message suggesting a new username tried",async()=>{
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
                constructor(){

                }
                static findOne(username:string){
                    return username
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
            method:"POST",
            headers: {
                csrftoken:"yeye"
            },
            body:body
        })
        await register(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toBe("User already exists")
    })
    test("5) If user is not found return 200 and create new user",async()=>{
        const mockCsrf:string="yeye";
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        var mockConnect = jest.mocked(connect);
        var mockGenSalt=jest.mocked(bcrypt.genSalt);
        var mockHash=jest.mocked(bcrypt.hash)
        // console.log(User.findOne)
        var mockUser = jest.mocked(User)
        mockGetCsrf.mockResolvedValue(mockCsrf);
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockGenSalt.mockImplementation(function(){
            return 'salty';
        })
        mockHash.mockImplementation(function(){
            return 'hash'
        })
        mockUser.mockImplementation(function(){
            class User{
                username;
                password='unset';
                constructor(username:string){
                    this.username=username;
                }
                static findOne(username:string){
                    return undefined
                }
                save(){
                    return '';
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
            method:"POST",
            headers: {
                csrftoken:"yeye"
            },
            body:body
        })
        await register(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).message
        console.log(jsonReceived)
        expect(jsonReceived).toBe("Registered successfully")
    })
})