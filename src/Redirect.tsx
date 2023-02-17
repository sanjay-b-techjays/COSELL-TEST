import { useState, useEffect } from 'react';
import { Modules } from './Config';

const Redirect = () => {
  const [module, setModule] = useState(null);
  useEffect(() => {
    setModule(Modules())
  }, [])
  return (
    <div>
      {module}
    </div>
  );
};
export default Redirect;