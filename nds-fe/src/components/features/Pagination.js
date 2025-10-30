import React from 'react';

function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  if (start > 1) pages.push(1);
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < totalPages) pages.push(totalPages);

  return (
    <div className="pagination-bar" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
      <button className="place-type-btn" onClick={() => go(page - 1)} disabled={page <= 1} style={{ opacity: page <= 1 ? 0.5 : 1 }}>이전</button>
      {pages.map((p, idx) => (
        <button
          key={`${p}-${idx}`}
          className={`place-type-btn ${p === page ? 'active' : ''}`}
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}
      <button className="place-type-btn" onClick={() => go(page + 1)} disabled={page >= totalPages} style={{ opacity: page >= totalPages ? 0.5 : 1 }}>다음</button>
    </div>
  );
}

export default Pagination;


