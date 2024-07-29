import * as React from "react";

function IconLetterB({
  size = 24,
  color = "currentColor",
  stroke = 2,
  ...props
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-letter-b" width={size} height={size} viewBox="0 0 24 24" strokeWidth={stroke} stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><desc>{"Download more icon variants from https://tabler-icons.io/i/letter-b"}</desc><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 20v-16h6a4 4 0 0 1 0 8a4 4 0 0 1 0 8h-6" /><line x1={7} y1={12} x2={13} y2={12} /></svg>;
}

export default IconLetterB;
