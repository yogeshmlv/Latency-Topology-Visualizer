# Latency Topology Visualizer

A production-grade Next.js 16 application for visualizing real-time and historical latency data between crypto exchange server locations on an interactive 3D world map.

## 🚀 Features

- **3D World Map Visualization**: Interactive globe using Three.js and react-three-fiber
- **Real-time Latency Data**: Live updates of latency between exchange servers
- **Historical Charts**: Time-series visualization using Recharts
- **Exchange Server Markers**: Visual markers for major crypto exchanges (Binance, OKX, Bybit, Deribit, etc.)
- **Cloud Region Visualization**: AWS, GCP, and Azure region markers
- **Animated Connections**: Color-coded latency connections (green/yellow/red)
- **Advanced Filtering**: Filter by exchange, cloud provider, latency range
- **Dark/Light Mode**: Theme switching with persistent preferences
- **Responsive Design**: Mobile-optimized interface
- **Performance Optimized**: Efficient 3D rendering and state management

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Utilities**: date-fns, clsx, tailwind-merge

## 📦 Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd latency-topology-visualizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
latency-topology-visualizer/
├── app/
│   ├── api/
│   │   └── latency/
│   │       ├── route.ts              # Real-time latency API
│   │       └── historical/
│   │           └── route.ts          # Historical latency API
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Main page component
│   └── globals.css                    # Global styles
├── components/
│   ├── WorldMap.tsx                   # 3D globe component
│   ├── ControlPanel.tsx               # Filters and controls
│   ├── LatencyChart.tsx               # Historical charts
│   └── ThemeProvider.tsx              # Theme management
├── hooks/
│   ├── useLatencyData.ts              # Real-time data hook
│   └── useHistoricalLatency.ts       # Historical data hook
├── lib/
│   ├── data.ts                        # Exchange and cloud region data
│   └── utils.ts                       # Utility functions
├── store/
│   └── useAppStore.ts                 # Zustand global store
└── types/
    └── index.ts                       # TypeScript type definitions
```

## 🎯 Architecture

### Component Architecture

1. **WorldMap Component**: 
   - Renders 3D globe using react-three-fiber
   - Displays exchange markers and cloud regions
   - Shows animated latency connections
   - Handles user interactions (click, hover)

2. **ControlPanel Component**:
   - Provides filtering options
   - Search functionality
   - Theme toggle
   - Time range selection
   - Play/pause controls

3. **LatencyChart Component**:
   - Displays historical latency data
   - Shows min/max/average statistics
   - Responsive chart visualization

### State Management

- **Zustand Store**: Global application state
  - Theme preferences
  - Filter settings
  - Selected exchange
  - Play/pause state
  - Time range selection

### Data Flow

1. **Real-time Data**: 
   - SWR hook fetches from `/api/latency`
   - Auto-refreshes every 5 seconds
   - Updates 3D map connections

2. **Historical Data**:
   - Fetched when exchange is selected
   - Time range configurable (1h, 24h, 7d, 30d)
   - Displayed in chart component

### API Routes

- **GET `/api/latency`**: Returns real-time latency data between all exchange pairs
- **GET `/api/latency/historical?from={id}&to={id}&timeRange={range}`**: Returns historical time-series data

## 🎨 Features in Detail

### 3D Visualization

- **Globe Rendering**: Spherical Earth with wireframe overlay
- **Exchange Markers**: Color-coded spheres at server locations
- **Cloud Regions**: Smaller markers for cloud provider regions
- **Latency Connections**: Curved lines connecting exchanges with color-coded latency
- **Interactivity**: Click markers to select, hover for details, orbit controls

### Filtering System

- **Exchange Filter**: Select specific exchanges to display
- **Cloud Provider Filter**: Filter by AWS, GCP, Azure
- **Latency Range**: Set min/max latency thresholds
- **Visibility Toggles**: Show/hide cloud regions and connections

### Color Coding

- **Green** (`< 50ms`): Excellent latency
- **Yellow** (`50-150ms`): Good latency
- **Red** (`> 150ms`): Poor latency

## 🔧 Configuration

### Environment Variables

Currently, the application uses mock data. To integrate with real APIs:

1. Create a `.env.local` file:
   ```env
   CLOUDFLARE_RADAR_API_KEY=your_api_key_here
   ```

2. Update API routes to use real endpoints

### Customization

- **Exchange Servers**: Edit `lib/data.ts` to add/modify exchange locations
- **Cloud Regions**: Update `CLOUD_REGIONS` array in `lib/data.ts`
- **Styling**: Modify Tailwind classes or `globals.css`
- **Refresh Interval**: Change in `hooks/useLatencyData.ts`

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Environment Setup

- Node.js 18+ required
- No additional build configuration needed

## 📊 Performance Optimizations

1. **Dynamic Imports**: WorldMap loaded client-side only
2. **Memoization**: React.useMemo for expensive calculations
3. **SWR Caching**: Efficient data fetching and caching
4. **Three.js Optimization**: Efficient 3D rendering
5. **Code Splitting**: Automatic with Next.js

## 🐛 Troubleshooting

### 3D Map Not Rendering

- Ensure WebGL is enabled in browser
- Check browser console for errors
- Try different browser (Chrome/Firefox recommended)

### Data Not Updating

- Check network tab for API calls
- Verify API routes are working
- Check browser console for errors

### Theme Not Persisting

- Clear browser localStorage
- Check Zustand persist configuration

## 📝 Future Enhancements

- [ ] Real-time API integration (Cloudflare Radar)
- [ ] More exchange servers
- [ ] Export data functionality
- [ ] Comparison mode (multiple exchanges)
- [ ] Alert system for latency spikes
- [ ] Custom time range selection
- [ ] Geographic region grouping
- [ ] Performance metrics dashboard

## 📄 License

This project is created for GoQuant. All rights reserved.

## 👥 Credits

Built with:
- Next.js Team
- Three.js Community
- React Three Fiber
- Zustand
- Recharts
- Tailwind CSS

---

**Built with ❤️ for GoQuant**
# Latency-Topology-Visualizer
