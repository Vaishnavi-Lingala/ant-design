export interface mockType {
  app_name: string;
  app_id: number;
  window_title?: string;
  logo?: string;
  active?: boolean;
}

export const mockApiRes: mockType[]= [
  {
    app_name: 'MTRC',
    app_id: 1,
    window_title: 'Login',
    logo: 'https://placeholder.pics/svg/100',
    active: true // this will be gotten from the xref table
  },
  {
    app_name: 'Passport',
    app_id: 2,
    window_title: 'Sign up',
    logo: 'https://placeholder.pics/svg/100',
    active: false
  },
  {
    app_name: 'MTRC',
    app_id: 3,
    window_title: 'Pin',
    logo: 'https://placeholder.pics/svg/100',
    active: false
  },
  {
    app_name: 'MTLS',
    app_id: 4,
    window_title: 'Kill',
    logo: 'https://placeholder.pics/svg/100',
    active: false
  },
  {
    app_name: 'Steam',
    app_id: 5,
    window_title: 'Steam',
    logo: 'https://placeholder.pics/svg/100',
    active: true
  },
  {
    app_name: 'Discord',
    app_id: 6,
    window_title: 'Discord App',
    logo: 'https://placeholder.pics/svg/100',
    active: false
  },
];
