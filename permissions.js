var permissions = [
  'SEE_OWN_NICK',
  'SEE_OWN_AVATAR',
  'SEE_OWN_MESSAGES',
  'SEE_NICKS',
  'SEE_AVATARS',
  'SEE_MESSAGES',
  'SEND_MESSAGE',
  'SHOW_ICON',
  'FOCUS',
  'RUN'
];

for(let i = 0;i < permissions.length;i++) exports[permissions[i]] = Math.pow(2,i);
