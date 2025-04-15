import React from 'react'

const NoData = ({isLoading=false}) => {
  return (
    <div className='No-data'>{isLoading ? 'loading...' : 'No Data Found..'}</div>
  )
}

export default NoData