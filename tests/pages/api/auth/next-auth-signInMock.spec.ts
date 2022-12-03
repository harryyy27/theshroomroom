import {findUser,setupSession,getUser} from '../../../../pages/api/auth/[...nextauth]';
import signInUser from '../../../../utils/nextAuthUtils';
import { expect } from '@jest/globals';
jest.mock('../../../../utils/nextAuthUtils')
describe("Text files where signInUser must be mocked",()=>{
    test('5) Sign in failure error',async()=>{
        const mockSignIn = jest.mocked(signInUser);
        mockSignIn.mockImplementation(function(){
            return false
        } as any)
        const result = await getUser({user:{password:"null"},password:"null"}as any)
        expect(result.error).toBe("Sign in failed.")
    })
    test('6) Sign in succeed',async()=>{
        const mockSignIn = jest.mocked(signInUser);
        mockSignIn.mockImplementation(function(){
            return true
        } as any)
        const result = await getUser({user:{username:"yeh",password:"null"},password:"null"}as any)
        expect(result).toEqual({
            email:"yeh"
        })
    })

})