import React from 'react';

export default function AddFilter({error, value, change}) {
  const style = {};
  if (error) {
    style.border = "1px solid red";
  }
  return (
    <div>
      <textarea className="w-100 h4" style={style} defaultValue='{"name": ""}'
                onChange={e => change(e.currentTarget.value)}/>
    </div>
  );
}
