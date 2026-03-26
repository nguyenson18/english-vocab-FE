import { Card, CardContent, Typography } from '@mui/material';

type Props = {
  label: string;
  value: string | number;
  helper?: string;
};

export default function StatCard({ label, value, helper }: Props) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4">{value}</Typography>
        {helper ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {helper}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
