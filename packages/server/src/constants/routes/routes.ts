export const Routes = {
  base_url: '/api',
  auth: {
    prefix: '/auth',
    login: '/login',
    logout: '/logout',
    registration: '/registration',
    refresh_token: '/refresh-token'
  },
  user: {
    prefix: '/user',
    create_user: '',
    get_users: '',
    update_user: '/:id'
  }
};
