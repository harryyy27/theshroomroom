export default function ResetPassword(){
    return(
        <div className="static-container">
            <p>Reset password</p>
            <form action="/api/reset-password"method="POST">
                <input placeholder="Password" type="password"/>
                <input placeholder="Confirm password" type="password" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}