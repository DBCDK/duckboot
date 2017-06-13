import React from 'react';

export default function Booster({name, value, set}) {
  return (
    <div>
      <input defaultValue={value} type="text" onChange={e => set(e.currentTarget.value)}/>
    </div>
  );
}