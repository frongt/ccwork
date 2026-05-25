import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  architectureSidebar: [
    {
      type: 'category',
      label: '아키텍처',
      collapsible: false,
      items: [
        'architecture/component-tree',
        'architecture/state-management',
        'architecture/data-flow',
      ],
    },
  ],
};

export default sidebars;
