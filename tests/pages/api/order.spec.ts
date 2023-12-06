import order from '../../../pages/api/order';
import {createMocks} from 'node-mocks-http'
import * as nextauth from 'next-auth/react'
import connect from '../../../utils/connection'
import {Order} from '../../../utils/schema';
import { expect } from '@jest/globals';
import {errorHandler} from '../../../utils/errorHandler';
jest.mock('../../../utils/errorHandler')
jest.mock('next-auth/react');
jest.mock('../../../utils/schema')
jest.mock('../../../utils/connection');
afterEach(()=>{
    jest.clearAllMocks()

    jest.restoreAllMocks()
})


describe('tests pertaining to order handler',()=>{
    test("1) Throw error for no csrf header", async()=>{

        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)
        const mockCsrf: string ='yeye';
        (nextauth.getCsrfToken as jest.MockedFn<typeof nextauth.getCsrfToken>).mockResolvedValue(mockCsrf);
        const {req,res}:{req:any,res:any} = createMocks({
            method: "POST",
            body: {
                user:"blabla"
            }
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received = res._getData()
        const jsonReceived = JSON.parse(received).error
        expect(jsonReceived).toEqual("No csrf header found.")

    })
    test("2) Throw error if csrf not correct",async()=>{

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
        await order(req,res)
        console.log(res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toBe('CSRF authentication failed.')
    })
    test("3) Get method works",async()=>{
        const {req,res}:{req:any,res:any}=createMocks({
            method:"GET",
            url:'/api/order'
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        console.log()
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toBe('No id provided')

    })
    test("4) Get method works",async()=>{
        var mockProduct = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockProduct.mockImplementation(function(){
            class Order{
                constructor(){

                }
                static find(){
                    return {
                        exec: function(){
                            return 'yo'
                        }
                    }
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"GET",
            url:'/api/order?id=1'
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received).orders
        expect(jsonReceived).toBe('yo')

    })
    test("6) Post method error works",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                save(){
                    return false
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"POST",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo'
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toBe('Missing fields')

    })
    test("7) Post method works",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                save(){
                    return true
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"POST",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo'
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received)
        expect(jsonReceived).toEqual({
            success: true
        })

    })
    test("8) Put method works",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                static findOneAndUpdate(){
                    return true
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"PUT",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo'
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received)
        expect(jsonReceived).toEqual({
            success: true
        })

    })
    test("9) Put method works when no payment intent id available",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                static findOneAndUpdate(){
                    return false
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"PUT",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo',
                paymentIntentId:'hey'
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toBe("No paymentIntentId available for this particular number. Payment intent ID: hey")

    })
    test("10) Put method works",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                static findOneAndUpdate(){
                    return true
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"PUT",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo',
                cancel: true
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received)
        expect(jsonReceived).toEqual({
            success: true
        })

    })
    test("11) Put method works when no payment intent id available",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                static findOneAndUpdate(){
                    return false
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"PUT",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo',
                paymentIntentId:'hey',
                cancel: true
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toBe("No paymentIntentId available for this particular number. Payment intent ID: hey")
    })
    test("10) Put method works",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                static findOneAndUpdate(){
                    return true
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"DELETE",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo',
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received)
        expect(jsonReceived).toEqual({
            success: true
        })

    })
    test("11) Put method works when no payment intent id available",async()=>{
        var mockGetCsrf= jest.mocked(nextauth.getCsrfToken)
        const mockCsrf: string ='yeye';
        mockGetCsrf.mockResolvedValue(mockCsrf);
        var mockOrder = jest.mocked(Order)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockOrder.mockImplementation(function(){
            class Order{
                constructor(){

                }
                static findOneAndUpdate(){
                    return false
                }
            }
            return Order
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"DELETE",
            url:'/api/order',
            headers: {
                csrftoken:"yeye"
            },
            body: JSON.stringify({
                username: 'yo',
                paymentIntentId:'hey',
            }) as any
        })
        await order(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received= res._getData();
        console.log(received)
        const jsonReceived=JSON.parse(received).error
        expect(jsonReceived).toBe("No paymentIntentId available for this particular number. Payment intent ID: hey")
    })
   
})
  