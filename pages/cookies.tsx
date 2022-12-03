export default function Cookies(){
    return (
        <>
        <h1>COOKIESSSS</h1>
        <p>Cookies are little text files stored on your computer that help us make your experience on this website as smooth as possible. These involve collecting stuff like session data and occasionally we allow third parties to use cookies to streamline their applications on this website. If you do happen to block the use of cookies in your browser.. the website may not work as intended. Just a warning!</p>
        <p>Cookies on this website are NOT malicious.</p>
        <ul>
            <li>next-auth csrf token - this cookie helps prevents cross site request forgery attacks</li>
            <li>next-auth callback url - helps url tracking across pages (particularly for browsers that do not support url tracking)</li>
            <li>cart - helps track items in cart across pages when you are not logged in.</li>
            <li>stripe - our payment provider, uses several cookies to guarantee your payments are handled safely. The cookies they install on your computer can be seen <a>here</a>.</li>
        </ul>
        </>
    )
}