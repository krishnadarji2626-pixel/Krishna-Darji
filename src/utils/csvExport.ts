import { Enquiry } from '../types/property';

export function exportEnquiriesToCSV(enquiries: Enquiry[]): void {
  // Headers strictly matching user's requested Excel structure:
  // Date | Customer Name | Mobile | Email | Property | Location | Buy/Rent | Budget | Message | Status
  const headers = [
    'Date',
    'Customer Name',
    'Mobile',
    'Email',
    'Property',
    'Location',
    'Buy/Rent',
    'Budget',
    'Message',
    'Status',
    'Internal Notes'
  ];

  const escapeCSV = (value: string | undefined): string => {
    if (!value) return '""';
    const cleanStr = String(value).replace(/"/g, '""');
    return `"${cleanStr}"`;
  };

  const rows = enquiries.map((enq) => [
    escapeCSV(enq.date),
    escapeCSV(enq.customerName),
    escapeCSV(enq.mobile),
    escapeCSV(enq.email),
    escapeCSV(enq.propertyTitle || enq.propertyId),
    escapeCSV(enq.location),
    escapeCSV(enq.intent),
    escapeCSV(enq.budget),
    escapeCSV(enq.message),
    escapeCSV(enq.status),
    escapeCSV(enq.notes || '')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\r\n');

  // Create downloadable blob with UTF-8 BOM for Microsoft Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', `HomeVanta_Surat_Enquiries_${dateStamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
