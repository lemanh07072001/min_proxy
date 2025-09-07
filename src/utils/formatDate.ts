type DateFormat =
  | 'dd-mm-yyyy HH:MM'    // 08-09-2025 20:02
  | 'dd/mm/yyyy HH:MM'    // 08/09/2025 20:02
  | 'yyyy-mm-dd HH:MM'    // 2025-09-08 20:02
  | 'dd-mm-yyyy'          // 08-09-2025
  | 'HH:MM';              // 20:02

export function formatDateTimeLocal(dateStr: string, format: DateFormat = 'dd-mm-yyyy HH:MM'): string {
  const date = new Date(dateStr);

  // Lấy giờ Việt Nam (GMT+7)
  const vnOffset = 7 * 60; // phút
  const localDate = new Date(date.getTime() + vnOffset * 60 * 1000);

  const day = String(localDate.getUTCDate()).padStart(2, '0');
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const year = localDate.getUTCFullYear();
  const hours = String(localDate.getUTCHours()).padStart(2, '0');
  const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');

  switch (format) {
    case 'dd-mm-yyyy HH:MM': return `${day}-${month}-${year} ${hours}:${minutes}`;
    case 'dd/mm/yyyy HH:MM': return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'yyyy-mm-dd HH:MM': return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'dd-mm-yyyy': return `${day}-${month}-${year}`;
    case 'HH:MM': return `${hours}:${minutes}`;
    default: return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}