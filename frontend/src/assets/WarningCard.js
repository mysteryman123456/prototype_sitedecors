import React from 'react'

const WarningCard = ({message}) => {
  return (
    <div className='sd_warning_card'>
        <i className="ri-information-line"></i> {message}
    </div>
  )
}

export default WarningCard
