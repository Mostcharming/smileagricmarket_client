const getKycStatusStyles = (status: string) => {
  const statusMap: Record<string, { bg: string; dot: string; text: string }> = {
    approved: { bg: 'bg-green-50', dot: 'bg-green-500', text: 'text-green-500' },
    not_submitted: { bg: 'bg-gray-50', dot: 'bg-gray-400', text: 'text-gray-400' },
    rejected: { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-500' },
    pending: { bg: 'bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-500' },
  };
  
  return statusMap[status] || statusMap.not_submitted;
};

export default function KycStatusBadge({ status = 'not_submitted' }: { status?: string }) {
  const styles = getKycStatusStyles(status);
  
  return (
    <div className={`w-fit flex items-center text-xs gap-2 font-medium ${styles.bg} px-2 py-1 rounded-full`}>
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      <span className={`capitalize ${styles.text}`}>{status.replace(/_/g, ' ')}</span>
    </div>
  );
};