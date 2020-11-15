import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { useAuthActions } from '@/hooks/useAuth';

export function AdminSideBarHeaderMenu() {
  const { logout } = useAuthActions();

  return (
    <Menu>
      <MenuItem icon="log-out" text="Logout" onClick={() => logout()} />
    </Menu>
  );
}
