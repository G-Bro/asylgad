import asylgadMap from '@/assets/images/maps/asylgad/asylgad-764-8k-min.jpg';

import vitraziaMap from '@/assets/images/maps/asylgad/vitrazia/vitrazia-4k.jpg';

const nodes = {
  asylgad: {
    title: 'Asylgad',
    map: asylgadMap,
    nodes: [
      {
        title: 'The Frost Isles',
        position: {
          x: 976,
          y: 580,
        },
        textContent: 'This is a description of the Frost Isles',
      },
      {
        title: 'Froldheim',
        position: {
          x: 3828,
          y: 884,
        },
        textContent: `
# Froldheim
This links to [Vitrazia](/map/asylgad/vitrazia)
        `,
      },
      {
        title: 'Vitrazia',
        position: {
          x: 6108,
          y: 3100,
        },
        textContent: 'This is a description of Vitrazia',
        href: '/map/asylgad/vitrazia',
      },
    ],
    vitrazia: {
      title: 'Vitrazia',
      map: vitraziaMap,
      nodes: [
        {
          title: 'Veldina',
          position: {
            x: 976,
            y: 580,
          },
          textContent: 'This is a description of Veldina',
        },
        {
          title: 'Great Vitrazia',
          position: {
            x: 3828,
            y: 884,
          },
          textContent: 'This is a description of Great Vitrazia',
        },
        {
          title: 'Gilstown',
          position: {
            x: 4108,
            y: 3100,
          },
          textContent: 'This is a description of Gilstown',
        },
      ],
    },
  },
};

export default nodes;
