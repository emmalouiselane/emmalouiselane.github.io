import { pageUrl } from '../lib/pagination';

interface Props {
  basePath: string;
  currentPage: number;
  totalPages: number;
  filtered: boolean;
  onPageChange: (page: number) => void;
  variant: 'blog' | 'garden';
}

export default function Pagination({ basePath, currentPage, totalPages, filtered, onPageChange, variant }: Props) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);

  const control = (page: number, label: string, direction?: 'prev' | 'next') => {
    const className = `${variant}-page-button${page === currentPage ? ' is-active' : ''}`;

    if (page < 1 || page > totalPages) 
      return <span className={className} aria-disabled="true">{label}</span>;

    return filtered ? (
      <button type="button" className={className} onClick={() => onPageChange(page)} aria-current={page === currentPage ? 'page' : undefined}>{label}</button>
    ) : (
      <a className={className} href={pageUrl(basePath, page)} rel={direction} aria-current={page === currentPage ? 'page' : undefined}>{label}</a>
    );
  };

  return (
    <nav className={`${variant}-pagination`} aria-label="Pagination">
      {control(currentPage - 1, 'Previous', 'prev')}
      <div className={`${variant}-pagination__pages`}>{pages.map(page => <span key={page}>{control(page, String(page))}</span>)}</div>
      {control(currentPage + 1, 'Next', 'next')}
    </nav>
  );
}
