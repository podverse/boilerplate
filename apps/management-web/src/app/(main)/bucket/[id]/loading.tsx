import { LoadingSpinner } from '@boilerplate/ui';

export default function BucketDetailLoading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <LoadingSpinner size="lg" />
    </div>
  );
}
