routes = [
{
  path: '/home/',
  url: '/app/index/home',
},
{
  path: '/news/:id/',
  url: '/app/docs/news/{{id}}',
},
{
  path: '/app/:id/:device_id/',
  url: '/app/index/app/{{id}}?device_id={{device_id}}',
},
{
  name: 'device',
  path: '/device/:id/',
  url: '/app/index/device/{{id}}',
},
{
  name: 'partner',
  path: '/partner/',
  url: '/app/index/partner',
},
{
  name: 'partner-panel',
  path: '/partner_panel/:code/',
  url: '/app/index/partner_panel/{{code}}',
},
{
  name: 'settings',
  path: '/settings/',
  url: '/app/index/settings',
},
{
  name: 'partnership-agreement',
  path: '/partnership_agreement/',
  url: '/app/docs/partnership_agreement',
},
{
  name: 'terms',
  path: '/terms/',
  url: '/app/docs/terms',
},
{
  name: 'help',
  path: '/help/',
  url: '/app/docs/help',
},
{
  name: 'advice',
  path: '/advice/',
  url: '/app/docs/advice',
},
// Default route (404 page). MUST BE THE LAST
{
  path: '(.*)',
  url: './error',
},
];