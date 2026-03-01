import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from './Modal';

import styles from './Modal.stories.module.scss';

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    withBackdrop: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Transparent: Story = {
  args: {
    withBackdrop: false,
    children: <LoadingSpinner size="xl" />,
  },
};

export const WithBackdrop: Story = {
  args: {
    withBackdrop: true,
    children: <LoadingSpinner size="xl" />,
  },
};

export const WithContent: Story = {
  args: {
    withBackdrop: true,
    children: <div className={styles.content}>Modal content slot (e.g. dialog or spinner)</div>,
  },
};
