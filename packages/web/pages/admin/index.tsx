import { useEffect } from 'react';
import { login } from '@/service';

export default function Admin() {
  useEffect(() => {
    login({ username: 'admin', password: 'admin' }).then(console.log);
  }, []);

  return <div>Admin</div>;
}
