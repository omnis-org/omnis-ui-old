const serverUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  omnisApiUrl: `${serverUrl}/api/omnis`,
  adminApiUrl: `${serverUrl}/api/admin`,
  adminUrl: `${serverUrl}/server-admin`,

  refreshDataTimeout: 60000 // 60 sec
};
