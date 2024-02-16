import {useState,useEffect} from 'react'
import {useRouter} from 'next/router'


function Loading(props:any) {
  const router = useRouter();
  const [loading,setLoading] = useState(false)

  useEffect(() => {
      const handleStart = (url:string) => {
        return setLoading(true);
      }
      const handleComplete = (url:string) => {
       return setTimeout(()=>setLoading(false),250);
      }

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError',  handleComplete)

      return () => {
          router.events.off('routeChangeStart', handleStart)
          router.events.off('routeChangeComplete', handleComplete)
          router.events.off('routeChangeError', handleComplete)
      }
  },[router])

  return  (
    <>
    {
      loading||props.componentLoading?
      <div className="loader">
        <div className="mini-loader">

        </div>
      </div>:
      null
    }
    </>
  )
}


export default Loading