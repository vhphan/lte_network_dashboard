export default [
        {
            title: 'Home',
            icon: 'mdi-home',
            link: '/'
        },
        {
            title: 'About',
            icon: 'mdi-home',
            link: '/about'
        },
        {
            title: 'Site Count Chart',
            icon: 'mdi-radio-tower',
            link: { name: 'NetworkChart', params: { type: 'chart' }}
        },
        {
            title: 'Site Count Table',
            icon: 'mdi-radio-tower',
            link: { name: 'NetworkTable', params: { type: 'table' }}
        }
    ];