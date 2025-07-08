import { Card, CardContent } from '@/components/ui/card';
import { FORM_STYLES } from '@/constants/form-styles';

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <Card className={`${FORM_STYLES.card.seller} ${className}`}>
      <CardContent className="p-12 text-center">
        <p className="text-text-200">{message}</p>
      </CardContent>
    </Card>
  );
}
