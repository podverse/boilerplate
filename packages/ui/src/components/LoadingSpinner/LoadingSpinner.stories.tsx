import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'primary'] },
  },
};

export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: {},
};

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <LoadingSpinner size="sm" />
      <LoadingSpinner size="md" />
      <LoadingSpinner size="lg" />
    </div>
  ),
};
