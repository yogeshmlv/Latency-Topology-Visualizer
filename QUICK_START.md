# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### Basic Navigation
- **Rotate Globe**: Click and drag
- **Zoom**: Scroll or pinch
- **Select Exchange**: Click on red markers
- **View Chart**: Click an exchange to see historical data

### Control Panel Features
- **Search**: Type to filter exchanges
- **Filters**: Select specific exchanges or cloud providers
- **Latency Range**: Adjust min/max latency sliders
- **Time Range**: Choose 1h, 24h, 7d, or 30d
- **Theme Toggle**: Switch between dark/light mode

### Color Coding
- 🟢 **Green**: Excellent latency (< 50ms)
- 🟡 **Yellow**: Good latency (50-150ms)
- 🔴 **Red**: Poor latency (> 150ms)

## 📊 Understanding the Visualization

### Exchange Markers
- Red spheres represent crypto exchange servers
- Click to select and view details
- Selected markers turn blue

### Cloud Regions
- Smaller markers show AWS, GCP, Azure regions
- Toggle visibility in control panel

### Latency Connections
- Curved lines connect exchanges
- Color indicates latency quality
- Filter by latency range

### Historical Charts
- Appears when exchange is selected
- Shows time-series latency data
- Displays min/max/average statistics

## 🔧 Development Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production Server
npm start

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Map Not Loading
- Check browser console for errors
- Ensure WebGL is enabled
- Try Chrome or Firefox

### Data Not Updating
- Check network tab
- Verify API routes are accessible
- Check browser console

### Build Errors
- Clear `.next` folder
- Delete `node_modules` and reinstall
- Check Node.js version (18+)

## 📝 Next Steps

1. **Customize Data**: Edit `lib/data.ts` to add exchanges
2. **API Integration**: Update API routes with real endpoints
3. **Styling**: Modify Tailwind classes for custom themes
4. **Features**: Add new functionality in components

---

**Happy Coding! 🎉**

