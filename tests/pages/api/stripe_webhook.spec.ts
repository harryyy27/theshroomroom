import handler from '../../../pages/api/stripe_webhook';
import * as fns from '../../../utils/stripe_webhook'
import {createMocks} from 'node-mocks-http'
import { expect } from '@jest/globals';
import {errorHandler} from '../../../utils/errorHandler';
jest.mock('../../../utils/errorHandler')
const fetch = require("node-fetch");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
});
jest.mock('../../../utils/stripe_webhook')
jest.mock('stripe',() => {
    return jest.fn().mockImplementation(function() {
      return {
        webhooks: {
          constructEvent: () => {
            return {type:"payment_intent.succeeded"
          }},
        },
      };
    });
  })

describe("testing stripe webhook functions",()=>{
    test("1) any request bar POST",async()=>{
      const mockError = jest.mocked(errorHandler)
      mockError.mockImplementation(function(){
          return 'yo'
      } as any)
        const {req,res}:{req:any,res:any} = createMocks({
            method:"GET",
        })
        await handler(req,res);
        expect(res._getStatusCode()).toBe(500);
        const received = res._getData()
        const jsonReceived = JSON.parse(received).error
        expect(jsonReceived).toBe('Only post requests should be sent to this route.')
        
    })
    test("2) stripe sig error",async()=>{
        const {req,res}:{req:any,res:any} = createMocks({
            method:"POST",
            body: JSON.stringify({
                "yeh": "yeh"
            }) as any
        })
        await handler(req,res);
        expect(res._getStatusCode()).toBe(500);
        const received = res._getData();
        const jsonReceived = JSON.parse(received).error;
        expect(jsonReceived).toBe('No stripe signature');
    })
    // test("3) test payment_intent.succeeded fail",async()=>{
    //     const bufferMock = jest.mocked(fns.buffer)
    //     bufferMock.mockImplementation(function(){
    //         var bufffed=  Buffer.from({
    //             balls:'SuckMyBallzzz'
    //         }.toString())
    //         return bufffed
    //     } as any)
    //     const headers:any= {}
    //     headers["stripe-signature"]="hey"
       
    //     global.fetch = jest.fn(() =>
    //     Promise.resolve({
    //       json: () => Promise.resolve({
    //           success: false
    //       }),
    //     }) as any)
        
    //     const {req,res} = createMocks({
    //         method:"POST",
    //         headers: headers,
    //         body: JSON.stringify({
    //             "yeh": "yeh"
    //         }) as any,
    //         data: {
    //           object: {
    //             id:'yeh'
    //           }
    //         }
    //     })
    //     console.log('OIIIIII MUGGGGGGGGGGGGGGGGG',req.headers)
    //     await handler(req,res);
    //     expect(res._getStatusCode()).toBe(500);
    //     const received = res._getData();
    //     const jsonReceived = JSON.parse(received).error;
    //     expect(jsonReceived).toBe('Payment update failed: payment_intent.succeeded');
    // })
})