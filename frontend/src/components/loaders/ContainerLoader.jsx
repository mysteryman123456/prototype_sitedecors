import React from 'react'

const ContainerLoader = () => {
  return (
    <div style={{height : "70vh",width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg className='loader' viewBox="25 25 50 50"><circle className='loader-circle' r="20" cy="50" cx="50"></circle></svg>
    </div>
)
}

export default ContainerLoader
