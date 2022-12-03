import {findUser,setupSession,getUser} from '../../../../pages/api/auth/[...nextauth]';
import signInUser from '../../../../utils/nextAuthUtils'
import bcrypt from 'bcrypt';
import {User} from '../../../../utils/schema'
import errorHandler from '../../../../utils/errorHandler'

jest.mock('../../../../utils/schema')
jest.mock('bcrypt')
jest.mock('../../../../utils/errorHandler')
import { expect } from '@jest/globals';
describe("Test functions nextauth file",()=>{
    test("1) findUser credentials not provided",async()=>{
        const error = await findUser(null as any)
        expect(error?.error).toBe("Credentials not provided.")
    })
    test("2) findUser username not provided",async()=>{
        const error = await findUser({
            username: null as any,
            password: 'yeh'
        })
        expect(error?.error as any).toBe("No username provided.")
    })
    test("3) findUser password not provided",async()=>{
        const error = await findUser({
            username: 'yeh',
            password: null as any,
        })
        expect(error?.error as any).toBe("No password provided.")
    })
    test("4) No user findOne",async()=>{
        var mockUser = jest.mocked(User)
        mockUser.mockImplementation(function(){
            class User{
                static findOne(username:{
                    username: string
                }){
                    return null
                }
            }
            return User
            
        }as any)
        const error = await findUser({
            username: 'yeh',
            password: 'null as any',
        })
        expect(error?.error as any).toBe("You haven't registered yet.")

    })
    test("5) No user findOne",async()=>{
        var mockUser = jest.mocked(User)
        mockUser.mockImplementation(function(){
            class User{
                static findOne(username:{
                        username:string
                    }
                ){
                    console.log(username)
                    return {
                        username:username.username,
                    }
                }
            }
            return User
            
        }as any)
        const error = await findUser({
            username: 'yeh',
            password: 'null as any',
        })
        console.log(error)
        expect(error).toEqual({
            user:{
                username:'yeh'
            },
            password: 'null as any'
        })

    })
})
describe("Test functions nextauth setupSession",()=>{
  test('1) Setupsession null input',async()=>{
    var mockUser = jest.mocked(User)
    mockUser.mockImplementation(function(){
        class User{
            static findOne(username:{
                    username:string
                }
            ){
                console.log(username)
                return {
                    username:username.username,
                    _id:'yo',
                    dAddress:'d',
                    bAddress:'c',
                    cart:'hehe'
                }
            }
        }
        return User
        
    }as any)
    const result = await setupSession({user:{
        email:'aye'
    }}as any)
    
    expect(result).toEqual({
        user:{
            email:'aye',
            id:'yo',
            dAddress:'d',
            bAddress:'c',
            cart:'hehe'
        }
    })
  })
  test('2) User error',async()=>{
    var mockUser = jest.mocked(User)
    var mockError = jest.mocked(errorHandler)
    mockUser.mockImplementation(function(){
        class User{
            static findOne(username:{
                    username:string
                }
            ){
                throw Error('OI SLAG')
            }
        }
        return User
        
    }as any)
    mockError.mockImplementation(function(){
        return 'safe'
    } as any)
    const result = await setupSession({user:{
        email:'aye'
    }}as any)
    
    expect(result).toEqual({
        user:{
            email:'aye',
            cart:{
                items:[]
            }
        }
    })
  })
})
describe("Test functions nextauth signInUser",()=>{
    test('1) No password',async()=>{
      const result = await signInUser('yeh',null as any)
      expect(result).toBe(false)
    })
    test('2) No userpassword',async()=>{
      const result = await signInUser(null as any,'yeh')
      expect(result).toBe(false)
    })
    test('3) No match',async()=>{
      const bcryptMock=jest.mocked(bcrypt.compare)
      bcryptMock.mockImplementation(function(){
          return false
      } as any)
      const result = await signInUser('null as any','yeh')
      expect(result).toBe(false)
    })
    test('4) password match',async()=>{
      const bcryptMock=jest.mocked(bcrypt.compare)
      bcryptMock.mockImplementation(function(){
          return true
      } as any)
      const result = await signInUser('null as any','yeh')
      expect(result).toBe(true)
    })
  })

describe("Test functions nextauth getUser",()=>{
    test('1) No error',async()=>{
        const result = await getUser({error:'ksjfkala'})
        expect(result.error).toBe('ksjfkala')
    })
    test('2) No creds error user',async()=>{
        const result = await getUser({user:null,password:"user"}as any)
        expect(result.error).toBe('Creds wrong')
    })

    test('3) No creds error password',async()=>{
        const result = await getUser({user:"null",password:null}as any)
        expect(result.error).toBe('Creds wrong')
    })
    test('4) No password',async()=>{
        const result = await getUser({user:"null",password:"null"}as any)
        expect(result.error).toBe("No password detected.")

    })

  })

// jest.mock('../../../../pages/api/auth/[...nextauth]')