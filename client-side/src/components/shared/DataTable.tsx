import React from 'react';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  /** Custom render for the cell. If omitted, renders `row[key]` as a string. */
  render?: (row: T) => React.ReactNode;
  /** Extra className applied to the <td> / mobile value wrapper */
  className?: string;
  /** If true, this column is hidden on desktop (useful for action-only mobile rows) */
  hideOnDesktop?: boolean;
  /** If true, this column is hidden on mobile cards */
  hideOnMobile?: boolean;
}

export interface DataTableAction<T> {
  label: string | ((row: T) => string);
  onClick: (row: T) => void;
  className?: string;
  /** Variant style presets */
  variant?: 'primary' | 'outline' | 'ghost';
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  keyExtractor: (row: T) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
}

function getActionClasses(variant: 'primary' | 'outline' | 'ghost' = 'outline'): string {
  switch (variant) {
    case 'primary':
      return 'bg-brand-primary hover:bg-brand-primary-hover text-brand-white';
    case 'ghost':
      return 'bg-transparent border border-brand-border hover:bg-brand-bg text-brand-text-muted';
    case 'outline':
    default:
      return 'bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white';
  }
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  keyExtractor,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records to display at this time.',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-brand-card border border-brand-border/40 rounded-2xl">
        <p className="text-brand-text-muted font-bold text-sm">{emptyTitle}</p>
        <p className="text-brand-text-muted/60 font-medium text-xs mt-1">{emptyDescription}</p>
      </div>
    );
  }

  const desktopColumns = columns.filter((c) => !c.hideOnDesktop);
  const mobileColumns = columns.filter((c) => !c.hideOnMobile);

  return (
    <div className="space-y-4">
      {/* Desktop table view */}
      <div className="hidden md:block bg-brand-card border border-brand-border/40 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border/30 bg-brand-bg/30 text-xs uppercase font-extrabold tracking-wider text-brand-text-muted">
                {desktopColumns.map((col) => (
                  <th key={col.key} className="py-4 px-6">
                    {col.label}
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="py-4 px-6 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-sm font-semibold">
              {data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-brand-bg/15 transition duration-150">
                  {desktopColumns.map((col) => (
                    <td key={col.key} className={`py-4 px-6 ${col.className || ''}`}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => action.onClick(row)}
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition ${action.className || getActionClasses(action.variant)}`}
                          >
                            {typeof action.label === 'function' ? action.label(row) : action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((row) => (
          <div
            key={keyExtractor(row)}
            className="bg-brand-card border border-brand-border/40 p-5 rounded-2xl space-y-3 shadow-xs"
          >
            {mobileColumns.map((col, idx) => {
              const value = col.render ? col.render(row) : String(row[col.key] ?? '');
              // First column renders as the card title
              if (idx === 0) {
                return (
                  <div key={col.key} className="text-sm font-bold text-brand-text-main">
                    {value}
                  </div>
                );
              }
              return (
                <div key={col.key} className="flex justify-between items-center text-[11px]">
                  <span className="text-brand-text-muted font-semibold">{col.label}</span>
                  <span className={`font-bold text-brand-text-main text-right ${col.className || ''}`}>
                    {value}
                  </span>
                </div>
              );
            })}
            {actions && actions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-border/20">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => action.onClick(row)}
                    className={`flex-1 min-w-[80px] text-center text-[10px] font-extrabold py-2 rounded-xl transition ${action.className || getActionClasses(action.variant)}`}
                  >
                    {typeof action.label === 'function' ? action.label(row) : action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataTable;
