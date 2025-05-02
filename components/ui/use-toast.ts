// Simple toast implementation for notifications
type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastProps {
  title: string;
  description: string;
  variant?: ToastVariant;
}

// Simple implementation that logs to console
// In a real app, you would use a real toast library like react-hot-toast or sonner
export function toast(props: ToastProps) {
  const { title, description, variant = 'default' } = props;
  
  console.log(`[Toast - ${variant}] ${title}: ${description}`);
  
  // If in browser environment, show an alert
  if (typeof window !== 'undefined') {
    const message = `${title}\n${description}`;
    if (variant === 'destructive') {
      console.error(message);
    } else {
      console.log(message);
    }
  }
  
  return { id: Date.now().toString() };
} 