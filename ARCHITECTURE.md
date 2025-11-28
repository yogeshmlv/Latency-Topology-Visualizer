# Architecture Documentation

## System Overview

The Latency Topology Visualizer is a Next.js 16 application that provides real-time and historical visualization of latency data between crypto exchange server locations on a 3D interactive globe.

## Architecture Layers

### 1. Presentation Layer (Components)

#### `WorldMap.tsx`
- **Purpose**: 3D globe visualization using react-three-fiber
- **Responsibilities**:
  - Render 3D Earth sphere
  - Display exchange server markers
  - Show cloud region markers
  - Render animated latency connections
  - Handle user interactions (click, hover)
- **Dependencies**: Three.js, @react-three/fiber, @react-three/drei
- **State**: Reads from Zustand store for filters and selection

#### `ControlPanel.tsx`
- **Purpose**: User interface for filtering and controls
- **Responsibilities**:
  - Search functionality
  - Exchange filtering
  - Cloud provider filtering
  - Latency range sliders
  - Theme toggle
  - Time range selection
  - Play/pause controls
- **State**: Reads/writes to Zustand store

#### `LatencyChart.tsx`
- **Purpose**: Historical latency visualization
- **Responsibilities**:
  - Display time-series charts
  - Show statistics (min/max/average)
  - Format data for Recharts
- **Dependencies**: Recharts, date-fns

#### `ThemeProvider.tsx`
- **Purpose**: Theme management
- **Responsibilities**:
  - Apply theme class to HTML element
  - Sync with Zustand store

### 2. Data Layer (Hooks & API)

#### `useLatencyData.ts`
- **Purpose**: Fetch real-time latency data
- **Implementation**: SWR hook with auto-refresh
- **Refresh Interval**: 5 seconds
- **Endpoint**: `/api/latency`

#### `useHistoricalLatency.ts`
- **Purpose**: Fetch historical latency data
- **Implementation**: SWR hook with conditional fetching
- **Parameters**: from, to, timeRange
- **Endpoint**: `/api/latency/historical`

#### API Routes
- **`/api/latency`**: Returns real-time latency between all exchange pairs
- **`/api/latency/historical`**: Returns time-series data for specific exchange pair

### 3. State Management (Zustand)

#### `useAppStore.ts`
- **Global State**:
  - Theme (light/dark)
  - Filter settings
  - Selected exchange
  - Play/pause state
  - Time range
- **Persistence**: localStorage for theme and filters
- **Actions**: Setters for all state properties

### 4. Business Logic (Utils & Data)

#### `lib/utils.ts`
- **Functions**:
  - `latLonToVector3`: Convert lat/lon to 3D coordinates
  - `getLatencyColor`: Get color based on latency value
  - `getLatencyStatus`: Get status (good/warning/critical)
  - `formatLatency`: Format latency for display
  - `calculateDistance`: Haversine formula for distance
  - `cn`: Tailwind class merger

#### `lib/data.ts`
- **Data Sources**:
  - `EXCHANGE_SERVERS`: Array of exchange server locations
  - `CLOUD_REGIONS`: Array of cloud provider regions

### 5. Type System

#### `types/index.ts`
- **Interfaces**:
  - `ExchangeServer`: Exchange server data structure
  - `LatencyData`: Real-time latency data
  - `HistoricalLatencyData`: Time-series data
  - `CloudRegion`: Cloud provider region data
  - `FilterState`: Filter configuration
  - `AppState`: Global application state

## Data Flow

### Real-time Latency Flow
```
API Route (/api/latency)
  ↓
useLatencyData Hook (SWR)
  ↓
WorldMap Component
  ↓
3D Visualization (Connections)
```

### Historical Data Flow
```
User Selects Exchange
  ↓
useHistoricalLatency Hook (SWR)
  ↓
API Route (/api/latency/historical)
  ↓
LatencyChart Component
  ↓
Recharts Visualization
```

### Filter Flow
```
User Interaction (ControlPanel)
  ↓
Zustand Store (setFilters)
  ↓
WorldMap Component (useMemo)
  ↓
Filtered Visualization
```

## Performance Optimizations

### 1. Code Splitting
- Dynamic imports for WorldMap (client-side only)
- Next.js automatic code splitting

### 2. Memoization
- `useMemo` for expensive calculations (filtering, coordinate conversion)
- React.memo for components (if needed)

### 3. Data Fetching
- SWR for efficient caching and revalidation
- Conditional fetching (only when needed)

### 4. 3D Rendering
- Efficient Three.js scene graph
- Optimized geometry (appropriate detail levels)
- Conditional rendering (only visible elements)

### 5. State Management
- Zustand for minimal re-renders
- Selective subscriptions

## Security Considerations

### API Routes
- Input validation
- Error handling
- Rate limiting (future enhancement)

### Client-side
- XSS prevention (React default)
- No sensitive data in client code
- Secure localStorage usage

## Scalability

### Current Limitations
- Mock data (limited to predefined exchanges)
- Client-side filtering (could be server-side for large datasets)

### Future Enhancements
- Server-side filtering
- Pagination for large datasets
- WebSocket for real-time updates
- Caching layer (Redis)
- Database for historical data

## Testing Strategy

### Unit Tests
- Utility functions
- Data transformations
- State management

### Integration Tests
- API routes
- Component interactions
- Data flow

### E2E Tests
- User workflows
- 3D interactions
- Filter combinations

## Deployment

### Build Process
1. TypeScript compilation
2. Next.js optimization
3. Static page generation (where possible)
4. API route bundling

### Environment
- Node.js 18+
- No additional runtime dependencies
- Vercel-optimized

## Monitoring & Analytics

### Recommended Metrics
- API response times
- 3D rendering performance
- User interactions
- Error rates

### Tools
- Vercel Analytics
- Sentry (error tracking)
- Custom performance monitoring

## Future Architecture Considerations

### Microservices
- Separate API service
- Real-time service (WebSocket)
- Analytics service

### Database
- PostgreSQL for historical data
- Redis for caching
- Time-series database (InfluxDB)

### Infrastructure
- CDN for static assets
- Edge functions for API routes
- Load balancing

---

**Last Updated**: 2025-01-22

