export default function ResetPassword(){
    return(
        <div className="static-container">
            <p>Reset password</p>
            <form action="/api/reset-password"method="POST">
                <input placeholder="Type password" />
                <input placeholder="Type password again" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}