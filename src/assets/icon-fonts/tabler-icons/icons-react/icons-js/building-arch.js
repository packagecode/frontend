import * as React from "react";

function IconBuildingArch({
  size = 24,
  color = "currentColor",
  stroke = 2,
  ...props
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building-arch" width={size} height={size} viewBox="0 0 24 24" strokeWidth={stroke} stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><desc>{"Download more icon variants from https://tabler-icons.io/i/building-arch"}</desc><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1={3} y1={21} x2={21} y2={21} /><path d="M4 21v-15a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v15" /><path d="M9 21v-8a3 3 0 0 1 6 0v8" /></svg>;
}

export default IconBuildingArch;
