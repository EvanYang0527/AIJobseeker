# Accessibility Implementation Guide
## AI Jobseeker Tool Admin Dashboard

### WCAG 2.1 AA Compliance Checklist

#### Color & Contrast Requirements
- **Text Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Non-text Elements**: 3:1 contrast ratio for UI components and graphics
- **Color Independence**: Information never conveyed by color alone
- **Focus Indicators**: Visible focus indicators with 3:1 contrast ratio

```css
/* High contrast color palette */
:root {
  --text-primary: #111827; /* 16.94:1 contrast on white */
  --text-secondary: #374151; /* 9.74:1 contrast on white */
  --text-muted: #6B7280; /* 4.69:1 contrast on white */
  --focus-ring: #2563EB; /* Blue focus ring */
  --error-text: #DC2626; /* 4.52:1 contrast on white */
  --success-text: #059669; /* 4.52:1 contrast on white */
}

/* Focus indicators */
.focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --text-secondary: #000000;
    --border-color: #000000;
  }
}
```

#### Keyboard Navigation
- **Tab Order**: Logical tab sequence through all interactive elements
- **Skip Links**: "Skip to main content" and "Skip to navigation" links
- **Keyboard Shortcuts**: Standard shortcuts (Ctrl+F for search, etc.)
- **Focus Management**: Proper focus management in modals and dynamic content

```typescript
// Keyboard navigation implementation
const KeyboardNavigation = {
  // Tab trap for modals
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  // Skip links implementation
  addSkipLinks: () => {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    `;
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }
};
```

#### Screen Reader Support
- **Semantic HTML**: Proper use of headings, lists, tables, and landmarks
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Live Regions**: Announcements for dynamic content changes
- **Alternative Text**: Meaningful alt text for all images and charts

```typescript
// Screen reader announcements
const ScreenReaderAnnouncements = {
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Chart descriptions for screen readers
  describeChart: (chartData: any, chartType: string) => {
    const { title, data, trend } = chartData;
    return `${chartType} chart titled "${title}". ${data.length} data points. ${trend ? `Overall trend: ${trend}` : ''}. Use arrow keys to navigate data points.`;
  }
};
```

### Component-Specific Accessibility

#### KPI Tiles
```typescript
interface KPITileA11y {
  role: 'button' | 'generic';
  ariaLabel: string; // "Job placement rate: 73.2%, increased by 5.2% from last period"
  ariaDescribedBy?: string; // ID of tooltip or description
  tabIndex: 0 | -1; // 0 if interactive, -1 if not
}

// Implementation
<div
  role={clickable ? 'button' : 'generic'}
  aria-label={`${title}: ${value}${change ? `, ${changeType} by ${Math.abs(change)}%` : ''}`}
  aria-describedby={tooltip ? `${id}-tooltip` : undefined}
  tabIndex={clickable ? 0 : -1}
  onKeyDown={(e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  }}
>
  {/* KPI content */}
