import React from 'react';

export default data => <pre className="json element">{JSON.stringify(data, null , ' ')}</pre>;