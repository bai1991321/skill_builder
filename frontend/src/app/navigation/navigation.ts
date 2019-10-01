import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    { id: 'home', title: 'Skills', type: 'item', icon: 'filter_list', url: '/pages/skills' },
    { id: 'profile', title: 'Profile', type: 'item', icon: 'person', url: '/pages/profile' },
    { id: 'abilities', title: 'Abilities', type: 'item', icon: 'ballot', url: '/pages/abilities' },
    // { id: 'tag', title: 'Tags', type: 'item', icon: 'person', url: '/pages/tag' },
];