</div>
```

#### Data Tables
```typescript
// Accessible table implementation
<table role="table" aria-label="Job seeker outcomes by region">
  <caption className="sr-only">
    Job seeker placement data showing outcomes across different regions. 
    Use arrow keys to navigate cells, Enter to sort columns.
  </caption>
  <thead>
    <tr>
      {columns.map((column) => (
        <th
          key={column.key}
          scope="col"
          aria-sort={
            sortColumn === column.key 
              ? sortDirection === 'asc' ? 'ascending' : 'descending'
              : 'none'
          }
          tabIndex={column.sortable ? 0 : -1}
          onKeyDown={(e) => {
            if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleSort(column.key);
            }
          }}
        >
          {column.label}
          {column.sortable && (
            <span aria-hidden="true" className="sort-indicator">
              {sortColumn === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
            </span>
          )}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {data.map((row, index) => (
      <tr key={index}>
        {columns.map((column) => (
          <td key={column.key}>
            {formatCellValue(row[column.key], column.format)}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

#### Filter Controls
```typescript
// Accessible filter panel
<fieldset className="filter-group">
  <legend>Date Range Filter</legend>
  <div className="filter-options">
    <label htmlFor="start-date">Start Date</label>
    <input
      id="start-date"
      type="date"
      value={startDate}
      onChange={handleStartDateChange}
      aria-describedby="date-help"
    />
    <div id="date-help" className="help-text">
      Select the beginning of the date range for data analysis
    </div>
  </div>
</fieldset>

// Announce filter changes
useEffect(() => {
  if (filterChanged) {
    ScreenReaderAnnouncements.announce(
      `Filters updated. Showing ${resultCount} results.`,
      'polite'
    );
  }
}, [filters, resultCount]);
```

#### Charts and Visualizations
```typescript
// Accessible chart wrapper
<div
  role="img"
  aria-label={generateChartDescription(chartData)}
  tabIndex={0}
  onKeyDown={handleChartKeyNavigation}
>
  <div className="sr-only">
    {generateDetailedChartDescription(chartData)}
  </div>
  
  {/* Chart component */}
  <ResponsiveContainer>
    <BarChart data={data}>
      {/* Chart elements with proper ARIA labels */}
    </BarChart>
  </ResponsiveContainer>
  
  {/* Data table alternative */}
  <details className="chart-data-table">
    <summary>View chart data as table</summary>
    <table>
      <caption>Data table representation of the chart</caption>
      {/* Table with chart data */}
    </table>
  </details>
</div>

// Chart description generator
const generateChartDescription = (data: ChartData) => {
  const { type, title, dataPoints, trend } = data;
  return `${type} chart showing ${title}. Contains ${dataPoints.length} data points. ${trend ? `Overall trend is ${trend}.` : ''} Press Enter to view detailed data table.`;
};
```

### Responsive Design & Mobile Accessibility

#### Touch Target Sizes
```css
/* Minimum 44px touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Adequate spacing between touch targets */
.button-group > * + * {
  margin-left: 8px;
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .data-table {
    font-size: 14px;
  }
  
  .filter-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 70vh;
    overflow-y: auto;
  }
}
```

#### Zoom and Magnification Support
```css
/* Support up to 200% zoom */
@media (min-resolution: 2dppx) {
  .dashboard-content {
    max-width: none;
    overflow-x: auto;
  }
}

/* Text scaling support */
html {
  font-size: 16px; /* Base font size */
}

@media (prefers-reduced-motion: no-preference) {
  * {
    transition-duration: 0.2s;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
  }
}
```

### Internationalization & Localization

#### Multi-language Support
```typescript
// Language detection and switching
const LanguageSupport = {
  supportedLanguages: ['en', 'af', 'zu', 'xh'],
  
  detectLanguage: () => {
    return navigator.language.split('-')[0] || 'en';
  },
  
  formatNumber: (value: number, locale: string) => {
    return new Intl.NumberFormat(locale).format(value);
  },
  
  formatCurrency: (value: number, locale: string, currency: string = 'ZAR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  },
  
  formatDate: (date: Date, locale: string) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
};

// RTL language support
const isRTL = (locale: string) => {
  return ['ar', 'he', 'fa'].includes(locale);
};

// Apply RTL styles
useEffect(() => {
  document.dir = isRTL(currentLocale) ? 'rtl' : 'ltr';
}, [currentLocale]);
```

#### Cultural Considerations
```typescript
// Date format preferences
const DateFormats = {
  'en': 'MM/DD/YYYY',
  'en-GB': 'DD/MM/YYYY',
  'af': 'DD/MM/YYYY',
  'zu': 'DD/MM/YYYY'
};

// Number format preferences
const NumberFormats = {
  'en': { decimal: '.', thousands: ',' },
  'af': { decimal: ',', thousands: ' ' },
  'zu': { decimal: '.', thousands: ',' }
};

// Cultural color meanings
const ColorMeanings = {
  success: {
    'default': '#10B981', // Green
    'cultural_alt': '#2563EB' // Blue for cultures where green has different meaning
  },
  warning: {
    'default': '#F59E0B', // Orange
    'cultural_alt': '#DC2626' // Red for cultures with different warning colors
  }
};
```

### Testing & Validation

#### Automated Accessibility Testing
```typescript
// Jest + @testing-library/jest-dom tests
describe('KPI Tile Accessibility', () => {
  test('has proper ARIA labels', () => {
    render(<KPITile title="Placement Rate" value="73.2%" />);
    
    const tile = screen.getByRole('generic');
    expect(tile).toHaveAttribute('aria-label', 'Placement Rate: 73.2%');
  });
  
  test('supports keyboard navigation when clickable', () => {
    const handleClick = jest.fn();
    render(<KPITile title="Test" value="100%" onClick={handleClick} />);
    
    const tile = screen.getByRole('button');
    fireEvent.keyDown(tile, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });
  
  test('meets color contrast requirements', () => {
    render(<KPITile title="Test" value="100%" />);
    
    const tile = screen.getByRole('generic');
    const styles = getComputedStyle(tile);
    
    // Test would verify contrast ratio meets WCAG standards
    expect(getContrastRatio(styles.color, styles.backgroundColor)).toBeGreaterThan(4.5);
  });
});
```

#### Manual Testing Checklist
- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
- [ ] **High Contrast Mode**: Verify visibility in high contrast mode
- [ ] **Zoom Testing**: Test at 200% zoom level
- [ ] **Mobile Testing**: Test on actual mobile devices
- [ ] **Voice Control**: Test with Dragon NaturallySpeaking or Voice Control
- [ ] **Color Blindness**: Test with color blindness simulators

#### Performance Considerations
```typescript
// Lazy loading for large datasets
const LazyDataTable = React.lazy(() => import('./DataTable'));

// Virtualization for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedKPIGrid = ({ items }: { items: KPIData[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <KPITile {...items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={120}
      role="grid"
      aria-label="KPI metrics grid"
    >
      {Row}
    </List>
  );
};

// Debounced search for better performance
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### Error Handling & User Feedback

#### Accessible Error Messages
```typescript
// Error boundary with accessibility
class AccessibleErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Announce error to screen readers
    ScreenReaderAnnouncements.announce(
      'An error occurred while loading the dashboard. Please refresh the page or contact support.',
      'assertive'
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-container">
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was an error loading the dashboard.</p>
          <button onClick={this.handleRetry}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Form validation with accessibility
const AccessibleFormValidation = {
  validateField: (field: HTMLInputElement, rules: ValidationRule[]) => {
    const errors = rules
      .map(rule => rule.validate(field.value))
      .filter(Boolean);

    // Update ARIA attributes
    if (errors.length > 0) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `${field.id}-error`);
      
      // Announce error to screen readers
      ScreenReaderAnnouncements.announce(
        `Error in ${field.labels?.[0]?.textContent}: ${errors[0]}`,
        'assertive'
      );
    } else {
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('aria-describedby');
    }

    return errors;
  }
};
```

This comprehensive accessibility guide ensures the admin dashboard meets WCAG 2.1 AA standards and provides an inclusive experience for all users, including those using assistive technologies.