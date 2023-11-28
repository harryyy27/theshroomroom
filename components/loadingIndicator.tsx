import React from 'react';
import { render } from 'react-dom';

interface SpinnerProps {
  width?: number;
  diameter?: number;
  duration?: number;
  easing?: string;
  color?: string;
}

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const spinnerDefaultProps: Required<SpinnerProps> = {
  width: 10,
  diameter: 200,
  duration: 1000,
  easing: 'ease-out',
  color: 'black',
}

const Spinner: React.FC<SpinnerProps & DivProps> = props => {
  const { width, diameter, duration, easing, color, ...rest } = { ...spinnerDefaultProps, ...props }

  const radius = diameter / 2;

  const [deg, setDeg] = React.useState(0);

  const arc = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    arc.current!.animate([
      {
        transform: `rotate(0deg)`,
      },
      {
        transform: `rotate(360deg)`,
      },
    ], {
      duration,
      iterations: Infinity,
      easing,
    })
  }, [])

  return (
    <div
      ref={arc}
      {...rest}
      style={{
        ...rest.style,
        height: radius,
        width: diameter,
        overflow: 'hidden',
        zIndex:20000000000,
        textAlign:"center"
      }}
    >
      <div
        style={{
          height: diameter,
          width: diameter,
          borderRadius: '50%',
          border: `${width}px solid ${color}`,
          position:"absolute",
        }}
      />
<p>loading</p>
<div
        style={{
          height: diameter*0.2,
          width: diameter*0.2,
          borderRadius: '50%',
          border: `${width}px solid ${color}`,
          margin:"auto"
        }}
      />
    </div>
  );
}

export default Spinner