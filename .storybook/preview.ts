import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#f9f9fb' },
        { name: 'editor', value: '#faf9f6' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#1a1c1d' },
      ],
    },
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
