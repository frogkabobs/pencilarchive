import { signal, computed } from '@preact/signals-react';
import { useSignals } from "@preact/signals-react/runtime";
import { Selection } from './types';
import { catalogs } from '@site/src/data/catalogs';


const selection = signal<Selection>({
  type: '',
  company: '',
  year: '',
  page: '',
});

// Compute options dynamically based on catalogs and selection
const typeOptions = computed(() => Object.keys(catalogs || {}));
const companyOptions = computed(() =>
  selection.value.type ? Object.keys(catalogs[selection.value.type] || {}) : []
);
const yearOptions = computed(() =>
  selection.value.type && selection.value.company
    ? Object.keys(catalogs[selection.value.type][selection.value.company] || {})
    : []
);
const pageOptions = computed(() =>
  selection.value.type && selection.value.company && selection.value.year
    ? Object.keys(
        catalogs[selection.value.type][selection.value.company][selection.value.year] || {}
      )
    : []
);

const iframeLink = computed(() =>
  selection.value.type &&
  selection.value.company &&
  selection.value.year &&
  selection.value.page
    ? catalogs[selection.value.type][selection.value.company][selection.value.year][
        selection.value.page
      ]
    : ''
);

export default function CatalogViewer(): JSX.Element {
  useSignals();
  const handleChange = (key: keyof Selection, value: string): void => {
    selection.value = { ...selection.value, [key]: value };

    // Reset dependent selections
    if (key === 'type') {
      selection.value.company = '';
      selection.value.year = '';
      selection.value.page = '';
    } else if (key === 'company') {
      selection.value.year = '';
      selection.value.page = '';
    } else if (key === 'year') {
      selection.value.page = '';
    }
  };

  return (
    <div>
      <h1>Catalog Viewer</h1>
      <div>
        <label>
          Type:
          <select
            value={selection.value.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">Select Type</option>
            {typeOptions.value.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Company:
          <select
            value={selection.value.company}
            onChange={(e) => handleChange('company', e.target.value)}
            disabled={!selection.value.type}
          >
            <option value="">Select Company</option>
            {companyOptions.value.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Year:
          <select
            value={selection.value.year}
            onChange={(e) => handleChange('year', e.target.value)}
            disabled={!selection.value.company}
          >
            <option value="">Select Year</option>
            {yearOptions.value.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Page:
          <select
            value={selection.value.page}
            onChange={(e) => handleChange('page', e.target.value)}
            disabled={!selection.value.year}
          >
            <option value="">Select Page</option>
            {pageOptions.value.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </label>
      </div>
      {iframeLink.value && (
        <iframe
          src={iframeLink.value}
          title="Catalog Viewer"
          style={{ width: '100%', height: '600px', border: 'none' }}
        ></iframe>
      )}
    </div>
  );
}
