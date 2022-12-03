import productHandler from '../../../pages/api/products';
import {Product} from '../../../utils/schema';
import {createMocks} from 'node-mocks-http';
import connect from '../../../utils/connection';
import { expect } from '@jest/globals';
import errorHandler from '../../../utils/errorHandler';
jest.mock('../../../utils/errorHandler')
jest.mock('../../../utils/connection');
jest.mock('../../../utils/schema');
afterEach(()=>{
    jest.clearAllMocks()

    jest.restoreAllMocks()
})
describe('Testing product handlers errors + functionality',()=>{
    test('1) Testing res method !== GET',async()=>{
        const mockError = jest.mocked(errorHandler)
        mockError.mockImplementation(function(){
            return 'yo'
        } as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"POST",
            body: {
                yeh:"yeh"
            }
        })
        await productHandler(req,res);
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
       
        expect(jsonReceived).toEqual("Only get requests for this route.")
    })
    test('2) No response from find.',async()=>{
        var mockProduct = jest.mocked(Product)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockProduct.mockImplementation(function(){
            class Product{
                constructor(){

                }
                static find(){
                    return undefined
                }
            }
            return Product
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"GET"
        })
        await productHandler(req,res)
        expect(res._getStatusCode()).toBe(500)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received).error
        expect(jsonReceived).toEqual("No products found.")
    })
    test('3) Response from find.',async()=>{
        var mockProduct = jest.mocked(Product)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockProduct.mockImplementation(function(){
            class Product{
                constructor(){

                }
                static find(){
                    return ["hurrah"]
                }
            }
            return Product
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"GET"
        })
        await productHandler(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received)
        expect(jsonReceived).toEqual(["hurrah"])
    })
    test('4) Response from findOne.',async()=>{
        var mockProduct = jest.mocked(Product)
        var mockConnect=jest.mocked(connect)
        mockConnect.mockImplementation(function(){
            var string:any= 'yes';
            return string
        })
        mockProduct.mockImplementation(function(){
            class Product{
                constructor(){

                }
                static findOne(){
                    return ["hurrah"]
                }
            }
            return Product
            
        }as any)
        const {req,res}:{req:any,res:any}=createMocks({
            method:"GET",
            url:'/api/products?product=LionsMane'
        })
        await productHandler(req,res)
        expect(res._getStatusCode()).toBe(200)
        const received = await res._getData()
        const jsonReceived = await JSON.parse(received)
        expect(jsonReceived).toEqual(["hurrah"])
    })
})