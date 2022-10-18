import React,{ useEffect, useState } from 'react';

import {
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
} from '@draft-js-plugins/buttons';

const HeadlinesPicker = (props) => {
  const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];

  const [collapsed, setCollapsed] = useState(false)
  const onWindowClick = () =>{
    setCollapsed(true);
    return props.onOverrideContent(undefined)
  };

  useEffect(()=>{
    if (collapsed) {
      return;
    }
    setTimeout(() => {

      window.addEventListener('click', onWindowClick);
    }, 100)
    return () => window.removeEventListener("click", onWindowClick)
  }, [])
  return (
    <div>
      {buttons.map((Button, i) => (
        // eslint-disable-next-line
        <Button key={i} {...props} />
      ))}
    </div>
  );
}

const HeadlinesButton = (props)=>{
  const onClick = () => props.onOverrideContent(HeadlinesPicker);

  return (
    <div className='headlineButtonWrapper'>
      <button onClick={onClick} className='headlineButton'>
        H
      </button>
    </div>
  )

}

export default HeadlinesButton
