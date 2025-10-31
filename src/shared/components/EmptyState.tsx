type EmptyStateProps = {
  title?: string;
  message?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title = 'No data', message = 'There is nothing to show yet.', action }: EmptyStateProps) {
  return (
    <div role="status" aria-label="empty" style={{ textAlign: 'center', padding: 24 }}>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}


