type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div role="alert" style={{ color: '#b00020', padding: 12, border: '1px solid #b00020', borderRadius: 4 }}>
      {message}
    </div>
  );
}


