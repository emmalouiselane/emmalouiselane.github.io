// eslint-disable-next-line no-unused-vars
import * as React from "react"

const SignComponent = ({ content, containerStyle, signStyle }) => {
  return (
      <div className="swinging-sign-container" style={containerStyle}>
        <div className='swinging-sign' 
            style={signStyle}
        >
            <p>{content}</p>
        </div>
      </div>
  )
}

export default SignComponent