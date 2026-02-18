import React from 'react'

const Login = () => {
  return (
       <>
    <section className='flex items-center justify-center h-screen'>
       <form className='p-8 bg-white rounded-lg shadow-md w-96'>
      <h3 className='text-center text-2xl font-bold text-black p-1 m-1'>Login To Your Account</h3>
      <input type='email' name="email" id="email" placeholder='Email Address' 
      className='p-2 mb-4 w-full rounded border border-black placeholder:text-black focus:border-blue-500' />
      <p></p>
      <input type="password" name="userPassword" id="userPassword" placeholder='Password'  
      className='p-2 mb-4 w-full rounded border border-black placeholder:text-black focus:border-blue-500'/>
      <p></p>
      
      <button className='bg-blue-500 p-1 m-1 text-white rounded'>Login</button>

      <div className='p-2 m-2'>
      <p className='text-blue-300'>Sign Up</p>
    </div>
     <div className='p-2 m-2'>
    <p className="text-blue-300">Forgot your password? Reset It</p>
    </div>
    </form>
   

    </section>
   

    
    </>
  )
}

export default Login