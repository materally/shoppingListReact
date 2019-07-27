import React from 'react'

const Loader = props => (
    <div className="loading" style={ (props.show) ? {display:'block'} : {display: 'none'} }>Loading&#8230;</div>
)

export default Loader;
  