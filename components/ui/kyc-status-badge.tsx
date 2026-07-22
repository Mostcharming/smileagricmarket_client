const getKycStatusStyles = (status: string) => {
  const normalized = status?.toLowerCase() || '';
  const statusMap: Record<string, { bg: string; dot: string; text: string; label: string }> = {
    approved: { bg: 'bg-green-50', dot: 'bg-green-500', text: 'text-green-600', label: 'Active' },
    active: { bg: 'bg-green-50', dot: 'bg-green-500', text: 'text-green-600', label: 'Active' },
    not_submitted: { bg: 'bg-gray-50', dot: 'bg-gray-400', text: 'text-gray-600', label: 'Unverified' },
    unverified: { bg: 'bg-gray-50', dot: 'bg-gray-400', text: 'text-gray-600', label: 'Unverified' },
    rejected: { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-600', label: 'Rejected' },
    pending: { bg: 'bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-600', label: 'Pending' },
  };
  
  return statusMap[normalized] || { bg: 'bg-gray-50', dot: 'bg-gray-400', text: 'text-gray-600', label: status || 'Unverified' };
};

export default function KycStatusBadge({ status = 'not_submitted' }: { status?: string }) {
  const styles = getKycStatusStyles(status);
  
  return (
    <div className={`w-fit flex items-center text-xs gap-2 font-medium ${styles.bg} px-2.5 py-0.5 rounded-full`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
      <span className={styles.text}>{styles.label}</span>
    </div>
  );
};