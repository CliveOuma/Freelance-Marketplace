import React from 'react'

const page =()=>{
  
  return (
    <>
    <section className='flex items-center justify-center h-screen'>
       <form className='p-8 bg-white rounded-lg shadow-md w-96'>
      <h3 className='text-center text-2xl font-bold text-black p-1 m-1'>Create An Account</h3>
      <input type="text" placeholder='First Name' name="First Name" id='firstName' 
      className='p-2 mb-4 w-full rounded border border-black placeholder:text-black focus:border-blue-500' />
      <p></p>
      <input type="text" name="lastName" id="lastName" placeholder='Last Name'  
      className='p-2 mb-4  w-full rounded border border-black placeholder:text-black focus:border-blue-500'  />
      <p></p>
      <input type="text" name="userName" id="userName" placeholder='User Name'  
      className='p-2 mb-4 w-full rounded border border-black placeholder:text-black focus:border-blue-500'/>
      <p></p>
      <input type='email' name="email" id="email" placeholder='Email Address' 
      className='p-2 mb-4 w-full rounded border border-black placeholder:text-black focus:border-blue-500' />
      <p></p>
      <input type="tel" name="phoneNumber" id="phoneNumber" placeholder='Phone Number'  
      className='p-2 mb-4 w-full rounded border border-black placeholder:text-black focus:border-blue-500'/>
      <p></p>
      <input type="password" name="userPassword" id="userPassword" placeholder='Password'  
      className='p-2 mb-4 w-full rounded border border-black placeholder:text-black focus:border-blue-500'/>
      <p></p>
      <input type="password" name="confirmedPassword" id="confirmedPassword" placeholder='Confirmed Password' 
      className='p-2 mb-4 w-full focus:border-blue-500 rounded border border-black placeholder:text-black' />
      <p></p>
      <button className='bg-blue-500 p-1 m-1 text-white rounded'>Submit</button>

      <div className='p-2 m-2'>
      <p className='text-blue-300'>Login</p>
    </div>
    </form>
   

    </section>
   

    
    </>
  )
}

export default page