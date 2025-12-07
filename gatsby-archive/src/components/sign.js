// eslint-disable-next-line no-unused-vars
import * as React from "react"

const SignComponent = ({ content, containerStyle, signStyle }) => {
  const handleSwingClick = () => {
    const sign = document.querySelector('.swinging-sign');
    sign.style.animation = 'none';
    sign.offsetHeight; // trigger reflow
    sign.style.animation = 'sway 6s linear forwards';
  };

  return (
      <div className="swinging-sign-container" style={containerStyle}>
        <div className='swinging-sign' 
            style={signStyle}
            onClick={handleSwingClick}
        >
            <p>{content}</p>
        </div>
      </div>
  )
}

export default SignComponent