const getFarmStatusStyles = (status: string) => {
  const statusMap: Record<string, { bg: string; dot: string; text: string }> = {
    active: { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-600' },
    verified: { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-600' },
    unverified: { bg: 'bg-gray-100', dot: 'bg-gray-400', text: 'text-gray-500' },
    inactive: { bg: 'bg-gray-100', dot: 'bg-gray-400', text: 'text-gray-500' },
    pending: { bg: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-600' },
    rejected: { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-600' },
  };

  return statusMap[status] || statusMap.unverified;
};

type FarmStatusBadgeProps = {
  status?: string;
};

export default function FarmStatusBadge({ status = 'unverified' }: FarmStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  const styles = getFarmStatusStyles(normalizedStatus);
  const label = normalizedStatus.replace(/_/g, ' ');

  return (
    <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${styles.bg}`}>
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      <span className={`capitalize ${styles.text}`}>{label}</span>
    </div>
  );
}