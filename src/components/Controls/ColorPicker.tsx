import { SketchPicker } from 'react-color';
import { useState, useEffect } from "react";
import reactCSS from 'reactcss';


function ColorPicker(props: any) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [background, setBackground] = useState(props.defaultColor);

  function handleClick() {
    if(props.disabled === true) {
      setDisplayColorPicker(!displayColorPicker);
    }
  }

  function handleClose() {
    setDisplayColorPicker(false);
  };

  function handleChangeComplete(color) {
    setBackground(color.hex);
    props.setFieldColor(props.field, color);
  };


  const styles = reactCSS({
    'default': {
      color: {
        width: '20px',
        height: '20px',
        borderRadius: '2px',
        background: background,
      },
      swatch: {
        padding: '2px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {/* <span style={{ padding: '10px' }}>{background}</span> */}
      {displayColorPicker ?
        //@ts-ignore 
        <div style={styles.popover}>
          <div //@ts-ignore 
            style={styles.cover} onClick={handleClose} />
          <SketchPicker color={background} onChangeComplete={handleChangeComplete} />
        </div> : null}
    </div>

  )
}

export default ColorPicker;