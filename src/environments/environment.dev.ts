declare const require: any;

export const environment = {
  production: false,
  appName: 'Marcelo Freire',
  home: '/painel',
  api: 'http://127.0.0.1:8000/api',
  version: require('../../package.json').version
};

